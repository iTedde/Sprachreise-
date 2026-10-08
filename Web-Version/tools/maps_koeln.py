"""Köln: Ehrenfeld (Venloer Straße, Körnerstraße), Innenräume, Veedelsfest."""
from portmap import *

C = dict(BM.C)
C.update({
    'hoffmann': "OW 04", 'brueckner': "OW 36", 'aga': "OW 22", 'luca': "OW 83", 'wagner': "OW 21", 'yara': "OW 55",
    'jansen': "OW 11", 'makler': "OW 15", 'bank': "TR 049", 'kunden': "OW 52", 'oezdemir': "OW 19_1", 'arzt': "TR 048",
    'mfa': "TR 128", 'schmitz': "TR 110", 'ioana': "OW 39", 'ralf': "OW 17", 'dieter': "TR 134", 'engel': "OW 14_1",
    'patient': "OW 18", 'kofi': "TR 052", 'koebes': "OW 20", 'kind': "TR 174", 'frau1': "OW 23", 'mann1': "OW 05",
    'mann2': "TR 067", 'frau2': "TR 062", 'band': "OW 71", 'sicherheit': "TR 106",
})

KLINIK = (52, 24, 17, 9, 7)        # moderner Großbau, Tür (4,6)
BLUE_DOOR = (23, 26, 8, 7, 3)      # blaues Haus mit Tür (2,2)
STALL = BM.STALL                   # Marktstand 6x4


def ehrenfeld_base(name="Köln-Ehrenfeld", fest=False):
    W, H = 50, 36
    mb = blank(W, H, name=name)
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    if not fest:
        BM.road(mb, 0, 9, W - 1, 11)              # Venloer Straße
        BM.road(mb, 22, 12, 24, H - 1)            # Körnerstraße
    else:
        mb.fill(0, 9, W - 1, 11, ST(0, 3), 0)     # Straße gesperrt: Festplatz
        mb.fill(22, 12, 24, H - 1, ST(0, 3), 0)
    # Nordseite
    BM.put(mb, KLINIK, 1, 1)                      # St.-Marien-Klinikum, Tür (5,7)
    BM.put(mb, BM.RATHAUS, 12, 0)                 # Kundenzentrum, Tür (16,7)
    BM.put(mb, BM.HOUSE_DOOR, 23, 3)              # Rheinbank, Tür (25,7)
    BM.put(mb, BM.SHOP_GREEN, 30, 4)              # Café »Da Luca«, Tür (31,7)
    BM.put(mb, BLUE_DOOR, 38, 5)                  # Krankenkasse, Tür (40,7)
    BM.tree(mb, 45, 2)
    # Südwest
    BM.put(mb, BM.HOUSE_DOOR, 3, 14)              # Arztpraxis, Tür (5,18)
    BM.put(mb, BM.SHOP_GREEN, 10, 15)             # Apotheke, Tür (11,18)
    BM.put(mb, BM.RATHAUS, 2, 25)                 # Ausländerbehörde, Tür (6,32)
    BM.tree(mb, 16, 21); BM.tree(mb, 13, 27)
    # Körnerstraße Ost
    BM.put(mb, BM.HOUSE_DOOR, 27, 14)             # Körnerstraße 21, Tür (29,18)
    BM.put(mb, BM.HOUSE_DOOR, 34, 14)             # Körnerstraße 8, Tür (36,18)
    BM.put(mb, BM.BLOCK_D, 41, 13)
    for x in (27, 31, 35):
        BM.tree(mb, x, 22)
    # Park Richtung Rhein
    mb.fill(28, 26, 48, 34, OUT(0, 1), 0)
    for (x, y) in ((29, 27), (34, 29), (40, 27), (45, 30), (30, 31)):
        BM.tree(mb, x, y)
    for x in (37, 42):
        mb.block(x, 33, [[ST(12, 5), ST(12, 6)]])
    BM.put(mb, BM.BIKES, 19, 13)
    for x in (8, 46):
        BM.put(mb, BM.SIGNBOARD, x, 12)
    if fest:
        for x in (1, 8, 15, 28, 35, 42):
            BM.put(mb, STALL, x, 8)
        mb.block(20, 24, [[ST(12, 5), ST(12, 6)]]); mb.block(26, 24, [[ST(12, 5), ST(12, 6)]])
    return mb


def ehrenfeld():
    mb = ehrenfeld_base()
    m = PMap("ehrenfeld", "Köln-Ehrenfeld", mb, bgm="Route 2", outdoor=True, city="koeln")
    for i, y in enumerate(range(9, 12)):
        m.warp("Zum Hbf", 49, y, "koeln_hbf", 1, 8 + i, "right")
    for i, y in enumerate(range(28, 31)):
        m.warp("Zum Rhein", 49, y, "rheinufer", 1, 12 + i, "right", cond="ep() >= 5", blocked="rhein_noch_nicht")
    m.door("Tür Klinikum", 5, 7, "klinik", 5, 7, "up", cond="ep() >= 4", locked="klinik_zu")
    m.door("Tür Kundenzentrum", 16, 7, "kundenzentrum_koeln", 1, 6, "right", cond="flag('job_zusage')", locked="kz_zu")
    m.door("Tür Bank", 25, 7, "bank", 1, 5, "right", cond="flag('job_zusage')", locked="bank_zu")
    m.door("Tür Café", 31, 7, "cafe_luca", 4, 7, "up")
    m.door("Tür Krankenkasse", 40, 7, "krankenkasse", 5, 8, "up", cond="ep() >= 6", locked="kk_zu")
    m.door("Tür Arztpraxis", 5, 18, "arztpraxis", 5, 10, "up", cond="ep() >= 6", locked="praxis_zu")
    m.door("Tür Apotheke", 11, 18, "apotheke", 4, 7, "up", cond="ep() >= 6", locked="apotheke_zu")
    m.door("Tür Ausländerbehörde", 6, 32, "auslaenderbehoerde", 6, 8, "up", cond="ep() >= 8 && flag('abh_termin') && hasDoc('erklaerung') && !flag('abh_fertig')", locked="abh_zu")
    m.door("Tür Körnerstr. 21", 29, 18, "wohnung", 3, 8, "up", cond="flag('schluessel')", locked="koerner21")
    m.door("Tür Körnerstr. 8", 36, 18, "besichtigung", 6, 7, "up", cond="flag('besichtigung1') && !flag('besichtigung1_done')", locked="koerner8")
    m.sign("Klingel 21", 30, 18, "koerner21")
    m.sign("Schild KVB", 46, 12, "kvb")
    m.sign("Schild Venloer", 8, 12, "schild_venloer")
    m.sign("Parkbank", 37, 33, "parkbank_koeln")
    m.npc("Herr Wagner", 31, 19, C['wagner'], "wagner", dir="down", cond="flag('wagner_draussen')")
    m.npc("Kölner E", 20, 12, C['koebes'], "koelner_ehrenfeld", move="LL..RR..")
    m.npc("Frau Kiosk", 43, 19, C['frau1'], "kiosk_frau")
    m.npc("Radfahrer", 33, 24, C['mann1'], "radfahrer", move="random")
    m.npc("Mutter K", 12, 22, C['frau2'], "mutter_koeln", move="random", freq=2)
    return m


def stadtfest():
    mb = ehrenfeld_base("Veedelsfest Ehrenfeld", fest=True)
    m = PMap("stadtfest", "Veedelsfest Ehrenfeld", mb, bgm="Radio - March", outdoor=True, city="koeln")
    for i, y in enumerate(range(9, 12)):
        m.warp("Zum Hbf", 49, y, "koeln_hbf", 1, 8 + i, "right", cond="flag('fest_done')", blocked="fest_bleiben")
    m.door("Tür Körnerstr. 21", 29, 18, "wohnung", 3, 8, "up")
    m.npc("Luca", 4, 12, C['luca'], "fest_luca", dir="up")
    m.npc("Yara", 11, 12, C['yara'], "fest_yara", dir="up")
    m.npc("Aga", 18, 12, C['aga'], "fest_aga", dir="up")
    m.npc("Kofi", 31, 12, C['kofi'], "fest_kofi", dir="up")
    m.npc("Bierstand", 38, 12, C['koebes'], "fest_bier", dir="up")
    m.npc("Ralf", 39, 14, C['ralf'], "ralf", dir="left", cond="!flag('nmm_ende')")
    m.npc("Herr Wagner", 41, 14, C['wagner'], "fest_wagner", dir="left")
    m.npc("Band", 46, 12, C['band'], "fest_band", step=True)
    m.npc("Ioana", 25, 15, C['ioana'], "ioana", dir="down")
    m.npc("Kind F", 21, 20, C['kind'], "fest_kind", move="random")
    m.npc("Dieter", 13, 14, C['dieter'], "dieter", dir="up", cond="flag('eskalation') && !flag('eskalation_done')")
    m.npc("Frau F", 6, 14, C['frau1'], "fest_frau", dir="up")
    m.npc("Mann F", 33, 14, C['mann2'], "fest_mann", dir="up")
    m.npc("Oma F", 27, 21, C['engel'], "fest_oma", dir="left")
    m.autorun("Fest-Start", "fest_start", "!flag('fest_start')")
    return m


# --- Innenräume ---------------------------------------------------------------------
def klinik():
    m = PMap("klinik", "St.-Marien-Klinikum · Verwaltung", interior(60), bgm="Lab", city="koeln")
    m.door("Ausgang", 5, 8, "ehrenfeld", 5, 8, "down", se="door_exit")
    m.door("Zur Station", 5, 1, "station", 6, 12, "up", cond="ep() >= 5", locked="station_zu")
    m.npc("Frau Hoffmann", 3, 2, C['hoffmann'], "hoffmann", dir="down")
    m.sign("Schreibtisch Hoffmann", 3, 3, "hoffmann")
    m.npc("Herr Kaiser", 9, 2, C['bank'], "kaiser", dir="down")
    m.sign("Personalabteilung", 9, 3, "kaiser")
    m.autorun("Gespräch", "vorstellung", "ep() == 4 && !flag('job_zusage')")
    return m


def station():
    mb = interior(4)
    remove_tiles(mb, POKE_MACHINE)
    for x in (1, 4, 9):
        bed(mb, x, 9)
    m = PMap("station", "St.-Marien-Klinikum · Station 3B", mb, bgm="Poke Center", city="koeln")
    m.door("Ausgang", 6, 13, "klinik", 5, 2, "down", se="door_exit")
    m.npc("Aga", 7, 5, C['aga'], "aga", dir="down")
    m.npc("Herr Brückner", 3, 6, C['brueckner'], "brueckner", dir="right")
    m.npc("Frau Engel", 2, 12, C['engel'], "frau_engel", dir="up")
    m.npc("Herr Demir", 10, 12, C['patient'], "herr_demir", dir="up")
    m.sign("Dienstplan", 9, 1, "dienstplan")
    m.sign("Kaffeemaschine", 4, 1, "stations_kaffee")
    m.autorun("Erster Tag", "erster_tag", "ep() == 5 && !flag('erster_tag_start')")
    return m


def kundenzentrum_koeln():
    m = PMap("kundenzentrum_koeln", "Kundenzentrum Ehrenfeld", interior(74), bgm="Lab", city="koeln")
    m.door("Ausgang", 0, 6, "ehrenfeld", 16, 8, "down", se="door_exit")
    m.door("Ausgang 2", 12, 6, "ehrenfeld", 16, 8, "down", se="door_exit")
    m.npc("Frau Berger", 6, 2, C['kunden'], "kz_schalter", dir="down")
    m.sign("Schalter", 6, 3, "kz_schalter")
    m.npc("Wartender KZ", 3, 7, C['mann1'], "kz_wartender", dir="up")
    m.npc("Frau KZ", 9, 8, C['frau2'], "kz_frau", dir="up")
    return m


def bank():
    m = PMap("bank", "Rheinbank · Filiale Ehrenfeld", interior(29), bgm="Lab", city="koeln")
    m.door("Ausgang", 0, 5, "ehrenfeld", 25, 8, "down", se="door_exit")
    m.door("Ausgang 2", 12, 5, "ehrenfeld", 25, 8, "down", se="door_exit")
    m.npc("Herr Yıldız", 5, 2, C['bank'], "bank_schalter", dir="down")
    m.sign("Bankschalter", 5, 3, "bank_schalter")
    m.sign("Geldautomat", 8, 3, "geldautomat")
    m.npc("Kundin Bank", 9, 6, C['frau1'], "bank_kundin", dir="up")
    return m


def cafe_luca():
    m = PMap("cafe_luca", "Café »Da Luca«", interior(27), bgm="Islands", announce=False, city="koeln")
    m.door("Ausgang", 4, 8, "ehrenfeld", 31, 8, "down", se="door_exit")
    m.npc("Luca", 2, 2, C['luca'], "luca", dir="down")
    m.sign("Theke Luca", 2, 3, "luca")
    m.sign("Theke Luca 2", 3, 3, "luca")
    m.npc("Gast Café", 6, 5, C['mann2'], "cafe_gast", dir="right")
    m.npc("Aga Café", 9, 5, C['aga'], "aga_cafe", cond="flag('cafe2_aga') && !done('q_cafe2')", dir="left")
    m.sign("Kuchentheke", 10, 1, "kuchentheke")
    return m


def besichtigung():
    m = PMap("besichtigung", "Wohnungsbesichtigung · Körnerstraße 8", interior(6), bgm="Gym", announce=False, city="koeln")
    m.door("Ausgang", 6, 8, "ehrenfeld", 36, 19, "down", se="door_exit")
    m.npc("Herr Krämer", 6, 3, C['makler'], "makler", dir="down")
    chars = [C['mann1'], C['frau1'], C['mann2'], C['frau2'], C['student'], C['joggerin'], C['rentner'], C['pendler'], C['kind'], C['mutter']]
    pos = ((1, 2), (3, 2), (5, 2), (8, 3), (1, 6), (2, 6), (7, 6), (8, 6), (5, 5), (0, 4))
    dirs = ["down", "down", "down", "left", "up", "up", "up", "up", "up", "right"]
    for i, (x, y) in enumerate(pos):
        m.npc("Interessent %d" % (i + 1), x, y, chars[i], "interessent", dir=dirs[i])
    m.autorun("Besichtigung", "besichtigung_start", "!flag('besichtigung1_start')")
    return m


def wohnung():
    mb = interior(8)
    bed(mb, 10, 2)
    m = PMap("wohnung", "Meine Wohnung · Körnerstraße 21", mb, bgm="Lappet Town", announce=False, city="koeln")
    m.ev("Ausgang", 3, 9, [
        m.page(trigger="touch", transfer={"map": "ehrenfeld", "x": 29, "y": 19, "dir": 2, "se": "door_exit"}),
        m.page(trigger="touch", cond="ep() == 9 && flag('fest_bereit') && !flag('fest_done')",
               transfer={"map": "stadtfest", "x": 29, "y": 19, "dir": 2, "se": "door_exit"}),
    ])
    m.sign("Bett W", 11, 3, "bett_koeln")
    m.sign("Küche", 1, 1, "kueche_koeln")
    m.sign("Tisch", 6, 4, "tisch_koeln")
    m.sign("Laptop W", 7, 1, "laptop_koeln")
    m.npc("Herr Wagner", 4, 7, C['wagner'], "wagner_besuch", cond="flag('wagner_suppe') && !flag('wagner_suppe_done')", dir="up")
    m.autorun("Einzug", "einzug", "flag('schluessel') && !flag('eingezogen')")
    m.autorun("Ep6 Start", "ep6_start", "ep() == 6 && !flag('ep6_started')")
    m.autorun("Ep8 Start", "ep8_start", "ep() == 8 && !flag('ep8_started')")
    m.autorun("Ep9 Start", "ep9_start", "ep() == 9 && !flag('ep9_started')")
    return m


def krankenkasse():
    m = PMap("krankenkasse", "Krankenkasse »RheinGesund«", interior(30), bgm="Lab", city="koeln")
    m.door("Ausgang", 5, 9, "ehrenfeld", 40, 8, "down", se="door_exit")
    m.npc("Frau Özdemir", 5, 2, C['oezdemir'], "kk_schalter", dir="down")
    m.sign("KK-Schalter", 5, 3, "kk_schalter")
    m.sign("Fotoautomat", 10, 2, "fotoautomat")
    m.npc("Kunde KK", 2, 6, C['rentner'], "kk_kunde", dir="right")
    return m


def arztpraxis():
    m = PMap("arztpraxis", "Hausarztpraxis Dr. Weber", interior(26), bgm="Poke Center", announce=False, city="koeln")
    m.door("Ausgang", 5, 11, "ehrenfeld", 5, 19, "down", se="door_exit")
    m.npc("Frau Lang", 2, 2, C['mfa'], "praxis_anmeldung", dir="down")
    m.sign("Behandlungszimmer", 9, 1, "behandlung")
    m.npc("Patient 1", 3, 5, C['rentner'], "wartezimmer1", dir="right")
    m.npc("Patient 2", 8, 7, C['frau2'], "wartezimmer2", dir="left")
    m.sign("Zeitschriften", 6, 1, "zeitschriften")
    return m


def apotheke():
    m = PMap("apotheke", "Venloer Apotheke", interior(25), bgm="Poke Mart", announce=False, city="koeln")
    m.door("Ausgang", 4, 8, "ehrenfeld", 11, 19, "down", se="door_exit")
    m.npc("Yara", 2, 3, C['yara'], "yara", dir="down")
    m.sign("Apothekentheke", 2, 4, "yara")
    m.sign("Regal A", 7, 5, "apo_regal")
    return m


def auslaenderbehoerde():
    mb = interior(62)
    remove_tiles(mb, POKE_MACHINE)
    m = PMap("auslaenderbehoerde", "Ausländerbehörde Köln", mb, bgm="Cave", city="koeln")
    for x in (6, 7):
        m.door("Ausgang", x, 9, "ehrenfeld", 6, 33, "down", se="door_exit")
    m.npc("Herr Schmitz", 11, 2, C['schmitz'], "schmitz", dir="down")
    m.sign("Zimmer 214", 11, 3, "schmitz")
    m.sign("Anzeige ABH", 6, 3, "abh_anzeige")
    m.npc("Wartende A", 2, 5, C['frau2'], "abh_wartende", dir="right")
    m.npc("Wartender B", 12, 6, C['mann1'], "abh_wartender", dir="left")
    m.npc("Vater", 4, 7, C['mann2'], "abh_vater", dir="up")
    m.autorun("ABH", "abh_start", "!flag('abh_drin')")
    return m


ALL = [ehrenfeld, stadtfest, klinik, station, kundenzentrum_koeln, bank, cafe_luca, besichtigung, wohnung,
       krankenkasse, arztpraxis, apotheke, auslaenderbehoerde]


# --- Rheinufer (Episode 5: Fahrradtour) ----------------------------------------------
def rheinufer():
    W, H = 56, 24
    mb = blank(W, H, name="Rheinufer")
    mb.autofill(0, 0, W - 1, H - 1, A_WALK)
    mb.fill(0, 10, W - 1, H - 1, OUT(0, 1), 0)          # Wiese
    mb.autofill(0, 0, W - 1, 6, A_SEA)                  # der Rhein
    mb.autofill(0, 7, W - 1, 9, A_BRICK)                # Promenade
    BM.road(mb, 0, 11, 9, 13)                           # Weg von Ehrenfeld
    mb.autofill(10, 11, 45, 13, A_BRICK)                # Radweg
    # Hohenzollernbrücke (über den Rhein, nicht begehbar)
    for y in range(0, 7):
        for x in (38, 39, 40, 41):
            mb.set(x, y, ST(0, 7), 1)
        mb.set(37, y, ST(6, 2), 2); mb.set(42, y, ST(6, 2), 2)
    # Kranhäuser
    BM.put(mb, BM.TOWER, 13, 15, layers=(1, 2), keep_ground=False)
    BM.put(mb, BM.TOWER, 22, 15, layers=(1, 2), keep_ground=False)
    # Fahrradverleih
    BM.put(mb, BM.STALL, 3, 15)
    BM.put(mb, BM.BIKES, 3, 19); BM.put(mb, BM.BIKES, 6, 19)
    # Biergarten
    BM.put(mb, BM.STALL, 47, 14)
    for (x, y) in ((45, 19), (49, 19), (45, 21), (49, 21)):
        mb.block(x, y, [[ST(12, 5), ST(12, 6)]])
    for (x, y) in ((31, 15), (35, 18), (52, 10), (30, 20)):
        BM.tree(mb, x, y)
    for x in (12, 20, 28, 33):
        mb.block(x, 10, [[ST(12, 5), ST(12, 6)]])
    m = PMap("rheinufer", "Rheinufer", mb, bgm="Natural Park", outdoor=True, city="koeln")
    for i, y in enumerate(range(11, 14)):
        m.warp("Nach Ehrenfeld", 0, y, "ehrenfeld", 48, 28 + i, "left", cond="!flag('radtour_unterwegs')", blocked="rad_weiter")
    m.npc("Verleih", 6, 18, C['mann1'], "fahrradverleih", dir="down")
    m.npc("Aga", 2, 13, C['aga'], "aga_rad", cond="flag('radtour_treffen') && !flag('radtour_unterwegs')", dir="right")
    m.npc("Luca", 2, 11, C['luca'], "luca_rad", cond="flag('radtour_treffen') && !flag('radtour_unterwegs')", dir="right")
    m.touch("Stopp Brücke", 39, 9, "stopp_bruecke", cond="flag('radtour_unterwegs') && !flag('stopp_bruecke')")
    m.touch("Stopp Brücke 2", 39, 8, "stopp_bruecke", cond="flag('radtour_unterwegs') && !flag('stopp_bruecke')")
    m.touch("Stopp Kranhäuser", 22, 13, "stopp_kran", cond="flag('radtour_unterwegs') && !flag('stopp_kran')")
    m.touch("Stopp Kranhäuser 2", 22, 12, "stopp_kran", cond="flag('radtour_unterwegs') && !flag('stopp_kran')")
    m.touch("Stopp Kranhäuser 3", 22, 11, "stopp_kran", cond="flag('radtour_unterwegs') && !flag('stopp_kran')")
    m.npc("Köbes", 49, 17, C['koebes'], "koebes", dir="down")
    m.touch("Biergarten", 47, 19, "biergarten", cond="flag('radtour_unterwegs') && flag('stopp_bruecke') && flag('stopp_kran') && !flag('radtour_done')")
    m.npc("Aga BG", 46, 19, C['aga'], "aga_bg", cond="flag('radtour_done')", dir="right")
    m.npc("Luca BG", 50, 19, C['luca'], "luca_bg", cond="flag('radtour_done')", dir="left")
    m.sign("Schild Rhein", 30, 8, "schild_rhein")
    m.sign("Liebesschlösser", 37, 7, "schloesser")
    m.npc("Angler", 18, 8, C['rentner'], "angler", dir="up")
    m.npc("Joggerin R", 26, 9, C['joggerin'], "joggerin_rhein", move="RRRRRRRRLLLLLLLL", speed=4, freq=6)
    return m


ALL.append(rheinufer)
