// Sprachreise – Alltags-Minispiele: Bilder wählen, Einkaufen, Kochen, Stadt-Land-Fluss
"use strict";

// Lebensmittel und Dinge (Emoji als Bild – läuft auf allen Geräten)
SR.ITEMS = {
  apfel: { de: "Apfel", en: "apple", art: "der", pl: "Äpfel", pic: "🍎", shelf: "obst" },
  banane: { de: "Banane", en: "banana", art: "die", pl: "Bananen", pic: "🍌", shelf: "obst" },
  zitrone: { de: "Zitrone", en: "lemon", art: "die", pl: "Zitronen", pic: "🍋", shelf: "obst" },
  tomate: { de: "Tomate", en: "tomato", art: "die", pl: "Tomaten", pic: "🍅", shelf: "gemuese" },
  zwiebel: { de: "Zwiebel", en: "onion", art: "die", pl: "Zwiebeln", pic: "🧅", shelf: "gemuese" },
  knoblauch: { de: "Knoblauch", en: "garlic", art: "der", pic: "🧄", shelf: "gemuese" },
  karotte: { de: "Karotte", en: "carrot", art: "die", pl: "Karotten", pic: "🥕", shelf: "gemuese" },
  kartoffel: { de: "Kartoffel", en: "potato", art: "die", pl: "Kartoffeln", pic: "🥔", shelf: "gemuese" },
  gurke: { de: "Gurke", en: "cucumber", art: "die", pl: "Gurken", pic: "🥒", shelf: "gemuese" },
  milch: { de: "Milch", en: "milk", art: "die", pic: "🥛", shelf: "kuehl" },
  kaese: { de: "Käse", en: "cheese", art: "der", pic: "🧀", shelf: "kuehl" },
  butter: { de: "Butter", en: "butter", art: "die", pic: "🧈", shelf: "kuehl" },
  eier: { de: "Eier", en: "eggs", art: "die (Pl.)", pic: "🥚", shelf: "kuehl", sg: "Ei" },
  brot: { de: "Brot", en: "bread", art: "das", pic: "🍞", shelf: "brot" },
  broetchen: { de: "Brötchen", en: "bread roll", art: "das", pic: "🥖", shelf: "brot" },
  reis: { de: "Reis", en: "rice", art: "der", pic: "🍚", shelf: "trocken" },
  nudeln: { de: "Nudeln", en: "pasta, noodles", art: "die (Pl.)", pic: "🍝", shelf: "trocken" },
  salz: { de: "Salz", en: "salt", art: "das", pic: "🧂", shelf: "trocken" },
  kaffee: { de: "Kaffee", en: "coffee", art: "der", pic: "☕", shelf: "trocken" },
  chips: { de: "Chips", en: "crisps, chips", art: "die (Pl.)", pic: "🥔", shelf: "suess", label: "Chips" },
  schokolade: { de: "Schokolade", en: "chocolate", art: "die", pic: "🍫", shelf: "suess" },
  wasser: { de: "Wasser", en: "water", art: "das", pic: "💧", shelf: "getraenke" },
  saft: { de: "Saft", en: "juice", art: "der", pic: "🧃", shelf: "getraenke" },
  // Küche
  topf: { de: "Topf", en: "pot", art: "der", pic: "🍲" },
  pfanne: { de: "Pfanne", en: "pan", art: "die", pic: "🍳" },
  messer: { de: "Messer", en: "knife", art: "das", pic: "🔪" },
  loeffel: { de: "Löffel", en: "spoon", art: "der", pic: "🥄" },
  teller: { de: "Teller", en: "plate", art: "der", pic: "🍽️" },
  oel: { de: "Öl", en: "oil", art: "das", pic: "🫗" },
  pfeffer: { de: "Pfeffer", en: "pepper", art: "der", pic: "⚫" },
};

const Pick = {
  // Bilderwahl. items: [{key, pic, label}] ; correct: key oder Liste ; gibt gewählten key zurück
  async icon(speaker, prompt, items, correct, opts = {}) {
    await UI.flush();
    const shown = await UI.say(speaker, prompt, { noWait: true, keep: true });
    UI.modalCount++;
    const box = UI.add("div", "win", "");
    box.style.cssText = `left:${opts.left ?? 40}px;right:${opts.right ?? 40}px;bottom:${shown.box.offsetHeight + 14}px;padding:8px 6px 12px;z-index:53`;
    if (shown.tag) shown.tag.style.display = "none";
    const wrap = UI.add("div", "icons", "", box);
    const els = items.map(it => {
      const e = UI.add("div", "icon", it.pic + (opts.labels || it.label ? `<span class="lbl">${U.esc(it.label || "")}</span>` : ""), wrap);
      return e;
    });
    let idx = 0;
    const sel = i => { idx = (i + els.length) % els.length; els.forEach((e, j) => e.classList.toggle("sel", j === idx)); };
    sel(0);
    const key = await new Promise(res => {
      if (UI.test()) { const c = Array.isArray(correct) ? correct[0] : correct; return setTimeout(() => res(c ?? items[0].key), 0); }
      const fin = i => { Input.popModal(h); Audio_.se("decision", 0.6); res(items[i].key); };
      const perRow = Math.max(1, Math.floor(wrap.clientWidth / 70));
      const h = k => {
        if (k === "left") sel(idx - 1); else if (k === "right") sel(idx + 1);
        else if (k === "up") sel(idx - perRow); else if (k === "down") sel(idx + perRow);
        else if (k === "ok") fin(idx);
        else if (k === "back" && opts.cancel) { Input.popModal(h); res(null); }
        if (k !== "ok") Audio_.se("cursor", 0.4);
      };
      Input.pushModal(h);
      els.forEach((e, i) => { e.addEventListener("pointerenter", () => sel(i)); e.addEventListener("click", ev => { ev.stopPropagation(); fin(i); }); });
    });
    box.remove(); shown.box.remove(); if (shown.tag) shown.tag.remove();
    UI.modalCount--;
    return key;
  },
  // so lange fragen, bis das Richtige gewählt wurde
  async until(speaker, prompt, items, correct, why) {
    let tries = 0;
    while (true) {
      tries++;
      const k = await this.icon(speaker, prompt, items, correct);
      const ok = Array.isArray(correct) ? correct.includes(k) : k === correct;
      if (ok) { Audio_.se("point", 0.6); points(tries === 1 ? 3 : 1, null, true); return tries; }
      mistake();
      const it = SR.ITEMS[k];
      const art = it ? it.art.replace(" (Pl.)", "") : "";
      const sind = it && it.art.includes("Pl.") ? "Das sind" : "Das ist";
      await say(speaker, typeof why === "function" ? why(k) : (it ? `${sind} ${art} ${it.de}. ${why || "Ich meine etwas anderes."}` : (why || "Nein, das andere.")));
    }
  },
};
function iconsOf(keys) { return keys.map(k => ({ key: k, pic: SR.ITEMS[k].pic, label: "" })); }

// ------------------------------------------------------------------------------
// Einkaufen: Liste oben rechts, Regale als Events im Supermarkt
// ------------------------------------------------------------------------------
const Shop = {
  card: null,
  start(list, title = "Einkaufszettel") {
    S().flags.shop = { list, got: [], title, extra: [] };
    this.show();
  },
  show() {
    const sh = fval("shop"); if (!sh) return;
    if (!this.card) this.card = UI.add("div", "win list-card", "");
    this.card.innerHTML = `<div class="lc-t">📝 ${U.esc(sh.title)}</div>` + sh.list.map(k => {
      const it = SR.ITEMS[k], got = sh.got.includes(k);
      const name = word("it_" + k) || got ? it.de : "? " + it.pic;
      return `<div class="${got ? "got" : ""}">${got ? "☑" : "☐"} ${U.esc(name)}</div>`;
    }).join("");
  },
  hide() { if (this.card) { this.card.remove(); this.card = null; } },
  end() { this.hide(); unset("shop"); },
  missing() { const sh = fval("shop"); return sh ? sh.list.filter(k => !sh.got.includes(k)) : []; },
  // Regal: Spielerin wählt etwas, muss das Wort schreiben
  async shelf(name, keys, buddy = "Jonas") {
    const sh = fval("shop");
    await narr(`<b>${name}</b>`);
    if (!sh) { await think("Heute brauche ich nichts."); return; }
    while (true) {
      const opts = keys.map(k => ({ key: k, pic: SR.ITEMS[k].pic, label: sh.got.includes(k) ? "✓" : "" }));
      const need = keys.filter(k => sh.list.includes(k) && !sh.got.includes(k));
      const k = await Pick.icon(null, "Was nehme ich? (Zurück: weitergehen)", opts, need.length ? need[0] : null, { cancel: true });
      if (UI.test() && !need.length) return;
      if (!k) return;
      const it = SR.ITEMS[k];
      if (sh.got.includes(k)) { await think(`${it.de} habe ich schon.`); continue; }
      // Wort selbst eintippen
      const r = await Typing.task({ prompt: "Wie heißt das auf Deutsch?", pic: it.pic, answers: [it.de].concat(it.sg ? [it.sg] : []),
        mode: "word", label: "Einkauf", pts: 4, hints: [`${it.art} ${it.de[0]}…`, `${it.art} ${it.de.slice(0, Math.ceil(it.de.length / 2))}…`] });
      learn("it_" + k, true);
      if (sh.list.includes(k)) {
        sh.got.push(k); Audio_.se("pickup", 0.7);
        UI.toast(`${it.pic} ${it.de} – in den Korb`, "quest");
      } else {
        sh.extra.push(k);
        await say(buddy, it.de + "? Steht nicht auf der Liste. … Ach, nimm mit. Ich sag's keinem.");
      }
      this.show();
      if (!this.missing().length) { await think("Alles da! Jetzt zur Kasse."); return; }
      if (!need.filter(x => !sh.got.includes(x)).length) return;
    }
  },
};

// ------------------------------------------------------------------------------
// Kochen: Arbeitsfläche mit Zutaten und Werkzeug, Aufgaben im Dialog
// ------------------------------------------------------------------------------
const Cook = {
  async give(speaker, request, keys, correct, why) {
    return Pick.until(speaker, request, iconsOf(keys), correct, why);
  },
};

// ------------------------------------------------------------------------------
// Stadt – Land – Fluss (WG-Spieleabend, Schreibspiel)
// ------------------------------------------------------------------------------
const SLF = {
  LISTS: {
    B: {
      Stadt: ["Berlin", "Bonn", "Bremen", "Bochum", "Bielefeld", "Braunschweig", "Bamberg", "Bayreuth", "Barcelona", "Bogotá", "Buenos Aires", "Brüssel", "Budapest", "Bukarest", "Bern", "Bangkok", "Beirut", "Bagdad", "Basel", "Bilbao", "Bordeaux", "Boston", "Bratislava", "Brasília", "Belgrad", "Birmingham", "Bristol", "Bologna", "Bari", "Bursa", "Busan", "Bombay", "Bremerhaven", "Bad Homburg", "Bergen", "Bratislava", "Benghasi", "Bamako", "Brazzaville", "Bilbao"],
      Land: ["Belgien", "Brasilien", "Bulgarien", "Bolivien", "Bosnien", "Bosnien und Herzegowina", "Bangladesch", "Botswana", "Burkina Faso", "Burundi", "Benin", "Bhutan", "Barbados", "Bahamas", "Bahrain", "Belarus", "Belize", "Brunei"],
      Fluss: ["Bode", "Brahmaputra", "Bug", "Bober", "Blies", "Berkel", "Biggi", "Bregenzer Ach", "Brenta"],
    },
    M: {
      Stadt: ["München", "Mainz", "Mannheim", "Magdeburg", "Münster", "Madrid", "Mailand", "Moskau", "Manila", "Marseille", "Medellín", "Mexiko-Stadt", "Miami", "Montreal", "Melbourne", "Mumbai", "Minsk", "Monaco", "Málaga", "Mekka", "Marrakesch", "Montevideo", "Manchester", "Mönchengladbach", "Marburg", "Mombasa", "Mosul", "Mersin"],
      Land: ["Mexiko", "Marokko", "Malta", "Mali", "Malaysia", "Mongolei", "Mosambik", "Madagaskar", "Monaco", "Montenegro", "Moldau", "Moldawien", "Myanmar", "Mauritius", "Mauretanien", "Malawi", "Malediven", "Mikronesien"],
      Fluss: ["Main", "Mosel", "Mississippi", "Mekong", "Maas", "Moldau", "Mur", "Murg", "Mulde", "Main-Donau-Kanal", "Magdalena", "Missouri"],
    },
  },
  // others: Antworten der Mitspieler {Stadt: "Bonn", ...}
  async round(letter, others) {
    const res = {};
    const cats = ["Stadt", "Land", "Fluss"];
    let total = 0;
    const lines = [];
    for (const c of cats) {
      const list = this.LISTS[letter][c];
      const r = await Typing.task({
        prompt: `<b>${c}</b> mit <b>${letter}</b>` + (c === "Fluss" ? "\n<span class=sub>(Schwer? Schreib »passe«.)</span>" : ""),
        answers: list.concat(["passe"]), mode: "word", label: "Stadt – Land – Fluss", pts: 4,
        hints: [`Zum Beispiel: ${list[0][0]}${list[0].slice(1, 3)}…`, `Zum Beispiel: ${list[0]}`],
        wrongMsg: "Kenne ich nicht … Gibt es das wirklich? (Tipp oder »passe«)",
        validate: v => { if (v[0] && v[0].toUpperCase() !== letter && U.norm(v) !== "passe") return { ok: false, msg: `Das fängt nicht mit ${letter} an!` }; return null; },
      });
      const v = r.text;
      res[c] = U.norm(v) === "passe" ? null : v;
    }
    for (const c of cats) {
      const mine = res[c], same = Object.values(others).some(o => o[c] && mine && U.norm(o[c]) === U.norm(mine));
      const p = !mine ? 0 : same ? 5 : 10;
      total += p;
      lines.push(`${c}: ${mine ? "<b>" + U.esc(mine) + "</b>" : "–"}  ${p ? "+" + p : ""}${same ? " (gleich wie jemand)" : ""}`);
    }
    return { res, total, lines };
  },
};
