// Sprachreise – Spielwelt: Karte laden, Events, Szenen, Kamera, Hauptschleife
"use strict";

SR.SCENES = {};
function scene(id, fn) {
  if (SR.SCENES[id]) console.warn("Szene doppelt:", id);
  SR.SCENES[id] = fn;
}

const World = {
  map: null, events: [], player: null, busy: 0, frozen: false, needRefresh: false,
  cam: { x: 0, y: 0, ox: 0, oy: 0 }, ctx: null, last: 0, running: false, pendingArrive: false,
  condCache: {}, autorunGuard: {}, sceneStack: [],

  init() {
    const c = document.getElementById("map");
    this.ctx = c.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.player = new Player();
    this.player.onArrive = () => { this.pendingArrive = true; };
  },

  cond(expr) {
    if (!expr) return true;
    let f = this.condCache[expr];
    if (!f) {
      try { f = this.condCache[expr] = new Function("return (" + expr + ");"); }
      catch (e) { SR.error("Bedingung fehlerhaft: " + expr); return false; }
    }
    try { return !!f(); } catch (e) { SR.error("Bedingung: " + expr + " – " + e.message); return false; }
  },

  async load(id) {
    const m = new GameMap(id);
    const imgs = m.ts.images();
    await Gfx.ready(imgs);
    m.build();
    this.map = m;
    this.events = m.d.events.map(d => new GameEvent(d));
    this.events.forEach(e => e.refresh());
    await Gfx.ready(this.events.filter(e => e.sprite).map(e => e.sprite).concat([this.player.sprite]));
    this.autorunGuard = {};
  },

  // Kartenwechsel mit Überblendung
  async transfer(id, x, y, dir = 2, opts = {}) {
    const changed = !this.map || this.map.id !== id;
    if (!opts.noFade) await UI.fadeOut(opts.fadeTime || 0.22);
    if (changed) await this.load(id);
    const p = this.player;
    p.x = x; p.y = y; p.px = x * 32; p.py = y * 32; p.moving = false; p.dir = dir || p.dir;
    this.cam.ox = 0; this.cam.oy = 0;
    this.updateCamera(true);
    this.refresh();
    if (changed && this.map.d.bgm !== undefined && !opts.keepBgm) {
      if (this.map.d.bgm) Audio_.bgm(this.map.d.bgm);
    }
    this.render();
    if (!opts.noFade) await UI.fadeIn(opts.fadeTime || 0.22);
    if (changed && this.map.d.announce && !opts.noName) UI.mapName(this.map.name);
    if (window.SR_TEST) SR_TEST.onMap(id);
  },

  refresh() {
    this.needRefresh = false;
    for (const e of this.events) e.refresh();
  },

  eventAt(x, y, pred) { return this.events.find(e => e.page && e.x === x && e.y === y && (!pred || pred(e))); },
  eventByName(n) { return this.events.find(e => e.name === n); },

  // Spielerin läuft gegen etwas
  bump(p, d) {
    const nx = p.x + DIR_DX[d], ny = p.y + DIR_DY[d];
    // wie RMXP: Berührungs-Events auslösen, wenn sie sichtbar sind oder auf einem unpassierbaren Feld liegen (Treppen, Türen)
    const e = this.eventAt(nx, ny, e => e.trigger === "touch" && ((e.hasGraphic && !e.through) || !this.map.passable(nx, ny, 0)));
    if (e) this.start(e);
  },

  // Aktionstaste: Event vor der Spielerin (auch über Theken hinweg)
  checkAction() {
    const p = this.player, d = p.dir;
    let x = p.x + DIR_DX[d], y = p.y + DIR_DY[d];
    let e = this.eventAt(x, y, e => e.trigger === "action");
    if (!e && this.map.counter(x, y)) e = this.eventAt(x + DIR_DX[d], y + DIR_DY[d], e => e.trigger === "action");
    if (!e) e = this.eventAt(p.x, p.y, e => e.trigger === "action" && e.through);
    if (e) { this.start(e); return true; }
    return false;
  },

  checkHere() {
    const p = this.player;
    const e = this.eventAt(p.x, p.y, e => e.trigger === "touch");
    if (e) this.start(e);
  },

  checkAutorun() {
    for (const e of this.events) {
      if (e.page && e.trigger === "auto") {
        const key = this.map.id + ":" + e.id + ":" + e.pageIdx;
        this.autorunGuard[key] = (this.autorunGuard[key] || 0) + 1;
        if (this.autorunGuard[key] > 3) { SR.error("Autostart läuft in Schleife: " + key + " (" + e.page.talk + ")"); e.page = null; continue; }
        this.start(e);
        return true;
      }
    }
    return false;
  },

  // Event ausführen (Szene oder Übergang)
  async start(e) {
    if (this.busy) return;
    const p = e.page; if (!p) return;
    this.busy++;
    try {
      if (p.talk) await this.runScene(p.talk, e);
      if (p.transfer) {
        const t = p.transfer;
        if (t.se) Audio_.se(t.se, 0.8);
        await this.transfer(t.map, t.x, t.y, t.dir);
      }
    } catch (err) {
      SR.error("Fehler in Szene " + (p.talk || "?") + ": " + (err && err.stack || err));
    } finally {
      this.busy--;
      this.refresh();
    }
  },

  async runScene(id, ev) {
    const fn = SR.SCENES[id];
    if (!fn) { SR.error("Szene fehlt: " + id); await UI.say(null, `[Szene »${id}« fehlt]`); return; }
    const prevEv = SR.EV;
    SR.EV = ev || null;
    if (ev && ev.page && ev.page.char) ev.locked = true;
    this.player.moving = false;
    if (window.SR_TEST) SR_TEST.onScene(id);
    try {
      await fn(ev);
      await UI.flush();
    } finally {
      if (ev) ev.locked = false;
      SR.EV = prevEv;
      this.refresh();
    }
  },

  // Szene aus einer Szene heraus aufrufen (wartet)
  async call(id, ev) { return this.runScene(id, ev); },

  updateCamera(snap) {
    const p = this.player, m = this.map;
    let tx = p.px + 16 - 256 + this.cam.ox, ty = p.py + 16 - 192 + this.cam.oy;
    const mw = m.w * 32, mh = m.h * 32;
    tx = mw <= 512 ? (mw - 512) / 2 : U.clamp(tx, 0, mw - 512);
    ty = mh <= 384 ? (mh - 384) / 2 : U.clamp(ty, 0, mh - 384);
    this.cam.x = Math.round(tx); this.cam.y = Math.round(ty);
  },

  update(dt) {
    Input.update();
    if (!this.map) return;
    if (this.needRefresh) this.refresh();
    this.player.update(dt);
    for (const e of this.events) e.update(dt);
    if (this.pendingArrive) {
      this.pendingArrive = false;
      if (!this.busy) this.checkHere();
    }
    if (!this.busy && !UI.blocking()) {
      if (this.checkAutorun()) return;
      if (Input.trigger("ok") && !this.player.moving) this.checkAction();
      else if ((Input.trigger("menu") || Input.trigger("back")) && !this.player.moving && !Input.dir()) Menu.open();
    }
    this.updateCamera();
  },

  render() {
    const ctx = this.ctx, m = this.map;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 512, 384);
    if (!m || !m.ground) return;
    const cx = this.cam.x, cy = this.cam.y;
    m.animate(performance.now() / 1000);
    ctx.drawImage(m.ground, -cx, -cy);
    // Figuren und Prioritäts-Kacheln nach z sortiert
    const items = [];
    const x0 = Math.floor(cx / 32) - 1, x1 = Math.ceil((cx + 512) / 32) + 1;
    const y0 = Math.floor(cy / 32) - 1, y1 = Math.ceil((cy + 384) / 32) + 3;
    for (const t of m.pri) if (t.x >= x0 && t.x <= x1 && t.y >= y0 && t.y <= y1) items.push(t);
    for (const e of this.events) if (e.visible && e.hasGraphic) items.push(e);
    items.push(this.player);
    items.sort((a, b) => a.z - b.z || (a instanceof Character ? 1 : 0) - (b instanceof Character ? 1 : 0));
    for (const it of items) {
      if (it instanceof Character) it.draw(ctx, cx, cy);
      else m.ts.draw(ctx, it.t, it.x * 32 - cx, it.y * 32 - cy);
    }
    for (const e of this.events) e.drawBalloon(ctx, cx, cy);
    this.player.drawBalloon(ctx, cx, cy);
  },

  loop(t) {
    const dt = Math.min(0.05, (t - (this.last || t)) / 1000);
    this.last = t;
    if (!document.hidden) SR.state.playtime += dt;
    try { this.update(dt); this.render(); }
    catch (e) { SR.error("Hauptschleife: " + (e.stack || e)); }
    requestAnimationFrame(tt => this.loop(tt));
  },
  run() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame(t => this.loop(t));
  },
};
