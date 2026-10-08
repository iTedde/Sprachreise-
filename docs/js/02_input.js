// Sprachreise – Eingabe: Tastatur, Touch-Steuerkreuz, Maus/Touch auf Fenstern
"use strict";

const Input = {
  held: {}, order: [], pending: [], trig: {}, runLock: false,
  modal: [],               // Stapel von UI-Handlern: fn(key) -> true wenn verarbeitet
  KEYS: {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
    Enter: "ok", NumpadEnter: "ok", Space: "ok", KeyC: "ok", KeyZ: "ok", KeyE: "ok",
    Escape: "back", KeyX: "back", Backspace: "back", KeyQ: "back",
    KeyM: "menu", Tab: "menu", ShiftLeft: "run", ShiftRight: "run",
    PageUp: "pgup", PageDown: "pgdn",
  },

  init() {
    window.addEventListener("keydown", e => {
      Audio_.unlock();
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      const k = this.KEYS[e.code];
      if (!k) return;
      e.preventDefault();
      if (e.repeat && k !== "up" && k !== "down" && k !== "left" && k !== "right") return;
      this.press(k, e.repeat);
    });
    window.addEventListener("keyup", e => {
      const k = this.KEYS[e.code];
      if (k) this.release(k);
    });
    window.addEventListener("blur", () => { this.held = {}; this.order = []; });
    // Touch-Steuerung
    const touchKeys = document.querySelectorAll("#touch [data-k]");
    touchKeys.forEach(el => {
      const k = el.dataset.k;
      const down = e => {
        e.preventDefault(); Audio_.unlock();
        if (k === "run") { this.runLock = !this.runLock; el.classList.toggle("lock", this.runLock); return; }
        el.classList.add("on"); this.press(k);
      };
      const up = e => { e.preventDefault(); el.classList.remove("on"); if (k !== "run") this.release(k); };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("pointerleave", up);
    });
    // Steuerkreuz: Finger darf über die Richtungen gleiten
    const dpad = document.getElementById("dpad");
    let dk = null;
    const dmove = e => {
      e.preventDefault();
      const r = dpad.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      let k = null;
      if (Math.hypot(x, y) > 12) k = Math.abs(x) > Math.abs(y) ? (x < 0 ? "left" : "right") : (y < 0 ? "up" : "down");
      if (k !== dk) {
        if (dk) { this.release(dk); dpad.querySelector("." + dk).classList.remove("on"); }
        dk = k;
        if (k) { this.press(k); dpad.querySelector("." + k).classList.add("on"); }
      }
    };
    const dend = e => { if (dk) { this.release(dk); dpad.querySelector("." + dk).classList.remove("on"); dk = null; } };
    dpad.addEventListener("pointerdown", e => { Audio_.unlock(); dpad.setPointerCapture(e.pointerId); dmove(e); });
    dpad.addEventListener("pointermove", e => { if (e.buttons || e.pointerType === "touch") dmove(e); });
    dpad.addEventListener("pointerup", dend);
    dpad.addEventListener("pointercancel", dend);
    window.addEventListener("touchstart", () => document.body.classList.add("touch"), { passive: true, once: true });
    if (matchMedia("(pointer: coarse)").matches) document.body.classList.add("touch");
    window.addEventListener("pointerdown", () => Audio_.unlock(), { passive: true });
  },
  press(k, repeat) {
    if (!this.held[k]) { this.held[k] = true; this.order.push(k); }
    if (this.modal.length) {
      const h = this.modal[this.modal.length - 1];
      h(k, repeat);
      return;
    }
    if (!repeat) this.pending.push(k);
  },
  release(k) {
    delete this.held[k];
    this.order = this.order.filter(x => x !== k);
  },
  // einmal pro Frame aufrufen
  update() {
    this.trig = {};
    for (const k of this.pending) this.trig[k] = true;
    this.pending = [];
  },
  trigger(k) { return !!this.trig[k]; },
  dir() {
    if (this.modal.length) return null;
    for (let i = this.order.length - 1; i >= 0; i--) {
      const k = this.order[i];
      if (k === "up" || k === "down" || k === "left" || k === "right") return k;
    }
    return null;
  },
  running() { return !!this.held.run || this.runLock || !!this.held.back; },
  pushModal(fn) { this.modal.push(fn); this.pending = []; },
  popModal(fn) { const i = this.modal.lastIndexOf(fn); if (i >= 0) this.modal.splice(i, 1); this.pending = []; },
  // Warten auf eine der Tasten (für einfache Bestätigungen)
  waitKey(keys = ["ok", "back"]) {
    return new Promise(res => {
      const h = k => { if (keys.includes(k)) { this.popModal(h); res(k); } };
      this.pushModal(h);
      if (window.SR_TEST && SR_TEST.active) setTimeout(() => { if (this.modal.includes(h)) { this.popModal(h); res(keys[0]); } }, 1);
    });
  },
};
