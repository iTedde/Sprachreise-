"""Schnelltest: Spiel im Edge (headless) öffnen, Tasten drücken, Screenshots machen.
   py -3.12 test/shot.py out.png [aktionen...]
   Aktionen: key:Enter  wait:500  js:<code>  shot:name.png  click:x,y
"""
import sys, os, time, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "www" / "index.html").as_uri()
OUT = ROOT / "test" / "shots"
OUT.mkdir(exist_ok=True)


def main():
    acts = sys.argv[1:]
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        pg = b.new_page(viewport={"width": 1024, "height": 768})
        logs = []
        pg.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
        pg.on("pageerror", lambda e: logs.append(f"[pageerror] {e}"))
        pg.goto(URL + (("?" + acts[0][4:]) if acts and acts[0].startswith("url:") else ""))
        if acts and acts[0].startswith("url:"):
            acts = acts[1:]
        pg.wait_for_timeout(1500)
        for a in acts:
            k, _, v = a.partition(":")
            if k == "key":
                pg.keyboard.press(v); pg.wait_for_timeout(120)
            elif k == "keys":
                for ch in v.split(","):
                    pg.keyboard.press(ch); pg.wait_for_timeout(150)
            elif k == "hold":
                key, ms = v.split(",")
                pg.keyboard.down(key); pg.wait_for_timeout(int(ms)); pg.keyboard.up(key)
            elif k == "type":
                pg.keyboard.type(v); pg.wait_for_timeout(100)
            elif k == "wait":
                pg.wait_for_timeout(int(v))
            elif k == "js":
                r = pg.evaluate(v)
                if r is not None:
                    print("js:", r)
            elif k == "shot":
                pg.screenshot(path=str(OUT / v))
                print("shot", v)
            elif k == "click":
                x, y = map(int, v.split(","))
                pg.mouse.click(x, y); pg.wait_for_timeout(150)
        for l in logs:
            print(l)
        b.close()


if __name__ == "__main__":
    main()
