import sys; sys.path.insert(0,'tools')
from maplib import *
from PIL import ImageDraw
mid=int(sys.argv[1]); x0,y0,x1,y1=map(int,sys.argv[2:6]); out=sys.argv[6]
m=L("Map%03d.rxdata"%mid).attributes
tsname, autos, _ = tileset_info(m['@tileset_id'])
d=parse_table(m['@data'])[:, y0:y1, x0:x1]
im=render(d, tsname, autos)
s=2; im=im.resize((im.width*s, im.height*s), Image.NEAREST)
big=Image.new('RGBA',(im.width+30, im.height+20),(40,40,40,255)); big.alpha_composite(im,(30,20))
dr=ImageDraw.Draw(big)
for i in range(x1-x0):
    dr.text((30+i*64+2, 4), str(x0+i), fill=(255,255,0,255)); dr.line((30+i*64,20,30+i*64,big.height),fill=(0,255,255,90))
for j in range(y1-y0):
    dr.text((2, 20+j*64+24), str(y0+j), fill=(255,255,0,255)); dr.line((30,20+j*64,big.width,20+j*64),fill=(0,255,255,90))
big.convert('RGB').save(out)
