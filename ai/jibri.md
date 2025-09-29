## 🧿 GlyphCasterX: Plan B Streaming Architecture (README)

### 🔮 Overview
**GlyphCasterX** is a Windows-based ritual module that simulates a client observing Jitsi sessions, captures their visual/audio output, encodes the signal, and streams it to YouTube via RTMP. It replaces Jibri with a modular, multi-session glyph array—each glyph is a WinForms instance acting as a symbolic eye.

---

### 🧱 System Requirements
- **OS**: Windows Server 2012+ (64-bit)
- **CPU**: Xeon-class or i7/i9 with virtualization support
- **RAM**: Minimum 16 GB (4 GB per session recommended)
- **GPU**: NVIDIA or Intel with NVENC/QSV support (optional but recommended)
- **Network**: Unrestricted outbound RTMP access

---

### 🧩 Architecture

#### 1. **Session Loader**
- Each Jitsi room is loaded into a `WebBrowser` or embedded Chromium instance (e.g., CefSharp, WebView2)
- Browser is sandboxed per WinForms instance

#### 2. **Visual Capture**
- Uses `Graphics.CopyFromScreen`, `BitBlt`, or `DirectShow` to capture browser viewport
- Optional: canvas capture or `MediaRecorder` if staying within browser context

#### 3. **Audio Capture**
- Uses `WasapiLoopbackCapture` or virtual audio devices (e.g., VB-Audio Cable)
- Each session routed to its own audio channel

#### 4. **Encoding Pipeline**
- `ffmpeg` or Media Foundation encodes video/audio
- Hardware acceleration via NVENC or QSV
- Configurable bitrate, resolution, and keyframe interval

#### 5. **RTMP Stream Injector**
- Pushes encoded stream to YouTube using RTMP URL + stream key
- Each glyph has its own stream endpoint

---

### 🧠 Symbolic Mapping
- Each WinForms instance = **GlyphCaster**
- Naming schema: `GlyphCaster_A`, `GlyphCaster_B`, `GlyphCaster_C`, etc.
- Each glyph logs its lifecycle: birth (start), vision (capture), projection (stream), death (stop)

---

### 🔄 Cycle Control
- Start/stop each glyph independently
- Restart failed glyphs without affecting others
- Monitor stream health, latency, and frame rate
- Optional: symbolic dashboard with status indicators

---

### 🧪 Notes
- Plan B outperforms Jibri in multi-session scenarios
- Offers full control, symbolic clarity, and modular resilience
- Ideal for restricted environments, mythic workflows, and diagnostic rituals
