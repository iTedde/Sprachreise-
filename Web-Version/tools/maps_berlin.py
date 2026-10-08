"""Berlin + Köln Hbf: die Karten der Essentials-Demo (Kacheln aus build_maps.py),
Events neu für den Port beschrieben."""
from portmap import *

C = dict(BM.C)
RAND = "random"


def route(seq):
    return seq        # Bewegungsfolge als String, z. B. "RRRR.LLLL." (wird wiederholt)


# ------------------------------------------------------------------------------
def hbf():
    m = PMap("hbf", "Berlin Hauptbahnhof", BM.build_hbf(), bgm="Cedolan City", city="berlin")
    m.autorun("Prolog", "prolog", "!flag('prolog_done')")
    m.npc("Tarek", 16, 15, C['tarek'], "tarek")
    m.sign("Abfahrtstafel", 5, 13, "hbf_tafel")
    m.sign("Hbf-Schild", 14, 10, "hbf_schild")
    m.npc("Pendler", 8, 16, C['pendler'], "hbf_pendler", move=route("RRRRRR.LLLLLL."), freq=5, speed=4)
    m.npc("Familie", 23, 15, C['familie'], "hbf_familie", dir="up")
    BM.put(m.mb, BM.STALL, 25, 11)
    m.npc("Baeckerin", 27, 15, C['baecker'], "baeckerei")
    m.sign("Fahrkartenautomat", 12, 5, "automat")
    m.mb.set(12, 5, ST(1, 7), 1)
    m.npc("Frau Kowalski", 13, 6, C['kowalski'], "kowalski", dir="left")
    m.npc("Taxifahrer", 5, 3, C['taxi'], "taxi")
    m.npc("Musiker", 20, 6, C['musiker'], "musiker", step=True)
    m.npc("Reisende", 26, 18, C['reisende'], "hbf_reisende", move=RAND)
    m.sign("Reisezentrum", 19, 12, "reisezentrum")
    m.mb.set(19, 12, ST(4, 6), 1)
    # Ankunft aus Köln/Hamburg (Episode 7/10): Gleis
    m.autorun("Ankunft Besuch", "hbf_besuch", "flag('besuch_berlin') && !flag('besuch_berlin_hbf')")
    for i, x in enumerate(range(13, 19)):
        m.warp("Ausgang", x, 0, "moabit", 14 + i, 34, "up", cond="flag('tarek_done')", blocked="hbf_noch_nicht")
    return m


def moabit():
    m = PMap("moabit", "Berlin-Moabit", BM.build_moabit(), bgm="Lerucean Town", outdoor=True, city="berlin")
    for i, x in enumerate(range(14, 20)):
        m.warp("Zum Hbf", x, 35, "hbf", 13 + i, 1, "down")
    m.door("Tür Bürgeramt", 11, 9, "buergeramt", 7, 9, "up", cond="flag('ep2_started')", locked="ba_zu")
    m.door("Tür Copyshop", 3, 20, "copyshop", 4, 7, "up", cond="flag('ep2_started')", locked="copy_zu")
    m.door("Tür Nr. 12", 32, 18, "wg", 3, 8, "up", cond="flag('wg_klingel_ok')", locked="wg_klingel")
    for (name, x, y, talk) in [("Schild Lehrter Str", 25, 27, "schild_lehrter"),
                               ("Schild Invalidenstr", 21, 33, "schild_invaliden"),
                               ("Schild Turmstr", 19, 16, "schild_turm"),
                               ("Schild Buergeramt", 15, 10, "schild_ba"),
                               ("Haltestelle", 8, 28, "haltestelle"),
                               ("Baustellenschild", 37, 33, "baustelle")]:
        BM.put(m.mb, BM.SIGNBOARD, x, y)
        m.sign(name, x, y, talk)
    m.sign("Haus Nr. 10", 31, 26, "haus10")
    m.sign("Haus Nr. 14", 31, 12, "haus14")
    m.sign("Haus Nr. 11", 22, 10, "haus11")
    m.sign("Klingel Nr. 12", 33, 19, "wg_klingel")
    m.sign("Spaeti-Schild", 18, 19, "spaeti_schild")
    for i, (x, src) in enumerate([(39, (10, 19)), (40, (15, 20)), (41, (16, 20)), (42, (10, 18))]):
        m.mb.stamp(23, src[0], src[1], 1, 1, x, 12, layers=(1, 2), keep_ground=True, ground_skip=BM.GROUND_SKIP)
        m.sign("Tonne%d" % (i + 1), x, 12, "tonne_%d" % (i + 1))
    m.npc("Ercan", 14, 21, C['ercan'], "ercan")
    m.npc("Frau Schulz", 38, 15, C['schulz'], "schulz", move=route("LL..RR..d"), freq=2)
    m.npc("Herr Krause", 42, 14, C['krause'], "krause", dir="left")
    m.npc("Pendlerin", 9, 27, C['pendler'], "pendlerin")
    m.npc("Student", 6, 22, C['student'], "student", move=RAND)
    m.npc("Jugendlicher", 3, 26, C['jugend1'], "jugendliche", dir="right")
    m.npc("Jugendliche", 4, 26, C['jugend2'], "jugendliche", dir="left")
    m.npc("Rentner", 24, 21, C['rentner'], "rentner", move=route("UU..DD.."), freq=2)
    m.npc("Mutter", 12, 26, C['mutter'], "mutter", move=RAND, freq=2)
    m.npc("Joggerin", 2, 28, C['joggerin'], "joggerin", move=route("RRRRRRRRRRRRLLLLLLLLLLLL"), freq=6, speed=4)
    m.npc("Bauarbeiter", 41, 34, C['bauarbeiter'], "bauarbeiter", dir="up")
    m.npc("Tourist", 17, 27, C['tourist'], "tourist", cond="ep() == 2 && !flag('tourist_done')")
    m.npc("Polizist", 24, 28, C['polizist'], "polizist", move=route("LLLL..RRRR.."))
    # Episode 3: westliche Turmstraße (Supermarkt, Eckhaus, VHS)
    for i, y in enumerate(range(13, 16)):
        m.warp("Turmstraße West", 0, y, "turmstrasse", 38, 9 + i, "left", cond="ep() >= 3", blocked="turm_west_zu")
    return m


def wg():
    mb = BM.build_wg()
    m = PMap("wg", "WG Lehrter Straße", mb, bgm="Lappet Town", announce=False, city="berlin")
    m.door("Ausgang", 3, 9, "moabit", 32, 19, "down", se="door_exit")
    m.ev("Treppe hoch", 10, 2, [m.page(trigger="touch", talk="treppe_hoch")])
    m.warp("Treppe runter", 28, 2, "wg", 9, 3, "down")
    m.autorun("Ankunft WG", "wg_ankunft", "!flag('wg_arrived')")
    m.autorun("WG-Abend", "wg_abend", "flag('wg_arrived') && !flag('wg_abend_done') && flag('zimmer_gesehen')")
    m.autorun("Feier", "wg_feier", "flag('mb_done') && !flag('wg_feier_done')")
    m.autorun("Besuch", "wg_besuch", "flag('besuch_berlin') && !flag('wg_besuch_done')")
    m.autorun("Abschied", "wg_abschied", "flag('einkauf_done') && flag('fussball_done') && flag('vhs_done') && !flag('abschied_done')")
    m.npc("Jonas", 7, 6, C['jonas'], "jonas", dir="up", cond="!flag('jonas_weg')")
    m.npc("Mai", 2, 4, C['mai'], "mai", dir="right", cond="flag('wg_arrived')")
    for (n, x, y, ch) in (("Kofi WG", 1, 6, "TR 052"), ("Carmen WG", 8, 4, "OW 29"), ("Mohammed WG", 9, 7, C['mohammed']), ("Ercan WG", 3, 7, C['ercan'])):
        m.npc(n, x, y, ch, "party_gast", cond="flag('party')")
    m.sign("Kuehlschrank", 5, 2, "kuehlschrank")
    m.sign("Spuele", 1, 2, "spuele")
    m.sign("Fenster", 7, 1, "fenster")
    m.sign("Esstisch", 5, 5, "esstisch")
    m.sign("Laptop", 20, 2, "laptop")
    m.sign("Bett", 21, 6, "bett")
    m.sign("Regal", 23, 2, "regal")
    m.sign("Fernseher", 25, 5, "fernseher")
    m.sign("Kalender", 29, 1, "kalender")
    return m


def buergeramt():
    m = PMap("buergeramt", "Bürgeramt Moabit", BM.build_buergeramt(), bgm="Lab", city="berlin")
    m.door("Ausgang", 7, 10, "moabit", 11, 10, "down", se="door_exit")
    m.autorun("Eingang", "ba_eingang", "!flag('ba_first_visit')")
    m.npc("Frau Petersen", 3, 2, C['petersen'], "petersen")
    m.sign("Platz 1", 3, 4, "ba_schalter")
    m.sign("Platz 2", 3, 7, "ba_platz2")
    m.sign("Nummernautomat", 1, 2, "ba_nummer")
    m.sign("Formulartisch", 7, 7, "ba_formulartisch")
    m.sign("Aufrufanzeige", 12, 2, "ba_anzeige")
    m.sign("Aktenregal", 5, 1, "ba_akten")
    m.sign("Plakat", 9, 1, "ba_poster")
    m.npc("Herr Brandt", 10, 8, C['brandt'], "brandt", dir="left")
    m.npc("Mohammed", 14, 5, C['mohammed'], "mohammed", dir="left")
    m.npc("Wartende", 14, 7, C['mutter'], "ba_wartende", dir="left")
    m.npc("Student BA", 11, 3, C['student'], "ba_student")
    return m


def copyshop():
    m = PMap("copyshop", "Copyshop »Kopierkönig«", BM.build_copyshop(), bgm="Poke Mart", announce=False, city="berlin")
    m.door("Ausgang", 4, 8, "moabit", 3, 21, "down", se="door_exit")
    m.npc("Herr Kaya", 2, 3, C['kaya'], "kaya")
    m.sign("Kopierer", 3, 4, "copy_kopierer")
    m.sign("Schwarzes Brett", 5, 1, "copy_brett")
    m.sign("Getraenke", 8, 1, "copy_getraenke")
    m.sign("Papier", 7, 5, "copy_papier")
    m.npc("Kundin", 9, 3, C['joggerin'], "copy_kundin", dir="left")
    return m


def koeln_hbf():
    mb = BM.build_koeln()
    m = PMap("koeln_hbf", "Köln Hauptbahnhof", mb, bgm="New Start", city="koeln")
    m.autorun("Ankunft Koeln", "koeln_ankunft", "!flag('koeln_done')")
    m.npc("Koelner", 6, 12, C['koelner'], "koelner", move=RAND)
    m.npc("Reisende K", 18, 16, C['reisende'], "koeln_reisende", dir="left")
    m.sign("Dom", 13, 10, "dom")
    m.sign("Reisezentrum K", 20, 16, "koeln_reisezentrum")
    m.npc("Tarek K", 16, 17, C['tarek'], "tarek_koeln", cond="flag('tarek_koeln')", dir="up")
    # Ausgang Richtung Ehrenfeld (links an der Domplatte)
    for i, y in enumerate(range(8, 11)):
        m.warp("Nach Ehrenfeld", 0, y, "ehrenfeld", 48, 9 + i, "left", cond="flag('koeln_done')", blocked="koeln_noch_nicht")
    return m


ALL = [hbf, moabit, wg, buergeramt, copyshop, koeln_hbf]
