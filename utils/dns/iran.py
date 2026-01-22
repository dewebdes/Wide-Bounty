#!/usr/bin/env python3
import subprocess
import socket
import sys
import platform
import time
import ipaddress
import random
import requests
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock

# ---------- Configuration ----------
TARGETS_FILE = "targets.txt"
WHITE_IPS_FILE = "white_ips.txt"
RESUME_FILE = "scan_resume.txt"
MAX_WORKERS = 10 #0
TCP_PORTS = [80, 443, 22]
PING_COUNT = "3" if platform.system() != "Windows" else "1"
TCP_TIMEOUT = 2
PING_TIMEOUT = 1
HEARTBEAT_INTERVAL = 60  # Send heartbeat every 60 seconds
HEARTBEAT_URLS = [
    "http://www.google.com/generate_204",
    "http://www.cloudflare.com/cdn-cgi/trace",
    "http://www.apple.com/library/test/success.html"
]
# -----------------------------------

class ScanResumeManager:
    """Manages saving and loading scan resume state."""
    
    @staticmethod
    def save_resume_state(cidr_index, last_ip_index=None):
        """Save current scan position to resume file."""
        try:
            # Don't save negative indices
            if cidr_index < 0:
                cidr_index = 0
            with open(RESUME_FILE, "w") as f:
                f.write(f"{cidr_index}\n")
                if last_ip_index is not None:
                    f.write(f"{last_ip_index}\n")
        except Exception as e:
            print(f"WARNING: Could not save resume state: {e}")
    
    @staticmethod
    def load_resume_state():
        """Load saved scan position from resume file."""
        try:
            with open(RESUME_FILE, "r") as f:
                lines = f.read().strip().splitlines()
                if len(lines) >= 1:
                    cidr_index = int(lines[0])
                    # Don't allow negative indices
                    if cidr_index < 0:
                        cidr_index = 0
                    last_ip_index = int(lines[1]) if len(lines) > 1 else 0
                    return cidr_index, last_ip_index
        except FileNotFoundError:
            return 0, 0  # Start from beginning if no resume file
        except Exception as e:
            print(f"WARNING: Could not load resume state: {e}")
        return 0, 0
    
    @staticmethod
    def clear_resume_state():
        """Clear resume state (call when scan is complete)."""
        try:
            import os
            if os.path.exists(RESUME_FILE):
                os.remove(RESUME_FILE)
        except Exception:
            pass

class TrafficNormalizer:
    """Creates background traffic to prevent network idle detection."""
    
    def __init__(self):
        self.last_heartbeat = 0
        self.heartbeat_lock = Lock()
    
    def send_heartbeat(self):
        """Send a normal-looking HTTP request to prevent network idle."""
        try:
            url = random.choice(HEARTBEAT_URLS)
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=5)
            return response.status_code
        except Exception:
            return None
    
    def check_and_send_heartbeat(self):
        """Check if it's time to send heartbeat and send if needed."""
        current_time = time.time()
        with self.heartbeat_lock:
            if current_time - self.last_heartbeat > HEARTBEAT_INTERVAL:
                self.last_heartbeat = current_time
                # Send heartbeat in background thread to not block scanning
                import threading
                threading.Thread(target=self.send_heartbeat, daemon=True).start()
                return True
        return False

def get_ping_command(ip):
    """Return OS-specific ping command."""
    system = platform.system()
    if system == "Windows":
        return ["ping", "-n", PING_COUNT, "-w", str(PING_TIMEOUT * 1000), ip]
    else:  # Linux, macOS, etc.
        return ["ping", "-c", PING_COUNT, "-W", str(PING_TIMEOUT), ip]

def test_ping(ip):
    """Test ICMP connectivity with timeout."""
    try:
        cmd = get_ping_command(ip)
        result = subprocess.run(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=PING_TIMEOUT * int(PING_COUNT) + 1
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, Exception):
        return False

def test_tcp(ip, port):
    """Test TCP port connectivity with timeout."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(TCP_TIMEOUT)
    try:
        s.connect((ip, port))
        s.close()
        return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False
    except Exception:
        return False
    finally:
        try:
            s.close()
        except:
            pass

def classify_ip(ip, white_ips_lock, traffic_normalizer=None):
    """Test an IP and return classification with immediate white IP saving."""
    
    # Check for heartbeat before scanning
    if traffic_normalizer:
        traffic_normalizer.check_and_send_heartbeat()
    
    ping_ok = test_ping(ip)
    
    tcp_80_ok = test_tcp(ip, 80)
    tcp_443_ok = test_tcp(ip, 443)
    tcp_22_ok = test_tcp(ip, 22)
    
    # Classification logic
    if tcp_80_ok and tcp_443_ok:
        classification = "white"
        # Immediately write to white_ips.txt
        with white_ips_lock:
            with open(WHITE_IPS_FILE, "a") as f:
                f.write(f"{ip}\n")
    elif ping_ok or tcp_80_ok or tcp_443_ok or tcp_22_ok:
        classification = "gray"
    else:
        classification = "black"
    
    return classification

def scan_cidr(cidr_range, max_workers, traffic_normalizer=None, resume_ip_index=0, current_cidr_index=0):
    """Scan all IPs in a CIDR range and return counts."""
    try:
        network = ipaddress.ip_network(cidr_range, strict=False)
        all_ips = [str(ip) for ip in network.hosts()]
    except ValueError as e:
        print(f"  ERROR: Invalid CIDR {cidr_range}: {e}")
        return 0, 0, 0, 0
    
    total_ips = len(all_ips)
    if total_ips == 0:
        print(f"  WARNING: No usable IPs in {cidr_range}")
        return 0, 0, 0, 0
    
    # Ensure resume_ip_index is not None and is integer
    if resume_ip_index is None:
        resume_ip_index = 0
    else:
        try:
            resume_ip_index = int(resume_ip_index)
        except (ValueError, TypeError):
            resume_ip_index = 0
    
    # Handle resume position within CIDR
    if resume_ip_index > 0 and resume_ip_index < total_ips:
        print(f"  Resuming from IP {resume_ip_index + 1}/{total_ips} in this range")
        all_ips = all_ips[resume_ip_index:]
        start_ip_index = resume_ip_index
    else:
        start_ip_index = 0
    
    remaining_ips = len(all_ips)
    white_count = 0
    gray_count = 0
    black_count = 0
    scanned_count = 0
    
    # Lock for thread-safe writing to white_ips.txt
    white_ips_lock = Lock()
    
    print(f"[{cidr_range}] Starting scan of {remaining_ips} IPs ({start_ip_index + 1}-{total_ips})...")
    
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all IPs for scanning
        future_to_ip = {
            executor.submit(classify_ip, ip, white_ips_lock, traffic_normalizer): ip 
            for ip in all_ips
        }
        
        # Process completed futures
        for future in as_completed(future_to_ip):
            scanned_count += 1
            ip = future_to_ip[future]
            current_absolute_index = start_ip_index + scanned_count
            
            try:
                classification = future.result(timeout=TCP_TIMEOUT * len(TCP_PORTS) + PING_TIMEOUT * int(PING_COUNT))
                
                # Update counters based on classification
                if classification == "white":
                    white_count += 1
                elif classification == "gray":
                    gray_count += 1
                else:  # black
                    black_count += 1
                
                # Print progress every 10% or at least every 10 IPs
                progress_interval = max(10, remaining_ips // 10)
                if scanned_count % progress_interval == 0 or scanned_count == remaining_ips:
                    percentage = (scanned_count / remaining_ips) * 100
                    print(f"[{cidr_range}] IP {current_absolute_index}/{total_ips} ({percentage:.1f}%) | "
                          f"white={white_count} gray={gray_count} black={black_count}")
                    
                    # Update resume file with current CIDR index and IP index
                    ScanResumeManager.save_resume_state(current_cidr_index, current_absolute_index)
                
                # Periodic heartbeat check
                if traffic_normalizer and scanned_count % 50 == 0:
                    traffic_normalizer.check_and_send_heartbeat()
                    
            except Exception as e:
                # Count as black on any error
                black_count += 1
                print(f"  ERROR scanning {ip}: {e}")
    
    duration = time.time() - start_time
    print(f"[{cidr_range}] DONE in {duration:.1f}s | "
          f"white={white_count} gray={gray_count} black={black_count}")
    
    return white_count, gray_count, black_count, remaining_ips

def main():
    """Main scanning function."""
    print("=" * 60)
    print("CIDR Network Scanner")
    print(f"Max workers per CIDR: {MAX_WORKERS}")
    print(f"Target file: {TARGETS_FILE}")
    print(f"White IPs output: {WHITE_IPS_FILE} (appending)")
    print(f"Resume file: {RESUME_FILE}")
    print("=" * 60)
    
    # DO NOT clear white_ips.txt - we want to append to it
    # Just check if it exists, create if not
    if not os.path.exists(WHITE_IPS_FILE):
        print(f"Creating new {WHITE_IPS_FILE} file")
        open(WHITE_IPS_FILE, "w").close()
    else:
        # Count existing white IPs
        try:
            with open(WHITE_IPS_FILE, "r") as f:
                existing_white_ips = len([line for line in f if line.strip()])
                print(f"Found {existing_white_ips} existing white IPs in {WHITE_IPS_FILE}")
        except Exception as e:
            print(f"NOTE: Could not read existing {WHITE_IPS_FILE}: {e}")
    
    # Read CIDR ranges from file
    try:
        with open(TARGETS_FILE, "r") as f:
            cidr_ranges = [line.strip() for line in f if line.strip() and not line.startswith("#")]
    except FileNotFoundError:
        print(f"ERROR: File {TARGETS_FILE} not found!")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Could not read {TARGETS_FILE}: {e}")
        sys.exit(1)
    
    if not cidr_ranges:
        print("No CIDR ranges found in targets.txt")
        sys.exit(0)
    
    print(f"Found {len(cidr_ranges)} CIDR range(s) to scan")
    
    # Load resume state
    start_cidr_index, resume_ip_index = ScanResumeManager.load_resume_state()
    
    if start_cidr_index >= len(cidr_ranges):
        print(f"\nResume index {start_cidr_index} is beyond available CIDR ranges ({len(cidr_ranges)})")
        print("Starting from the beginning...")
        start_cidr_index = 0
        resume_ip_index = 0
    
    if start_cidr_index > 0 or resume_ip_index > 0:
        print(f"\nResuming scan from CIDR range {start_cidr_index + 1}/{len(cidr_ranges)}")
        print(f"Resuming from IP {resume_ip_index + 1} in that range")
        print()
    else:
        print("\nStarting new scan from the beginning\n")
    
    # Initialize traffic normalizer
    traffic_normalizer = TrafficNormalizer()
    
    total_white = 0
    total_gray = 0
    total_black = 0
    total_ips_scanned = 0
    
    # Send initial heartbeat
    print("Sending initial network heartbeat...")
    traffic_normalizer.send_heartbeat()
    
    # Process each CIDR range one at a time
    for i in range(start_cidr_index, len(cidr_ranges)):
        cidr_range = cidr_ranges[i]
        current_cidr_index = i  # Track current CIDR index
        
        print(f"\n--- Processing CIDR {i + 1}/{len(cidr_ranges)}: {cidr_range} ---")
        
        try:
            # Pass resume_ip_index only for the first resumed CIDR
            ip_index_to_resume = resume_ip_index if i == start_cidr_index else 0
            
            # Save current state before starting scan
            ScanResumeManager.save_resume_state(i, ip_index_to_resume)
            
            white, gray, black, scanned = scan_cidr(
                cidr_range, 
                MAX_WORKERS, 
                traffic_normalizer,
                ip_index_to_resume,
                current_cidr_index  # Pass current CIDR index
            )
            
            total_white += white
            total_gray += gray
            total_black += black
            total_ips_scanned += scanned
            
            # Clear resume_ip_index after first use
            resume_ip_index = 0
            
            # Save state for next CIDR (completed this one)
            ScanResumeManager.save_resume_state(i + 1, 0)
            
        except KeyboardInterrupt:
            print("\n\nScan interrupted by user!")
            print("Resume state saved. Run again to continue.")
            break
        except Exception as e:
            print(f"ERROR processing {cidr_range}: {e}")
            # Save state before moving to next CIDR
            ScanResumeManager.save_resume_state(i + 1, 0)
            continue
    
    # Clear resume state when scan is complete
    if start_cidr_index + len(cidr_ranges[start_cidr_index:]) == len(cidr_ranges):
        ScanResumeManager.clear_resume_state()
        print("\nScan completed successfully. Resume state cleared.")
    
    # Final summary
    print("\n" + "=" * 60)
    print("SCAN COMPLETE - FINAL SUMMARY")
    print("=" * 60)
    print(f"Total CIDR ranges processed: {len(cidr_ranges)}")
    print(f"Total IPs scanned: {total_ips_scanned}")
    print(f"White IPs found in this session: {total_white} (appended to {WHITE_IPS_FILE})")
    print(f"Gray IPs found: {total_gray}")
    print(f"Black IPs found: {total_black}")
    
    if total_white > 0:
        print(f"\nWhite IPs have been appended to {WHITE_IPS_FILE}")
        print("Format: One IP per line")

if __name__ == "__main__":
    try:
        # Check for required packages
        try:
            import requests
        except ImportError:
            print("ERROR: 'requests' package not installed.")
            print("Install it with: pip install requests")
            sys.exit(1)
            
        # Flush output immediately for nohup
        sys.stdout.flush()
        sys.stderr.flush()
            
        main()
    except KeyboardInterrupt:
        print("\n\nScan interrupted by user!")
        print("Resume state saved. Run again to continue.")
        sys.exit(0)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)