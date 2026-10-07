import struct, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from rx import *
from PIL import Image
import numpy as np
AP = [
    [[27, 28, 33, 34], [5, 28, 33, 34], [27,  6, 33, 34], [5,  6, 33, 34],
     [27, 28, 33, 12], [5, 28, 33, 12], [27,  6, 33, 12], [5,  6, 33, 12]],
    [[27, 28, 11, 34], [5, 28, 11, 34], [27,  6, 11, 34], [5,  6, 11, 34],
     [27, 28, 11, 12], [5, 28, 11, 12], [27,  6, 11, 12], [5,  6, 11, 12]],
    [[25, 26, 31, 32], [25,  6, 31, 32], [25, 26, 31, 12], [25,  6, 31, 12],
     [15, 16, 21, 22], [15, 16, 21, 12], [15, 16, 11, 22], [15, 16, 11, 12]],
    [[29, 30, 35, 36], [29, 30, 11, 36], [5, 30, 35, 36], [5, 30, 11, 36],
     [39, 40, 45, 46], [5, 40, 45, 46], [39,  6, 45, 46], [5,  6, 45, 46]],
    [[25, 30, 31, 36], [15, 16, 45, 46], [13, 14, 19, 20], [13, 14, 19, 12],
     [17, 18, 23, 24], [17, 18, 11, 24], [41, 42, 47, 48], [5, 42, 47, 48]],
    [[37, 38, 43, 44], [37,  6, 43, 44], [13, 18, 19, 24], [13, 14, 43, 44],
     [37, 42, 43, 48], [17, 18, 47, 48], [13, 18, 43, 48], [1,  2,  7,  8]]]
N2I = [46,44,46,44,43,41,43,40,46,44,46,44,43,41,43,40,42,32,42,32,35,19,35,18,42,32,42,32,34,17,34,16,46,44,46,44,43,41,43,40,46,44,46,44,43,41,43,40,42,32,42,32,35,19,35,18,42,32,42,32,34,17,34,16,45,39,45,39,33,31,33,29,45,39,45,39,33,31,33,29,37,27,37,27,23,15,23,13,37,27,37,27,22,11,22,9,45,39,45,39,33,31,33,29,45,39,45,39,33,31,33,29,36,26,36,26,21,7,21,5,36,26,36,26,20,3,20,1,46,44,46,44,43,41,43,40,46,44,46,44,43,41,43,40,42,32,42,32,35,19,35,18,42,32,42,32,34,17,34,16,46,44,46,44,43,41,43,40,46,44,46,44,43,41,43,40,42,32,42,32,35,19,35,18,42,32,42,32,34,17,34,16,45,38,45,38,33,30,33,28,45,38,45,38,33,30,33,28,37,25,37,25,23,14,23,12,37,25,37,25,22,10,22,8,45,38,45,38,33,30,33,28,45,38,45,38,33,30,33,28,36,24,36,24,21,6,21,4,36,24,36,24,20,2,20,0]

def parse_table(ud):
    b = bytes(ud._private_data)
    dim, xs, ys, zs, n = struct.unpack('<5i', b[:20])
    arr = np.frombuffer(b[20:20+2*n], dtype='<i2').astype(np.int32)
    return arr.reshape((zs, ys, xs))  # [z][y][x]

def build_table(arr):
    if arr.ndim == 1: zs, ys, xs, dim = 1, 1, arr.shape[0], 1
    elif arr.ndim == 2: zs, (ys, xs), dim = 1, arr.shape, 2
    else: (zs, ys, xs), dim = arr.shape, 3
    n = xs*ys*zs
    return struct.pack('<5i', dim, xs, ys, zs, n) + arr.astype('<i2').tobytes()

_cache = {}
def img(path):
    if path not in _cache:
        _cache[path] = Image.open(path).convert('RGBA') if os.path.exists(path) else None
    return _cache[path]

def autotile_img(name, pat):
    im = img(G+"/Graphics/Autotiles/"+name+".png")
    if im is None: return None
    out = Image.new('RGBA', (32,32))
    if im.height == 32:   # single-tile autotile
        out.paste(im.crop((0,0,32,32)),(0,0)); return out
    q = AP[pat >> 3][pat & 7]
    for i, t in enumerate(q):
        t -= 1
        sx, sy = (t % 6)*16, (t//6)*16
        out.paste(im.crop((sx,sy,sx+16,sy+16)), ((i%2)*16, (i//2)*16))
    return out

def tile_img(tsname, autos, tid):
    if tid < 48: return None
    if tid < 384:
        a = tid//48 - 1
        if not autos[a]: return None
        return autotile_img(autos[a], tid % 48)
    t = tid - 384
    im = img(G+"/Graphics/Tilesets/"+tsname+".png")
    return im.crop(((t%8)*32, (t//8)*32, (t%8)*32+32, (t//8)*32+32))

def tileset_info(tid):
    ts = L("Tilesets.rxdata")[tid].attributes
    return s(ts['@tileset_name']), [s(x) for x in ts['@autotile_names']], ts

def render(data, tsname, autos, events=None, grid=False):
    zs, ys, xs = data.shape
    out = Image.new('RGBA', (xs*32, ys*32), (0,0,0,255))
    for z in range(zs):
        for y in range(ys):
            for x in range(xs):
                ti = tile_img(tsname, autos, int(data[z,y,x]))
                if ti: out.alpha_composite(ti, (x*32, y*32))
    if events:
        from PIL import ImageDraw
        d = ImageDraw.Draw(out)
        for (ex, ey, label) in events:
            d.rectangle((ex*32+2, ey*32+2, ex*32+29, ey*32+29), outline=(255,0,0,255), width=2)
            d.text((ex*32+3, ey*32+3), label[:6], fill=(255,255,0,255))
    if grid:
        from PIL import ImageDraw
        d = ImageDraw.Draw(out)
        for x in range(0, xs, 5): d.line((x*32,0,x*32,ys*32), fill=(255,0,255,120))
        for y in range(0, ys, 5): d.line((0,y*32,xs*32,y*32), fill=(255,0,255,120))
    return out
