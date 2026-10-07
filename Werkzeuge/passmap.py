import sys; sys.path.insert(0,'tools')
from maplib import *
from PIL import ImageDraw
mid=int(sys.argv[1])
m=L("Map%03d.rxdata"%mid).attributes
tsname, autos, ts = tileset_info(m['@tileset_id'])
pas=parse_table(ts['@passages'])[0,0]; pri=parse_table(ts['@priorities'])[0,0]
d=parse_table(m['@data'])
im=render(d, tsname, autos)
dr=ImageDraw.Draw(im,'RGBA')
H,W=d.shape[1],d.shape[2]
def passable(x,y):
    for z in (2,1,0):
        t=int(d[z,y,x])
        if pas[t] & 0x0f == 0x0f: return False
        if t and pri[t]==0: return True
    return True
for y in range(H):
    for x in range(W):
        if not passable(x,y):
            dr.rectangle((x*32,y*32,x*32+31,y*32+31), fill=(255,0,0,90))
for e in m['@events'].values():
    a=e.attributes; dr.rectangle((a['@x']*32+4,a['@y']*32+4,a['@x']*32+27,a['@y']*32+27), outline=(0,255,255,255), width=2)
im.convert('RGB').save(sys.argv[2])
