# Sprachreise – Web-, Android- und iPhone-Version

Die **komplette** Sprachreise (alle 10 Episoden) als Neuentwicklung („Port“) der Pokémon-Essentials-Demo.
Gleiche Grafiken, Figuren und Karten – aber eine eigene Engine in JavaScript. Dadurch läuft das Spiel überall:

| Plattform | Wie |
|---|---|
| **Windows / Mac / Linux** | `www/index.html` doppelklicken (Chrome, Edge, Firefox, Safari). Kein Server, keine Installation. |
| **Android** | `dist/Sprachreise.apk` aufs Handy kopieren und installieren (»Installation aus unbekannten Quellen« erlauben). |
| **iPhone / iPad** | **a)** Web-App: den Ordner `www` auf einen Webserver mit HTTPS legen (z. B. GitHub Pages) → in Safari öffnen → *Teilen → Zum Home-Bildschirm*. Läuft dann im Vollbild und offline. **b)** Echte App: Ordner `ios/` auf einem Mac mit Xcode bauen (siehe unten). |

Inhalt und Spielidee: [`../Sprachreise_Designdokument.md`](../Sprachreise_Designdokument.md).

## Steuerung
| Tastatur | Touch | Funktion |
|---|---|---|
| Pfeiltasten / WASD | Steuerkreuz | laufen |
| Shift (halten) | RENNEN | rennen |
| Enter / Leertaste / C | A | sprechen, bestätigen |
| Esc / X | B / MENÜ | zurück, Menü |
| – | Antworten antippen | auswählen |

In Schreibaufgaben einfach tippen; **ä ö ü ß**, **Hinweis**, **Wörterbuch** und (nach zwei Versuchen) **Lösung zeigen** sind Buttons.
Im Menü: Sprachmappe (Fortschritt, Aufgaben, Wörter, Dokumente, Tagebuch, Kontakte), Deutschlandkarte, Übersetzung an/aus, Speichern, Optionen (Textgeschwindigkeit, Lautstärke, Vollbild).

## Ordner
| Ordner | Inhalt |
|---|---|
| `www/` | das Spiel (HTML, CSS, JS, Daten, Grafiken) |
| `www/js/30–39_*.js` | Inhalte der 10 Episoden (Dialoge lesbar und direkt bearbeitbar) |
| `www/js/00–18_*.js` | Engine: Karte, Figuren, Events, Text, Minispiele, Schreibaufgaben, Argumentation, Mappe, Karte, Titel |
| `tools/` | Python-Werkzeuge: Karten bauen & exportieren, Übersetzungen, PWA, APK-Bau |
| `android/` | Android-App (WebView): Manifest, Java-Quelltext, Icons |
| `ios/` | iOS-App (WKWebView) als XcodeGen-Projekt |
| `test/` | automatischer Durchspieltest (Playwright + Edge) |
| `dist/` | fertige Dateien: `Sprachreise.apk`, `Sprachreise_Web.zip` |

## Neu bauen
```
py -3.12 tools/export.py all          # Karten, Tilesets, Figuren, Sounds, Musik, Übersetzungen → www/data
py -3.12 tools/export.py render ehrenfeld   # Vorschau einer Karte nach tools/render/
py -3.12 tools/build_pwa.py           # Offline-Cache für die Web-App
py -3.12 tools/build_apk.py --download   # Android: Build-Tools laden (einmalig) und APK bauen → dist/Sprachreise.apk
```
Voraussetzungen: Python 3.12 mit `pillow numpy rubymarshal soundfile` (Karten-Export liest das Essentials-Projekt), JDK 17+ für die APK.

## Testen
```
py -3.12 test/autotest.py                 # spielt alle 10 Episoden automatisch durch
py -3.12 test/autotest.py reverse ar      # erst falsche Antworten + Tippfehler, Herkunftssprache Arabisch
py -3.12 test/ui_shots.py                 # Screenshots der Oberflächen
```
Der Test läuft headless im Edge-Browser (Playwright), findet Wege per Breitensuche und meldet Softlocks, fehlende Szenen und Wörter.

## iOS-App bauen (Mac)
```
cd ios
./prepare.sh          # kopiert www in das Projekt
brew install xcodegen
xcodegen              # erzeugt Sprachreise.xcodeproj
open Sprachreise.xcodeproj
```
In Xcode unter *Signing & Capabilities* das eigene Team wählen (eine kostenlose Apple-ID reicht für das eigene iPhone, die App läuft dann 7 Tage) und auf das angeschlossene Gerät installieren.

## Hinweise
- Spielstände liegen im Browser-/App-Speicher des jeweiligen Geräts.
- Die APK ist selbst signiert (`android/sprachreise.keystore`, Passwort `sprachreise`). Für Updates immer denselben Schlüssel benutzen.
- Nicht-kommerzielles Fanprojekt: Mehrere Grafiken (Pokémon-Essentials-Ressourcen, Gen-4-Overworlds u. a.) sind nur für nicht-kommerzielle Nutzung freigegeben. Für eine Veröffentlichung im Play Store / App Store müssten sie ersetzt werden.
- Behördenabläufe sind vereinfacht dargestellt – keine Rechtsberatung.
