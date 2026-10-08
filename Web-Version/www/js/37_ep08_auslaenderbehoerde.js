// Sprachreise – Episode 8: Die Ausländerbehörde (schwierigere Bürokratie, ernst) · Köln
// Deutschland: Aufenthaltserlaubnis verlängern, Fristen, Checklisten, Fiktionsbescheinigung, eAT
// Deutsch: formelle E-Mail (»Sehr geehrte Damen und Herren«), um etwas bitten, unter Druck ruhig erklären
// Menschen: Herr Schmitz, Herr Kaiser, Frau Hoffmann, Yara, Herr Wagner · Veränderung: Sie hat Angst – und geht trotzdem. Und sie weiß, wen sie fragen kann.
// Hinweis im Spiel: vereinfachte Darstellung, keine Rechtsberatung.
"use strict";

Object.assign(SR.WORDS, {
  auslaenderbehoerde: { de: "Ausländerbehörde", art: "die", en: "immigration office", cat: "Behörden", ex: "Ich habe einen Termin bei der Ausländerbehörde.", pts: 5 },
  aufenthaltserlaubnis: { de: "Aufenthaltserlaubnis", art: "die", en: "residence permit", cat: "Behörden", ex: "Ich muss meine Aufenthaltserlaubnis verlängern.", pts: 6 },
  frist: { de: "Frist", art: "die", pl: "die Fristen", en: "deadline", cat: "Behörden", ex: "Die Frist endet am 30. November.", note: "Fristen sind in Deutschland sehr wichtig. Immer notieren!" },
  verlaengern: { de: "verlängern", en: "to extend", cat: "Behörden", ex: "Mein Visum muss verlängert werden." },
  antrag: { de: "Antrag", art: "der", pl: "die Anträge", en: "application", cat: "Behörden", ex: "Ich stelle einen Antrag auf Verlängerung." },
  checkliste: { de: "Checkliste", art: "die", en: "checklist", cat: "Behörden", ex: "Auf der Checkliste stehen acht Dokumente." },
  gehaltsabrechnung: { de: "Gehaltsabrechnung", art: "die", pl: "die Gehaltsabrechnungen", en: "payslip", cat: "Arbeit", ex: "Bitte bringen Sie die Gehaltsabrechnungen der letzten drei Monate mit." },
  sehr_geehrte: { de: "Sehr geehrte Damen und Herren", en: "Dear Sir or Madam", cat: "Formelle Briefe", ex: "Sehr geehrte Damen und Herren, ich möchte einen Termin vereinbaren.", note: "Formeller Anfang, wenn man den Namen nicht kennt. Ende: »Mit freundlichen Grüßen«." },
  nachreichen: { de: "nachreichen", en: "to submit later", cat: "Behörden", ex: "Den Bescheid können Sie nachreichen." },
  fiktionsbescheinigung: { de: "Fiktionsbescheinigung", art: "die", en: "interim residence certificate", cat: "Behörden", ex: "Mit der Fiktionsbescheinigung darf ich weiter arbeiten.", note: "Bestätigt: Der Aufenthalt gilt als erlaubt, bis die Behörde entschieden hat. (Vereinfacht.)", pts: 8 },
  aufenthaltstitel: { de: "Aufenthaltstitel", art: "der", en: "residence title", cat: "Behörden", ex: "Der elektronische Aufenthaltstitel ist eine Karte im Scheckkartenformat." },
  mut: { de: "Mut", art: "der", en: "courage", cat: "Gefühle", ex: "Dafür braucht man Mut." },
});

Object.assign(SR.QUESTS, {
  q_aufenthalt: { title: "Die Aufenthaltserlaubnis", ep: 8,
    desc: "Mein Visum läuft am 30. November ab. Ich muss bei der Ausländerbehörde eine Aufenthaltserlaubnis beantragen. Rechtzeitig. Mit allen Unterlagen.\n<span class=sub>(Vereinfachte Darstellung – keine Rechtsberatung.)</span>",
    steps: [["brief", "Den Brief verstehen"], ["termin", "Per E-Mail einen Termin vereinbaren"], ["liste", "Die Checkliste prüfen"],
            ["arbeitgeber", "Unterlagen vom Arbeitgeber holen"], ["termin_abh", "Zum Termin gehen"], ["fiktion", "Eine Bescheinigung bekommen"], ["eat", "Den Aufenthaltstitel abholen"]] },
});

Object.assign(SR.DOCUMENTS, {
  abh_brief: { name: "Brief der Ausländerbehörde", short: "Visum gültig bis 30.11.",
    text: "Stadt Köln · Ausländerbehörde\nIhr nationales Visum ist gültig bis zum <b>30.11.</b> Für einen weiteren Aufenthalt beantragen Sie bitte <b>rechtzeitig vor Ablauf</b> eine Aufenthaltserlaubnis.\n<c3=707078,D8D8D0>Vereinfachte Darstellung.</c3>" },
  gehaltsabrechnung: { name: "Gehaltsabrechnungen (3 Monate)", short: "St.-Marien-Klinikum",
    text: "Gehaltsabrechnungen August, September, Oktober\nArbeitgeber: St.-Marien-Klinikum Köln\nArbeitnehmerin: {name} {nachname}" },
  erklaerung: { name: "Erklärung zum Beschäftigungsverhältnis", short: "Unterschrieben von Frau Hoffmann",
    text: "Erklärung zum Beschäftigungsverhältnis\nTätigkeit: Pflegekraft · Vollzeit · unbefristet nach Probezeit\nArbeitgeber: St.-Marien-Klinikum Köln\nUnterschrift: S. Hoffmann, Pflegedirektion" },
  passfotos: { name: "Biometrische Passfotos", short: "Noch drei übrig vom Fotoautomaten",
    text: "Drei biometrische Passfotos. Ich sehe darauf krank aus. Weil ich krank war. Aber: biometrisch korrekt!" },
  fiktion: { name: "Fiktionsbescheinigung", short: "Ausländerbehörde Köln",
    text: "Fiktionsbescheinigung\nDer Aufenthalt gilt bis zur Entscheidung über den Antrag als erlaubt. Die Erwerbstätigkeit ist gestattet.\nNachzureichen: Bescheid über das Anerkennungsverfahren (4 Wochen)\n<c3=707078,D8D8D0>Vereinfachte Darstellung – keine Rechtsberatung.</c3>" },
  anerkennung_bescheid: { name: "Bescheid Anerkennungsverfahren", short: "Bezirksregierung – Verfahren läuft",
    text: "Bescheid: Ihr Antrag auf Anerkennung als Pflegefachfrau wird bearbeitet. Voraussetzungen: Anpassungsmaßnahme + Deutschkenntnisse B2.\n<c3=707078,D8D8D0>Erster Schritt: B1. Zweiter Schritt: B2.</c3>" },
  eat: { name: "Elektronischer Aufenthaltstitel", short: "Aufenthaltserlaubnis – Karte",
    text: "Elektronischer Aufenthaltstitel (eAT)\nAufenthaltserlaubnis · Erwerbstätigkeit gestattet\nInhaberin: {name} {nachname}\n<c3=707078,D8D8D0>Eine Plastikkarte. Und doch so viel mehr.</c3>" },
});

// ------------------------------------------------------------------------------
scene("ep8_vorabend", async () => {
  await think("Zurück in Köln. Ich bin müde. Und glücklich. Jetzt nach Hause in die Körnerstraße.");
});
scene("ep8_start", async () => {
  set("ep8_started");
  Audio_.bgm("Cave");
  await narr("Im Briefkasten: ein Brief. Grauer Umschlag. Absender: <b>Stadt Köln – Ausländerbehörde</b>.");
  await think("Graue Umschläge sind die gefährlichen. Hat Jonas gesagt.");
  await UI.episodeCard(8, "Fristen, Checklisten, Zimmer 214.\nUnd die Frage: Darf ich bleiben?");
  quest("q_aufenthalt");
  await Mini.letter("Stadt Köln · Ausländerbehörde", [
    "Stadt Köln – Ausländerbehörde\n\nFrau\n{name} {nachname}\nKörnerstraße 21\n50823 Köln\n\n<b>Ihr Aufenthalt in Deutschland</b>",
    "Sehr geehrte Frau {nachname},\n\nIhr nationales Visum ist gültig bis zum <b>30. November</b>.\n\nFür einen weiteren Aufenthalt müssen Sie <b>vor Ablauf</b> eine Aufenthaltserlaubnis beantragen. Bitte vereinbaren Sie dafür einen Termin.\n\nDie erforderlichen Unterlagen entnehmen Sie bitte der beiliegenden Checkliste.\n\nMit freundlichen Grüßen\nIm Auftrag\nSchmitz",
  ], [
    { q: "Bis wann ist mein Visum gültig?", o: ["Bis zum 30. November", "Für immer", "Bis morgen"], a: 0, why: "»Ihr nationales Visum ist gültig bis zum 30. November.«" },
    { q: "Was muss ich tun?", o: ["Vor dem 30.11. eine Aufenthaltserlaubnis beantragen", "Nichts", "Nach dem 30.11. ausreisen"], a: 0, why: "»Für einen weiteren Aufenthalt müssen Sie vor Ablauf eine Aufenthaltserlaubnis beantragen.«" },
    { q: "Wie bekomme ich einen Termin?", o: ["Ich muss ihn selbst vereinbaren.", "Die Behörde schickt mir einen.", "Ich gehe einfach hin."], a: 0, why: "»Bitte vereinbaren Sie dafür einen Termin.«" },
  ]);
  doc("abh_brief", true);
  learn("auslaenderbehoerde", "aufenthaltserlaubnis", "frist", "verlaengern");
  step("q_aufenthalt", "brief");
  await narr("<c3=707078,D8D8D0>Hinweis: Das Spiel zeigt das Aufenthaltsrecht stark vereinfacht. Es ist keine Rechtsberatung. Im echten Leben: Beratungsstellen, Arbeitgeber und die Behörde selbst fragen.</c3>");
  await think("Darf ich bleiben? Was, wenn etwas fehlt? Was, wenn ich etwas falsch mache?");
  await think("Ruhig. Schritt für Schritt. Zuerst einen Termin. Auf dem Laptop.");
});

scene("abh_termin_buchen", async () => {
  await UI.withPaper("stadt-koeln.de · Terminvereinbarung Ausländerbehörde", "Anliegen: <b>Aufenthaltserlaubnis – Beschäftigung</b>\n\n<c3=C03030,F0C0C0>Derzeit sind keine Termine verfügbar.</c3>\nIn dringenden Fällen schreiben Sie bitte eine E-Mail an: abh-termin@stadt-koeln.example", "screen", async () => {
    await think("Keine Termine. Natürlich. Aber diesmal lade ich nicht hundertmal neu. Ich schreibe eine E-Mail. Formell.");
  });
  learn("sehr_geehrte", "antrag");
  const p = UI.paper("Neue E-Mail · An: abh-termin@stadt-koeln.example", "Betreff: Termin Aufenthaltserlaubnis – {nachname}, {name}\n\n…", "screen");
  try {
    await Typing.task({ prompt: "Die formelle Anrede (du kennst den Namen nicht):", answers: ["Sehr geehrte Damen und Herren,", "Sehr geehrte Damen und Herren"], mode: "sentence", place: "bottom", label: "Formelle E-Mail",
      need: [["sehr"], ["geehrte"], ["damen"], ["herren"]], tips: ["»Sehr …«", "»Sehr geehrte …«", "»… Damen …«", "»… und Herren«"], hints: ["Sehr geehrte D… und H…", "Sehr geehrte Damen und Herren,"] });
    p.set("Betreff: Termin Aufenthaltserlaubnis – {nachname}, {name}\n\nSehr geehrte Damen und Herren,\n\n…");
    await Typing.task({ prompt: "Schreib, was du möchtest: einen Termin vereinbaren.\n<span class=sub>(Ich möchte … – höflich, ganzer Satz)</span>",
      answers: ["Ich möchte einen Termin für meine Aufenthaltserlaubnis vereinbaren.", "Ich möchte einen Termin vereinbaren."], mode: "sentence", place: "bottom", label: "Formelle E-Mail", pts: 8,
      need: [["möchte", "würde", "bitte"], ["termin"], ["vereinbaren", "machen", "bekommen", "buchen"]], tips: ["»Ich möchte …«", "Was? Einen T…", "Was machst du mit einem Termin? v…"] });
    p.set("Betreff: Termin Aufenthaltserlaubnis – {nachname}, {name}\n\nSehr geehrte Damen und Herren,\n\nich möchte einen Termin für meine Aufenthaltserlaubnis vereinbaren. Mein Visum ist bis zum 30.11. gültig.\n\n…");
    await Typing.task({ prompt: "Und der formelle Schluss:", answers: ["Mit freundlichen Grüßen", "Mit freundlichen Grüßen,"], mode: "sentence", place: "bottom", label: "Formelle E-Mail", minWords: 3,
      need: [["mit"], ["freundlichen"], ["grüßen", "gruessen"]], tips: ["»Mit …«", "»Mit f…«", "»… Grüßen«"], hints: ["Mit f… G…", "Mit freundlichen Grüßen"] });
    p.set("Betreff: Termin Aufenthaltserlaubnis – {nachname}, {name}\n\nSehr geehrte Damen und Herren,\n\nich möchte einen Termin für meine Aufenthaltserlaubnis vereinbaren. Mein Visum ist bis zum 30.11. gültig.\n\nMit freundlichen Grüßen\n{name} {nachname}");
    Audio_.se("confirm", 0.8);
    await narr("<b>Gesendet.</b>");
  } finally { p.close(); }
  await UI.tone(0.7, 0.4);
  await narr("Drei Tage später.");
  await UI.tone(0, 0.4);
  await UI.withPaper("Posteingang · Antwort der Ausländerbehörde", "Sehr geehrte Frau {nachname},\n\nwir haben für Sie folgenden Termin reserviert:\n<b>Montag, 14.11., 9:00 Uhr, Zimmer 214</b>\n\nBitte bringen Sie alle Unterlagen laut Checkliste mit.\n\nMit freundlichen Grüßen\nSchmitz", "screen", async () => {
    await Mini.quiz([{ q: "Wann ist der Termin?", o: ["Montag, 14.11., 9 Uhr", "Freitag, 30.11.", "Heute"], a: 0, why: "»Montag, 14.11., 9:00 Uhr, Zimmer 214«" }], 4);
  });
  step("q_aufenthalt", "termin");
  set("abh_termin");
  await World.call("checkliste");
});
scene("checkliste", async () => {
  learn("checkliste", "gehaltsabrechnung");
  doc("passfotos", true);
  const have = k => hasDoc(k);
  const line = (ok, t) => (ok ? "<c3=307030,C0E0C0>☑ " : "<c3=C03030,F0C0C0>☐ ") + t + "</c3>";
  await UI.withPaper("Checkliste: Aufenthaltserlaubnis (Beschäftigung)", [
    line(have("reisepass"), "Gültiger Reisepass"), line(true, "Ein biometrisches Passfoto"), line(have("meldebescheinigung_koeln"), "Meldebescheinigung"),
    line(have("mietvertrag_koeln"), "Mietvertrag"), line(have("arbeitsvertrag"), "Arbeitsvertrag"), line(have("gesundheitskarte"), "Nachweis Krankenversicherung"),
    line(have("gehaltsabrechnung"), "Gehaltsabrechnungen der letzten 3 Monate"), line(have("erklaerung"), "Erklärung zum Beschäftigungsverhältnis (vom Arbeitgeber)"),
  ].join("\n"), "paper", async () => {
    await think("Pass, Meldebescheinigung, Mietvertrag, Arbeitsvertrag, Gesundheitskarte – habe ich alles! In Mais Ordner Nr. 2.");
    await think("Und ein Passfoto? Ich habe noch drei vom Fotoautomaten der Krankenkasse. Das Gespenster-Foto. Danke, Grippe!");
    await think("Was fehlt: die Gehaltsabrechnungen und die Erklärung vom Arbeitgeber. Das muss ich in der Personalabteilung holen.");
  });
  step("q_aufenthalt", "liste");
  diary("d_checkliste", "Acht Dokumente. Sechs habe ich schon. Vor einem halben Jahr hatte ich nur einen Pass und einen Koffer. Jetzt habe ich einen Ordner. Ordner Nr. 2. Mai hatte recht.");
});

scene("kaiser_ep8", async () => {
  if (hasDoc("gehaltsabrechnung") && hasDoc("erklaerung")) { await say("Herr Kaiser", "Viel Erfolg bei der Ausländerbehörde! Und: Kopien machen. Immer."); return; }
  if (!flag("abh_termin")) { await say("Herr Kaiser", "Personalabteilung, Kaiser. Was kann ich für Sie tun?"); return; }
  await say("Herr Kaiser", "Personalabteilung, Kaiser. Was kann ich für Sie tun?");
  await Typing.task({ speaker: "Herr Kaiser", prompt: "Bitte Herrn Kaiser höflich um die Gehaltsabrechnungen der letzten drei Monate.\n<span class=sub>(Könnten Sie mir bitte …?)</span>",
    answers: ["Könnten Sie mir bitte die Gehaltsabrechnungen der letzten drei Monate geben?"], mode: "sentence", place: "top", label: "Höflich bitten", pts: 8,
    need: [["könnten", "können", "würden"], ["bitte"], ["gehaltsabrechnungen", "gehaltsabrechnung", "abrechnungen"]], tips: ["Höflich: »Könnten Sie …?«", "Vergiss »bitte« nicht.", "Was brauchst du? Die G…"] });
  await say("Herr Kaiser", "Konjunktiv und »bitte«. Sie sind ja höflicher als mein Chef. Moment.");
  se("pc", 0.8); await wait(0.4);
  doc("gehaltsabrechnung");
  await say("Herr Kaiser", "Hier, drei Monate. Und die Erklärung zum Beschäftigungsverhältnis? Die muss Frau Hoffmann unterschreiben. Sie ist bis Freitag auf einer Fortbildung.");
  await say(ME, "Bis Freitag? Mein Termin ist am Montag!");
  await say("Herr Kaiser", "Dann rufen Sie sie an. Hier ist ihre Handynummer. Sie beißt nicht. Nur montags.");
  set("hoffmann_anrufen");
  await think("Ich muss Frau Hoffmann anrufen. Auf der Fortbildung. Mein Herz klopft.");
  await World.call("hoffmann_anruf");
});
scene("hoffmann_anruf", async () => {
  Audio_.me("phone");
  const p = UI.paper("Anruf: Frau Hoffmann", "<c3=60D080,103020>Verbunden</c3>", "phone");
  try {
    await say("Frau Hoffmann", "Hoffmann?");
    await Typing.task({ speaker: "Frau Hoffmann", prompt: "Erkläre kurz dein Problem: Du brauchst ihre Unterschrift auf der Erklärung, weil dein Termin am Montag ist.\n<span class=sub>(… weil mein Termin am Montag ist.)</span>",
      answers: ["Ich brauche Ihre Unterschrift auf der Erklärung, weil mein Termin bei der Ausländerbehörde am Montag ist."], mode: "sentence", place: "bottom", label: "Telefon · B1", pts: 10,
      need: [["brauche"], ["unterschrift", "unterschreiben"], ["weil", "denn"], ["montag"]], tips: ["»Ich brauche …«", "Was brauchst du? Ihre U…", "Begründe: »… weil …«", "Wann ist der Termin? Am M…"] });
    await say("Frau Hoffmann", "Ach du meine Güte, die Ausländerbehörde. Natürlich! Ich bin Freitagmorgen zurück. Kommen Sie um acht in mein Büro, dann unterschreibe ich sofort.");
    await say("Frau Hoffmann", "Und, Frau {nachname}: Gut, dass Sie angerufen haben. Viele trauen sich nicht. Die warten bis zur letzten Minute.");
  } finally { p.close(); }
  giveSkill("telefon");
  set("hoffmann_freitag");
  await UI.tone(0.7, 0.4);
  await narr("Freitag, 8:00 Uhr.");
  await UI.tone(0, 0.4);
  await say("Frau Hoffmann", "So. Unterschrieben, gestempelt, kopiert. Und eine Kopie für Sie. Für Ihren Ordner.");
  doc("erklaerung");
  step("q_aufenthalt", "arbeitgeber");
  friend("hoffmann", 1);
  await think("Alles komplett. Acht von acht. Und trotzdem habe ich Angst vor Montag.");
});
scene("hoffmann_ep8", async () => {
  if (hasDoc("erklaerung")) await say("Frau Hoffmann", "Alles unterschrieben. Viel Glück am Montag – Sie schaffen das.");
  else await say("Frau Hoffmann", "Frau {nachname}? Brauchen Sie etwas? Sprechen Sie mit Herrn Kaiser, er kümmert sich um die Papiere.");
});

// Freunde machen Mut
scene("wagner_ep8", async () => {
  if (flag("wagner_mut")) { await say("Herr Wagner", "Montag, neun Uhr. Ich habe es mir notiert. Für alle Fälle."); return; }
  set("wagner_mut");
  await say("Herr Wagner", "Sie sehen besorgt aus. Ist es die Behörde?");
  await say(ME, "Die Ausländerbehörde. Am Montag. Ich habe Angst, dass etwas fehlt.");
  await say("Herr Wagner", "Ich war 41 Jahre bei der Post. Halb Beamter. Ich spreche Amtsdeutsch fließend. Soll ich mitkommen?");
  const i = await ask(ME, "(Was sage ich?)", ["Danke, Herr Wagner. Aber ich möchte das allein schaffen.", "Ja, bitte! Das wäre sehr nett."]);
  learn("mut");
  if (i === 0) {
    points(8, "Mut");
    await say("Herr Wagner", "…Richtig so. Aber ich warte draußen auf der Bank. Nur so. Ich gehe sowieso gern spazieren. Montags. Um neun.");
  } else {
    await say("Herr Wagner", "Gut. Ich komme mit. Aber Sie sprechen. Ich halte nur den Ordner. Ich bin gut im Ordnerhalten.");
    set("wagner_begleitet");
  }
  friend("wagner", 1);
});
scene("yara_ep8", async () => {
  await say("Yara", "Ausländerbehörde? Komm, setz dich. Tee.");
  await say("Yara", "Bei meinem ersten Termin habe ich so gezittert, dass ich meinen eigenen Namen falsch geschrieben habe. Der Sachbearbeiter hat gelacht. Nicht böse. Er hat gesagt: »Das passiert jeden Tag.«");
  await say("Yara", "Weißt du, was mir geholfen hat? Ich habe mir vorher den ersten Satz aufgeschrieben. Nur den ersten. Der Rest kam dann.");
  await Typing.task({ speaker: "Yara", prompt: "Schreib dir deinen ersten Satz für Montag auf.\n<span class=sub>(Zum Beispiel: »Guten Morgen, ich habe einen Termin um 9 Uhr wegen meiner Aufenthaltserlaubnis.«)</span>",
    answers: ["Guten Morgen, ich habe einen Termin um 9 Uhr wegen meiner Aufenthaltserlaubnis."], mode: "sentence", place: "top", label: "Mein erster Satz", pts: 8,
    need: [["termin"], ["9", "neun"], ["aufenthaltserlaubnis", "aufenthalt"]], tips: ["Was hast du? Einen T…", "Um wie viel Uhr?", "Weswegen? Wegen meiner A…"] });
  await say("Yara", "Perfekt. Mit »wegen« und Genitiv. Die Beamten werden denken, du bist Juristin.");
  friend("yara", 1);
  set("yara_mut");
});

// ------------------------------------------------------------------------------
// Ausländerbehörde
// ------------------------------------------------------------------------------
scene("abh_zu", async () => {
  if (ep() < 8) { await narr("Stadt Köln · Ausländerbehörde · Kundenzentrum für Ausländerangelegenheiten"); return; }
  await narr("Ausländerbehörde. »Nur mit Termin.«");
  if (!flag("abh_termin")) await think("Ich brauche zuerst einen Termin. Auf dem Laptop zu Hause.");
  else if (!hasDoc("erklaerung") || !hasDoc("gehaltsabrechnung")) await think("Mir fehlen noch Unterlagen vom Arbeitgeber. Erst zur Personalabteilung im Klinikum!");
});
scene("abh_start", async () => {
  set("abh_drin");
  Audio_.bgm("Cave");
  if (flag("wagner_begleitet")) { await narr("Herr Wagner setzt sich im Flur auf einen Stuhl. Er hält meinen Ordner wie einen Schatz."); }
  else if (flag("wagner_mut")) { await narr("Draußen auf der Bank sitzt Herr Wagner. »Zufällig.« Er tut so, als würde er Zeitung lesen."); }
  await narr("Ein langer Flur. Viele Stühle, viele Menschen. Niemand redet laut. Ein Kind malt. Eine Frau betet leise.");
  await narr("Eine Anzeige: <b>Zimmer 214 – Bitte warten Sie, bis Sie aufgerufen werden.</b>");
  step("q_aufenthalt", "termin_abh");
});
scene("abh_anzeige", async () => {
  await narr("<b>Zimmer 214</b> · Aufgerufen: 214-06");
  if (!flag("abh_aufgerufen")) {
    if (count("abh_warten") >= 2) { Audio_.se("tab_end", 0.9); await say("Anzeige", "♪ <b>214-07</b> bitte in <b>Zimmer 214</b>. ♪"); set("abh_aufgerufen"); }
    else await think("Ich bin 214-07. Gleich bin ich dran. Ich atme. Ein. Aus.");
  }
});
scene("abh_wartende", async () => {
  face();
  await say("Wartende", "Ich bin zum dritten Mal hier. Jedes Mal fehlte ein anderes Papier. Heute habe ich alles. Glaube ich.");
  await say("Wartende", "Viel Glück. Wir brauchen alle Glück hier.");
  count("abh_warten");
});
scene("abh_wartender", async () => {
  face();
  await say("Wartender", "Ich bin Ingenieur. Seit sechs Jahren in Köln. Ich zahle Steuern, ich spreche Deutsch – und ich habe trotzdem jedes Mal Angst vor diesem Flur.");
  count("abh_warten");
});
scene("abh_vater", async () => {
  face();
  await say("Kind", "Mein Papa versteht nicht alles. Ich übersetze für ihn. Ich bin neun. Ich kann schon »Aufenthaltserlaubnis« schreiben.");
  await say("Vater", "(lächelt und legt die Hand auf die Schulter des Kindes)");
  count("abh_warten");
});
scene("schmitz", async () => {
  face(ev("Herr Schmitz"));
  if (stepDone("q_aufenthalt", "fiktion")) { await say("Herr Schmitz", "Den Bescheid zum Anerkennungsverfahren bitte innerhalb von vier Wochen nachreichen. Auf Wiedersehen, Frau {nachname}."); return; }
  if (!flag("abh_aufgerufen")) { await say("Herr Schmitz", "Bitte warten Sie draußen, bis Ihre Nummer aufgerufen wird."); count("abh_warten"); return; }
  await say("Herr Schmitz", "Guten Morgen. Nehmen Sie Platz. Schmitz.");
  const i = await ask(ME, "(Mein erster Satz…)", [
    flag("yara_mut") ? "Guten Morgen, ich habe einen Termin um 9 Uhr wegen meiner Aufenthaltserlaubnis." : "Guten Morgen. Ich habe einen Termin. Wegen der Aufenthaltserlaubnis.",
    "Ich… äh… Visum… Ende?",
  ], -1, { correct: 0 });
  if (i === 1) { await say("Herr Schmitz", "Ganz ruhig. Sie sind wegen der Verlängerung hier, ja? Ihr Visum läuft am 30.11. ab."); await say(ME, "Ja. Entschuldigung. Ich bin nervös."); await say("Herr Schmitz", "Das sind alle hier. Ich auch, manchmal. Wegen der Akten."); }
  else points(8, "souverän");
  await say("Herr Schmitz", "Was ist der Zweck Ihres Aufenthalts?");
  const j = await ask(ME, "(Was antworte ich?)", [
    "Ich arbeite als Pflegekraft im St.-Marien-Klinikum. Mein Diplom wird gerade anerkannt.",
    "Arbeiten.",
  ], -1, { correct: 0 });
  if (j === 1) { await say("Herr Schmitz", "Arbeiten. Als was, wo?"); await say(ME, "Als Pflegekraft. Im St.-Marien-Klinikum."); }
  await say("Herr Schmitz", "Dann bräuchte ich jetzt Ihre Unterlagen.");
  const docs = [["reisepass", "yes"], ["passfotos", "yes"], ["meldebescheinigung_koeln", "yes"], ["mietvertrag_koeln", "yes"], ["arbeitsvertrag", "yes"],
    ["gesundheitskarte", "yes"], ["gehaltsabrechnung", "yes"], ["erklaerung", "yes"],
    ["kurs_b1", "ok", "Die Kursbestätigung nehme ich gerne mit in die Akte. Deutschkenntnisse sind immer gut."],
    ["steuer_id", "ok", "Die Steuer-ID haben wir schon. Aber gut, dass Sie alles dabeihaben."]];
  if (hasDoc("dienstplan")) docs.push(["dienstplan", "no", "Ihren Dienstplan brauche ich nicht. Ich glaube Ihnen, dass Sie arbeiten."]);
  const miss = await Mini.pickDocs("Herr Schmitz", "Welche Unterlagen geben Sie ab?", docs);
  if (miss.length) { await say("Herr Schmitz", "Mir fehlt noch: " + miss.map(k => SR.DOCUMENTS[k].name).join(", ") + "."); await say(ME, "Oh – Entschuldigung, hier."); }
  se("pc", 0.8); await wait(0.6);
  await say("Herr Schmitz", "Hm. Pass, Foto, Meldebescheinigung, Mietvertrag, Arbeitsvertrag, Krankenversicherung, Gehaltsabrechnungen, Erklärung des Arbeitgebers…");
  await say("Herr Schmitz", "Und der Bescheid über Ihr Anerkennungsverfahren? Von der Bezirksregierung?");
  await exclaim(player());
  await say(ME, "Der… Bescheid? Der steht nicht auf der Checkliste!");
  await say("Herr Schmitz", "Nein. Das ist ein Fehler in unserer Checkliste. Bei Pflegekräften brauchen wir ihn trotzdem. Ich sage das hier zehnmal am Tag.");
  await think("Mein Herz bleibt stehen. Ein Dokument fehlt. Jetzt muss ich gehen. Jetzt ist alles vorbei.");
  const k = await ask(ME, "(Ruhig bleiben. Was sage ich?)", [
    "Ich habe alle Unterlagen von der Checkliste dabei. Den Bescheid kann ich so schnell wie möglich nachreichen. Ist das möglich?",
    "Dann gehe ich jetzt wohl besser.",
    "Das ist unfair! Das steht nicht auf der Liste!",
  ], -1, { correct: 0 });
  learn("nachreichen");
  if (k === 0) { points(12, "ruhig und sachlich"); await say("Herr Schmitz", "Ja. Genau das wollte ich Ihnen vorschlagen."); }
  else if (k === 1) await say("Herr Schmitz", "Nein, nein. Bleiben Sie sitzen. Das kriegen wir hin. Sie können den Bescheid nachreichen.");
  else { await say("Herr Schmitz", "Sie haben recht, die Liste ist nicht gut. Ich gebe das weiter. Versprochen. Und jetzt lösen wir Ihr Problem: Sie reichen den Bescheid nach."); }
  await say("Herr Schmitz", "Ihr Antrag ist rechtzeitig gestellt. Deshalb bekommen Sie heute eine Fiktionsbescheinigung. Damit gilt Ihr Aufenthalt als erlaubt, bis wir entschieden haben. Sie dürfen weiter arbeiten.");
  learn("fiktionsbescheinigung");
  se("buy", 0.8); await wait(0.5);
  doc("fiktion");
  step("q_aufenthalt", "fiktion");
  await say("Herr Schmitz", "Den Bescheid schicken Sie mir bitte innerhalb von vier Wochen. Per Post oder E-Mail. Dann bekommen Sie Ihren elektronischen Aufenthaltstitel.");
  const l = await ask(ME, "(…)", ["Vielen Dank, Herr Schmitz. Sie haben mir sehr geholfen.", "Danke."]);
  if (l === 0) await say("Herr Schmitz", "…Das sagen hier nicht viele. Danke Ihnen. Und viel Erfolg in der Pflege. Meine Mutter liegt im Heim. Ich weiß, was Sie leisten.");
  diary("d_abh", "Ausländerbehörde. Ein Dokument hat gefehlt – eins, das nicht auf der Liste stand. Ich hatte Angst. Aber ich bin ruhig geblieben und habe gefragt, ob ich es nachreichen kann. Ich darf bleiben. Erst mal. Herr Schmitz hat eine Mutter im Heim.");
  await World.call("abh_danach");
});
scene("abh_danach", async () => {
  set("abh_fertig");
  await transfer("ehrenfeld", 6, 33, 2);
  Audio_.bgm("Route 2");
  if (flag("wagner_mut") || flag("wagner_begleitet")) {
    await narr("Draußen wartet Herr Wagner. Er steht auf, als er mich sieht.");
    await say("Herr Wagner", "Und?");
    await say(ME, "Ich darf bleiben. Vorerst. Ein Dokument muss ich nachreichen.");
    await say("Herr Wagner", "…Gut. Sehr gut. Das ist… sehr gut.");
    await narr("Er räuspert sich. Zweimal.");
    await say("Herr Wagner", "Dann gibt es heute Abend Kuchen. Bei mir. Ich habe gebacken. Zufällig.");
    friend("wagner", 1);
  }
  await narr("Ich rufe in der Klinik an. Frau Hoffmann besorgt den Bescheid noch am selben Tag bei der Bezirksregierung – »Ich kenne da jemanden.«");
  doc("anerkennung_bescheid");
  await UI.tone(1, 0.6);
  await narr("Fünf Wochen später.");
  await UI.tone(0, 0.6);
  await narr("Im Briefkasten: »Ihr elektronischer Aufenthaltstitel liegt zur Abholung bereit.«");
  await narr("Eine kleine Plastikkarte. Mit meinem Gespenster-Foto. Aufenthaltserlaubnis. Erwerbstätigkeit gestattet.");
  doc("eat");
  learn("aufenthaltstitel");
  takeDoc("fiktion");
  step("q_aufenthalt", "eat");
  finish("q_aufenthalt", 50);
  await think("Eine Plastikkarte. Und doch so viel mehr. Ich darf hier sein. Ich darf hier arbeiten. Ich darf hier leben.");
  diary("d_ep8", "Ich habe meinen Aufenthaltstitel. Ich habe zwei Tage nicht gut geschlafen, eine formelle E-Mail geschrieben, Frau Hoffmann auf ihrer Fortbildung angerufen und bei Herrn Schmitz ruhig nach einer Lösung gefragt. Und Herr Wagner hat Kuchen gebacken. Zufällig.");
  await finishEpisode(8, 30);
});
