"""Ausschnitt einer Essentials-Karte mit Koordinaten rendern: py view.py MAP x0 y0 x1 y1 out.png [scale]"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "Sprachreise_Werkzeuge"))
from maplib import *
from PIL import ImageDraw
mid = int(sys.argv[1]); x0, y0, x1, y1 = map(int, sys.argv[2:6]); out = sys.argv[6]
sc = float(sys.argv[7]) if len(sys.argv) > 7 else 1.0
m = L("Map%03d.rxdata" % mid).attributes
tsname, autos, _ = tileset_info(m['@tileset_id'])
d = parse_table(m['@data'])[:, y0:y1, x0:x1]
im = render(d, tsname, autos)
im = im.resize((int(im.width * sc), int(im.height * sc)))
T = 32 * sc
big = Image.new('RGBA', (im.width + 24, im.height + 14), (40, 40, 40, 255)); big.alpha_composite(im, (24, 14))
dr = ImageDraw.Draw(big)
for i in range(x1 - x0):
    if (x0 + i) % 2 == 0: dr.text((24 + i * T + 1, 1), str(x0 + i), fill=(255, 255, 0, 255))
    dr.line((24 + i * T, 14, 24 + i * T, big.height), fill=(0, 255, 255, 60))
for j in range(y1 - y0):
    dr.text((1, 14 + j * T + T / 3), str(y0 + j), fill=(255, 255, 0, 255))
    dr.line((24, 14 + j * T, big.width, 14 + j * T), fill=(0, 255, 255, 60))
big.convert('RGB').save(out)
