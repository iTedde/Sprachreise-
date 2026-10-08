// Sprachreise – Hilfsfunktionen
"use strict";
window.SR = window.SR || {};
const SR_DATA = window.SR_DATA || {};

const U = {
  sleep(ms) { return new Promise(r => setTimeout(r, U.fastMode ? Math.min(ms, 5) : ms)); },
  fastMode: false,
  clamp(v, a, b) { return v < a ? a : v > b ? b : v; },
  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },
  esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); },
  rand(n) { return Math.floor(Math.random() * n); },
  pick(a) { return a[Math.floor(Math.random() * a.length)]; },
  // Levenshtein-Abstand (für Tippfehler)
  lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) {
        const c = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        // Vertauschung zweier Buchstaben zählt als ein Fehler
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev[j - 1]);
      }
      [prev, cur] = [cur, prev];
    }
    return prev[n];
  },
  // Normalisierung für Antwortvergleiche
  norm(s) {
    return String(s).toLowerCase()
      .replace(/[„“”"»«‚‘’'`´]/g, "")
      .replace(/[.,!?;:()\-–—…]/g, " ")
      .replace(/\s+/g, " ").trim();
  },
  // Umlaute in Ersatzschreibweise (ae, oe, ue, ss)
  deumlaut(s) {
    return s.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue");
  },
  // Akzente entfernen (z. B. Ríos -> Rios), deutsche Umlaute bleiben
  deaccent(s) {
    return s.normalize("NFD").replace(/([aou])̈/g, "$1\u0001").replace(/[̀-ͯ]/g, "")
      .replace(/a\u0001/g, "ä").replace(/o\u0001/g, "ö").replace(/u\u0001/g, "ü").normalize("NFC");
  },
  now() { return performance.now() / 1000; },
  log(...a) { if (window.SR_TEST) SR_TEST.log(a.join(" ")); else console.log(...a); },
};

// kleine Ereignis-Warteschlange für "warte auf Bestätigung"
class Signal {
  constructor() { this.waiters = []; }
  wait() { return new Promise(r => this.waiters.push(r)); }
  fire(v) { const w = this.waiters; this.waiters = []; w.forEach(r => r(v)); }
}
