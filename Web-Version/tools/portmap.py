"""Karten für den Sprachreise-Port.

Die Kacheln werden weiterhin mit dem MapBuilder aus Sprachreise_Werkzeuge gebaut
(gleiche Tilesets, Autotiles, Stempel aus den Essentials-Beispielkarten).
Die Events werden hier als einfache Python-Dicts beschrieben und als JSON exportiert.
Bedingungen sind JavaScript-Ausdrücke, z. B. "flag('prolog_done') && !flag('x')".
"""
import os, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
WERKZEUGE = os.path.abspath(os.path.join(HERE, "..", "..", "Sprachreise_Werkzeuge"))
sys.path.insert(0, WERKZEUGE)

from mapgen import *          # noqa: E402,F401  (MapBuilder, ST, TR, DOM, OUT, A_*, page ...)
import build_maps as BM       # noqa: E402

DIRS = {"down": 2, "left": 4, "right": 6, "up": 8, 2: 2, 4: 4, 6: 6, 8: 8}


class PMap:
    """Eine Karte des Ports: Kacheln (MapBuilder) + Events (JSON)."""

    def __init__(self, sid, name, mb, bgm="", announce=True, outdoor=False, city=None):
        self.sid, self.name, self.mb = sid, name, mb
        self.bgm, self.announce, self.outdoor, self.city = bgm, announce, outdoor, city
        mb.events = []            # Ruby-Events der Werkzeuge nicht übernehmen
        self.events = []

    # --- Kacheln (Abkürzungen) ------------------------------------------------------
    def __getattr__(self, k):
        return getattr(self.mb, k)

    # --- Events ---------------------------------------------------------------------
    def ev(self, name, x, y, pages):
        self.events.append({"id": len(self.events) + 1, "name": name, "x": x, "y": y, "pages": pages})
        return self.events[-1]

    @staticmethod
    def page(cond=None, char=None, dir=2, trigger="action", move=None, freq=3, speed=3,
             through=False, step=False, dirfix=False, talk=None, transfer=None, tile=0, ontop=False):
        p = {"trigger": trigger}
        if cond: p["cond"] = cond
        if char: p["char"] = char
        if dir != 2: p["dir"] = DIRS[dir]
        if move: p["move"] = move
        if freq != 3: p["freq"] = freq
        if speed != 3: p["speed"] = speed
        if through: p["through"] = True
        if step: p["step"] = True
        if dirfix: p["dirfix"] = True
        if talk: p["talk"] = talk
        if transfer: p["transfer"] = transfer
        if tile: p["tile"] = tile
        if ontop: p["ontop"] = True
        return p

    def npc(self, name, x, y, char, talk, dir=2, move=None, freq=3, speed=3, cond=None,
            step=False, dirfix=False, extra=None, before=None):
        pages = list(before or [])
        pages.append(self.page(cond=cond, char=char, dir=dir, move=move, freq=freq, speed=speed,
                               step=step, dirfix=dirfix, talk=talk))
        pages += extra or []
        return self.ev(name, x, y, pages)

    def sign(self, name, x, y, talk, cond=None, touch=False, char=None):
        return self.ev(name, x, y, [self.page(cond=cond, char=char, trigger="touch" if touch else "action",
                                              dirfix=True, talk=talk)])

    def door(self, name, x, y, to, tx, ty, dir=2, cond=None, locked=None, se="door_enter"):
        pages = []
        if locked:
            pages.append(self.page(trigger="touch", talk=locked))
        pages.append(self.page(cond=cond, trigger="touch",
                               transfer={"map": to, "x": tx, "y": ty, "dir": DIRS[dir], "se": se}))
        return self.ev(name, x, y, pages)

    def warp(self, name, x, y, to, tx, ty, dir=2, cond=None, blocked=None):
        return self.door(name, x, y, to, tx, ty, dir, cond=cond, locked=blocked, se=None)

    def autorun(self, name, talk, cond):
        return self.ev(name, 0, 0, [self.page(cond=cond, trigger="auto", through=True, talk=talk)])

    def touch(self, name, x, y, talk, cond=None):
        """Feld, das beim Betreten eine Szene startet."""
        return self.ev(name, x, y, [self.page(cond=cond, trigger="touch", through=True, talk=talk)])

    # --- Export -----------------------------------------------------------------------
    def to_json(self):
        mb = self.mb
        mb.resolve_autotiles()
        data = [int(v) for v in mb.data.reshape(-1)]
        return {"id": self.sid, "name": self.name, "w": mb.w, "h": mb.h, "tileset": int(mb.tileset),
                "bgm": self.bgm, "announce": self.announce, "outdoor": self.outdoor,
                "city": self.city, "data": data, "events": self.events}

    def chars(self):
        out = set()
        for e in self.events:
            for p in e["pages"]:
                if p.get("char"):
                    out.add(p["char"])
        return out

    def render(self, path):
        """Vorschau mit Event-Markierungen (zum Prüfen beim Bauen)."""
        mb = self.mb
        mb.resolve_autotiles()
        tsname, autos, _ = tileset_info(mb.tileset)
        evs = [(e["x"], e["y"], e["name"]) for e in self.events if e["name"]]
        render(mb.data, tsname, autos, evs, grid=True).convert("RGB").save(path)


def interior(src_map, name="", tileset=None):
    """Kacheln einer Essentials-Innenraumkarte übernehmen."""
    d, ts, w, h = copy_interior(src_map)
    mb = MapBuilder(0, name, w, h, tileset=tileset or ts)
    mb.data[:] = d
    return mb


def blank(w, h, tileset=SR_TILESET, name=""):
    return MapBuilder(0, name, w, h, tileset=tileset)


def grid(pm, rows=None):
    """Durchgängigkeit + Events als Text (# = blockiert, Buchstaben = Events)."""
    mb = pm.mb
    mb.resolve_autotiles()
    tsd = L("Tilesets.rxdata")[mb.tileset].attributes
    pas = parse_table(tsd['@passages']).reshape(-1)
    pri = parse_table(tsd['@priorities']).reshape(-1)
    evs = {(e["x"], e["y"]): e["name"] for e in pm.events if e["name"] and not e["pages"][0].get("trigger") == "auto"}
    out = []
    for y in range(mb.h if rows is None else min(rows, mb.h)):
        row = ""
        for x in range(mb.w):
            c = "."
            for z in (2, 1, 0):
                t = int(mb.data[z, y, x])
                if not t: continue
                p = int(pas[t])
                if p & 0x0f == 0x0f: c = "#"; break
                if p & 0x0f: c = "+"; break
                if pri[t] == 0: break
            if (x, y) in evs: c = evs[(x, y)][0].lower() if c == "." else evs[(x, y)][0]
            row += c
        out.append("%2d %s" % (y, row))
    return "\n".join(out)


def remove_tiles(mb, ids, layers=(1, 2)):
    """Bestimmte Kacheln entfernen (z. B. Pokémon-Heilmaschinen in Innenräumen)."""
    ids = set(ids)
    for z in layers:
        for y in range(mb.h):
            for x in range(mb.w):
                if int(mb.data[z, y, x]) in ids:
                    mb.data[z, y, x] = 0


POKE_MACHINE = (1784, 1785, 1792, 1793, 1800, 1801)


def bed(mb, x, y):
    """Bett aus der Berliner WG (3x3-Block, Interior general) einsetzen."""
    mb.stamp(78, 20, 4, 3, 3, x, y, layers=(1, 2))
