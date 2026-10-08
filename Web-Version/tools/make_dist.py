"""Packt die Web-Version als dist/Sprachreise_Web.zip (zum Hochladen auf einen Webserver oder zum Spielen am PC)."""
import os, zipfile, shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
DIST = os.path.join(ROOT, "dist")
os.makedirs(DIST, exist_ok=True)
out = os.path.join(DIST, "Sprachreise_Web.zip")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    www = os.path.join(ROOT, "www")
    for base, _, files in os.walk(www):
        for f in files:
            p = os.path.join(base, f)
            arc = "Sprachreise/" + os.path.relpath(p, www).replace(os.sep, "/")
            if f == "91_routes.js":
                z.writestr(arc, '"use strict";\n')
            else:
                z.write(p, arc)
    z.write(os.path.join(ROOT, "README.md"), "Sprachreise/LIESMICH.md")
idsig = os.path.join(DIST, "Sprachreise.apk.idsig")
if os.path.exists(idsig):
    os.remove(idsig)
design = os.path.abspath(os.path.join(ROOT, "..", "Sprachreise_Designdokument.md"))
if os.path.exists(design):
    shutil.copy(design, DIST)
print("dist:", sorted(os.listdir(DIST)), "Web-Zip %.1f MB" % (os.path.getsize(out) / 1e6))
