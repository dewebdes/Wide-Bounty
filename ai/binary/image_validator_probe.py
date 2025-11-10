import os

def create_corrupted_exif_jpeg(filename="corrupted_exif.jpg"):
    from PIL import Image
    img = Image.new("RGB", (100, 100), color="red")
    img.save(filename, "JPEG", exif=b"corrupted_exif")
    print(f"[+] Created corrupted EXIF JPEG: {filename}")

def create_fake_jpeg(filename="fake_header.jpg"):
    with open(filename, "wb") as f:
        f.write(b"\xFF\xD8" + b"\x00" * 1000 + b"\xFF\xD9")
    print(f"[+] Created fake JPEG with valid SOI/EOI: {filename}")

def create_polyglot_jpeg(filename="polyglot.jpg"):
    html_payload = b"<html><body><h1>Not an image</h1></body></html>"
    with open(filename, "wb") as f:
        f.write(b"\xFF\xD8" + html_payload + b"\xFF\xD9")
    print(f"[+] Created JPEG with embedded HTML payload: {filename}")

def create_nonstandard_png(filename="nonstandard_chunk.png"):
    from PIL import Image
    img = Image.new("RGB", (100, 100), color="blue")
    img.save(filename, "PNG")
    with open(filename, "ab") as f:
        f.write(b"\x00\x00\x00\x0A" + b"zTXt" + b"customchunk")
    print(f"[+] Appended non-standard chunk to PNG: {filename}")

def create_bmp(filename="test.bmp"):
    from PIL import Image
    img = Image.new("RGB", (100, 100), color="green")
    img.save(filename, "BMP")
    print(f"[+] Created BMP file: {filename}")

def create_tiff(filename="test.tiff"):
    from PIL import Image
    img = Image.new("RGB", (100, 100), color="purple")
    img.save(filename, "TIFF")
    print(f"[+] Created TIFF file: {filename}")

if __name__ == "__main__":
    create_corrupted_exif_jpeg()
    create_fake_jpeg()
    create_polyglot_jpeg()
    create_nonstandard_png()
    create_bmp()
    create_tiff()
