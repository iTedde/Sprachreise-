from PIL import Image, ImageDraw
import json, os
G = r"X:\Sprachreise\Pokemon Essentials v21.1 2023-07-30 (1)\Pokemon Essentials v21.1 2023-07-30"
OUT = G + r"\Graphics\UI\Sprachreise"
os.makedirs(OUT, exist_ok=True)
border = [(8.3,55.05),(8.66,54.91),(9.4,54.83),(9.9,54.79),(10.0,54.55),(10.2,54.42),(10.9,54.35),(11.1,54.15),(10.85,53.95),(11.5,54.08),(12.1,54.18),(12.5,54.47),(13.1,54.58),(13.45,54.62),(13.7,54.3),(14.25,53.92),(14.4,53.3),(14.12,52.85),(14.6,52.6),(14.75,52.07),(14.6,51.6),(15.03,51.1),(14.8,50.85),(14.3,51.05),(13.5,50.65),(12.9,50.4),(12.3,50.25),(12.1,50.3),(12.5,49.9),(12.4,49.7),(13.0,49.3),(13.4,49.0),(13.85,48.75),(13.45,48.57),(13.0,48.27),(12.75,47.95),(13.0,47.47),(12.2,47.62),(11.6,47.58),(10.98,47.42),(10.45,47.55),(10.2,47.3),(9.68,47.55),(9.0,47.67),(8.6,47.8),(8.4,47.6),(7.6,47.58),(7.55,48.0),(7.8,48.6),(8.2,48.97),(7.6,49.05),(7.0,49.15),(6.36,49.47),(6.5,49.8),(6.1,50.15),(6.4,50.3),(6.08,50.77),(6.0,51.1),(5.95,51.8),(6.8,51.95),(7.0,52.25),(7.05,52.6),(7.2,53.0),(7.2,53.3),(7.0,53.6),(7.9,53.72),(8.3,53.55),(8.58,53.55),(8.7,53.87),(8.9,54.0),(8.6,54.35),(8.9,54.5),(8.6,54.9)]
rhein = [(7.6,47.6),(8.2,49.0),(8.45,49.5),(8.27,50.0),(7.6,50.36),(7.1,50.73),(6.96,50.94),(6.78,51.23),(6.6,51.8),(6.1,51.85)]
elbe = [(14.25,50.85),(13.74,51.05),(12.9,51.6),(11.85,51.95),(11.6,52.15),(11.0,52.95),(10.6,53.35),(9.99,53.55),(8.9,53.85)]
main_ = [(10.0,50.0),(9.15,49.95),(8.68,50.11),(8.27,50.0)]
donau = [(8.5,47.95),(10.0,48.4),(11.4,48.75),(12.1,49.0),(13.45,48.57)]
CITIES = {"berlin": (13.40,52.52,"Berlin"), "hamburg": (9.99,53.55,"Hamburg"), "koeln": (6.96,50.94,"Köln"),
          "duesseldorf": (6.78,51.23,"Düsseldorf"), "frankfurt": (8.68,50.11,"Frankfurt"),
          "muenchen": (11.58,48.14,"München"), "dresden": (13.74,51.05,"Dresden")}
W, H = 512, 384
OX, OY, KX, KY = 26, 22, 26.5, 42.5
LON0, LAT0 = 5.8, 55.1
def P(lon, lat): return (OX + (lon - LON0) * KX, OY + (LAT0 - lat) * KY)
S = 2  # supersample then pixelate
img = Image.new("RGB", (W*S, H*S), (88, 152, 216))
d = ImageDraw.Draw(img)
# Wellenmuster im Meer
for y in range(0, H*S, 24):
    for x in range((y//24 % 2)*12, W*S, 24):
        d.line((x, y, x+8, y), fill=(104, 168, 228), width=2)
# Nachbarländer angedeutet
d.rectangle((0, 0, W*S, H*S), outline=None)
poly = [(x*S, y*S) for x, y in (P(*p) for p in border)]
# Nachbarland-Fläche (grau-grün) unter Deutschland
d.polygon([(0, 150*S), (40*S, 120*S), (24*S, 0), (W*S, 0), (W*S, H*S), (0, H*S)], fill=(168, 184, 150))
# Nord-/Ostsee wieder blau
d.polygon([(0, 0), (int(P(10.0,55.4)[0]*S), 0), (int(P(10.2,54.42)[0]*S), int(P(10.2,54.42)[1]*S)), (int(P(14.4,54.3)[0]*S), int(P(14.4,54.3)[1]*S)), (int(P(15.5,55.4)[0]*S), 0), (int(P(15.5,55.4)[0]*S), int(P(15.5,54.0)[1]*S)), (int(P(14.25,53.9)[0]*S), int(P(14.25,53.92)[1]*S)), (int(P(9.0,53.8)[0]*S), int(P(9.0,53.8)[1]*S)), (int(P(7.0,53.6)[0]*S), int(P(7.0,53.6)[1]*S)), (0, int(P(5.8,53.4)[1]*S))], fill=(88, 152, 216))
d.polygon(poly, fill=(120, 196, 104), outline=(40, 72, 40))
d.line(poly + [poly[0]], fill=(40, 72, 40), width=4)
for river in (rhein, elbe, main_, donau):
    pts = [(x*S, y*S) for x, y in (P(*p) for p in river)]
    d.line(pts, fill=(72, 136, 208), width=4)
img = img.resize((W, H), Image.NEAREST)
# rechte Infotafel
d = ImageDraw.Draw(img)
d.rectangle((300, 0, W, H), fill=(36, 44, 64))
d.rectangle((300, 0, 303, H), fill=(0, 0, 0))
d.rectangle((304, 0, 306, H), fill=(221, 0, 0))
d.rectangle((307, 0, 309, H), fill=(255, 206, 0))
img.save(OUT + r"\deutschland.png")
coords = {k: [round(P(lon, lat)[0]), round(P(lon, lat)[1])] for k, (lon, lat, n) in CITIES.items()}
print(json.dumps(coords))
