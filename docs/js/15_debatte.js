// Sprachreise – Argumentation als Dialogkampf (Mission »Nicht mit mir«)
// Phasen: Behauptung → Nachfragen → Begründung prüfen → Gegenargument → Abschluss
// Zwei Anzeigen: »Deine Ruhe« (sachlich bleiben) und »Offenheit« des Gegenübers.
// Es gibt kein »Besiegen«: Am Ende steht ein realistischer Ausgang.
"use strict";

const Debate = {
  el: null, calm: 100, open: 10, phaseI: 0, opp: "", log: [],
  PHASES: ["Behauptung", "Nachfragen", "Begründung prüfen", "Gegenargument", "Abschluss"],
  STRATS: {
    nachfragen: ["Nachfragen", "#3c8cc8"], fakten: ["Fakten einfordern", "#2c9c78"],
    verallg: ["Verallgemeinerung hinterfragen", "#8a5cc8"], perspektive: ["Perspektive wechseln", "#c8783c"],
    widerspruch: ["Sachlich widersprechen", "#3c6cc8"], angriff: ["Persönlicher Angriff", "#c03030"],
    schweigen: ["Schweigen", "#808090"], ende: ["Gespräch beenden", "#606878"],
  },

  open_(opp, oppLabel) {
    this.calm = 100; this.open = 10; this.phaseI = 0; this.opp = opp; this.log = [];
    this.el = UI.add("div", "debate", "");
    this.el.innerHTML = `<div class="hud">
      <div class="meter"><div>Deine Ruhe</div><div class="mbar"><div class="m-calm" style="background:#40a860;width:100%"></div></div></div>
      <div class="meter"><div>Offenheit: ${U.esc(oppLabel || opp)}</div><div class="mbar"><div class="m-open" style="background:#e0a030;width:10%"></div></div></div>
    </div><div class="phase">${this.PHASES.map(p => `<div>${p}</div>`).join("")}</div>`;
    this.phase(0);
  },
  close() { if (this.el) this.el.remove(); this.el = null; },
  phase(i) {
    this.phaseI = i;
    if (!this.el) return;
    this.el.querySelectorAll(".phase div").forEach((d, j) => { d.className = j < i ? "done" : j === i ? "on" : ""; });
  },
  update() {
    if (!this.el) return;
    this.calm = U.clamp(this.calm, 0, 100); this.open = U.clamp(this.open, 0, 100);
    const c = this.el.querySelector(".m-calm"), o = this.el.querySelector(".m-open");
    c.style.width = this.calm + "%"; c.style.background = this.calm > 60 ? "#40a860" : this.calm > 30 ? "#e0a030" : "#d04030";
    o.style.width = this.open + "%";
  },
  async claim(text) {
    Audio_.se("tab_start", 0.6);
    await say(this.opp, `<c3=C03030,F0C0C0>»</c3>${text}<c3=C03030,F0C0C0>«</c3>`);
  },
  // options: [{t, s (Strategie), calm, open, reply, after (async fn)}]
  async choose(prompt, options) {
    const best = options.reduce((bi, op, i) => ((op.open || 0) - Math.max(0, -(op.calm || 0)) > (options[bi].open || 0) - Math.max(0, -(options[bi].calm || 0)) ? i : bi), 0);
    const labels = options.map(op => op.t);
    const i = await ask(ME, prompt || "(Wie reagiere ich?)", labels, -1, { correct: best });
    const op = options[i];
    this.log.push(op.s);
    const st = this.STRATS[op.s];
    if (st) UI.toast("Strategie: " + st[0], op.s === "angriff" ? "mistake" : "quest");
    this.calm += op.calm || 0; this.open += op.open || 0; this.update();
    if (op.s === "angriff") mistake();
    if (op.reply) await say(op.who || this.opp, op.reply);
    if (op.after) await op.after();
    return op;
  },
  async identify(name, expl) {
    Audio_.se("found", 0.6);
    UI.modalCount++;
    const b = UI.add("div", "win argid", `<div class="head">ARGUMENT IDENTIFIZIERT</div><div class="big">${U.esc(name)}</div><div class="small">${Text.fmt(expl)}</div>`);
    if (UI.test()) SR_TEST.onBanner("ARGUMENT", name);
    await U.sleep(UI.test() ? 0 : 400);
    await Input.waitKey(["ok", "back"]);
    b.remove();
    UI.modalCount--;
    const args = fval("args") || [];
    if (!args.some(a => a[0] === name)) { args.push([name, Text.plain(expl)]); set("args", args); }
    points(6, null, true);
  },
  // Schreibaufgabe im Streitgespräch – Erwartung wächst mit dem Sprachniveau
  async write(prompt, byLevel) {
    const li = SR.levelIndex();
    const t = byLevel[Math.min(byLevel.length - 1, li)];
    const r = await Typing.task(Object.assign({ prompt, label: "Antwort", place: "bottom", pts: 8 }, t));
    this.open += r.tries === 1 ? 12 : 6; this.update();
    return r;
  },
  outcome() { return this.open >= 60 ? "A" : this.open >= 35 ? "B" : "B"; },
};
