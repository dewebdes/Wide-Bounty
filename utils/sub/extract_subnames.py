# extract_subnames.py
def extract_sub_parts(fqdn):
    parts = fqdn.strip().split(".")
    return parts[:-2] if len(parts) > 2 else []

subname_set = set()

# Step 1: Load existing 24m.txt
with open("24m.txt", "r", encoding="utf-8") as f:
    for line in f:
        subname_set.add(line.strip())

# Step 2: Extract sub-names from subs.txt
with open("subs.txt", "r", encoding="utf-8") as f:
    for line in f:
        sub_parts = extract_sub_parts(line)
        subname_set.update(sub_parts)

# Step 3: Save final distinct list
with open("25m.txt", "w", encoding="utf-8") as f:
    for name in sorted(subname_set):
        f.write(name + "\n")
