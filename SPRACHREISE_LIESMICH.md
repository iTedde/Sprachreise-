# Sprachreise – Demo (Episode 1 + 2)

## Spielen
`Game.exe` starten → **ENTER** → **Neues Spiel**.

| Taste | Funktion |
|---|---|
| Pfeiltasten | laufen (mit Shift/Zurück-Taste gedrückt: rennen) |
| C / Enter / Leertaste | sprechen, bestätigen |
| X / Esc | Menü, zurück |

Im Menü:
- **Sprachmappe** – Fortschritt (A2 → B1), Aufgaben, Wörterbuch, Dokumente, Tagebuch (Links/Rechts wechselt den Reiter)
- **Deutschlandkarte** – Reiseroute und freigeschaltete Städte
- **Speichern** – speichert alles, auch Wörter, Aufgaben und Dokumente

**Lösungsweg in Kurzform:** Bahnhofshalle: Tarek fragen → Europaplatz (Norden) → rechts → erste Straße links (Lehrter Straße) → Nr. 12 rechts klingeln → WG: Jonas → oben schlafen → Laptop: Termin → Copyshop (Turmstraße) → Bürgeramt (Rathaus) → Frau Schulz im Hinterhof → Bürgeramt (Formulartisch, Platz 1) → WG → Hbf: Reisezentrum → Köln.

## Was wurde geändert?
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
| `Graphics/UI/Sprachreise/deutschland.png` | Deutschlandkarte |
| `Graphics/Titles/title.png`, `start.png` | Titelbild (Original in `X:\Sprachreise\_Backup_Original`) |
| `Game.ini`, `mkxp.json` | Fenstertitel „Sprachreise“ (eigener Speicherordner `%APPDATA%\Sprachreise`) |

Sicherung der Originaldaten: `X:\Sprachreise\_Backup_Original\`.

## Neue Inhalte schreiben
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
Minispiele: `SR::Mini.quiz`, `.form`, `.find_errors`, `.pick_docs`, `.phone`, `.letter` (Beispiele in `021_Level2_Buergeramt.rb`).

## Automatischer Test
Leere Datei `sr_autotest.txt` in diesen Ordner legen und `Game.exe` starten: Die Demo wird komplett automatisch durchgespielt (alle Events, Erreichbarkeit, Speichern/Laden). Ergebnis und Screenshots landen in `sr_test/`. Ein vorhandener Spielstand wird vorher gesichert und danach wiederhergestellt. Datei danach wieder löschen.
Mit dem Inhalt `reverse` in der Datei werden die alternativen Antworten getestet.

## Werkzeuge
`X:\Sprachreise\Sprachreise_Werkzeuge\` – Python-Skripte, mit denen Tileset, Karten, Deutschlandkarte und Titelbild erzeugt wurden (`build_maps.py --save` erzeugt die Karten neu; Achtung: überschreibt Änderungen, die im RPG Maker an den Karten 76–81 gemacht wurden).
