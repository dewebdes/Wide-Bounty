using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebSocket4Net;
using WindowsInput;
using System.Configuration;
using WindowsInput.Native;


namespace WinAutoPilot.Agent
{
    internal static class Native
    {
        public const int SW_SHOW = 5;

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
        public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        [DllImport("user32.dll", CharSet = CharSet.Unicode)]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

        [DllImport("user32.dll")]
        public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        [DllImport("user32.dll")]
        public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, UIntPtr dwExtraInfo);

        [DllImport("user32.dll")]
        public static extern bool SetCursorPos(int X, int Y);

        public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        public const uint MOUSEEVENTF_LEFTUP = 0x0004;

        [StructLayout(LayoutKind.Sequential)]
        public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
    }

    // Global state
    public static class GS
    {
        public static volatile bool Found;
        public static string TargetId = "";
        public static string SessionId = "";
        public static IntPtr ChromeHwnd = IntPtr.Zero;
    }

    // CDP client (very lightweight)
    public class CdpClient : IDisposable
    {
        private readonly WebSocket _ws;
        private readonly Dictionary<int, TaskCompletionSource<JObject>> _pending = new();
        private int _id;

        public CdpClient(string endpoint)
        {
            _ws = new WebSocket(endpoint);
            _ws.MessageReceived += (s, e) =>
            {
                var msg = JObject.Parse(e.Message);
                if (msg["id"] != null)
                {
                    int id = msg["id"].Value<int>();
                    if (_pending.TryGetValue(id, out var tcs))
                    {
                        tcs.TrySetResult(msg);
                        _pending.Remove(id);
                    }
                }
                // CDP events (we don't need for MVP)
            };
            _ws.Open();
            WaitReady();
        }

        private void WaitReady()
        {
            int maxWait = 50;
            while (_ws.State != WebSocketState.Open && maxWait-- > 0)
            {
                Thread.Sleep(100);
            }
            if (_ws.State != WebSocketState.Open)
                throw new Exception("CDP WebSocket not open.");
        }

        private Task<JObject> SendAsync(string method, object parameters = null)
        {
            var id = Interlocked.Increment(ref _id);
            var tcs = new TaskCompletionSource<JObject>(TaskCreationOptions.RunContinuationsAsynchronously);
            _pending[id] = tcs;
            var payload = new
            {
                id,
                method,
                @params = parameters
            };
            _ws.Send(JsonConvert.SerializeObject(payload));
            return tcs.Task;
        }

        public async Task<JArray> ListTargetsAsync()
        {
            var resp = await SendAsync("Target.getTargets");
            return (JArray)resp["result"]?["targetInfos"] ?? new JArray();
        }

        public async Task<string> AttachAsync(string targetId)
        {
            var resp = await SendAsync("Target.attachToTarget", new { targetId, flatten = true });
            return resp["result"]?["sessionId"]?.Value<string>() ?? "";
        }

        public async Task<JObject> EvaluateAsync(string expr)
        {
            return await SendAsync("Runtime.evaluate", new { expression = expr, returnByValue = false });
        }

        public async Task<int> GetNodeIdAsync(string selector)
        {
            var doc = await SendAsync("DOM.getDocument", new { depth = 1, pierce = true });
            int rootId = doc["result"]?["root"]?["nodeId"]?.Value<int>() ?? 0;
            var q = await SendAsync("DOM.querySelector", new { nodeId = rootId, selector });
            return q["result"]?["nodeId"]?.Value<int>() ?? 0;
        }

        public async Task<(int x, int y)> GetCenterAsync(int nodeId)
        {
            var box = await SendAsync("DOM.getBoxModel", new { nodeId });
            var model = box["result"]?["model"] as JObject;
            if (model == null) return (0, 0);

            var content = (JArray)model["content"];
            // content has 8 numbers: x1,y1,x2,y2,x3,y3,x4,y4
            // We'll compute center as average of points
            var pts = content.Select(v => v.Value<int>()).ToArray();
            int cx = (pts[0] + pts[2] + pts[4] + pts[6]) / 4;
            int cy = (pts[1] + pts[3] + pts[5] + pts[7]) / 4;
            return (cx, cy);
        }

        public void Dispose()
        {
            try { _ws.Close(); } catch { /* ignore */ }
        }
    }

    public class WindowWatcher
    {
        private readonly string _title;
        private readonly bool _exact;
        private readonly TimeSpan _interval;
        private readonly CancellationToken _ct;

        public WindowWatcher(string title, bool exact, TimeSpan interval, CancellationToken ct)
        {
            _title = title; _exact = exact; _interval = interval; _ct = ct;
        }

        public Task StartAsync()
        {
            return Task.Run(async () =>
            {
                while (!_ct.IsCancellationRequested)
                {
                    try
                    {
                        // Find Chrome window handle (best-effort)
                        GS.ChromeHwnd = FindChromeWindowByTitle(_title, _exact);

                        // CDP: list targets and find the tab by title
                        using var cdp = new CdpClient("ws://127.0.0.1:9222/devtools/browser");
                        var targets = await cdp.ListTargetsAsync();

                        // page targets have type "page"
                        var page = targets
                            .FirstOrDefault(t =>
                            {
                                var type = t["type"]?.Value<string>();
                                var title = t["title"]?.Value<string>() ?? "";
                                bool byTitle = _exact
                                    ? string.Equals(title, _title, StringComparison.OrdinalIgnoreCase)
                                    : title.IndexOf(_title, StringComparison.OrdinalIgnoreCase) >= 0;
                                return type == "page" && byTitle;
                            });

                        if (page != null)
                        {
                            GS.TargetId = page["targetId"]?.Value<string>() ?? "";
                            GS.SessionId = ""; // we attach later when needed
                            GS.Found = true;
                            Console.WriteLine($"[watcher] tab found: {GS.TargetId} (chrome hwnd: {GS.ChromeHwnd})");
                        }
                        else
                        {
                            GS.Found = false;
                            GS.TargetId = "";
                            GS.SessionId = "";
                            Console.WriteLine("[watcher] tab not found.");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[watcher][error] {ex.Message}");
                        GS.Found = false;
                    }

                    await Task.Delay(_interval, _ct);
                }
            }, _ct);
        }

        private static IntPtr FindChromeWindowByTitle(string needle, bool exact)
        {
            IntPtr found = IntPtr.Zero;
            Native.EnumWindows((hWnd, lParam) =>
            {
                var title = new StringBuilder(1024);
                Native.GetWindowText(hWnd, title, title.Capacity);

                var cls = new StringBuilder(256);
                Native.GetClassName(hWnd, cls, cls.Capacity);

                bool isChromeClass = cls.ToString().StartsWith("Chrome", StringComparison.OrdinalIgnoreCase);
                if (!isChromeClass) return true;

                var t = title.ToString();
                bool match = exact
                    ? string.Equals(t, needle, StringComparison.OrdinalIgnoreCase)
                    : t.IndexOf(needle, StringComparison.OrdinalIgnoreCase) >= 0;

                if (match)
                {
                    found = hWnd;
                    return false;
                }
                return true;
            }, IntPtr.Zero);
            return found;
        }
    }

    public class Controller
    {
        private readonly TimeSpan _interval;
        private readonly CancellationToken _ct;
        private readonly InputSimulator _input = new InputSimulator();


        public Controller(TimeSpan interval, CancellationToken ct)
        {
            _interval = interval; _ct = ct;
        }

        public Task StartAsync()
        {
            return Task.Run(async () =>
            {
                while (!_ct.IsCancellationRequested)
                {
                    try
                    {
                        if (GS.Found && GS.ChromeHwnd != IntPtr.Zero)
                        {
                            FocusChrome(GS.ChromeHwnd);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[controller][error] {ex.Message}");
                    }
                    await Task.Delay(_interval, _ct);
                }
            }, _ct);
        }

        public void FocusChrome(IntPtr hWnd)
        {
            Native.ShowWindow(hWnd, Native.SW_SHOW);
            Native.SetForegroundWindow(hWnd);
        }

        public void ClickAtScreen(int x, int y)
        {
            Native.SetCursorPos(x, y);
            Thread.Sleep(60);
            Native.mouse_event(Native.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
            Thread.Sleep(50);
            Native.mouse_event(Native.MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
        }

        public void TypeHuman(string text)
        {
            foreach (char c in text)
            {
                _input.Keyboard.TextEntry(c);
                Thread.Sleep(10);
            }
        }

        // Core action: find DOM nodes, convert positions, click+type
        public async Task ExecuteTypeViaCdpAsync(string selectorTextarea, string selectorButton, string text)
        {
            if (!GS.Found || string.IsNullOrEmpty(GS.TargetId) || GS.ChromeHwnd == IntPtr.Zero)
            {
                Console.WriteLine("[controller] tab/window not available.");
                return;
            }

            FocusChrome(GS.ChromeHwnd);
            Thread.Sleep(120);

            using var pageCdp = new CdpClient($"ws://127.0.0.1:9222/devtools/page/{GS.TargetId}");

            // Resolve elements
            int nodeTextarea = await pageCdp.GetNodeIdAsync(selectorTextarea);
            int nodeButton = await pageCdp.GetNodeIdAsync(selectorButton);
            if (nodeTextarea == 0)
            {
                Console.WriteLine("[controller] textarea not found.");
                return;
            }
            if (nodeButton == 0)
            {
                Console.WriteLine("[controller] button not found.");
                return;
            }

            // Get centers (page coordinates)
            var (tx, ty) = await pageCdp.GetCenterAsync(nodeTextarea);
            var (bx, by) = await pageCdp.GetCenterAsync(nodeButton);

            // Convert page coords -> screen coords via window rect
            if (!Native.GetWindowRect(GS.ChromeHwnd, out var rect))
            {
                Console.WriteLine("[controller] cannot get window rect.");
                return;
            }

            // Heuristic offsets for Chrome: window rect includes frame; page content is inside.
            // For MVP, tune these offsets manually by small values.
            int chromeFrameOffsetX = 8;   // left border + some margin
            int chromeFrameOffsetY = 120; // title bar + tab strip + toolbar approximate

            int screenTx = rect.Left + chromeFrameOffsetX + tx;
            int screenTy = rect.Top + chromeFrameOffsetY + ty;
            int screenBx = rect.Left + chromeFrameOffsetX + bx;
            int screenBy = rect.Top + chromeFrameOffsetY + by;

            Console.WriteLine($"[controller] textarea screen pos: {screenTx},{screenTy}");
            Console.WriteLine($"[controller] button   screen pos: {screenBx},{screenBy}");

            // Human-like interaction
            ClickAtScreen(screenTx, screenTy);
            Thread.Sleep(150);
            TypeHuman(text);
            Thread.Sleep(120);
            ClickAtScreen(screenBx, screenBy);
        }
    }

    internal class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("WinAutoPilot Agent (CDP-assisted) started.");
            Console.WriteLine("Commands:");
            Console.WriteLine("- type::\"your text here\"   (targets textarea[0] and a button selector)");
            Console.WriteLine("- exit");

            var cts = new CancellationTokenSource();

            // Watcher: exact vs contains
            string tit = ConfigurationManager.AppSettings["WindowTitle"];
            var watcher = new WindowWatcher(title: tit, exact: false, interval: TimeSpan.FromMilliseconds(1000), ct: cts.Token);
            var controller = new Controller(interval: TimeSpan.FromMilliseconds(800), ct: cts.Token);

            var watcherTask = watcher.StartAsync();
            var controllerTask = controller.StartAsync();

            // Console loop
            while (true)
            {
                var line = Console.ReadLine();
                if (line == null) continue;

                if (line.StartsWith("type::", StringComparison.OrdinalIgnoreCase))
                {
                    var payload = ExtractQuoted(line);
                    if (string.IsNullOrEmpty(payload))
                    {
                        Console.WriteLine("[console] invalid type command. use: type::\"text\"");
                        continue;
                    }

                    // DOM selectors (adjust as needed)
                    string textareaSelector = "textarea"; // document.getElementsByTagName('textarea')[0]
                    string buttonSelector = "button";     // tune to the actual button

                    await controller.ExecuteTypeViaCdpAsync(textareaSelector, buttonSelector, payload);
                }
                else if (line.Equals("exit", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine("[console] exiting...");
                    cts.Cancel();
                    break;
                }
                else
                {
                    Console.WriteLine("[console] unknown command.");
                }
            }

            await Task.WhenAll(watcherTask, controllerTask);
        }

        static string ExtractQuoted(string input)
        {
            int first = input.IndexOf('\"');
            int last = input.LastIndexOf('\"');
            if (first >= 0 && last > first)
                return input.Substring(first + 1, last - first - 1);
            return string.Empty;
        }
    }
}
