def inject_binary_into_packet():
    import os

    # Prompt for image filename
    image_filename = input("Enter the image filename (e.g., image.jpg): ")

    # Read binary content of the image
    try:
        with open(image_filename, "rb") as img_file:
            binary_data = img_file.read()
    except FileNotFoundError:
        print(f"Image file '{image_filename}' not found.")
        return

    # Read packet template
    try:
        with open("packet.txt", "r", encoding="utf-8") as packet_file:
            packet_template = packet_file.read()
    except FileNotFoundError:
        print("packet.txt not found in the current directory.")
        return

    # Replace placeholder with raw binary
    if "{{binary}}" not in packet_template:
        print("No '{{binary}}' placeholder found in packet.txt.")
        return

    # Combine header and binary safely
    try:
        with open("packet_ready.txt", "wb") as output_file:
            # Split at placeholder and write parts + binary
            before, after = packet_template.split("{{binary}}", 1)
            output_file.write(before.encode("utf-8"))
            output_file.write(binary_data)
            output_file.write(after.encode("utf-8"))
        print("Binary injected successfully into packet_ready.txt")
    except Exception as e:
        print(f"Error writing output: {e}")

inject_binary_into_packet()
