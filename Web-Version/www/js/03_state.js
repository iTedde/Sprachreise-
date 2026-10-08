// Sprachreise – Spielstand: Sprachpunkte, Niveau, Wörter, Aufgaben, Dokumente, Tagebuch, Kontakte
"use strict";

SR.LEVELS = [
  [0, "A2", "Grundlagen"],
  [400, "A2+", "Mehr Wortschatz"],
  [1500, "B1-", "Komplexere Sätze"],
  [2850, "B1", "Selbstständige Kommunikation"],
];

SR.SKILLS = {
  wege: ["Wegbeschreibungen verstehen", "Du verstehst links, rechts und geradeaus – und findest Adressen."],
  formulare: ["Formulare verstehen", "Pflichtfelder werden in Formular-Minispielen markiert."],
  alltag: ["Alltagsdeutsch", "Du verstehst Umgangssprache: »Läuft!«, »gegen sechs«, »Was für ein Tor!«"],
  briefe: ["Behördenbrief verstehen", "Hinweise bei langen Briefen: Fristen, Beträge, Aufgaben."],
  beruf: ["Deutsch im Beruf", "Du kannst mit Kolleginnen und Patienten sprechen."],
  telefon: ["Telefonieren", "Komplexere Telefongespräche werden möglich."],
  reisen: ["Reisen wie ein Profi", "Durchsagen, Gleiswechsel, Verspätungen – kein Problem mehr."],
  argumente: ["Argumentieren", "Du kannst ruhig und sachlich widersprechen."],
  selbststaendig: ["Selbstständig kommunizieren", "Komplexere Dialogoptionen werden freigeschaltet."],
};

SR.EPISODES = [
  [1, "Ankommen", "Berlin", "alltag"],
  [2, "Das Bürgeramt", "Berlin", "amt"],
  [3, "Mein Kiez", "Berlin", "alltag"],
  [4, "Wohnung & Konto", "Köln", "amt"],
  [5, "Kollegen & Kölsch", "Köln", "alltag"],
  [6, "Krank in Köln", "Köln", "amt"],
  [7, "Deutschland entdecken", "Frankfurt – München – Dresden – Berlin", "alltag"],
  [8, "Die Ausländerbehörde", "Köln", "amt"],
  [9, "Nicht mit mir", "Köln", "alltag"],
  [10, "B1", "Hamburg", "finale"],
];

SR.newState = function () {
  return {
    version: 1, points: 0, words: {}, flags: {}, quests: {}, docs: [], diary: [], skills: [],
    cities: ["berlin"], episode: 1, episodesDone: [], mistakes: 0, currentCity: "berlin",
    origin: null, gloss: true, name: "", friends: {}, chats: {}, typed: 0, typedOk: 0,
    pos: null, playtime: 0, created: Date.now(),
  };
};
SR.state = SR.newState();
const S = () => SR.state;

// ---- Herkunft -----------------------------------------------------------------
SR.origin = () => (S().origin && SR_DATA.lang.origins[S().origin]) ? S().origin : "es";
SR.o = f => (SR_DATA.lang.origins[SR.origin()] || {})[f] || "";
SR.playerName = () => S().name || SR.o("first");
SR.tr = key => {
  const w = SR.WORDS[key]; if (!w) return "";
  if (SR.origin() === "en") return w.en;
  const t = SR_DATA.lang.tr[key];
  return (t && t[SR.origin()]) || w.en;
};
SR.gloss = () => S().gloss !== false;

// ---- Flags ----------------------------------------------------------------------
function flag(k) { return !!S().flags[k]; }
function fval(k) { return S().flags[k]; }
function set(k, v = true) { S().flags[k] = v; World.needRefresh = true; }
function unset(k) { delete S().flags[k]; World.needRefresh = true; }
function count(k) { S().flags[k] = (S().flags[k] || 0) + 1; return S().flags[k]; }
function ep() { return S().episode; }

// ---- Punkte & Niveau ----------------------------------------------------------------
SR.levelIndex = (p = S().points) => { let i = 0; SR.LEVELS.forEach((l, j) => { if (p >= l[0]) i = j; }); return i; };
SR.levelName = (p) => SR.LEVELS[SR.levelIndex(p)][1];
SR.nextLevel = () => { const i = SR.levelIndex(); return i < SR.LEVELS.length - 1 ? SR.LEVELS[i + 1][0] : null; };
function points(n, reason, quiet) {
  if (n <= 0) return;
  const before = SR.levelIndex();
  S().points += n;
  if (!quiet) UI.toast(`+${n} Sprachpunkte` + (reason ? "  ·  " + reason : ""), "points");
  const after = SR.levelIndex();
  if (after > before) UI.queue(() => UI.levelUp(SR.LEVELS[after][1], SR.LEVELS[after][2]));
}

// ---- Wörter ------------------------------------------------------------------------
function word(k) { return !!S().words[k]; }
function learn(...keys) {
  let quiet = false;
  if (keys[keys.length - 1] === true) { quiet = true; keys.pop(); }
  for (const k of keys) {
    const w = SR.WORDS[k];
    if (!w) { SR.error("Unbekanntes Wort: " + k); continue; }
    if (word(k)) continue;
    S().words[k] = { ep: S().episode, map: World.map ? World.map.id : "" };
    if (!quiet) UI.queue(() => UI.newWord(w, k));
    points(w.pts || 3, null, true);
  }
}

// ---- Aufgaben ------------------------------------------------------------------------
function quest(q, quiet) {
  const d = SR.QUESTS[q]; if (!d) { SR.error("Unbekannte Aufgabe: " + q); return; }
  if (S().quests[q]) return;
  S().quests[q] = { status: "active", steps: {} };
  if (!quiet) UI.toast("Neue Aufgabe: " + d.title, "quest");
  World.needRefresh = true;
}
function active(q) { return !!S().quests[q] && S().quests[q].status === "active"; }
function done(q) { return !!S().quests[q] && S().quests[q].status === "done"; }
function known(q) { return !!S().quests[q]; }
function stepDone(q, st) { return !!(S().quests[q] && S().quests[q].steps[st]); }
function step(q, st, quiet) {
  if (!S().quests[q]) quest(q, true);
  const qs = S().quests[q]; if (qs.steps[st]) return;
  qs.steps[st] = true;
  const d = SR.QUESTS[q].steps.find(x => x[0] === st);
  if (!d) SR.error(`Unbekannter Schritt ${q}.${st}`);
  if (!quiet && d) UI.toast("■ " + d[1], "quest");
  World.needRefresh = true;
}
function finish(q, pts = 0) {
  if (!S().quests[q]) quest(q, true);
  if (done(q)) return;
  const d = SR.QUESTS[q];
  d.steps.forEach(s => S().quests[q].steps[s[0]] = true);
  S().quests[q].status = "done";
  UI.toast("Aufgabe erledigt: " + d.title, "quest");
  if (pts > 0) points(pts, d.side ? "Nebenaufgabe" : "Hauptaufgabe");
  World.needRefresh = true;
}

// ---- Dokumente -------------------------------------------------------------------------
function hasDoc(k) { return S().docs.includes(k); }
function doc(k, quiet) {
  const d = SR.DOCUMENTS[k]; if (!d) { SR.error("Unbekanntes Dokument: " + k); return; }
  if (hasDoc(k)) return;
  S().docs.push(k);
  if (!quiet) UI.queue(async () => { Audio_.me("item_get"); await UI.banner("DOKUMENT ERHALTEN", d.name, d.short, "#3060c8"); });
}
function takeDoc(k) { S().docs = S().docs.filter(x => x !== k); }

// ---- Tagebuch ----------------------------------------------------------------------------
function diary(k, text) {
  if (S().diary.some(e => e[0] === k)) return;
  S().diary.push([k, S().episode, text]);
  UI.toast("Neuer Tagebucheintrag", "diary");
}

// ---- Fähigkeiten -------------------------------------------------------------------------
function skill(k) { return S().skills.includes(k); }
function giveSkill(k) {
  if (skill(k)) return;
  S().skills.push(k);
  const s = SR.SKILLS[k];
  UI.queue(() => UI.banner("NEUE FÄHIGKEIT", s[0], s[1], "#8a3cc8"));
}

// ---- Kontakte / Freundschaft ---------------------------------------------------------------
function friend(id, n = 1, quiet) {
  const p = SR.PEOPLE[id]; if (!p) { SR.error("Unbekannte Person: " + id); return; }
  const before = S().friends[id];
  const v = Math.min(5, (before || 0) + n);
  S().friends[id] = v;
  if (before === undefined) { if (!quiet) UI.toast("Neuer Kontakt: " + p.name, "friend"); }
  else if (v > before && !quiet) UI.toast(p.name + "  " + "♥".repeat(v), "friend");
}
function friendLevel(id) { return S().friends[id] || 0; }
function met(id) { return S().friends[id] !== undefined; }

// ---- Städte / Episoden ------------------------------------------------------------------------
function unlockCity(k, quiet) {
  if (S().cities.includes(k)) return;
  S().cities.push(k);
  if (!quiet) UI.toast("Neues Reiseziel: " + SR.CITIES[k].name, "map");
}
async function finishEpisode(n, bonus = 0) {
  if (S().episodesDone.includes(n)) return;
  S().episodesDone.push(n);
  if (bonus > 0) points(bonus, `Episode ${n} geschafft`);
  await UI.flush();
  await UI.episodeComplete(n);
  S().episode = n + 1;
  World.needRefresh = true;
  SR.save("auto");
}
function mistake() { S().mistakes++; }

SR.error = function (msg) {
  console.error("[Sprachreise] " + msg);
  if (window.SR_TEST) SR_TEST.error(msg);
};

// ---- Speichern ----------------------------------------------------------------------------------
SR.SAVE_KEY = "sprachreise.save.";
SR.save = function (slot = "main") {
  try {
    const st = S();
    if (World.map && World.player) st.pos = { map: World.map.id, x: World.player.x, y: World.player.y, dir: World.player.dir };
    st.savedAt = Date.now();
    localStorage.setItem(SR.SAVE_KEY + slot, JSON.stringify(st));
    return true;
  } catch (e) { return false; }
};
SR.loadSlot = function (slot = "main") {
  try { const s = localStorage.getItem(SR.SAVE_KEY + slot); return s ? JSON.parse(s) : null; } catch (e) { return null; }
};
SR.latestSave = function () {
  const a = SR.loadSlot("main"), b = SR.loadSlot("auto");
  if (a && b) return (a.savedAt || 0) >= (b.savedAt || 0) ? a : b;
  return a || b;
};
SR.applyState = function (st) {
  const base = SR.newState();
  SR.state = Object.assign(base, st);
};
