# Sprachreise – Deutsch von A2 bis B1

Ein RPG über Deutschland, Sprache, Freundschaft und Bürokratie: von Berlin über Köln, Frankfurt, München und Dresden bis nach Hamburg.
**Alle 10 Episoden spielbar** – im Browser, auf Android und auf dem iPhone.

## ▶️ Du willst einfach spielen?
### 👉 [**Hier ist die Anleitung: So spielst du Sprachreise**](ANLEITUNG_SO_SPIELST_DU.md) 👈

| Direkt-Download | |
|---|---|
| 🤖 Android-App | [Sprachreise.apk](https://github.com/iTedde/Sprachreise-/raw/main/Download/Sprachreise.apk) |
| 💻 Windows / Mac / Linux | [Sprachreise_Web.zip](https://github.com/iTedde/Sprachreise-/raw/main/Download/Sprachreise_Web.zip) → entpacken → `index.html` öffnen |
| 📱 iPhone / iPad / im Browser | **https://itedde.github.io/Sprachreise-/** |

---

## Für Entwickler
| Ordner | Inhalt |
|---|---|
| `Web-Version/` | **Vollversion** (eigene JavaScript-Engine): Quelltext, Karten-Werkzeuge, Android- und iOS-Projekt, automatischer Test – siehe [`Web-Version/README.md`](Web-Version/README.md) |
| `docs/` | spielbare Kopie der Web-Version für GitHub Pages |
| `Download/` | fertige APK und Web-ZIP |
| Hauptordner | ursprüngliche **Pokémon-Essentials-Demo** (Episode 1 + 2, Windows, `Game.exe`) |

Konzept und alle Episoden: [`Sprachreise_Designdokument.md`](Sprachreise_Designdokument.md).

---

## Original-Demo (Pokémon Essentials)
### Spielen
`Game.exe` starten → **ENTER** → **Neues Spiel** → **Muttersprache wählen**.

**Sechs Herkunftssprachen:** Spanisch, Arabisch, Französisch, Englisch, Türkisch, Ukrainisch.
Je nach Wahl ändern sich Name, Heimatstadt und Geschichte der Hauptfigur (z. B. Rania aus Amman, Elif aus Izmir),
und alle Übersetzungen (Wörterbuch, markierte Lernwörter, Mamas Anrufe) erscheinen in dieser Sprache.
Blau markierte Wörter zeigen die Übersetzung in Klammern – abschaltbar im Menü unter **Übersetzung: an/aus**.

Android, Mac, iPhone: siehe `PLATTFORMEN.md`.

| Taste | Funktion |
|---|---|
| Pfeiltasten | laufen (mit Shift/Zurück-Taste gedrückt: rennen) |
| C / Enter / Leertaste | sprechen, bestätigen |
| X / Esc | Menü, zurück |

Im Menü:
- **Sprachmappe** – Fortschritt (A2 → B1), Aufgaben, Wörterbuch, Dokumente, Tagebuch (Links/Rechts wechselt den Reiter)
- **Deutschlandkarte** – Reiseroute und freigeschaltete Städte
- **Übersetzung: an/aus** – Übersetzungshilfe in der Muttersprache
- **Speichern** – speichert alles, auch Wörter, Aufgaben und Dokumente

**Lösungsweg in Kurzform:** Bahnhofshalle: Tarek fragen → Europaplatz (Norden) → rechts → erste Straße links (Lehrter Straße) → Nr. 12 rechts klingeln → WG: Jonas → oben schlafen → Laptop: Termin → Copyshop (Turmstraße) → Bürgeramt (Rathaus) → Frau Schulz im Hinterhof → Bürgeramt (Formulartisch, Platz 1) → WG → Hbf: Reisezentrum → Köln.

### Was wurde geändert?
Alles ist **zusätzlich** zum Essentials-Projekt – kein Essentials-Script wurde verändert.

| Ort | Inhalt |
|---|---|
| `Plugins/Sprachreise/*.rb` | das komplette Spiel (Systeme + Dialoge). Texte lassen sich direkt dort bearbeiten. |
| `Data/PluginScripts.rxdata` | kompilierte Plugins (im Debug-Modus / RMXP-Testspiel kompiliert Essentials automatisch neu) |
| `Data/Map076–081.rxdata`, `MapInfos.rxdata` | neue Karten (im RPG Maker XP unter „Berlin Hauptbahnhof“ usw. sichtbar und editierbar) |
| `Data/Tilesets.rxdata` | neues Tileset Nr. 24 „SR Deutschland“ |
| `Data/System.rxdata` | Startposition (Karte 76) und Skript-Schalter 101–109 |
| `Graphics/Tilesets/SR Deutschland.png`, `Graphics/Autotiles/SR *.png` | Tileset aus Essentials + Train Station + ICE + Kölner Dom |
| `Graphics/Characters/SR_*.png` | Figuren (Gen-4-Overworlds) |
| `Plugins/Sprachreise/013_Data_Sprachen.rb` | Herkunftsprofile + Übersetzungen (erzeugt von `Werkzeuge/sprachen.py`) |
| `Fonts/SR Unifont.ttf` | Ersatzschrift für Arabisch, Kyrillisch, Türkisch (GNU Unifont, OFL, auf die nötigen Zeichen gekürzt) |
| `Graphics/Windowskins/SR Text.png`, `SR Menue.png` | Fensterrahmen |
| `Graphics/UI/Sprachreise/deutschland.png` | Deutschlandkarte |
| `Game.ini`, `mkxp.json` | Fenstertitel „Sprachreise“ (eigener Speicherordner `%APPDATA%\Sprachreise`) |


### Neue Inhalte schreiben
Eine Szene in einer `.rb`-Datei definieren und im RPG Maker XP einem Event den Skriptbefehl `sr_talk(:meine_szene)` geben:

```ruby
SR::Talk.define(:meine_szene) do
  face_player
  say("Frau Beispiel", "Guten Tag! Haben Sie einen Termin?")
  i = ask(me, "(Was sage ich?)", ["Ja, um 10 Uhr.", "Nein."])
  learn(:termin)                 # Wort aus 010_Data_Woerter.rb
  step(:q_anmeldung, :amt)       # Aufgabenschritt abhaken
  doc(:meldebescheinigung)       # Dokument geben
  diary(:mein_eintrag, "Heute ...")
end
```
In Texten: `[[termin]]` hebt ein Lernwort hervor und hängt die Übersetzung an; Platzhalter `{name}`, `{nachname}`, `{stadt}`, `{land}`, `{aus_land}`, `{in_land}`, `{staat}`, `{sprache}` werden passend zur gewählten Herkunft ersetzt.
Neue Übersetzungen kommen in `Werkzeuge/sprachen.py` (danach `py sprachen.py` ausführen – Arabisch wird dabei automatisch in die richtige Anzeigeform gebracht).

Minispiele: `SR::Mini.quiz`, `.form`, `.find_errors`, `.pick_docs`, `.phone`, `.letter` (Beispiele in `021_Level2_Buergeramt.rb`).

### Automatischer Test
Leere Datei `sr_autotest.txt` in diesen Ordner legen und `Game.exe` starten: Die Demo wird komplett automatisch durchgespielt (alle Events, Erreichbarkeit, Speichern/Laden). Ergebnis und Screenshots landen in `sr_test/`. Ein vorhandener Spielstand wird vorher gesichert und danach wiederhergestellt. Datei danach wieder löschen.
Mit dem Inhalt `reverse` in der Datei werden die alternativen Antworten getestet, mit `lang=ar` (bzw. `fr`, `en`, `tr`, `uk`) eine bestimmte Herkunftssprache.

### Werkzeuge
`Werkzeuge/` – Python-Skripte, mit denen Tileset, Karten, Deutschlandkarte und Titelbild erzeugt wurden (`build_maps.py --save` erzeugt die Karten neu; Achtung: überschreibt Änderungen, die im RPG Maker an den Karten 76–81 gemacht wurden).

### Credits
Engine: Pokémon Essentials v21.1 · Train Station: Ekat99 · Kölner Dom: Baertierchen · Magnetbahn/ICE: Lo8jd · City-Autotiles: Pokémon Gaia · Gen-4-Overworlds: Vanilla Sunshine, Neo-Spriteman u. a. · Ersatzschrift: GNU Unifont (SIL OFL)
Nicht-kommerzielles Fanprojekt. Mehrere Grafiken sind nur für nicht-kommerzielle Nutzung freigegeben.
