"""Unifont (GNU, OFL) auf benötigte Schriftsysteme reduzieren und als TTF speichern."""
from fontTools import subset
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
import sys
G = r"X:\Sprachreise\Pokemon Essentials v21.1 2023-07-30 (1)\Pokemon Essentials v21.1 2023-07-30"
ranges = [(0x20, 0x7E), (0xA0, 0x24F), (0x2000, 0x206F), (0x20AC, 0x20AC), (0x2190, 0x21FF), (0x25A0, 0x25FF),
          (0x2600, 0x266F), (0x0400, 0x04FF), (0x0600, 0x06FF), (0xFB50, 0xFDFF), (0xFE70, 0xFEFF)]
unicodes = [u for a, b in ranges for u in range(a, b + 1)]
opts = subset.Options(); opts.layout_features = []; opts.name_IDs = ['*']; opts.notdef_outline = True
f = TTFont("unifont.otf")
s = subset.Subsetter(opts); s.populate(unicodes=unicodes); s.subset(f)
# CFF -> TrueType-Outlines
glyphOrder = f.getGlyphOrder(); gs = f.getGlyphSet()
glyf = {}
for name in glyphOrder:
    pen = TTGlyphPen(gs)
    gs[name].draw(Cu2QuPen(pen, 1.0, reverse_direction=True))
    glyf[name] = pen.glyph()
f["loca"] = newTable("loca")
f["glyf"] = g = newTable("glyf"); g.glyphOrder = glyphOrder; g.glyphs = glyf
del f["CFF "]
f["maxp"] = newTable("maxp"); m = f["maxp"]; m.tableVersion = 0x00010000
for k in ("maxZones", "maxTwilightPoints", "maxStorage", "maxFunctionDefs", "maxInstructionDefs",
          "maxStackElements", "maxSizeOfInstructions", "maxComponentElements"):
    setattr(m, k, 0)
m.maxZones = 1
f["head"].glyphDataFormat = 0
f["post"].formatType = 2.0; f["post"].extraNames = []; f["post"].mapping = {}
f.sfntVersion = "\x00\x01\x00\x00"
# An »Power Green« angleichen: gleiche Grundlinie und Größe bei gleicher Schriftgröße
# (54 Einheiten pro Geviert -> bei Größe 27 genau 2 Bildpunkte pro Unifont-Pixel)
f["head"].unitsPerEm = 54
f["hhea"].ascent = 59; f["hhea"].descent = -14; f["hhea"].lineGap = 0
os2 = f["OS/2"]
os2.sTypoAscender = 59; os2.sTypoDescender = -14; os2.sTypoLineGap = 0
os2.usWinAscent = 59; os2.usWinDescent = 14
# Familienname eindeutig setzen
for rec in f["name"].names:
    if rec.nameID in (1, 4, 16):
        rec.string = "SR Unifont"
    if rec.nameID == 6:
        rec.string = "SRUnifont"
f.save(G + r"\Fonts\SR Unifont.ttf")
cm = TTFont(G + r"\Fonts\SR Unifont.ttf").getBestCmap()
print("ok glyphs", len(cm))
