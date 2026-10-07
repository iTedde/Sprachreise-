"""Erzeugt die Fensterrahmen (Essentials-Skinformat: 48x48, 16 px Rand, Mitte wird gestreckt)."""
from PIL import Image, ImageDraw
G = r"X:\Sprachreise\Pokemon Essentials v21.1 2023-07-30 (1)\Pokemon Essentials v21.1 2023-07-30"
NAVY = (44, 52, 80, 255)

def skin(path, fill, inner, border=NAVY, shadow=(0, 0, 0, 60)):
    S = 4  # Supersampling für saubere Rundungen, dann pixelgenau verkleinern
    im = Image.new("RGBA", (48 * S, 48 * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # weicher Schatten unten
    d.rounded_rectangle((2 * S, 4 * S, 47 * S - 1, 48 * S - 1), radius=8 * S, fill=shadow)
    d.rounded_rectangle((1 * S, 1 * S, 46 * S - 1, 45 * S - 1), radius=8 * S, fill=border)
    d.rounded_rectangle((3 * S, 3 * S, 44 * S - 1, 43 * S - 1), radius=6 * S, fill=fill)
    im = im.resize((48, 48), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    # feine Innenlinie (nur an den Rändern, Mitte bleibt einfarbig)
    for x in range(8, 40):
        im.putpixel((x, 4), inner)
    im.save(path)

skin(G + r"\Graphics\Windowskins\SR Text.png", (252, 251, 246, 255), (255, 255, 255, 255))
skin(G + r"\Graphics\Windowskins\SR Menue.png", (244, 247, 252, 255), (255, 255, 255, 255))
print("ok")
