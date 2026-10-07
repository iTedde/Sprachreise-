#!/bin/bash
# kompiliert Plugins, startet den Autotest, zeigt Ergebnis
GAME="/x/Sprachreise/Pokemon Essentials v21.1 2023-07-30 (1)/Pokemon Essentials v21.1 2023-07-30"
cd "$(dirname "$0")" && py -3.12 write_project.py > /dev/null || exit 1
cd "$GAME"
rm -rf sr_test; rm -f "$APPDATA/Sprachreise/errorlog.txt"
echo "${MODE:-normal}" > sr_autotest.txt
T=${1:-240}
./Game.exe > /dev/null 2>&1 &
PID=$!
for i in $(seq 1 $T); do
  sleep 1
  if [ -f sr_test/done.txt ] || [ -f "$APPDATA/Sprachreise/errorlog.txt" ]; then break; fi
  if ! kill -0 $PID 2>/dev/null; then break; fi
done
sleep 2
taskkill //F //IM Game.exe > /dev/null 2>&1
rm -f sr_autotest.txt
if [ -f "$APPDATA/Sprachreise/errorlog.txt" ]; then echo "=== ERRORLOG ==="; head -40 "$APPDATA/Sprachreise/errorlog.txt"; fi
if [ -f sr_test/log.txt ]; then echo "=== LOG (FEHLER/ENDE) ==="; grep -E "FEHLER|ENDE|ZUSAMMEN|Nicht gelernt|Nie aufgerufen|  - " sr_test/log.txt | head -60; echo "lines: $(wc -l < sr_test/log.txt)"; tail -5 sr_test/log.txt; fi
