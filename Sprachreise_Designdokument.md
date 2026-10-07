# SPRACHREISE – Deutsch von A2 bis B1
### Ein 10-Episoden-RPG über Deutschland, Sprache und Bürokratie
*(Pokémon Essentials v21.1 / RPG Maker XP · Stand: Demo mit Episode 1 + 2 spielbar)*

---

## 0. Was ist umgesetzt? (Demo)

| Bereich | Status |
|---|---|
| Episode 1 „Ankommen“ (Berlin Hbf → Moabit → WG) | **spielbar** |
| Episode 2 „Das Bürgeramt“ (Termin, Copyshop, Bürgeramt, Hinterhof, Brief, Telefonat) | **spielbar** |
| Reise nach Köln + Demo-Ende am Kölner Dom | **spielbar** |
| Episoden 3–10 | ausgearbeitet in diesem Dokument; Systeme dafür sind schon fertig |
| Systeme: Sprachpunkte, Sprachniveau A2→B1, Wörterbuch, Aufgaben, Dokumente, Tagebuch, Fähigkeiten, Deutschlandkarte, Reisen, Speichern | **fertig** |
| Minispiele: Quiz/Dialog, Formular, Fehler finden, Unterlagen wählen, Telefon, Brief, Aushang, Terminbuchung, Klingelschilder, Mülltrennung | **fertig** |
| Automatischer Durchspiel-Test (im echten Spiel) | **fertig** – Demo komplett durchspielbar, kein Softlock |
| Sechs Herkunftssprachen (Spanisch, Arabisch, Französisch, Englisch, Türkisch, Ukrainisch) mit Übersetzungshilfe | **fertig** |
| Einheitliches Fensterdesign (Textbox, Namensreiter, Auswahl, Hinweise, Banner) | **fertig** |

---

## A. Vorhandene Assets (Analyse)

**Pokémon Essentials v21.1** (Engine, Scripts, Tilesets „Outside“, „Interior general“, „Mart“ u. a., 29 NPC-Sprites, Windowskins, MIDI/OGG-Musik, SE).

**Asset-Downloads (verwendet):**
- *Train Station* (Ekat99) – Bahnsteige, Gleise, Blindenleitstreifen, Abfahrtstafel, Bänke, Glasfassade, Bogenportal → **Berlin Hbf, Köln Hbf**
- *Gen-3 Magnet Train* → als **ICE** an den Bahnsteigen
- *Gen-3 Cathedral – Kölner Dom* (Baertierchen) → **Köln Hbf / Domplatte**, Titelbild
- *Pokémon Gaia – City-Autotiles* → **Gehweg** (Fischgrät-Pflaster) mit Bordstein
- *Official Gen 4 OW Collection* (Vanilla Sunshine / Neo-Spriteman) → **Spielfigur** und 11 weitere Figuren (Tarek, Jonas, Mai, Frau Petersen, Mohammed, Ercan, Herr Kaya, Tourist, Bauarbeiter, Polizist)

**Nicht verwendet (für spätere Episoden vorgemerkt):** Emerald/HGSS/DPPt-Außentiles (Hamburg-Hafen, Elbe, Rhein), Johto-Tileset (Altstadt), Sawsbucks Coffee (Café), Galar-Bahnhofsinnenraum, Sewer, Snow (Winter-Episode).

**Selbst erzeugt (stilgleich):** kombiniertes Tileset „SR Deutschland“, Deutschlandkarte (aus echten Geo-Koordinaten gerechnet, Pixel-Look), Titelbild.

## B. Wiederverwendete Systeme
Essentials-Nachrichtenfenster, Windowskins, Pausemenü (MenuHandlers), SaveData, Kartenmetadaten (Ortsschild beim Betreten), Move-Routes, Skript-Schalter (`s:`-Schalter), Namenseingabe, Musik/SE. Keine Essentials-Datei wurde verändert – alles läuft als Plugin.

## C. Neu entwickelte Systeme (Plugin `Plugins/Sprachreise`)
| Datei | Inhalt |
|---|---|
| `001_Core.rb` | Spielstand `$sprachreise` (eigener SaveData-Eintrag), Sprachpunkte, Niveaus, Wörter, Aufgaben, Dokumente, Tagebuch, Fähigkeiten, Städte, Episoden, Szenen-Registry `SR::Talk` |
| `002_UI_Dialog.rb` | Dialog mit **Namensschild**, mehrzeilige **Antwortauswahl** (lange B1-Sätze passen), nicht blockierende **Hinweise**, Banner „NEUES WORT GELERNT“, Niveau-Aufstieg, Episodenkarte |
| `003_UI_Mappe.rb` | **Sprachmappe** im Pausemenü: Fortschritt · Aufgaben · Wörterbuch · Dokumente · Tagebuch |
| `004_Minigames.rb` | Papier-/Bildschirm-Overlay, Quiz, Formular, Fehler finden, Unterlagen wählen, Telefon, Brief |
| `005_Deutschlandkarte.rb` | Regionenkarte, Reiseziele, ICE-Reiseanimation, Freischaltung |
| `010–012_Data_*.rb` | 69 Wörter, 10 Aufgaben, 13 Dokumente |
| `020–022_*.rb` | Inhalte Episode 1, 2, Köln/Demo-Ende |
| `030_Deutsch_UI.rb` | deutsche Menütexte, Episoden zählen als „Orden“ im Ladebildschirm |
| `099_Autotest.rb` | Durchspiel-Test (nur aktiv mit Datei `sr_autotest.txt`) |

---

## D. Dramaturgie: 10 Episoden

**Hauptfigur: Daniela Ríos** (Name wählbar), 27, Krankenpflegerin aus Medellín (Kolumbien). Kommt mit einem Visum zur Anerkennung ihres Berufs. Für die volle Anerkennung braucht sie später B2 – **ihr erstes großes Ziel ist B1.** Neugierig, humorvoll, manchmal frustriert, schreibt Tagebuch, hat Heimweh nach Mamas Arepas – und will sich hier ein eigenes Leben aufbauen.

**Bogen:** *Am Anfang helfen andere ihr – am Ende hilft sie anderen.*
Tarek erklärt ihr in Ep. 1 den Weg → in Ep. 2 erklärt sie einem Touristen denselben Weg → in Ep. 10 hilft sie am Hamburger Hbf einer Neuangekommenen genau so, wie Tarek ihr geholfen hat.

| # | Episode | Ort | Niveau am Ende | Kernkonflikt | Freischaltung |
|---|---|---|---|---|---|
| 1 | Ankommen | Berlin Hbf, Moabit | A2 | Wo muss ich hin? | Fähigkeit *Wegbeschreibungen verstehen* |
| 2 | Das Bürgeramt | Berlin-Moabit | A2 (→A2+) | Anmeldung: Termin, Formular, Wohnungsgeberbestätigung | *Formulare verstehen*, Köln |
| 3 | Die Wohnung | Köln | A2+ | Wohnungssuche, Kaltmiete/Warmmiete, Kaution | – |
| 4 | Krankenkasse | Köln | A2+ | Versicherung, Formular, Gesundheitskarte | *Behördenbrief verstehen* |
| 5 | Bank und Finanzen | Köln | A2+ | Konto, IBAN, Überweisung der Kaution | Düsseldorf |
| 6 | Arbeitssuche | Düsseldorf | B1- | Lebenslauf, Vorstellungsgespräch | *Telefonieren* |
| 7 | Ausländerbehörde | Köln/Düsseldorf | B1- | Aufenthaltstitel, fehlendes Dokument (ernst) | Frankfurt, München, Dresden |
| 8 | Deutschland entdecken | Köln→Frankfurt→München→Dresden→Berlin | B1- | Bahn, Umsteigen, Verspätung, Durchsagen | Hamburg |
| 9 | Der große Bürokratie-Test | Hamburg | B1- | Umzug + Arbeit + Aufenthalt gleichzeitig | *Selbstständig kommunizieren* |
| 10 | B1 | Hamburg | **B1** | Ein Behördenbrief – diesmal ohne Hilfe | Finale |

### Episode 1 – Ankommen (SPIELBAR)
- **Prolog im ICE:** Durchsage, Namenseingabe, innere Stimme auf Spanisch/Deutsch.
- **Hauptaufgabe „Wo muss ich hin?“:** Tarek (DB-Mitarbeiter, Berliner mit libanesischen Eltern, war ein Jahr in Valencia) erklärt den Weg – erst zu schnell. Die Spielerin muss „Ich verstehe das nicht“ / „Langsamer, bitte“ benutzen. Dann Quiz zur Wegbeschreibung. Der Weg ist **echt auf der Karte nachzulaufen**: raus → rechts (Invalidenstraße) → erste links (Lehrter Straße) → geradeaus → Nr. 12 rechts (gerade Nummern rechts, ungerade links).
- **Klingelschild-Rätsel:** Nowak („Wir kaufen nichts!“), Yılmaz (Tipp), Hausverwaltung Schulz, Becker/Fischer.
- **WG:** Jonas (Student aus Passau) – Lektion **du/Sie** mit Quiz. „Sprechen Sie Deutsch?“ – „Ein bisschen.“ Abschluss: „Sie müssen sich beim Bürgeramt anmelden.“
- **Nebenaufgaben:** Fahrkartenautomat mit Frau Kowalski (Kurzstrecke, *entwerten*, 60 € Strafe), Bäckerei („Schrippe“ – drei Namen für ein Brötchen, Preis verstehen), Pfand am Späti, Videoanruf mit Mama (Heimweh).
- **Humor:** Taxifahrer („Dafür steig ick nich mal aus'm Auto“), Baustelle „seit 2019, fertig wird se bald“, Pendler mit Dauerverspätung, Jugendsprache („Läuft bei dir?“).
- **Sonntag:** Bürgeramt und Copyshop sind zu – Kulturlektion Ladenschluss; nur der Späti hat offen.

### Episode 2 – Das Bürgeramt (SPIELBAR)
1. **Terminvereinbarung** (Laptop): „Keine Termine verfügbar“ → neu laden → Paradox „in 6 Wochen, aber Anmeldung binnen 2 Wochen“ → plötzlich ein abgesagter Termin heute 10:20. Merkblatt-Link: „Fehler 404“.
2. **Copyshop:** „Ich möchte etwas ausdrucken.“ Schwarzweiß/farbig, Anzahl, Preis. Schwarzes Brett: VHS-Integrationskurs lesen und verstehen.
3. **Bürgeramt:** „Haben Sie einen Termin?“ – A: „Nein, aber ich bin jetzt hier.“ / B: „Ich habe *ein* Termin.“ → „*Einen* Termin.“ – „Einen Termin. Danke.“ (sichtbarer Grammatikfehler, später nie wieder). Wartenummer B-117, Wartebereich mit Gesprächen (Mohammed: *Termin vs. Terminvereinbarung*), Passierschein-A38-Plakat.
4. **Die Satire-Szene:** „Das Formular fehlt.“ – „Welches Formular?“ – „Das auf dem Merkblatt.“ – „Welches Merkblatt?“ – „Das bekommen Sie online.“ … „Die Bescheinigung, dass Sie hier wohnen.“ – „Aber genau deshalb bin ich doch hier.“ – „Ja.“ – … – „Ohne Bescheinigung geht es leider nicht.“ Dann wird Frau Petersen menschlich und erklärt alles (nicht jeder Beamte ist unfreundlich).
5. **Frau Schulz** (Vermieterin, 70): Wohnungsgeberbestätigung – **Fehler-finden-Spiel**: falsche Hausnummer (21 statt 12) und Unterschrift „leider an der falschen Stelle“.
6. **Formular-Minispiel** Anmeldeformular: Familienname vs. Vorname, Datumsformat TT.MM.JJJJ, *ledig*, Staatsangehörigkeit (nicht Stadt!), freiwillige Felder (Doktorgrad, Künstlername „DJ Dani“ ;)), Religion → Hinweis Kirchensteuer, Haupt-/Nebenwohnung, Unterschriftsfeld.
7. **Meldebescheinigung.** Epilog: Steuer-ID-Brief (Brief-Minispiel), Telefonat aus Köln („halb zehn“ = 9:30!), Reisezentrum – Tarek bemerkt den Fortschritt: „Ich hätte gern …“ (Konjunktiv).
- **Nebenaufgaben:** Mülltrennung mit Herrn Krause (4 Tonnen + Pfand + Glas, Sonntagsruhe), Tourist nach dem Weg fragen (**erstmals hilft sie jemandem**), Deutschkurs-Aushang, Mohammeds Tipps, Mai (Pflege-Azubi aus Hanoi) – Ziel B1.

### Episode 3 – Die Wohnung (Köln)
Hauptaufgabe: Ein Zimmer reicht nicht mehr – eigene Wohnung nahe dem Klinikum (Köln-Ehrenfeld).
- **Wohnungsanzeigen-Spiel:** „2 ZKB, 52 m², 650 € kalt, NK 200 €, KM 3 MM“ → Warmmiete berechnen (850 €), Kaution (3 Kaltmieten = 1.950 €), Abkürzungen (ZKB, NK, KM, EBK).
- **Besichtigung:** 30 Leute in einem Treppenhaus (Satire), Vermieter-Fragen (Schufa, Einkommensnachweis – „Ich habe noch keinen Job, weil ich keine Wohnung habe, und keine Wohnung, weil …“).
- **Mietvertrag verstehen** (Fehler-finden: Staffelmiete, Schönheitsreparaturen).
- Nebenaufgaben: Einem anderen Migranten „warm“ vs. „kalt“ erklären, Kölsch-Dialekt („Kölle Alaaf“), Rheinufer, Dom-Besteigung (533 Stufen zählen = Zahlen-Quiz).
- Wörter: Miete, Kaution, Nebenkosten, Warmmiete, Kaltmiete, Besichtigung, Vermieter, Mieter, Vertrag, Schufa.

### Episode 4 – Krankenkasse (Köln)
- Krankenkasse wählen (gesetzlich vs. privat, vereinfacht dargestellt), Mitgliedsantrag (**Formular mit Pflichtfeldern** – Fähigkeit *Formulare verstehen* markiert sie), Passfoto hochladen, Versichertennummer verstehen, Gesundheitskarte.
- Arzttermin per Telefon („Sind Sie neu bei uns?“), Wartezimmer, Rezept vs. Überweisung, Apotheke.
- Humor: Arztpraxis-Hotline-Warteschleife mit Musik in Endlosschleife.
- Wörter: Krankenversicherung, Krankenkasse, Beitrag, Versichertenkarte, Arzt/Ärztin, Rezept, Überweisung, Praxis.

### Episode 5 – Bank und Finanzen (Köln)
- Termin bei der Bank, Identifikation (Meldebescheinigung aus Ep. 2 wird gebraucht! – Dokumentensystem zahlt sich aus), IBAN verstehen (DE + Prüfziffer + BLZ + Kontonummer).
- **Überweisungs-Minispiel:** Kaution an Vermieter: Empfänger, IBAN, Betrag, Verwendungszweck – Fehler werden erklärt.
- Humor: „Ihre PIN kommt mit separatem Brief. Ihre Karte auch. Getrennt. An verschiedenen Tagen.“
- Wörter: Konto, Überweisung, Geldautomat, Karte, PIN, IBAN, Rechnung, Verwendungszweck, Lastschrift.

### Episode 6 – Arbeitssuche (Düsseldorf)
- Stellenanzeigen lesen (m/w/d, Teilzeit/Vollzeit, Schichtdienst), tabellarischen Lebenslauf zusammenstellen (Sortier-Minispiel), Anschreiben-Bausteine wählen.
- **Bewerbungsgespräch:** Antwortoptionen hängen vom Sprachniveau ab. A2: „Ich möchte arbeiten und ich lerne Deutsch.“ B1: „Ich möchte gerne in Ihrem Unternehmen arbeiten, weil ich mich beruflich weiterentwickeln und gleichzeitig meine Deutschkenntnisse verbessern möchte.“
- Köln–Düsseldorf-Rivalität als Running Gag (Altbier vs. Kölsch).
- Wörter: Bewerbung, Lebenslauf, Arbeitsvertrag, Probezeit, Schicht, Gehalt, brutto/netto.

### Episode 7 – Ausländerbehörde (ernst)
- Ton wird ruhiger, Musik ernster. Checkliste: Pass, Aufenthaltstitel, biometrisches Passfoto, Mietvertrag, Arbeitsvertrag, Versicherungsnachweis, Einkommensnachweis.
- **Ein Dokument fehlt:** die Erklärung zum Beschäftigungsverhältnis vom Arbeitgeber → Fahrt zur Klinik nach Düsseldorf, mit der Personalabteilung telefonieren.
- Themen: Angst vor Fehlern, Wartezeit, Unsicherheit. Hinweis im Spiel: *Vereinfachte Darstellung, keine Rechtsberatung.*
- Ende: Fiktionsbescheinigung, später der elektronische Aufenthaltstitel. Erleichterung.

### Episode 8 – Deutschland entdecken (Reise-Episode)
Route (geografisch logisch, jede Fahrt mit Zuganimation):
**Köln → Frankfurt** (ICE, Umsteigen am Knoten) → **München** (Freundin aus dem Integrationskurs, Biergarten, Tram, Englischer Garten) → **Dresden** (über Nürnberg/Leipzig; Elbe, Frauenkirche, ruhigere Atmosphäre) → **Berlin** (Besuch bei Jonas & Tarek) → zurück.
- Minispiele: Verbindung finden (Fahrplan lesen), Gleiswechsel-Durchsage verstehen, Deutschlandticket vs. Fernverkehr, Zugbindung.
- Humor: „Der Zug nach München hat heute leider eine kleine Verspätung.“ – „Was bedeutet *kleine* Verspätung?“ – „Das kann alles bedeuten.“
- Kulturen: Dialekte (Bairisch „Servus“, Sächsisch), regionale Brötchennamen (Semmel!) – Rückbezug auf „Schrippe“.

### Episode 9 – Der große Bürokratie-Test (Hamburg)
Neue Stelle am Hamburger Uniklinikum: Umziehen + Arbeit + Aufenthalt verlängern. Alle Systeme kombiniert:
1. Informationen recherchieren (Webseiten-Spiel), 2. Termine organisieren (Bürgeramt Hamburg, Ausländerbehörde), 3. Dokumente sammeln (Inventar-Check), 4. Bahn fahren, 5. telefonieren, 6. Formulare (Ummeldung, Krankenkasse Adressänderung, Rundfunkbeitrag-Brief), 7. NPCs, 8. Briefe verstehen, 9. Entscheidungen (Reihenfolge der Behördengänge – falsche Reihenfolge kostet Zeit, nie Game Over).
- Hamburg-Identität: Hafen, Speicherstadt, Brücken, Fischbrötchen, „Moin“.

### Episode 10 – B1 (Finale)
- Ein Brief der Ausländerbehörde: Aufforderung, ein Sprachzertifikat einzureichen. Lesen – verstehen – Frist erkennen – telefonisch nachfragen – Termin – richtige Unterlagen – **telc B1-Prüfung an der VHS** (Hören, Lesen, Schreiben, Sprechen als vier Mini-Prüfungen) – Termin erfolgreich absolvieren.
- **Ohne Hilfe-NPC.** Dialogzeile: „Ich habe die Unterlagen bereits eingereicht. Allerdings habe ich gestern einen Brief bekommen und bin mir nicht sicher, ob ich darauf noch reagieren muss. Können Sie mir bitte erklären, was ich jetzt tun soll?“
- **Spiegelszene:** Am Hamburger Hbf hilft sie einer Neuangekommenen – mit Tareks Worten.
- **Abschlussszene:** Bahnhof, Deutschlandkarte, Durchsage „Der Zug nach Berlin fährt heute von Gleis 4.“ Sie versteht jedes Wort, lächelt, geht allein zum Gleis.
  **DEUTSCH B1 – Du hast es geschafft.** *„Du kannst deinen Weg jetzt selbst finden.“*

---

## D2. Herkunft und Muttersprache
Zu Spielbeginn wählt man die Sprache, die man zu Hause spricht. Davon hängen Name, Heimat und Details der Hauptfigur ab – die Geschichte (Krankenpflegerin, Ziel B1, Anerkennung) bleibt gleich:

| Sprache | Figur | Herkunft | Details |
|---|---|---|---|
| Spanisch | Daniela Ríos | Medellín, Kolumbien | Arepas, García Márquez |
| Arabisch | Rania Haddad | Amman, Jordanien | Mansaf, Mahmud Darwisch; Tarek antwortet auf Arabisch (libanesische Eltern) |
| Französisch | Aminata Diallo | Dakar, Senegal | Thieboudienne, Mariama Bâ |
| Englisch | Joy Santos | Manila, Philippinen | Adobo, Nick Joaquín; Jonas will trotzdem Deutsch sprechen |
| Türkisch | Elif Demir | Izmir, Türkei | Menemen, Orhan Pamuk; Tarek ist in Neukölln aufgewachsen |
| Ukrainisch | Olena Kowalenko | Lwiw, Ukraine | Borschtsch, Taras Schewtschenko |

Übersetzt werden: Wörterbuch (alle Lernwörter), markierte Wörter im Dialog `[[wort]]` („Ausgang (salida)“), Banner „Neues Wort“, Mamas Anrufe, Gedanken in der Muttersprache, der Straßenmusiker. Deutsche Grammatik zur Herkunft wird nebenbei gelernt: *aus Kolumbien*, *aus dem Senegal*, *aus der Türkei*, *von den Philippinen*.
Technik: Arabisch wird beim Erzeugen der Daten verbunden und in Anzeigerichtung gebracht; Zeichen, die die Spielschrift nicht hat, erscheinen automatisch in einer Pixel-Ersatzschrift (GNU Unifont).

**Einfache Sprache am Anfang:** Episode 1 nutzt kurze Hauptsätze im Präsens und wiederholt Schlüsselwörter; Episode 2 wird etwas komplexer, ab Episode 6 (B1-) kommen Nebensätze und Konjunktiv hinzu.

## E. Städte und warum

| Stadt | Rolle | Identität (Kartengestaltung) |
|---|---|---|
| Berlin | Ankunft, erste Behörde | Hbf-Turmbahnhof, Altbauten, Hochhäuser im Hintergrund, Späti, Baustellen, Hinterhof |
| Köln | Arbeit & Wohnung | Dom (Tileset vorhanden), Rhein, Domplatte, Kölsch |
| Düsseldorf | Arbeitgeber | Rheinufer, Altstadt, Rivalität mit Köln |
| Frankfurt | Umsteigeknoten | Skyline, Bahnhofshalle |
| München | Freundschaft | Altstadt, Tram, Biergarten |
| Dresden | Kultur, Ruhe | Elbe, Barock |
| Hamburg | Großer Test & Finale | Hafen, Speicherstadt, Brücken |

Reiseweg auf der Karte: Berlin → Köln → Düsseldorf → Frankfurt → München → Dresden → Hamburg (gestrichelte Route, Städte werden erst sichtbar, wenn sie freigeschaltet sind).

## F. Sprachprogression

| Niveau | Sprachpunkte | Typische Sätze der Figur |
|---|---|---|
| A2 – Grundlagen | 0 | „Ich… Lehrter Straße? Wo?“ · „Ein bisschen.“ · „Ich habe ein Termin.“ |
| A2+ – Mehr Wortschatz | 300 | „Ich möchte mich anmelden.“ · „Ich möchte etwas ausdrucken.“ |
| B1- – Komplexere Sätze | 700 | „Ich habe meinen Pass und meinen Mietvertrag. Aber ich bin nicht sicher, ob noch etwas fehlt.“ |
| B1 – Selbstständig | 1200 | „Ich habe die Unterlagen bereits eingereicht. Allerdings …“ |

Punkte gibt es für neue Wörter (3–8), richtige Antworten (beim ersten Versuch mehr), Formularfelder, Briefe, Telefonate, Aufgaben (6–30), Episodenabschlüsse. **Fehler kosten nie etwas** – sie geben eine Erklärung, ein Wort oder einen Tipp. In der Demo erreicht man **A2+** im Laufe von Episode 2 (~500 SP bei allen Nebenaufgaben).

Sichtbarer Fortschritt in der Demo:
1. Ep. 1: „Ich… Lehrter Straße? Wo?“ → Tarek muss langsam sprechen.
2. Ep. 2: Grammatikkorrektur „*Einen* Termin“ – danach nie wieder falsch.
3. Ep. 2: Sie erklärt einem Touristen den Weg.
4. Ende Ep. 2: „Ich hätte gern eine Fahrkarte nach Köln, bitte. Am liebsten eine direkte Verbindung, ohne Umsteigen.“ – Tarek: „Konjunktiv!“

## G. Aufgaben (Demo)
**Haupt:** Wo muss ich hin? · Anmeldung beim Bürgeramt · Ein Anruf aus Köln
**Neben:** Der Fahrkartenautomat · Frühstück am Bahnhof · Pfand zurück! · Herr Krause und die Mülltrennung · Wo ist der Bahnhof? · Ein Deutschkurs · Termin oder Terminvereinbarung?

## H. Wichtige Figuren

| Figur | Wer | Funktion |
|---|---|---|
| Daniela Ríos | Krankenpflegerin, Medellín | Hauptfigur |
| Tarek | DB-Mitarbeiter, Berliner, Eltern aus dem Libanon | Mentor Ep. 1, Fortschritts-Spiegel am Reisezentrum |
| Jonas | Student aus Passau, WG | du/Sie, Bürokratie-Witze, Freund |
| Mai | Pflege-Azubi aus Hanoi | Peer-Mentorin, Ziel B1/B2 |
| Frau Petersen | Sachbearbeiterin | Satire – und dann menschlich |
| Herr Brandt | Empfang Bürgeramt | Grammatikkorrektur „einen Termin“ |
| Mohammed | aus Afghanistan, Azubi Fachinformatiker | Tipps „Termin vs. Terminvereinbarung“, „Mach Kopien“ |
| Frau Schulz | Vermieterin seit 1987 | Wohnungsgeberbestätigung mit Fehlern |
| Herr Krause | grantiger Nachbar | Mülltrennung |
| Ercan | Späti-Besitzer, Berliner | Pfand |
| Frau Kowalski | Rentnerin | Kurzstrecke & entwerten |
| Musiker | aus Valparaíso, Chile | „Paso a paso“ – andere Migrationsgeschichte |
| Frau Hoffmann | Pflegedirektion Köln | Telefonat |

Nicht jeder Deutsche spricht gleich (Berlinerisch, Jugendsprache, Bairisch-Passauer Jonas, Kölsch), nicht jeder Beamte ist unfreundlich, nicht jede Migrationsgeschichte ist gleich (Tarek in Berlin geboren, Mohammed geflüchtet, Mai über ein Ausbildungsprogramm, der Musiker seit 7 Jahren hier).

## I. Technische Umsetzung

**Karten (neu, IDs 76–81):** 76 Berlin Hauptbahnhof · 77 Berlin-Moabit · 78 WG Lehrter Straße · 79 Bürgeramt Moabit · 80 Copyshop · 81 Köln Hauptbahnhof
**Tileset 24 „SR Deutschland“:** Outside (Essentials) + Train Station + ICE + Kölner Dom, Autotiles Gehweg/Asphalt; Durchgängigkeit pro Kachel gesetzt.
**Events:** echte RPG-Maker-Events (NPCs mit Zufalls-/Routenbewegung, Türen mit Transfer-Befehl, Schilder, Automaten, Autostart-Szenen). Inhalte rufen `sr_talk(:id)` auf – Dialoge liegen lesbar in den `.rb`-Dateien.
**Bedingungen:** Skript-Schalter 101–109 (`s:SR.flag?(...)`), z. B. „Bürgeramt offen erst ab Episode 2“.
**Startposition:** Karte 76 (Bahnsteig, vor dem ICE).
**Speichern:** Essentials-Speichern; `$sprachreise` (Punkte, Wörter, Aufgaben, Dokumente, Tagebuch, Städte, Flags) wird mitgespeichert – getestet.

**Vereinfachungen (gekennzeichnet):** Fahrpreise, Visum/Aufenthaltsrecht, Formularfelder, Steuer-ID-Nummer sind vereinfacht dargestellt. Das Spiel ist keine Rechtsberatung.

---

## Credits
Engine: Pokémon Essentials v21.1 (Maruno u. a.) · Train Station: **Ekat99** (+ Heartlessdragoon, RSE-Paletten) · Kölner Dom: **Baertierchen** · City-Autotiles: **Pokémon Gaia** · Gen-4-Overworlds: **Vanilla Sunshine, Neo-Spriteman, Purple Zaffre, Maicerochico, Atomic Reactor** · Magnetbahn/ICE: **Lo8jd**.
*Hinweis: Mehrere Assets sind nur für nicht-kommerzielle Projekte freigegeben (siehe .txt-Dateien in `Asset-Downloads/da_sammlung`).*
