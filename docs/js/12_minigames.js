// Sprachreise – Szenen-Helfer und klassische Minispiele
// (Quiz, Formular, Fehler finden, Unterlagen wählen, Telefonat, Brief)
"use strict";

// ---------- Szenen-Helfer ----------
function ev(nameOrId) {
  if (nameOrId === "player") return World.player;
  if (typeof nameOrId === "number") return World.events.find(e => e.id === nameOrId);
  return World.eventByName(nameOrId);
}
function face(e = SR.EV) { if (e && e !== World.player) e.turnToward(World.player); }
async function walk(who, seq, opts = {}) {
  const c = typeof who === "string" ? ev(who) : who;
  if (!c) { SR.error("walk: Figur fehlt: " + who); return; }
  const savedSpeed = c.speed;
  if (opts.speed) c.speed = opts.speed;
  const p = c.force(seq, opts.dot || 0.2);
  if (opts.noWait) return;
  await p;
  c.speed = savedSpeed;
}
async function exclaim(who = SR.EV) {
  const c = typeof who === "string" ? ev(who) : who;
  if (!c) return;
  Audio_.se("exclaim", 0.7);
  c.balloon = 0.7;
  await wait(0.6);
}
async function transfer(map, x, y, dir = 2, opts) { await World.transfer(map, x, y, dir, opts); }
function player() { return World.player; }
async function scrollCam(dx, dy, sec = 1.2) {
  const c = World.cam, sx = c.ox, sy = c.oy, t0 = U.now();
  while (true) {
    const k = Math.min(1, (U.now() - t0) / (U.fastMode ? 0.001 : sec));
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    c.ox = sx + dx * e; c.oy = sy + dy * e;
    if (k >= 1) break;
    await new Promise(r => requestAnimationFrame(r));
  }
}
// Figur temporär ein-/ausblenden (z. B. Gäste beim WG-Abend)
function show(name, on = true) { const e = ev(name); if (e) e.visible = on; }
// Figur sofort an eine Stelle setzen (für Szenen)
function place(who, x, y, dir) {
  const c = typeof who === "string" ? ev(who) : who;
  if (!c) return;
  c.x = x; c.y = y; c.px = x * 32; c.py = y * 32; c.moving = false;
  if (dir) c.dir = dir;
  c.visible = true;
}
async function sleepScene(text, sub) {
  Audio_.bgmStop(1);
  await UI.tone(1, 0.8);
  if (text) await narr(text);
  if (sub) await UI.episodeCard(sub);
}

// ---------- Minispiele ----------
const Mini = {
  // Quiz: [{q, o:[..], a: index|[indices], why, yes, speaker, retry}]
  async quiz(questions, ptsEach = 4) {
    let first = 0;
    for (const q of questions) {
      let tries = 0;
      while (true) {
        tries++;
        const i = await ask(q.speaker || null, q.q, q.o, -1, { correct: q.a });
        const ok = Array.isArray(q.a) ? q.a.includes(i) : i === q.a;
        if (ok) {
          Audio_.se("point", 0.6);
          if (q.yes) await say(q.speaker || null, q.yes);
          if (tries === 1) first++;
          points(tries === 1 ? ptsEach : 1, null, true);
          break;
        }
        mistake();
        UI.toast("Nicht ganz – versuch's nochmal!", "mistake");
        await say(q.speaker || null, q.why || "Hmm, das stimmt nicht ganz.");
        if (q.retry === false) break;
      }
    }
    if (questions.length > 1) UI.toast(`${first} von ${questions.length} beim ersten Versuch richtig`);
    return first;
  },

  // Formular. fields: [{label, o:[..], a, req, why, word, yes, hint, who}] oder Schreibfeld:
  //   {label, type:{...wie Typing.task}, req}
  async form(title, fields, intro) {
    const values = fields.map(() => "");
    let errors = 0;
    const render = () => fields.map((f, i) => {
      const star = f.req && skill("formulare") ? "<c3=C03030,F0C0C0>*</c3>" : "";
      const v = values[i] ? `<c3=2040A0,C0D0F0>${U.esc(values[i])}</c3>` : "<c3=A0A0A8,E8E8E0>________</c3>";
      return `${f.label}${star}: ${v}`;
    }).join("\n");
    const p = UI.paper(title, render(), "paper", { maxH: 270 });
    p.el.style.fontSize = fields.length > 9 ? "16px" : "";
    try {
      if (intro) await narr(intro);
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        let prompt = `<b>${f.label}</b>` + (f.hint ? "\n" + f.hint : "");
        if (skill("formulare")) prompt += f.req ? "  <c3=C03030,F0C0C0>(Pflichtfeld)</c3>" : "  <c3=307030,C0E0C0>(freiwillig)</c3>";
        if (f.type) {
          const r = await Typing.task(Object.assign({ prompt, place: "bottom" }, f.type));
          values[i] = r.text; p.set(render());
          if (f.word) learn(f.word);
          continue;
        }
        while (true) {
          const k = await ask(null, prompt, f.o, -1, { correct: f.a });
          const ok = Array.isArray(f.a) ? f.a.includes(k) : k === f.a;
          if (ok) {
            values[i] = Text.plain(f.o[k]).startsWith("(") ? "–" : Text.plain(f.o[k]);
            p.set(render());
            if (f.word) learn(f.word);
            points(2, null, true);
            if (f.yes) await narr(f.yes);
            break;
          }
          errors++; mistake();
          UI.toast("Fehler im Formular – kein Problem!", "mistake");
          await say(f.who || null, f.why || "Das passt hier nicht.");
        }
      }
      Audio_.se("found", 0.7);
      await wait(0.5);
    } finally { p.close(); }
    return errors;
  },

  // Fehler finden: rows = [[Text, falsch?, Erklärung]]
  async findErrors(title, rows, speaker) {
    const found = [];
    const wrongTotal = rows.filter(r => r[1]).length;
    let attempts = 0;
    const render = () => rows.map((r, i) => found.includes(i) ? `<c3=C03030,F0C0C0>[!] ${r[0]}</c3>` : "     " + r[0]).join("\n");
    const p = UI.paper(title, render(), "paper");
    try {
      while (found.length < wrongTotal) {
        const opts = rows.map((r, i) => (found.includes(i) ? "[!] " : "") + Text.plain(r[0]));
        opts.push("Alles korrekt.");
        const correct = rows.map((r, i) => r[1] && !found.includes(i) ? i : -1).filter(i => i >= 0);
        const k = await ask(speaker, `Was stimmt nicht? (Noch ${wrongTotal - found.length} Fehler)`, opts, -1, { correct });
        attempts++;
        if (k === rows.length) { mistake(); await narr("Hm … Ich schaue lieber nochmal genau hin. Irgendwo ist noch ein Fehler."); }
        else if (rows[k][1] && !found.includes(k)) {
          found.push(k); Audio_.se("mark", 0.8); p.set(render());
          await narr(rows[k][2]); points(4, null, true);
        } else if (found.includes(k)) await narr("Das habe ich schon markiert.");
        else { mistake(); await narr(rows[k][2] || "Nein, das ist richtig so."); }
      }
    } finally { p.close(); }
    return attempts;
  },

  // Unterlagen wählen: docs = [[key, "yes"|"no"|"ok", Kommentar]] -> fehlende nötige Keys
  async pickDocs(speaker, prompt, docs) {
    const chosen = new Set();
    while (true) {
      const opts = docs.map(d => (chosen.has(d[0]) ? "[x] " : "[  ] ") + SR.DOCUMENTS[d[0]].name);
      opts.push("Fertig – das gebe ich ab.");
      const need = docs.map((d, i) => (d[1] === "yes" && !chosen.has(d[0])) || (d[1] === "no" && chosen.has(d[0])) ? i : -1).filter(i => i >= 0);
      const k = await ask(speaker, prompt, opts, -1, { correct: need.length ? need : [docs.length], multi: true });
      if (k === docs.length) {
        if (chosen.size) break;
        await narr("Ich muss schon etwas abgeben …"); continue;
      }
      const key = docs[k][0];
      chosen.has(key) ? chosen.delete(key) : chosen.add(key);
    }
    const missing = [];
    for (const d of docs) {
      if (d[1] === "yes" && !chosen.has(d[0])) missing.push(d[0]);
      else if (d[1] === "no" && chosen.has(d[0])) { mistake(); await say(speaker, d[2]); }
      else if (d[1] === "ok" && chosen.has(d[0]) && d[2]) await say(speaker, d[2]);
    }
    points(missing.length ? 2 : 6, null, true);
    return missing;
  },

  // Telefonat mit Wiederholen-Option, danach Fragen
  async phone(caller, lines, slow, questions = []) {
    Audio_.me("phone");
    const p = UI.paper("Anruf: " + caller, "<c3=60D080,103020>Verbunden</c3>", "phone");
    try {
      let heard = lines;
      while (true) {
        for (const l of heard) await say(caller, l);
        const k = await ask(ME, "(Habe ich alles verstanden?)", ["Ja, alles klar.",
          "Entschuldigung, können Sie das bitte wiederholen? Etwas langsamer, bitte."], -1, { correct: 0 });
        if (k === 0) break;
        learn("wiederholen");
        heard = slow;
      }
    } finally { p.close(); }
    return questions.length ? this.quiz(questions, 5) : 0;
  },

  // Brief lesen, Fragen beantworten (Brief bleibt sichtbar)
  async letter(title, pages, questions = []) {
    const p = UI.paper(title, pages[0], "letter", { maxH: 280 });
    try {
      for (let i = 0; i < pages.length; i++) {
        p.set(pages[i]);
        await narr(i < pages.length - 1 ? "(Weiterlesen …)" : "(Ende des Briefes.)");
      }
      if (skill("briefe")) await narr("<c3=307030,C0E0C0>Tipp: Achte auf Fristen, Beträge und was du tun musst.</c3>");
      return await this.quiz(questions, 5);
    } finally { p.close(); }
  },

  // Zuordnen: pairs = [[links, rechts], ...] – z. B. Lehrbuch ↔ Alltag
  async match(title, pairs, speaker, intro) {
    let first = 0;
    const p = UI.paper(title, "", "paper");
    const doneRows = [];
    const render = () => p.set(pairs.map((pr, i) => doneRows.includes(i) ? `<c3=307030,C0E0C0>■ ${pr[0]}  →  ${pr[1]}</c3>` : `□ ${pr[0]}  →  ?`).join("\n"));
    render();
    try {
      if (intro) await say(speaker, intro);
      for (let i = 0; i < pairs.length; i++) {
        const opts = pairs.map(x => x[1]);
        const order = opts.map((_, j) => j).sort((a, b) => ((a * 7 + i * 3) % opts.length) - ((b * 7 + i * 3) % opts.length));
        const shown = order.map(j => opts[j]);
        let tries = 0;
        while (true) {
          tries++;
          const k = await ask(speaker, `»${pairs[i][0]}« – wie sagt man das im Alltag?`, shown, -1, { correct: order.indexOf(i) });
          if (order[k] === i) { if (tries === 1) first++; doneRows.push(i); render(); Audio_.se("point", 0.6); points(tries === 1 ? 3 : 1, null, true); break; }
          mistake(); UI.toast("Passt nicht ganz!", "mistake");
        }
      }
    } finally { p.close(); }
    return first;
  },
};
