// Sprachreise – Dokumentenmappe (vereinfachte Darstellung – keine Rechtsberatung)
"use strict";
SR.DOCUMENTS = {
    reisepass: { name: "Reisepass", short: "{pass}",
      text: "{pass}\nName: {nachname}, {name}\nGeburtsdatum: 14.03.1998\nGeburtsort: {stadt}\n" +
               "Gültig bis: 2033\n<c3=707078,D8D8D0>Mit eingeklebtem Visum.</c3>" },
    visum: { name: "Visum (Typ D)", short: "Nationales Visum für Deutschland",
      text: "Nationales Visum (Typ D)\nZweck: Anerkennung ausländischer Berufsqualifikation (Pflege)\n" +
               "Gültig: 12 Monate\n<c3=707078,D8D8D0>Vereinfachte Darstellung. Später kümmert sich die Ausländerbehörde um den Aufenthaltstitel (Episode 7).</c3>" },
    diplom: { name: "Pflege-Diplom (übersetzt)", short: "Beglaubigte Übersetzung",
      text: "Diplom: Pflegefachkraft\n{uni}\n" +
               "<c3=707078,D8D8D0>Beglaubigte Übersetzung ins Deutsche. Für die volle Anerkennung braucht {name} später Deutsch auf B2-Niveau. Das erste Ziel: B1.</c3>" },
    mietvertrag: { name: "Mietvertrag (WG-Zimmer)", short: "Zimmer in der Lehrter Straße 12",
      text: "Mietvertrag über ein möbliertes Zimmer\nLehrter Straße 12, 3. OG, 10557 Berlin\n" +
               "Vermieterin: Ingrid Schulz\nMieterin: {name} {nachname}\nEinzug: 01.10.\nWarmmiete: 480 Euro\nKaution: 960 Euro" },
    termin: { name: "Terminbestätigung", short: "Bürgeramt Moabit, 10:20 Uhr",
      text: "Ihre Terminbuchung\nDienstleistung: Anmeldung einer Wohnung\nOrt: Bürgeramt Moabit (Rathaus Tiergarten)\n" +
               "Zeit: heute, 10:20 Uhr\nVorgangsnummer: 4711-0815\nBitte bringen Sie mit: Reisepass oder Ausweis, " +
               "ausgefülltes Anmeldeformular, Wohnungsgeberbestätigung." },
    anmeldeformular: { name: "Anmeldeformular (leer)", short: "Ausgedruckt im Copyshop",
      text: "Anmeldung bei der Meldebehörde\n\nFamilienname, Vorname, Geburtsdatum, Familienstand, Staatsangehörigkeit, " +
               "Einzugsdatum, Art der Wohnung ...\n\n<c3=707078,D8D8D0>Noch nicht ausgefüllt.</c3>" },
    anmeldeformular_ok: { name: "Anmeldeformular (ausgefüllt)", short: "Vollständig ausgefüllt und unterschrieben",
      text: "Anmeldung bei der Meldebehörde\nFamilienname: {nachname}\nVorname: {name}\nGeburtsdatum: 14.03.1998\n" +
               "Familienstand: ledig\nStaatsangehörigkeit: {staat}\nEinzug: 01.10.\nArt: Hauptwohnung\nUnterschrift: [x]" },
    wgb: { name: "Wohnungsgeberbestätigung", short: "Unterschrieben von Frau Schulz",
      text: "Bestätigung des Wohnungsgebers\nWohnungsgeberin: Ingrid Schulz\nAnschrift der Wohnung: Lehrter Straße 12, 10557 Berlin\n" +
               "Einzug am: 01.10.\nMeldepflichtige Person: {name} {nachname}\nUnterschrift: I. Schulz" },
    meldebescheinigung: { name: "Meldebescheinigung", short: "Einfache Meldebescheinigung",
      text: "Einfache Meldebescheinigung\nHiermit wird bescheinigt, dass\n{name} {nachname}\nin der Lehrter Straße 12, 10557 Berlin\n" +
               "mit Hauptwohnung gemeldet ist.\nBezirksamt Mitte von Berlin - Bürgeramt" },
    vhs_flyer: { name: "Flyer: Integrationskurs", short: "Volkshochschule Berlin-Mitte",
      text: "Deutsch lernen an der VHS!\nIntegrationskurs A1 bis B1\nMo-Fr, 9:00-12:15 Uhr\nEinstufungstest: jeden Dienstag\n" +
               "Kosten: oft kostenlos - wir beraten Sie gern." },
    steuer_id: { name: "Brief: Steuer-ID", short: "Bundeszentralamt für Steuern",
      text: "Mitteilung Ihrer Steuerlichen Identifikationsnummer\nIdentifikationsnummer: 12 345 678 901\n" +
               "Bitte bewahren Sie dieses Schreiben auf. Sie müssen nicht antworten." },
    einladung: { name: "Einladung: Vorstellungsgespräch", short: "St.-Marien-Klinikum Köln",
      text: "St.-Marien-Klinikum Köln\nVorstellungsgespräch: Montag, 9:30 Uhr (»halb zehn«)\nAnsprechpartnerin: Frau Hoffmann, Pflegedirektion\n" +
               "Bitte mitbringen: Lebenslauf, Zeugnisse, Anerkennungsbescheid (falls vorhanden)" },
    ice_ticket: { name: "ICE-Fahrkarte nach Köln", short: "Berlin Hbf - Köln Hbf",
      text: "Fahrkarte\nBerlin Hbf - Köln Hbf\nICE 949, Gleis 4\nAbfahrt 11:52 Uhr\nZugbindung: ja\n" +
               "<c3=707078,D8D8D0>»Zugbindung« = Sparpreis. Nur dieser Zug!</c3>" },
};
