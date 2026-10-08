// Sprachreise – Pausemenü, Sprachmappe (Fortschritt, Aufgaben, Wörter, Dokumente, Tagebuch, Kontakte), Optionen
"use strict";

// Generische Liste mit Tastatur + Touch
function listNav(container, items, onSel, onOk, opts = {}) {
  let idx = opts.start || 0;
  const els = items.map((it, i) => {
    const e = UI.add("div", opts.cls || "li", it, container);
    e.addEventListener("click", ev => { ev.stopPropagation(); set_(i); onOk && onOk(i); });
    return e;
  });
  const set_ = i => {
    if (!els.length) return;
    idx = (i + els.length) % els.length;
    els.forEach((e, j) => e.classList.toggle("sel", j === idx));
    els[idx].scrollIntoView({ block: "nearest" });
    onSel && onSel(idx);
  };
  set_(idx);
  return { get i() { return idx; }, set: set_, els };
}

const Menu = {
  async open() {
    if (World.busy || UI.blocking()) return;
    World.busy++;
    Audio_.se("menu_open", 0.6);
    try {
      while (true) {
        const r = await this.main();
        if (r === null) break;
        if (r === "mappe") await Mappe.open();
        else if (r === "karte") await Karte.show("view");
        else if (r === "gloss") {
          S().gloss = !SR.gloss();
          UI.toast(SR.gloss() ? "Übersetzungen werden angezeigt." : "Übersetzungen sind aus. Mutig!", "quest");
        } else if (r === "save") {
          const ok = SR.save("main");
          Audio_.me("saved");
          await UI.banner("SPEICHERN", ok ? "Gespeichert!" : "Speichern fehlgeschlagen", ok ? `${SR.playerName()} · Deutsch ${SR.levelName()} · Episode ${ep()}` : "Der Browser erlaubt keinen Speicher.", "#3060c8");
        } else if (r === "optionen") await Options.open();
        else if (r === "titel") {
          if (await UI.confirm(null, "Zurück zum Titelbildschirm? (Nicht gespeicherter Fortschritt geht verloren.)")) {
            World.busy--; location.reload(); return;
          }
        }
      }
    } finally {
      Audio_.se("menu_close", 0.6);
      World.busy--;
    }
  },
  main() {
    return new Promise(res => {
      const w = UI.add("div", "win menu", "");
      const entries = [["mappe", "Sprachmappe"], ["karte", "Deutschlandkarte"], ["gloss", SR.gloss() ? "Übersetzung: an" : "Übersetzung: aus"],
        ["save", "Speichern"], ["optionen", "Optionen"], ["titel", "Titelbildschirm"], [null, "Schließen"]];
      const nav = listNav(w, entries.map(e => U.esc(e[1])), null, i => fin(entries[i][0]), { cls: "mi" });
      UI.add("div", "info", `${U.esc(SR.playerName())} · Deutsch ${SR.levelName()}<br>${S().points} SP · Episode ${ep()}/10`, w);
      const fin = v => { Input.popModal(h); w.remove(); res(v); };
      const h = k => {
        if (k === "up") { nav.set(nav.i - 1); Audio_.se("cursor", 0.4); }
        else if (k === "down") { nav.set(nav.i + 1); Audio_.se("cursor", 0.4); }
        else if (k === "ok") { Audio_.se("decision", 0.5); fin(entries[nav.i][0]); }
        else if (k === "back" || k === "menu") fin(null);
      };
      Input.pushModal(h);
    });
  },
};

const Options = {
  load() {
    try {
      const o = JSON.parse(localStorage.getItem("sprachreise.options") || "{}");
      if (o.textSpeed !== undefined) UI.textSpeed = o.textSpeed;
      if (o.bgm !== undefined) Audio_.volBgm = o.bgm;
      if (o.se !== undefined) Audio_.volSe = o.se;
      Audio_.applyVolume();
    } catch (e) { }
  },
  save() {
    try { localStorage.setItem("sprachreise.options", JSON.stringify({ textSpeed: UI.textSpeed, bgm: Audio_.volBgm, se: Audio_.volSe })); } catch (e) { }
  },
  open() {
    return new Promise(res => {
      const w = UI.add("div", "win menu", ""); w.style.width = "290px";
      const speeds = ["Langsam", "Normal", "Schnell", "Sofort"];
      const rows = () => [
        `Text: ◀ ${speeds[UI.textSpeed]} ▶`,
        `Musik: ◀ ${"■".repeat(Math.round(Audio_.volBgm * 10))}${"□".repeat(10 - Math.round(Audio_.volBgm * 10))} ▶`,
        `Effekte: ◀ ${"■".repeat(Math.round(Audio_.volSe * 10))}${"□".repeat(10 - Math.round(Audio_.volSe * 10))} ▶`,
        "Vollbild an/aus", "Fertig"];
      let nav;
      const draw = (i) => { w.innerHTML = ""; nav = listNav(w, rows(), null, j => act(j, "ok"), { cls: "mi", start: i }); };
      const act = (i, k) => {
        const d = k === "left" ? -1 : 1;
        if (i === 0 && k !== "ok") UI.textSpeed = U.clamp(UI.textSpeed + d, 0, 3);
        else if (i === 0) UI.textSpeed = (UI.textSpeed + 1) % 4;
        else if (i === 1) Audio_.volBgm = U.clamp(Math.round(Audio_.volBgm * 10 + (k === "ok" ? 1 : d)) / 10, 0, 1) || (k === "ok" && Audio_.volBgm >= 1 ? 0 : Audio_.volBgm);
        else if (i === 2) { Audio_.volSe = U.clamp(Math.round(Audio_.volSe * 10 + (k === "ok" ? 1 : d)) / 10, 0, 1); Audio_.se("decision"); }
        else if (i === 3 && k === "ok") {
          const el = document.documentElement;
          if (!document.fullscreenElement) (el.requestFullscreen || el.webkitRequestFullscreen || (() => { })).call(el);
          else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        } else if (i === 4 && k === "ok") return fin();
        Audio_.applyVolume(); this.save(); draw(i);
      };
      const fin = () => { Input.popModal(h); w.remove(); res(); };
      const h = k => {
        if (k === "up") nav.set(nav.i - 1); else if (k === "down") nav.set(nav.i + 1);
        else if (k === "left" || k === "right" || k === "ok") act(nav.i, k);
        else if (k === "back" || k === "menu") fin();
      };
      draw(0);
      Input.pushModal(h);
    });
  },
};

const Mappe = {
  TABS: [["progress", "Fortschritt"], ["quests", "Aufgaben"], ["words", "Wörter"], ["docs", "Dokumente"], ["diary", "Tagebuch"], ["people", "Kontakte"]],
  open(start = "progress") {
    return new Promise(res => {
      UI.clearToasts();
      const pn = UI.add("div", "panel grid-bg", "");
      const top = UI.add("div", "top", "", pn);
      const list = UI.add("div", "list", "", pn);
      const det = UI.add("div", "detail", "", pn);
      let tab = this.TABS.findIndex(t => t[0] === start), nav = null, entries = [];
      const drawTabs = () => {
        top.innerHTML = "";
        this.TABS.forEach((t, i) => {
          const e = UI.add("div", "tab" + (i === tab ? " sel" : ""), t[1], top);
          e.addEventListener("click", () => { tab = i; load(); });
        });
        const x = UI.add("div", "tab", "✕", top); x.style.marginLeft = "auto";
        x.addEventListener("click", () => fin());
      };
      const load = () => {
        drawTabs();
        const cur = this.TABS[tab][0];
        list.innerHTML = ""; det.innerHTML = "";
        entries = this.entries(cur);
        if (cur === "progress") { list.classList.add("hidden"); det.classList.add("full"); det.innerHTML = this.progress(); nav = null; return; }
        list.classList.remove("hidden"); det.classList.remove("full");
        if (!entries.length) { det.innerHTML = Text.fmt(this.empty(cur)); nav = null; return; }
        nav = listNav(list, entries.map(e => e[1]), i => { det.innerHTML = this.detail(cur, entries[i][0]); det.scrollTop = 0; });
      };
      const fin = () => { Input.popModal(h); pn.remove(); res(); };
      const h = k => {
        if (k === "left") { tab = (tab + this.TABS.length - 1) % this.TABS.length; Audio_.se("cursor", 0.4); load(); }
        else if (k === "right") { tab = (tab + 1) % this.TABS.length; Audio_.se("cursor", 0.4); load(); }
        else if (k === "up" && nav) nav.set(nav.i - 1);
        else if (k === "down" && nav) nav.set(nav.i + 1);
        else if (k === "pgdn") det.scrollTop += 120;
        else if (k === "pgup") det.scrollTop -= 120;
        else if (k === "back" || k === "menu") fin();
      };
      load();
      Input.pushModal(h);
    });
  },
  entries(cur) {
    const st = S();
    if (cur === "quests") {
      const ks = Object.keys(st.quests).filter(q => SR.QUESTS[q]);
      const sortK = q => [SR.QUESTS[q].side ? 1 : 0, -SR.QUESTS[q].ep];
      const act = ks.filter(active).sort((a, b) => sortK(a)[0] - sortK(b)[0] || sortK(a)[1] - sortK(b)[1]);
      const dn = ks.filter(done).sort((a, b) => SR.QUESTS[b].ep - SR.QUESTS[a].ep);
      return act.map(q => [q, (SR.QUESTS[q].side ? "· " : "» ") + U.esc(SR.QUESTS[q].title)])
        .concat(dn.map(q => [q, "<span class=ok>■</span> " + U.esc(SR.QUESTS[q].title)]));
    }
    if (cur === "words") return Object.keys(st.words).filter(k => SR.WORDS[k] && !k.startsWith("it_") || (k.startsWith("it_") && SR.WORDS[k]))
      .sort((a, b) => SR.WORDS[a].de.localeCompare(SR.WORDS[b].de, "de")).map(k => [k, U.esc(SR.WORDS[k].de)]);
    if (cur === "docs") return st.docs.filter(k => SR.DOCUMENTS[k]).map(k => [k, U.esc(SR.DOCUMENTS[k].name)]);
    if (cur === "diary") return st.diary.slice().reverse().map(e => [e, `Ep. ${e[1]}: ` + U.esc(Text.plain(e[2]).slice(0, 18)) + "…"]);
    if (cur === "people") return Object.keys(st.friends).filter(k => SR.PEOPLE[k]).sort((a, b) => st.friends[b] - st.friends[a])
      .map(k => [k, U.esc(SR.PEOPLE[k].name)]);
    return [];
  },
  empty(cur) {
    return { quests: "Noch keine Aufgaben.", words: "Noch keine Wörter gelernt. Sprich mit Leuten!",
      docs: "Noch keine Dokumente.\nDeine Unterlagen landen hier.", diary: "Das Tagebuch ist noch leer.",
      people: "Noch keine Kontakte." }[cur] || "";
  },
  detail(cur, key) {
    if (cur === "quests") {
      const q = SR.QUESTS[key], st = S().quests[key];
      let t = `<b>${U.esc(q.title)}</b>\n<span class=sub>${q.side ? "Nebenaufgabe" : "Hauptaufgabe"} · Episode ${q.ep}</span>\n${Text.fmt(q.desc)}\n`;
      for (const s of q.steps) {
        const ok = st.steps[s[0]] || st.status === "done";
        t += (ok ? "<span class=ok>☑ " : "☐ ") + Text.fmt(s[1]) + (ok ? "</span>" : "") + "\n";
      }
      return t;
    }
    if (cur === "words") {
      const w = SR.WORDS[key], info = S().words[key];
      let t = `<b>${U.esc((w.art ? w.art + " " : "") + w.de)}</b>\n<span class=gloss>= <bdi>${U.esc(SR.tr(key))}</bdi></span>\n`;
      if (SR.origin() !== "en") t += `<span class=sub>Englisch: ${U.esc(w.en)}</span>\n`;
      if (w.pl) t += `<span style="color:#806040">${U.esc(w.pl)}</span>\n`;
      if (w.ex) t += "\n„" + Text.fmt(w.ex) + "“\n";
      if (w.note) t += "\n<span class=sub>" + Text.fmt(w.note) + "</span>\n";
      t += `\n<span class=sub>${U.esc(w.cat || "")} · Ep. ${info.ep}</span>`;
      return t;
    }
    if (cur === "docs") { const d = SR.DOCUMENTS[key]; return `<b>${U.esc(d.name)}</b>\n` + Text.fmt(d.text); }
    if (cur === "diary") return `<span style="color:#806040">Tagebuch · Episode ${key[1]}</span>\n` + Text.fmt(key[2]);
    if (cur === "people") {
      const p = SR.PEOPLE[key], lv = S().friends[key] || 0;
      const stage = p.bio.filter(b => lv >= b[0]).pop() || p.bio[0];
      return `<b>${U.esc(p.name)}</b>  <span class=hearts>${"♥".repeat(lv)}${"♡".repeat(5 - lv)}</span>\n<span class=sub>${Text.fmt(p.role)}</span>\n\n${Text.fmt(stage[1])}`
        + (p.says ? `\n\n<span class=sub>Typischer Satz:</span>\n„${Text.fmt(p.says)}“` : "");
    }
    return "";
  },
  progress() {
    const st = S(), li = SR.levelIndex(), lv = SR.LEVELS[li], nx = SR.nextLevel();
    let t = `<b>${U.esc(SR.playerName())} {nachname}</b> · {stadt} · Ziel: Deutsch B1\n`;
    t = Text.fmt(t);
    t += `<div class="bar">${SR.LEVELS.map((l, i) => `<div class="${i <= li ? "on" : ""}">${l[1]}</div>`).join("")}</div>`;
    if (nx) t += `<div class="prog"><div style="width:${Math.round(100 * (st.points - lv[0]) / (nx - lv[0]))}%"></div></div>Sprachpunkte: <b>${st.points}</b> / ${nx} bis ${SR.LEVELS[li + 1][1]}\n`;
    else t += `Sprachpunkte: <b>${st.points}</b> – Ziel erreicht!\n`;
    const dq = Object.values(st.quests).filter(q => q.status === "done").length;
    t += `Wörter: <b>${Object.keys(st.words).length}</b>   Dokumente: <b>${st.docs.length}</b>   Erledigt: <b>${dq}</b>   Geschrieben: <b>${st.typedOk}</b>\n`;
    t += `<div style="columns:2;font-size:16px;line-height:20px;margin-top:4px">` + SR.EPISODES.map(e => {
      const dn = st.episodesDone.includes(e[0]), cur = st.episode === e[0];
      const name = dn || cur ? e[1] : "???  (" + e[2].split(" ")[0] + ")";
      return `<div style="color:${dn ? "#30804a" : cur ? "#3050b0" : "#828288"}">${dn ? "☑" : cur ? "▶" : "☐"} ${e[0]}. ${U.esc(name)}</div>`;
    }).join("") + "</div>";
    const sk = st.skills.map(k => SR.SKILLS[k][0]);
    t += `<div style="font-size:16px;margin-top:4px">Fähigkeiten: ${sk.length ? U.esc(sk.join(", ")) : "noch keine"}</div>`;
    const args = fval("args");
    if (args && args.length) t += `<div style="font-size:16px">Erkannte Argumentmuster: ${U.esc(args.map(a => a[0]).join(", "))}</div>`;
    return t;
  },
};
