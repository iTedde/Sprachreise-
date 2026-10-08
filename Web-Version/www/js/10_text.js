// Sprachreise – Textformatierung
// Platzhalter: {name} {nachname} {stadt} {land} {aus_land} {in_land} {staat} {sprache} {pass} {uni} {buch} {heimweh} {mail}
// Markierungen: [[wortkey]] oder [[wortkey|Anzeige]] -> Lernwort (blau) + Übersetzung in Klammern
// Tags: <b> <i> <c3=RRGGBB,xxxxxx> (Farbe, aus der Essentials-Version übernommen), <br>
"use strict";

const ME = "{name}";
const Text = {
  PH: { "{nachname}": "last", "{stadt}": "city", "{land}": "land", "{aus_land}": "aus", "{in_land}": "inn",
        "{staat}": "staat", "{sprache}": "label", "{pass}": "pass_head", "{uni}": "uni", "{buch}": "buch",
        "{heimweh}": "heimweh" },
  // Text ohne HTML (für Vergleiche, Listen)
  plainRaw(t) {
    t = String(t ?? "");
    t = t.replace(/\{name\}/g, SR.playerName());
    for (const k in this.PH) t = t.split(k).join(SR.o(this.PH[k]));
    t = t.replace(/\{mail\}/g, SR.playerName().toLowerCase() + "@mail.com");
    t = t.replace(/\[\[(\w+)(?:\|([^\]]+))?\]\]/g, (m, k, shown) => shown || (SR.WORDS[k] ? SR.WORDS[k].de : k));
    return t;
  },
  plain(t) { return this.plainRaw(t).replace(/<[^>]*>/g, ""); },
  // HTML für Anzeige
  fmt(t) {
    t = String(t ?? "");
    // erlaubte Tags schützen, Rest escapen
    const parts = t.split(/(<\/?(?:b|i|u|br|c3[^>]*)>)/);
    let out = "";
    for (const p of parts) {
      if (/^<\/?(b|i|u|br|c3[^>]*)>$/.test(p)) {
        if (p.startsWith("<c3=")) {
          const col = p.slice(4, 10);
          out += `<span style="color:#${col}">`;
        } else if (p === "</c3>") out += "</span>";
        else out += p;
      } else out += this.inline(U.esc(p));
    }
    return out;
  },
  inline(t) {
    t = t.replace(/\{name\}/g, U.esc(SR.playerName()));
    for (const k in this.PH) t = t.split(k).join(U.esc(SR.o(this.PH[k])));
    t = t.replace(/\{mail\}/g, U.esc(SR.playerName().toLowerCase()) + "@mail.com");
    t = t.replace(/\[\[(\w+)(?:\|([^\]]+))?\]\]/g, (m, k, shown) => {
      const w = SR.WORDS[k];
      const s = shown || (w ? w.de : k);
      if (!w) SR.error("Unbekanntes Wort in [[...]]: " + k);
      if (w && SR.gloss()) return `<span class="gloss">${s}</span> <span class="trans">(<bdi>${U.esc(SR.tr(k))}</bdi>)</span>`;
      return `<span class="gloss">${s}</span>`;
    });
    // Muttersprachliche Einsprengsel (z. B. Arabisch) sauber einbetten
    t = t.replace(/([֐-ࣿ][֐-ࣿ\s،؟!.]*)/g, "<bdi>$1</bdi>");
    return t;
  },
};
