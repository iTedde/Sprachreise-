// Sprachreise – Tilemap (RPG-Maker-XP-Format: 3 Ebenen, Autotiles, Prioritäten, Durchgängigkeit)
"use strict";

const Gfx = {
  imgs: {},
  img(path) {
    if (this.imgs[path]) return this.imgs[path];
    const im = new Image();
    im.src = path;
    this.imgs[path] = im;
    return im;
  },
  ready(list) {
    return Promise.all(list.map(im => im.complete && im.naturalWidth ? Promise.resolve() :
      new Promise(r => { im.onload = r; im.onerror = () => { console.warn("Bild fehlt:", im.src); r(); }; })));
  },
};

// Autotile-Viertel (1-basiert im 6×8-Raster aus 16-px-Stücken), wie RMXP
const AUTOTILE_PARTS = [
  [[27, 28, 33, 34], [5, 28, 33, 34], [27, 6, 33, 34], [5, 6, 33, 34], [27, 28, 33, 12], [5, 28, 33, 12], [27, 6, 33, 12], [5, 6, 33, 12]],
  [[27, 28, 11, 34], [5, 28, 11, 34], [27, 6, 11, 34], [5, 6, 11, 34], [27, 28, 11, 12], [5, 28, 11, 12], [27, 6, 11, 12], [5, 6, 11, 12]],
  [[25, 26, 31, 32], [25, 6, 31, 32], [25, 26, 31, 12], [25, 6, 31, 12], [15, 16, 21, 22], [15, 16, 21, 12], [15, 16, 11, 22], [15, 16, 11, 12]],
  [[29, 30, 35, 36], [29, 30, 11, 36], [5, 30, 35, 36], [5, 30, 11, 36], [39, 40, 45, 46], [5, 40, 45, 46], [39, 6, 45, 46], [5, 6, 45, 46]],
  [[25, 30, 31, 36], [15, 16, 45, 46], [13, 14, 19, 20], [13, 14, 19, 12], [17, 18, 23, 24], [17, 18, 11, 24], [41, 42, 47, 48], [5, 42, 47, 48]],
  [[37, 38, 43, 44], [37, 6, 43, 44], [13, 18, 19, 24], [13, 14, 43, 44], [37, 42, 43, 48], [17, 18, 47, 48], [13, 18, 43, 48], [1, 2, 7, 8]],
];

class Tileset {
  constructor(id) {
    const d = SR_DATA.tilesets[id];
    if (!d) throw new Error("Tileset fehlt: " + id);
    this.id = id; this.d = d;
    this.chunks = d.chunks.map(f => Gfx.img("img/tilesets/" + f));
    this.autos = d.autotiles.map(n => n ? Gfx.img("img/autotiles/" + n + ".png") : null);
    this.cache = {};
  }
  images() { return this.chunks.concat(this.autos.filter(Boolean)); }
  passage(t) { return this.d.passages[t] || 0; }
  priority(t) { return this.d.priorities[t] || 0; }
  // Kachel in einen Zielkontext zeichnen
  frames(t) {
    if (t < 48 || t >= 384) return 1;
    const a = this.autos[(t / 48 | 0) - 1];
    return a && a.naturalHeight > 32 ? Math.max(1, Math.floor(a.naturalWidth / 96)) : (a ? Math.max(1, Math.floor(a.naturalWidth / 32)) : 1);
  }
  draw(ctx, t, dx, dy, frame = 0) {
    if (t >= 384) {
      const n = t - 384, row = n >> 3, col = n & 7;
      const ch = this.chunks[row >> 7];
      if (!ch) return;
      ctx.drawImage(ch, col * 32, (row & 127) * 32, 32, 32, dx, dy, 32, 32);
    } else if (t >= 48) {
      const a = this.autos[(t / 48 | 0) - 1];
      if (!a || !a.naturalWidth) return;
      if (a.naturalHeight <= 32) { const n = Math.max(1, a.naturalWidth / 32 | 0); ctx.drawImage(a, (frame % n) * 32, 0, 32, 32, dx, dy, 32, 32); return; }
      const pat = t % 48, parts = AUTOTILE_PARTS[pat >> 3][pat & 7];
      const fx = (frame % Math.max(1, a.naturalWidth / 96 | 0)) * 96;
      for (let i = 0; i < 4; i++) {
        const q = parts[i] - 1, sx = fx + (q % 6) * 16, sy = (q / 6 | 0) * 16;
        ctx.drawImage(a, sx, sy, 16, 16, dx + (i & 1) * 16, dy + (i >> 1) * 16, 16, 16);
      }
    }
  }
}

class GameMap {
  constructor(id) {
    const d = SR_DATA.maps[id];
    if (!d) throw new Error("Karte fehlt: " + id);
    this.id = id; this.d = d; this.w = d.w; this.h = d.h;
    this.name = d.name;
    this.ts = GameMap.tileset(d.tileset);
    this.data = d.data;
  }
  static tileset(id) { GameMap.tsCache = GameMap.tsCache || {}; return GameMap.tsCache[id] || (GameMap.tsCache[id] = new Tileset(id)); }
  tile(x, y, z) { return this.data[(z * this.h + y) * this.w + x]; }
  valid(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }

  // RMXP Game_Map#passable? (bit: 1=unten 2=links 4=rechts 8=oben)
  passable(x, y, d) {
    if (!this.valid(x, y)) return false;
    const bit = (1 << (d / 2 - 1)) & 0x0f;
    for (let z = 2; z >= 0; z--) {
      const t = this.tile(x, y, z);
      if (!t) continue;
      const p = this.ts.passage(t);
      if (p & bit) return false;
      if ((p & 0x0f) === 0x0f) return false;
      if (this.ts.priority(t) === 0) return true;
    }
    return true;
  }
  counter(x, y) {
    if (!this.valid(x, y)) return false;
    for (let z = 2; z >= 0; z--) {
      const t = this.tile(x, y, z);
      if (t && (this.ts.passage(t) & 0x80)) return true;
    }
    return false;
  }

  // Boden (Priorität 0) einmal vorrendern, Prioritäts-Kacheln merken
  build() {
    const c = document.createElement("canvas");
    c.width = this.w * 32; c.height = this.h * 32;
    const ctx = c.getContext("2d");
    this.pri = []; this.anim = [];
    for (let z = 0; z < 3; z++) {
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          const t = this.tile(x, y, z);
          if (!t) continue;
          const p = this.ts.priority(t);
          if (p > 0) this.pri.push({ x, y, t, p, z: y * 32 + 32 + p * 32 });
          else {
            this.ts.draw(ctx, t, x * 32, y * 32);
            if (this.ts.frames(t) > 1) this.anim.push({ x, y, z });
          }
        }
      }
    }
    this.ground = c; this.gctx = ctx; this.frame = 0;
  }
  // animierte Kacheln (Wasser, Blumen, Brunnen) weiterschalten
  animate(time) {
    if (!this.anim || !this.anim.length) return;
    const f = Math.floor(time / 0.25);
    if (f === this.frame) return;
    this.frame = f;
    const done = new Set();
    for (const a of this.anim) {
      const k = a.y * this.w + a.x;
      if (done.has(k)) continue;
      done.add(k);
      this.gctx.clearRect(a.x * 32, a.y * 32, 32, 32);
      for (let z = 0; z < 3; z++) {
        const t = this.tile(a.x, a.y, z);
        if (t && this.ts.priority(t) === 0) this.ts.draw(this.gctx, t, a.x * 32, a.y * 32, f);
      }
    }
  }
}
