import subprocess
import socket
import ssl
import platform
import sys
import time

def banner(title):
    print("\n" + "="*60)
    print(title)
    print("="*60)

def test_ping(ip):
    banner("ICMP PING TEST")
    try:
        system = platform.system().lower()
        if system == "windows":
            cmd = ["ping", "-n", "3", "-w", "3000", ip]
        else:
            cmd = ["ping", "-c", "3", "-W", "3", ip]

        # Use Popen with timeout to prevent freezing
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW if system == "windows" else 0
        )
        
        try:
            stdout, stderr = process.communicate(timeout=10)
            print(stdout)
            
            if process.returncode == 0:
                print("[OK] Ping successful")
            else:
                print("[FAIL] Ping blocked or unreachable")
                
        except subprocess.TimeoutExpired:
            process.kill()
            print("[TIMEOUT] Ping test took too long")
            
    except Exception as e:
        print(f"[ERROR] {e}")

def test_tcp(ip, port):
    print(f"\nTesting TCP port {port}...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)
    try:
        sock.connect((ip, port))
        print(f"[OK] TCP {port} reachable")
        return True
    except socket.timeout:
        print(f"[TIMEOUT] TCP {port} connection timeout")
    except ConnectionRefusedError:
        print(f"[FAIL] TCP {port} connection refused")
    except Exception as e:
        print(f"[ERROR] TCP {port} error: {e}")
    finally:
        try:
            sock.close()
        except:
            pass
    return False

def test_udp_dns():
    banner("UDP TEST (DNS Query to 8.8.8.8)")
    try:
        # Simple UDP DNS query without external dependencies
        dns_query = b'\xaa\xaa\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00\x06google\x03com\x00\x00\x01\x00\x01'
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(5)
        sock.sendto(dns_query, ('8.8.8.8', 53))
        
        try:
            data, addr = sock.recvfrom(1024)
            if data:
                print("[OK] UDP DNS response received")
            else:
                print("[FAIL] No DNS response")
        except socket.timeout:
            print("[TIMEOUT] UDP DNS query timeout")
        finally:
            sock.close()
            
    except Exception as e:
        print(f"[ERROR] UDP DNS test failed: {e}")

def test_http(ip):
    banner("HTTP TEST (port 80)")
    if not test_tcp(ip, 80):
        print("[SKIP] HTTP test - port 80 not reachable")
        return
    
    try:
        # Simple HTTP request without requests module
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((ip, 80))
        
        request = f"HEAD / HTTP/1.1\r\nHost: {ip}\r\nConnection: close\r\n\r\n"
        sock.send(request.encode())
        
        response = b""
        try:
            while True:
                chunk = sock.recv(1024)
                if not chunk:
                    break
                response += chunk
        except socket.timeout:
            pass
            
        if response:
            # Check for HTTP response
            if b'HTTP/' in response[:20]:
                status_line = response.split(b'\r\n')[0].decode('ascii', errors='ignore')
                print(f"[OK] HTTP reachable: {status_line}")
            else:
                print("[OK] Service responding on port 80")
        else:
            print("[FAIL] No HTTP response")
            
        sock.close()
        
    except Exception as e:
        print(f"[ERROR] HTTP test failed: {e}")

def test_tls(ip):
    banner("TLS HANDSHAKE TEST (port 443)")
    if not test_tcp(ip, 443):
        print("[SKIP] TLS test - port 443 not reachable")
        return
    
    try:
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        sock = socket.create_connection((ip, 443), timeout=5)
        with context.wrap_socket(sock, server_hostname=ip) as ssock:
            print(f"[OK] TLS handshake successful")
            print(f"     Protocol: {ssock.version()}")
            print(f"     Cipher: {ssock.cipher()[0]}")
            
    except ssl.SSLError as e:
        print(f"[FAIL] SSL error: {e}")
    except socket.timeout:
        print("[TIMEOUT] TLS handshake timeout")
    except Exception as e:
        print(f"[ERROR] TLS test failed: {e}")

def test_dns_resolution():
    banner("DNS RESOLUTION TEST")
    try:
        # Try system DNS resolution
        ip = socket.gethostbyname('google.com')
        print(f"[OK] DNS resolution works: google.com -> {ip}")
    except socket.gaierror as e:
        print(f"[FAIL] DNS resolution failed: {e}")

def test_traceroute(ip):
    banner("TRACEROUTE TEST")
    
    system = platform.system().lower()
    if system == "windows":
        cmd = ["tracert", "-d", "-h", "15", "-w", "1000", ip]
    else:
        cmd = ["traceroute", "-m", "15", "-w", "1", ip]
    
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=subprocess.CREATE_NO_WINDOW if system == "windows" else 0
        )
        
        try:
            # Read output line by line to show progress
            print("Starting traceroute (first 5 hops)...")
            lines_shown = 0
            max_lines = 7  # Show only first few lines
            
            while True:
                line = process.stdout.readline()
                if not line and process.poll() is not None:
                    break
                    
                if line:
                    print(line.rstrip())
                    lines_shown += 1
                    if lines_shown >= max_lines:
                        print("\n[INFO] Showing first 5 hops only. Press Ctrl+C to continue.")
                        process.kill()
                        break
                        
        except KeyboardInterrupt:
            process.kill()
            print("\n[Traceroute interrupted by user]")
            
    except FileNotFoundError:
        print("[SKIP] Traceroute command not found")
    except Exception as e:
        print(f"[ERROR] Traceroute failed: {e}")

def main():
    print("Network Diagnostic Tool")
    print("="*60)
    
    # Get target IP
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = input("Enter target IP or hostname: ").strip()
    
    if not target:
        print("No target specified. Exiting.")
        return
    
    print(f"\nTesting connectivity to: {target}")
    
    # Run tests
    test_ping(target)
    test_tcp(target, 80)
    test_tcp(target, 443)
    test_tcp(target, 22)
    test_udp_dns()
    test_http(target)
    test_tls(target)
    test_dns_resolution()
    test_traceroute(target)
    
    print("\n" + "="*60)
    print("All tests completed.")
    print("="*60)

if __name__ == "__main__":
    try:
        main()
        # Keep console open on Windows
        if platform.system() == "Windows":
            input("\nPress Enter to exit...")
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
        if platform.system() == "Windows":
            input("\nPress Enter to exit...")