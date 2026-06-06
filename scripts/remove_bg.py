#!/usr/bin/env python3
"""Remove black background from AHK logo — makes black pixels transparent."""
from PIL import Image
import sys, os

src = sys.argv[1] if len(sys.argv) > 1 else "/Users/ahk/Downloads/1.jpg"
dst = sys.argv[2] if len(sys.argv) > 2 else "/Users/ahk/Downloads/MyPortfolio-main/public/ahk-logo.png"

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

threshold = 60  # pixels darker than this (per channel) become transparent

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3
        if brightness < threshold:
            pixels[x, y] = (r, g, b, 0)   # fully transparent

img.save(dst, "PNG")
print(f"✅ Saved transparent logo → {dst}")
print(f"   Size: {w}x{h}")
