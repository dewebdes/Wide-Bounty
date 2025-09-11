#!/usr/bin/env python3
import os
import shutil
from PIL import Image

def prompt_percentage(default=7.0):
    """Prompt for white-pixel percentage threshold, fallback to default."""
    raw = input(f"Enter white-pixel percentage threshold [{default}%]: ").strip()
    if not raw:
        return default
    try:
        val = float(raw)
        if not (0 <= val <= 100):
            raise ValueError()
        return val
    except ValueError:
        print("Invalid input; using default.")
        return default

def ensure_dirs(base):
    """Ensure clean/ and busy/ subfolders exist under base."""
    clean = os.path.join(base, "clean")
    busy  = os.path.join(base, "busy")
    os.makedirs(clean, exist_ok=True)
    os.makedirs(busy, exist_ok=True)
    return clean, busy

def classify_and_move(folder, pct_thresh, clean_dir, busy_dir):
    """Move images: clean if white% ≥ threshold, else busy."""
    counts = {"clean": 0, "busy": 0}
    for fname in os.listdir(folder):
        if not fname.lower().endswith(('.png','.jpg','.jpeg')):
            continue
        src = os.path.join(folder, fname)
        img = Image.open(src).convert('L')
        w, h = img.size
        pixels = img.load()

        white = sum(1 for x in range(w) for y in range(h) if pixels[x, y] >= 250)
        total = w * h
        pct   = (white / total) * 100

        label   = "clean" if pct >= pct_thresh else "busy"
        dest    = clean_dir if label == "clean" else busy_dir
        shutil.move(src, os.path.join(dest, fname))

        counts[label] += 1
        print(f"{fname}: {pct:.2f}% white → {label}")

    return counts

def main():
    base = "shot2"
    if not os.path.isdir(base):
        print(f"Folder not found: {base}")
        return

    pct_thresh = prompt_percentage(default=50.0)
    clean_dir, busy_dir = ensure_dirs(base)
    print(f"\nThreshold set to {pct_thresh}% white pixels.\n")

    results = classify_and_move(base, pct_thresh, clean_dir, busy_dir)
    print("\nSummary:")
    print(f"  Clean images: {results['clean']}")
    print(f"  Busy images:  {results['busy']}")

if __name__ == "__main__":
    main()
