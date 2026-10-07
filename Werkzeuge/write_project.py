"""Schreibt die erzeugten Karten, MapInfos, System-Daten, Grafiken und PluginScripts ins Projekt."""
import os, sys, shutil, zlib, glob
sys.path.insert(0, os.path.dirname(__file__))
from mapgen import *
from rubymarshal.classes import Symbol

A = r"X:/Sprachreise/Asset-Downloads/"
PARENTS = {78: 77, 79: 77, 80: 77}
START = (76, 7, 19)

# Gen-4-Overworlds (Vanilla Sunshine / Neo-Spriteman) -> Graphics/Characters
CHARS = {
    "SR_Heldin": "NPC 76", "SR_Tarek": "NPC 01", "SR_Jonas": "NPC 49",
    "SR_Petersen": "NPC 32", "SR_Mohammed": "NPC 13", "SR_Ercan": "NPC 07", "SR_Kaya": "NPC 27",
    "SR_Tourist": "NPC 24", "SR_Bauarbeiter": "NPC 85", "SR_Mai": "NPC 28", "SR_Polizist": "NPC 38",
}

def write_chars():
    for dst, src in CHARS.items():
        shutil.copy(A + "404/Official_Gen4_OW/" + src + ".png", G + "/Graphics/Characters/" + dst + ".png")

def write(maps):
    write_chars()
    for mb in maps:
        mb.save()
    # MapInfos
    mi = L("MapInfos.rxdata")
    maxorder = max(v.attributes['@order'] for k, v in mi.items() if k < 76)
    for i, mb in enumerate(maps):
        mi[mb.id] = obj("RPG::MapInfo", name=mb.name, parent_id=PARENTS.get(mb.id, 0),
                        order=maxorder + 1 + i, expanded=True, scroll_x=0, scroll_y=0)
    save("MapInfos.rxdata", mi)
    # System: Startposition + Skript-Schalter
    sy = L("System.rxdata")
    a = sy.attributes
    a['@start_map_id'], a['@start_x'], a['@start_y'] = START
    a['@edit_map_id'] = START[0]
    sw = a['@switches']
    need = max(SCRIPT_SWITCHES.values()) + 1 if SCRIPT_SWITCHES else len(sw)
    while len(sw) < need:
        sw.append("")
    for expr, sid in SCRIPT_SWITCHES.items():
        sw[sid] = "s:" + expr
    save("System.rxdata", sy)
    print("maps", [m.id for m in maps], "switches", SCRIPT_SWITCHES)

def write_plugin_scripts():
    """PluginScripts.rxdata selbst erzeugen (Essentials kompiliert Plugins nur im Debug-Modus)."""
    pdir = G + "/Plugins/Sprachreise"
    meta = {}
    for line in open(pdir + "/meta.txt", encoding="utf-8-sig"):
        if "=" in line:
            k, v = line.split("=", 1); meta[k.strip().upper()] = v.strip()
    scripts = [s.strip() for s in meta["SCRIPTS"].split(",")]
    for f in sorted(os.listdir(pdir)):
        if f.endswith(".rb") and f not in scripts:
            scripts.append(f)
    m = {Symbol("name"): meta["NAME"], Symbol("version"): meta["VERSION"],
         Symbol("essentials"): [meta["ESSENTIALS"]],
         Symbol("credits"): [c.strip() for c in meta["CREDITS"].split(",")]}
    files = []
    for f in scripts:
        code = open(pdir + "/" + f, "rb").read()
        files.append([f, zlib.compress(code)])
    data = [[meta["NAME"], m, files]]
    save("PluginScripts.rxdata", data)
    print("plugin scripts:", len(files))

if __name__ == "__main__":
    write_plugin_scripts()
