import sys, shutil; sys.path.insert(0,'tools')
from maplib import *
from rubymarshal.classes import UserDef
A = r"X:/Sprachreise/Asset-Downloads/"
OUT_NAME = "SR Deutschland"
outside = Image.open(G+"/Graphics/Tilesets/Outside.png").convert('RGBA')
station = Image.open(A+"da_sammlung/Train-Station-876100255.png").convert('RGBA')
train   = Image.open(A+"da_sammlung/Pokemon-gen-3-style-magnet-train-tileset-1078581786.png").convert('RGBA')
dom     = Image.open(A+"da_sammlung/Gen-3-Cathedral-Koelner-Dom-1009069474.png").convert('RGBA')
def rows(im): return (im.height + 31)//32
parts = [("outside", outside), ("station", station), ("train", train), ("dom", dom)]
offs = {}; r = 0
for n, im in parts:
    offs[n] = r; r += rows(im)
total_rows = r
img = Image.new('RGBA', (256, total_rows*32), (0,0,0,0))
for n, im in parts:
    img.alpha_composite(im, (0, offs[n]*32))
# rote X-Platzhalterzellen der Vorlagen transparent machen
def clear(part, r, c):
    y = (offs[part] + r) * 32
    img.paste(Image.new('RGBA', (32, 32), (0, 0, 0, 0)), (c * 32, y))
for (r, c) in [(10, 0), (11, 4), (12, 4), (15, 6), (15, 7), (16, 6), (16, 7)]:
    clear('station', r, c)
for r in range(3):
    for c in range(2):
        clear('train', r, c)
img.save(G+"/Graphics/Tilesets/"+OUT_NAME+".png")
print("rows", total_rows, offs)
# autotiles
shutil.copy(A+"1377_Pokemon_Gaia_Tileset/Autotiles/City3.png", G+"/Graphics/Autotiles/SR Strasse.png")
shutil.copy(A+"1377_Pokemon_Gaia_Tileset/Autotiles/City1.png", G+"/Graphics/Autotiles/SR Gehweg.png")
autos = ["Sea", "SR Strasse", "SR Gehweg", "Flowers1", "Still water", "Brick path", "Fountain1"]

tss = L("Tilesets.rxdata")
src = tss[1].attributes
sp = parse_table(src['@passages'])[0,0]; spr = parse_table(src['@priorities'])[0,0]; stt = parse_table(src['@terrain_tags'])[0,0]
n = 384 + total_rows*8
pas = np.zeros(n, np.int32); pri = np.zeros(n, np.int32); ter = np.zeros(n, np.int32)
# autotile slots: copy from tileset-1 slot of same name, else defaults
src_autos = [s(x) for x in src['@autotile_names']]
for i, a in enumerate(autos):
    lo = 48*(i+1)
    if a in src_autos:
        j = src_autos.index(a); slo = 48*(j+1)
        pas[lo:lo+48] = sp[slo:slo+48]; pri[lo:lo+48] = spr[slo:slo+48]; ter[lo:lo+48] = stt[slo:slo+48]
    elif a == "Still water":
        pas[lo:lo+48] = 0x0f
    # roads / pavements stay passable
# outside rows
pas[384:384+offs['station']*8] = sp[384:384+offs['station']*8]
pri[384:384+offs['station']*8] = spr[384:384+offs['station']*8]
ter[384:384+offs['station']*8] = stt[384:384+offs['station']*8]
def tid(part, r, c): return 384 + (offs[part]+r)*8 + c
def opaque_frac(r0, c):
    t = img.crop((c*32, r0*32, c*32+32, r0*32+32)); a = np.array(t)[:,:,3]
    return (a > 0).mean()
# station: everything blocks except floor tiles
station_pass = [(0,c) for c in range(3,8)] + [(1,c) for c in range(2,7)] + \
               [(r,c) for r in (5,6) for c in range(0,5)] + [(r,c) for r in (7,8) for c in range(0,3)]
for r in range(rows(station)):
    for c in range(8):
        t = tid('station', r, c)
        pas[t] = 0 if (r,c) in station_pass else 0x0f
for part in ('train', 'dom'):
    im = dict(parts)[part]
    for r in range(rows(im)):
        for c in range(8):
            t = tid(part, r, c)
            pas[t] = 0x0f if opaque_frac(offs[part]+r, c) > 0.02 else 0
# Dom: upper rows of the towers draw above the player
for r in range(0, 6):
    for c in range(8):
        t = tid('dom', r, c)
        if pas[t]: pri[t] = 1
new = RubyObject("RPG::Tileset", {
    '@id': 24, '@name': "SR Deutschland", '@tileset_name': OUT_NAME,
    '@autotile_names': autos, '@panorama_name': "", '@panorama_hue': 0,
    '@fog_name': "", '@fog_hue': 0, '@fog_opacity': 64, '@fog_blend_type': 0,
    '@fog_zoom': 200, '@fog_sx': 0, '@fog_sy': 0, '@battleback_name': "",
    '@passages': None, '@priorities': None, '@terrain_tags': None})
def mk(arr):
    u = UserDef("Table"); u._private_data = build_table(arr); return u
new.attributes['@passages'] = mk(pas); new.attributes['@priorities'] = mk(pri); new.attributes['@terrain_tags'] = mk(ter)
# keep key order like originals
order = list(src.keys())
new.attributes = {k: new.attributes[k] for k in order}
tss[24] = new
save("Tilesets.rxdata", tss)
import json; json.dump(offs, open("tools/ts_offsets.json","w"))
print("ok", n)
