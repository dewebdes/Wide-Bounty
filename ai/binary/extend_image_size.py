import os

def get_user_input():
    filename = input("Enter image filename (jpg/jpeg/png): ").strip()
    target_size_mb = float(input("Enter target size in MB: "))
    return filename, int(target_size_mb * 1024 * 1024)

def get_extension(filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.jpg', '.jpeg']:
        return 'jpeg'
    elif ext == '.png':
        return 'png'
    else:
        raise ValueError("Unsupported file type. Use jpg, jpeg, or png.")

def extend_image(filename, target_size):
    with open(filename, 'rb') as f:
        original_data = f.read()

    current_size = len(original_data)
    if current_size >= target_size:
        print("Image already meets or exceeds target size.")
        return

    extension = get_extension(filename)

    # Determine safe append point
    if extension == 'jpeg':
        marker = b'\xFF\xD9'  # JPEG EOI
        split_index = original_data.rfind(marker) + 2
    elif extension == 'png':
        marker = b'IEND'
        split_index = original_data.find(marker.encode()) + 8
    else:
        split_index = len(original_data)

    # Create padded tail
    padding_size = target_size - current_size
    tail = b'\x00' * padding_size

    new_data = original_data[:split_index] + tail

    new_filename = f"{os.path.splitext(filename)[0]}_{target_size // (1024*1024)}MB{os.path.splitext(filename)[1]}"
    with open(new_filename, 'wb') as f:
        f.write(new_data)

    print(f"Extended image saved as: {new_filename}")

if __name__ == "__main__":
    try:
        fname, tsize = get_user_input()
        extend_image(fname, tsize)
    except Exception as e:
        print(f"Error: {e}")
