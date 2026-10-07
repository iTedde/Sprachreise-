"""Hilfsbibliothek zum Erzeugen von RPG-Maker-XP-Karten (RPG::Map) für Sprachreise."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from maplib import *
from rubymarshal.classes import RubyObject, UserDef

OFFS = json.load(open(os.path.join(os.path.dirname(__file__), "ts_offsets.json")))
SR_TILESET = 24

def ST(r, c):  return 384 + (OFFS['station'] + r) * 8 + c     # Train-Station (Ekat99)
def TR(r, c):  return 384 + (OFFS['train'] + r) * 8 + c       # Magnetbahn/ICE
def DOM(r, c): return 384 + (OFFS['dom'] + r) * 8 + c         # Kölner Dom
def OUT(r, c): return 384 + r * 8 + c                         # Essentials Outside

# Autotile-Slots im Tileset 24
A_SEA, A_ROAD, A_WALK, A_FLOWER, A_WATER, A_BRICK, A_FOUNTAIN = 1, 2, 3, 4, 5, 6, 7

def obj(cls, **attrs):
    return RubyObject(cls, {'@' + k: v for k, v in attrs.items()})

def audio(name, vol=100, pitch=100):
    return obj("RPG::AudioFile", name=name, volume=vol, pitch=pitch)

def table(arr):
    u = UserDef("Table"); u._private_data = build_table(np.asarray(arr)); return u

def cmd(code, params=None, indent=0):
    return obj("RPG::EventCommand", code=code, indent=indent, parameters=params if params is not None else [])

def mcmd(code, params=None):
    return obj("RPG::MoveCommand", code=code, parameters=params if params is not None else [])

def move_route(cmds=None, repeat=True, skippable=False):
    lst = [mcmd(c[0], list(c[1:])) if isinstance(c, tuple) else mcmd(c) for c in (cmds or [])]
    lst.append(mcmd(0))
    return obj("RPG::MoveRoute", repeat=repeat, skippable=skippable, list=lst)

# Skript-Schalter ("s:..."-Namen in System.rxdata), werden fortlaufend vergeben
SCRIPT_SWITCHES = {}
SWITCH_BASE = 101
def sswitch(expr):
    if expr not in SCRIPT_SWITCHES:
        SCRIPT_SWITCHES[expr] = SWITCH_BASE + len(SCRIPT_SWITCHES)
    return SCRIPT_SWITCHES[expr]

def page(char="", dir=2, pattern=0, tile_id=0, trigger=0, move_type=0, freq=3, speed=3,
         through=False, on_top=False, step_anime=False, dir_fix=False, walk_anime=True,
         cond=None, cond2=None, self_sw=None, script=None, cmds=None, route=None, opacity=255):
    c = obj("RPG::Event::Page::Condition", switch1_valid=False, switch2_valid=False,
            variable_valid=False, self_switch_valid=False, switch1_id=1, switch2_id=1,
            variable_id=1, variable_value=0, self_switch_ch="A")
    if cond:
        c.attributes['@switch1_valid'] = True; c.attributes['@switch1_id'] = sswitch(cond)
    if cond2:
        c.attributes['@switch2_valid'] = True; c.attributes['@switch2_id'] = sswitch(cond2)
    if self_sw:
        c.attributes['@self_switch_valid'] = True; c.attributes['@self_switch_ch'] = self_sw
    g = obj("RPG::Event::Page::Graphic", tile_id=tile_id, character_name=char, character_hue=0,
            direction=dir, pattern=pattern, opacity=opacity, blend_type=0)
    lst = []
    if script:
        for line in ([script] if isinstance(script, str) else script):
            lst.append(cmd(355, [line]))
    if cmds:
        lst += cmds
    lst.append(cmd(0))
    return obj("RPG::Event::Page", condition=c, graphic=g, move_type=move_type, move_speed=speed,
               move_frequency=freq, move_route=route or move_route(), walk_anime=walk_anime,
               step_anime=step_anime, direction_fix=dir_fix, through=through,
               always_on_top=on_top, trigger=trigger, list=lst)

def transfer_cmds(map_id, x, y, dir=2, se="Door exit"):
    out = []
    if se:
        out.append(cmd(250, [audio(se, 80)]))
    out.append(cmd(201, [0, map_id, x, y, dir, 0]))
    return out


class MapBuilder:
    def __init__(self, map_id, name, w, h, tileset=SR_TILESET, bgm="", parent=0, order=None):
        self.id, self.name, self.w, self.h = map_id, name, w, h
        self.tileset, self.bgm, self.parent = tileset, bgm, parent
        self.order = order if order is not None else map_id
        self.data = np.zeros((3, h, w), np.int32)
        self.auto = np.zeros((3, h, w), np.int32)   # Autotile-Art pro Feld (vor Auflösung)
        self.events = []

    # --- Kacheln -----------------------------------------------------------------
    def inb(self, x, y): return 0 <= x < self.w and 0 <= y < self.h

    def set(self, x, y, tile, layer=1):
        if self.inb(x, y):
            self.data[layer, y, x] = tile; self.auto[layer, y, x] = 0

    def fill(self, x0, y0, x1, y1, tile, layer=0):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.set(x, y, tile, layer)

    def autofill(self, x0, y0, x1, y1, kind, layer=0):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if self.inb(x, y):
                    self.auto[layer, y, x] = kind; self.data[layer, y, x] = 0

    def block(self, x, y, rows, layer=1):
        """rows: Liste von Listen mit Tile-IDs (0 = nichts setzen)"""
        for j, row in enumerate(rows):
            for i, t in enumerate(row):
                if t:
                    self.set(x + i, y + j, t, layer)

    def stamp(self, src_map, sx, sy, w, h, dx, dy, layers=(1, 2), keep_ground=False, ground_skip=()):
        src = load_map(src_map)
        d = parse_table(src.attributes['@data'])
        for j in range(h):
            for i in range(w):
                for z in layers:
                    t = int(d[z, sy + j, sx + i])
                    if t == 0 or t in ground_skip:
                        continue
                    if t < 384:   # Autotiles der Quellkarte nicht übernehmen
                        continue
                    self.set(dx + i, dy + j, t, z)
                if keep_ground:
                    t = int(d[0, sy + j, sx + i])
                    if t >= 384 and t not in ground_skip:
                        self.set(dx + i, dy + j, t, 0)

    def resolve_autotiles(self):
        for z in range(3):
            A = self.auto[z]
            for y in range(self.h):
                for x in range(self.w):
                    k = A[y, x]
                    if not k:
                        continue
                    def same(xx, yy):
                        if xx < 0 or yy < 0 or xx >= self.w or yy >= self.h:
                            return True
                        return A[yy, xx] == k
                    bits = 0
                    if same(x, y - 1): bits |= 0x01
                    if same(x + 1, y - 1): bits |= 0x02
                    if same(x + 1, y): bits |= 0x04
                    if same(x + 1, y + 1): bits |= 0x08
                    if same(x, y + 1): bits |= 0x10
                    if same(x - 1, y + 1): bits |= 0x20
                    if same(x - 1, y): bits |= 0x40
                    if same(x - 1, y - 1): bits |= 0x80
                    self.data[z, y, x] = 48 * k + N2I[bits]

    # --- Events --------------------------------------------------------------------
    def event(self, name, x, y, pages):
        eid = len(self.events) + 1
        e = obj("RPG::Event", id=eid, name=name, x=x, y=y, pages=pages)
        self.events.append(e)
        return eid

    def npc(self, name, x, y, char, talk, dir=2, move_type=0, freq=3, speed=3, route=None,
            cond=None, step_anime=False, extra_pages=None, dir_fix=False):
        pages = [page(char=char, dir=dir, trigger=0, move_type=move_type, freq=freq, speed=speed,
                      route=route, cond=cond, step_anime=step_anime, dir_fix=dir_fix,
                      script=f"sr_talk(:{talk})")]
        if extra_pages:
            pages += extra_pages
        return self.event(name, x, y, pages)

    def sign(self, name, x, y, talk, tile_id=0, char="", cond=None, trigger=0):
        return self.event(name, x, y, [page(char=char, tile_id=tile_id, trigger=trigger,
                                            dir_fix=True, walk_anime=False, cond=cond,
                                            script=f"sr_talk(:{talk})")])

    def door(self, name, x, y, to_map, tx, ty, tdir=2, char="", cond=None, locked_talk=None, se="Door enter"):
        pages = []
        if locked_talk:
            pages.append(page(char=char, trigger=1, dir_fix=True, walk_anime=False,
                              script=f"sr_talk(:{locked_talk})"))
        pages.append(page(char=char, trigger=1, dir_fix=True, walk_anime=False, cond=cond,
                          cmds=transfer_cmds(to_map, tx, ty, tdir, se)))
        return self.event(name, x, y, pages)

    def warp(self, name, x, y, to_map, tx, ty, tdir=2, cond=None, blocked_talk=None):
        """Unsichtbarer Übergang (z.B. Kartenrand)"""
        pages = []
        if blocked_talk:
            pages.append(page(trigger=1, through=False, script=f"sr_talk(:{blocked_talk})"))
        pages.append(page(trigger=1, cond=cond, cmds=transfer_cmds(to_map, tx, ty, tdir, None)))
        return self.event(name, x, y, pages)

    def autorun(self, name, x, y, talk, cond):
        return self.event(name, x, y, [page(trigger=3, cond=cond, script=f"sr_talk(:{talk})")])

    # --- Speichern -------------------------------------------------------------------
    def build(self):
        self.resolve_autotiles()
        ev = {e.attributes['@id']: e for e in self.events}
        m = obj("RPG::Map", tileset_id=self.tileset, width=self.w, height=self.h,
                autoplay_bgm=bool(self.bgm), bgm=audio(self.bgm, 80), autoplay_bgs=False,
                bgs=audio("", 80), encounter_list=[], encounter_step=30,
                data=table(self.data), events=ev)
        return m

    def save(self):
        m = self.build()
        save("Map%03d.rxdata" % self.id, m)
        return m

    def render(self, path):
        self.resolve_autotiles()
        tsname, autos, _ = tileset_info(self.tileset)
        evs = [(e.attributes['@x'], e.attributes['@y'], e.attributes['@name']) for e in self.events]
        render(self.data, tsname, autos, evs, grid=True).convert('RGB').save(path)


_map_cache = {}
def load_map(mid):
    if mid not in _map_cache:
        _map_cache[mid] = L("Map%03d.rxdata" % mid)
    return _map_cache[mid]

def copy_interior(src_id):
    """Kachel-Daten einer vorhandenen Innenraumkarte übernehmen (ohne Events)."""
    m = load_map(src_id).attributes
    return parse_table(m['@data']).copy(), m['@tileset_id'], m['@width'], m['@height']
