// Sprachreise – Deutschlandkarte & Reisen (Zuganimation)
"use strict";

SR.CITIES = {
  berlin: { name: "Berlin", pos: [227, 132], map: ["hbf", 16, 17, 2], info: "Hauptstadt. Hier beginnt die Reise: Ankommen, WG, Bürgeramt, der Kiez.", ep: [1, 2, 3] },
  koeln: { name: "Köln", pos: [57, 199], map: ["koeln_hbf", 12, 17, 8], info: "Dom, Rhein, Kölsch. Wohnung, Klinik, Kollegen – und das Veedel.", ep: [4, 5, 6, 8, 9] },
  frankfurt: { name: "Frankfurt", pos: [102, 234], map: ["frankfurt_hbf", 14, 14, 8], info: "Umsteigen am größten Bahnknoten Deutschlands.", ep: [7] },
  muenchen: { name: "München", pos: [179, 318], map: ["muenchen", 20, 28, 8], info: "Eine Freundin, ein Biergarten – und »Servus!«.", ep: [7] },
  dresden: { name: "Dresden", pos: [236, 194], map: ["dresden", 2, 15, 6], info: "Elbe, Frauenkirche und eine ruhigere Atmosphäre.", ep: [7] },
  hamburg: { name: "Hamburg", pos: [137, 88], map: ["hamburg_hbf", 16, 17, 8], info: "Hafen, Speicherstadt, »Moin« – und das große Finale.", ep: [10] },
};
SR.ROUTE = ["berlin", "koeln", "frankfurt", "muenchen", "dresden", "hamburg"];
SR.TRAINS = {
  "berlin-koeln": ["ICE 949", "ca. 4 Std. 20 Min.", "über Hannover, Bielefeld, Dortmund"],
  "koeln-berlin": ["ICE 940", "ca. 4 Std. 20 Min.", "über Dortmund, Bielefeld, Hannover"],
  "koeln-frankfurt": ["ICE 15", "ca. 1 Std. 5 Min.", "Schnellfahrstrecke über Montabaur"],
  "frankfurt-muenchen": ["ICE 627", "ca. 3 Std. 15 Min.", "über Würzburg, Nürnberg"],
  "muenchen-dresden": ["IC 2063 + RE", "ca. 5 Std. 40 Min.", "über Nürnberg und Leipzig"],
  "dresden-berlin": ["EC 175", "ca. 1 Std. 50 Min.", "an der Elbe entlang nach Norden"],
  "berlin-hamburg": ["ICE 1708", "ca. 1 Std. 50 Min.", "durch Brandenburg"],
  "koeln-hamburg": ["ICE 1032", "ca. 4 Std.", "über Münster und Bremen"],
};

const Karte = {
  // mode: "view" (ansehen) oder "travel" (Ziel wählen); allowed: erlaubte Ziele
  show(mode = "view", allowed = null) {
    return new Promise(res => {
      UI.clearToasts();
      const pn = UI.add("div", "panel karte", "");
      const img = U.el("img"); img.src = "img/ui/deutschland.png"; pn.appendChild(img);
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg"); svg.setAttribute("width", 512); svg.setAttribute("height", 384);
      pn.appendChild(svg);
      const side = UI.add("div", "side", "", pn);
      const st = S();
      const unlocked = k => st.cities.includes(k);
      // Route
      for (let i = 0; i < SR.ROUTE.length - 1; i++) {
        const a = SR.CITIES[SR.ROUTE[i]].pos, b = SR.CITIES[SR.ROUTE[i + 1]].pos;
        const l = document.createElementNS(svgNS, "line");
        l.setAttribute("x1", a[0]); l.setAttribute("y1", a[1]); l.setAttribute("x2", b[0]); l.setAttribute("y2", b[1]);
        const known = unlocked(SR.ROUTE[i]) && unlocked(SR.ROUTE[i + 1]);
        l.setAttribute("stroke", known ? "#c82020" : "rgba(80,90,80,.6)"); l.setAttribute("stroke-width", 2); l.setAttribute("stroke-dasharray", "2 3");
        svg.appendChild(l);
      }
      const list = SR.ROUTE.slice();
      const marks = {};
      for (const k of list) {
        const c = SR.CITIES[k], [x, y] = c.pos, un = unlocked(k);
        const g = document.createElementNS(svgNS, "g");
        g.innerHTML = `<rect x="${x - 5}" y="${y - 5}" width="11" height="11" fill="#1e1e1e"/><rect x="${x - 4}" y="${y - 4}" width="9" height="9" fill="${un ? "#fff" : "#b4b4b0"}"/><rect x="${x - 2}" y="${y - 2}" width="5" height="5" fill="${un ? "#dc1e1e" : "#6e6e6e"}"/>` +
          (k === st.currentCity ? `<rect x="${x - 7}" y="${y - 7}" width="15" height="15" fill="none" stroke="#ffce00" stroke-width="2"/>` : "") +
          `<text x="${x + 8}" y="${y + 4}" font-size="13" fill="#181820" stroke="#f0f0e8" stroke-width="3" paint-order="stroke" font-family="PowerGreen, sans-serif">${un ? c.name : "?"}</text>`;
        svg.appendChild(g);
        const hit = U.el("div", "city"); hit.style.left = x + "px"; hit.style.top = y + "px"; pn.appendChild(hit);
        hit.addEventListener("click", () => { sel(list.indexOf(k)); if (mode === "travel") choose(); });
        marks[k] = g;
      }
      const ring = document.createElementNS(svgNS, "circle");
      ring.setAttribute("r", 10); ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#fff"); ring.setAttribute("stroke-width", 2);
      svg.appendChild(ring);
      let idx = Math.max(0, list.indexOf(st.currentCity));
      const sel = i => {
        idx = (i + list.length) % list.length;
        const k = list[idx], c = SR.CITIES[k], un = unlocked(k);
        ring.setAttribute("cx", c.pos[0]); ring.setAttribute("cy", c.pos[1]);
        const can = mode === "travel" && un && k !== st.currentCity && (!allowed || allowed.includes(k));
        side.innerHTML = `<div class="h">DEUTSCHLAND</div><div class="y">${mode === "travel" ? "Wohin möchtest du fahren?" : "Deine Reiseroute"}</div>\n` +
          `<div class="h">${un ? c.name : "???"}</div><span style="color:#b8bcd0">Ep. ${c.ep.join(", ")}</span>\n${un ? c.info : "Noch nicht freigeschaltet."}\n\n` +
          (k === st.currentCity ? `<span class="y">Du bist hier.</span>` : can ? `<span class="y">▶ Enter/Tippen: hinfahren</span>` : "") +
          `\n\n<span style="color:#a0e0a0">Deutsch ${SR.levelName()} · ${st.points} SP</span>\n<span style="color:#8890a8">${mode === "travel" ? "Enter: fahren  ·  Esc: zurück" : "Esc: zurück"}</span>`;
      };
      const choose = () => {
        const k = list[idx];
        if (!unlocked(k) || k === st.currentCity || (allowed && !allowed.includes(k))) { Audio_.se("buzzer", 0.5); return; }
        Audio_.se("decision", 0.6); fin(k);
      };
      const fin = v => { Input.popModal(h); pn.remove(); res(v); };
      const h = k => {
        if (k === "down" || k === "right") { sel(idx + 1); Audio_.se("cursor", 0.4); }
        else if (k === "up" || k === "left") { sel(idx - 1); Audio_.se("cursor", 0.4); }
        else if (k === "back" || k === "menu") fin(null);
        else if (k === "ok" && mode === "travel") choose();
      };
      sel(idx);
      Input.pushModal(h);
      if (UI.test() && mode === "travel") setTimeout(() => fin(allowed ? allowed[0] : null), 0);
    });
  },

  // Zuganimation von A nach B
  async animate(from, to) {
    const pn = UI.add("div", "panel karte", "");
    const img = U.el("img"); img.src = "img/ui/deutschland.png"; pn.appendChild(img);
    const cv = U.el("canvas"); cv.width = 512; cv.height = 384; cv.style.cssText = "position:absolute;left:0;top:0";
    pn.appendChild(cv);
    const info = SR.TRAINS[from + "-" + to] || ["ICE", "", ""];
    const side = UI.add("div", "side", `<div class="h">${info[0]}</div>\n${SR.CITIES[from].name} Hbf\n▼\n${SR.CITIES[to].name} Hbf\n\n${info[1]}\n${info[2]}`, pn);
    const ctx = cv.getContext("2d");
    const p1 = SR.CITIES[from].pos, p2 = SR.CITIES[to].pos;
    Audio_.bgm("Bicycle_n");
    const dur = UI.test() ? 0.05 : 3.2, t0 = U.now();
    const trail = [];
    await new Promise(res => {
      const step = () => {
        const t = Math.min(1, (U.now() - t0) / dur);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const x = p1[0] + (p2[0] - p1[0]) * e, y = p1[1] + (p2[1] - p1[1]) * e;
        trail.push([x, y]);
        ctx.clearRect(0, 0, 512, 384);
        ctx.fillStyle = "#c82020"; trail.forEach((p, i) => { if (i % 3 === 0) ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2); });
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(p2[1] - p1[1], p2[0] - p1[0]));
        ctx.fillStyle = "#1e1e28"; ctx.fillRect(-11, -5, 22, 9); ctx.fillStyle = "#f5f5fa"; ctx.fillRect(-10, -4, 20, 7);
        ctx.fillStyle = "#dc1414"; ctx.fillRect(-10, 1, 20, 1); ctx.fillStyle = "#283c6e"; [-8, -3, 2].forEach(xx => ctx.fillRect(xx, -3, 3, 2));
        ctx.restore();
        if (t < 1 || U.now() - t0 < dur + 0.6) requestAnimationFrame(step); else res();
      };
      step();
    });
    pn.remove();
  },

  // Komplette Reise mit Ankunft
  async travel(to, opts = {}) {
    if (!to) to = await this.show("travel", opts.allowed);
    if (!to) return false;
    const from = S().currentCity;
    await UI.fadeOut(0.3);
    await this.animate(from, to);
    S().currentCity = to;
    unlockCity(to, true);
    const m = opts.dest || SR.CITIES[to].map;
    await World.transfer(m[0], m[1], m[2], m[3], { fadeTime: 0.4 });
    return true;
  },
};
