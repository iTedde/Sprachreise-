// Sprachreise – Automatischer Durchspiel-Test (nur aktiv mit ?autotest im Link)
//   index.html?autotest            normales Durchspielen (richtige Antworten)
//   index.html?autotest=reverse    erst falsche Antworten, Tippfehler, dann richtig
//   &lang=ar                       Herkunftssprache
//   &from=5                        ab Episode 5 (Spielstand wird simuliert)
"use strict";

(function () {
  const params = new URLSearchParams(location.search);
  if (!params.has("autotest")) return;
  const mode = params.get("autotest") || "normal";
  const T = window.SR_TEST = {
    active: true, mode, lines: [], errors: [], scenes: {}, says: 0, choices: 0, typed: 0, done: false,
    tried: {}, phase: "", lastProgress: 0,
    log(s) { this.lines.push(s); },
    error(s) { this.errors.push(s); this.lines.push("FEHLER: " + s); },
    onScene(id) { this.sceneN = (this.sceneN || 0) + 1; this.scenes[id] = (this.scenes[id] || 0) + 1; this.lines.push("» Szene " + id); this.lastProgress = Date.now(); },
    onSay(n, t) { this.says++; this.lastProgress = Date.now(); },
    onAnswer(o) { },
    onToast(t) { this.lines.push("  · " + Text.plain(t)); },
    onBanner(a, b) { this.lines.push("  [" + a + "] " + Text.plain(b)); },
    onPaper() { },
    onTyped(v, r) { this.typed++; this.lines.push(`  ✎ "${v}" → ${r.ok ? "ok" : "nein"}`); },
    onMap(id) { this.sceneN = (this.sceneN || 0) + 1; this.lines.push("→ Karte " + id); },
    titleChoice(opts) { return "new"; },
    choose(name, text, options, opts) {
      this.choices++;
      const key = Text.plain(text || "") + "|" + options.length;
      const c = opts && opts.correct !== undefined ? opts.correct : null;
      const correct = c === null ? null : Array.isArray(c) ? c : [c];
      if (this.forceAnswers && this.forceAnswers.length) return this.forceAnswers.shift();
      if (correct) {
        if (mode === "reverse" && !this.tried[key] && !(opts && opts.multi)) {
          this.tried[key] = true;
          const wrongI = options.findIndex((_, i) => !correct.includes(i));
          if (wrongI >= 0) return wrongI;
        }
        return correct[0];
      }
      // ohne bekannte richtige Antwort: abwechselnd
      const n = (this.tried[key] = (this.tried[key] || 0) + 1);
      return mode === "reverse" ? (options.length - 1 - ((n - 1) % options.length)) : ((n - 1) % options.length);
    },
    typePlan(t) {
      if (mode !== "reverse") return [];
      const a = (t.mode === "list") ? t.answers.join(" ") : (t.answers || [""])[0];
      const typo = a.length > 3 ? a.slice(0, -1) + a.slice(-1) + a.slice(-1) : a + "x";
      return ["", typo.toLowerCase()];
    },

    // ---------- Steuerung ----------
    async idle(maxMs = 20000) {
      const t0 = Date.now();
      while (Date.now() - t0 < maxMs) {
        await new Promise(r => setTimeout(r, 20));
        if (!World.busy && !UI.blocking() && !World.player.moving && !World.events.some(e => e.page && e.trigger === "auto")) {
          await new Promise(r => setTimeout(r, 30));
          if (!World.busy && !UI.blocking()) return true;
        }
      }
      this.error("Zeitüberschreitung: Spiel wird nicht frei (" + this.phase + ")");
      return false;
    },
    passable(x, y, d, fromX, fromY) {
      const m = World.map;
      const nx = fromX + DIR_DX[d], ny = fromY + DIR_DY[d];
      if (!m.valid(nx, ny)) return false;
      if (!m.passable(fromX, fromY, d) || !m.passable(nx, ny, 10 - d)) return false;
      for (const e of World.events) if (e.page && e.visible && !e.through && e.hasGraphic && e.x === nx && e.y === ny) return false;
      return true;
    },
    // Weg von der Spielerin zu einem der Zielfelder (BFS)
    path(targets, avoidTouch = true) {
      const p = World.player, m = World.map;
      const key = (x, y) => y * m.w + x;
      const goal = new Set(targets.map(t => key(t[0], t[1])));
      const prev = new Map(); prev.set(key(p.x, p.y), null);
      const q = [[p.x, p.y]];
      const touchAt = new Set(World.events.filter(e => e.page && e.trigger === "touch").map(e => key(e.x, e.y)));
      while (q.length) {
        const [x, y] = q.shift();
        if (goal.has(key(x, y))) {
          const seq = []; let k = key(x, y);
          while (prev.get(k)) { const pr = prev.get(k); seq.unshift(pr[1]); k = pr[0]; }
          return seq.join("");
        }
        for (const [d, c] of [[2, "D"], [4, "L"], [6, "R"], [8, "U"]]) {
          if (!this.passable(null, null, d, x, y)) continue;
          const nx = x + DIR_DX[d], ny = y + DIR_DY[d], nk = key(nx, ny);
          if (prev.has(nk)) continue;
          if (avoidTouch && touchAt.has(nk) && !goal.has(nk)) continue;
          prev.set(nk, [key(x, y), c]); q.push([nx, ny]);
        }
      }
      return null;
    },
    async walkPath(targets, label) {
      const n0 = this.sceneN || 0;
      for (let attempt = 0; attempt < 6; attempt++) {
        if ((this.sceneN || 0) !== n0) return true;      // unterwegs ist etwas passiert (Szene/Kartenwechsel)
        const seq = this.path(targets);
        if (seq === null) { await new Promise(r => setTimeout(r, 300)); continue; }
        if (seq === "") return true;
        World.frozen = true;
        await World.player.force(seq, 0.01);
        World.frozen = false;
        await this.idle();
        if (targets.some(t => t[0] === World.player.x && t[1] === World.player.y)) return true;
        if (World.map.id !== this.curMap) return true;   // durch eine Tür gegangen
      }
      this.error("Kein Weg zu " + label + " auf Karte " + World.map.id + " von " + World.player.x + "," + World.player.y);
      return false;
    },
    async talk(name) {
      this.curMap = World.map.id;
      const e = World.eventByName(name);
      if (!e || !e.page) { this.error(`Event »${name}« fehlt/inaktiv auf ${World.map.id}`); return false; }
      if (e.trigger !== "action") { this.error(`Event »${name}« ist kein Gesprächs-Event`); return false; }
      const adj = [[e.x, e.y + 1, 8], [e.x - 1, e.y, 6], [e.x + 1, e.y, 4], [e.x, e.y - 1, 2]];
      // auch über Theken hinweg
      for (const [dx, dy, d] of [[0, 2, 8], [-2, 0, 6], [2, 0, 4], [0, -2, 2]]) {
        const cx = e.x + dx / 2, cy = e.y + dy / 2;
        if (World.map.counter(cx, cy)) adj.push([e.x + dx, e.y + dy, d]);
      }
      const ok = adj.filter(a => World.map.valid(a[0], a[1]));
      if (!(await this.walkPath(ok.map(a => [a[0], a[1]]), name))) return false;
      const a = ok.find(a => a[0] === World.player.x && a[1] === World.player.y);
      World.player.dir = a[2];
      World.start(e);
      await new Promise(r => setTimeout(r, 30));
      return this.idle(60000);
    },
    async go(name) {
      this.curMap = World.map.id;
      const e = World.eventByName(name);
      if (!e) { this.error(`Durchgang »${name}« fehlt auf ${World.map.id}`); return false; }
      const all = World.events.filter(x => x.name === name && x.page);
      if (!all.length) { this.error(`Durchgang »${name}« inaktiv auf ${World.map.id}`); return false; }
      const from = World.map.id, m = World.map, fx = World.player.x, fy = World.player.y, n0 = this.sceneN || 0;
      const targets = [], bumps = [];
      for (const x of all) {
        if (m.passable(x.x, x.y, 0)) targets.push([x.x, x.y]);
        else for (const [dx, dy, d] of [[0, 1, 8], [-1, 0, 6], [1, 0, 4], [0, -1, 2]]) {
          if (m.valid(x.x + dx, x.y + dy) && m.passable(x.x + dx, x.y + dy, 0)) { targets.push([x.x + dx, x.y + dy]); bumps.push([x.x + dx, x.y + dy, d]); }
        }
      }
      await this.walkPath(targets, name);
      const bp = bumps.find(b => b[0] === World.player.x && b[1] === World.player.y);
      if (bp && World.map.id === from) { World.player.dir = bp[2]; World.bump(World.player, bp[2]); }
      await this.idle(60000);
      return World.map.id !== from || (this.sceneN || 0) !== n0 || Math.abs(World.player.x - fx) + Math.abs(World.player.y - fy) > 3;
    },
    async to(x, y) { this.curMap = World.map.id; return this.walkPath([[x, y]], `${x},${y}`); },
    check(expr, msg) { if (!World.cond(expr)) this.error("Erwartung verfehlt: " + (msg || expr) + " (Karte " + World.map.id + ")"); },

    async run(steps) {
      for (const s of steps) {
        this.phase = typeof s === "function" ? "(Funktion)" : JSON.stringify(s).slice(0, 80);
        if (typeof s === "function") { await s(); await this.idle(); continue; }
        const [cmd, a, b, c] = s;
        if (cmd === "talk") await this.talk(a);
        else if (cmd === "go") { if (!(await this.go(a))) this.error("Kartenwechsel über »" + a + "« fehlgeschlagen"); }
        else if (cmd === "to") await this.to(a, b);
        else if (cmd === "map") { if (World.map.id !== a) this.error(`Erwartet Karte ${a}, bin auf ${World.map.id}`); }
        else if (cmd === "check") this.check(a, b);
        else if (cmd === "answers") this.forceAnswers = a.slice();
        else if (cmd === "save") { SR.save("test"); const st = SR.loadSlot("test"); if (!st || st.points !== S().points) this.error("Speichern/Laden fehlerhaft"); }
        await this.idle(60000);
      }
    },
    async start() {
      U.fastMode = true;
      Player.prototype.secPerTile = function () { return 0.02; };
      Character.prototype.secPerTile = function () { return 0.03; };
      const t0 = Date.now();
      try {
        SR.applyState(SR.newState());
        S().origin = params.get("lang") || "es"; S().name = SR.o("first");
        const from = +(params.get("from") || 1);
        if (from > 1 && T.setup[from]) await T.setup[from]();
        else await World.transfer("hbf", 7, 19, 8, { noFade: true });
        await this.idle();
        for (let e = from; e <= 10; e++) {
          if (!T.routes[e]) { this.log("(keine Route für Episode " + e + ")"); break; }
          this.log("===== EPISODE " + e + " =====");
          await this.run(T.routes[e]);
          if (!S().episodesDone.includes(e)) { this.error("Episode " + e + " nicht abgeschlossen"); break; }
          this.log(`Episode ${e} fertig · ${S().points} SP · ${SR.levelName()} · ${Object.keys(S().words).length} Wörter`);
        }
      } catch (err) { this.error("Ausnahme: " + (err.stack || err)); }
      this.summary = {
        mode, secs: Math.round((Date.now() - t0) / 1000), points: S().points, level: SR.levelName(),
        words: Object.keys(S().words).length, wordsTotal: Object.keys(SR.WORDS).length,
        quests: Object.values(S().quests).filter(q => q.status === "done").length, questsTotal: Object.keys(SR.QUESTS).length,
        episodes: S().episodesDone.slice(), errors: this.errors.length, says: this.says, choices: this.choices, typed: this.typed,
        neverRun: Object.keys(SR.SCENES).filter(k => !this.scenes[k]),
        notLearned: Object.keys(SR.WORDS).filter(k => !S().words[k] && !k.startsWith("it_")),
        questsOpen: Object.keys(SR.QUESTS).filter(q => !(S().quests[q] && S().quests[q].status === "done")),
      };
      this.done = true;
    },
    routes: {}, setup: {},
  };
})();
