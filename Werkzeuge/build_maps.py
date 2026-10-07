import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from mapgen import *

MAP_HBF, MAP_MOABIT, MAP_WG, MAP_BA, MAP_COPY, MAP_KOELN = 76, 77, 78, 79, 80, 81

# Häufig genutzte Stempel (Quelle: Essentials-Beispielkarten)
TREE = (7, 22, 32, 2, 3)          # Einzelbaum (2x3)
BUSH = (7, 25, 9, 1, 1)
FLOWERS = (7, 4, 29, 1, 1)
HOUSE_DOOR = (7, 20, 24, 5, 5)    # Wohnhaus mit Tür bei (2,4)
HOUSE_SMALL = (7, 4, 24, 4, 5)
BLOCK_A = (7, 18, 3, 7, 8)        # großer Altbau-Block
BLOCK_B = (7, 26, 3, 5, 8)
BLOCK_C = (7, 31, 6, 4, 5)
BLOCK_D = (7, 35, 6, 4, 5)
BLOCK_E = (7, 4, 3, 5, 8)
RATHAUS = (52, 4, 2, 9, 8)        # Rathaus Tiergarten (Tür bei 4,7)
TOWER = (52, 26, 0, 7, 9)        # Hochhaus
STALL = (23, 10, 18, 6, 4)        # Marktstand / Späti
BIKES = (23, 12, 26, 2, 1)
SHOP_GREEN = (23, 23, 15, 6, 4)   # Laden mit Markise, Tür bei (1,3)
SIGNBOARD = (23, 22, 18, 1, 1)
LOWHOUSE = (23, 19, 24, 7, 5)

GROUND_SKIP = set(range(384, 392)) | set(range(641, 672)) | {699, 700, 1177, 554}
FOREST = set(range(792, 828))          # Waldbäume der Quellkarten (nicht mitstempeln)

def put(mb, st, x, y, keep_ground=True, **kw):
    src, sx, sy, w, h = st
    skip = GROUND_SKIP if st in (TREE,) else GROUND_SKIP | FOREST
    mb.stamp(src, sx, sy, w, h, x, y, keep_ground=keep_ground, ground_skip=skip, **kw)

def tree(mb, x, y): put(mb, TREE, x, y)

ASPHALT = ST(0, 7)
def road(mb, x0, y0, x1, y1):
    mb.fill(x0, y0, x1, y1, ASPHALT, 0)

#===============================================================================
# Berlin Hauptbahnhof
#===============================================================================
def build_hbf():
    W, H = 32, 26
    mb = MapBuilder(MAP_HBF, "Berlin Hauptbahnhof", W, H, bgm="Cedolan City")
    # --- Europaplatz (oben) ---
    mb.autofill(0, 0, W - 1, 8, A_WALK)
    road(mb, 0, 1, 11, 2)                 # Taxi-Vorfahrt
    road(mb, 20, 1, W - 1, 2)
    # Bäume in Pflanzinseln
    for x in (2, 6, 23, 27):
        tree(mb, x, 4)
    put(mb, BUSH, 10, 6); put(mb, BUSH, 21, 6)
    # --- Bahnhofsfassade (y 9..11) ---
    for x in range(0, W, 3):
        mb.block(x, 9, [[ST(15, 0), ST(15, 1), ST(15, 2)],
                        [ST(16, 0), ST(16, 2), ST(16, 2)]])
    # großer Bogen-Eingang über der Mitte
    mb.block(14, 6, [[ST(10, 0), ST(10, 1), ST(10, 2), ST(10, 3)],
                     [ST(11, 0), ST(11, 1), ST(11, 2), ST(11, 3)],
                     [ST(12, 0), ST(12, 1), ST(12, 2), ST(12, 3)],
                     [ST(13, 0), ST(13, 1), ST(13, 2), ST(13, 3)]], layer=1)
    mb.block(14, 10, [[ST(14, 0), 0, 0, ST(14, 3)]], layer=1)
    for x in (15, 16):
        mb.set(x, 10, 0, 1); mb.set(x, 10, ST(1, 3), 0)
    # Eingänge links und rechts vom Portal (Durchgang Halle <-> Europaplatz)
    for x in (12, 19):
        for y in (9, 10):
            mb.set(x, y, 0, 1); mb.set(x, y, 0, 2); mb.set(x, y, ST(1, 3), 0)
    # --- Halle (y 11..17) ---
    mb.fill(0, 11, W - 1, 17, ST(0, 3), 0)
    mb.fill(0, 13, W - 1, 15, ST(0, 4), 0)
    mb.fill(14, 11, 17, 17, ST(0, 5), 0)
    # Abfahrtstafel
    mb.block(4, 12, [[ST(5, 5), ST(5, 6), ST(5, 7)], [ST(6, 5), ST(6, 6), ST(6, 7)]])
    # Bänke
    for x in (9, 22):
        mb.block(x, 14, [[ST(12, 5), ST(12, 6)]])
    # Schilder / Säulen
    for x in (2, 10, 20, 29):
        mb.set(x, 16, ST(7, 3), 1); mb.set(x, 17, ST(8, 3), 1)
    # --- Bahnsteig + Gleise ---
    mb.fill(0, 18, W - 1, 18, ST(5, 0), 0)          # Blindenleitstreifen
    mb.fill(0, 19, W - 1, 19, ST(6, 2), 0)
    for x in range(0, W, 4):
        mb.block(x, 20, [[ST(2, 4), ST(2, 5), ST(2, 6), ST(2, 7)],
                         [ST(3, 4), ST(3, 5), ST(3, 6), ST(3, 7)]], layer=0)
    mb.fill(0, 22, W - 1, 23, ST(1, 3), 0)
    mb.fill(0, 22, W - 1, 22, ST(5, 0), 0)
    for x in range(0, W, 4):
        mb.block(x, 24, [[ST(2, 4), ST(2, 5), ST(2, 6), ST(2, 7)],
                         [ST(3, 4), ST(3, 5), ST(3, 6), ST(3, 7)]], layer=0)
    # ICE am Gleis 4 (y 20-21)
    ice = [[TR(3, 0), TR(3, 1), TR(3, 2)] + [TR(0, c) for c in (3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5)] + [TR(3, 3), TR(3, 4), TR(3, 5)],
           [TR(4, 0), TR(4, 1), TR(4, 2)] + [TR(1, c) for c in (3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5)] + [TR(4, 3), TR(4, 4), TR(4, 5)]]
    mb.block(3, 20, ice, layer=2)
    return mb


# Häufig genutzte Event-Grafiken (Graphics/Characters)
C = {
    'tarek': "SR_Tarek", 'kowalski': "NPC 11", 'jonas': "SR_Jonas", 'schulz': "NPC 14",
    'krause': "NPC 10", 'petersen': "SR_Petersen", 'brandt': "NPC 12", 'mohammed': "SR_Mohammed",
    'ercan': "SR_Ercan", 'kaya': "SR_Kaya", 'tourist': "SR_Tourist", 'pendler': "NPC 13",
    'student': "NPC 05", 'mutter': "NPC 16", 'kind': "NPC 02", 'rentner': "NPC 18",
    'bauarbeiter': "SR_Bauarbeiter", 'musiker': "NPC 25", 'taxi': "NPC 21", 'baecker': "NPC 06",
    'familie': "NPC 22", 'jugend1': "NPC 27", 'jugend2': "NPC 26", 'joggerin': "NPC 08",
    'mai': "SR_Mai", 'polizist': "SR_Polizist", 'reisende': "NPC 23", 'koelner': "NPC 24",
}
RANDOM = 1

def wander_route(seq):
    m = {'U': 4, 'D': 1, 'L': 2, 'R': 3, 'u': 19, 'd': 16, 'l': 17, 'r': 18, '.': (15, 30)}
    return move_route([m[c] for c in seq], repeat=True, skippable=True)

def inv(mb, name, x, y, talk, cond=None, trigger=0):
    """unsichtbares Interaktionsfeld (Schilder, Möbel, Automaten)"""
    return mb.sign(name, x, y, talk, cond=cond, trigger=trigger)

#===============================================================================
def hbf_events(mb):
    mb.autorun("Prolog", 0, 25, "prolog", cond="!SR.flag?(:prolog_done)")
    mb.npc("Tarek", 16, 15, C['tarek'], "tarek", dir=2)
    inv(mb, "Abfahrtstafel", 5, 13, "hbf_tafel")
    inv(mb, "Hbf-Schild", 14, 10, "hbf_schild")
    mb.npc("Pendler", 8, 16, C['pendler'], "hbf_pendler", move_type=3, freq=5, speed=4,
           route=wander_route("RRRRRR.LLLLLL."))
    mb.npc("Familie", 23, 15, C['familie'], "hbf_familie", dir=8)
    put(mb, STALL, 25, 11)
    mb.npc("Baeckerin", 27, 15, C['baecker'], "baeckerei", dir=2)
    inv(mb, "Fahrkartenautomat", 12, 5, "automat")
    mb.set(12, 5, ST(1, 7), 1)
    mb.npc("Frau Kowalski", 13, 6, C['kowalski'], "kowalski", dir=4)
    mb.npc("Taxifahrer", 5, 3, C['taxi'], "taxi", dir=2)
    mb.npc("Musiker", 20, 6, C['musiker'], "musiker", dir=2, step_anime=True)
    mb.npc("Reisende", 26, 18, C['reisende'], "hbf_reisende", move_type=RANDOM, freq=3)
    inv(mb, "Reisezentrum", 19, 12, "reisezentrum")
    mb.set(19, 12, ST(4, 6), 1)
    for i, x in enumerate(range(13, 19)):
        mb.warp("Ausgang", x, 0, MAP_MOABIT, 14 + i, 34, 8, cond="SR.flag?(:tarek_done)",
                blocked_talk="hbf_noch_nicht")

def build_hbf_full():
    mb = build_hbf()
    hbf_events(mb)
    return mb

#===============================================================================
# Berlin-Moabit
#===============================================================================
def build_moabit():
    W, H = 48, 36
    mb = MapBuilder(MAP_MOABIT, "Berlin-Moabit", W, H, bgm="Lerucean Town")
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    road(mb, 0, 29, W - 1, 31)       # Invalidenstraße
    road(mb, 26, 0, 28, 28)          # Lehrter Straße
    road(mb, 0, 13, 25, 15)          # Turmstraße
    for x in range(14, 20):          # Fußgängerüberweg
        for y in (29, 30, 31):
            if x % 2 == 0:
                mb.set(x, y, ST(0, 4), 0)
    # --- NW: Rathaus Tiergarten (Bürgeramt) ---
    put(mb, RATHAUS, 7, 2)
    tree(mb, 18, 8)
    put(mb, BUSH, 4, 11); put(mb, BUSH, 16, 11)
    put(mb, BLOCK_E, 20, 2)          # Lehrter Str. 11 (gegenüber)
    put(mb, TOWER, 0, 0, layers=(1, 2), keep_ground=False)
    # --- SW: Copyshop, Späti, kleiner Park ---
    put(mb, SHOP_GREEN, 2, 17)
    put(mb, STALL, 12, 17)
    put(mb, SIGNBOARD, 18, 19)
    for x in (1, 5, 9):
        tree(mb, x, 23)
    put(mb, BIKES, 15, 23); put(mb, BIKES, 17, 23)
    for x in (21, 23):
        tree(mb, x, 18)
    put(mb, BUSH, 22, 24)
    # --- O: Lehrter Straße 10/12/14 + Hinterhof ---
    put(mb, BLOCK_D, 30, 7)          # Nr. 14
    put(mb, HOUSE_DOOR, 30, 14)      # Nr. 12 (WG)
    put(mb, BLOCK_C, 30, 21)         # Nr. 10
    put(mb, BLOCK_A, 34, 0)          # Hinterhaus
    put(mb, TOWER, 41, 0, layers=(1, 2), keep_ground=False)
    mb.fill(35, 10, 46, 26, OUT(0, 1), 0)
    for x in range(36, 46, 3):
        put(mb, FLOWERS, x, 17)
    tree(mb, 44, 20); tree(mb, 36, 22)
    put(mb, BIKES, 39, 24); put(mb, BIKES, 41, 24)
    mb.stamp(7, 0, 24, 9, 1, 35, 27, layers=(1, 2))
    mb.stamp(7, 0, 24, 3, 1, 44, 27, layers=(1, 2))
    # --- S: Baustelle ---
    mb.stamp(7, 0, 24, 9, 1, 38, 32, layers=(1, 2))
    tree(mb, 2, 32); tree(mb, 7, 32); tree(mb, 24, 32); tree(mb, 30, 32)
    return mb

def moabit_events(mb):
    for i, x in enumerate(range(14, 20)):
        mb.warp("Zum Hbf", x, 35, MAP_HBF, 13 + i, 1, 2)
    mb.door("Tür Bürgeramt", 11, 9, MAP_BA, 7, 9, 8, cond="SR.flag?(:ep2_started)", locked_talk="ba_zu")
    mb.door("Tür Copyshop", 3, 20, MAP_COPY, 4, 7, 8, cond="SR.flag?(:ep2_started)", locked_talk="copy_zu")
    mb.door("Tür Nr. 12", 32, 18, MAP_WG, 3, 8, 8, cond="SR.flag?(:wg_klingel_ok)", locked_talk="wg_klingel")
    put(mb, SIGNBOARD, 25, 27); inv(mb, "Schild Lehrter Str", 25, 27, "schild_lehrter")
    put(mb, SIGNBOARD, 21, 33); inv(mb, "Schild Invalidenstr", 21, 33, "schild_invaliden")
    put(mb, SIGNBOARD, 19, 16); inv(mb, "Schild Turmstr", 19, 16, "schild_turm")
    put(mb, SIGNBOARD, 15, 10); inv(mb, "Schild Buergeramt", 15, 10, "schild_ba")
    inv(mb, "Haus Nr. 10", 31, 26, "haus10")
    inv(mb, "Haus Nr. 14", 31, 12, "haus14")
    inv(mb, "Haus Nr. 11", 22, 10, "haus11")
    inv(mb, "Klingel Nr. 12", 33, 19, "wg_klingel")
    put(mb, SIGNBOARD, 8, 28); inv(mb, "Haltestelle", 8, 28, "haltestelle")
    put(mb, SIGNBOARD, 37, 33); inv(mb, "Baustellenschild", 37, 33, "baustelle")
    inv(mb, "Spaeti-Schild", 18, 19, "spaeti_schild")
    for i, (x, src) in enumerate([(39, (10, 19)), (40, (15, 20)), (41, (16, 20)), (42, (10, 18))]):
        mb.stamp(23, src[0], src[1], 1, 1, x, 12, layers=(1, 2), keep_ground=True, ground_skip=GROUND_SKIP)
        inv(mb, "Tonne%d" % (i + 1), x, 12, "tonne_%d" % (i + 1))
    mb.npc("Ercan", 14, 21, C['ercan'], "ercan", dir=2)
    mb.npc("Frau Schulz", 38, 15, C['schulz'], "schulz", dir=2, move_type=3, freq=2,
           route=wander_route("LL..RR..d"))
    mb.npc("Herr Krause", 42, 14, C['krause'], "krause", dir=4)
    mb.npc("Pendlerin", 9, 27, C['pendler'], "pendlerin", dir=2)
    mb.npc("Student", 6, 22, C['student'], "student", move_type=RANDOM, freq=3)
    mb.npc("Jugendlicher", 3, 26, C['jugend1'], "jugendliche", dir=6)
    mb.npc("Jugendliche", 4, 26, C['jugend2'], "jugendliche", dir=4)
    mb.npc("Rentner", 24, 21, C['rentner'], "rentner", move_type=3, freq=2,
           route=wander_route("UU..DD.."))
    mb.npc("Mutter", 12, 26, C['mutter'], "mutter", move_type=RANDOM, freq=2)
    mb.npc("Joggerin", 2, 28, C['joggerin'], "joggerin", move_type=3, freq=6, speed=4,
           route=wander_route("RRRRRRRRRRRRLLLLLLLLLLLL"))
    mb.npc("Bauarbeiter", 41, 34, C['bauarbeiter'], "bauarbeiter", dir=8)
    mb.npc("Tourist", 17, 27, C['tourist'], "tourist", dir=2,
           cond="SR.flag?(:ep2_started) && !SR.flag?(:tourist_done)")
    mb.npc("Polizist", 24, 28, C['polizist'], "polizist", move_type=3, freq=3,
           route=wander_route("LLLL..RRRR.."))

def build_moabit_full():
    mb = build_moabit()
    moabit_events(mb)
    return mb

#===============================================================================
# Innenräume
#===============================================================================
def interior(map_id, name, src, bgm):
    d, ts, w, h = copy_interior(src)
    mb = MapBuilder(map_id, name, w, h, tileset=ts, bgm=bgm)
    mb.data[:] = d
    return mb

def build_wg():
    mb = interior(MAP_WG, "WG Lehrter Straße", 3, "Lappet Town")
    mb.event("Ausgang", 3, 9, [page(trigger=1, cmds=transfer_cmds(MAP_MOABIT, 32, 19, 2))])
    mb.event("Treppe hoch", 10, 2, [page(trigger=1, cmds=transfer_cmds(MAP_WG, 29, 3, 2, None))])
    mb.event("Treppe runter", 28, 2, [page(trigger=1, cmds=transfer_cmds(MAP_WG, 9, 3, 2, None))])
    mb.autorun("Ankunft WG", 0, 14, "wg_ankunft", cond="!SR.flag?(:wg_arrived)")
    mb.autorun("Epilog", 1, 14, "wg_epilog", cond="SR.flag?(:mb_done) && !SR.flag?(:anruf_done)")
    mb.npc("Jonas", 7, 6, C['jonas'], "jonas", dir=8)
    mb.npc("Mai", 2, 4, C['mai'], "mai", dir=6, cond="SR.flag?(:ep2_started)")
    inv(mb, "Kuehlschrank", 5, 2, "kuehlschrank")
    inv(mb, "Spuele", 1, 2, "spuele")
    inv(mb, "Fenster", 7, 1, "fenster")
    inv(mb, "Laptop", 20, 2, "laptop")
    inv(mb, "Bett", 21, 6, "bett")
    inv(mb, "Regal", 23, 2, "regal")
    inv(mb, "Fernseher", 25, 5, "fernseher")
    inv(mb, "Kalender", 29, 1, "kalender")
    return mb

def build_buergeramt():
    mb = interior(MAP_BA, "Bürgeramt Moabit", 11, "Lab")
    mb.set(3, 5, 0, 1); mb.set(3, 5, 0, 2)     # Hocker vor Platz 1 entfernen
    mb.event("Ausgang", 7, 10, [page(trigger=1, cmds=transfer_cmds(MAP_MOABIT, 11, 10, 2))])
    mb.autorun("Eingang", 7, 12, "ba_eingang", cond="!SR.flag?(:ba_first_visit)")
    mb.npc("Frau Petersen", 3, 2, C['petersen'], "petersen", dir=2)
    inv(mb, "Platz 1", 3, 4, "ba_schalter")
    inv(mb, "Platz 2", 3, 7, "ba_platz2")
    inv(mb, "Nummernautomat", 1, 2, "ba_nummer")
    inv(mb, "Formulartisch", 7, 7, "ba_formulartisch")
    inv(mb, "Aufrufanzeige", 12, 2, "ba_anzeige")
    inv(mb, "Aktenregal", 5, 1, "ba_akten")
    inv(mb, "Plakat", 9, 1, "ba_poster")
    mb.npc("Herr Brandt", 10, 8, C['brandt'], "brandt", dir=4)
    mb.npc("Mohammed", 14, 5, C['mohammed'], "mohammed", dir=4)
    mb.npc("Wartende", 14, 7, C['mutter'], "ba_wartende", dir=4)
    mb.npc("Student BA", 11, 3, C['student'], "ba_student", dir=2)
    return mb

def build_copyshop():
    mb = interior(MAP_COPY, "Copyshop Kopierkönig", 25, "Poke Mart")
    mb.event("Ausgang", 4, 8, [page(trigger=1, cmds=transfer_cmds(MAP_MOABIT, 3, 21, 2))])
    mb.npc("Herr Kaya", 2, 3, C['kaya'], "kaya", dir=2)
    inv(mb, "Kopierer", 3, 4, "copy_kopierer")
    inv(mb, "Schwarzes Brett", 5, 1, "copy_brett")
    inv(mb, "Getraenke", 8, 1, "copy_getraenke")
    inv(mb, "Papier", 7, 5, "copy_papier")
    mb.npc("Kundin", 9, 3, C['joggerin'], "copy_kundin", dir=4)
    return mb

#===============================================================================
# Köln Hauptbahnhof (Demo-Ende) – mit Kölner Dom (Baertierchen)
#===============================================================================
def build_koeln():
    W, H = 26, 22
    mb = MapBuilder(MAP_KOELN, "Köln Hauptbahnhof", W, H, bgm="New Start")
    mb.autofill(0, 0, W - 1, 13, A_WALK)
    mb.block(9, 0, [[DOM(r, c) for c in range(8)] for r in range(10)], layer=1)
    tree(mb, 2, 6); tree(mb, 21, 6); tree(mb, 2, 10); tree(mb, 21, 10)
    for x in range(0, W, 3):
        mb.block(x, 14, [[ST(15, 0), ST(15, 1), ST(15, 2)], [ST(16, 0), ST(16, 1), ST(16, 2)]])
    for x in (12, 13):
        for y in (14, 15):
            mb.set(x, y, 0, 1); mb.set(x, y, ST(1, 3), 0)
    mb.fill(0, 16, W - 1, 17, ST(0, 3), 0)
    mb.fill(0, 18, W - 1, 18, ST(5, 0), 0)
    for x in range(0, W, 4):
        mb.block(x, 19, [[ST(2, 4), ST(2, 5), ST(2, 6), ST(2, 7)], [ST(3, 4), ST(3, 5), ST(3, 6), ST(3, 7)]], layer=0)
    mb.fill(0, 21, W - 1, 21, ST(1, 3), 0)
    ice = [[TR(3, 0), TR(3, 1), TR(3, 2)] + [TR(0, c) for c in (3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5)] + [TR(3, 3), TR(3, 4), TR(3, 5)],
           [TR(4, 0), TR(4, 1), TR(4, 2)] + [TR(1, c) for c in (3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5)] + [TR(4, 3), TR(4, 4), TR(4, 5)]]
    mb.block(4, 19, ice, layer=2)
    mb.autorun("Ankunft Koeln", 0, 21, "koeln_ankunft", cond="!SR.flag?(:koeln_done)")
    mb.npc("Koelner", 6, 12, C['koelner'], "koelner", move_type=RANDOM, freq=3)
    mb.npc("Reisende K", 18, 16, C['reisende'], "koeln_reisende", dir=4)
    inv(mb, "Dom", 13, 10, "dom")
    inv(mb, "Rueckfahrt", 20, 16, "koeln_rueck")
    mb.set(20, 16, ST(4, 6), 1)
    return mb

ALL = [build_hbf_full, build_moabit_full, build_wg, build_buergeramt, build_copyshop, build_koeln]

if __name__ == "__main__":
    os.makedirs("render", exist_ok=True)
    maps = []
    for f in ALL:
        mb = f(); maps.append(mb)
        mb.render("render/new_%d.png" % mb.id)
    if "--save" in sys.argv:
        import write_project
        write_project.write(maps)
    print("ok")
