"""Episode 10 – Hamburg: Hauptbahnhof, Hafen-Viertel, WG, Kundenzentrum, VHS (Prüfung)."""
from portmap import *
import maps_berlin2 as B2

C = dict(BM.C)
C.update({'mai': BM.C['mai'], 'jensen': "TR 129", 'albers': "TR 087", 'dilnoza': "TR 083", 'amani': "OW 45",
          'fisch': "OW 20", 'seemann': "OW 12", 'frau1': "OW 23", 'mann1': "OW 05", 'kind': "TR 174", 'mann2': "TR 067",
          'pruefer': "TR 141"})


def hamburg_hbf():
    mb = BM.build_hbf()
    m = PMap("hamburg_hbf", "Hamburg Hauptbahnhof", mb, bgm="Route 3", city="hamburg")
    m.autorun("Ankunft HH", "hamburg_ankunft", "!flag('hamburg_ankunft')")
    m.sign("Abfahrtstafel HH", 5, 13, "hh_tafel")
    m.sign("Reisezentrum HH", 19, 12, "hh_reisezentrum")
    m.mb.set(19, 12, ST(4, 6), 1)
    m.npc("Amani", 16, 15, C['amani'], "amani", cond="flag('b1_bestanden') && !flag('amani_done')", dir="down")
    m.npc("Pendler HH", 8, 16, C['pendler'], "pendler_hh", move="RRRRRR.LLLLLL.", freq=5, speed=4)
    m.npc("Bäckerin HH", 27, 15, C['baecker'], "baecker_hh")
    BM.put(m.mb, BM.STALL, 25, 11)
    for i, x in enumerate(range(13, 19)):
        m.warp("Ausgang HH", x, 0, "hamburg", 22 + i, 1, "down")
    return m


def hamburg():
    W, H = 50, 34
    mb = blank(W, H, name="Hamburg")
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    BM.road(mb, 0, 10, W - 1, 12)                       # Straße am Hafen
    mb.autofill(0, 24, W - 1, H - 1, A_SEA)             # Elbe / Hafen
    mb.autofill(0, 21, W - 1, 23, A_BRICK)              # Uferpromenade
    # Landungsbrücken (Steg ins Wasser)
    for y in range(24, 30):
        for x in range(20, 27):
            mb.set(x, y, ST(1, 3), 1)
    BM.put(mb, BM.HOUSE_DOOR, 3, 4)                      # Kundenzentrum Altona, Tür (5,8)
    BM.put(mb, B2.VHS_BAU, 11, 3)                        # VHS Hamburg, Tür (14,7)
    BM.put(mb, BM.BLOCK_A, 29, 1)                        # Speicherstadt-Block
    BM.put(mb, BM.HOUSE_DOOR, 38, 4)                     # WG Hafenstraße 7, Tür (40,8)
    BM.put(mb, BM.STALL, 4, 15)                          # Fischbrötchen
    for (x, y) in ((14, 15), (35, 15), (44, 15)):
        BM.tree(mb, x, y)
    for x in (17, 27, 31):
        mb.block(x, 19, [[ST(12, 5), ST(12, 6)]])
    m = PMap("hamburg", "Hamburg · St. Pauli", mb, bgm="Islands", outdoor=True, city="hamburg")
    for i, x in enumerate(range(22, 28)):
        m.warp("Zum Hbf HH", x, 0, "hamburg_hbf", 13 + min(i, 5), 1, "down")
    m.door("Tür Kundenzentrum HH", 5, 8, "kundenzentrum_hh", 1, 6, "right", cond="flag('hh_wg')", locked="hh_kz_zu")
    m.door("Tür VHS HH", 14, 7, "vhs_hamburg", 7, 6, "up", cond="flag('pruefung_angemeldet') || flag('hh_brief')", locked="hh_vhs_zu")
    m.door("Tür WG HH", 40, 8, "hamburg_wg", 3, 8, "up")
    m.npc("Fischbrötchen", 7, 18, C['fisch'], "fischbroetchen", dir="down")
    m.npc("Seemann", 23, 22, C['seemann'], "seemann", dir="down")
    m.sign("Landungsbrücken", 22, 24, "landungsbruecken")
    m.sign("Speicherstadt", 32, 9, "speicherstadt")
    m.npc("Hamburgerin", 18, 13, C['frau1'], "hamburgerin", move="RRRR..LLLL..")
    m.npc("Kind HH", 36, 19, C['kind'], "kind_hh", move="random")
    return m


def hamburg_wg():
    mb = interior(3)
    m = PMap("hamburg_wg", "WG Hafenstraße 7", mb, bgm="Lappet Town", announce=False, city="hamburg")
    m.door("Ausgang", 3, 9, "hamburg", 40, 9, "down", se="door_exit")
    m.ev("Treppe hoch", 10, 2, [m.page(trigger="touch", transfer={"map": "hamburg_wg", "x": 29, "y": 3, "dir": 2})])
    m.warp("Treppe runter", 28, 2, "hamburg_wg", 9, 3, "down")
    m.npc("Mai", 6, 5, C['mai'], "mai_hh", dir="up")
    m.sign("Laptop HH", 20, 2, "laptop_hh")
    m.sign("Bett HH", 21, 6, "bett_hh")
    m.sign("Fenster HH", 7, 1, "fenster_hh")
    m.sign("Tisch HH", 5, 5, "tisch_hh")
    m.autorun("WG HH", "hh_wg_ankunft", "!flag('hh_wg')")
    m.autorun("Brief HH", "hh_brief_scene", "flag('hh_ummeldung') && !flag('hh_brief')")
    m.autorun("Ergebnis", "hh_ergebnis", "flag('pruefung_done') && !flag('b1_bestanden')")
    return m


def kundenzentrum_hh():
    m = PMap("kundenzentrum_hh", "Kundenzentrum Altona", interior(46), bgm="Lab", city="hamburg")
    m.door("Ausgang", 0, 6, "hamburg", 5, 9, "down", se="door_exit")
    m.door("Ausgang 2", 12, 6, "hamburg", 5, 9, "down", se="door_exit")
    m.npc("Herr Jensen", 6, 2, C['jensen'], "jensen", dir="down")
    m.sign("Schalter HH", 6, 3, "jensen")
    m.npc("Wartende HH", 3, 8, C['frau1'], "kz_hh_wartende", dir="up")
    return m


def vhs_hamburg():
    m = PMap("vhs_hamburg", "Volkshochschule Hamburg · Prüfungszentrum", interior(58), bgm="Lab", city="hamburg")
    for x in (6, 7):
        m.door("Ausgang", x, 7, "hamburg", 14, 8, "down", se="door_exit")
    m.npc("Frau Albers", 6, 3, C['albers'], "albers", dir="down")
    m.npc("Dilnoza", 12, 5, C['dilnoza'], "dilnoza", dir="left")
    m.sign("Prüfungsplatz", 2, 3, "pruefungsplatz")
    m.sign("Aushang HH", 11, 0, "vhs_hh_aushang")
    return m


ALL = [hamburg_hbf, hamburg, hamburg_wg, kundenzentrum_hh, vhs_hamburg]
