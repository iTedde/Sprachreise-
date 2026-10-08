// Sprachreise – Episode 10: B1 (Finale + Selbstständigkeit) · Hamburg
// Alles kommt zusammen: Sprechen, Schreiben, Lesen, Hören, Termine, Dokumente, Reisen, Freunde – und eigene Entscheidungen.
// Ohne Helfer-Figur. Am Ende hilft sie selbst: »Keine Sorge. Ich helfe dir.«
"use strict";

Object.assign(SR.WORDS, {
  moin: { de: "Moin!", en: "Hello! (Northern Germany)", cat: "Dialekt", ex: "Moin! – Moin!", note: "Im Norden sagt man »Moin« – den ganzen Tag. »Moin moin« sagen nur Gesprächige." },
  fischbroetchen: { de: "Fischbrötchen", art: "das", en: "fish sandwich", cat: "Essen", ex: "Ein Fischbrötchen mit Matjes, bitte." },
  sprachzertifikat: { de: "Sprachzertifikat", art: "das", en: "language certificate", cat: "Lernen", ex: "Ich brauche ein Sprachzertifikat B1.", pts: 6 },
  pruefung: { de: "Prüfung", art: "die", pl: "die Prüfungen", en: "exam", cat: "Lernen", ex: "Die Prüfung hat vier Teile: Lesen, Hören, Schreiben, Sprechen." },
  verschieben: { de: "verschieben", en: "to postpone, reschedule", cat: "Termine", ex: "Können wir den Termin auf Freitag verschieben?" },
  bestanden: { de: "bestanden", en: "passed (exam)", cat: "Lernen", ex: "Ich habe die Prüfung bestanden!", pts: 10 },
  selbststaendig: { de: "selbstständig", en: "independent(ly)", cat: "Gefühle", ex: "Ich mache das jetzt selbstständig." },
  zuhause: { de: "Zuhause", art: "das", en: "home", cat: "Gefühle", ex: "Deutschland ist jetzt auch mein Zuhause.", pts: 10 },
});

Object.assign(SR.QUESTS, {
  q_hamburg: { title: "Moin, Hamburg", ep: 10,
    desc: "Neue Stadt, neue Stelle, neue WG – mit Mai. Diesmal ohne Tarek, ohne Jonas, ohne Hilfe. Ich mache das selbst.",
    steps: [["ankommen", "Am Hauptbahnhof ankommen"], ["wg", "Die WG in der Hafenstraße finden"], ["ummelden", "Mich in Hamburg ummelden"]] },
  q_b1: { title: "Deutsch B1", ep: 10,
    desc: "Die Ausländerbehörde braucht ein B1-Zertifikat. Und ich will es sowieso. Seit dem ersten Tag.",
    steps: [["brief", "Den Brief der Behörde verstehen"], ["anruf", "Bei der Behörde nachfragen"], ["anmelden", "Mich zur Prüfung anmelden"],
            ["lernen", "Mit den Freunden üben"], ["pruefung", "Die Prüfung schreiben"], ["ergebnis", "Das Ergebnis bekommen"]] },
  q_amani: { title: "Keine Sorge", ep: 10,
    desc: "Am Hauptbahnhof steht eine junge Frau mit einem Zettel. Sie sieht aus, wie ich vor einem Jahr ausgesehen habe.",
    steps: [["helfen", "Ihr helfen"]] },
});

Object.assign(SR.DOCUMENTS, {
  meldebescheinigung_hh: { name: "Meldebescheinigung (Hamburg)", short: "Hafenstraße 7, 20359 Hamburg",
    text: "Einfache Meldebescheinigung\n{name} {nachname}\nHafenstraße 7, 20359 Hamburg – Hauptwohnung\nFreie und Hansestadt Hamburg · Kundenzentrum Altona" },
  abh_hh_brief: { name: "Brief: Ausländerbehörde Hamburg", short: "Nachweis B1 bis 31.03.",
    text: "Hamburg Welcome Center\nBitte reichen Sie bis zum <b>31.03.</b> einen Nachweis über Deutschkenntnisse auf <b>Niveau B1</b> ein.\n<c3=707078,D8D8D0>Vereinfachte Darstellung.</c3>" },
  pruefung_anmeldung: { name: "Anmeldung telc Deutsch B1", short: "VHS Hamburg, Samstag 9 Uhr",
    text: "Prüfung: telc Deutsch B1 (Zertifikat Deutsch)\nOrt: VHS Hamburg, Raum 3\nDatum: Samstag, 9:00 Uhr\nBitte mitbringen: Ausweis, Kugelschreiber, gute Nerven" },
  zertifikat_b1: { name: "Zertifikat Deutsch B1", short: "BESTANDEN",
    text: "<b>Zertifikat Deutsch · Niveau B1</b>\n{name} {nachname}\nLesen · Hören · Schreiben · Sprechen: <b>bestanden</b>\n<c3=307030,C0E0C0>Das erste große Ziel. Geschafft.</c3>" },
});

// ------------------------------------------------------------------------------
scene("ep10_start", async () => {
  await UI.tone(1, 0.8);
  await narr("Drei Wochen später. Kisten gepackt, Wohnung übergeben, Kaution zurück. Mit Verwendungszweck.");
  await narr("Herbert hat beim Tragen geholfen. Aga hat geweint. Luca hat Kaffee für die Fahrt gemacht. Yara hat Tee eingepackt. Für alle Fälle.");
  await UI.episodeCard(10, "Ein Brief, eine Prüfung, eine neue Stadt.\nDiesmal ohne Hilfe. Fast.");
  S().currentCity = "koeln";
  await Karte.animate("koeln", "hamburg");
  S().currentCity = "hamburg";
  unlockCity("hamburg", true);
  quest("q_hamburg");
  await World.transfer("hamburg_hbf", 7, 19, 8, { fadeTime: 0.5 });
});
scene("hamburg_ankunft", async () => {
  set("hamburg_ankunft");
  await durchsage("Meine Damen und Herren, in wenigen Minuten erreichen wir Hamburg Hauptbahnhof. Sie haben Anschluss an die S-Bahn in Richtung Altona und an die U3.");
  await think("Ich verstehe alles. Anschluss, S-Bahn, Altona.");
  await think("Vor einem Jahr habe ich nur »Berlin« und »Hauptbahnhof« verstanden.");
  step("q_hamburg", "ankommen");
  await think("Mai wohnt in der Hafenstraße 7. Ich frage niemanden nach dem Weg. Ich habe einen Stadtplan – von Herbert, aus dem Jahr 1985 – und mein Handy. Raus, Richtung Hafen. Nach Süden.");
  learn("selbststaendig");
});
scene("hh_tafel", async () => {
  await UI.withPaper("ABFAHRT · Hamburg Hbf", "<b>Zeit   Zug       Ziel                Gleis</b>\n14:02  ICE 1708  Berlin Hbf          4\n14:10  RE 70     Kiel Hbf            8\n14:16  ICE 535   Köln Hbf            14  <c3=E04040,F0C0C0>+10</c3>\n14:22  S 1       Wedel               1", "screen", async () => {
    await think("ICE nach Köln: plus 10. Manche Dinge ändern sich nie.");
  }, { mono: true });
});
scene("pendler_hh", async () => { face(); await say("Pendler", "Moin."); learn("moin"); await think("Nur »Moin«. Ein Wort. Ein ganzes Gespräch. Die Hamburger sind effizient."); });
scene("baecker_hh", async () => { face(); await say("Bäcker", "Moin! Franzbrötchen? Das ist Hamburg. Zimt, Butter, Zucker. Kein Brötchen, keine Schrippe, keine Semmel. Ein Franzbrötchen!"); });
scene("hh_reisezentrum", async () => {
  if (flag("finale_zug")) { await World.call("finale_bahnhof"); return; }
  if (ep() > 10) { await World.call("reisezentrum_frei"); return; }
  await narr("<b>DB Reisezentrum Hamburg</b>");
  await think("Im Moment fahre ich nirgendwohin. Ich bin gerade erst angekommen.");
});

// Hafen-Viertel
scene("fischbroetchen", async () => {
  face();
  if (flag("fischbroetchen")) { await say("Fischverkäufer", "Moin! Noch eins? Hier gibt's keine Kalorien. Nur Seeluft."); return; }
  await say("Fischverkäufer", "Moin!");
  await Typing.task({ speaker: "Fischverkäufer", prompt: "Begrüß ihn wie eine Hamburgerin – und bestell ein Fischbrötchen.", answers: ["Moin! Ein Fischbrötchen, bitte."], mode: "sentence", place: "top", label: "Bestellen",
    need: [["moin"], ["fischbrötchen", "fischbroetchen"]], tips: ["Wie sagt man hier »Hallo«? M…", "Was möchtest du? Ein F…"] });
  learn("moin", "fischbroetchen");
  await say("Fischverkäufer", "Moin! So ist richtig. Nicht »Moin moin« – das ist schon Gequatsche. Matjes oder Bismarck?");
  await ask(ME, "(…)", ["Matjes, bitte.", "Bismarck, bitte.", "Was ist der Unterschied?"]);
  await say("Fischverkäufer", "Is' beides Hering. Schmeckt beides nach Hafen. Bitte schön!");
  set("fischbroetchen"); points(5);
});
scene("seemann", async () => { face(); await say("Seemann", "Moin. Ich bin 40 Jahre zur See gefahren. Ich war in 70 Ländern. Am Ende bin ich in Hamburg geblieben. Hamburg ist ein Hafen. Hier kommen alle an."); });
scene("landungsbruecken", async () => { await narr("Die Landungsbrücken. Fähren, Containerschiffe, Möwen. Auf der anderen Seite der Elbe: riesige Kräne."); await think("Ein Hafen. Hier kommen alle an. Wie ich."); });
scene("speicherstadt", async () => { await narr("<b>Speicherstadt</b> – Lagerhäuser aus rotem Backstein, über 100 Jahre alt. Früher: Kaffee, Tee, Gewürze aus der ganzen Welt."); });
scene("hamburgerin", async () => { face(); await say("Hamburgerin", "Moin! Na, neu hier? Sie gucken so, wie ich am ersten Tag geguckt habe. Und ich bin in Hamburg geboren."); });
scene("kind_hh", async () => { face(); await say("Kind", "Weißt du, dass es in Hamburg mehr Brücken gibt als in Venedig? Mein Papa sagt das jeden Tag."); });

// WG
scene("hh_wg_ankunft", async () => {
  set("hh_wg");
  step("q_hamburg", "wg");
  const mai = ev("Mai"); if (mai) face(mai);
  await say("Mai", "DU BIST DA! Und du hast allein hergefunden! Ohne anzurufen!");
  await say(ME, "Mit dem Stadtplan von Herbert. Von 1985. Die Hafenstraße war schon damals da.");
  await say("Mai", "Willkommen in der WG Hafenstraße! Sieht aus wie unsere alte WG in Berlin, oder? Ich habe sie extra so ausgesucht. Haha, nein. Zufall. Der Makler hat gesagt, alle Altbauwohnungen sehen so aus.");
  await say("Mai", "Dein Zimmer ist oben. Und, {name}: Du musst dich ummelden. Ich sage es nur. Ich weiß, dass du es weißt.");
  await say(ME, "Kundenzentrum Altona. Termin habe ich schon. Morgen, 8:15 Uhr. Online gebucht – beim ersten Versuch.");
  await say("Mai", "…Beim ERSTEN Versuch? Wer bist du und was hast du mit meiner Freundin gemacht?");
  friend("mai", 1);
});
scene("mai_hh", async () => {
  face();
  if (!flag("hh_ummeldung")) { await say("Mai", "Kundenzentrum Altona – links an der Straße, das grüne Haus. Viel Glück! Obwohl du keins mehr brauchst."); return; }
  if (!flag("b1_bestanden")) {
    if (stepDone("q_b1", "anmelden") && !stepDone("q_b1", "lernen")) { await World.call("lernabend"); return; }
    await say("Mai", "Die B1-Prüfung? Du schaffst das. Du sprichst seit Monaten B1. Du weißt es nur noch nicht.");
    return;
  }
  await say("Mai", "B1! Ich habe es allen erzählt. Der Bäcker weiß es. Der Fischverkäufer weiß es. Der Seemann weiß es. Hamburg weiß es.");
});
scene("laptop_hh", async () => { await narr("Mein Laptop. Ein Foto von der Station 3B als Hintergrund. Und eine Mail von Carmen: »¿Y? ¿B1? 🥨«"); });
scene("bett_hh", async () => { await think(flag("b1_bestanden") ? "Mein Bett in Hamburg. Ich schlafe gut hier. Die Möwen sind laut. Aber ich schlafe gut." : "Noch nicht schlafen. Es gibt so viel zu tun."); });
scene("fenster_hh", async () => { await narr("Wenn man sich weit aus dem Fenster lehnt: ein Stück Hafen. Ein Kran. Und ganz viel Himmel."); });
scene("tisch_hh", async () => { await narr("Mais Ordner. Meine Ordner. Zusammen: sieben Ordner. Mai hat recht gehabt. In Deutschland braucht man viele Ordner."); });

// Ummeldung – souverän
scene("hh_kz_zu", async () => { await narr("Kundenzentrum Altona. »Termine nur online.«"); });
scene("jensen", async () => {
  face(ev("Herr Jensen"));
  if (flag("hh_ummeldung")) { await say("Herr Jensen", "Moin. Alles erledigt. Schönen Tag noch."); return; }
  await say("Herr Jensen", "Moin.");
  await say(ME, "Moin. Ich habe einen Termin um 8:15 Uhr. Ich möchte mich ummelden – von Köln nach Hamburg. Hier sind mein Reisepass, mein Aufenthaltstitel, das ausgefüllte Formular und die Wohnungsgeberbestätigung.");
  points(10, "alles in einem Satz");
  await say("Herr Jensen", "…");
  se("pc", 0.8); await wait(0.5);
  await say("Herr Jensen", "Moin. Fertig.");
  await narr("Vier Minuten. Herr Jensen hat insgesamt neun Wörter gesagt. Zwei davon waren »Moin«.");
  doc("meldebescheinigung_hh");
  set("hh_ummeldung");
  step("q_hamburg", "ummelden");
  finish("q_hamburg", 30);
  diary("d_hh", "Ummeldung in Hamburg: vier Minuten. In Berlin habe ich eine Woche gebraucht. In Köln fünf Minuten. In Hamburg vier. Und Herr Jensen hat nur »Moin« gesagt. Ich glaube, er hat mich gemocht.");
  await think("Zurück in die WG. Mai hat gesagt, sie kocht.");
});
scene("kz_hh_wartende", async () => { face(); await say("Wartende", "Moin. Ich bin aus Kiel hergezogen. Für die Kieler ist Hamburg schon fast Ausland."); });

// ------------------------------------------------------------------------------
// Brief der Behörde, Anruf (B1), Anmeldung zur Prüfung
// ------------------------------------------------------------------------------
scene("hh_brief_scene", async () => {
  set("hh_brief");
  quest("q_b1");
  await say("Mai", "Post für dich! Grauer Umschlag. Du weißt ja…");
  await Mini.letter("Hamburg Welcome Center · Ausländerbehörde", [
    "Freie und Hansestadt Hamburg\nHamburg Welcome Center\n\nFrau {name} {nachname}\nHafenstraße 7, 20359 Hamburg\n\n<b>Ihr Antrag auf Verlängerung der Aufenthaltserlaubnis</b>",
    "Sehr geehrte Frau {nachname},\n\nwir haben Ihre Unterlagen erhalten. Vielen Dank.\n\nFür die weitere Bearbeitung bitten wir Sie, bis zum <b>31.03.</b> einen <b>Nachweis über Deutschkenntnisse auf dem Niveau B1</b> (z. B. Zertifikat Deutsch, telc B1) einzureichen.\n\nSollten Sie Fragen haben, erreichen Sie uns telefonisch Mo–Fr von 8 bis 12 Uhr.\n\nMit freundlichen Grüßen",
  ], [
    { q: "Was soll ich einreichen?", o: ["Ein B1-Zertifikat", "Noch einmal alle Unterlagen", "Nichts – nur aufbewahren"], a: 0, why: "»… einen Nachweis über Deutschkenntnisse auf dem Niveau B1 …«" },
    { q: "Bis wann?", o: ["Bis zum 31.03.", "Sofort", "In zwei Jahren"], a: 0, why: "»… bis zum 31.03. …« – eine Frist!" },
    { q: "Wann kann ich anrufen?", o: ["Montag bis Freitag, 8 bis 12 Uhr", "Jeden Abend", "Nie"], a: 0, why: "»Mo–Fr von 8 bis 12 Uhr«" },
  ]);
  doc("abh_hh_brief", true);
  learn("sprachzertifikat", "pruefung");
  step("q_b1", "brief");
  await think("B1. Mein Ziel seit dem ersten Tag. Jetzt brauche ich es auch auf Papier.");
  await think("Aber gestern kam noch ein anderer Brief. »Ihre Unterlagen sind unvollständig.« Muss ich darauf reagieren? Ich rufe an. Selbst.");
  await World.call("hh_anruf");
});
scene("hh_anruf", async () => {
  Audio_.me("phone");
  const p = UI.paper("Anruf: Hamburg Welcome Center", "<c3=60D080,103020>Verbunden</c3>", "phone");
  try {
    await say("Sachbearbeiterin", "Hamburg Welcome Center, Petersen, guten Morgen?");
    await think("Petersen! Wie Frau Petersen in Berlin. Ein gutes Zeichen.");
    const i = await ask(ME, "(Jetzt alles in Ruhe erklären.)", [
      "Guten Morgen. Mein Name ist {name} {nachname}. Ich habe die Unterlagen bereits eingereicht. Allerdings habe ich gestern einen Brief bekommen und bin mir nicht sicher, ob ich darauf noch reagieren muss. Können Sie mir bitte erklären, was ich jetzt tun soll?",
      "Hallo. Ich habe einen Brief. Was muss ich machen?",
    ], -1, { correct: 0 });
    if (i === 0) points(15, "B1 am Telefon");
    await say("Sachbearbeiterin", "Moment… Ah, ich sehe es. Der Brief hat sich mit Ihren Unterlagen gekreuzt. Die Unterlagen sind vollständig. Sie müssen nur noch das B1-Zertifikat nachreichen.");
    await say(ME, "Das heißt, auf den zweiten Brief muss ich nicht reagieren?");
    await say("Sachbearbeiterin", "Genau. Der hat sich erledigt. Und wenn Sie das Zertifikat haben, einfach per Post oder online hochladen. Sie sprechen übrigens sehr gut Deutsch.");
    await say(ME, "Danke. Ich arbeite daran.");
  } finally { p.close(); }
  step("q_b1", "anruf");
  giveSkill("selbststaendig");
  await think("Prüfung anmelden. Die VHS ist gleich um die Ecke – das Haus mit dem lila Dach. Wie in Berlin.");
});
scene("hh_vhs_zu", async () => { await narr("Volkshochschule Hamburg · Prüfungszentrum."); });
scene("albers", async () => {
  face(ev("Frau Albers"));
  if (flag("pruefung_done")) { await say("Frau Albers", "Das Ergebnis kommt per Post. Normalerweise in zwei bis drei Wochen. Bei uns: in zwei Tagen. Wir sind in Hamburg."); return; }
  if (stepDone("q_b1", "anmelden")) {
    if (!stepDone("q_b1", "lernen")) { await say("Frau Albers", "Die Prüfung ist am Samstag um 9 Uhr. Bereiten Sie sich gut vor – mit Freunden üben hilft!"); return; }
    await say("Frau Albers", "Guten Morgen! Bereit? Setzen Sie sich bitte an den Prüfungsplatz. Ihre Partnerin für den mündlichen Teil ist schon da.");
    set("pruefung_bereit");
    return;
  }
  await say("Frau Albers", "Guten Tag. Was kann ich für Sie tun?");
  await Typing.task({ speaker: "Frau Albers", prompt: "Sag, dass du dich für die B1-Prüfung anmelden möchtest.", answers: ["Ich möchte mich für die B1-Prüfung anmelden."], mode: "sentence", place: "top", label: "Anmeldung",
    need: [["möchte", "würde"], ["anmelden"], ["prüfung", "pruefung", "b1"]], tips: ["»Ich möchte mich …«", "Reflexiv: »mich … anmelden«", "Wofür? Für die P…"] });
  await say("Frau Albers", "Sehr gern. Der nächste Termin ist am Samstag, 9 Uhr. Die Prüfung hat vier Teile: Lesen, Hören, Schreiben und Sprechen. Die Gebühr ist… ach, das Formular erklärt alles.");
  doc("pruefung_anmeldung");
  step("q_b1", "anmelden");
  set("pruefung_angemeldet");
  await think("Samstag. Vier Teile. Ich bin nervös. Ich sollte üben. Mit Mai. Und mit allen anderen.");
});
scene("vhs_hh_aushang", async () => { await narr("»Herzlichen Glückwunsch an alle, die im letzten Monat bestanden haben!« Darunter: 47 Namen. Aus 23 Ländern."); });
scene("dilnoza", async () => {
  face();
  if (flag("pruefung_done")) { await say("Dilnoza", "Wir haben es geschafft! Ich glaube… Ich hoffe… Wir haben es geschafft!"); return; }
  await say("Dilnoza", "Hallo! Ich bin Dilnoza, aus Taschkent. Usbekistan. Ich bin so nervös. Ich habe drei Kaffee getrunken. Das war ein Fehler.");
});

// Lernabend mit allen (Videoanruf)
scene("lernabend", async () => {
  step("q_b1", "lernen");
  await say("Mai", "Lernabend! Ich habe alle eingeladen. Per Video.");
  await sms("Lerngruppe B1 📚", [
    { from: "Jonas", text: "Tipp 1: Beim Sprechen IMMER begründen. »Ich finde …, weil …«. Prüfer lieben »weil«." },
    { from: "Aga", text: "Tipp 2: Beim Schreiben: Anrede, Grund, Bitte, Gruß. Wie eine Übergabe – nichts vergessen! 💪" },
    { from: "Carmen", text: "Tipp 3: Beim Hören: Erst die Fragen lesen, dann hören. ¡Ánimo!" },
    { from: "Kofi", text: "Tipp 4: Ruhig bleiben. Wie Union in der 89. Minute. ⚽" },
    { from: "Herbert", text: "Tipp 5: Pünktlich sein. 8:45 Uhr. Nicht 9:00. Gruß, H. Wagner" },
  ], { prompt: "Antworte allen.", answers: ["Danke für eure Tipps! Ich schaffe das!"], mode: "sentence", need: [["danke"], ["tipps", "hilfe", "euch"]], tips: ["»Danke für …«", "Wofür? Für eure T…"] },
  [{ from: "Mai", text: "Wir glauben an dich 💛" }], { group: true });
  await Mini.quiz([
    { speaker: "Mai", q: "Übung Schreiben: Was gehört in eine formelle E-Mail an den Anfang?", o: ["Sehr geehrte Frau …,", "Hi!", "Moin moin"], a: 0, why: "Formell: »Sehr geehrte Frau …« – auch wenn »Moin« in Hamburg schön ist." },
    { speaker: "Mai", q: "Übung Sprechen: Wie macht man einen Vorschlag?", o: ["Wie wäre es, wenn wir …?", "Wir machen das so. Ende.", "Egal."], a: 0, why: "»Wie wäre es, wenn …?« – höflich und offen." },
    { speaker: "Mai", q: "Übung Grammatik: »Ich komme nicht, ___ ich arbeiten muss.«", o: ["weil", "deshalb", "aber"], a: 0, why: "Grund im Nebensatz: »weil« – Verb am Ende: »… weil ich arbeiten muss.«" },
  ], 5);
  friend("mai", 1);
  await think("Samstag, 8:45 Uhr. Nicht 9:00. Herbert hat recht.");
});

// ------------------------------------------------------------------------------
// Die Prüfung: Lesen, Hören, Schreiben, Sprechen
// ------------------------------------------------------------------------------
scene("pruefungsplatz", async () => {
  if (flag("pruefung_done")) { await narr("Mein Prüfungsplatz. Leer. Die Prüfung ist vorbei."); return; }
  if (!flag("pruefung_bereit")) { await narr("Ein Prüfungsplatz. »Bitte melden Sie sich zuerst bei der Aufsicht.«"); return; }
  Audio_.bgm("Gym");
  let score = 0;
  await UI.banner("PRÜFUNG · TEIL 1", "Lesen", "Lesen Sie den Text und beantworten Sie die Fragen.", "#3c6cc8");
  await UI.withPaper("Lesen · Aufgabe 1", "<b>Nachbarschaftsfest in Altona!</b>\nAm Samstag, dem 12. Juni, feiern wir von 14 bis 22 Uhr auf dem Platz vor der Kirche. Jeder bringt etwas zu essen mit – aus seinem Land oder seiner Region. Für Musik sorgt die Band »Elbklang«. Bei Regen findet das Fest im Gemeindehaus statt. Anmeldung für Essensstände bis zum 1. Juni bei Frau Hinrichs.", "paper", async () => {
    score += await Mini.quiz([
      { q: "Was sollen die Gäste mitbringen?", o: ["Etwas zu essen", "Musikinstrumente", "Nur Getränke"], a: 0, why: "»Jeder bringt etwas zu essen mit.«" },
      { q: "Was passiert, wenn es regnet?", o: ["Das Fest ist im Gemeindehaus.", "Das Fest fällt aus.", "Man feiert trotzdem draußen."], a: 0, why: "»Bei Regen findet das Fest im Gemeindehaus statt.«" },
      { q: "Bis wann muss man einen Essensstand anmelden?", o: ["Bis zum 1. Juni", "Bis zum 12. Juni", "Bis 22 Uhr"], a: 0, why: "»Anmeldung für Essensstände bis zum 1. Juni«" },
    ], 6);
  });
  await UI.banner("PRÜFUNG · TEIL 2", "Hören", "Sie hören eine Durchsage. Sie hören sie zweimal.", "#3c6cc8");
  const ansage = ["Achtung an Gleis 4: Der ICE 1708 nach Berlin Hauptbahnhof, planmäßige Abfahrt 14 Uhr 02, fährt heute in umgekehrter Wagenreihung.", "Die Wagen der ersten Klasse halten in Abschnitt E. Wegen Bauarbeiten hält der Zug heute nicht in Ludwigslust."];
  for (let r = 0; r < 2; r++) for (const l of ansage) await say("Durchsage", "♪ " + l);
  score += await Mini.quiz([
    { q: "Wohin fährt der ICE?", o: ["Nach Berlin", "Nach Ludwigslust", "Nach Köln"], a: 0, why: "»ICE 1708 nach Berlin Hauptbahnhof«" },
    { q: "Wo halten die Wagen der ersten Klasse?", o: ["In Abschnitt E", "In Abschnitt A", "Gar nicht"], a: 0, why: "»Die Wagen der ersten Klasse halten in Abschnitt E.«" },
    { q: "Warum hält der Zug nicht in Ludwigslust?", o: ["Wegen Bauarbeiten", "Wegen Verspätung", "Wegen eines Streiks"], a: 0, why: "»Wegen Bauarbeiten hält der Zug heute nicht in Ludwigslust.«" },
  ], 6);
  await UI.banner("PRÜFUNG · TEIL 3", "Schreiben", "Sie haben einen Termin bei Frau Albers am Donnerstag. Sie können nicht kommen. Schreiben Sie eine E-Mail: Entschuldigung, Grund, neuer Termin.", "#3c6cc8");
  learn("verschieben");
  const p = UI.paper("E-Mail an Frau Albers", "…", "screen");
  try {
    let mail = "";
    const r1 = await Typing.task({ prompt: "Anrede (formell):", answers: ["Sehr geehrte Frau Albers,"], mode: "sentence", place: "bottom", label: "Schreiben", minWords: 3,
      need: [["sehr"], ["geehrte"], ["albers"]], tips: ["»Sehr …«", "»… geehrte …«", "Wie heißt sie? Frau A…"] });
    mail += r1.text + "\n\n"; p.set(mail);
    const r2 = await Typing.task({ prompt: "Entschuldige dich und nenne den Grund: Du kannst am Donnerstag nicht kommen, weil du arbeiten musst.",
      answers: ["Leider kann ich am Donnerstag nicht kommen, weil ich arbeiten muss."], mode: "sentence", place: "bottom", label: "Schreiben", pts: 10,
      need: [["leider", "entschuldigung", "tut mir leid"], ["kann", "könnte"], ["nicht"], ["weil", "denn"], ["arbeiten"]],
      tips: ["Beginne mit »Leider …« oder »Entschuldigung, …«", "»… kann ich …«", "»… nicht kommen …«", "Begründe mit »weil« oder »denn«.", "Was musst du? arbeiten"] });
    mail += r2.text + "\n"; p.set(mail);
    const r3 = await Typing.task({ prompt: "Schlag einen neuen Termin vor (z. B. Freitag).", answers: ["Können wir den Termin auf Freitag verschieben?"], mode: "sentence", place: "bottom", label: "Schreiben", pts: 10,
      need: [["termin", "treffen"], ["freitag", "montag", "dienstag", "mittwoch", "nächste", "anderen"], ["verschieben", "können", "könnten", "möglich", "passt", "wäre"]],
      tips: ["Worum geht es? Den T…", "Wann? Zum Beispiel Freitag.", "Frag höflich: »Können wir … verschieben?«"] });
    mail += r3.text + "\n\n"; p.set(mail);
    const r4 = await Typing.task({ prompt: "Gruß:", answers: ["Mit freundlichen Grüßen"], mode: "sentence", place: "bottom", label: "Schreiben", minWords: 3,
      need: [["mit"], ["freundlichen"], ["grüßen", "gruessen"]], tips: ["»Mit …«", "»… freundlichen …«", "»… Grüßen«"] });
    mail += r4.text + "\n{name} {nachname}"; p.set(mail);
    score += [r1, r2, r3, r4].filter(r => r.tries === 1).length;
    await wait(0.6);
  } finally { p.close(); }
  await UI.banner("PRÜFUNG · TEIL 4", "Sprechen", "Gemeinsam etwas planen: Eine Kursteilnehmerin hat Geburtstag. Planen Sie mit Ihrer Partnerin eine kleine Überraschung.", "#3c6cc8");
  await say("Dilnoza", "Also… unsere Kollegin Fatma hat nächste Woche Geburtstag. Was machen wir?");
  const s1 = await ask(ME, "(Einen Vorschlag machen)", ["Wie wäre es, wenn wir nach dem Kurs einen Kuchen mitbringen? Fatma isst so gern Kuchen.", "Kuchen.", "Mir egal."], -1, { correct: 0 });
  await say("Dilnoza", "Gute Idee! Aber wer backt? Ich kann nicht backen. Ich kann nur Plov kochen.");
  const s2 = await ask(ME, "(Reagieren und begründen)", ["Ich kann einen Kuchen backen, weil ich am Freitag frei habe. Und du könntest Plov mitbringen – dann gibt es etwas Salziges und etwas Süßes.", "Ich backe.", "Dann kaufen wir nichts."], -1, { correct: 0 });
  await say("Dilnoza", "Plov und Kuchen! Perfekt. Und ein Geschenk?");
  const s3 = await ask(ME, "(Zustimmen oder widersprechen – mit Grund)", ["Ich finde, ein Buch ist eine gute Idee, weil Fatma gern liest. Aber wir sollten nicht zu viel Geld ausgeben – vielleicht sammeln wir im Kurs?", "Ein Buch.", "Kein Geschenk."], -1, { correct: 0 });
  await say("Dilnoza", "Super! Dann sammle ich das Geld, und du kaufst das Buch. Abgemacht?");
  await say(ME, "Abgemacht!");
  score += [s1, s2, s3].filter(x => x === 0).length;
  await say("Frau Albers", "Vielen Dank, das war's. Die Prüfung ist beendet. Das Ergebnis kommt per Post.");
  set("pruefung_score", score);
  set("pruefung_done");
  step("q_b1", "pruefung");
  points(40, "Prüfung geschrieben");
  Audio_.bgm("Islands");
  await think("Vorbei. Ich weiß nicht, wie es war. Ich weiß nur: Ich habe alles verstanden. Und ich habe alles gesagt, was ich sagen wollte.");
});

// Ergebnis
scene("hh_ergebnis", async () => {
  set("b1_bestanden");
  await narr("Zwei Tage später. Mai kommt mit einem Umschlag die Treppe hoch. Sie rennt.");
  await say("Mai", "ER IST DA! Mach auf! Nein, warte, ich muss filmen. Okay. Jetzt!");
  await UI.withPaper("telc · Ergebnis", "<b>Zertifikat Deutsch · B1</b>\n\n{name} {nachname}\n\nLesen ............ bestanden\nHören ............ bestanden\nSchreiben ........ bestanden\nSprechen ......... bestanden\n\n<b><c3=307030,C0E0C0>GESAMTERGEBNIS: BESTANDEN</c3></b>", "letter", async () => {
    await think("Bestanden. Bestanden. Bestanden.");
  });
  learn("bestanden");
  doc("zertifikat_b1");
  const need = SR.LEVELS[3][0] - S().points;
  points(Math.max(100, need), "Deutsch B1");
  if (SR.levelIndex() < 3) S().points = Math.max(S().points, SR.LEVELS[3][0]);
  step("q_b1", "ergebnis");
  finish("q_b1", 50);
  Audio_.me("levelup");
  await UI.banner("DEUTSCH B1", "Du hast es geschafft.", "Selbstständige Kommunikation. Das erste große Ziel – seit dem ersten Tag im ICE.", "#c87820");
  await say("Mai", "Ich weine. Das sind keine Zwiebeln. Das ist Stolz.");
  await sms("Lerngruppe B1 📚", [{ from: ME, text: "BESTANDEN!!! 🎉" }, { from: "Jonas", text: "WAAAAS! Ich wusste es!!" }, { from: "Aga", text: "Schätzchen!!! Station 3B feiert! Frau Engel auch 😄" },
    { from: "Carmen", text: "¡¡¡ENHORABUENA!!! 🥨🥨🥨" }, { from: "Kofi", text: "TOOOOOR!" }, { from: "Luca", text: "Ein Cappuccino aufs Haus. Auch nach elf Uhr." },
    { from: "Yara", text: "Stein für Stein. Ich bin so stolz auf dich." }, { from: "Herbert", text: "Gratuliere. Ich habe es gewusst. H." }], null, [], { group: true });
  diary("d_b1", "BESTANDEN. Deutsch B1. Vor einem Jahr habe ich im ICE nur »Berlin« und »Hauptbahnhof« verstanden. Heute habe ich ein Zertifikat. Und eine Gruppe von Menschen, die »TOOOOOR!« schreiben, wenn ich eine Prüfung bestehe.");
  await say("Mai", "Jetzt musst du das Zertifikat noch bei der Behörde hochladen. Und dann… Jonas hat am Wochenende seine Abschlussfeier in Berlin. Wir fahren hin, oder?");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Geh zum Hamburger Hauptbahnhof – zum Reisezentrum.");
  set("finale_zug");
});

// ------------------------------------------------------------------------------
// Spiegelszene: Amani am Hauptbahnhof – »Keine Sorge. Ich helfe dir.«
// ------------------------------------------------------------------------------
scene("amani", async () => {
  face();
  quest("q_amani");
  await say("Amani", "Entschuldigung… können Sie mir helfen?");
  await think("Sie hat einen Zettel in der Hand. Eine Adresse. Sie sieht müde aus. Und mutig. Wie ich vor einem Jahr.");
  const i = await ask(ME, "(Was sage ich?)", ["Keine Sorge. Ich helfe dir.", "Sorry, keine Zeit."], -1, { correct: 0 });
  if (i === 1) { await think("…Nein. Ich habe Zeit. Tarek hatte damals auch Zeit."); await say(ME, "Warte! Keine Sorge. Ich helfe dir."); }
  await say("Amani", "Danke! Ich heiße Amani. Ich komme aus Nairobi, aus Kenia. Ich mache eine Ausbildung zur Pflegefachfrau. Hier.");
  await say("Amani", "Ich suche diese Adresse. Die Hafenstraße… Do you speak English?");
  await say(ME, "Ein bisschen. Aber wir sprechen Deutsch, okay? Das hilft dir hier.");
  await think("Das hat Tarek zu mir gesagt. Fast genau so.");
  await say(ME, "Die Hafenstraße? Da wohne ich! Also: Eins – dort oben ist der Ausgang.");
  await say(ME, "Zwei – draußen gehst du geradeaus, Richtung Hafen. Drei – an der großen Straße links. Vier – die Nummer 7 ist rechts. Das grüne Haus.");
  await Mini.quiz([{ speaker: "Amani", q: "(Amani fragt nach:) Also: raus, geradeaus, dann…?", o: ["…links, und die Nummer 7 ist rechts.", "…rechts, und dann zurück.", "…ich weiß es nicht mehr."], a: 0,
    why: "Ich erkläre es nochmal langsam: Raus. Geradeaus. Links. Die Sieben ist rechts.", yes: "Okay! Raus, geradeaus, links, rechts. Danke schön!" }], 6);
  await say("Amani", "Dein Deutsch ist so gut! Wie lange bist du schon hier?");
  await say(ME, "Ein Jahr. Am Anfang habe ich nur »ein bisschen« gesagt. Du schaffst das auch. Schritt für Schritt.");
  await say("Amani", "Schritt für Schritt. Das merke ich mir.");
  friend("amani", 1);
  learn("zuhause");
  finish("q_amani", 40);
  set("amani_done");
  diary("d_amani", "Am Hauptbahnhof hat mich eine junge Frau gefragt: »Entschuldigung… können Sie mir helfen?« Ich habe gesagt: »Keine Sorge. Ich helfe dir.« Raus, geradeaus, links, rechts. Am Anfang haben mir andere geholfen. Jetzt helfe ich.");
  await World.call("finale_ende");
});

// Finale: der Zug nach Berlin
scene("finale_bahnhof", async () => {
  if (!flag("amani_done")) {
    await durchsage("Information zu ICE 1708 nach Berlin Hauptbahnhof: Der Zug fährt heute von Gleis 4. Abfahrt 14 Uhr 02.");
    await think("Ich habe jedes Wort verstanden. Gleis 4. Aber… dort vorne, in der Halle. Die junge Frau mit dem Zettel.");
    return;
  }
  await World.call("finale_ende");
});
scene("finale_ende", async () => {
  if (flag("finale_gesehen")) return;
  set("finale_gesehen");
  Audio_.bgmStop(1.5);
  await durchsage("Der Zug nach Berlin fährt heute von Gleis 4.");
  await think("Ich verstehe jedes Wort.");
  await think("Am Anfang habe ich versucht, in Deutschland zurechtzukommen.");
  await think("Dann habe ich angefangen, Deutschland zu verstehen.");
  await think("Und jetzt bin ich ein Teil davon. Und ich kann anderen helfen.");
  await walk("player", "DD");
  await UI.tone(1, 1.5);
  Audio_.bgm("Credits");
  await finishEpisode(10, 50);
  await Ending.show();
  S().episode = 11;
  set("epilog");
  await UI.tone(0, 1);
  await narr("<c3=3050C8,C8D0F0>Epilog:</c3> Du kannst weiterspielen, alle Städte besuchen und mit allen sprechen. Die Reisezentren bringen dich überall hin.");
});

// Abspann
const Ending = {
  async show() {
    const st = S();
    const pn = UI.add("div", "card", "");
    pn.style.opacity = "1"; pn.style.zIndex = "96";
    const friends = Object.keys(st.friends).filter(k => SR.PEOPLE[k]).map(k => SR.PEOPLE[k].name.split(" ")[0]).join(" · ");
    const q = Object.values(st.quests).filter(x => x.status === "done").length;
    pn.innerHTML = `<div class="t1">SPRACHREISE</div><div class="flag"></div><div class="t2">Deutsch B1</div><div class="t3">„Ich kenne dieses Land jetzt ein bisschen.“</div>
      <div class="t4">${U.esc(SR.playerName())} ${U.esc(SR.o("last"))} · ${U.esc(SR.o("city"))} → Berlin → Köln → Hamburg<br>
      ${st.points} Sprachpunkte · ${Object.keys(st.words).length} Wörter · ${st.typedOk} geschriebene Antworten · ${q} Aufgaben · ${st.docs.length} Dokumente<br><br>
      <b>Menschen auf dem Weg:</b><br>${U.esc(friends)}<br><br>
      Danke fürs Spielen. Schritt für Schritt.</div>`;
    if (UI.test()) SR_TEST.onBanner("ENDE", "Sprachreise");
    await U.sleep(UI.test() ? 0 : 1200);
    await Input.waitKey(["ok", "back"]);
    pn.innerHTML = `<div class="t2" style="font-size:26px">Mitwirkende</div><div class="t4" style="max-width:470px">
      Spielidee & Design: Sprachreise-Team<br>Engine (Web): eigene JavaScript-Engine nach dem Vorbild von RPG Maker XP / Pokémon Essentials<br><br>
      Grafiken: Pokémon Essentials v21.1 (Maruno u. a.) · Train Station: Ekat99 · Kölner Dom: Baertierchen · Magnetbahn/ICE: Lo8jd · City-Autotiles: Pokémon Gaia · Gen-4-Overworlds: Vanilla Sunshine, Neo-Spriteman, Purple Zaffre, Maicerochico, Atomic Reactor<br>
      Musik & Klänge: Pokémon Essentials (MIDI, als Chiptune gespielt)<br>Schrift: Power Green (Essentials)<br><br>
      Nicht-kommerzielles Fanprojekt. Alle Behördenabläufe sind vereinfacht dargestellt – keine Rechtsberatung.</div>`;
    await U.sleep(UI.test() ? 0 : 600);
    await Input.waitKey(["ok", "back"]);
    pn.style.opacity = "0";
    await U.sleep(UI.test() ? 0 : 500);
    pn.remove();
  },
};
