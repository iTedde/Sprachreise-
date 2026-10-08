// Sprachreise – Figuren (Spielerin und Events)
"use strict";

const DIR_DX = { 2: 0, 4: -1, 6: 1, 8: 0 }, DIR_DY = { 2: 1, 4: 0, 6: 0, 8: -1 };
const DIR_ROW = { 2: 0, 4: 1, 6: 2, 8: 3 };
const KEY_DIR = { down: 2, left: 4, right: 6, up: 8 };
const SPEED_SEC = { 1: 0.8, 2: 0.45, 3: 0.3, 4: 0.2, 5: 0.14, 6: 0.1 };

class Character {
  constructor(x, y) {
    this.x = x; this.y = y; this.px = x * 32; this.py = y * 32;
    this.dir = 2; this.pattern = 0; this.sprite = null; this.spriteName = "";
    this.moving = false; this.prog = 0; this.from = null; this.stepN = 0;
    this.speed = 3; this.through = false; this.stepAnime = false; this.dirFix = false;
    this.moveType = null; this.freq = 3; this.wait = 1 + Math.random() * 2;
    this.route = null; this.routeI = 0; this.forced = null; this.locked = false;
    this.opacity = 1; this.visible = true; this.balloon = 0; this.animT = 0; this.tileId = 0;
  }
  setSprite(name) {
    this.spriteName = name || "";
    this.sprite = name ? Gfx.img("img/chars/" + name + ".png") : null;
  }
  get hasGraphic() { return !!this.sprite || !!this.tileId; }
  secPerTile() { return SPEED_SEC[this.speed] || 0.3; }

  canMove(d) {
    const nx = this.x + DIR_DX[d], ny = this.y + DIR_DY[d], m = World.map;
    if (!m.valid(nx, ny)) return false;
    if (this.through) return true;
    if (!m.passable(this.x, this.y, d)) return false;
    if (!m.passable(nx, ny, 10 - d)) return false;
    for (const e of World.events) {
      if (e === this || !e.page || e.through || !e.visible) continue;
      if (e.x === nx && e.y === ny) {
        if (this !== World.player) return false;
        if (e.hasGraphic) return false;
      }
    }
    if (this !== World.player && World.player.x === nx && World.player.y === ny && !World.player.through) return false;
    return true;
  }
  turn(d) { if (!this.dirFix) this.dir = d; }
  turnToward(o) {
    const dx = o.x - this.x, dy = o.y - this.y;
    if (Math.abs(dx) > Math.abs(dy)) this.turn(dx < 0 ? 4 : 6);
    else if (dy !== 0) this.turn(dy < 0 ? 8 : 2);
  }
  move(d) {
    this.turn(d);
    if (!this.canMove(d)) return false;
    this.from = [this.x, this.y];
    this.x += DIR_DX[d]; this.y += DIR_DY[d];
    this.moving = true; this.prog = 0; this.stepN++;
    return true;
  }
  // Bewegungsfolge erzwingen ("UULL.r"), Promise erfüllt sich am Ende
  force(seq, waitDot = 0.2) {
    return new Promise(res => {
      this.forced = { seq, i: 0, res, waitDot, t: 0, stuck: 0 };
    });
  }
  updateForced(dt) {
    const f = this.forced;
    if (this.moving) return;
    if (f.t > 0) { f.t -= dt; return; }
    if (f.i >= f.seq.length) { this.forced = null; f.res(); return; }
    const c = f.seq[f.i];
    const mv = { U: 8, D: 2, L: 4, R: 6 }[c], tn = { u: 8, d: 2, l: 4, r: 6 }[c];
    if (mv) {
      if (this.move(mv)) { f.i++; f.stuck = 0; }
      else { f.stuck += dt; if (f.stuck > 0.6) { f.i++; f.stuck = 0; } }   // blockiert: überspringen
    } else if (tn) { this.turn(tn); f.i++; }
    else if (c === ".") { f.t = f.waitDot; f.i++; }
    else f.i++;
  }
  updateAuto(dt) {
    if (this.locked || World.frozen || !this.moveType || this.moving) return;
    this.wait -= dt;
    if (this.wait > 0) return;
    const f = this.freq;
    this.wait = Math.max(0.05, (40 - f * 2) * (6 - f) / 40) * (0.6 + Math.random() * 0.8);
    if (this.moveType === "random") {
      const d = [2, 4, 6, 8][U.rand(4)];
      if (Math.random() < 0.3) this.turn(d); else this.move(d);
    } else if (typeof this.moveType === "string") {
      const seq = this.moveType;
      for (let n = 0; n < seq.length; n++) {
        const c = seq[this.routeI % seq.length]; this.routeI++;
        const mv = { U: 8, D: 2, L: 4, R: 6 }[c], tn = { u: 8, d: 2, l: 4, r: 6 }[c];
        if (mv) { if (!this.move(mv)) this.routeI--; this.wait = 0.02; break; }
        if (tn) { this.turn(tn); continue; }
        if (c === ".") { this.wait = 0.75; break; }
      }
    }
  }
  update(dt) {
    if (this.forced) this.updateForced(dt);
    else this.updateAuto(dt);
    if (this.moving) {
      this.prog += dt / this.secPerTile();
      if (this.prog >= 1) {
        this.prog = 1; this.moving = false;
        this.px = this.x * 32; this.py = this.y * 32;
        this.onArrive && this.onArrive();
      } else {
        this.px = (this.from[0] + (this.x - this.from[0]) * this.prog) * 32;
        this.py = (this.from[1] + (this.y - this.from[1]) * this.prog) * 32;
      }
    } else { this.px = this.x * 32; this.py = this.y * 32; }
    // Animation
    if (this.moving) this.pattern = this.prog < 0.5 ? (this.stepN % 2 ? 1 : 3) : 0;
    else if (this.stepAnime) { this.animT += dt; this.pattern = Math.floor(this.animT / 0.18) % 4; }
    else this.pattern = 0;
    if (this.balloon > 0) this.balloon -= dt;
  }
  // z-Wert wie RMXP (für Sortierung mit Prioritäts-Kacheln)
  get z() { return this.py + 32 + (this.sprite && this.sprite.naturalHeight / 4 > 32 ? 31 : 0) + (this.onTop ? 9999 : 0); }
  draw(ctx, cx, cy) {
    if (!this.visible) return;
    if (this.tileId) { World.map.ts.draw(ctx, this.tileId, this.px - cx, this.py - cy); return; }
    const im = this.sprite;
    if (!im || !im.naturalWidth) return;
    const fw = im.naturalWidth / 4, fh = im.naturalHeight / 4;
    const sx = this.pattern * fw, sy = DIR_ROW[this.dir] * fh;
    const dx = Math.round(this.px - cx + 16 - fw / 2), dy = Math.round(this.py - cy + 32 - fh);
    if (this.opacity < 1) ctx.globalAlpha = this.opacity;
    ctx.drawImage(im, sx, sy, fw, fh, dx, dy, fw, fh);
    ctx.globalAlpha = 1;
  }
  drawBalloon(ctx, cx, cy) {
    if (this.balloon <= 0) return;
    const im = this.sprite, fh = im && im.naturalHeight ? im.naturalHeight / 4 : 48;
    const x = Math.round(this.px - cx + 16), y = Math.round(this.py - cy + 32 - fh + 4 - Math.min(6, (0.6 - this.balloon) * 40));
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#202430"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 9, y - 26, 18, 22, 5) : ctx.rect(x - 9, y - 26, 18, 22);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#d02828"; ctx.fillRect(x - 2, y - 22, 4, 10); ctx.fillRect(x - 2, y - 10, 4, 4);
  }
}

class GameEvent extends Character {
  constructor(def) {
    super(def.x, def.y);
    this.def = def; this.id = def.id; this.name = def.name; this.page = null; this.pageIdx = -1;
  }
  refresh() {
    let idx = -1;
    const pages = this.def.pages;
    for (let i = pages.length - 1; i >= 0; i--) {
      if (World.cond(pages[i].cond)) { idx = i; break; }
    }
    if (idx === this.pageIdx) return;
    this.pageIdx = idx;
    const p = this.page = idx >= 0 ? pages[idx] : null;
    if (!p) { this.setSprite(null); this.tileId = 0; this.through = true; this.visible = false; return; }
    this.visible = true;
    this.setSprite(p.char || null);
    this.tileId = p.tile || 0;
    if (!this.moving && !this.locked) this.dir = p.dir || 2;
    this.moveType = p.move || null; this.freq = p.freq || 3; this.speed = p.speed || 3;
    this.through = !!p.through || (!p.char && !p.tile && p.trigger !== "action");
    this.stepAnime = !!p.step; this.dirFix = !!p.dirfix; this.onTop = !!p.ontop;
    this.trigger = p.trigger || "action";
  }
}

class Player extends Character {
  constructor() {
    super(0, 0);
    this.setSprite("SR_Heldin");
    this.turnT = 0; this.bumpT = 0;
  }
  secPerTile() { if (flag("fahrrad")) return 0.09; return Input.running() && !this.forced ? 0.13 : 0.22; }
  updateInput(dt) {
    if (this.moving || this.forced) return;
    const k = Input.dir();
    if (!k) { this.turnT = 0; return; }
    const d = KEY_DIR[k];
    if (d !== this.dir && this.turnT <= 0 && this.arrived <= 0) { this.turn(d); this.turnT = 0.09; return; }
    if (this.turnT > 0) { this.turnT -= dt; if (this.turnT > 0) return; }
    if (!this.move(d)) {
      this.turn(d);
      World.bump(this, d);
      this.bumpT -= dt;
      if (this.bumpT <= 0) { Audio_.se("bump", 0.6); this.bumpT = 0.4; }
    }
  }
  update(dt) {
    const was = this.moving;
    super.update(dt);
    if (was && !this.moving) this.arrived = 0.08; else this.arrived = (this.arrived || 0) - dt;
    if (!World.busy && !this.forced && !this.moving && !World.pendingArrive) this.updateInput(dt);
  }
}
