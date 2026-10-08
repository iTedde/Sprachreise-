"""Episode 7 – Deutschland entdecken: Frankfurt Hbf, München, Dresden."""
from portmap import *
import maps_berlin2 as B2

C = dict(BM.C)
C.update({'carmen': "OW 29", 'resi': "TR 062", 'zugbegleiterin': "TR 106", 'oksana': "OW 26", 'lehmann': "OW 20",
          'surfer': "OW 57", 'tourist2': "TR 129", 'frau1': "OW 23", 'mann1': "OW 05", 'kind': "TR 174", 'mann2': "TR 067"})


def frankfurt_hbf():
    mb = BM.build_hbf()
    # Skyline im Norden statt Europaplatz-Bäumen: Hochhäuser
    for x in (0, 7, 23):
        BM.put(mb, BM.TOWER, x, 0, layers=(1, 2), keep_ground=False)
    m = PMap("frankfurt_hbf", "Frankfurt (Main) Hauptbahnhof", mb, bgm="Route 3", city="frankfurt")
    m.autorun("Ankunft F", "frankfurt_ankunft", "!flag('frankfurt_ankunft')")
    m.sign("Gleisanzeige", 5, 13, "frankfurt_anzeige")
    m.npc("Zugbegleiterin", 16, 15, C['zugbegleiterin'], "zugbegleiterin")
    m.npc("Reisender F", 23, 15, C['mann2'], "reisender_f", dir="up")
    m.npc("Bankerin", 9, 16, C['frau1'], "bankerin", move="RRRR.LLLL.", speed=4)
    m.sign("Gleis 9", 19, 18, "gleis9")
    m.sign("Gleis 7", 8, 18, "gleis7")
    return m


def muenchen():
    W, H = 44, 32
    mb = blank(W, H, name="München")
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    mb.autofill(0, 26, W - 1, 29, A_BRICK)                  # Fußgängerzone
    BM.put(mb, BM.RATHAUS, 3, 1)                             # Neues Rathaus (Marienplatz)
    BM.put(mb, B2.VHS_BAU, 15, 2)                            # Residenz
    BM.put(mb, BM.BLOCK_E, 25, 1)
    # Biergarten (Ost)
    mb.fill(31, 10, 43, 22, OUT(0, 1), 0)
    BM.put(mb, BM.STALL, 35, 11)
    for (x, y) in ((33, 17), (37, 17), (33, 20), (37, 20), (41, 17)):
        mb.block(x, y, [[ST(12, 5), ST(12, 6)]])
    for (x, y) in ((31, 10), (41, 10), (32, 22)):
        BM.tree(mb, x, y)
    # Englischer Garten mit Eisbach (West)
    mb.fill(0, 12, 14, 24, OUT(0, 1), 0)
    mb.autofill(4, 12, 6, 24, A_WATER)
    for (x, y) in ((0, 13), (9, 13), (11, 18), (0, 19), (9, 21)):
        BM.tree(mb, x, y)
    m = PMap("muenchen", "München", mb, bgm="Safari Zone exterior", outdoor=True, city="muenchen")
    m.autorun("Ankunft M", "muenchen_ankunft", "!flag('muenchen_ankunft')")
    m.npc("Carmen", 21, 26, C['carmen'], "carmen_muc", dir="down")
    m.npc("Resi", 38, 15, C['resi'], "resi", dir="down")
    m.sign("Biergarten", 36, 16, "biergarten_muc")
    m.npc("Surfer", 7, 17, C['surfer'], "surfer", dir="left")
    m.sign("Eisbach", 6, 16, "eisbach")
    m.sign("Glockenspiel", 7, 9, "glockenspiel")
    m.sign("Briefkasten", 26, 25, "postkarte_muc")
    m.npc("Münchner", 17, 22, C['lehmann'], "muenchner", move="LL..RR..")
    m.npc("Touristin M", 28, 23, C['tourist2'], "touristin_muc", dir="left")
    for i, x in enumerate(range(19, 24)):
        m.ev("Zum Hbf M", x, 31, [m.page(trigger="touch", talk="muc_hbf")])
    return m


def dresden():
    W, H = 40, 26
    mb = blank(W, H, name="Dresden")
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    mb.autofill(0, 20, W - 1, H - 1, A_SEA)                 # Elbe
    mb.autofill(0, 17, W - 1, 19, A_BRICK)                  # Brühlsche Terrasse
    BM.put(mb, B2.VHS_BAU, 15, 6)                           # Frauenkirche (barocker Bau)
    BM.put(mb, BM.RATHAUS, 2, 2)                            # Zwinger / Semperoper
    BM.put(mb, BM.BLOCK_A, 30, 2)
    # Brücke »Blaues Wunder« (nur angedeutet)
    for y in range(20, H):
        for x in (34, 35, 36):
            mb.set(x, y, ST(0, 7), 1)
        mb.set(33, y, ST(6, 2), 2); mb.set(37, y, ST(6, 2), 2)
    for (x, y) in ((11, 12), (26, 12), (1, 12)):
        BM.tree(mb, x, y)
    BM.put(mb, BM.STALL, 23, 13)
    m = PMap("dresden", "Dresden", mb, bgm="Tiall", outdoor=True, city="dresden")
    m.autorun("Ankunft D", "dresden_ankunft", "!flag('dresden_ankunft')")
    m.npc("Oksana", 18, 13, C['oksana'], "oksana", dir="down")
    m.sign("Infotafel", 15, 12, "frauenkirche_tafel")
    m.npc("Herr Lehmann", 25, 16, C['lehmann'], "lehmann", dir="down")
    m.sign("Elbe", 20, 20, "elbe")
    m.npc("Kind D", 9, 16, C['kind'], "kind_dresden", move="random")
    m.npc("Touristin D", 30, 15, C['tourist2'], "touristin_dd", dir="left")
    for i, y in enumerate(range(13, 17)):
        m.ev("Zum Hbf D", 0, y, [m.page(trigger="touch", talk="dd_hbf")])
    return m


ALL = [frankfurt_hbf, muenchen, dresden]
