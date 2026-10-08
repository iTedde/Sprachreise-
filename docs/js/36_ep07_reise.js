// Sprachreise – Episode 7: Deutschland entdecken (Alltag, Reise)
// Köln → Frankfurt (Umsteigen, Gleiswechsel) → München (Carmen) → Dresden (Oksana) → Berlin (WG) → Köln
// Deutschland: Bahnfahren, Dialekte (Bairisch, Sächsisch), Geschichte (Frauenkirche), regionale Wörter
// Deutsch: Durchsagen verstehen, im Zug nachfragen, Postkarten schreiben, Anweisungen geben
// Menschen: Carmen, Oksana, (Jonas, Mai, Kofi, Tarek) · Veränderung: Aus der Reisenden mit Zettel wird eine, die anderen erklärt, wer was kauft.
"use strict";

Object.assign(SR.WORDS, {
  urlaub: { de: "Urlaub", art: "der", en: "holiday, vacation", cat: "Arbeit", ex: "Ich habe eine Woche Urlaub." },
  deutschlandticket: { de: "Deutschlandticket", art: "das", en: "Germany ticket (monthly pass)", cat: "Reisen", ex: "Mit dem Deutschlandticket fahre ich Regionalzüge in ganz Deutschland.", note: "Gilt im Nahverkehr (Bus, U-Bahn, Regionalzug) – nicht im ICE!" },
  zugbindung: { de: "Zugbindung", art: "die", en: "train-specific ticket", cat: "Reisen", ex: "Bei Verspätung ist die Zugbindung aufgehoben.", note: "Sparpreis = nur dieser Zug. Bei großer Verspätung darf man einen anderen nehmen." },
  gleiswechsel: { de: "Gleiswechsel", art: "der", en: "platform change", cat: "Reisen", ex: "Achtung, Gleiswechsel! Der Zug fährt heute von Gleis 9.", pts: 5 },
  anschluss: { de: "Anschluss", art: "der", en: "connection", cat: "Reisen", ex: "Erreiche ich meinen Anschluss in Frankfurt?" },
  servus: { de: "Servus!", en: "Hi! / Bye! (Bavaria, Austria)", cat: "Dialekt", ex: "Servus, Carmen!", note: "In Bayern sagt man auch »Grüß Gott«." },
  semmel: { de: "Semmel", art: "die", pl: "die Semmeln", en: "bread roll (Bavaria)", cat: "Dialekt", ex: "Zwei Semmeln, bitte!", note: "Berlin: Schrippe · Bayern: Semmel · sonst: Brötchen" },
  brezel: { de: "Brezel", art: "die", pl: "die Brezeln", en: "pretzel", cat: "Essen", ex: "Eine Brezel mit Butter, bitte.", note: "In Bayern: die Brezn." },
  mass: { de: "Maß", art: "die", en: "litre of beer (Bavaria)", cat: "Dialekt", ex: "Eine Maß ist ein ganzer Liter!" },
  postkarte: { de: "Postkarte", art: "die", pl: "die Postkarten", en: "postcard", cat: "Alltag", ex: "Ich schreibe eine Postkarte aus München." },
  wiederaufbau: { de: "Wiederaufbau", art: "der", en: "reconstruction", cat: "Geschichte", ex: "Der Wiederaufbau der Frauenkirche dauerte elf Jahre." },
  versoehnung: { de: "Versöhnung", art: "die", en: "reconciliation", cat: "Geschichte", ex: "Die Frauenkirche ist ein Symbol für Versöhnung.", pts: 5 },
  saechsisch: { de: "Sächsisch", art: "das", en: "Saxon dialect", cat: "Dialekt", ex: "»Nu« heißt auf Sächsisch »ja«." },
});

Object.assign(SR.QUESTS, {
  q_reise: { title: "Eine Woche Deutschland", ep: 7,
    desc: "Eine Woche Urlaub! Carmen wartet in München, Mai und Jonas in Berlin. Und dazwischen: Dresden. Die Route: Köln – Frankfurt – München – Dresden – Berlin.",
    steps: [["ticket", "Im Reisezentrum Köln die Reise buchen"], ["frankfurt", "In Frankfurt umsteigen"], ["muenchen", "Carmen in München besuchen"],
            ["dresden", "Dresden ansehen"], ["berlin", "Die WG in Berlin besuchen"], ["zurueck", "Zurück nach Köln"]] },
  q_postkarte: { title: "Grüße aus München", ep: 7, side: true,
    desc: "Herr Wagner war nie weg. Ich schicke ihm eine Postkarte.",
    steps: [["schreiben", "Eine Postkarte schreiben"]] },
  q_dialekt: { title: "Servus, Moin, Nu!", ep: 7, side: true,
    desc: "In jeder Stadt klingt Deutsch anders.",
    steps: [["bairisch", "Bairisch verstehen"], ["saechsisch", "Sächsisch verstehen"]] },
});

// ------------------------------------------------------------------------------
scene("ep7_vorabend", async () => {
  await UI.tone(0.6, 0.4);
  await narr("Zwei Wochen später, auf Station 3B.");
  await UI.tone(0, 0.4);
  await say("Herr Brückner", "Frau {nachname}, Sie haben seit drei Monaten keinen Tag frei gehabt. Außer der Grippe. Die zählt nicht.");
  await say("Herr Brückner", "Ab Montag haben Sie eine Woche Urlaub. Das ist keine Bitte. Das ist der Dienstplan.");
  learn("urlaub");
  await sms("Carmen 🇪🇸", [{ from: "Carmen", text: "{name}!!! Du hast Urlaub?? Komm nach MÜNCHEN! Du hast es versprochen 🥨🍺" }],
    { prompt: "Antworte Carmen: Du kommst nach München!", answers: ["Ja, ich komme nach München!", "Ich komme!"], mode: "sentence", minWords: 2,
      need: [["komme", "besuche"], ["münchen", "muenchen", "dich"]], tips: ["»Ich komme …«", "Wohin? Nach M…"] },
    [{ from: "Carmen", text: "¡¡SÍ!! Ich zeige dir den Biergarten! Und den Eisbach! Und eine Brezel so groß wie dein Kopf!" }]);
  await sms("WG Lehrter 12 🏠", [{ from: "Mai", text: "Hast du gehört? Ich habe die Prüfung bestanden!! 🎓 Und ich habe eine Stelle in Hamburg! Komm uns besuchen, bevor ich umziehe!" }],
    null, [{ from: "Jonas", text: "Und ich habe meine Bachelorarbeit abgegeben. Nach 14 Semestern. Ein Wunder. Wir feiern!" }], { group: true });
  await think("München, Berlin… und dazwischen? Dresden! Ich wollte immer die Frauenkirche sehen.");
  await UI.episodeCard(7, "Frankfurt, München, Dresden, Berlin.\nEine Woche Urlaub – und ganz viel Deutschland.");
  set("ep7_started");
  quest("q_reise");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Die Reise beginnt im Reisezentrum am Kölner Hauptbahnhof.");
});
scene("ep7_start", async () => { await think("Morgen beginnt mein Urlaub. Ich muss zum Hauptbahnhof!"); });

scene("reise_start", async () => {
  learn("deutschlandticket", "zugbindung");
  await say("DB-Mitarbeiterin", "Guten Tag! Wohin soll's gehen?");
  await say(ME, "Ich möchte von Köln über Frankfurt nach München. Und dann nach Dresden und Berlin.");
  await say("DB-Mitarbeiterin", "Eine Rundreise! Haben Sie ein Deutschlandticket?");
  await Mini.quiz([
    { speaker: "DB-Mitarbeiterin", q: "Mit dem Deutschlandticket darf ich…", o: ["nur Regionalzüge, Busse und Bahnen fahren", "alle Züge fahren, auch ICE", "nur in Köln fahren"], a: 0,
      why: "Das Deutschlandticket gilt im Nahverkehr: Regionalzüge, S-Bahn, U-Bahn, Bus. Für ICE und IC braucht man eine andere Fahrkarte." },
    { speaker: "DB-Mitarbeiterin", q: "Ein Sparpreis mit Zugbindung heißt…", o: ["Ich darf nur den gebuchten Zug nehmen.", "Ich darf jeden Zug nehmen.", "Ich muss den Zug selbst fahren."], a: 0,
      why: "Zugbindung = nur dieser Zug. Außer bei großer Verspätung." },
  ], 5);
  await say("DB-Mitarbeiterin", "Ich empfehle Ihnen: Sparpreise für die ICEs. Köln–Frankfurt–München, umsteigen in Frankfurt. Sieben Minuten Umstiegszeit.");
  await say(ME, "Sieben Minuten? Reicht das?");
  await say("DB-Mitarbeiterin", "Theoretisch ja.");
  learn("umsteigen", "anschluss");
  step("q_reise", "ticket");
  set("reise_frankfurt");
  unlockCity("frankfurt", true); unlockCity("muenchen", true); unlockCity("dresden", true);
  await Karte.travel("frankfurt", { allowed: ["frankfurt"] });
});

// ------------------------------------------------------------------------------
// Frankfurt Hbf: Verspätung, Gleiswechsel
// ------------------------------------------------------------------------------
scene("frankfurt_ankunft", async () => {
  set("frankfurt_ankunft");
  await narr("Frankfurt (Main) Hauptbahnhof. Ein riesiger Kopfbahnhof. Draußen: Hochhäuser. »Mainhattan«, sagen die Leute.");
  Audio_.se("tab_start", 0.8);
  const lines = ["Information zu ICE 627 nach München Hauptbahnhof, planmäßige Abfahrt 11 Uhr 13:",
    "Heute circa 20 Minuten später. Grund dafür ist eine Reparatur am Zug.",
    "Bitte beachten Sie: Der Zug fährt heute von Gleis 9, nicht von Gleis 7. Wir bitten um Entschuldigung."];
  const slow = ["ICE 627 nach München.", "Er kommt 20 Minuten später. Ungefähr 11:33 Uhr.", "Neues Gleis: Gleis NEUN. Nicht Gleis sieben."];
  let heard = lines;
  while (true) {
    for (const l of heard) await say("Durchsage", "♪ " + l);
    const k = await ask(ME, "(Habe ich alles verstanden?)", ["Ja, alles verstanden.", "Nein – ich frage die Zugbegleiterin."], -1, { correct: 0 });
    if (k === 0) break;
    await say("Zugbegleiterin", "Die Durchsage? Ich erkläre es langsam:");
    heard = slow;
  }
  await Mini.quiz([
    { q: "Wie viel Verspätung hat der ICE nach München?", o: ["Ungefähr 20 Minuten", "Gar keine", "Zwei Stunden"], a: 0, why: "»Heute circa 20 Minuten später.«" },
    { q: "Von welchem Gleis fährt der Zug heute?", o: ["Gleis 9", "Gleis 7", "Gleis 20"], a: 0, why: "»Der Zug fährt heute von Gleis 9, nicht von Gleis 7.« Das ist ein Gleiswechsel!" },
    { q: "Warum ist der Zug zu spät?", o: ["Wegen einer Reparatur", "Wegen des Wetters", "Der Lokführer hat verschlafen"], a: 0, why: "»Grund dafür ist eine Reparatur am Zug.«" },
  ], 6);
  learn("gleiswechsel", "verspaetung");
  giveSkill("reisen");
  await think("Gleis 9. Der Zug kommt 20 Minuten später. Und ich habe ganz allein die Durchsage verstanden.");
  step("q_reise", "frankfurt");
});
scene("frankfurt_anzeige", async () => {
  await UI.withPaper("ABFAHRT · Frankfurt (Main) Hbf", "<b>Zeit   Zug       Ziel                Gleis</b>\n11:13  ICE 627   München Hbf         <c3=C03030,F0C0C0>9</c3>  <c3=E04040,F0C0C0>+20</c3>\n11:18  RE 50     Fulda               14\n11:25  ICE 1559  Dresden Hbf         8\n11:40  S 8       Flughafen           Tief 101", "screen", async () => {
    await think("ICE 627 – Gleis 9, plus 20 Minuten. Die rote Neun heißt: Gleiswechsel!");
  }, { mono: true });
});
scene("zugbegleiterin", async () => {
  face();
  if (flag("frankfurt_frage")) { await say("Zugbegleiterin", "Gleis 9! Und keine Sorge: Wenn Sie den Anschluss verpassen, ist die Zugbindung aufgehoben."); return; }
  await say("Zugbegleiterin", "Kann ich Ihnen helfen?");
  await Typing.task({ speaker: "Zugbegleiterin", prompt: "Frag die Zugbegleiterin, ob der Zug auf Gleis 9 nach München fährt.", answers: ["Fährt dieser Zug nach München?", "Fährt der Zug auf Gleis 9 nach München?"],
    mode: "sentence", place: "top", label: "Nachfragen", need: [["fährt", "faehrt"], ["zug", "ice"], ["münchen", "muenchen"]],
    tips: ["Frage: Das Verb steht am Anfang: »Fährt …?«", "Wer fährt? Der Z…", "Wohin? Nach M…"] });
  await say("Zugbegleiterin", "Ja, genau. ICE 627 nach München, heute Gleis 9. Und weil er 20 Minuten zu spät ist: Ihre Zugbindung ist aufgehoben. Sie dürfen auch den nächsten ICE nehmen.");
  set("frankfurt_frage");
  points(4);
});
scene("reisender_f", async () => { face(); await say("Reisender", "Ich pendle jeden Tag Mannheim–Frankfurt. Ich habe ein Buch angefangen, als die Verspätungen anfingen. Ich bin jetzt bei Band 7."); });
scene("bankerin", async () => { face(); await say("Bankerin", "Ich arbeite in der Bank da drüben. Im 40. Stock. Von oben sieht die Verspätung sehr klein aus."); });
scene("gleis7", async () => { await narr("Gleis 7. Leer. Ein Schild: »ICE 627 heute Gleis 9.«"); await think("Gut, dass ich die Durchsage verstanden habe."); });
scene("gleis9", async () => {
  if (!stepDone("q_reise", "frankfurt")) { await narr("Gleis 9."); return; }
  await narr("Gleis 9. Der ICE 627 rollt ein. 11:34 Uhr. »Nur« 21 Minuten zu spät.");
  if ((await ask(null, "Einsteigen nach München?", ["Ja, einsteigen!", "Noch nicht"], -1, { correct: 0, multi: true })) !== 0) return;
  await Karte.travel("muenchen", { allowed: ["muenchen"] });
});

// ------------------------------------------------------------------------------
// München – Carmen, Bairisch, Biergarten, Eisbach, Postkarte
// ------------------------------------------------------------------------------
scene("muenchen_ankunft", async () => {
  set("muenchen_ankunft");
  await narr("München. Die Sonne scheint, die Kirchen läuten, irgendwo spielt eine Blaskapelle.");
  await think("Carmen wollte mich am Marienplatz treffen. Vor dem Rathaus mit dem Glockenspiel.");
});
scene("carmen_muc", async () => {
  face();
  if (stepDone("q_reise", "muenchen")) {
    if (!done("q_postkarte")) { await say("Carmen", "Hast du schon die Postkarte für deinen Nachbarn geschrieben? Der Briefkasten ist da vorne!"); return; }
    await say("Carmen", "Dresden ist schön, sagt man. Ruhiger als München. Schick mir ein Foto von der Elbe! Der Zug fährt vom Hauptbahnhof – einfach nach Süden.");
    return;
  }
  if (!flag("carmen_muc_hallo")) {
    await say("Carmen", "¡{name}! Servus! So sagt man hier: Servus! Für Hallo UND für Tschüss. Praktisch, oder?");
    learn("servus");
    friend("carmen", 1);
    await say("Carmen", "Und manche Leute sagen »Grüß Gott«. Ich dachte am Anfang, das ist ein Gebet. Ist es aber nicht. Es heißt einfach »Guten Tag«.");
    await say("Carmen", "Wie geht es dir? Ich will alles wissen! Arbeit, Wohnung, Köln!");
    const i = await ask(ME, "(Was erzähle ich?)", [
      "Ich arbeite im Krankenhaus, ich habe eine Wohnung und einen Nachbarn, der mir Suppe gebracht hat, als ich krank war.",
      "Gut. Alles gut.",
    ], -1, { correct: 0 });
    if (i === 0) { points(6, "erzählt"); await say("Carmen", "Ein Nachbar mit Suppe? In Deutschland?! Das ist wie ein Einhorn!"); }
    else await say("Carmen", "Nur »gut«? Ich will Details! Na komm, im Biergarten erzählst du mehr.");
    set("carmen_muc_hallo");
    await say("Carmen", "Erst Biergarten, dann zeige ich dir die Surfer im Eisbach. Ja, Surfer! Mitten in der Stadt!");
    return;
  }
  if (!flag("muc_biergarten")) { await say("Carmen", "Der Biergarten ist da drüben, rechts. Bestell du – ich will dein Deutsch hören!"); return; }
  if (!flag("muc_eisbach")) { await say("Carmen", "Und jetzt: Eisbach! Im Englischen Garten, links."); return; }
  await say("Carmen", "Weißt du, manchmal habe ich Heimweh. Nach Sevilla, nach der Sonne, nach meiner Mutter. Und dann gehe ich in den Biergarten und denke: Hier ist auch Sonne. Manchmal.");
  await say("Carmen", "Am Anfang war München so fremd. Jetzt kenne ich die Kinder in meiner Kita, die Bäckerin, den Busfahrer. Das ist Heimat, oder? Leute, die man kennt.");
  const j = await ask(ME, "(…)", ["Ja. Heimat sind die Leute, die man kennt.", "Ich weiß nicht. Ich habe zwei Heimaten."]);
  await say("Carmen", j === 1 ? "Zwei Heimaten. Das ist kein Problem. Das ist ein Reichtum." : "Genau. Und du hast jetzt Leute in Berlin, Köln – und München.");
  step("q_reise", "muenchen");
  friend("carmen", 1);
  diary("d_muc", "München mit Carmen: »Servus«, Brezn, Surfer im Eisbach. Carmen sagt, Heimat sind die Leute, die man kennt. Dann habe ich jetzt drei Heimaten. Oder vier.");
});
scene("resi", async () => { face(); await World.call("biergarten_muc"); });
scene("biergarten_muc", async () => {
  if (flag("muc_biergarten")) { await say("Resi", "Na, no a Brezn? Oder a Radler? Mir ham ois!"); return; }
  if (!flag("carmen_muc_hallo")) { await say("Resi", "Servus! Setzen S' Eahna nur hin!"); return; }
  await narr("Der Biergarten. Kastanienbäume, lange Bänke, Blasmusik. Eine Bedienung in Dirndl kommt.");
  await say("Resi", "Grüß Gott! Wos derf's sei?");
  await think("»Was darf's sein?« – auf Bairisch.");
  await Typing.task({ speaker: "Resi", prompt: "Bestell eine Brezel und ein Wasser.", answers: ["Eine Brezel und ein Wasser, bitte."], mode: "sentence", place: "top", label: "Bestellen",
    need: [["brezel", "brezn", "breze"], ["wasser", "apfelschorle", "radler"]], tips: ["Was isst du? Eine B…", "Und zu trinken? Ein W…"] });
  learn("brezel");
  await say("Resi", "A Brezn und a Wasser. Wasser! Im Biergarten! Mei, mei. Kimmt glei.");
  await say("Carmen", "Hier heißt die Brezel »Brezn«. Und das Brötchen »Semmel«. Und ein großes Bier ist eine »Maß« – ein Liter!");
  learn("semmel", "mass");
  await Mini.quiz([
    { speaker: "Carmen", q: "In Berlin sagt man »Schrippe«. Und in München?", o: ["Semmel", "Schrippe", "Brötchen"], a: 0, why: "In Bayern: die Semmel. Ein Brot, drei Namen!" },
    { speaker: "Carmen", q: "»Servus« heißt…", o: ["Hallo und Tschüss", "Danke", "Prost"], a: 0, why: "Servus = Hallo UND Tschüss. Sehr effizient." },
  ], 4);
  step("q_dialekt", "bairisch");
  set("muc_biergarten");
  points(6);
});
scene("surfer", async () => {
  face();
  await say("Surfer", "Servus! Die Welle hier ist das ganze Jahr da. Auch im Winter. Dann surfe ich mit Neoprenanzug und Mütze.");
  if (flag("muc_biergarten")) set("muc_eisbach");
});
scene("eisbach", async () => {
  await narr("Der Eisbach im Englischen Garten. Das Wasser ist kalt und schnell. Und mittendrin: ein Surfer.");
  await think("Surfen mitten in der Stadt. Das hätte ich in Deutschland nicht erwartet.");
  if (flag("muc_biergarten")) set("muc_eisbach");
});
scene("glockenspiel", async () => { await narr("Das Glockenspiel im Rathausturm. Um 11 und 12 Uhr tanzen die Figuren. Hunderte Touristen filmen es. Jeden Tag."); });
scene("muenchner", async () => {
  face();
  await say("Münchner", "Grüß Gott! Sie sind ned von hier, gell? Macht nix. I bin aus Franken. Für die Münchner bin I a ned von hier.");
});
scene("touristin_muc", async () => { face(); await say("Touristin", "Excuse me – where is the Hofbräuhaus? …Ach, Sie sprechen Deutsch? Wo ist das Hofbräuhaus? Ich habe Durst."); });
scene("postkarte_muc", async () => {
  learn("postkarte");
  if (done("q_postkarte")) { await narr("Ein gelber Briefkasten. Meine Karte ist schon drin."); return; }
  quest("q_postkarte");
  await narr("Ein gelber Briefkasten. Ich habe eine Postkarte gekauft: Die Frauenkirche… nein, das ist Dresden. Das Rathaus mit Glockenspiel.");
  await Typing.task({ prompt: "Schreib Herrn Wagner eine Postkarte.\n<span class=sub>(Zum Beispiel: »Lieber Herr Wagner, viele Grüße aus München! …«)</span>",
    answers: ["Lieber Herr Wagner, viele Grüße aus München!"], mode: "sentence", place: "top", label: "Postkarte", pts: 8,
    need: [["grüße", "gruesse", "gruß", "gruss"], ["münchen", "muenchen"]], tips: ["»Viele Grüße …«", "Woher? Aus M…"], forbid: ["du", "dir", "dich"], forbidMsg: "Herr Wagner – noch mit »Sie«!" });
  Audio_.se("putdown", 0.7);
  await narr("Klack. Die Postkarte ist im Briefkasten.");
  finish("q_postkarte", 10);
  friend("wagner", 1);
  await think("Er war nie weg. Jetzt kommt ein bisschen München zu ihm.");
});
scene("muc_hbf", async () => {
  if (!stepDone("q_reise", "muenchen")) { await think("Erst Carmen! Sie wartet am Rathaus."); await walk("player", "U"); return; }
  if ((await ask(null, "Weiter nach Dresden?", ["Ja, zum Zug!", "Noch nicht"], -1, { correct: 0, multi: true })) !== 0) { await walk("player", "U"); return; }
  await Karte.travel("dresden", { allowed: ["dresden"] });
});

// ------------------------------------------------------------------------------
// Dresden – Frauenkirche, Oksana, Sächsisch
// ------------------------------------------------------------------------------
scene("dresden_ankunft", async () => {
  set("dresden_ankunft");
  await narr("Dresden. Fünfeinhalb Stunden Zug, zweimal umsteigen. Aber hier ist es still. Die Elbe glitzert. Die Kuppel der Frauenkirche leuchtet in der Abendsonne.");
  await think("Dort vor der Kirche steht eine Gruppe mit einer Stadtführerin. Ich gehe hin.");
});
scene("oksana", async () => {
  face();
  if (stepDone("q_reise", "dresden")) { await say("Oksana", "Gute Reise nach Berlin! Und vergiss nicht: Stein für Stein."); return; }
  if (!flag("oksana_tour")) {
    await say("Oksana", "…und das ist die Frauenkirche. Möchten Sie mitkommen? Die Führung ist kostenlos – ich bin noch in der Ausbildung. Sie sind meine Testgruppe!");
    await say("Oksana", "Ich heiße Oksana. Ich komme aus Charkiw, aus der Ukraine. Seit 2022 bin ich in Dresden. Mit meiner Tochter.");
    if (SR.origin() === "uk") {
      await say(ME, "Ви з Харкова? Я зі Львова! …Entschuldigung. Auf Deutsch: Ich bin aus Lwiw!");
      await say("Oksana", "<bdi>Як приємно!</bdi> Wie schön! Aber wir üben Deutsch, ja? Sonst lerne ich nie »Wiederaufbau« richtig auszusprechen.");
    }
    await say("Oksana", "In der Ukraine war ich Lehrerin. Hier mache ich eine Ausbildung zur Gästeführerin. Und ich lerne Deutsch. Jeden Tag. B1 habe ich schon!");
    friend("oksana", 1);
    set("oksana_tour");
    await say("Oksana", "Lesen Sie zuerst die Infotafel. Dann erzähle ich Ihnen das Wichtigste.");
    return;
  }
  if (!flag("tafel_gelesen")) { await say("Oksana", "Die Infotafel ist links vor der Kirche!"); return; }
  await say("Oksana", "1945 wurde die Kirche im Krieg zerstört. Fast 50 Jahre lag sie als Ruine da. Ein Steinhaufen.");
  await say("Oksana", "Dann haben Menschen aus der ganzen Welt Geld gespendet. Auch aus Großbritannien – obwohl britische Bomber die Stadt zerstört hatten.");
  await say("Oksana", "Das goldene Kreuz auf der Kuppel hat ein britischer Goldschmied gemacht. Sein Vater war Pilot. Bei dem Angriff auf Dresden.");
  learn("versoehnung", "wiederaufbau");
  const i = await ask(ME, "(Was sage ich?)", ["Das ist ein schönes Zeichen. Für Versöhnung.", "Warum hat er das gemacht?"]);
  if (i === 1) await say("Oksana", "Weil man Krieg nicht vergessen soll. Aber man kann zusammen etwas Neues bauen. Das ist Versöhnung.");
  else await say("Oksana", "Genau. Versöhnung. Ein langes Wort für etwas sehr Schweres.");
  await say("Oksana", "Wissen Sie, warum ich diese Kirche liebe? Weil sie mir Hoffnung gibt. Auch eine zerstörte Kirche kann man wieder aufbauen. Stein für Stein.");
  await think("Stein für Stein. Schritt für Schritt. Wie der Musiker in Berlin gesagt hat.");
  step("q_reise", "dresden");
  friend("oksana", 1);
  diary("d_dresden", "Dresden. Oksana aus Charkiw hat mir die Frauenkirche gezeigt. 1945 zerstört, 2005 wieder aufgebaut – mit Geld aus der ganzen Welt. Oksana sagt: »Stein für Stein.« Sie hat ihr ganzes Leben neu angefangen. Und sie lacht trotzdem.");
});
scene("frauenkirche_tafel", async () => {
  await UI.withPaper("Frauenkirche Dresden", "Erbaut 1726–1743 von George Bähr.\nAm 15. Februar 1945 nach den Luftangriffen eingestürzt.\nJahrzehntelang Ruine und Mahnmal.\n<b>Wiederaufbau 1994–2005</b>, finanziert vor allem durch Spenden aus aller Welt.\nHeute: ein Symbol der <b>Versöhnung</b>.", "board", async () => {
    await Mini.quiz([
      { q: "Wann wurde die Kirche zerstört?", o: ["1945", "1743", "2005"], a: 0, why: "»Am 15. Februar 1945 … eingestürzt.«" },
      { q: "Wer hat den Wiederaufbau bezahlt?", o: ["Vor allem Spenden aus aller Welt", "Nur die Stadt Dresden", "Eine Bank"], a: 0, why: "»… finanziert vor allem durch Spenden aus aller Welt.«" },
      { q: "Wie lange dauerte der Wiederaufbau?", o: ["Elf Jahre", "Zwei Jahre", "Hundert Jahre"], a: 0, why: "1994 bis 2005 = elf Jahre." },
    ], 5);
  });
  set("tafel_gelesen");
});
scene("lehmann", async () => {
  face();
  if (stepDone("q_dialekt", "saechsisch")) { await say("Herr Lehmann", "Nu, gloar! Gomm Se wieder!"); return; }
  await say("Herr Lehmann", "Nu? Ä Bradworschd? Mid Sänf?");
  await think("…Was?");
  await Mini.quiz([{ speaker: "Herr Lehmann", q: "Was will Herr Lehmann wissen?", o: ["Ob ich eine Bratwurst mit Senf möchte", "Wie spät es ist", "Woher ich komme"], a: 0,
    why: "»Ä Bradworschd mid Sänf« = eine Bratwurst mit Senf. Sächsisch! Die harten Konsonanten werden weich." }], 5);
  await say(ME, "Ja, gerne. Eine Bratwurst mit Senf, bitte.");
  await say("Herr Lehmann", "Nu, gloar! – Na klar! »Nu« heeßt »ja«. Das isses Wichdigste.");
  learn("saechsisch");
  step("q_dialekt", "saechsisch");
  if (stepDone("q_dialekt", "bairisch")) finish("q_dialekt", 12);
});
scene("elbe", async () => { await narr("Die Elbe. Auf der anderen Seite: Weinberge und Villen. Weiter hinten: das »Blaue Wunder«, eine alte Brücke."); });
scene("kind_dresden", async () => { face(); await say("Kind", "Wusstest du, dass Dresden »Elbflorenz« heißt? Florenz ist in Italien. Dresden ist schöner. Sagt mein Opa."); });
scene("touristin_dd", async () => { face(); await say("Touristin", "Ich komme jedes Jahr wegen des Striezelmarkts. Das ist der älteste Weihnachtsmarkt Deutschlands. Und der Stollen!"); });
scene("dd_hbf", async () => {
  if (!stepDone("q_reise", "dresden")) { await think("Erst die Frauenkirche!"); await walk("player", "R"); return; }
  if ((await ask(null, "Weiter nach Berlin?", ["Ja, nach Berlin!", "Noch nicht"], -1, { correct: 0, multi: true })) !== 0) { await walk("player", "R"); return; }
  set("besuch_berlin");
  await Karte.travel("berlin", { allowed: ["berlin"], dest: ["hbf", 16, 17, 2] });
});

// ------------------------------------------------------------------------------
// Berlin – Wiedersehen mit der WG
// ------------------------------------------------------------------------------
scene("hbf_besuch", async () => {
  set("besuch_berlin_hbf");
  await narr("Berlin Hauptbahnhof. Derselbe Bahnhof wie vor vier Monaten. Aber ich bin nicht mehr dieselbe.");
  await say("Tarek", "Moment… Frau {nachname}?! Was machen Sie denn hier?");
  face(ev("Tarek"));
  const i = await ask(ME, "(Was sage ich?)", [
    "Hallo Tarek! Ich habe Urlaub und besuche meine alte WG. Ich komme gerade aus Dresden – und vorher war ich in München.",
    "Hallo! Urlaub.",
  ], -1, { correct: 0 });
  if (i === 0) { points(6); await say("Tarek", "München, Dresden, Berlin… Und das alles in perfektem Deutsch. Vor vier Monaten: »Lehrter Straße… wo?«"); }
  else await say("Tarek", "Urlaub! Schön. Kurz und bündig. Wie eine echte Berlinerin.");
  await say("Tarek", "Ich muss Ihnen was sagen: Ich erkläre jeden Tag hundert Leuten den Weg. Aber Sie sind die Einzige, die mir eine Postkarte aus Köln geschickt hat.");
  await say(ME, "…Habe ich das?");
  await say("Tarek", "Nein. Aber Sie sollten. Haha! Viel Spaß in der WG!");
  friend("tarek", 1);
  await think("Die Lehrter Straße. Raus, rechts, links, geradeaus. Ich brauche keine Wegbeschreibung mehr.");
});
scene("wg_besuch", async () => {
  set("wg_besuch_done");
  step("q_reise", "berlin");
  place("Jonas", 6, 5, 2); place("Mai", 4, 5, 6);
  set("party"); World.refresh();
  place("Kofi WG", 1, 6, 6); show("Carmen WG", false); show("Mohammed WG", false); show("Ercan WG", false);
  await say("Jonas", "SIE IST DA! Die Kölnerin!");
  await say("Mai", "{name}! Du siehst so… erwachsen aus. Ist das die Pflege? Oder Köln?");
  await say("Kofi", "Kölsch. Es ist Kölsch.");
  await say("Jonas", "Wir kochen! Nudeln mit Tomatensoße. Was sonst. Aber: Wir haben nichts im Kühlschrank.");
  await say("Mai", "Und diesmal planst du, {name}! Wer kauft was? Du bist ja jetzt der Profi.");
  await think("Ich soll planen. Wie Jonas am ersten Tag. Nur… besser.");
  await Typing.task({ prompt: "Sag Jonas, was er kaufen soll: Zwiebeln und Tomaten.\n<span class=sub>(Zum Beispiel: »Jonas, kannst du bitte Zwiebeln und Tomaten kaufen?«)</span>",
    answers: ["Jonas, kannst du bitte Zwiebeln und Tomaten kaufen?"], mode: "sentence", place: "top", label: "Planen", pts: 8,
    need: [["kannst", "könntest", "kauf"], ["zwiebeln", "zwiebel"], ["tomaten", "tomate"]], tips: ["Frag Jonas: »Kannst du …?«", "Was? Z…", "Und? T…"] });
  await say("Jonas", "Jawohl, Chefin!");
  await Typing.task({ prompt: "Und Kofi soll Nudeln holen.", answers: ["Kofi, kannst du bitte Nudeln holen?"], mode: "sentence", place: "top", label: "Planen", pts: 6,
    need: [["kannst", "könntest", "hol", "kauf"], ["nudeln"]], tips: ["»Kofi, kannst du …?«", "Was? N…"] });
  await say("Kofi", "Nudeln. Ich kann Nudeln. Ich bin Ingenieur.");
  await say("Mai", "Siehst du? Vor vier Monaten hast du gefragt: »Was kochen wir?« Heute verteilst du die Aufgaben.");
  await UI.tone(1, 0.5);
  await narr("Eine Stunde später. Drei Teller Nudeln, ein Salat, vier Freunde, ein Spiel »Stadt – Land – Fluss«. Buchstabe: M.");
  await UI.tone(0, 0.5);
  const res = await SLF.round("M", { Jonas: { Stadt: "München", Land: "Marokko", Fluss: "Main" }, Mai: { Stadt: "Manila", Land: "Malaysia", Fluss: "Mekong" } });
  await UI.withPaper("Stadt – Land – Fluss · Buchstabe M", "<b>Du</b>\n" + res.lines.join("\n") + `\n<b>Summe: ${res.total}</b>\n\n<b>Jonas</b>: München, Marokko, Main\n<b>Mai</b>: Manila, Malaysia, Mekong`, "paper", async () => {
    await say("Jonas", "MAIN! Ich kenne einen Fluss mit M! Nach vier Monaten Training!");
    await say("Mai", "Zehn Punkte für Jonas. Ich bin so stolz.");
  });
  points(8);
  await say("Mai", "Ich muss dir was sagen. Ich ziehe nach Hamburg. Uniklinikum, Intensivstation. Mit Weiterbildung!");
  await say(ME, "Hamburg! Das ist toll, Mai!");
  await say("Mai", "Und… da gibt es noch eine Stelle. Im selben Team. Für Leute mit B1 und Erfahrung. Ich sag ja nur.");
  await think("Hamburg. Ich habe gerade erst in Köln angefangen…");
  await say("Jonas", "Kein Druck! Aber wenn ihr beide in Hamburg seid, bin ich der Einzige, der in Berlin keine Fluss-Namen kennt.");
  friend("jonas", 1); friend("mai", 1); friend("kofi", 1);
  unset("party"); World.refresh();
  diary("d_berlin2", "Zurück in der WG. Ich habe geplant, wer was kauft. Jonas hat mich »Chefin« genannt. Und Mai geht nach Hamburg – sie sagt, da gibt es eine Stelle für mich. Ich habe nicht Nein gesagt. Ich habe auch nicht Ja gesagt.");
  await think("Morgen fahre ich zurück nach Köln. Mit dem Zug vom Hauptbahnhof.");
  set("berlin_rueckfahrt");
});
scene("reise_zurueck", async () => {
  if ((await ask(null, "Zurück nach Köln fahren?", ["Ja", "Noch nicht"], -1, { correct: 0, multi: true })) !== 0) return;
  await Karte.travel("koeln", { allowed: ["koeln"], dest: ["koeln_hbf", 12, 17, 8] });
  step("q_reise", "zurueck");
  finish("q_reise", 40);
  unset("besuch_berlin");
  diary("d_ep7", "Eine Woche, fünf Städte, drei Dialekte, eine Durchsage mit Gleiswechsel. Ich bin durch Deutschland gefahren. Allein. Und ich habe mich nie verloren gefühlt.");
  await finishEpisode(7, 25);
  await World.call("ep8_vorabend");
});
