// Sprachreise – Oberfläche: Textfenster, Auswahl, Hinweise, Banner, Papier, Überblendung
"use strict";

const UI = {
  root: null, modalCount: 0, q: [], textSpeed: 1,   // 0 langsam, 1 normal, 2 schnell, 3 sofort
  SPEEDS: [0.045, 0.022, 0.009, 0],

  init() {
    this.root = document.getElementById("ui");
    this.fade = this.add("div", "", ""); this.fade.id = "fade";
    this.toneEl = this.add("div", "", ""); this.toneEl.id = "tone";
    this.toasts = this.add("div", "", ""); this.toasts.id = "toasts";
  },
  add(tag, cls, html, parent) { const e = U.el(tag, cls, html); (parent || this.root).appendChild(e); return e; },
  blocking() { return this.modalCount > 0 || Input.modal.length > 0; },
  test() { return window.SR_TEST && SR_TEST.active; },

  // ---------- Warteschlange (Banner nach learn()/doc() usw.) ----------
  queue(fn) { this.q.push(fn); },
  async flush() { while (this.q.length) { const f = this.q.shift(); await f(); } },

  // ---------- Textfenster ----------
  async say(name, text, opts = {}) {
    await this.flush();
    if (this.test()) SR_TEST.onSay(name, text);
    this.modalCount++;
    const box = this.add("div", "win" + (opts.think ? " think" : ""), ""); box.id = "msg";
    let tag = null;
    if (name) {
      tag = this.add("div", "", Text.fmt(name)); tag.id = "nametag";
      if (name === ME || name === SR.playerName()) tag.classList.add("me-name");
    }
    const inner = U.el("span", "", Text.fmt(text)); box.appendChild(inner);
    if (tag) tag.style.bottom = (box.offsetHeight + 6 - 4) + "px";
    if (!opts.noWait) {
      await this.typewriter(inner);
      const arrow = U.el("div", "arrow"); box.appendChild(arrow);
      await this.waitOk(box);
    } else {
      await this.typewriter(inner);
    }
    if (!opts.keep) { box.remove(); if (tag) tag.remove(); }
    this.modalCount--;
    return { box, tag };
  },
  // Buchstaben nach und nach zeigen
  typewriter(el) {
    const sp = this.SPEEDS[this.textSpeed];
    if (!sp || this.test() || U.fastMode) return Promise.resolve();
    const chars = [];
    const walk = n => {
      for (const c of Array.from(n.childNodes)) {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const ch of Array.from(c.textContent)) { const s = U.el("span", "", ""); s.textContent = ch; s.style.visibility = "hidden"; frag.appendChild(s); chars.push(s); }
          c.replaceWith(frag);
        } else if (c.tagName === "BDI") { c.style.visibility = "hidden"; chars.push(c); }
        else walk(c);
      }
    };
    walk(el);
    return new Promise(res => {
      let i = 0, acc = 0, last = performance.now(), doneFlag = false;
      const finish = () => { if (doneFlag) return; doneFlag = true; chars.forEach(c => c.style.visibility = ""); Input.popModal(h); el.parentNode && el.parentNode.removeEventListener("pointerdown", ph); res(); };
      const h = k => { if (k === "ok" || k === "back") finish(); };
      const ph = e => { e.stopPropagation(); finish(); };
      Input.pushModal(h);
      el.parentNode && el.parentNode.addEventListener("pointerdown", ph);
      const step = now => {
        if (doneFlag) return;
        acc += (now - last) / 1000; last = now;
        while (acc >= sp && i < chars.length) { chars[i++].style.visibility = ""; acc -= sp; }
        if (i >= chars.length) finish(); else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
  waitOk(el) {
    return new Promise(res => {
      if (this.test()) { setTimeout(res, 0); return; }
      const finish = () => { Input.popModal(h); el.removeEventListener("pointerup", ph); res(); };
      const h = k => { if (k === "ok" || k === "back") { finish(); } };
      const ph = e => { e.stopPropagation(); finish(); };
      Input.pushModal(h);
      setTimeout(() => el.addEventListener("pointerup", ph), 120);
    });
  },
  think(text) { return this.say(ME, "<i>(" + text + ")</i>", { think: true }); },
  narr(text) { return this.say(null, text); },

  // ---------- Auswahl ----------
  // options: Liste von Strings; cancel: Index bei "Zurück" (-1 = nicht abbrechbar)
  async ask(name, text, options, cancel = -1, opts = {}) {
    await this.flush();
    let shown = null;
    if (text) shown = await this.say(name, text, { noWait: true, keep: true });
    this.modalCount++;
    const win = this.add("div", "win", ""); win.id = "choices";
    const els = options.map((o, i) => {
      const c = this.add("div", "choice" + (opts.doneIdx && opts.doneIdx.includes(i) ? " done" : ""), Text.fmt(o), win);
      return c;
    });
    const msgH = shown ? shown.box.offsetHeight + 6 : 0;
    win.style.bottom = (msgH + 6 + (shown && shown.tag ? 22 : 0)) + "px";
    if (shown && shown.tag) shown.tag.style.display = "none";
    let idx = opts.start || 0;
    const sel = i => { idx = (i + els.length) % els.length; els.forEach((e, j) => e.classList.toggle("sel", j === idx)); els[idx].scrollIntoView({ block: "nearest" }); };
    sel(idx);
    const res = await new Promise(res => {
      if (this.test()) { setTimeout(() => res(SR_TEST.choose(name, text, options, opts)), 0); return; }
      const finish = v => { Input.popModal(h); res(v); };
      const h = (k) => {
        if (k === "up") { sel(idx - 1); Audio_.se("cursor", 0.5); }
        else if (k === "down") { sel(idx + 1); Audio_.se("cursor", 0.5); }
        else if (k === "ok") { Audio_.se("decision", 0.6); finish(idx); }
        else if (k === "back" && cancel >= 0) { Audio_.se("cancel", 0.6); finish(cancel); }
      };
      Input.pushModal(h);
      els.forEach((e, i) => {
        e.addEventListener("pointerenter", () => sel(i));
        e.addEventListener("click", ev => { ev.stopPropagation(); Audio_.se("decision", 0.6); finish(i); });
      });
    });
    win.remove();
    if (shown) { shown.box.remove(); if (shown.tag) shown.tag.remove(); }
    this.modalCount--;
    if (this.test()) SR_TEST.onAnswer(options[res]);
    return res;
  },
  async confirm(name, text) { return (await this.ask(name, text, ["Ja", "Nein"], 1, { correct: 0, multi: true })) === 0; },

  // ---------- Hinweise ----------
  TOAST_COLORS: { points: "#58b868", quest: "#60a0e8", diary: "#e8a840", map: "#60a0e8", mistake: "#e87048", friend: "#e05888", word: "#40a060" },
  toast(text, kind = "points") {
    const se = { points: "point", quest: "mark", diary: "confirm", map: "confirm", mistake: "bump", friend: "confirm" }[kind];
    if (se) Audio_.se(se, 0.55);
    if (this.test()) SR_TEST.onToast(text, kind);
    while (this.toasts.children.length >= 4) this.toasts.firstChild.remove();
    const t = this.add("div", "toast", Text.fmt(text), this.toasts);
    t.style.setProperty("--tc", this.TOAST_COLORS[kind] || "#60a0e8");
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 400); }, 2800);
  },
  clearToasts() { this.toasts.innerHTML = ""; },

  // ---------- Banner ----------
  async banner(title, big, small, color = "#3060c8", se) {
    if (se) Audio_.se(se, 0.8);
    this.modalCount++;
    const veil = this.add("div", "", ""); veil.id = "veil";
    const b = this.add("div", "win banner", "");
    b.style.setProperty("--bc", color);
    this.add("div", "head", U.esc(title), b);
    this.add("div", "big", Text.fmt(big), b);
    if (small) this.add("div", "small", Text.fmt(small), b);
    if (this.test()) SR_TEST.onBanner(title, big);
    await U.sleep(this.test() ? 0 : 350);
    await new Promise(res => {
      if (this.test()) return res();
      const t = setTimeout(() => finish(), 7000);
      const finish = () => { clearTimeout(t); Input.popModal(h); veil.removeEventListener("pointerup", finish); b.removeEventListener("pointerup", finish); res(); };
      const h = k => { if (k === "ok" || k === "back") finish(); };
      Input.pushModal(h);
      veil.addEventListener("pointerup", finish); b.addEventListener("pointerup", finish);
    });
    veil.remove(); b.remove();
    this.modalCount--;
  },
  newWord(w, key) {
    const word = w.art ? `${w.art} ${w.de}` : w.de;
    const trans = key ? SR.tr(key) : w.en;
    const small = `<c3=2858B8,C8D8F0>= ${U.esc(trans)}</c3>` + (w.ex ? "\n„" + w.ex + "“" : "");
    return this.banner("NEUES WORT GELERNT", U.esc(word), small, "#288450", "word");
  },
  levelUp(code, desc) {
    Audio_.me("levelup");
    return this.banner("SPRACHNIVEAU GESTIEGEN!", "Deutsch " + code, desc, "#c87820");
  },
  episodeComplete(n) {
    const e = SR.EPISODES[n - 1];
    Audio_.me("badge");
    return this.banner(`EPISODE ${n} GESCHAFFT`, e[1],
      `Sprachniveau: ${SR.levelName()}  ·  ${SR.state.points} Sprachpunkte  ·  ${Object.keys(SR.state.words).length} Wörter`, "#a83030");
  },
  // Titelkarte zu Beginn einer Episode
  async episodeCard(n, sub) {
    const e = SR.EPISODES[n - 1];
    const kind = { alltag: "Alltag & Freunde", amt: "Bürokratie", finale: "Finale" }[e[3]] || "";
    const c = this.add("div", "card", "");
    c.style.opacity = "0";
    c.innerHTML = `<div class="t1">EPISODE ${n} VON 10 · ${kind.toUpperCase()}</div><div class="flag"></div>
      <div class="t2">${U.esc(e[1])}</div><div class="t3">${U.esc(e[2])}</div>${sub ? `<div class="t4">${Text.fmt(sub)}</div>` : ""}`;
    if (this.test()) SR_TEST.onBanner("EPISODE", e[1]);
    await U.sleep(30); c.style.opacity = "1";
    await U.sleep(this.test() ? 0 : 2800);
    c.style.opacity = "0";
    await U.sleep(this.test() ? 0 : 500);
    c.remove();
  },

  // ---------- Überblendung ----------
  async fadeOut(t = 0.25) { this.fade.style.transition = `opacity ${t}s`; this.fade.style.opacity = "1"; await U.sleep(t * 1000 + 20); },
  async fadeIn(t = 0.25) { this.fade.style.transition = `opacity ${t}s`; this.fade.style.opacity = "0"; await U.sleep(t * 1000 + 20); },
  async tone(op, t = 0.5) { this.toneEl.style.transition = `opacity ${t}s`; this.toneEl.style.opacity = String(op); await U.sleep(t * 1000); },

  mapName(name) {
    if (this.nameEl) this.nameEl.remove();
    const e = this.add("div", "off", Text.fmt(name)); e.id = "mapname";
    this.nameEl = e;
    requestAnimationFrame(() => requestAnimationFrame(() => e.classList.remove("off")));
    setTimeout(() => { e.classList.add("off"); setTimeout(() => e.remove(), 400); }, 2400);
  },

  // ---------- Papier / Bildschirm (bleibt sichtbar, während gefragt wird) ----------
  paper(title, body, style = "paper", opts = {}) {
    const p = this.add("div", "win paper paper-" + style, "");
    const ti = this.add("div", "ptitle", Text.fmt(title), p);
    const bo = this.add("div", "pbody" + (opts.mono ? " mono" : ""), Text.fmt(body), p);
    if (opts.maxH) p.style.maxHeight = opts.maxH + "px";
    if (opts.height) p.style.height = opts.height + "px";
    const h = {
      el: p,
      set(t) { bo.innerHTML = Text.fmt(t); },
      title(t) { ti.innerHTML = Text.fmt(t); },
      close() { p.remove(); },
    };
    if (this.test()) SR_TEST.onPaper(title, body);
    return h;
  },
  async withPaper(title, body, style, fn, opts) {
    const p = this.paper(title, body, style, opts);
    try { return await fn(p); } finally { p.close(); }
  },
};

// ---------- Kurzformen für Szenen ----------
function say(name, text, opts) { return UI.say(name, text, opts); }
function think(text) { return UI.think(text); }
function narr(text) { return UI.narr(text); }
function ask(name, text, options, cancel, opts) { return UI.ask(name, text, options, cancel, opts); }
function confirm_(name, text) { return UI.confirm(name, text); }
function toast(text, kind) { UI.toast(text, kind); }
function wrong(text) { mistake(); UI.toast(text || "Kein Problem – daraus lernt man!", "mistake"); }
function wait(sec) { return U.sleep(sec * 1000); }
function se(name, vol, rate) { Audio_.se(name, vol, rate); }
function me_(name) { return Audio_.me(name); }
function bgm(name) { Audio_.bgm(name); }
function durchsage(text) { Audio_.se("tab_start", 0.8); return say("Durchsage", "♪ " + text); }
function o(f) { return SR.o(f); }
function me() { return SR.playerName(); }
