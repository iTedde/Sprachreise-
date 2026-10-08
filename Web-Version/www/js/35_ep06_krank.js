// Sprachreise – Episode 6: Krank in Köln (Bürokratie) · Köln-Ehrenfeld
// Deutschland: Krankmeldung, Gesundheitskarte, Hausarzt, Rezept, Apotheke, Zuzahlung, eAU
// Deutsch: Symptome beschreiben, sich krankmelden, Anweisungen verstehen (»dreimal täglich nach dem Essen«)
// Menschen: Frau Özdemir, Dr. Weber, Yara, Herr Wagner · Veränderung: Sie lernt, um Hilfe zu bitten – und bekommt sie.
"use strict";

Object.assign(SR.WORDS, {
  krankmelden: { de: "sich krankmelden", en: "to call in sick", cat: "Gesundheit", ex: "Ich muss mich heute krankmelden.", pts: 5 },
  krankschreibung: { de: "Krankschreibung", art: "die", en: "sick note", cat: "Gesundheit", ex: "Die Ärztin schreibt mich für eine Woche krank.", note: "Offiziell: Arbeitsunfähigkeitsbescheinigung (AU). Heute meistens elektronisch (eAU)." },
  gesundheitskarte: { de: "Gesundheitskarte", art: "die", en: "health insurance card", cat: "Gesundheit", ex: "Bitte bringen Sie Ihre Gesundheitskarte mit.", note: "Auch: Versichertenkarte, Krankenkassenkarte.", pts: 5 },
  krankenkasse: { de: "Krankenkasse", art: "die", pl: "die Krankenkassen", en: "health insurance fund", cat: "Gesundheit", ex: "Ich bin bei der Krankenkasse RheinGesund versichert." },
  passfoto: { de: "Passfoto", art: "das", pl: "die Passfotos", en: "passport photo", cat: "Behörden", ex: "Für die Karte brauche ich ein biometrisches Passfoto." },
  warteschleife: { de: "Warteschleife", art: "die", en: "telephone queue, hold", cat: "Alltag", ex: "Ich hänge seit zehn Minuten in der Warteschleife." },
  wartezimmer: { de: "Wartezimmer", art: "das", en: "waiting room", cat: "Gesundheit", ex: "Bitte nehmen Sie im Wartezimmer Platz." },
  halsschmerzen: { de: "Halsschmerzen", art: "die (Pl.)", en: "sore throat", cat: "Gesundheit", ex: "Ich habe Halsschmerzen und Fieber." },
  husten: { de: "Husten", art: "der", en: "cough", cat: "Gesundheit", ex: "Seit gestern habe ich Husten." },
  grippe: { de: "Grippe", art: "die", en: "flu", cat: "Gesundheit", ex: "Sie haben eine Grippe. Bitte bleiben Sie im Bett.", note: "Leichter: die Erkältung." },
  rezept: { de: "Rezept", art: "das", pl: "die Rezepte", en: "prescription", cat: "Gesundheit", ex: "Mit dem Rezept gehe ich in die Apotheke.", note: "Achtung: Rezept = auch Kochrezept!" },
  apotheke: { de: "Apotheke", art: "die", pl: "die Apotheken", en: "pharmacy", cat: "Gesundheit", ex: "Die Apotheke ist gleich um die Ecke." },
  zuzahlung: { de: "Zuzahlung", art: "die", en: "co-payment", cat: "Gesundheit", ex: "Die Zuzahlung ist fünf Euro.", note: "Für Medikamente auf Rezept zahlt man meist 5–10 Euro selbst." },
  einnehmen: { de: "einnehmen", en: "to take (medicine)", cat: "Gesundheit", ex: "Nehmen Sie die Tabletten dreimal täglich nach dem Essen ein." },
  gute_besserung: { de: "Gute Besserung!", en: "Get well soon!", cat: "Höflichkeit", ex: "Gute Besserung – und viel Tee!" },
});

Object.assign(SR.QUESTS, {
  q_krank: { title: "Krank in Köln", ep: 6,
    desc: "Fieber, Halsschmerzen, Kopfweh. Ich muss mich krankmelden, zum Arzt gehen – und dann merke ich: Ich habe keine Gesundheitskarte.",
    steps: [["melden", "Mich bei der Arbeit krankmelden"], ["anruf", "In der Arztpraxis anrufen"], ["karte", "Bei der Krankenkasse eine Bescheinigung holen"],
            ["arzt", "Zum Arzt gehen"], ["apotheke", "Das Rezept in der Apotheke einlösen"], ["gesund", "Gesund werden"]] },
});

Object.assign(SR.DOCUMENTS, {
  kk_brief: { name: "Brief der Krankenkasse", short: "»Bitte senden Sie uns ein Lichtbild«",
    text: "RheinGesund · Ihre Krankenkasse\nSehr geehrte Frau {nachname}, für Ihre elektronische Gesundheitskarte benötigen wir ein <b>Lichtbild</b>. Bitte laden Sie es online hoch oder kommen Sie in eine Geschäftsstelle.\n<c3=C03030,F0C0C0>(Ungelesen seit drei Wochen.)</c3>" },
  ersatzbescheinigung: { name: "Ersatzbescheinigung", short: "Krankenkasse RheinGesund – gültig 1 Monat",
    text: "Bescheinigung über das Bestehen der Krankenversicherung\nVersicherte: {name} {nachname}\nVersichertennummer: R123456789\nGültig bis zum Eintreffen der Gesundheitskarte." },
  rezept: { name: "Rezept", short: "Dr. Weber, Hausarztpraxis",
    text: "Kassenrezept\nIbuprofen 400 mg, 20 Stück\nHustensaft, 100 ml\n<c3=707078,D8D8D0>Zuzahlung in der Apotheke.</c3>" },
  gesundheitskarte: { name: "Gesundheitskarte", short: "Endlich da – mit Foto!",
    text: "Elektronische Gesundheitskarte\nRheinGesund\n{name} {nachname}\nVersichertennummer: R123456789\n<c3=707078,D8D8D0>Auf dem Foto sehe ich krank aus. Weil ich krank war.</c3>" },
});

// ------------------------------------------------------------------------------
scene("ep6_vorabend", async () => {
  await UI.tone(0.8, 0.6);
  await narr("Zwei Wochen später. Nach drei Nachtdiensten hintereinander.");
  await narr("Mitten in der Nacht wache ich auf. Mein Hals brennt. Mein Kopf ist heiß. Mir ist kalt und warm gleichzeitig.");
  await UI.tone(0, 0.6);
});
scene("ep6_start", async () => {
  set("ep6_started");
  await UI.episodeCard(6, "Fieber, Formulare, Warteschleife.\nKrank sein in Deutschland – mit Papieren.");
  Audio_.bgm("Radio - Lullaby");
  quest("q_krank");
  learn("halsschmerzen");
  await narr("6:00 Uhr. Das Thermometer zeigt <b>39,1 °C</b>.");
  await think("Ich habe um 6 Uhr Frühdienst. Jetzt. Ich kann nicht. Ich muss mich krankmelden.");
  learn("krankmelden");
  await sms("Station 3B – Herr Brückner", [{ from: "Herr Brückner", text: "Guten Morgen, Frau {nachname}! Sind Sie unterwegs? Die Übergabe beginnt gleich." }],
    { prompt: "Schreib Herrn Brückner, dass du krank bist und heute nicht arbeiten kannst.\n<span class=sub>(Höflich, mit »Sie«. Zum Beispiel: »… und kann heute nicht arbeiten.«)</span>",
      answers: ["Guten Morgen, Herr Brückner. Ich bin krank und kann heute nicht arbeiten.", "Ich bin krank und kann heute nicht arbeiten."], mode: "sentence",
      need: [["krank"], ["kann", "könnte"], ["nicht"], ["arbeiten", "kommen"]], tips: ["Was bist du? k…", "Benutze »kann«: Ich kann …", "Du kannst heute NICHT …", "Was kannst du nicht? arbeiten"] },
    [{ from: "Herr Brückner", text: "Danke für die Info. Gute Besserung! 🍵 Bitte gehen Sie heute zum Arzt – bei uns brauchen wir die Krankschreibung ab dem ersten Tag. Die kommt heute elektronisch, die Praxis macht das." }]);
  step("q_krank", "melden");
  learn("krankschreibung", "gute_besserung");
  await think("Zum Arzt. Ich habe noch keinen Hausarzt. Aga hat mir die Praxis von Dr. Weber empfohlen, in der Venloer Straße.");
  await World.call("praxis_anruf");
});

scene("praxis_anruf", async () => {
  Audio_.me("phone");
  const p = UI.paper("Anruf: Hausarztpraxis Dr. Weber", "<c3=60D080,103020>Verbunden</c3>", "phone");
  try {
    learn("warteschleife");
    await say("Ansage", "♪ Herzlich willkommen in der Praxis Dr. Weber. Alle Leitungen sind belegt. Bitte haben Sie etwas Geduld. ♪");
    await narr("♪ Dü-dü-düüü, dü-dü-dü ♪ (Eine sehr fröhliche Melodie. Zu fröhlich für 39 Grad Fieber.)");
    await say("Ansage", "♪ Sie sind der Nächste in der Warteschleife. ♪");
    await narr("♪ Dü-dü-düüü, dü-dü-dü ♪");
    await say("Ansage", "♪ Sie sind der Nächste in der Warteschleife. ♪");
    await think("Ich bin seit sieben Minuten »der Nächste«.");
    await say("Frau Lang", "Praxis Dr. Weber, Lang, guten Morgen?");
    const i = await ask(ME, "(Was sage ich?)", ["Guten Morgen. Ich bin krank. Ich habe Fieber und Halsschmerzen. Kann ich heute kommen?", "Hilfe… krank…"], -1, { correct: 0 });
    if (i === 1) await say("Frau Lang", "Oje. Ganz ruhig. Sie sind krank? Haben Sie Fieber?");
    await say("Frau Lang", "Sind Sie schon Patientin bei uns?");
    await say(ME, "Nein, ich bin neu.");
    await say("Frau Lang", "Dann kommen Sie heute um 11:15 Uhr. Und bringen Sie bitte Ihre Gesundheitskarte mit.");
    learn("gesundheitskarte");
    await say(ME, "Meine… Gesundheitskarte?");
    await say("Frau Lang", "Die Versichertenkarte. Von Ihrer Krankenkasse. Bis später!");
  } finally { p.close(); }
  step("q_krank", "anruf");
  await think("Gesundheitskarte. Ich habe keine Gesundheitskarte. Ich habe… einen Brief von der Krankenkasse. Ungelesen. Auf dem Tisch.");
  doc("kk_brief", true);
  await UI.withPaper("RheinGesund · Ihre Krankenkasse", "Sehr geehrte Frau {nachname},\n\nherzlich willkommen bei RheinGesund! Für Ihre elektronische Gesundheitskarte benötigen wir noch ein <b>aktuelles Lichtbild</b>.\n\nBitte laden Sie Ihr Foto online hoch <b>oder</b> besuchen Sie unsere Geschäftsstelle in der Venloer Straße.\n\nBis Sie Ihre Karte haben, erhalten Sie in der Geschäftsstelle eine <b>Ersatzbescheinigung</b>.", "letter", async () => {
    await Mini.quiz([
      { q: "Was will die Krankenkasse von mir?", o: ["Ein Foto", "Geld", "Meinen Pass"], a: 0, why: "»Lichtbild« ist ein altes Wort für Foto." },
      { q: "Was bekomme ich, bis die Karte da ist?", o: ["Eine Ersatzbescheinigung", "Nichts", "Eine Rechnung"], a: 0, why: "Da steht: »… erhalten Sie in der Geschäftsstelle eine Ersatzbescheinigung.«" },
    ], 5);
  });
  learn("krankenkasse", "passfoto");
  await think("Erst zur Krankenkasse, dann zum Arzt. Die Krankenkasse ist an der Venloer Straße, das blaue Haus. Mit 39 Grad. Ich schaffe das.");
});

scene("kk_zu", async () => { await narr("RheinGesund · Geschäftsstelle Ehrenfeld."); });
scene("praxis_zu", async () => { await narr("Hausarztpraxis Dr. Weber · Allgemeinmedizin. Sprechzeiten Mo–Fr 8–12 Uhr."); });
scene("apotheke_zu", async () => { await narr("Venloer Apotheke. Ein grünes Kreuz leuchtet."); });

scene("kk_schalter", async () => {
  face(ev("Frau Özdemir"));
  if (ep() !== 6 || stepDone("q_krank", "karte")) { await say("Frau Özdemir", "Ihre Karte kommt in etwa zwei Wochen. Gute Besserung!"); return; }
  await say("Frau Özdemir", "Guten Morgen! Oh – Sie sehen nicht gut aus. Setzen Sie sich. Was kann ich für Sie tun?");
  await say(ME, "Ich habe keine Gesundheitskarte. Sie haben mir einen Brief geschrieben. Wegen eines Fotos. Ich habe ihn… zu spät gelesen.");
  await say("Frau Özdemir", "Ah, das Lichtbild. Das passiert ganz oft! Umzug, neue Arbeit, und dann liegt der Brief unter der Pizzawerbung.");
  await say("Frau Özdemir", "Wir haben da hinten einen Fotoautomaten. Machen Sie schnell ein Foto, dann bekommen Sie heute eine Ersatzbescheinigung.");
  set("foto_noetig");
});
scene("fotoautomat", async () => {
  if (!flag("foto_noetig") || flag("foto_ok")) { await narr("Ein Fotoautomat. »Biometrische Passfotos – 6 Euro«."); return; }
  await narr("Fotoautomat · <b>Biometrisches Passfoto</b>");
  await Mini.quiz([
    { q: "Wie schaue ich auf einem biometrischen Foto?", o: ["Neutral, Mund zu, gerade in die Kamera", "Mit einem großen Lächeln", "Seitlich, wie ein Model"], a: 0,
      why: "Biometrisch heißt: neutral, gerade, Mund geschlossen. Lächeln verboten. Sehr deutsch." },
    { q: "Was mache ich mit meinen Haaren?", o: ["Aus dem Gesicht", "Ins Gesicht – sieht cooler aus", "Egal"], a: 0, why: "Augen und Gesicht müssen gut zu sehen sein." },
  ], 4);
  se("pc", 0.8); await wait(0.5);
  await narr("Blitz! Vier Fotos. Ich sehe aus wie ein Gespenst mit Fieber. Aber biometrisch korrekt.");
  set("foto_ok");
  await say("Frau Özdemir", "(ruft) Fertig? Bringen Sie mir eins!");
  await World.call("kk_bescheinigung");
});
scene("kk_bescheinigung", async () => {
  await say("Frau Özdemir", "So, das Foto scanne ich ein. Ich brauche nur noch Ihre Versichertennummer. Sie steht oben im Brief.");
  await Typing.task({ speaker: "Frau Özdemir", prompt: "Deine Versichertennummer steht im Brief: <b>R123456789</b>", answers: ["R123456789"], mode: "word", place: "top", label: "Nummer", pts: 3,
    validate: v => v.replace(/\s/g, "").toUpperCase() === "R123456789" ? { ok: true, perfect: true } : null, hints: ["R1234…", "R123456789"] });
  se("pc", 0.8); await wait(0.4);
  await say("Frau Özdemir", "Hier ist Ihre Ersatzbescheinigung. Die zeigen Sie in der Praxis. Die Karte kommt in zwei Wochen. Mit diesem… schönen Foto.");
  doc("ersatzbescheinigung");
  step("q_krank", "karte");
  await say("Frau Özdemir", "Und jetzt schnell zum Arzt. Gute Besserung!");
  diary("d_kk", "Ich hatte keine Gesundheitskarte, weil ich ein Foto vergessen habe. Weil ein Brief unter der Pizzawerbung lag. Frau Özdemir sagt, das passiert ganz oft. Das hat mich getröstet. Ein bisschen.");
});
scene("kk_kunde", async () => { face(); await say("Kunde", "Ich bin seit 1981 bei dieser Krankenkasse. Ich habe sieben Karten gehabt. Auf jeder sehe ich älter aus."); });

// ------------------------------------------------------------------------------
// Arztpraxis
// ------------------------------------------------------------------------------
scene("praxis_anmeldung", async () => {
  face(ev("Frau Lang"));
  if (ep() !== 6) { await say("Frau Lang", "Guten Tag! Haben Sie einen Termin?"); return; }
  if (stepDone("q_krank", "arzt")) { await say("Frau Lang", "Die Krankmeldung haben wir elektronisch an Ihre Krankenkasse geschickt. Ihr Arbeitgeber kann sie dort abrufen. Gute Besserung!"); return; }
  if (!stepDone("q_krank", "karte")) {
    await say("Frau Lang", "Frau {nachname}? Haben Sie Ihre Gesundheitskarte dabei?");
    await say(ME, "Nein… noch nicht.");
    await say("Frau Lang", "Ohne Karte oder Bescheinigung kann ich Sie leider nur als Privatpatientin behandeln. Dann bekommen Sie eine Rechnung. Gehen Sie lieber erst zur Krankenkasse – gleich um die Ecke!");
    return;
  }
  if (flag("praxis_angemeldet")) { await say("Frau Lang", "Bitte nehmen Sie noch kurz im Wartezimmer Platz. Dr. Weber ruft Sie auf."); return; }
  await say("Frau Lang", "Frau {nachname}! Haben Sie die Karte?");
  const miss = await Mini.pickDocs("Frau Lang", "Was geben Sie ab?", [["ersatzbescheinigung", "yes"], ["kk_brief", "ok", "Den Brief brauche ich nicht, aber die Bescheinigung ist perfekt."], ["arbeitsvertrag", "no", "Den Arbeitsvertrag brauchen wir hier nicht."]]);
  if (miss.length) { await say("Frau Lang", "Und die Ersatzbescheinigung von der Krankenkasse?"); await say(ME, "Ach ja, hier."); }
  await say("Frau Lang", "Wunderbar. Dann füllen Sie bitte noch kurz den Fragebogen aus.");
  await Mini.form("Patientenfragebogen", [
    { label: "Haben Sie Allergien?", req: true, o: ["Nein", "Ja: Penicillin", "Ja: Pollen"], a: [0, 1, 2], yes: "Wichtig für die Ärztin. Ehrlich antworten!" },
    { label: "Nehmen Sie regelmäßig Medikamente?", req: true, o: ["Nein", "Ja"], a: [0, 1] },
    { label: "Ihre Beschwerden", req: true, type: { prompt: "<b>Beschwerden</b> – was hast du? (Fieber, Halsschmerzen …)", answers: ["Fieber und Halsschmerzen"], mode: "sentence", minWords: 1,
      need: [["fieber", "halsschmerzen", "husten", "kopfschmerzen"]], tips: ["Schreib deine Symptome: Fieber, Halsschmerzen …"] } },
    { label: "Seit wann?", req: true, o: ["Seit heute Nacht", "Seit drei Wochen", "Seit 1998"], a: 0, why: "Das Fieber kam heute Nacht." },
  ], "Ein Fragebogen. Natürlich. Auch mit 39 Grad Fieber.");
  set("praxis_angemeldet");
  learn("wartezimmer");
  await say("Frau Lang", "Danke. Bitte nehmen Sie im Wartezimmer Platz.");
});
scene("wartezimmer1", async () => {
  face();
  await say("Patient", "Ich bin jede Woche hier. Diesmal: Rücken. Letzte Woche: Knie. Nächste Woche: mal sehen. Dr. Weber ist mein Hobby.");
  if (flag("praxis_angemeldet")) set("wartezeit1");
});
scene("wartezimmer2", async () => {
  face();
  await say("Patientin", "Haben Sie auch Grippe? Halten Sie Abstand. Ich habe keine Grippe, aber ich will keine.");
  if (flag("praxis_angemeldet")) set("wartezeit2");
});
scene("zeitschriften", async () => { await narr("Zeitschriften von 2019. »Die besten Diäten für den Sommer.« »Royal Wedding!«"); if (flag("praxis_angemeldet")) set("wartezeit1"); });
scene("behandlung", async () => {
  if (ep() !== 6 || !flag("praxis_angemeldet")) { await narr("Behandlungszimmer 1 · Bitte nicht klopfen, Sie werden aufgerufen."); return; }
  if (stepDone("q_krank", "arzt")) { await narr("Behandlungszimmer 1. Ich muss nicht mehr rein. Zum Glück."); return; }
  if (!flag("wartezeit1") && !flag("wartezeit2")) { await narr("»Bitte warten Sie im Wartezimmer, bis Sie aufgerufen werden.«"); await think("Ich warte noch ein bisschen. Vielleicht spreche ich mit jemandem."); return; }
  Audio_.se("tab_end", 0.8);
  await say("Lautsprecher", "♪ Frau {nachname}, bitte in Zimmer 1. ♪");
  await UI.tone(0.5, 0.3);
  await say("Dr. Weber", "Guten Tag, Frau {nachname}. Ich bin Dr. Weber. Was fehlt Ihnen denn?");
  await Typing.task({ speaker: "Dr. Weber", prompt: "»Was fehlt Ihnen?« – Beschreibe deine Symptome in einem Satz.\n<span class=sub>(Ich habe … und …)</span>", answers: ["Ich habe Fieber und Halsschmerzen."],
    mode: "sentence", place: "top", label: "Beim Arzt", pts: 8, need: [["habe"], ["fieber", "halsschmerzen", "husten"]], tips: ["»Ich habe …«", "Was hast du? Fieber, Halsschmerzen …"] });
  await say("Dr. Weber", "Seit wann?");
  await say(ME, "Seit heute Nacht. Und ich habe auch ein bisschen Husten.");
  learn("husten");
  await say("Dr. Weber", "Mund auf, bitte. »Aaah«.");
  await narr("»Aaaaah.«");
  await say("Dr. Weber", "Hm. Lunge ist frei, Hals ist rot. Das ist eine Grippe. Sie brauchen Ruhe. Viel Tee, viel Schlaf. Und: Arbeiten ist verboten.");
  learn("grippe");
  await say("Dr. Weber", "Ich schreibe Sie für eine Woche krank. Die Krankschreibung geht elektronisch an Ihre Krankenkasse. Ihr Arbeitgeber holt sie sich dort.");
  await say(ME, "Ich muss kein Papier zum Klinikum bringen?");
  await say("Dr. Weber", "Früher gab es den »gelben Schein«. Heute geht das digital. Manchmal ist Deutschland schon im 21. Jahrhundert. Manchmal.");
  await say("Dr. Weber", "Und hier ist ein Rezept. Ibuprofen gegen das Fieber und einen Hustensaft. Die Apotheke ist gleich gegenüber.");
  doc("rezept");
  learn("rezept");
  await Mini.quiz([{ speaker: "Dr. Weber", q: "Wie lange sind Sie krankgeschrieben?", o: ["Eine Woche", "Einen Tag", "Einen Monat"], a: 0, why: "»Ich schreibe Sie für eine Woche krank.«" }], 4);
  await UI.tone(0, 0.3);
  step("q_krank", "arzt");
});

// ------------------------------------------------------------------------------
// Apotheke – Yara
// ------------------------------------------------------------------------------
scene("yara", async () => {
  face(ev("Yara"));
  if (ep() === 8 && flag("abh_termin") && !flag("yara_mut")) { await World.call("yara_ep8"); return; }
  if (ep() !== 6 || stepDone("q_krank", "apotheke")) { await say("Yara", ep() === 6 ? "Gute Besserung! Und denken Sie an den Tee." : "Hallo, {name}! Schön, dich zu sehen. Gesund? Gut!"); return; }
  if (!hasDoc("rezept")) { await say("Yara", "Guten Tag! Ohne Rezept kann ich Ihnen nur Tee und Halsbonbons geben. Waren Sie schon beim Arzt?"); return; }
  learn("apotheke");
  await say("Yara", "Guten Tag! Ah, ein Rezept von Dr. Weber. Grippe? Sie Arme. Einen Moment.");
  await narr("Sie holt zwei Packungen aus einer Schublade. Hinter ihr hängt ein Zertifikat: »Approbation als Apothekerin – Yara Al-Khatib«.");
  await say("Yara", "Das macht fünf Euro. Das ist die Zuzahlung. Den Rest bezahlt Ihre Krankenkasse.");
  learn("zuzahlung");
  learn("einnehmen");
  await say("Yara", "Die Tabletten: dreimal täglich eine, nach dem Essen. Den Hustensaft: abends einen Löffel. Und viel trinken.");
  await Mini.quiz([
    { speaker: "Yara", q: "Wie oft nehme ich die Tabletten?", o: ["Dreimal täglich", "Einmal pro Woche", "Wenn ich Lust habe"], a: 0, why: "»Dreimal täglich« = dreimal am Tag." },
    { speaker: "Yara", q: "Wann nehme ich sie?", o: ["Nach dem Essen", "Vor dem Schlafen, ohne Essen", "Mit Kaffee"], a: 0, why: "»Nach dem Essen« – sonst tut der Magen weh." },
  ], 5);
  step("q_krank", "apotheke");
  await say("Yara", "Sie sind nicht von hier, oder? Ihr Akzent… Ich auch nicht. Ich komme aus Damaskus. Seit 2015 in Köln.");
  const i = await ask(ME, "(…)", ["Waren Sie in Syrien auch Apothekerin?", "Wie lange haben Sie Deutsch gelernt?"]);
  if (i === 0) await say("Yara", "Zehn Jahre. Und hier musste ich fast alles noch einmal machen: Sprache, Prüfung, Praktikum. Fünf Jahre. Aber jetzt steht mein Name da an der Wand.");
  else await say("Yara", "Ich lerne immer noch. Jeden Tag ein neues Wort. Heute: »Zuzahlungsbefreiung«. Ein schönes Wort. Sehr lang.");
  if (SR.origin() === "ar") await say("Yara", "…Sprechen Sie Arabisch? <bdi>الحمد لله على السلامة</bdi> – gute Besserung, wie man bei uns sagt. Aber jetzt: Deutsch üben! Hihi.");
  await say("Yara", "Wenn Sie gesund sind, kommen Sie mal auf einen Tee vorbei. Ohne Rezept.");
  friend("yara", 2);
  diary("d_yara", "Die Apothekerin heißt Yara. Sie kommt aus Damaskus und musste in Deutschland fast alles noch einmal lernen. Fünf Jahre. Jetzt steht ihr Name an der Wand. Ich will das auch: Meinen Namen an einer Wand. Als Pflegefachkraft.");
  set("wagner_suppe");
  await think("Jetzt nach Hause. Ins Bett. Und nie wieder einen Brief unter der Pizzawerbung vergessen.");
});
scene("apo_regal", async () => { await narr("Halsbonbons, Hustentee, Pflaster. Und ein Schild: »Bitte beraten Sie sich – wir helfen gern!«"); });

// ------------------------------------------------------------------------------
// Zuhause: Herr Wagner bringt Suppe
// ------------------------------------------------------------------------------
scene("wagner_besuch", async () => {
  face(ev("Herr Wagner"));
  set("wagner_suppe_done");
  await say("Herr Wagner", "Frau {nachname}. Ich habe gehört, Sie sind krank. Die Wände sind dünn. Sie husten seit gestern.");
  await say("Herr Wagner", "Hier. Hühnersuppe. Nach dem Rezept meiner Frau. Sie war Krankenschwester. 38 Jahre. Im Klinikum. Station 3.");
  await exclaim(player());
  await say(ME, "Ihre Frau war Krankenschwester? Im St.-Marien-Klinikum?");
  await say("Herr Wagner", "Ja. Station 3. Damals hieß es noch »Schwester«. Heute »Pflegefachkraft«. Das Wort ist länger. Die Arbeit ist dieselbe.");
  const i = await ask(ME, "(…)", ["Das wusste ich nicht. Danke, Herr Wagner. Für die Suppe – und für die Geschichte.", "Danke für die Suppe!"], -1, { correct: 0 });
  if (i === 0) points(6, "von Herzen");
  await say("Herr Wagner", "Gute Besserung. Den Topf bitte bis Freitag zurück. Gespült.");
  await narr("Er geht. Und dreht sich an der Tür noch einmal um.");
  await say("Herr Wagner", "…Sie machen das gut. Hier in Köln. Das wollte ich nur sagen.");
  friend("wagner", 1);
  await World.call("ep6_ende");
});
scene("ep6_ende", async () => {
  await sms("Aga 💪", [{ from: "Aga", text: "Schätzchen!! Brückner sagt, du hast Grippe 🤒 Gute Besserung!! Trink Tee. Schlaf. Keine Dienste tauschen!!" }],
    { prompt: "Antworte Aga: Danke! Und dass es dir schon besser geht.", answers: ["Danke! Mir geht es schon besser.", "Danke, Aga! Mir geht es schon ein bisschen besser."], mode: "sentence",
      need: [["danke"], ["besser"]], tips: ["Fang an mit »Danke!«", "Wie geht es dir? Schon b…"] },
    [{ from: "Aga", text: "Gut! Frau Engel fragt jeden Tag nach dir. Sie sagt: »Et hätt noch immer jot jejange« 😄" }]);
  await UI.tone(1, 0.8);
  await narr("Eine Woche Tee, Suppe und Schlaf.");
  await narr("Dann liegt ein Brief im Briefkasten: meine Gesundheitskarte. Mit dem Gespenster-Foto.");
  await UI.tone(0, 0.8);
  doc("gesundheitskarte");
  takeDoc("ersatzbescheinigung");
  step("q_krank", "gesund");
  finish("q_krank", 35);
  diary("d_ep6", "Krank sein in Deutschland: krankmelden, Warteschleife, Krankenkasse, Fotoautomat, Fragebogen, Wartezimmer, Rezept, Apotheke. Und dann: Hühnersuppe von Herrn Wagner. Seine Frau war Krankenschwester. Auf meiner Station. Die Welt ist klein. Köln auch.");
  await finishEpisode(6, 20);
  await World.call("ep7_vorabend");
});
