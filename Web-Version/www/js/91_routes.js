// Sprachreise – Testrouten für den automatischen Durchspiel-Test (Episode für Episode)
"use strict";
if (window.SR_TEST) {
  const R = SR_TEST.routes;
  R[1] = [
    ["map", "hbf"], ["check", "flag('prolog_done')"],
    ["talk", "Abfahrtstafel"], ["talk", "Hbf-Schild"], ["talk", "Familie"], ["talk", "Baeckerin"], ["talk", "Reisende"],
    ["talk", "Tarek"], ["talk", "Tarek"],
    ["talk", "Fahrkartenautomat"], ["talk", "Frau Kowalski"], ["talk", "Taxifahrer"], ["talk", "Musiker"],
    ["go", "Ausgang"], ["map", "moabit"],
    ["talk", "Schild Invalidenstr"], ["talk", "Schild Lehrter Str"], ["talk", "Haltestelle"], ["talk", "Spaeti-Schild"],
    ["talk", "Ercan"], ["talk", "Ercan"], ["talk", "Jugendlicher"], ["talk", "Rentner"], ["talk", "Mutter"],
    ["talk", "Joggerin"], ["talk", "Polizist"], ["talk", "Student"], ["talk", "Pendlerin"],
    ["talk", "Schild Turmstr"], ["talk", "Schild Buergeramt"], ["talk", "Baustellenschild"], ["talk", "Bauarbeiter"],
    ["talk", "Haus Nr. 14"], ["talk", "Haus Nr. 10"], ["talk", "Haus Nr. 11"], ["talk", "Frau Schulz"], ["talk", "Herr Krause"],
    ["go", "Tür Nr. 12"], ["map", "wg"], ["check", "flag('wg_arrived')"],
    ["talk", "Mai"], ["talk", "Jonas"], ["talk", "Kuehlschrank"], ["talk", "Spuele"], ["talk", "Fenster"],
    ["go", "Treppe hoch"], ["check", "flag('wg_abend_done')"],
  ];
  R[2] = [
    ["check", "ep() === 2"], ["go", "Treppe hoch"], ["talk", "Laptop"], ["talk", "Bett"], ["check", "flag('ep2_started')"],
    ["talk", "Regal"], ["talk", "Fernseher"], ["talk", "Kalender"], ["talk", "Laptop"], ["talk", "Laptop"],
    ["go", "Treppe runter"], ["talk", "Mai"], ["talk", "Jonas"], ["talk", "Esstisch"],
    ["go", "Ausgang"], ["map", "moabit"], ["talk", "Herr Krause"], ["talk", "Tonne1"], ["talk", "Tonne2"],
    ["go", "Tür Copyshop"], ["map", "copyshop"], ["talk", "Herr Kaya"], ["talk", "Herr Kaya"], ["talk", "Schwarzes Brett"],
    ["talk", "Kopierer"], ["talk", "Getraenke"], ["talk", "Papier"], ["talk", "Kundin"],
    ["go", "Ausgang"], ["go", "Tür Bürgeramt"], ["map", "buergeramt"],
    ["talk", "Platz 1"], ["talk", "Nummernautomat"], ["talk", "Nummernautomat"], ["talk", "Aufrufanzeige"], ["talk", "Mohammed"], ["talk", "Mohammed"],
    ["talk", "Wartende"], ["talk", "Student BA"], ["talk", "Herr Brandt"], ["talk", "Frau Petersen"], ["talk", "Platz 2"], ["talk", "Aktenregal"], ["talk", "Plakat"],
    ["talk", "Platz 1"], ["check", "flag('ba_need_wgb')"],
    ["go", "Ausgang"], ["talk", "Frau Schulz"], ["check", "hasDoc('wgb')"], ["talk", "Tourist"],
    ["go", "Tür Bürgeramt"], ["talk", "Platz 1"], ["talk", "Formulartisch"], ["talk", "Platz 1"], ["check", "flag('mb_done')"],
    ["go", "Ausgang"], ["go", "Tür Nr. 12"], ["map", "wg"],
  ];
  R[3] = [
    ["go", "Treppe hoch"], ["talk", "Bett"], ["check", "flag('ep3_started')"],
    ["talk", "Jonas"], ["check", "stepDone('q_einkauf','liste')"], ["talk", "Mai"],
    ["go", "Ausgang"], ["go", "Turmstraße West"], ["map", "turmstrasse"],
    ["talk", "Schild Supermarkt"], ["talk", "Eckhaus-Tafel"], ["talk", "VHS-Schild"], ["talk", "Haltestelle T"], ["talk", "Oma Hilde"],
    ["talk", "Haltestelle T"], ["talk", "Oma Hilde"], ["talk", "Kind Spielplatz"], ["talk", "Student T"], ["talk", "Parkbank"],
    ["go", "Tür Supermarkt"], ["map", "supermarkt"],
    ["talk", "Kühlregal"], ["talk", "Regal Obst"], ["talk", "Regal Gemüse"], ["talk", "Regal Brot"], ["talk", "Regal Trocken"],
    ["talk", "Regal Süß"], ["talk", "Regal Getränke"], ["talk", "Regal Haushalt"], ["talk", "Regal Angebote"], ["talk", "Sonderangebote"],
    ["talk", "Pfandautomat"], ["talk", "Jonas"], ["talk", "Kunde"], ["talk", "Filialleiter"], ["talk", "Aufzug"],
    ["talk", "Kasse"], ["check", "flag('einkauf_done')"], ["talk", "Kassiererin"],
    ["go", "Ausgang"], ["go", "Tür Eckhaus"], ["map", "eckhaus"], ["talk", "Theke"], ["talk", "Fernseher"], ["talk", "Gast"], ["talk", "Laptop-Mann"],
    ["go", "Ausgang"], ["go", "Tür VHS"], ["map", "vhs_berlin"],
    ["talk", "Carmen"], ["talk", "Frau Albrecht"], ["talk", "Testplatz"], ["talk", "Frau Albrecht"], ["talk", "Carmen"], ["talk", "Kursteilnehmer"], ["talk", "Aushang VHS"],
    ["check", "flag('fussball_abend')"],
    ["go", "Ausgang"], ["go", "Tür Eckhaus"], ["check", "flag('fussball_done')"],
    ["talk", "Kofi"], ["go", "Nach Moabit"], ["go", "Tür Nr. 12"], ["check", "flag('abschied_done')"],
    ["go", "Ausgang"], ["go", "Zum Hbf"], ["talk", "Tarek"], ["talk", "Reisezentrum"], ["map", "koeln_hbf"],
  ];
  R[4] = [
    ["talk", "Dom"], ["talk", "Koelner"], ["talk", "Reisende K"],
    ["go", "Nach Ehrenfeld"], ["map", "ehrenfeld"], ["talk", "Schild KVB"], ["talk", "Schild Venloer"], ["talk", "Kölner E"], ["talk", "Kölner E"],
    ["talk", "Frau Kiosk"], ["talk", "Mutter K"], ["talk", "Parkbank"],
    ["go", "Tür Klinikum"], ["check", "flag('job_zusage')"], ["talk", "Personalabteilung"], ["talk", "Schreibtisch Hoffmann"], ["go", "Ausgang"],
    ["go", "Tür Café"], ["talk", "Theke Luca"], ["talk", "Kuchentheke"], ["talk", "Gast Café"], ["go", "Ausgang"],
    ["go", "Tür Körnerstr. 8"], ["talk", "Interessent 1"], ["talk", "Interessent 2"], ["talk", "Herr Krämer"], ["map", "ehrenfeld"],
    ["go", "Tür Café"], ["talk", "Theke Luca"], ["check", "flag('jansen_termin')"], ["go", "Ausgang"],
    ["talk", "Klingel 21"], ["check", "flag('mietvertrag_ok')"], ["talk", "Herr Wagner"],
    ["go", "Tür Kundenzentrum"], ["talk", "Schalter"], ["talk", "Wartender KZ"], ["talk", "Frau KZ"], ["go", "Ausgang"],
    ["go", "Tür Bank"], ["talk", "Geldautomat"], ["talk", "Bankschalter"], ["talk", "Kundin Bank"], ["check", "flag('kaution_ok')"], ["go", "Ausgang"],
    ["talk", "Klingel 21"], ["check", "flag('eingezogen')"],
  ];
  R[5] = [
    ["map", "wohnung"], ["talk", "Küche"], ["talk", "Tisch"], ["talk", "Laptop W"], ["talk", "Bett W"],
    ["go", "Ausgang"], ["go", "Tür Klinikum"], ["go", "Zur Station"], ["map", "station"], ["check", "flag('erster_tag_start')"],
    ["talk", "Aga"], ["talk", "Frau Engel"], ["talk", "Herr Demir"], ["talk", "Dienstplan"], ["talk", "Kaffeemaschine"], ["talk", "Herr Brückner"],
    ["talk", "Aga"], ["check", "flag('erster_tag_done')"], ["map", "ehrenfeld"],
    ["talk", "Herr Wagner"], ["talk", "Herr Wagner"],
    ["go", "Tür Café"], ["talk", "Aga Café"], ["talk", "Theke Luca"], ["check", "done('q_cafe2')"], ["go", "Ausgang"],
    ["go", "Zum Rhein"], ["map", "rheinufer"], ["talk", "Aga"], ["talk", "Luca"], ["talk", "Verleih"],
    ["talk", "Angler"], ["talk", "Schild Rhein"], ["talk", "Liebesschlösser"],
    ["to", 39, 9], ["to", 22, 12], ["talk", "Köbes"], ["to", 47, 19], ["check", "flag('radtour_done')"],
  ];
  R[6] = [
    ["map", "wohnung"], ["check", "flag('ep6_started')"], ["go", "Ausgang"],
    ["go", "Tür Krankenkasse"], ["talk", "Kunde KK"], ["talk", "KK-Schalter"], ["talk", "Fotoautomat"], ["check", "hasDoc('ersatzbescheinigung')"], ["go", "Ausgang"],
    ["go", "Tür Arztpraxis"], ["talk", "Frau Lang"], ["talk", "Patient 1"], ["talk", "Patient 2"], ["talk", "Zeitschriften"], ["talk", "Behandlungszimmer"], ["check", "hasDoc('rezept')"], ["go", "Ausgang"],
    ["go", "Tür Apotheke"], ["talk", "Regal A"], ["talk", "Apothekentheke"], ["go", "Ausgang"],
    ["go", "Tür Körnerstr. 21"], ["talk", "Herr Wagner"],
  ];
  R[7] = [
    ["map", "wohnung"], ["go", "Ausgang"], ["go", "Zum Hbf"], ["map", "koeln_hbf"], ["talk", "Reisezentrum K"], ["map", "frankfurt_hbf"],
    ["talk", "Gleisanzeige"], ["talk", "Zugbegleiterin"], ["talk", "Reisender F"], ["talk", "Bankerin"], ["talk", "Gleis 7"], ["talk", "Gleis 9"], ["map", "muenchen"],
    ["talk", "Carmen"], ["talk", "Resi"], ["talk", "Surfer"], ["talk", "Eisbach"], ["talk", "Glockenspiel"], ["talk", "Münchner"], ["talk", "Touristin M"],
    ["talk", "Carmen"], ["talk", "Briefkasten"], ["talk", "Carmen"], ["go", "Zum Hbf M"], ["map", "dresden"],
    ["talk", "Oksana"], ["talk", "Infotafel"], ["talk", "Oksana"], ["talk", "Herr Lehmann"], ["talk", "Elbe"], ["talk", "Kind D"], ["talk", "Touristin D"],
    ["go", "Zum Hbf D"], ["map", "hbf"], ["go", "Ausgang"], ["go", "Tür Nr. 12"], ["check", "flag('wg_besuch_done')"],
    ["go", "Ausgang"], ["go", "Zum Hbf"], ["talk", "Reisezentrum"],
  ];
  R[8] = [
    ["map", "koeln_hbf"], ["go", "Nach Ehrenfeld"], ["go", "Tür Körnerstr. 21"], ["check", "flag('ep8_started')"],
    ["talk", "Laptop W"], ["check", "flag('abh_termin')"], ["go", "Ausgang"],
    ["talk", "Herr Wagner"], ["go", "Tür Apotheke"], ["talk", "Apothekentheke"], ["go", "Ausgang"],
    ["go", "Tür Klinikum"], ["talk", "Personalabteilung"], ["check", "hasDoc('erklaerung')"], ["go", "Ausgang"],
    ["go", "Tür Ausländerbehörde"], ["talk", "Wartende A"], ["talk", "Wartender B"], ["talk", "Vater"], ["talk", "Anzeige ABH"], ["talk", "Zimmer 214"],
  ];
  R[9] = [
    ["go", "Tür Körnerstr. 21"], ["check", "flag('ep9_started')"], ["go", "Ausgang"], ["map", "stadtfest"],
    ["talk", "Luca"], ["talk", "Yara"], ["talk", "Aga"], ["talk", "Kofi"], ["talk", "Oma F"], ["talk", "Mann F"], ["talk", "Frau F"], ["talk", "Ioana"],
    ["talk", "Kind F"], ["talk", "Band"], ["talk", "Bierstand"],
    ["talk", "Herr Wagner"], async () => { if (!flag("nmm_ende") && World.eventByName("Ralf")) await SR_TEST.talk("Ralf"); }, ["check", "flag('nmm_ende')"], ["check", "flag('eskalation_done')"],
  ];
  R[10] = [
    ["map", "hamburg_hbf"], ["talk", "Abfahrtstafel HH"], ["talk", "Pendler HH"], ["talk", "Bäckerin HH"],
    ["go", "Ausgang HH"], ["map", "hamburg"], ["talk", "Fischbrötchen"], ["talk", "Seemann"], ["talk", "Landungsbrücken"], ["talk", "Speicherstadt"], ["talk", "Hamburgerin"],
    ["go", "Tür WG HH"], ["check", "flag('hh_wg')"], ["talk", "Tisch HH"], ["go", "Ausgang"],
    ["go", "Tür Kundenzentrum HH"], ["talk", "Wartende HH"], ["talk", "Schalter HH"], ["go", "Ausgang"],
    ["go", "Tür WG HH"], ["check", "flag('hh_brief')"], ["go", "Ausgang"],
    ["go", "Tür VHS HH"], ["talk", "Frau Albers"], ["talk", "Dilnoza"], ["talk", "Aushang HH"], ["go", "Ausgang"],
    ["go", "Tür WG HH"], ["talk", "Mai"], ["go", "Ausgang"],
    ["go", "Tür VHS HH"], ["talk", "Frau Albers"], ["talk", "Prüfungsplatz"], ["check", "flag('pruefung_done')"], ["go", "Ausgang"],
    ["go", "Tür WG HH"], ["check", "flag('b1_bestanden')"], ["go", "Ausgang"], ["go", "Zum Hbf HH"], ["talk", "Reisezentrum HH"], ["talk", "Amani"],
  ];
}
