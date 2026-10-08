"""Baut die Android-App (APK) ohne Android Studio/Gradle:
   aapt2 (Ressourcen + Manifest + Assets) → javac → d8 (DEX) → zipalign → apksigner.

   Voraussetzungen: JDK (javac, keytool) im PATH, Android build-tools + platform in android/sdk_dl
   (werden mit  py -3.12 tools/build_apk.py --download  geladen).
   Ergebnis: dist/Sprachreise.apk
"""
import os, sys, shutil, subprocess, zipfile, glob, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
AND = os.path.join(ROOT, "android")
SDK = os.path.join(AND, "sdk_dl")
BUILD = os.path.join(AND, "build")
DIST = os.path.join(ROOT, "dist")
VERSION_CODE, VERSION_NAME = 1, "1.0"
KEYSTORE = os.path.join(AND, "sprachreise.keystore")
KS_PASS = "sprachreise"


def jdk(name):
    """JDK-Werkzeug finden (javac/keytool), auch wenn nur java im PATH ist."""
    exe = shutil.which(name)
    if exe:
        return exe
    for base in (os.environ.get("JAVA_HOME", ""), r"C:\Program Files\Java\jdk-21", r"C:\Program Files\Java\latest"):
        p = os.path.join(base, "bin", name + ".exe")
        if os.path.exists(p):
            return p
    hits = glob.glob(os.path.join(r"C:\Program Files\Java", "jdk*", "bin", name + ".exe"))
    if hits:
        return hits[0]
    sys.exit("JDK-Werkzeug fehlt: " + name)


def tool(name):
    hits = glob.glob(os.path.join(SDK, "bt", "*", name))
    if not hits:
        sys.exit("Fehlt: %s – erst  py -3.12 tools/build_apk.py --download" % name)
    return hits[0]


def run(cmd, **kw):
    print(">", " ".join(os.path.basename(c) if i == 0 else c for i, c in enumerate(cmd))[:200])
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print(r.stdout, r.stderr)
        sys.exit("Fehler bei " + cmd[0])
    return r


def download():
    os.makedirs(SDK, exist_ok=True)
    for url, dst in (("https://dl.google.com/android/repository/build-tools_r35_windows.zip", "bt"),
                     ("https://dl.google.com/android/repository/platform-35_r02.zip", "pf")):
        z = os.path.join(SDK, dst + ".zip")
        if not os.path.exists(z):
            print("lade", url); urllib.request.urlretrieve(url, z)
        with zipfile.ZipFile(z) as f:
            f.extractall(os.path.join(SDK, dst))


def main():
    if "--download" in sys.argv:
        download()
    android_jar = glob.glob(os.path.join(SDK, "pf", "*", "android.jar"))[0]
    aapt2, d8, zipalign, apksigner = tool("aapt2.exe"), tool("d8.bat"), tool("zipalign.exe"), tool("apksigner.bat")
    shutil.rmtree(BUILD, ignore_errors=True)
    os.makedirs(BUILD); os.makedirs(DIST, exist_ok=True)
    # 1) Spiel als Assets kopieren (ohne Testdateien)
    assets = os.path.join(BUILD, "assets")
    shutil.copytree(os.path.join(ROOT, "www"), os.path.join(assets, "www"),
                    ignore=shutil.ignore_patterns("91_routes.js", "sw.js"))
    # Testrouten werden in der App nicht gebraucht – leere Datei, damit index.html sie findet
    open(os.path.join(assets, "www", "js", "91_routes.js"), "w").write('"use strict";\n')
    # 2) Ressourcen kompilieren und linken
    run([aapt2, "compile", "--dir", os.path.join(AND, "res"), "-o", os.path.join(BUILD, "res.zip")])
    base = os.path.join(BUILD, "base.apk")
    run([aapt2, "link", "-o", base, "-I", android_jar, "--manifest", os.path.join(AND, "AndroidManifest.xml"),
         "--min-sdk-version", "24", "--target-sdk-version", "35", "--version-code", str(VERSION_CODE),
         "--version-name", VERSION_NAME, "-A", assets, os.path.join(BUILD, "res.zip")])
    # 3) Java kompilieren und in DEX umwandeln
    classes = os.path.join(BUILD, "classes"); os.makedirs(classes)
    srcs = glob.glob(os.path.join(AND, "src", "**", "*.java"), recursive=True)
    run([jdk("javac"), "--release", "8", "-cp", android_jar, "-d", classes, "-Xlint:-options", "-nowarn"] + srcs)
    dexdir = os.path.join(BUILD, "dex"); os.makedirs(dexdir)
    cls = glob.glob(os.path.join(classes, "**", "*.class"), recursive=True)
    run(["cmd", "/c", d8, "--release", "--min-api", "24", "--lib", android_jar, "--output", dexdir] + cls)
    with zipfile.ZipFile(base, "a", zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(dexdir, "classes.dex"), "classes.dex")
    # 4) ausrichten + signieren
    aligned = os.path.join(BUILD, "aligned.apk")
    run([zipalign, "-p", "-f", "4", base, aligned])
    if not os.path.exists(KEYSTORE):
        run([jdk("keytool"), "-genkeypair", "-keystore", KEYSTORE, "-storepass", KS_PASS, "-keypass", KS_PASS, "-alias", "sprachreise",
             "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000", "-dname", "CN=Sprachreise, O=Sprachreise, C=DE"])
    out = os.path.join(DIST, "Sprachreise.apk")
    run(["cmd", "/c", apksigner, "sign", "--ks", KEYSTORE, "--ks-pass", "pass:" + KS_PASS, "--key-pass", "pass:" + KS_PASS,
         "--out", out, aligned])
    r = run(["cmd", "/c", apksigner, "verify", "--verbose", out])
    print(r.stdout.strip().splitlines()[:4])
    print("fertig:", out, "%.1f MB" % (os.path.getsize(out) / 1e6))


if __name__ == "__main__":
    main()
