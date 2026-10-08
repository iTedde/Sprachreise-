#!/bin/sh
# Kopiert das Spiel (www) in das iOS-Projekt. Danach: xcodegen && open Sprachreise.xcodeproj
cd "$(dirname "$0")"
rm -rf www && cp -R ../www ./www
printf '"use strict";\n' > www/js/91_routes.js
rm -f www/sw.js
echo "www kopiert. Jetzt: xcodegen  und  open Sprachreise.xcodeproj"
