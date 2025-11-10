import struct
import zipfile
import io
import zlib
from PIL import Image

def create_text_chunk(key, value):
    data = key.encode() + b'\x00' + value.encode()
    length = struct.pack(">I", len(data))
    chunk_type = b'tEXt'
    crc = struct.pack(">I", zlib.crc32(chunk_type + data) & 0xffffffff)
    return length + chunk_type + data + crc

def embed_text_payload(base_file, output_name, key, value):
    with open(base_file, 'rb') as f:
        png = f.read()
    iend_index = png.rfind(b'IEND')
    new_chunk = create_text_chunk(key, value)
    modified = png[:iend_index-4] + new_chunk + png[iend_index-4:]
    with open(output_name, 'wb') as f:
        f.write(modified)

def embed_stego_payload(output_name, message):
    img = Image.new('RGB', (100, 100), color='white')
    pixels = img.load()
    bits = ''.join(format(ord(c), '08b') for c in message)
    for i in range(len(bits)):
        x, y = i % 100, i // 100
        r, g, b = pixels[x, y]
        r = (r & ~1) | int(bits[i])
        pixels[x, y] = (r, g, b)
    img.save(output_name)

def create_polyglot_png_zip(output_name, zip_payload):
    img = Image.new('RGB', (10, 10), color='black')
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    png_data = buffer.getvalue()

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zf:
        zf.writestr('payload.txt', zip_payload)
    zip_data = zip_buffer.getvalue()

    with open(output_name, 'wb') as f:
        f.write(png_data + zip_data)

def mutate_existing_png(source_file, output_name, key, value):
    with open(source_file, 'rb') as f:
        png = f.read()
    iend_index = png.rfind(b'IEND')
    new_chunk = create_text_chunk(key, value)
    modified = png[:iend_index-4] + new_chunk + png[iend_index-4:]
    with open(output_name, 'wb') as f:
        f.write(modified)

# 🧙 Ritual begins
if __name__ == "__main__":
    base_file = input("Enter base PNG filename (e.g. test.png): ").strip()
    base_name = base_file.rsplit('.', 1)[0]
    suffix = "2"

    embed_text_payload(base_file, f"{base_name}{suffix}_text.png", "Comment", "diagnostic ping")
    embed_stego_payload(f"{base_name}{suffix}_stego.png", "diagnostic ping")
    create_polyglot_png_zip(f"{base_name}{suffix}_polyglot.png", "diagnostic ping")
    mutate_existing_png(base_file, f"{base_name}{suffix}_mutated.png", "Author", "diagnostic ping")

    print("🧪 Payload variants generated:")
    print(f"- {base_name}{suffix}_text.png")
    print(f"- {base_name}{suffix}_stego.png")
    print(f"- {base_name}{suffix}_polyglot.png")
    print(f"- {base_name}{suffix}_mutated.png")
