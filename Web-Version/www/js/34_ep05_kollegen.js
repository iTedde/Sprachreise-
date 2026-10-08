// Sprachreise – Episode 5: Kollegen & Kölsch (Alltag, Arbeit, Soziales) · Köln
// Deutschland: Arbeitsalltag in der Pflege, Dienstplan, Kölsch-Kultur, Pakete beim Nachbarn
// Deutsch: Übergabe-Wortschatz, Patienten fragen, im Café bestellen (B1-Satz), Dankeskarte schreiben
// Menschen: Aga, Herr Brückner, Frau Engel, Herr Wagner, Luca · Veränderung: Sie ist nicht mehr nur neu – sie gehört zum Team.
"use strict";

Object.assign(SR.WORDS, {
  uebergabe: { de: "Übergabe", art: "die", en: "handover (shift change)", cat: "Pflege", ex: "Bei der Übergabe erzählt der Frühdienst alles dem Spätdienst.", pts: 5 },
  fieber: { de: "Fieber", art: "das", en: "fever", cat: "Pflege", ex: "Herr Demir hat 38,5 Grad Fieber." },
  blutdruck: { de: "Blutdruck", art: "der", en: "blood pressure", cat: "Pflege", ex: "Ich messe jetzt Ihren Blutdruck." },
  schmerzen: { de: "Schmerzen", art: "die (Pl.)", en: "pain", cat: "Pflege", ex: "Haben Sie Schmerzen?" },
  dienstplan: { de: "Dienstplan", art: "der", pl: "die Dienstpläne", en: "duty roster", cat: "Arbeit", ex: "Laut Dienstplan habe ich morgen Frühdienst." },
  fruehdienst: { de: "Frühdienst", art: "der", en: "early shift", cat: "Arbeit", ex: "Der Frühdienst beginnt um 6 Uhr.", note: "Spätdienst: nachmittags · Nachtdienst: nachts" },
  feierabend: { de: "Feierabend", art: "der", en: "end of the working day", cat: "Arbeit", ex: "Endlich Feierabend!", note: "Sehr deutsches Wort. Sehr schönes Gefühl." },
  kollegin: { de: "Kollegin", art: "die", pl: "die Kolleginnen", en: "colleague (female)", cat: "Arbeit", ex: "Aga ist meine Kollegin.", note: "männlich: der Kollege" },
  paket: { de: "Paket", art: "das", pl: "die Pakete", en: "parcel", cat: "Alltag", ex: "Ihr Paket ist beim Nachbarn." },
  benachrichtigung: { de: "Benachrichtigungskarte", art: "die", en: "delivery notice card", cat: "Alltag", ex: "Im Briefkasten war eine Benachrichtigungskarte.", pts: 5 },
  fahrrad: { de: "Fahrrad", art: "das", pl: "die Fahrräder", en: "bicycle", cat: "Freizeit", ex: "Ich möchte ein Fahrrad leihen." },
  leihen: { de: "leihen", en: "to borrow, to rent", cat: "Freizeit", ex: "Kann ich dein Fahrrad leihen?" },
  koebes: { de: "Köbes", art: "der", en: "waiter (Cologne pub)", cat: "Köln", ex: "Der Köbes bringt ein neues Kölsch, bis man den Deckel auf das Glas legt.", note: "Kellner im Kölner Brauhaus. Berühmt für seinen Humor." },
  halver_hahn: { de: "Halve Hahn", art: "der", en: "rye roll with cheese (Cologne)", cat: "Köln", ex: "Einen Halven Hahn, bitte!", note: "Kein halbes Hähnchen! Ein Roggenbrötchen mit Käse, Senf und Zwiebeln.", pts: 5 },
  prost: { de: "Prost!", en: "Cheers!", cat: "Freizeit", ex: "Prost! – Und dabei in die Augen schauen!" },
});

Object.assign(SR.QUESTS, {
  q_erster_tag: { title: "Der erste Arbeitstag", ep: 5,
    desc: "Station 3B im St.-Marien-Klinikum. Herr Brückner stellt mir meine Kollegin vor. Dienstbeginn: 6 Uhr. Frühdienst.",
    steps: [["station", "Zur Station 3B gehen"], ["uebergabe", "Bei der Übergabe zuhören"], ["engel", "Frau Engel versorgen"], ["demir", "Nach Herrn Demir sehen"], ["plan", "Den Dienstplan lesen"]] },
  q_cafe2: { title: "Cappuccino und Kuchen", ep: 5, side: true,
    desc: "Aga wartet im Café »Da Luca«. Diesmal bestelle ich mehr als nur einen Kaffee.",
    steps: [["bestellen", "Cappuccino und Kuchen bestellen"]] },
  q_wagner: { title: "Das Paket beim Nachbarn", ep: 5,
    desc: "Im Briefkasten liegt eine Karte: Mein Paket ist bei »Wagner«. Natürlich.",
    steps: [["karte", "Die Benachrichtigungskarte lesen"], ["abholen", "Das Paket bei Herrn Wagner abholen"], ["danke", "Herrn Wagner eine Dankeskarte schreiben"]] },
  q_radtour: { title: "Fahrradtour am Rhein", ep: 5,
    desc: "Sonntag! Aga und Luca wollen mit mir am Rhein Fahrrad fahren. Treffpunkt: Rheinufer, beim Fahrradverleih.",
    steps: [["leihen", "Ein Fahrrad leihen"], ["bruecke", "Zur Hohenzollernbrücke fahren"], ["kran", "Die Kranhäuser ansehen"], ["biergarten", "Im Biergarten ankommen"]] },
});

Object.assign(SR.DOCUMENTS, {
  dienstplan: { name: "Dienstplan Station 3B", short: "Meine Schichten",
    text: "Dienstplan Station 3B – Woche 1\nMo F · Di F · Mi S · Do S · Fr frei · Sa N · So frei\n<c3=707078,D8D8D0>F = Frühdienst 6–14 Uhr · S = Spätdienst 14–22 Uhr · N = Nachtdienst 22–6 Uhr</c3>" },
});

// ------------------------------------------------------------------------------
scene("ep5_start", async () => {
  await UI.tone(1, 0.6);
  await UI.episodeCard(5, "Kollegen, Kaffee, Kölsch.\nDer erste Arbeitstag – und ein Sonntag am Rhein.");
  await narr("Eine Woche später. Montag, 5:20 Uhr. Draußen ist es noch dunkel.");
  await UI.tone(0, 0.6);
  quest("q_erster_tag");
  await think("Mein erster Arbeitstag. Frühdienst. 6 Uhr. Ich habe dreimal den Wecker kontrolliert.");
  await think("Das Klinikum ist an der Venloer Straße. Die Station ist hinter der Verwaltung – die Tür oben.");
});
scene("ep5_schlafen", async () => { await think("Jetzt schlafen? Ich muss zur Arbeit!"); });

scene("erster_tag", async () => {
  set("erster_tag_start");
  step("q_erster_tag", "station");
  Audio_.bgm("Poke Center");
  await say("Herr Brückner", "Guten Morgen, Frau {nachname}! Pünktlich. Sehr gut. Das ist Agnieszka – alle sagen Aga. Sie arbeitet Sie ein.");
  await say("Aga", "Hallo, Schätzchen! Willkommen auf der 3B. Kaffee gibt es da hinten, Stress gibt es überall.");
  await say("Aga", "Ich komme aus Gdańsk. Danzig. Seit 2012 in Köln. Und du? Woher kommst du?");
  await ask(ME, "(…)", ["Ich komme {aus_land}. Aus {stadt}.", "{stadt}. {land}."]);
  await say("Aga", `${o("land")}! Dann sind wir hier schon zwei Ausländerinnen. Und Herr Brückner ist aus Bayern – also drei.`);
  await say("Herr Brückner", "Bayern ist kein Ausland, Aga.");
  await say("Aga", "Für einen Kölner schon.");
  friend("aga", 1);
  learn("kollegin");
  // Übergabe
  await say("Herr Brückner", "So, Übergabe! Der Nachtdienst erzählt, was in der Nacht passiert ist.");
  learn("uebergabe");
  await UI.withPaper("Übergabe Station 3B · 6:00 Uhr", "<b>Zimmer 1</b> – Frau Engel, 84: Hüfte operiert, gut geschlafen, <b>Schmerzen</b> beim Aufstehen.\n<b>Zimmer 2</b> – Herr Demir, 67: <b>Fieber</b> 38,5 °C seit 3 Uhr. Arzt informiert.\n<b>Zimmer 3</b> – leer, Neuaufnahme gegen 10 Uhr.\nAlle: <b>Blutdruck</b> messen um 7 Uhr.", "paper", async () => {
    await Mini.quiz([
      { speaker: "Herr Brückner", q: "Wer hat Fieber?", o: ["Frau Engel", "Herr Demir", "Zimmer 3"], a: 1, why: "Lies nochmal: Herr Demir, 38,5 °C." },
      { speaker: "Herr Brückner", q: "Was hat Frau Engel?", o: ["Fieber", "Schmerzen beim Aufstehen", "Sie ist neu"], a: 1, why: "Frau Engel: Hüfte operiert, Schmerzen beim Aufstehen." },
      { speaker: "Herr Brückner", q: "Wann messen wir bei allen den Blutdruck?", o: ["Um 7 Uhr", "Um 10 Uhr", "Um 3 Uhr"], a: 0, why: "»Alle: Blutdruck messen um 7 Uhr.«" },
    ], 5);
  });
  learn("fieber", "schmerzen", "blutdruck");
  step("q_erster_tag", "uebergabe");
  await say("Aga", "Gut zugehört! Du gehst zu Frau Engel, ich zu Herrn Demir. Dann tauschen wir. Und dann Kaffee.");
});

scene("aga", async () => {
  face(ev("Aga"));
  if (ep() !== 5) { await say("Aga", ep() >= 6 ? "Schätzchen! Wieder gesund? Nächstes Mal sag früher Bescheid, dann bringe ich Pierogi." : "Na, alles gut?"); return; }
  if (!stepDone("q_erster_tag", "engel")) { await say("Aga", "Frau Engel wartet! Zimmer 1, unten links. Sie mag es, wenn man »Sie« sagt. Und laut spricht."); return; }
  if (!stepDone("q_erster_tag", "demir")) { await say("Aga", "Jetzt Herr Demir, Zimmer 2. Fieber messen, freundlich sein, nicht zu viel reden – er ist müde."); return; }
  if (!stepDone("q_erster_tag", "plan")) { await say("Aga", "Fast geschafft! Schau noch auf den Dienstplan an der Wand. Damit du weißt, wann du wieder leiden darfst. Hihi."); return; }
  if (!flag("erster_tag_done")) await World.call("feierabend");
  else await say("Aga", "Sonntag Radtour! Nicht vergessen. Und morgen früh: Kaffee bei Luca. Du zahlst – Neue zahlen.");
});
scene("brueckner", async () => {
  face(ev("Herr Brückner"));
  if (ep() === 5 && !flag("erster_tag_done")) await say("Herr Brückner", "Fragen Sie immer, wenn Sie etwas nicht verstehen. Lieber zweimal fragen als einmal falsch machen. Das gilt in der Pflege mehr als überall sonst.");
  else if (ep() === 6) await say("Herr Brückner", "Gut, dass Sie sich krankgemeldet haben. Krank arbeiten ist keine Heldentat. Es ist ansteckend.");
  else await say("Herr Brückner", "Alles im Griff auf 3B? Gut. Ich bin aus Bayern, ich sage nicht viel. Aber: gute Arbeit.");
});
scene("frau_engel", async () => {
  face(ev("Frau Engel"));
  if (ep() !== 5 || stepDone("q_erster_tag", "engel")) { await say("Frau Engel", "Kindchen, Sie sind ein Engel. Und ich heiße Engel. Das passt doch."); return; }
  await say("Frau Engel", "Na, wer sind Sie denn? Ein neues Gesicht! Kommen Sie, Kindchen, kommen Sie.");
  await say(ME, "Guten Morgen, Frau Engel. Ich bin {name}, die neue Pflegekraft.");
  await say("Frau Engel", "Wat? Sprechen Sie lauter, Kindchen, meine Ohren sind 84 Jahre alt.");
  await Typing.task({ speaker: "Frau Engel", prompt: "Frag Frau Engel, ob sie Schmerzen hat. (Höflich, mit »Sie«!)", answers: ["Haben Sie Schmerzen?", "Haben Sie heute Schmerzen?"],
    mode: "sentence", place: "top", label: "Pflege", minWords: 2, need: [["haben"], ["sie"], ["schmerzen"]],
    tips: ["Fang mit dem Verb an: »Haben …«", "Höflich: »Sie«!", "Was soll sie haben? S…"], forbid: ["du", "hast"], forbidMsg: "Frau Engel ist 84 und deine Patientin – bitte »Sie«!" });
  await say("Frau Engel", "Schmerzen? Nur wenn ich aufstehe. Und wenn ich Fernsehen gucke. Die Nachrichten tun weh.");
  await say("Frau Engel", "Wissen Se, Kindchen: »Et hätt noch immer jot jejange.« Das ist Kölsch. Es ist noch immer gut gegangen.");
  const i = await ask(ME, "(Was antworte ich?)", ["Ich messe jetzt Ihren Blutdruck, ja?", "Und wenn es mal nicht gut geht?"], -1);
  if (i === 1) await say("Frau Engel", "Dann trinkt man einen Kaffee und wartet, bis es wieder gut geht. Hihi.");
  else await say("Frau Engel", "Messen Se, messen Se. Er ist immer zu hoch. Wegen der Nachrichten.");
  await narr("Blutdruck: 135 zu 85. Ein bisschen hoch. Wegen der Nachrichten.");
  step("q_erster_tag", "engel");
  points(6, "Patientin versorgt");
});
scene("herr_demir", async () => {
  face(ev("Herr Demir"));
  if (ep() !== 5 || stepDone("q_erster_tag", "demir")) { await say("Herr Demir", "Danke, Schwester. Das Fieber ist weg. Jetzt habe ich nur noch Hunger."); return; }
  if (!stepDone("q_erster_tag", "engel")) { await say("Herr Demir", "(schläft)"); return; }
  await say("Herr Demir", "Merhaba… ah, Entschuldigung. Guten Morgen.");
  if (SR.origin() === "tr") await say(ME, "Merhaba, Herr Demir! Ben de Türküm. Nasılsınız? …Aber auf Station sprechen wir Deutsch, oder?");
  await say("Herr Demir", "Ich bin seit 1972 in Köln. Ford-Werke, 35 Jahre. Mein Deutsch ist gut. Nur wenn ich Fieber habe, wird es türkisch.");
  learn("fieber");
  await Mini.quiz([{ speaker: "Herr Demir", q: "»Wie geht es Ihnen heute?« – Was sagst du als Pflegekraft danach?", o: ["Ich messe jetzt Ihre Temperatur.", "Du siehst schlecht aus.", "Warum sind Sie krank?"], a: 0,
    why: "Freundlich und klar: sagen, was man jetzt macht. »Ich messe jetzt Ihre Temperatur.«", yes: "Gerne. Und danach Tee, bitte. Viel Tee." }]);
  await narr("38,1 °C. Etwas besser als in der Nacht.");
  await say("Herr Demir", "1972 hatte ich auch keine Wohnung, keine Sprache, kein Konto. Wir haben das alles gemacht – ohne Internet. Sie schaffen das auch.");
  step("q_erster_tag", "demir");
  points(6);
});
scene("dienstplan", async () => {
  if (ep() !== 5) { await narr("Der Dienstplan. Neben meinem Namen steht ein Smiley. Aga war das."); return; }
  learn("dienstplan", "fruehdienst");
  await UI.withPaper("Dienstplan Station 3B · Woche 1", "<b>{name}</b>:   Mo F · Di F · Mi S · Do S · Fr – · Sa N · So –\n<b>Aga</b>:      Mo F · Di S · Mi S · Do – · Fr F · Sa N · So –\n\nF = Früh (6–14) · S = Spät (14–22) · N = Nacht (22–6)", "paper", async () => {
    await Mini.quiz([
      { q: "Wann habe ich am Mittwoch Dienst?", o: ["Von 6 bis 14 Uhr", "Von 14 bis 22 Uhr", "Gar nicht"], a: 1, why: "Mittwoch: S = Spätdienst, 14–22 Uhr." },
      { q: "An welchen Tagen habe ich frei?", o: ["Freitag und Sonntag", "Samstag und Sonntag", "Montag und Dienstag"], a: 0, why: "Bei »Fr« und »So« steht ein Strich: frei." },
      { q: "Am Samstag arbeite ich mit Aga in der Nacht. Wann beginnt der Dienst?", o: ["Um 22 Uhr", "Um 6 Uhr", "Um 14 Uhr"], a: 0, why: "N = Nacht, 22–6 Uhr." },
    ], 4);
  });
  doc("dienstplan", true);
  step("q_erster_tag", "plan");
});
scene("stations_kaffee", async () => { await narr("Die Kaffeemaschine der Station 3B. Sie ist älter als Herr Brückners Karriere. Und wichtiger."); });

scene("feierabend", async () => {
  set("erster_tag_done");
  await say("Aga", "Und? Erster Tag überlebt?");
  const i = await ask(ME, "(…)", ["Ja! Es war anstrengend, aber schön.", "Ich bin so müde. Aber Frau Engel ist toll."]);
  await say("Aga", i === 0 ? "Anstrengend, aber schön – das ist der Pflegeberuf in vier Wörtern." : "Frau Engel ist die Chefin der Station. Herr Brückner weiß es nur noch nicht.");
  await say("Aga", "Weißt du, mein erstes Jahr war das schwerste. Danach wird es nur noch schwer. Hihi. Nein, im Ernst: Es wird besser. Versprochen.");
  learn("feierabend");
  await say("Aga", "Feierabend! Morgen vor dem Dienst: Kaffee bei Luca. Und am Sonntag: Radtour am Rhein! Luca kommt auch. Treffpunkt beim Fahrradverleih.");
  friend("aga", 1);
  finish("q_erster_tag", 30);
  giveSkill("beruf");
  quest("q_cafe2"); quest("q_radtour"); quest("q_wagner");
  set("cafe2_aga"); set("radtour_treffen");
  diary("d_erster_tag", "Erster Arbeitstag! Frau Engel sagt »Kindchen« zu mir. Herr Demir hat 35 Jahre bei Ford gearbeitet. Aga hat mir drei Witze und vier Tricks gezeigt. Ich bin so müde wie noch nie. Und so glücklich.");
  await think("Feierabend. Auf dem Weg nach Hause schaue ich in meinen Briefkasten.");
  await transfer("ehrenfeld", 29, 19, 2);
  await World.call("paketkarte");
});

// ------------------------------------------------------------------------------
// Paket beim Nachbarn
// ------------------------------------------------------------------------------
scene("paketkarte", async () => {
  learn("paket", "benachrichtigung");
  await UI.withPaper("Benachrichtigungskarte", "<b>Wir waren da!</b>\nLeider haben wir Sie nicht angetroffen.\n\nIhre Sendung wurde abgegeben:\n☐ in der Filiale  ☐ in der Packstation\n☒ beim Nachbarn: <b>Wagner, EG links</b>\n\nZugestellt am: Montag, 11:42 Uhr", "paper", async () => {
    await Mini.quiz([{ q: "Wo ist mein Paket?", o: ["Bei Herrn Wagner", "In der Post-Filiale", "In der Packstation"], a: 0, why: "Das Kreuz ist bei »beim Nachbarn: Wagner«." }], 4);
  });
  step("q_wagner", "karte");
  await think("Bei Herrn Wagner. Natürlich. Er steht ja auch schon vor der Tür.");
});
scene("wagner_paket", async () => {
  face(ev("Herr Wagner"));
  if (!stepDone("q_wagner", "karte")) { await say("Herr Wagner", "Guten Tag. Mittwoch ist Treppenhaus."); return; }
  if (!stepDone("q_wagner", "abholen")) {
    await say(ME, "Guten Tag, Herr Wagner. Sie haben ein Paket für mich, oder?");
    await say("Herr Wagner", "Korrekt. Ein Paket. Von… Hanoi? Vietnam?");
    await say(ME, "Von meiner Freundin Mai. Sie ist aus Vietnam, aber sie wohnt in Berlin.");
    await say("Herr Wagner", "Hm. Interessant. Ich war nie in Berlin. Ich war 41 Jahre bei der Post. Ich habe Pakete in die ganze Welt geschickt. Aber ich war nie weg.");
    await narr("Er gibt mir das Paket. Dann zögert er.");
    await say("Herr Wagner", "Meine Frau wollte immer nach Vietnam. Wir haben es immer verschoben. Dann war es zu spät.");
    const i = await ask(ME, "(Was sage ich?)", ["Das tut mir leid, Herr Wagner.", "Sie können doch jetzt noch fahren!", "Hm."], -1, { correct: [0, 1] });
    if (i === 0) await say("Herr Wagner", "…Danke. Das ist lange her. Elf Jahre.");
    else if (i === 1) await say("Herr Wagner", "Mit 74? …Na ja. Vielleicht. Man soll nie »nie« sagen. Sagt meine Tochter.");
    else await say("Herr Wagner", "…Ja. Hm. Guten Tag.");
    step("q_wagner", "abholen");
    friend("wagner", 1);
    await think("Ich will mich bedanken. Mit einer Karte. Das macht man hier so, sagt Mai.");
    return;
  }
  if (!stepDone("q_wagner", "danke")) {
    await Typing.task({ prompt: "Schreib eine kleine Dankeskarte für Herrn Wagner.\n<span class=sub>(Zum Beispiel: »Vielen Dank für das Paket!«)</span>", answers: ["Vielen Dank für das Paket!", "Lieber Herr Wagner, vielen Dank für das Paket!"],
      mode: "sentence", place: "top", label: "Dankeskarte", need: [["danke", "dank"], ["paket"]], tips: ["Fang an mit »Vielen Dank …« oder »Danke …«", "Wofür? Für das P…"], forbid: ["dir", "du"], forbidMsg: "Herr Wagner und du – ihr sagt noch »Sie«! Kein »dir« bitte." });
    await narr("Ich gebe ihm die Karte. Er liest sie. Zweimal. Dann steckt er sie in die Brusttasche.");
    await say("Herr Wagner", "…Eine Karte. Mit der Hand geschrieben. Das macht heute keiner mehr.");
    await say("Herr Wagner", "Wenn Sie etwas brauchen – ich bin unten. EG links. Ich bin immer da. Leider.");
    step("q_wagner", "danke");
    finish("q_wagner", 20);
    friend("wagner", 1);
    diary("d_wagner", "Herr Wagner war 41 Jahre bei der Post. Seine Frau wollte nach Vietnam. Ich habe ihm eine Dankeskarte geschrieben. Er hat sie in die Brusttasche gesteckt. Ich glaube, unter dem »Mittwoch ist Treppenhaus« ist ein sehr netter Mann.");
    if (done("q_radtour") && done("q_erster_tag")) await World.call("ep5_ende");
    return;
  }
  await say("Herr Wagner", "Guten Tag. Das Wetter ist heute akzeptabel.");
});

// ------------------------------------------------------------------------------
// Café: Cappuccino und Kuchen (Fortschritt beim Bestellen)
// ------------------------------------------------------------------------------
scene("aga_cafe", async () => { face(); await say("Aga", "Bestell du zuerst! Ich will hören, wie dein Deutsch am Morgen klingt."); });
scene("cafe2", async () => {
  await say("Luca", "Buongiorno, bella! Und Aga! Die schönsten Pflegekräfte von Ehrenfeld. Was darf es sein?");
  await Typing.task({ speaker: "Luca", prompt: "Bestell für dich einen Cappuccino <b>und</b> ein Stück Kuchen.\n<span class=sub>(Ein ganzer Satz – das kannst du jetzt!)</span>",
    answers: ["Für mich einen Cappuccino und ein Stück Kuchen, bitte.", "Ich hätte gern einen Cappuccino und ein Stück Kuchen."], mode: "sentence", place: "top", label: "Bestellen", pts: 8,
    need: [["cappuccino", "capuccino", "cappucino"], ["stück", "stueck"], ["kuchen"]], tips: ["Was trinkst du? Einen C…", "Wie viel Kuchen? Ein S…", "Was isst du dazu? K…"] });
  await say("Luca", "Perfetto! Welchen Kuchen? Tiramisu, Käsekuchen oder Apfelstrudel?");
  await ask(ME, "(…)", ["Den Käsekuchen, bitte.", "Das Tiramisu, bitte.", "Den Apfelstrudel, bitte."]);
  await say("Aga", "Und für mich einen Kaffee. Schwarz. Wie meine Seele um sechs Uhr morgens.");
  await say("Luca", "Polnischer Humor. Ich liebe es. Ich bringe euch alles an den Tisch.");
  await say("Aga", "Weißt du, was ich toll finde? Am Anfang hast du »Einen Kaffee, bitte« gesagt, erzählt Luca. Heute bestellst du wie eine Kölnerin.");
  step("q_cafe2", "bestellen");
  finish("q_cafe2", 12);
  friend("aga", 1); friend("luca", 1);
});

// ------------------------------------------------------------------------------
// Fahrradtour am Rhein
// ------------------------------------------------------------------------------
scene("rad_weiter", async () => { await think("Erst die Tour! Aga und Luca warten am Biergarten."); await walk("player", "R"); });
scene("aga_rad", async () => { face(); await say("Aga", "Da bist du! Hast du ein Fahrrad? Nein? Dann zum Verleih – da vorne!"); });
scene("luca_rad", async () => { face(); await say("Luca", "Ich fahre langsam. Ich bin Italiener. Wir fahren schnell nur mit dem Auto."); });
scene("fahrradverleih", async () => {
  face();
  if (flag("radtour_done") || !flag("radtour_treffen")) { await say("Verleiher", "Fahrräder, E-Bikes, Tandems! Heute ist Sonntag, da will ganz Köln an den Rhein."); return; }
  if (flag("radtour_unterwegs")) { await say("Verleiher", "Gute Fahrt! Und denken Sie dran: Radweg, nicht Fußweg."); return; }
  await say("Verleiher", "Moin! Äh – Tach! Was kann ich für Sie tun?");
  learn("fahrrad", "leihen");
  await Typing.task({ speaker: "Verleiher", prompt: "Sag, dass du ein Fahrrad leihen möchtest.", answers: ["Ich möchte ein Fahrrad leihen.", "Ich möchte gern ein Fahrrad leihen, bitte."],
    mode: "sentence", place: "top", label: "Fahrradverleih", need: [["möchte", "würde", "hätte"], ["fahrrad", "rad"], ["leihen", "mieten", "ausleihen"]],
    tips: ["»Ich möchte …«", "Was? Ein F…", "Was möchtest du mit dem Fahrrad machen? l…"] });
  await say("Verleiher", "Für den ganzen Tag? 15 Euro. Mit Helm. Der Helm ist nicht Pflicht, aber Ihr Kopf ist auch nicht Pflicht.");
  step("q_radtour", "leihen");
  set("radtour_unterwegs"); set("fahrrad");
  await say("Aga", "Los geht's! Erst zur Hohenzollernbrücke – da vorne, wo die Züge fahren. Dann zu den Kranhäusern und dann: Biergarten!");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Mit dem Fahrrad bist du schneller. Fahr den Rhein entlang nach rechts!");
});
scene("stopp_bruecke", async () => {
  set("stopp_bruecke");
  step("q_radtour", "bruecke");
  await narr("Die Hohenzollernbrücke. Züge rattern über den Rhein. Am Geländer hängen tausende kleine Schlösser.");
  await say("Aga", "Liebesschlösser! Paare schreiben ihre Namen drauf und werfen den Schlüssel in den Rhein. Ewige Liebe.");
  await say("Luca", "Der Rhein ist voller Schlüssel. Und die Hälfte der Paare ist geschieden. Romantisch, nein?");
  const i = await ask(ME, "(…)", ["Das ist schön!", "Und was macht man, wenn man Single ist?"]);
  if (i === 1) await say("Aga", "Dann hängt man ein Schloss für seine Freunde auf! Komm, wir machen eins: Aga, Luca, {name}. Station 3B forever.");
  else await say("Aga", "Ja, schön kitschig. Köln liebt Kitsch.");
  await say("Luca", "Ich bin vor 20 Jahren »für ein Jahr« nach Köln gekommen. Wegen dieser Brücke bin ich geblieben. Na ja – wegen dieser Brücke und wegen Kaffee.");
  await say("Aga", "Und ich wegen der Arbeit. Und dann wegen der Leute. Am Anfang denkt man: Ich bin hier fremd. Und dann, eines Tages, merkt man: Ich bin Kölnerin. Mit Akzent.");
  friend("luca", 1); friend("aga", 1);
  points(6);
});
scene("stopp_kran", async () => {
  set("stopp_kran");
  step("q_radtour", "kran");
  await narr("Die Kranhäuser. Drei Hochhäuser, die aussehen wie umgedrehte Kräne. Am alten Hafen.");
  await say("Luca", "Hier war früher ein Hafen mit Kränen. Jetzt sind hier Büros und sehr teure Wohnungen. Für 3.000 Euro kalt.");
  await say(ME, "Kalt? Ohne Nebenkosten?");
  await say("Luca", "Ohne Nebenkosten. Du lernst schnell, bella.");
  await think("Kaltmiete, Warmmiete, Nebenkosten. Vor einem Monat waren das für mich Geheimwörter.");
});
scene("biergarten", async () => {
  step("q_radtour", "biergarten");
  set("radtour_done");
  World.refresh();
  Audio_.bgm("Radio - Oak");
  await narr("Der Biergarten am Rhein. Lange Holztische, Kastanien, Musik. Und ein Kellner mit blauer Schürze.");
  await say("Köbes", "Na, wat wollt ihr? Drei Kölsch? Oder seid ihr Düsseldorfer?");
  learn("koebes");
  await say("Aga", "Der Köbes! So heißen die Kellner hier. Sie sind frech. Das gehört dazu.");
  const i = await ask(ME, "(Was bestelle ich?)", ["Ein Kölsch, bitte.", "Für mich ein Wasser, bitte.", "Eine Apfelschorle, bitte."]);
  if (i === 0) await say("Köbes", "Jeht doch! Ein Kölsch für die Dame.");
  else await say("Köbes", "Wasser? Im Biergarten? …Na jut. Auch Wasser ist flüssig.");
  await say("Luca", "Und zu essen? Ich empfehle den »Halven Hahn«!");
  await Mini.quiz([{ speaker: "Luca", q: "Was ist ein »Halve Hahn«?", o: ["Ein halbes Hähnchen", "Ein Roggenbrötchen mit Käse", "Ein halbes Bier"], a: 1,
    why: "Haha! Alle denken das. Aber »Halve Hahn« ist ein Roggenbrötchen mit Käse, Senf und Zwiebeln. Kein Huhn. Niemand weiß, warum.", yes: "Bravissima! Du bist schon Kölnerin." }], 5);
  learn("halver_hahn");
  await say("Köbes", "Und merkt euch: Wenn ihr kein Kölsch mehr wollt, legt den Deckel aufs Glas. Sonst bringe ich immer neues. Für immer.");
  await say("Aga", "Auf uns! Auf Station 3B, auf Ehrenfeld, auf {name}!");
  learn("prost");
  await Typing.task({ prompt: "Alle heben das Glas. Was sagst du?", answers: ["Prost!", "Prost", "Zum Wohl!"], mode: "word", label: "Anstoßen", place: "top", pts: 3,
    validate: v => /prost|zum wohl/i.test(v) ? { ok: true, perfect: true } : null, hints: ["P…!", "Prost!"] });
  await say("Luca", "Und in die Augen schauen! Sonst sieben Jahre schlechter Kaffee.");
  finish("q_radtour", 30);
  unset("radtour_unterwegs"); unset("fahrrad");
  friend("aga", 1); friend("luca", 1);
  diary("d_radtour", "Sonntag am Rhein mit Aga und Luca. Liebesschlösser, Kranhäuser, Kölsch. Ein »Halve Hahn« ist kein halbes Hähnchen. Und beim Anstoßen schaut man sich in die Augen. Ich habe heute zum ersten Mal gedacht: Das sind meine Freunde in Köln.");
  if (done("q_erster_tag") && done("q_wagner")) await World.call("ep5_ende");
  else await think("Ein schöner Tag. Zuhause muss ich mich noch bei Herrn Wagner bedanken.");
});
scene("aga_bg", async () => { face(); await say("Aga", "Noch ein Kölsch? Deckel drauf, wenn nicht! Haha."); if (done("q_wagner") && !flag("ep5_ende")) await World.call("ep5_ende"); });
scene("luca_bg", async () => { face(); await say("Luca", "Am Rhein schmeckt alles besser. Sogar das Wasser."); if (done("q_wagner") && !flag("ep5_ende")) await World.call("ep5_ende"); });
scene("koebes", async () => { face(); await say("Köbes", flag("radtour_done") ? "Noch eins? Keine Antwort ist auch ein Ja!" : "Biergarten öffnet für Gäste mit Durst. Und mit Fahrrad."); });
scene("schild_rhein", async () => { await narr("<b>Rhein</b> · Rhein-Kilometer 688\nDer Rhein fließt von der Schweiz bis in die Niederlande – 1.230 Kilometer."); });
scene("schloesser", async () => { await narr("Liebesschlösser: »Anna + Tim 2019«, »Mama & Papa – 40 Jahre«, »Station 3B ❤«."); });
scene("angler", async () => { face(); await say("Angler", "Ich angle hier seit 30 Jahren. Gefangen habe ich: zwei Fische, einen Schuh und einen Liebesschloss-Schlüssel."); });
scene("joggerin_rhein", async () => { face(); await say("Joggerin", "Morgen! …Es ist 15 Uhr? Egal. Morgen!"); });

scene("ep5_ende", async () => {
  if (flag("ep5_ende")) return;
  set("ep5_ende");
  await narr("Abends, zurück in der Körnerstraße. Herr Wagner gießt seine Blumen und nickt mir zu. Er nickt! Das ist neu.");
  await Mini.phone("Mama", [o("mama2"), "Erzähl! Wie ist die Arbeit? Wie sind die Leute?"], [o("mama2"), "Erzähl! Wie ist die Arbeit? Wie sind die Leute?"]);
  const i = await ask(ME, "(Was erzähle ich Mama?)", ["Ich habe Freunde gefunden, Mama. Eine Kollegin aus Polen, einen Italiener und einen alten Nachbarn, der Pakete sammelt.", "Alles gut."], -1, { correct: 0 });
  if (i === 0) points(8, "erzählt");
  await say("Mama", `${o("toll")} ${o("schritt")}…`);
  diary("d_ep5", "Ich gehöre jetzt zum Team. Frau Engel nennt mich »Kindchen«, Aga »Schätzchen«, Luca »bella« und Herr Wagner »Frau {nachname}«. Bei Herrn Wagner ist das das größte Kompliment.");
  await finishEpisode(5, 20);
  await World.transfer("wohnung", 9, 4, 2);
  await World.call("ep6_vorabend");
});
