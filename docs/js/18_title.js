// Sprachreise – Titelbildschirm, Neues Spiel, Laden
"use strict";

// Freie Texteingabe (z. B. Name)
Typing.free = function (prompt, value = "", max = 14) {
  return new Promise(res => {
    UI.modalCount++;
    const box = UI.add("div", "win typebox", "");
    UI.add("div", "tq", Text.fmt(prompt), box);
    const inp = U.el("input"); inp.type = "text"; inp.value = value; inp.maxLength = max;
    inp.setAttribute("autocapitalize", "words"); inp.autocomplete = "off"; inp.spellcheck = false;
    box.appendChild(inp);
    const row = UI.add("div", "row", "", box);
    const ok = UI.add("button", "btn", "OK ↵", row); ok.style.marginLeft = "auto";
    const fin = () => { const v = inp.value.trim() || value; Input.popModal(h); box.remove(); UI.modalCount--; res(v); };
    ok.addEventListener("click", fin);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); fin(); } });
    const h = k => { if (k === "ok") inp.focus(); };
    Input.pushModal(h);
    setTimeout(() => { inp.focus(); inp.select(); }, 60);
    if (UI.test()) setTimeout(fin, 0);
  });
};

const Title = {
  async run() {
    Audio_.bgm("New Start");
    const t = UI.add("div", "title", "");
    t.style.backgroundImage = "url(img/ui/title.png)";
    UI.add("div", "ver", "Sprachreise · Web-Version 1.0", t);
    const press = UI.add("div", "press", "Taste drücken / Tippen", t);
    if (!UI.test()) {
      await new Promise(r => {
        const fin = () => { Input.popModal(h); t.removeEventListener("pointerup", fin); r(); };
        const h = () => fin();
        Input.pushModal(h); t.addEventListener("pointerup", fin);
      });
    }
    Audio_.unlock();
    press.remove();
    while (true) {
      const save = SR.latestSave();
      const opts = [];
      if (save) opts.push(["cont", `Weiterspielen <span class=sub>(${U.esc(save.name || "?")}, Ep. ${save.episode}, ${SR.levelName(save.points)})</span>`]);
      opts.push(["new", "Neues Spiel"], ["opt", "Optionen"]);
      const r = await new Promise(res => {
        const w = UI.add("div", "win tmenu", "", t);
        const nav = listNav(w, opts.map(o => o[1]), null, i => fin(opts[i][0]), { cls: "choice" });
        const fin = v => { Input.popModal(h); w.remove(); res(v); };
        const h = k => {
          if (k === "up") nav.set(nav.i - 1); else if (k === "down") nav.set(nav.i + 1);
          else if (k === "ok") fin(opts[nav.i][0]);
        };
        Input.pushModal(h);
        if (UI.test()) setTimeout(() => fin(SR_TEST.titleChoice(opts.map(o => o[0]))), 0);
      });
      if (r === "opt") { await Options.open(); continue; }
      if (r === "cont") {
        SR.applyState(save);
        t.remove();
        await this.continueGame();
        return;
      }
      if (r === "new") {
        if (save && !UI.test() && !(await UI.confirm(null, "Ein neues Spiel beginnen? Der alte Spielstand bleibt erhalten, bis du speicherst."))) continue;
        SR.applyState(SR.newState());
        t.style.backgroundImage = "none"; t.style.background = "#181c28";
        const ok = await this.newGame();
        if (!ok) { t.style.background = ""; t.style.backgroundImage = "url(img/ui/title.png)"; continue; }
        t.remove();
        await UI.fadeOut(0.01);
        await World.transfer("hbf", 7, 19, 8, { noFade: true, noName: true });
        await UI.fadeIn(0.6);
        return;
      }
    }
  },
  async newGame() {
    await narr("Willkommen bei SPRACHREISE!\nDu lernst Deutsch – Schritt für Schritt.");
    const order = SR_DATA.lang.order;
    while (true) {
      const i = await ask(null, "Welche Sprache sprichst du zu Hause?\n<span class=sub>(Die Übersetzungen im Spiel erscheinen in dieser Sprache.)</span>",
        order.map(l => `<bdi>${U.esc(SR_DATA.lang.origins[l].native)}</bdi>   –   ${SR_DATA.lang.origins[l].label}`));
      S().origin = order[i];
      if (await ask(null, `Du spielst <b>${U.esc(SR.o("first"))} ${U.esc(SR.o("last"))}</b> ${U.esc(SR.o("aus"))}.\nSie ist Krankenpflegerin aus ${U.esc(SR.o("city"))}. Einverstanden?`,
        ["Ja, los geht's!", "Andere Sprache wählen"]) === 0) break;
    }
    const name = await Typing.free("Wie heißt du? <span class=sub>(Vorname der Hauptfigur – du kannst ihn ändern)</span>", SR.o("first"), 12);
    S().name = name.replace(/[<>{}\[\]]/g, "").trim() || SR.o("first");
    return true;
  },
  async continueGame() {
    const st = S();
    const p = st.pos || { map: "hbf", x: 16, y: 17, dir: 2 };
    if (!SR_DATA.maps[p.map]) p.map = "hbf";
    await UI.fadeOut(0.01);
    await World.transfer(p.map, p.x, p.y, p.dir, { noFade: true });
    await UI.fadeIn(0.5);
    UI.toast("Willkommen zurück, " + SR.playerName() + "!", "quest");
  },
};
