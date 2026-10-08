"""Episode 3 – Berlin: westliche Turmstraße (Supermarkt, Eckhaus, Volkshochschule) und Innenräume."""
from portmap import *

C = dict(BM.C)
C.update({
    'kofi': "TR 052", 'carmen': "OW 29", 'kassiererin': "OW 23", 'filialleiter': "OW 18", 'vhs_frau': "OW 19",
    'kellner': "TR 128", 'fan1': "OW 71", 'fan2': "TR 130", 'oma': "OW 14_1", 'kind2': "TR 174",
    'kursteiln': "TR 067", 'student2': "OW 03",
})

SUPERMARKT = (23, 33, 18, 7, 5)      # Glashalle (Lerucean Town) -> Supermarkt
VHS_BAU = (7, 31, 16, 7, 5)          # Bau mit Bogentür (Cedolan City) -> Volkshochschule
BLUE_HOUSE = (23, 5, 4, 6, 4)        # kleines Wohnhaus, blaues Dach
FOUNTAIN = (7, 8, 16, 4, 4)          # Brunnenplatz


def turmstrasse():
    W, H = 40, 22
    mb = blank(W, H, name="Turmstraße")
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    BM.road(mb, 0, 8, W - 1, 10)
    # Häuser im Hintergrund (Nordseite)
    BM.put(mb, BM.BLOCK_C, 11, 0)
    BM.put(mb, BM.BLOCK_D, 33, 1)
    BM.put(mb, SUPERMARKT, 2, 2)
    BM.put(mb, BM.SHOP_GREEN, 15, 3)          # Eckhaus (Café & Kneipe), Tür bei (16,6)
    BM.put(mb, VHS_BAU, 23, 2)                # VHS, Tür bei (26,6)
    BM.put(mb, BM.BIKES, 21, 6)
    # Südseite: kleiner Park, Spielplatz, Haltestelle
    for x in (1, 5, 9, 31, 35):
        BM.tree(mb, x, 14)
    for x in (14, 23):
        BM.tree(mb, x, 13)
    for x in (17, 20):
        mb.block(x, 15, [[ST(12, 5), ST(12, 6)]])
    for x in (13, 26):
        BM.put(mb, BM.BUSH, x, 16)
    for x in (8, 19, 29):
        BM.put(mb, BM.SIGNBOARD, x, 7)
    BM.put(mb, BLUE_HOUSE, 2, 18)
    BM.put(mb, BLUE_HOUSE, 30, 18)
    BM.put(mb, BM.SIGNBOARD, 27, 12)
    m = PMap("turmstrasse", "Turmstraße", mb, bgm="Route 1", outdoor=True, city="berlin")
    for i, y in enumerate(range(8, 11)):
        m.warp("Nach Moabit", 39, y, "moabit", 1, 13 + i, "right")
    m.door("Tür Supermarkt", 5, 6, "supermarkt", 5, 13, "up", cond="ep() >= 3", locked="supermarkt_zu")
    m.door("Tür Eckhaus", 16, 6, "eckhaus", 6, 8, "up", cond="ep() >= 3", locked="eckhaus_zu")
    m.door("Tür VHS", 26, 6, "vhs_berlin", 7, 6, "up", cond="ep() >= 3", locked="vhs_zu")
    m.sign("Schild Supermarkt", 8, 7, "schild_supermarkt")
    m.sign("Eckhaus-Tafel", 19, 7, "schild_eckhaus")
    m.sign("VHS-Schild", 29, 7, "schild_vhs")
    m.sign("Haltestelle T", 27, 12, "haltestelle_turm")
    m.sign("Parkbank", 17, 15, "parkbank_turm")
    m.npc("Oma Hilde", 22, 12, C['oma'], "oma_hilde", dir="down")
    m.npc("Kind Spielplatz", 11, 13, C['kind2'], "kind_turm", move="random")
    m.npc("Student T", 33, 11, C['student2'], "student_turm", move="LL..RR..")
    m.npc("Kofi", 14, 11, C['kofi'], "kofi_turm", cond="ep() == 3 && flag('fussball_done')", dir="down")
    return m


def supermarkt():
    mb = interior(15)
    # Treppe/Aufzug oben bleiben (Lager), Ausgang unten: Fußmatte aus dem Erdgeschoss
    for i, x in enumerate((4, 5, 6)):
        mb.set(x, 14, 576 + i, 1)
        mb.set(x, 15, 584 + i, 1)
        mb.set(x, 15, 420, 0)
    m = PMap("supermarkt", "Supermarkt »Frisch & Fröhlich«", mb, bgm="Poke Mart", announce=False, city="berlin")
    for x in (4, 5, 6):
        m.door("Ausgang", x, 15, "turmstrasse", 5, 7, "down", se="door_exit")
    m.sign("Kühlregal", 11, 5, "regal_kuehl")
    m.sign("Kühlregal 2", 12, 5, "regal_kuehl")
    m.sign("Regal Obst", 7, 9, "regal_obst")
    m.sign("Regal Gemüse", 8, 9, "regal_gemuese")
    m.sign("Regal Brot", 10, 9, "regal_brot")
    m.sign("Regal Trocken", 11, 9, "regal_trocken")
    m.sign("Regal Süß", 7, 13, "regal_suess")
    m.sign("Regal Getränke", 8, 13, "regal_getraenke")
    m.sign("Regal Haushalt", 10, 13, "regal_haushalt")
    m.sign("Regal Angebote", 11, 13, "regal_angebote")
    m.sign("Kasse", 2, 7, "kasse")
    m.sign("Pfandautomat", 1, 11, "pfandautomat")
    m.sign("Sonderangebote", 2, 13, "sonderangebote")
    m.sign("Aufzug", 6, 1, "lager")
    m.npc("Kassiererin", 1, 6, C['kassiererin'], "kassiererin", dir="right")
    m.npc("Jonas", 6, 12, C['jonas'], "jonas_markt", cond="active('q_einkauf') && stepDone('q_einkauf', 'markt')", dir="up")
    m.npc("Kunde", 12, 10, C['rentner'], "kunde_markt", move="UU..DD..")
    m.npc("Filialleiter", 9, 6, C['filialleiter'], "filialleiter", dir="down")
    m.autorun("Eintritt", "supermarkt_eintritt", "active('q_einkauf') && stepDone('q_einkauf', 'liste') && !stepDone('q_einkauf', 'markt')")
    return m


def eckhaus():
    mb = interior(12)
    m = PMap("eckhaus", "Café & Kneipe »Eckhaus«", mb, bgm="Game Corner", announce=False, city="berlin")
    for x in (6, 7):
        m.door("Ausgang", x, 9, "turmstrasse", 16, 7, "down", se="door_exit")
    m.npc("Kellnerin", 8, 8, C['kellner'], "eckhaus_theke", dir="left")
    m.sign("Theke", 6, 6, "eckhaus_theke")
    m.sign("Theke 2", 7, 6, "eckhaus_theke")
    m.sign("Fernseher", 9, 1, "eckhaus_tv")
    m.sign("Bild", 10, 1, "eckhaus_tv")
    m.npc("Kofi", 12, 5, C['kofi'], "kofi_eckhaus", cond="flag('fussball_abend') && !flag('fussball_done')", dir="left")
    m.npc("Jonas", 8, 5, C['jonas'], "jonas_eckhaus", cond="flag('fussball_abend') && !flag('fussball_done')", dir="right")
    m.npc("Fan", 12, 6, C['fan1'], "fan_eckhaus", cond="flag('fussball_abend')", dir="up")
    m.npc("Fan 2", 9, 3, C['fan2'], "fan2_eckhaus", cond="flag('fussball_abend')", dir="down")
    m.npc("Gast", 0, 4, C['mutter'], "gast_eckhaus", cond="!flag('fussball_abend')", dir="right")
    m.npc("Laptop-Mann", 3, 7, C['student'], "laptop_mann", cond="!flag('fussball_abend')", dir="up")
    m.autorun("Fußball", "fussball_start", "flag('fussball_abend') && !flag('fussball_done')")
    return m


def vhs_berlin():
    mb = interior(58)
    m = PMap("vhs_berlin", "Volkshochschule Berlin-Mitte", mb, bgm="Lab", announce=True, city="berlin")
    for x in (6, 7):
        m.door("Ausgang", x, 7, "turmstrasse", 26, 7, "down", se="door_exit")
    m.npc("Frau Albrecht", 6, 3, C['vhs_frau'], "vhs_empfang", dir="down")
    m.sign("Testplatz", 2, 3, "vhs_test")
    m.npc("Carmen", 12, 5, C['carmen'], "carmen_vhs", dir="left")
    m.npc("Kursteilnehmer", 13, 6, C['kursteiln'], "vhs_teilnehmer", dir="left")
    m.sign("Aushang VHS", 11, 0, "vhs_aushang")
    return m


ALL = [turmstrasse, supermarkt, eckhaus, vhs_berlin]
