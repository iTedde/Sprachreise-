#!/bin/bash
# Baut eine schlanke Spielkopie (ohne Pokémon-/Kampfdateien) nach X:/Sprachreise/_release/Sprachreise
SRC="/x/Sprachreise/Pokemon Essentials v21.1 2023-07-30 (1)/Pokemon Essentials v21.1 2023-07-30"
DST=/x/Sprachreise/_release/Sprachreise
rm -rf "$DST"; mkdir -p "$DST"
cd "$SRC" && tar cf - --exclude=./sr_test --exclude=./Graphics/Pokemon --exclude=./Audio/SE/Cries \
  --exclude=./Graphics/Battlebacks --exclude="./Graphics/Battle animations" --exclude=./Audio/SE/Anim \
  --exclude="./PBS/Gen 5 backup" --exclude="./PBS/Gen 6 backup" --exclude="./PBS/Gen 7 backup" \
  --exclude="./PBS/Gen 8 backup" --exclude="./PBS/Shadow Pokémon backup" --exclude=./sr_autotest.txt . | (cd "$DST" && tar xf -)
cd "$DST"
rm -f Audio/BGM/Battle* Audio/BGM/Surfing.ogg Audio/BGM/Evolution.ogg "Audio/BGM/Hall of Fame.mid" \
      Audio/SE/Battle* Audio/ME/Battle* Audio/ME/Bug* Audio/ME/Slots* Audio/ME/Voltorb* Audio/ME/Egg* \
      "Audio/ME/Pkmn get.ogg" "Audio/ME/Evolution start.ogg"
find Graphics/Animations -type f ! -name "Overworld*" -delete
cp /x/Sprachreise/Sprachreise_Designdokument.md .
mkdir -p Werkzeuge
cp /x/Sprachreise/Sprachreise_Werkzeuge/*.py /x/Sprachreise/Sprachreise_Werkzeuge/*.sh /x/Sprachreise/Sprachreise_Werkzeuge/ts_offsets.json Werkzeuge/
# README für GitHub
{
cat <<'EOF'
# Sprachreise – Deutsch von A2 bis B1

Ein kleines RPG im Stil von Pokémon Essentials über eine Reise durch Deutschland, Sprache und Bürokratie.
Die Hauptfigur kommt in Berlin an, meldet sich beim Bürgeramt an und lernt dabei Deutsch – von A2 Richtung B1.

**Demo:** Episode 1 „Ankommen“ und Episode 2 „Das Bürgeramt“ sind spielbar, danach geht es nach Köln.
Alle 10 Episoden sind in [`Sprachreise_Designdokument.md`](Sprachreise_Designdokument.md) beschrieben.
Android, Mac, iPhone: [`PLATTFORMEN.md`](PLATTFORMEN.md).

EOF
sed -n '/^## Spielen/,$p' SPRACHREISE_LIESMICH.md | grep -v "_Backup_Original" | sed 's#^`X:\\Sprachreise\\Sprachreise_Werkzeuge\\`#`Werkzeuge/`#'
cat <<'EOF'

## Credits
Engine: Pokémon Essentials v21.1 · Train Station: Ekat99 · Kölner Dom: Baertierchen · Magnetbahn/ICE: Lo8jd · City-Autotiles: Pokémon Gaia · Gen-4-Overworlds: Vanilla Sunshine, Neo-Spriteman u. a. · Ersatzschrift: GNU Unifont (SIL OFL)
Nicht-kommerzielles Fanprojekt. Mehrere Grafiken sind nur für nicht-kommerzielle Nutzung freigegeben.
EOF
} > README.md
du -sh "$DST"
