// Sprachreise – Audio: Soundeffekte (WAV aus data/audio.js) und Musik (MIDI-Synthesizer)
"use strict";

const Audio_ = {
  ctx: null, master: null, seGain: null, bgmGain: null,
  buffers: {}, decoding: {},
  volBgm: 0.6, volSe: 0.8, muted: false,
  current: null,          // aktuelles Musikstück (Name)

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch (e) { return; }
    this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
    this.seGain = this.ctx.createGain(); this.seGain.connect(this.master);
    this.bgmGain = this.ctx.createGain(); this.bgmGain.connect(this.master);
    this.applyVolume();
  },
  unlock() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    if (this.pendingBgm) { const p = this.pendingBgm; this.pendingBgm = null; this.bgm(p, true); }
  },
  applyVolume() {
    if (!this.ctx) return;
    this.seGain.gain.value = this.muted ? 0 : this.volSe;
    this.bgmGain.gain.value = this.muted ? 0 : this.volBgm * 0.55;
  },
  b64(b) {
    const s = atob(b), a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a.buffer;
  },
  load(name) {
    if (this.buffers[name]) return Promise.resolve(this.buffers[name]);
    if (this.decoding[name]) return this.decoding[name];
    const raw = SR_DATA.audio && SR_DATA.audio[name];
    if (!raw || !this.ctx) return Promise.resolve(null);
    this.decoding[name] = new Promise(res => {
      try {
        this.ctx.decodeAudioData(this.b64(raw), b => { this.buffers[name] = b; res(b); }, () => res(null));
      } catch (e) { res(null); }
    });
    return this.decoding[name];
  },
  se(name, vol = 1, rate = 1) {
    if (!this.ctx || U.fastMode) return;
    this.load(name).then(b => {
      if (!b) return;
      const src = this.ctx.createBufferSource();
      src.buffer = b; src.playbackRate.value = rate;
      const g = this.ctx.createGain(); g.gain.value = vol;
      src.connect(g); g.connect(this.seGain); src.start();
    });
  },
  // Jingle: Musik kurz leiser
  async me(name, vol = 1) {
    if (!this.ctx || U.fastMode) return;
    const b = await this.load(name);
    if (!b) return;
    const t = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(t);
    this.bgmGain.gain.setTargetAtTime(this.muted ? 0 : this.volBgm * 0.1, t, 0.05);
    this.se(name, vol);
    this.bgmGain.gain.setTargetAtTime(this.muted ? 0 : this.volBgm * 0.55, t + b.duration, 0.3);
  },
  bgm(name, force) {
    if (name === undefined || name === null) return;
    if (!force && name === this.current) return;
    this.current = name;
    if (!this.ctx || this.ctx.state === "suspended") { this.pendingBgm = name; if (this.ctx) this.ctx.resume(); return; }
    Midi.play(name);
  },
  bgmStop(fade = 0.6) { this.current = null; Midi.stop(fade); },
};

// ------------------------------------------------------------------------------
// Kleiner MIDI-Synthesizer (Oszillatoren). Spielt die Essentials-MIDI-Stücke als Chiptune.
// ------------------------------------------------------------------------------
const Midi = {
  song: null, timer: null, start: 0, pos: 0, idx: 0, gen: 0, voices: [], chans: null, out: null,

  parse(buf) {
    const d = new DataView(buf); let p = 0;
    const str = n => { let s = ""; for (let i = 0; i < n; i++) s += String.fromCharCode(d.getUint8(p + i)); p += n; return s; };
    const u32 = () => { const v = d.getUint32(p); p += 4; return v; };
    const u16 = () => { const v = d.getUint16(p); p += 2; return v; };
    if (str(4) !== "MThd") throw new Error("kein MIDI");
    const hl = u32(); const fmt = u16(), ntr = u16(), div = u16(); p += hl - 6;
    const evs = [];
    for (let t = 0; t < ntr && p < d.byteLength; t++) {
      if (str(4) !== "MTrk") break;
      const len = u32(), end = p + len; let tick = 0, run = 0;
      const vlq = () => { let v = 0, b; do { b = d.getUint8(p++); v = (v << 7) | (b & 0x7f); } while (b & 0x80); return v; };
      while (p < end) {
        tick += vlq();
        let st = d.getUint8(p);
        if (st & 0x80) p++; else st = run;
        const ty = st >> 4, ch = st & 15;
        if (st === 0xff) {
          const mt = d.getUint8(p++), ml = vlq();
          if (mt === 0x51) evs.push({ tick, k: "tempo", v: (d.getUint8(p) << 16) | (d.getUint8(p + 1) << 8) | d.getUint8(p + 2) });
          p += ml;
        } else if (st === 0xf0 || st === 0xf7) { p += vlq(); }
        else {
          run = st;
          const a = d.getUint8(p++), b = (ty === 0xc || ty === 0xd) ? 0 : d.getUint8(p++);
          if (ty === 0x9 && b > 0) evs.push({ tick, k: "on", ch, n: a, v: b });
          else if (ty === 0x8 || (ty === 0x9 && b === 0)) evs.push({ tick, k: "off", ch, n: a });
          else if (ty === 0xc) evs.push({ tick, k: "prog", ch, v: a });
          else if (ty === 0xb) evs.push({ tick, k: "cc", ch, c: a, v: b });
        }
      }
      p = end;
    }
    evs.sort((x, y) => x.tick - y.tick || (x.k === "off" ? -1 : 1));
    // Ticks -> Sekunden
    let tempo = 500000, lastTick = 0, sec = 0;
    for (const e of evs) {
      sec += (e.tick - lastTick) * tempo / 1e6 / div; lastTick = e.tick;
      e.t = sec;
      if (e.k === "tempo") tempo = e.v;
    }
    return { evs: evs.filter(e => e.k !== "tempo"), len: sec + 0.5 };
  },
  cache: {},
  get(name) {
    if (this.cache[name]) return this.cache[name];
    const raw = SR_DATA.bgm && SR_DATA.bgm[name];
    if (!raw) return null;
    try { this.cache[name] = this.parse(Audio_.b64(raw)); } catch (e) { console.warn(e); return null; }
    return this.cache[name];
  },
  stop(fade = 0.5) {
    this.gen++;
    clearInterval(this.timer); this.timer = null;
    const ctx = Audio_.ctx; if (!ctx) return;
    if (this.out) {
      const o = this.out, t = ctx.currentTime;
      o.gain.setTargetAtTime(0, t, Math.max(0.01, fade / 3));
      setTimeout(() => { try { o.disconnect(); } catch (e) { } }, fade * 1000 + 300);
      this.out = null;
    }
    this.voices = [];
  },
  play(name) {
    this.stop(0.4);
    const song = this.get(name), ctx = Audio_.ctx;
    if (!song || !ctx) return;
    this.song = song;
    this.out = ctx.createGain(); this.out.gain.value = 1; this.out.connect(Audio_.bgmGain);
    this.chans = [];
    for (let c = 0; c < 16; c++) {
      const g = ctx.createGain(); g.gain.value = 0.8;
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = c === 9 ? 9000 : 2600;
      g.connect(f); f.connect(this.out);
      this.chans.push({ g, prog: 0, vol: 100 / 127, expr: 1, notes: {} });
    }
    this.start = ctx.currentTime + 0.1; this.idx = 0;
    const gen = this.gen;
    const tick = () => {
      if (gen !== this.gen) return;
      const now = ctx.currentTime, ahead = now + 0.3;
      while (true) {
        if (this.idx >= song.evs.length) { this.start += song.len; this.idx = 0; this.allOff(this.start); }
        const e = song.evs[this.idx], at = this.start + e.t;
        if (at > ahead) break;
        this.event(e, Math.max(at, now));
        this.idx++;
      }
    };
    tick();
    this.timer = setInterval(tick, 60);
  },
  allOff(t) { for (const ch of this.chans) { for (const k in ch.notes) this.release(ch.notes[k], t); ch.notes = {}; } },
  event(e, t) {
    const ch = this.chans[e.ch];
    if (e.k === "prog") ch.prog = e.v;
    else if (e.k === "cc") {
      if (e.c === 7) ch.vol = e.v / 127;
      else if (e.c === 11) ch.expr = e.v / 127;
      else if (e.c === 123 || e.c === 120) { for (const k in ch.notes) this.release(ch.notes[k], t); ch.notes = {}; }
      ch.g.gain.setValueAtTime(ch.vol * ch.expr * 0.8, t);
    } else if (e.k === "on") {
      if (e.ch === 9) { this.drum(e.n, e.v / 127, t, ch); return; }
      if (ch.notes[e.n]) this.release(ch.notes[e.n], t);
      ch.notes[e.n] = this.voice(ch, e.n, e.v / 127, t);
    } else if (e.k === "off") {
      if (e.ch === 9) return;
      const v = ch.notes[e.n]; if (v) { this.release(v, t); delete ch.notes[e.n]; }
    }
  },
  voice(ch, n, vel, t) {
    const ctx = Audio_.ctx, p = ch.prog;
    const freq = 440 * Math.pow(2, (n - 69) / 12);
    let type = "square", a = 0.005, dec = 0.4, sus = 0.55, rel = 0.12, amp = 0.09;
    if (p < 8) { type = "triangle"; dec = 0.6; sus = 0.25; amp = 0.16; }
    else if (p < 16) { type = "sine"; dec = 0.35; sus = 0.0; amp = 0.16; rel = 0.3; }
    else if (p < 24) { type = "square"; sus = 0.8; amp = 0.06; }
    else if (p < 32) { type = "sawtooth"; dec = 0.5; sus = 0.2; amp = 0.07; }
    else if (p < 40) { type = "triangle"; sus = 0.8; amp = 0.2; }
    else if (p < 56) { type = "sawtooth"; a = 0.06; sus = 0.8; amp = 0.05; rel = 0.3; }
    else if (p < 64) { type = "square"; a = 0.02; sus = 0.75; amp = 0.06; }
    else if (p < 80) { type = "triangle"; a = 0.02; sus = 0.85; amp = 0.13; }
    else { type = "square"; sus = 0.7; amp = 0.06; }
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    const pk = amp * (0.35 + 0.65 * vel);
    g.gain.linearRampToValueAtTime(pk, t + a);
    g.gain.setTargetAtTime(pk * sus, t + a, dec / 3);
    o.connect(g); g.connect(ch.g); o.start(t);
    const v = { o, g, rel, end: t + 12 };
    o.stop(t + 12);
    return v;
  },
  release(v, t) {
    try {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setTargetAtTime(0, t, v.rel / 3);
      v.o.stop(t + v.rel * 2 + 0.05);
    } catch (e) { }
  },
  noise: null,
  drum(n, vel, t, ch) {
    const ctx = Audio_.ctx;
    if (!this.noise) {
      const b = ctx.createBuffer(1, 22050, 22050), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.noise = b;
    }
    const g = ctx.createGain(); g.connect(ch.g);
    if (n === 35 || n === 36) {          // Bassdrum
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(0.35 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g); o.start(t); o.stop(t + 0.2);
      return;
    }
    const s = ctx.createBufferSource(); s.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    let len = 0.05, amp = 0.08;
    if (n === 38 || n === 40) { f.type = "bandpass"; f.frequency.value = 1800; len = 0.14; amp = 0.22; }
    else if (n === 42 || n === 44 || n === 46) { f.type = "highpass"; f.frequency.value = 7000; len = n === 46 ? 0.2 : 0.04; amp = 0.07; }
    else if (n === 49 || n === 57 || n === 51) { f.type = "highpass"; f.frequency.value = 5000; len = 0.5; amp = 0.06; }
    else { f.type = "bandpass"; f.frequency.value = 600 + n * 20; len = 0.1; amp = 0.1; }
    g.gain.setValueAtTime(amp * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    s.connect(f); f.connect(g); s.start(t, Math.random() * 0.5); s.stop(t + len + 0.02);
  },
};
