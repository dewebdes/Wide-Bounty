import socket

def send_raw_packet():
    # Prompt for packet filename
    packet_filename = input("Enter the packet filename (e.g., packet_ready.txt): ").strip()

    try:
        # Read raw request from file
        with open(packet_filename, "rb") as f:
            raw_request = f.read()
    except FileNotFoundError:
        print(f"File '{packet_filename}' not found.")
        return

    # Extract host from request (basic parsing)
    try:
        host_line = [line for line in raw_request.decode(errors='ignore').split("\n") if line.lower().startswith("host:")][0]
        host = host_line.split(":", 1)[1].strip()
    except Exception:
        print("Could not extract Host header.")
        return

    # Connect to target server
    try:
        with socket.create_connection((host, 443)) as sock:
            # Wrap in SSL
            import ssl
            context = ssl.create_default_context()
            with context.wrap_socket(sock, server_hostname=host) as ssock:
                ssock.sendall(raw_request)

                # Receive response
                response = b""
                while True:
                    chunk = ssock.recv(4096)
                    if not chunk:
                        break
                    response += chunk
    except Exception as e:
        print(f"Connection error: {e}")
        return

    # Save response to file
    response_filename = f"{packet_filename}_response.txt"
    try:
        with open(response_filename, "wb") as f:
            f.write(response)
        print(f"Response saved to: {response_filename}")
    except Exception as e:
        print(f"Error saving response: {e}")

send_raw_packet()
