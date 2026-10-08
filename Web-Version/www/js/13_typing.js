// Sprachreise – Schreibaufgaben (Tastatur-Eingabe als Minispiel) und Handy-Nachrichten
// Prinzip: Schreiben ist Teil der Welt (Einkaufszettel, SMS, Formular, Bestellung).
// Fehler kosten nichts: "Fast!", Hinweis, Wörterbuch, Musterlösung.
"use strict";

const Typing = {
  // Wie streng wird geprüft? Am Anfang großzügig, später genauer (Abschnitt 46/48/49).
  strictness() { const e = ep(); return e <= 2 ? 0 : e <= 5 ? 1 : 2; },

  tokens(s) { return U.norm(s).split(" ").filter(Boolean); },

  // Kernprüfung. Ergebnis: {ok, near, msg, fixed}
  check(input, t) {
    const raw = input.trim().replace(/\s+/g, " ");
    if (!raw) return { ok: false, msg: "Schreib etwas – ein Wort reicht schon." };
    if (t.validate) { const r = t.validate(raw); if (r) return r; }
    const strict = this.strictness();
    const answers = t.answers || [];
    const cleanEnd = s => s.replace(/[.!?]+$/, "").trim();
    const mode = t.mode || (answers.some(a => a.includes(" ")) ? "sentence" : "word");

    if (mode === "list") return this.checkList(raw, t);

    // 1. genau richtig (Satzzeichen am Ende egal)
    for (const a of answers) if (cleanEnd(raw) === cleanEnd(a)) return { ok: true, perfect: true };
    // 2. nur Groß-/Kleinschreibung
    for (const a of answers) {
      if (cleanEnd(raw).toLowerCase() === cleanEnd(a).toLowerCase()) {
        const cap = /^[A-ZÄÖÜ]/.test(a) && !/^[A-ZÄÖÜ]/.test(raw);
        const msg = cap && mode === "word" ? "Nomen schreibt man auf Deutsch groß: <b>" + U.esc(a) + "</b>." : "Achte auf Groß- und Kleinschreibung: <b>" + U.esc(a) + "</b>.";
        if (strict < 2 || mode === "sentence") return { ok: true, note: msg };
        return { ok: false, near: true, msg: "Fast! " + msg };
      }
    }
    // 3. Umlaut-Ersatz (ae, oe, ue, ss)
    for (const a of answers) {
      if (U.deumlaut(cleanEnd(raw)).toLowerCase() === U.deumlaut(cleanEnd(a)).toLowerCase()) {
        if (strict < 1) return { ok: true, note: "Richtig! Mit Umlaut schreibt man: <b>" + U.esc(a) + "</b>. (Tipp: die Tasten ä ö ü ß unten)" };
        return { ok: false, near: true, msg: "Fast! Schau auf die Umlaute (ä, ö, ü, ß)." };
      }
    }
    // 4. Akzente (Namen wie Ríos)
    for (const a of answers) {
      if (U.deaccent(cleanEnd(raw)).toLowerCase() === U.deaccent(cleanEnd(a)).toLowerCase())
        return { ok: true, note: "Richtig – mit Akzent: <b>" + U.esc(a) + "</b>." };
    }
    if (mode === "word" || mode === "name") {
      // 5. kleiner Tippfehler
      let best = 99, bestA = null;
      for (const a of answers) {
        const d = U.lev(U.deumlaut(cleanEnd(raw).toLowerCase()), U.deumlaut(cleanEnd(a).toLowerCase()));
        if (d < best) { best = d; bestA = a; }
      }
      const tol = bestA && bestA.length >= 9 ? 2 : 1;
      if (best <= tol) return { ok: false, near: true, msg: "Fast! Schau noch einmal auf das Wort.", nearAnswer: bestA };
      return { ok: false, msg: t.wrongMsg || "Das ist leider nicht das gesuchte Wort." };
    }
    // ---- Sätze ----
    const n = U.norm(raw), nd = U.deumlaut(n);
    for (const a of answers) {
      const na = U.norm(a);
      if (n === na) return { ok: true, perfect: true };
      if (nd === U.deumlaut(na)) return strict < 1 ? { ok: true, note: "Mit Umlauten: <b>" + U.esc(a) + "</b>" } : { ok: false, near: true, msg: "Fast! Schau auf die Umlaute (ä, ö, ü, ß)." };
      if (U.lev(nd, U.deumlaut(na)) <= Math.max(1, Math.floor(na.length / 14)))
        return strict < 2 ? { ok: true, note: "Kleiner Tippfehler – richtig ist: <b>" + U.esc(a) + "</b>" } : { ok: false, near: true, msg: "Fast! Da ist noch ein kleiner Tippfehler." };
    }
    if (t.need) {
      const toks = this.tokens(raw).map(U.deumlaut);
      const has = alt => {
        const al = U.deumlaut(U.norm(alt));
        if (al.includes(" ")) return (" " + toks.join(" ") + " ").includes(" " + al + " ");
        return toks.some(x => x === al || (al.length >= 5 && U.lev(x, al) <= 1));
      };
      const exact = alt => {
        const al = U.deumlaut(U.norm(alt));
        if (al.includes(" ")) return (" " + toks.join(" ") + " ").includes(" " + al + " ");
        return toks.includes(al);
      };
      const missing = t.need.findIndex(g => !g.some(has));
      const forbidden = (t.forbid || []).find(f => toks.includes(U.deumlaut(U.norm(f))));
      if (forbidden) return { ok: false, msg: t.forbidMsg || "Hm, das Wort »" + U.esc(forbidden) + "« passt hier nicht." };
      if (missing < 0) {
        if (toks.length < (t.minWords || 2)) return { ok: false, msg: "Schreib bitte einen ganzen Satz." };
        const typo = t.need.findIndex(g => !g.some(exact));
        if (typo >= 0 && strict >= 2) return { ok: false, near: true, msg: "Fast! Schau noch einmal auf »" + U.esc(t.need[typo][0]) + "«." };
        return { ok: true, note: typo >= 0 ? "Gut verstanden! Achte auf die Schreibweise: <b>" + U.esc(t.need[typo][0]) + "</b>" : null, free: true };
      }
      const tip = (t.tips && t.tips[missing]) || "Tipp: Benutze »" + U.esc(t.need[missing][0]) + "«.";
      return { ok: false, msg: tip };
    }
    return { ok: false, msg: t.wrongMsg || "Das passt noch nicht ganz." };
  },

  checkList(raw, t) {
    const toks = this.tokens(raw).map(x => U.deumlaut(x));
    const items = t.answers;
    const miss = [], near = [];
    for (const a of items) {
      const al = U.deumlaut(a.toLowerCase());
      if (toks.includes(al)) continue;
      if (toks.some(x => U.lev(x, al) <= 1)) near.push(a); else miss.push(a);
    }
    if (!miss.length && !near.length) return { ok: true, perfect: true };
    if (!miss.length) return this.strictness() < 1 ? { ok: true, note: "Fast perfekt! Richtig geschrieben: " + near.map(U.esc).join(", ") } :
      { ok: false, near: true, msg: "Fast! Ein Wort hat noch einen kleinen Fehler." };
    return { ok: false, msg: `Es fehlt noch etwas (${items.length - miss.length} von ${items.length}).` };
  },

  hintFor(t, level) {
    if (t.hints && t.hints[level - 1]) return t.hints[level - 1];
    const a = (t.answers || [""])[0];
    if ((t.mode || "word") === "list") return "Gesucht: " + t.answers.map(w => w[0] + "…").join(", ");
    if (a.includes(" ")) {
      const w = a.split(" ");
      if (level === 1) return "Anfang: »" + U.esc(w.slice(0, Math.min(2, w.length)).join(" ")) + " …«";
      return "Muster: »" + U.esc(w.map((x, i) => i % 2 ? x.replace(/./g, "_") : x).join(" ")) + "«";
    }
    const show = Math.min(a.length - 1, level === 1 ? 1 : Math.ceil(a.length / 2));
    return "Das Wort: <span class=slot>" + U.esc(a.slice(0, show)) + "_".repeat(a.length - show).split("").join(" ") + "</span> (" + a.length + " Buchstaben)";
  },

  // ------------------------------------------------------------------------------
  // Aufgabe anzeigen. t = {prompt, speaker, pic, answers, mode, need, tips, hints, word, pts, label, place}
  // Ergebnis: {ok, text, tries, usedHint, model}
  task(t) {
    return new Promise(async resolve => {
      await UI.flush();
      UI.modalCount++;
      const box = UI.add("div", "win typebox", "");
      if (t.place === "bottom") { box.style.top = "auto"; box.style.bottom = "8px"; }
      const lvl = ["A2", "A2", "A2+", "A2+", "A2+", "B1-", "B1-", "B1-", "B1", "B1"][Math.min(9, ep() - 1)];
      const head = `<span class="sub">✎ ${U.esc(t.label || "Schreibaufgabe")} · ${lvl}</span>` + (t.speaker ? `  <b>${Text.fmt(t.speaker)}:</b>` : "");
      const q = UI.add("div", "tq", (t.pic ? `<div class="pic">${t.pic}</div>` : "") + head + "\n" + Text.fmt(t.prompt), box);
      const inp = U.el("input"); inp.type = "text"; inp.autocomplete = "off"; inp.spellcheck = false;
      inp.setAttribute("autocapitalize", "off"); inp.setAttribute("autocorrect", "off");
      inp.maxLength = t.max || 140; inp.placeholder = t.placeholder || "Hier tippen …";
      box.appendChild(inp);
      const row = UI.add("div", "row", "", box);
      const keys = ["ä", "ö", "ü", "ß"].map(ch => {
        const b = UI.add("button", "btn light key", ch, row);
        b.addEventListener("pointerdown", e => { e.preventDefault(); insert(ch); });
        return b;
      });
      const bHint = UI.add("button", "btn light", "Hinweis", row);
      const bDict = UI.add("button", "btn light", "Wörterbuch", row);
      const bModel = UI.add("button", "btn light hidden", "Lösung zeigen", row);
      const bOk = UI.add("button", "btn", "OK ↵", row);
      bOk.style.marginLeft = "auto";
      const fb = UI.add("div", "fb", t.intro ? Text.fmt(t.intro) : "", box);
      let tries = 0, hintLv = 0, usedDict = false, finished = false;

      const insert = ch => {
        const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
        inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
        inp.focus(); inp.setSelectionRange(s + 1, s + 1);
      };
      const end = (res) => {
        if (finished) return; finished = true;
        Input.popModal(mh);
        box.remove(); UI.modalCount--;
        S().typed++; if (res.ok) S().typedOk++;
        if (t.word) learn(t.word);
        resolve(res);
      };
      const submit = async () => {
        if (finished) return;
        tries++;
        const r = this.check(inp.value, t);
        if (window.SR_TEST) SR_TEST.onTyped(inp.value, r);
        if (r.ok) {
          Audio_.se("point", 0.7);
          const pts = (t.pts || 5) - (tries > 1 ? 2 : 0) - (hintLv ? 1 : 0) - (usedDict ? 1 : 0);
          points(Math.max(1, pts), null, true);
          fb.innerHTML = `<span class="ok">✔ ${r.perfect && tries === 1 ? "Perfekt!" : "Richtig!"}</span> ` + (r.note || "");
          inp.disabled = true;
          if (r.note) await U.sleep(UI.test() ? 0 : 1500);
          else await U.sleep(UI.test() ? 0 : 500);
          end({ ok: true, text: inp.value.trim(), tries, usedHint: hintLv > 0, quality: r.perfect ? "perfect" : "ok" });
          return;
        }
        mistake();
        Audio_.se(r.near ? "tile" : "buzzer", 0.5);
        inp.classList.remove("shake"); void inp.offsetWidth; inp.classList.add("shake");
        fb.innerHTML = `<span class="${r.near ? "hint" : "bad"}">${r.msg}</span>`;
        if (tries >= 2) bModel.classList.remove("hidden");
        inp.focus();
      };
      bOk.addEventListener("click", submit);
      inp.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); submit(); }
        if (e.key === "Escape") { e.preventDefault(); inp.blur(); }
      });
      bHint.addEventListener("click", () => {
        hintLv = Math.min(2, hintLv + 1);
        fb.innerHTML = `<span class="hint">💡 ${this.hintFor(t, hintLv)}</span>`;
        Audio_.se("page", 0.5); inp.focus();
      });
      bDict.addEventListener("click", () => {
        usedDict = true;
        const keys = (t.dict || (t.word ? [t.word] : [])).filter(k => word(k));
        if (!keys.length) fb.innerHTML = `<span class="hint">📖 Dieses Wort steht noch nicht in deinem Wörterbuch. Probier den Hinweis!</span>`;
        else fb.innerHTML = keys.map(k => { const w = SR.WORDS[k]; return `<span class="hint">📖 ${U.esc((w.art ? w.art + " " : "") + w.de)} = ${U.esc(SR.tr(k))}</span>`; }).join("<br>");
        inp.focus();
      });
      bModel.addEventListener("click", async () => {
        const a = (t.mode === "list") ? t.answers.join(", ") : t.answers[0];
        fb.innerHTML = `<span class="hint">Musterlösung: <b>${U.esc(a)}</b> – schreib sie einmal ab.</span>`;
        t = Object.assign({}, t, { answers: (t.mode === "list") ? t.answers : [a].concat(t.answers.slice(1)), validate: null });
        inp.value = ""; inp.focus();
      });
      // Tastatur außerhalb des Eingabefelds: Enter fokussiert
      const mh = k => { if (k === "ok") inp.focus(); };
      Input.pushModal(mh);
      setTimeout(() => { if (!finished) inp.focus(); }, 60);
      if (window.SR_TEST && SR_TEST.active) {
        setTimeout(async () => {
          const plan = SR_TEST.typePlan(t);
          for (const v of plan) { if (finished) break; inp.value = v; await submit(); }
          if (!finished) { inp.value = (t.mode === "list" ? t.answers.join(" ") : t.answers[0]); t.validate = null; await submit(); }
        }, 0);
      }
    });
  },

  // ------------------------------------------------------------------------------
  // Handy: Nachrichtenverlauf mit Antwort der Spielerin.
  // msgs: [{from, text}] (from = Name oder ME), task: Schreibaufgabe für die Antwort (oder null)
  // after: Antworten, die nach dem Senden kommen
  async chat(contact, msgs, task, after = [], opts = {}) {
    await UI.flush();
    Audio_.se("phone", 0.0);
    UI.modalCount++;
    const ph = UI.add("div", "phone", "");
    UI.add("div", "ph-top", "💬 " + Text.fmt(contact), ph);
    const list = UI.add("div", "ph-msgs", "", ph);
    const hist = S().chats[contact] || (S().chats[contact] = []);
    const bubble = (from, text, anim) => {
      const out = from === ME;
      const b = UI.add("div", "bub " + (out ? "out" : "in"), (opts.group && !out ? `<span class="who">${Text.fmt(from)}</span>` : "") + Text.fmt(text), list);
      list.scrollTop = 99999;
      if (anim) Audio_.se(out ? "confirm" : "point", 0.4);
      return b;
    };
    for (const m of hist.slice(-6)) bubble(m[0], m[1], false);
    const push = async (m) => {
      await U.sleep(UI.test() ? 0 : 650);
      bubble(m.from, m.text, true); hist.push([m.from, m.text]);
    };
    for (const m of msgs) await push(m);
    let res = null;
    if (task) {
      ph.style.bottom = "auto"; ph.style.height = "200px";
      res = await this.task(Object.assign({ label: "Nachricht", place: "bottom" }, task));
      ph.style.height = ""; ph.style.bottom = "";
      bubble(ME, res.text, true); hist.push([ME, res.text]);
    }
    for (const m of after) await push(m);
    await U.sleep(UI.test() ? 0 : 400);
    await new Promise(r => {
      if (UI.test()) return r();
      const fin = () => { Input.popModal(h); ph.removeEventListener("pointerup", fin); r(); };
      const h = k => { if (k === "ok" || k === "back") fin(); };
      Input.pushModal(h); ph.addEventListener("pointerup", fin);
    });
    ph.remove(); UI.modalCount--;
    return res;
  },
};

// Kurzform für Szenen
function type_(t) { return Typing.task(t); }
function sms(contact, msgs, task, after, opts) { return Typing.chat(contact, msgs, task, after, opts); }
