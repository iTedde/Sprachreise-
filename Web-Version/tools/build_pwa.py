"""Erzeugt www/sw.js (Offline-Cache für die Web-/iPhone-Version) mit allen Dateien aus www/."""
import os, hashlib
WWW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "www")
files, h = [], hashlib.sha1()
for root, _, names in os.walk(WWW):
    for n in sorted(names):
        p = os.path.join(root, n)
        rel = os.path.relpath(p, WWW).replace("\\", "/")
        if rel in ("sw.js",):
            continue
        files.append(rel)
        h.update(open(p, "rb").read())
ver = h.hexdigest()[:10]
js = """// Automatisch erzeugt von tools/build_pwa.py – Offline-Cache
const CACHE = "sprachreise-%s";
const FILES = %s;
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))); });
""" % (ver, "[" + ",".join('"%s"' % f for f in ["./"] + sorted(files)) + "]")
open(os.path.join(WWW, "sw.js"), "w", encoding="utf-8").write(js)
print("sw.js:", len(files), "Dateien, Version", ver)
