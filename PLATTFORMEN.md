# Sprachreise auf Android, Mac und iPhone

Sprachreise läuft auf **Pokémon Essentials v21.1** mit der Engine **mkxp-z**. Davon hängt ab, wo das Spiel laufen kann.

| Plattform | Status | Wie |
|---|---|---|
| Windows | ✅ getestet | `Game.exe` starten |
| Android | ⚠️ sollte laufen, **nicht getestet** | App **JoiPlay** + RPG-Maker-Plugin |
| macOS | ⚠️ sollte laufen, **nicht getestet** | mkxp-z für macOS |
| Linux | ⚠️ sollte laufen, **nicht getestet** | mkxp-z für Linux |
| iPhone / iPad | ❌ nicht möglich | siehe unten |

## Android (JoiPlay)
1. Auf dem Handy **JoiPlay** und das **RPG Maker Plugin** für JoiPlay installieren (joiplay.net).
2. Den kompletten Spielordner (mit `Game.exe`) aufs Handy kopieren, z. B. nach `Download/Sprachreise`.
3. In JoiPlay auf **+** tippen → `Game.exe` im Ordner auswählen → Titel „Sprachreise“ eingeben.
4. Lange auf das Spiel tippen → **Bearbeiten** → als Engine **RPG Maker (mkxp-z)** wählen.
5. Spielen. JoiPlay blendet Bildschirm-Tasten ein (Steuerkreuz, Bestätigen, Zurück); die Belegung lässt sich in JoiPlay anpassen.

Alles im Spiel ist nur mit Pfeiltasten, Bestätigen und Zurück bedienbar – keine Maus, keine Tastatur nötig (außer bei der Namenseingabe; dort kann man den Vorschlag einfach bestätigen).

## macOS / Linux
Essentials liefert nur die Windows-Version der Engine mit. Für Mac/Linux gibt es fertige **mkxp-z**-Builds (github.com/mkxp-z/mkxp-z, Bereich *Releases* / *Actions*). Die Spieldateien (`Data`, `Graphics`, `Audio`, `Fonts`, `Plugins`, `mkxp.json`, `Game.ini` …) werden nach der Anleitung von mkxp-z in den Spielordner der App gelegt.

## iPhone / iPad
Für iOS gibt es **keine** Version von mkxp-z oder einem anderen RGSS-Player, die Pokémon-Essentials-Spiele ausführen kann (Apple erlaubt keine solchen Interpreter-Apps im App Store). Das Spiel kann auf dem iPhone daher nur laufen, wenn es **in eine andere Technik übertragen** wird – z. B. als **Web-Version** (läuft dann im Browser auf iPhone, Android und PC gleichermaßen). Das wäre ein eigenes Projekt: Karten, Grafiken und alle Texte/Dialoge lassen sich übernehmen, die Spiellogik müsste neu geschrieben werden.
