import sys, os
sys.path.insert(0, 'tools')
from maplib import *
from PIL import ImageDraw, ImageFont
FONT = G + "/Fonts/power green.ttf"
SMALL = G + "/Fonts/power green small.ttf"
m = L("Map081.rxdata").attributes
tsname, autos, _ = tileset_info(m['@tileset_id'])
d = parse_table(m['@data'])
full = render(d, tsname, autos)
bg = full.crop((5*32, 0, 5*32 + 512, 384)).convert('RGBA')
# Himmel/Abdunklung oben und unten
ov = Image.new('RGBA', (512, 384), (0, 0, 0, 0))
dr = ImageDraw.Draw(ov)
for y in range(384):
    a = 0
    if y < 150: a = int(170 * (1 - y / 150) ** 1.2)
    if y > 250: a = int(200 * ((y - 250) / 134))
    dr.line((0, y, 512, y), fill=(16, 20, 40, a))
bg.alpha_composite(ov)

def pixel_text(text, font_path, size, scale, color, shadow):
    f = ImageFont.truetype(font_path, size)
    l, t, r, b = f.getbbox(text)
    w, h = r - l + 2, b - t + 2
    layer = Image.new('RGBA', (w + 2, h + 2), (0, 0, 0, 0))
    dd = ImageDraw.Draw(layer)
    dd.text((1 - l + 1, 1 - t + 1), text, font=f, fill=shadow)
    dd.text((1 - l, 1 - t), text, font=f, fill=color)
    return layer.resize((layer.width * scale, layer.height * scale), Image.NEAREST)

title = pixel_text("SPRACHREISE", FONT, 16, 4, (255, 255, 255, 255), (30, 30, 50, 255))
bg.alpha_composite(title, ((512 - title.width) // 2, 22))
# Deutschlandfarben-Linie
bar_y = 22 + title.height + 4
for i, c in enumerate([(0, 0, 0), (221, 0, 0), (255, 206, 0)]):
    ImageDraw.Draw(bg).rectangle((96, bar_y + i * 4, 416, bar_y + i * 4 + 3), fill=c + (255,))
sub = pixel_text("Deutsch von A2 bis B1", FONT, 16, 2, (255, 230, 150, 255), (20, 20, 30, 255))
bg.alpha_composite(sub, ((512 - sub.width) // 2, bar_y + 18))
tag = pixel_text("Eine Reise durch Deutschland - und seine Formulare", SMALL, 16, 1, (230, 232, 245, 255), (10, 10, 20, 255))
bg.alpha_composite(tag, ((512 - tag.width) // 2, 340))
bg.save(G + "/Graphics/Titles/title.png")
# "Taste drücken"-Zeile (512x10 wie das Original)
st = Image.new('RGBA', (512, 10), (0, 0, 0, 0))
t = pixel_text("ENTER DRÜCKEN", SMALL, 10, 1, (240, 240, 240, 255), (60, 60, 60, 255))
t = t.crop((0, 0, t.width, min(10, t.height)))
st.alpha_composite(t, ((512 - t.width) // 2, 0))
st.save(G + "/Graphics/Titles/start.png")
print("ok", title.size, t.size)
