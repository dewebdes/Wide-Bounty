import struct
import os

def create_malformed_jpeg(filename):
    # Valid JPEG header + corrupted Huffman table
    data = b'\xFF\xD8'  # SOI
    data += b'\xFF\xC4' + b'\x00\x1F' + b'\x00' + b'\xFF' * 28  # Malformed DHT
    data += b'\xFF\xD9'  # EOI
    with open(filename, 'wb') as f:
        f.write(data)

def create_payload_png(filename):
    # PNG with script tag in iTXt chunk
    png_header = b'\x89PNG\r\n\x1a\n'
    ihdr = b'\x00\x00\x00\rIHDR' + b'\x00\x00\x00\x01' + b'\x00\x00\x00\x01' + b'\x08\x02\x00\x00\x00'
    ihdr += struct.pack('>I', 0)  # Dummy CRC
#    itxt = b'\x00\x00\x00\x1AiTXt' + b'script\x00\x00\x00\x00' + b'<script>alert(1)</script>'
    itxt = b'\x00\x00\x00\x1AiTXt' + b'description\x00\x00\x00\x00' + b'<p>diagnostic ping</p>'
    itxt += struct.pack('>I', 0)  # Dummy CRC
    iend = b'\x00\x00\x00\x00IEND' + struct.pack('>I', 0)
    with open(filename, 'wb') as f:
        f.write(png_header + ihdr + itxt + iend)

def create_oversized_bmp(filename):
    # BMP with huge dimensions to test memory handling
    header = b'BM' + struct.pack('<I', 70) + b'\x00\x00\x00\x00' + struct.pack('<I', 54)
    dib = struct.pack('<I', 40) + struct.pack('<i', 10000) + struct.pack('<i', 10000)
    dib += struct.pack('<H', 1) + struct.pack('<H', 24) + struct.pack('<I', 0)
    dib += struct.pack('<I', 0) * 4
    pixel_data = b'\xFF\x00\x00' * 10  # Red pixels
    with open(filename, 'wb') as f:
        f.write(header + dib + pixel_data)

def create_mime_confused_file(fake_image_name, real_exe_path):
    with open(real_exe_path, 'rb') as exe:
        payload = exe.read()
    with open(fake_image_name, 'wb') as f:
        f.write(payload)

# 🔧 Run all rituals
def run_all(exe_path):
    create_malformed_jpeg('malformed.jpg')
    create_payload_png('payload.png')
    create_oversized_bmp('oversized.bmp')
    create_mime_confused_file('confused.jpg', exe_path)
    print("🧪 All symbolic probes generated.")

# 🧙 Ritual begins
if __name__ == "__main__":
    exe_path = input("Enter path to .exe file for MIME confusion test: ")
    run_all(exe_path)
