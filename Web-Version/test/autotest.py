"""Automatischer Durchspiel-Test im Edge-Browser (headless).
   py -3.12 test/autotest.py                 normal
   py -3.12 test/autotest.py reverse         falsche Antworten zuerst, Tippfehler
   py -3.12 test/autotest.py normal ar 5     Sprache ar, ab Episode 5
"""
import sys, json, time, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "www" / "index.html").as_uri()


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    mode = sys.argv[1] if len(sys.argv) > 1 else "normal"
    lang = sys.argv[2] if len(sys.argv) > 2 else "es"
    frm = sys.argv[3] if len(sys.argv) > 3 else "1"
    q = f"?autotest={mode}&lang={lang}&from={frm}"
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        pg = b.new_page(viewport={"width": 1024, "height": 768})
        errs = []
        pg.on("pageerror", lambda e: errs.append(f"[pageerror] {e}"))
        pg.on("console", lambda m: errs.append(f"[console.{m.type}] {m.text}") if m.type in ("error", "warning") else None)
        pg.goto(URL + q)
        t0 = time.time()
        last = 0
        while time.time() - t0 < 900:
            time.sleep(1)
            done = pg.evaluate("window.SR_TEST && SR_TEST.done")
            n = pg.evaluate("window.SR_TEST ? SR_TEST.lines.length : 0")
            if n != last:
                last = n
            if done:
                break
            prog = pg.evaluate("window.SR_TEST ? Date.now() - SR_TEST.lastProgress : 0")
            if prog > 90000 and time.time() - t0 > 30:
                print("!! keine Bewegung seit 90 s")
                break
        lines = pg.evaluate("SR_TEST.lines")
        summ = pg.evaluate("SR_TEST.summary || null")
        pg.screenshot(path=str(ROOT / "test" / "shots" / f"autotest_{mode}_{lang}.png"))
        out = ROOT / "test" / f"autotest_{mode}_{lang}.log"
        out.write_text("\n".join(lines), encoding="utf-8")
        for l in lines:
            if l.startswith("FEHLER") or l.startswith("=====") or l.startswith("Episode") or l.startswith("(keine"):
                print(l)
        if not summ:
            print("NICHT FERTIG. Letzte Zeilen:")
            print("\n".join(lines[-25:]))
        else:
            print(json.dumps({k: v for k, v in summ.items() if k not in ("neverRun", "notLearned", "questsOpen")}, ensure_ascii=False))
            print("nie ausgeführt:", summ["neverRun"])
            print("nicht gelernt:", summ["notLearned"])
            print("offen:", summ["questsOpen"])
        for e in errs[:30]:
            print(e)
        b.close()


if __name__ == "__main__":
    main()
