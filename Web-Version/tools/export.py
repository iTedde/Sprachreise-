"""Exportiert alles, was die Web-Version braucht, nach www/:
   Karten (data/maps.js), Tilesets (img/tilesets + data/tilesets.js), Autotiles, Figuren,
   UI-Grafiken, Schrift, Soundeffekte (data/audio.js), Musik (data/bgm.js), Übersetzungen (data/lang.js).

   Alles landet in .js-Dateien (window.SR_DATA), damit das Spiel auch direkt per Doppelklick
   (file://) und in der Android-WebView ohne Webserver läuft.

   Aufruf:  py -3.12 tools/export.py            (alles)
            py -3.12 tools/export.py maps        (nur Karten + Tilesets + Figuren)
            py -3.12 tools/export.py render      (Karten-Vorschau nach tools/render/)
"""
import os, sys, json, base64, io, shutil, importlib, re

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from portmap import *                       # noqa
from PIL import Image
import numpy as np

ROOT = os.path.abspath(os.path.join(HERE, ".."))
WWW = os.path.join(ROOT, "www")
GAME = G
ASSETS = r"X:/Sprachreise/Asset-Downloads/"
OW = ASSETS + "404/Official_Gen4_OW/"

MAP_MODULES = ["maps_berlin", "maps_berlin2", "maps_koeln", "maps_reise", "maps_hamburg"]


def js_write(path, var, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("window.SR_DATA=window.SR_DATA||{};SR_DATA.%s=" % var)
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")


def load_maps():
    maps = []
    for name in MAP_MODULES:
        try:
            mod = importlib.import_module(name)
        except ModuleNotFoundError as e:
            if e.name == name:
                continue
            raise
        for f in mod.ALL:
            maps.append(f())
    ids = [m.sid for m in maps]
    dup = {i for i in ids if ids.count(i) > 1}
    assert not dup, "doppelte Karten-IDs: %s" % dup
    return maps


# ------------------------------------------------------------------------------
def export_tilesets(ts_ids):
    tsdata = L("Tilesets.rxdata")
    out = {}
    os.makedirs(WWW + "/img/tilesets", exist_ok=True)
    os.makedirs(WWW + "/img/autotiles", exist_ok=True)
    for tid in sorted(ts_ids):
        a = tsdata[tid].attributes
        name = s(a['@tileset_name'])
        autos = [s(x) for x in a['@autotile_names']]
        im = Image.open(GAME + "/Graphics/Tilesets/" + name + ".png").convert("RGBA")
        rows = im.height // 32
        chunks = []
        CH = 128   # Zeilen pro Teilbild (4096 px) – sicher für mobile Browser
        safe = re.sub(r"[^A-Za-z0-9]+", "_", name)
        for c in range(0, rows, CH):
            part = im.crop((0, c * 32, 256, min(rows, c + CH) * 32))
            fn = "%s_%d.png" % (safe, c // CH)
            part.save(WWW + "/img/tilesets/" + fn, optimize=True)
            chunks.append(fn)
        for au in autos:
            if au:
                shutil.copy(GAME + "/Graphics/Autotiles/" + au + ".png", WWW + "/img/autotiles/" + au + ".png")
        pas = parse_table(a['@passages']).reshape(-1)
        pri = parse_table(a['@priorities']).reshape(-1)
        out[tid] = {"name": name, "chunks": chunks, "rows": rows, "autotiles": autos,
                    "passages": [int(v) for v in pas], "priorities": [int(v) for v in pri]}
    js_write(WWW + "/data/tilesets.js", "tilesets", out)
    print("tilesets:", {k: v["name"] for k, v in out.items()})


def char_source(name):
    if name.startswith("OW "):
        return OW + "NPC " + name[3:] + ".png"
    if name.startswith("TR "):
        return OW + "trchar" + name[3:] + ".png"
    return GAME + "/Graphics/Characters/" + name + ".png"


def export_chars(names):
    os.makedirs(WWW + "/img/chars", exist_ok=True)
    for n in sorted(names):
        src = char_source(n)
        shutil.copy(src, WWW + "/img/chars/" + n + ".png")
    print("figuren:", len(names))


def export_maps(maps):
    js_write(WWW + "/data/maps.js", "maps", {m.sid: m.to_json() for m in maps})
    print("karten:", len(maps), [m.sid for m in maps])


# ------------------------------------------------------------------------------
SE = {
    "cursor": "SE/GUI sel cursor", "decision": "SE/GUI sel decision", "cancel": "SE/GUI sel cancel",
    "buzzer": "SE/GUI sel buzzer", "menu_open": "SE/GUI menu open", "menu_close": "SE/GUI menu close",
    "door_enter": "SE/Door enter", "door_exit": "SE/Door exit", "door_slide": "SE/Door slide",
    "bump": "SE/Player bump", "point": "SE/Voltorb Flip point", "mark": "SE/Voltorb Flip mark",
    "word": "SE/Pkmn move learnt", "pc": "SE/PC access", "buy": "SE/Mart buy item",
    "found": "SE/Mining found all", "confirm": "SE/GUI naming confirm",
    "tab_start": "SE/GUI naming tab swap start", "tab_end": "SE/GUI naming tab swap end",
    "exclaim": "SE/Exclaim", "vending": "SE/Vending machine dispense", "save": "SE/GUI save choice",
    "page": "SE/GUI summary change page", "tile": "SE/Voltorb Flip tile", "coin": "SE/Slots coin",
    "pickup": "SE/GUI storage pick up", "putdown": "SE/GUI storage put down", "levelup_se": "SE/Voltorb Flip level up",
    "item_get": "ME/Item get", "badge": "ME/Badge get", "phone": "ME/Register phone",
    "levelup": "ME/Evolution success", "key_item": "ME/Key item get", "saved": "ME/GUI save game",
    "win": "ME/Voltorb Flip win", "berry": "ME/Berry get",
}
BGM = ["Cedolan City", "Lerucean Town", "Lappet Town", "Lab", "Poke Mart", "New Start", "Bicycle_n",
       "Route 1", "Route 2", "Route 3", "Natural Park", "Islands", "Tiall", "Game Corner", "Poke Center",
       "Safari Zone exterior", "Credits", "Radio - March", "Radio - Lullaby", "Radio - Oak",
       "Triple Triad", "Ingido Plateau", "Cave", "Gym", "Safari Zone", "Hall of Fame"]


def export_audio():
    import soundfile as sf
    out = {}
    total = 0
    for key, rel in SE.items():
        data, sr = sf.read(GAME + "/Audio/" + rel + ".ogg", dtype="float32", always_2d=True)
        mono = data.mean(axis=1)
        # auf 22050 Hz herunterrechnen (lineare Interpolation reicht für Effekte)
        if sr != 22050:
            n = int(len(mono) * 22050 / sr)
            mono = np.interp(np.linspace(0, len(mono) - 1, n), np.arange(len(mono)), mono)
        buf = io.BytesIO()
        sf.write(buf, mono.astype(np.float32), 22050, format="WAV", subtype="PCM_16")
        b = base64.b64encode(buf.getvalue()).decode()
        total += len(b)
        out[key] = b
    js_write(WWW + "/data/audio.js", "audio", out)
    mids = {}
    for n in BGM:
        p = GAME + "/Audio/BGM/" + n + ".mid"
        mids[n] = base64.b64encode(open(p, "rb").read()).decode()
    js_write(WWW + "/data/bgm.js", "bgm", mids)
    print("audio: %d Effekte (%.1f MB), %d Musikstücke" % (len(out), total / 1e6, len(mids)))


def export_ui():
    os.makedirs(WWW + "/img/ui", exist_ok=True)
    shutil.copy(GAME + "/Graphics/UI/Sprachreise/deutschland.png", WWW + "/img/ui/deutschland.png")
    shutil.copy(GAME + "/Graphics/Titles/title.png", WWW + "/img/ui/title.png")
    os.makedirs(WWW + "/fonts", exist_ok=True)
    shutil.copy(GAME + "/Fonts/power green.ttf", WWW + "/fonts/power-green.ttf")
    shutil.copy(GAME + "/Fonts/power clear.ttf", WWW + "/fonts/power-clear.ttf")


def export_lang():
    sys.path.insert(0, WERKZEUGE)
    sp = importlib.import_module("sprachen")
    tr = {}
    for k, vals in sp.TR.items():
        tr[k] = {"es": vals[0], "ar": vals[1], "fr": vals[2], "tr": vals[3], "uk": vals[4]}
    extra = importlib.import_module("sprachen_port")      # Übersetzungen der neuen Wörter
    for k, vals in extra.TR.items():
        assert len(vals) == 5, k
        tr[k] = {"es": vals[0], "ar": vals[1], "fr": vals[2], "tr": vals[3], "uk": vals[4]}
    origins = {l: dict(sp.ORIGINS[l]) for l in sp.LANGS}
    for l, d in extra.ORIGINS_EXTRA.items():
        origins[l].update(d)
    js_write(WWW + "/data/lang.js", "lang", {"order": sp.LANGS, "origins": origins, "tr": tr})
    print("sprachen:", len(tr), "Übersetzungen")


def render_all(maps, only=None):
    os.makedirs(HERE + "/render", exist_ok=True)
    for m in maps:
        if only and m.sid not in only:
            continue
        m.render(HERE + "/render/%s.png" % m.sid)
    print("vorschau in tools/render/")


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    maps = load_maps()
    if what == "render":
        render_all(maps, sys.argv[2:] or None)
        sys.exit()
    export_maps(maps)
    export_tilesets({m.mb.tileset for m in maps})
    chars = set()
    for m in maps:
        chars |= m.chars()
    import people
    chars |= set(people.EXTRA_CHARS)
    export_chars(chars)
    if what == "all":
        export_ui()
        export_audio()
        export_lang()
