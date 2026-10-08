// Sprachreise – Episode 1: Ankommen (Alltag) · Berlin Hauptbahnhof, Moabit, WG
// Sprache: einfach (A2). Kurze Hauptsätze, Präsens.
// Deutschland: du/Sie, Pfand, Sonntagsruhe, Berlinerisch · Deutsch: Wege, Höflichkeit, Küche
// Menschen: Tarek, Jonas, Mai · Veränderung: Aus einer Fremden wird eine Mitbewohnerin.
"use strict";

Object.assign(SR.WORDS, {
  kochen: { de: "kochen", en: "to cook", cat: "Küche", ex: "Heute kochen wir zusammen." },
  schneiden: { de: "schneiden", en: "to cut", cat: "Küche", ex: "Kannst du die Zwiebel schneiden?" },
  salz: { de: "Salz", art: "das", en: "salt", cat: "Küche", ex: "Kannst du mir bitte das Salz geben?" },
  zwiebel: { de: "Zwiebel", art: "die", pl: "die Zwiebeln", en: "onion", cat: "Küche", ex: "Wo ist die Zwiebel?", pts: 5 },
  messer: { de: "Messer", art: "das", pl: "die Messer", en: "knife", cat: "Küche", ex: "Das Messer ist scharf." },
  topf: { de: "Topf", art: "der", pl: "die Töpfe", en: "pot", cat: "Küche", ex: "Die Nudeln kommen in den Topf." },
  lecker: { de: "lecker", en: "delicious", cat: "Essen", ex: "Das schmeckt lecker!" },
  buchstabieren: { de: "buchstabieren", en: "to spell", cat: "Nützliche Sätze", ex: "Können Sie das bitte buchstabieren?" },
  spieleabend: { de: "Spieleabend", art: "der", en: "games night", cat: "Freizeit", ex: "Am Freitag machen wir einen Spieleabend." },
  regel: { de: "Regel", art: "die", pl: "die Regeln", en: "rule", cat: "Freizeit", ex: "Ich verstehe die Regeln nicht." },
});

Object.assign(SR.QUESTS, {
  q_abend: { title: "Der erste gemeinsame Abend", ep: 1,
    desc: "Jonas und Mai wollen heute zusammen kochen – mit mir. Danach gibt es einen Spieleabend.",
    steps: [["zimmer", "Mein Zimmer ansehen"], ["kochen", "Zusammen kochen"], ["essen", "Zusammen essen"], ["spiel", "Stadt – Land – Fluss spielen"]] },
});

// -------------------------------------------------------------------------------
// PROLOG – Ankunft im ICE
// -------------------------------------------------------------------------------
scene("prolog", async () => {
  await UI.tone(1, 0);
  player().dir = 8;
  Audio_.bgm("New Start");
  await narr("Im ICE nach Berlin.");
  await durchsage("Sehr geehrte Fahrgäste, in wenigen Minuten erreichen wir Berlin Hauptbahnhof.");
  await think("Ich verstehe nur zwei Wörter: »Berlin« und »Hauptbahnhof«. Das ist genug!");
  await think(`${o("endlich")} Endlich. Berlin.`);
  await think(`Ich bin Krankenpflegerin. Ich komme ${o("aus")}. Ich will in Deutschland arbeiten.`);
  await think("Dafür brauche ich Deutsch. Mein Ziel: B1.");
  await think("Ich spreche schon ein bisschen. Ungefähr A2.");
  ["reisepass", "visum", "diplom", "mietvertrag"].forEach(d => doc(d, true));
  learn("reisepass", true);
  se("door_slide", 0.9);
  await UI.tone(0, 0.6);
  Audio_.bgm(World.map.d.bgm);
  UI.mapName(World.map.name);
  await durchsage("Berlin Hauptbahnhof. Bitte alle aussteigen.");
  learn("hauptbahnhof");
  await think("So viele Menschen! Und alle sprechen so schnell.");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Mit Esc (oder MENÜ) öffnest du das Menü. Dort ist deine <b>Sprachmappe</b>.");
  await narr("Blaue Wörter sind neu. Die Übersetzung steht in Klammern. Fehler sind kein Problem!");
  quest("q_ankommen");
  await think("Meine [[adresse]]: Lehrter Straße 12. Aber wo ist das? Ich frage den Mann von der Bahn. Er steht in der Halle.");
  diary("d_prolog", "Ich bin in Berlin! Im Zug habe ich die Durchsage fast verstanden. Fast. Das Wort »Hauptbahnhof« ist so lang wie der Bahnhof.");
  set("prolog_done");
});

// -------------------------------------------------------------------------------
// TAREK – DB-Mitarbeiter in der Bahnhofshalle (Mentor in Episode 1)
// -------------------------------------------------------------------------------
scene("tarek", async () => {
  face();
  if (!flag("tarek_done")) {
    await say("Tarek", "Guten Tag! Kann ich helfen?");
    const i = await ask(ME, "(Was sage ich?)", ["[[entschuldigung|Entschuldigung]], ich brauche Hilfe.", "Ich… Lehrter Straße? Wo?", "Sprechen Sie {sprache}?"], -1, { correct: 0 });
    if (i === 0) {
      points(3, "höflich gefragt"); learn("entschuldigung");
      await say("Tarek", "Sehr gerne. Was suchen Sie?");
      await say(ME, "Ich suche diese [[adresse]]. Hier, auf dem Handy.");
    } else if (i === 1) {
      await say("Tarek", "Ah, die Lehrter Straße. Kein Problem!");
      await say("Tarek", "Ein Tipp: Sagen Sie zuerst »[[entschuldigung|Entschuldigung]]«. Das ist höflich.");
      learn("entschuldigung");
    } else {
      await say("Tarek", o("tarek"));
      await say("Tarek", "Aber wir sprechen Deutsch, okay? Das hilft Ihnen hier. Was suchen Sie?");
      await say(ME, "Die Lehrter Straße. Nummer 12.");
    }
    learn("adresse");
    friend("tarek", 1);
    await say("Tarek", "Lehrter Straße 12. Also: Sie gehen hier raus zum Europaplatz, dann rechts die Invalidenstraße entlang, die erste links ist die Lehrter, dann immer geradeaus, die Zwölf ist rechts.");
    await think("…Was? Das war sehr schnell.");
    const j = await ask(ME, "(Was sage ich jetzt?)", ["Entschuldigung, ich verstehe das nicht.", "Können Sie bitte [[langsamer]] sprechen?", "Alles klar, danke!"], -1, { correct: [0, 1] });
    if (j === 0) { learn("verstehe_nicht"); await say("Tarek", "Kein Problem! Ich erkläre es langsam."); }
    else if (j === 1) { learn("langsamer"); points(3, "nachgefragt"); await say("Tarek", "Natürlich. Ganz langsam."); }
    else {
      await say("Tarek", "Wirklich? Dann eine Frage: Wohin gehen Sie nach dem Ausgang?");
      const k = await ask(ME, "(Hmm…)", ["Links.", "Rechts.", "Ich weiß es nicht mehr."], -1, { correct: 1 });
      if (k === 1) await say("Tarek", "Richtig! Ich erkläre es trotzdem nochmal langsam.");
      else { wrong("Nicht schlimm – Nachfragen ist gut!"); await say("Tarek", "Kein Problem. Nochmal langsam."); }
    }
    await say("Tarek", "Eins: Dort oben ist der [[ausgang]]."); learn("ausgang");
    await say("Tarek", "Zwei: Draußen gehen Sie [[rechts]]."); learn("rechts");
    await say("Tarek", "Drei: Die erste [[strasse|Straße]] [[links]]. Das ist die Lehrter Straße."); learn("links", "strasse");
    await say("Tarek", "Vier: Dann immer [[geradeaus]]. Die Nummer 12 ist rechts."); learn("geradeaus");
    await Mini.quiz([
      { speaker: "Tarek", q: "Also: Sie gehen raus. Und dann?", o: ["Rechts, dann links, dann geradeaus.", "Links, dann rechts, dann zurück.", "Geradeaus, bis zum Wasser."],
        a: 0, why: "Nicht ganz. Raus. Dann RECHTS. Dann LINKS. Dann GERADEAUS.", yes: "Perfekt!" },
      { speaker: "Tarek", q: "Und wo ist die Nummer 12?", o: ["Links.", "Rechts."], a: 1, why: "Die Nummern 10, 12 und 14 sind rechts." },
    ]);
    const d = await ask(ME, "(Wie sage ich danke?)", ["[[danke|Danke schön]]!", "Okay.", "Tschüss."], -1, { correct: 0 });
    learn("danke");
    if (d === 0) await say("Tarek", "Gern geschehen! Willkommen in Berlin.");
    else await say("Tarek", "Man sagt auch »Danke schön«. Das freut die Leute! Willkommen in Berlin.");
    await say("Tarek", "Ich heiße Tarek. Ich arbeite oft hier im Reisezentrum.");
    step("q_ankommen", "info");
    set("tarek_done");
    await think("Mein erstes Gespräch auf Deutsch. Und er versteht mich!");
  } else if (flag("anruf_done") && ep() === 3) {
    await say("Tarek", "Sie wollen eine Fahrkarte? Das Reisezentrum ist gleich da links. Beim Schild an der Säule.");
  } else if (ep() >= 4) {
    await say("Tarek", "Na, wen haben wir denn da! Wie ist Köln? Sagen die da wirklich bei jeder Gelegenheit »Alaaf«?");
  } else if (flag("mb_done")) {
    await say("Tarek", "Schon beim Bürgeramt angemeldet? Beim ersten Termin? Respekt!");
  } else if (ep() >= 2) {
    await say("Tarek", "Hallo! Na, wie gefällt Ihnen Berlin?");
    await say(ME, "Gut! Aber die Bürokratie ist kompliziert.");
    await say("Tarek", "Willkommen in Deutschland. Hier hat sogar die Bürokratie eine Bürokratie.");
  } else {
    await say("Tarek", "Raus, rechts, links, geradeaus. Die Zwölf ist rechts. Sie schaffen das!");
  }
});

scene("hbf_noch_nicht", async () => {
  if (!flag("prolog_done")) return;
  await think("Wohin muss ich? Ich weiß es noch nicht. Ich frage den Mann von der Bahn. Er steht in der Halle.");
  await walk("player", "D");
});

// -------------------------------------------------------------------------------
// Bahnhofshalle
// -------------------------------------------------------------------------------
scene("hbf_tafel", async () => {
  await UI.withPaper("ABFAHRT · DEPARTURE", "<b>Zeit   Zug       Ziel                Gleis</b>\n" +
    "11:52  ICE 949   Köln Hbf            4\n" +
    "11:58  ICE 1007  München Hbf         6   <c3=E04040,F0C0C0>+15 Min</c3>\n" +
    "12:03  RE 1      Frankfurt (Oder)    12  <c3=E04040,F0C0C0>fällt aus</c3>\n" +
    "12:10  IC 2027   Hamburg-Altona      7\n" +
    "12:14  S 7       Ahrensfelde         15", "screen", async () => {
    await think("»+15 Min« heißt: Der Zug kommt 15 Minuten später. Das ist eine [[verspaetung|Verspätung]].");
    await think("»Fällt aus« heißt: Der Zug kommt gar nicht.");
    learn("verspaetung", "gleis");
  }, { mono: true });
});

scene("hbf_schild", async () => {
  await narr("BERLIN HAUPTBAHNHOF");
  await narr("Oben fahren Züge von Osten nach Westen. Unten fahren Züge von Norden nach Süden.");
});

scene("hbf_pendler", async () => {
  face();
  if (count("pendler") === 1) { await say("Pendler", "[[entschuldigung|Entschuldigung]]! Keine Zeit! Mein Zug kommt!"); learn("entschuldigung"); }
  else { await say("Pendler", "Mein Zug hat 20 Minuten [[verspaetung|Verspätung]]. Wie jeden Tag."); learn("verspaetung"); }
});

scene("hbf_familie", async () => {
  face();
  if (!flag("familie_done")) {
    await say("Kind", "Mama, warum spricht die Frau so anders?");
    await say("Mutter", "Sie spricht noch eine andere Sprache. Das ist toll!");
    await say("Kind", "Ich spreche nur eine Sprache.");
    const i = await ask(ME, "(Was sage ich?)", ["Ich spreche {sprache}. Und ein bisschen Deutsch.", "Äh… Hallo."], -1, { correct: 0 });
    if (i === 0) { await say("Kind", "Ein bisschen ist schon viel!"); points(3); }
    else await say("Kind", "Hallo! Ich heiße Ben. Ich bin fünf.");
    set("familie_done");
  } else await say("Mutter", "Ben will jetzt auch {sprache} lernen. Danke!");
});

scene("hbf_reisende", async () => {
  face();
  await say("Reisende", "Ist mein Zug auf [[gleis|Gleis]] 4 oder auf Gleis 6? Die Tafel sagt 4. Die App sagt 6.");
  await say("Reisende", "Ich warte in der Mitte. Dann renne ich.");
  learn("gleis");
});

scene("baeckerei", async () => {
  face();
  if (done("q_baecker")) { await say("Bäckerin", "Na, schmeckt die Schrippe? Bis morgen!"); return; }
  quest("q_baecker");
  await say("Bäckerin", "Hallo! Was möchten Sie?");
  const i = await ask(ME, "(Bestellen…)", ["Ein Brötchen, bitte.", "Zwei Schrippen, bitte.", "Was ist eine Schrippe?"]);
  if (i === 2 || i === 0) await say("Bäckerin", "In Berlin heißt das Brötchen [[schrippe|Schrippe]]. Ein Brot, zwei Namen!");
  learn("schrippe");
  step("q_baecker", "bestellen");
  await say("Bäckerin", "Eine Schrippe. Das macht eins zwanzig.");
  await Mini.quiz([{ speaker: "Bäckerin", q: "Eins zwanzig, bitte.", o: ["1,20 Euro", "12,00 Euro", "1,02 Euro"], a: 0,
    why: "»Eins zwanzig« = ein Euro und zwanzig Cent. Also 1,20 Euro.", yes: "Danke! Schönen Tag noch!" }]);
  step("q_baecker", "bezahlen");
  finish("q_baecker", 6);
  diary("d_schrippe", "In Berlin heißt das Brötchen »Schrippe«. Im Süden heißt es »Semmel«. Ein Brot, drei Namen! Aber es ist lecker.");
});

// -------------------------------------------------------------------------------
// Europaplatz
// -------------------------------------------------------------------------------
scene("automat", async () => {
  await UI.withPaper("Fahrkartenautomat · BVG", "<b>Bitte wählen Sie:</b>\nEinzelfahrschein Berlin AB\nKurzstrecke (bis 3 Stationen U/S-Bahn)\n24-Stunden-Karte Berlin AB\nDeutschlandticket: nur im Abo\n<c3=707078,D8D8D0>(Preise im Spiel vereinfacht)</c3>", "screen", async () => {
    await think("So viele [[fahrkarte|Fahrkarten]]. Welche brauche ich?");
    learn("fahrkarte");
  });
});

scene("kowalski", async () => {
  face();
  if (done("q_automat")) { await say("Frau Kowalski", "Danke nochmal! Und immer schön stempeln!"); return; }
  quest("q_automat");
  await say("Frau Kowalski", "Hallo, junge Frau! Können Sie mir helfen? Ich habe meine Brille nicht dabei.");
  await say("Frau Kowalski", "Was steht auf dem Automaten?");
  const i = await ask(ME, "(Ich versuche es…)", ["Ja, gerne. Ich lese vor.", "Mein Deutsch ist nicht so gut…"]);
  if (i === 1) await say("Frau Kowalski", "Ach was! Sie können lesen. Lesen Sie einfach vor.");
  await say(ME, "Da steht: Einzelfahrschein. Kurzstrecke. 24-Stunden-Karte.");
  await say("Frau Kowalski", "Ich fahre nur drei Stationen. Zu meiner Tochter.");
  await Mini.quiz([{ speaker: "Frau Kowalski", q: "Welche Fahrkarte brauche ich?", o: ["Einzelfahrschein AB", "Kurzstrecke", "24-Stunden-Karte"], a: 1,
    why: "Hm, das ist zu teuer. Für drei Stationen gibt es etwas Billigeres…", yes: "Genau! Die [[kurzstrecke|Kurzstrecke]]. Sie sind ein Profi!" }]);
  learn("kurzstrecke");
  step("q_automat", "hilfe");
  await say("Frau Kowalski", "Und jetzt passen Sie auf! Die Karte müssen Sie [[entwerten]]. Da, im roten Kasten. Stempeln!");
  await say("Frau Kowalski", "Ohne Stempel ist die Karte nicht gültig. Das kostet 60 Euro Strafe!");
  await say(ME, "Ich kaufe die Karte. Aber sie ist nicht gültig? Das ist… sehr deutsch.");
  await say("Frau Kowalski", "Hihi. Willkommen in Berlin!");
  learn("entwerten");
  step("q_automat", "entwerten");
  await say("Frau Kowalski", "Und Sie? Die Lehrter Straße? Das ist ganz nah. Da gehen Sie [[zu_fuss|zu Fuß]]!");
  learn("zu_fuss");
  finish("q_automat", 10);
  diary("d_kowalski", "Eine Fahrkarte kaufen ist nicht genug. Man muss sie auch »entwerten« – stempeln. Frau Kowalski hat es mir erklärt. Und ich habe ihr vorgelesen.");
});

scene("taxi", async () => {
  face();
  await say("Taxifahrer", "Taxi? Wohin?");
  await say(ME, "Lehrter Straße?");
  await say("Taxifahrer", "Lehrter Straße? Det sind fünf Minuten [[zu_fuss|zu Fuß]]! Det lohnt sich nich.");
  learn("zu_fuss");
  await say("Taxifahrer", "Raus hier, rechts, erste links. Und »det« heißt »das«. Das ist Berlinerisch!");
  learn("wat");
});

scene("musiker", async () => {
  face();
  if (!flag("musiker_done")) {
    await narr("♪ … ♪ Ein Mann spielt Gitarre.");
    await say("Musiker", "Hey! Woher kommst du?");
    const i = await ask(ME, "(Woher komme ich?)", ["Ich komme {aus_land}.", "Ich komme aus {stadt}. Das ist {in_land}."], -1, { correct: 1 });
    points(i === 1 ? 4 : 2);
    await say("Musiker", `${o("toll")} Ich komme ${o("musiker_aus")}. Aus ${o("musiker_her").split(",")[0]}. Ich wohne seit sieben Jahren in Berlin.`);
    await say("Musiker", "Am Anfang war alles schwer. Die Sprache. Die Ämter. Der Winter!");
    await say("Musiker", `Heute ist Berlin mein Zuhause. Du schaffst das auch. ${o("schritt")} – Schritt für Schritt.`);
    set("musiker_done");
    await think("Schritt für Schritt. Das merke ich mir.");
  } else await narr(`♪ … ${o("schritt")} … ♪`);
});

// -------------------------------------------------------------------------------
// Moabit – Straßen, Schilder, Häuser
// -------------------------------------------------------------------------------
scene("schild_lehrter", async () => {
  await narr("<b>Lehrter Straße</b>");
  if (active("q_ankommen") && !stepDone("q_ankommen", "strasse")) {
    step("q_ankommen", "strasse"); learn("strasse");
    await think("Die Lehrter Straße! Jetzt geradeaus. Die Zwölf ist rechts.");
  }
});
scene("schild_invaliden", async () => { await narr("<b>Invalidenstraße</b>\n▶ Lehrter Straße    ◀ Hauptbahnhof"); });
scene("schild_turm", async () => { await narr("<b>Turmstraße</b>\nRathaus Tiergarten · Bürgeramt Moabit\n◀ Supermarkt · Eckhaus · Volkshochschule"); });
scene("schild_ba", async () => {
  await narr("<b>Bezirksamt Mitte von Berlin</b>\nBürgeramt Moabit\nTermine nur nach vorheriger Vereinbarung.");
  if (ep() < 2) await think("[[buergeramt|Bürgeramt]]? Was ist das? Es klingt wichtig.");
});
scene("ba_zu", async () => {
  await narr("Rathaus Tiergarten. Die Tür ist zu.");
  await narr("Heute ist Sonntag. Geschlossen.");
  await think("In Deutschland ist am Sonntag fast alles zu. Das ist neu für mich.");
});
scene("copy_zu", async () => {
  await narr("Copyshop »Kopierkönig«. Ein Schild: »Sonntag geschlossen«.");
  await think("Schon wieder zu! Nur der Späti ist offen.");
});
scene("turm_west_zu", async () => {
  await think(ep() < 2 ? "Da hinten geht die Turmstraße weiter. Aber heute will ich erst mal ankommen." : "Weiter hinten in der Turmstraße gibt es einen Supermarkt. Aber zuerst: die Anmeldung!");
  await walk("player", "R");
});
scene("haus10", async () => {
  await narr("Lehrter Straße <b>10</b>"); learn("hausnummer");
  if (active("q_ankommen")) step("q_ankommen", "strasse");
  if (!stepDone("q_ankommen", "klingel")) await think("Zehn. Ich brauche die Zwölf. Sie ist bestimmt daneben.");
});
scene("haus14", async () => {
  await narr("Lehrter Straße <b>14</b>"); learn("hausnummer");
  if (active("q_ankommen")) step("q_ankommen", "strasse");
  if (!stepDone("q_ankommen", "klingel")) await think("Vierzehn. Zu weit! Die Zwölf ist zwischen 10 und 14.");
});
scene("haus11", async () => {
  await narr("Lehrter Straße <b>11</b>");
  if (!stepDone("q_ankommen", "klingel")) await think("Elf. Die Zwölf ist auf der anderen Seite.");
});

scene("wg_klingel", async () => {
  if (flag("wg_klingel_ok")) {
    await narr(ep() >= 2 ? "Klingelschild 3. OG: <b>Becker / Nguyen / {nachname}</b>" : "Klingelschild 3. OG: <b>Becker / Nguyen</b>");
    if (ep() >= 2) await think("Da steht schon mein Name! Jonas hat ihn geschrieben.");
    return;
  }
  await narr("Lehrter Straße <b>12</b>");
  learn("hausnummer");
  step("q_ankommen", "strasse"); step("q_ankommen", "hausnr");
  await think("Hier ist es! Jetzt muss ich klingeln. Aber bei wem?");
  learn("klingel");
  while (true) {
    const i = await ask(null, "<b>Klingelschilder</b>", ["EG: Nowak", "1. OG: Yılmaz", "2. OG: Hausverwaltung Schulz", "3. OG: Becker / Nguyen"], -1, { correct: 3 });
    se("door_slide", 0.6);
    if (i === 0) { await say("Gegensprechanlage", "Ja?! Wir kaufen nichts!"); wrong("Falsche Klingel!"); }
    else if (i === 1) { await say("Gegensprechanlage", "Hallo? … Jonas? Der wohnt oben. Bei Becker klingeln!"); wrong("Falsche Klingel – aber ein guter Tipp!"); }
    else if (i === 2) { await say("Gegensprechanlage", "Schulz? … Ach, die neue Mieterin! Jonas wohnt oben. Bei Becker."); learn("vermieterin"); }
    else break;
  }
  await say("Gegensprechanlage", "Ja, hallo?");
  const i = await ask(ME, "(Was sage ich?)", ["Hallo, hier ist {name}. Ich bin die neue Mitbewohnerin.", "Ich bin {name}. Ich wohne hier… ab heute?", "Guten Tag, Herr Becker. Hier ist Frau {nachname}."]);
  learn("mitbewohner");
  if (i === 2) await say("Gegensprechanlage", "Herr Becker? Haha! Komm hoch! Dritter Stock!");
  else await say("Gegensprechanlage", "Endlich! Komm hoch! Dritter Stock!");
  se("door_enter", 0.8);
  step("q_ankommen", "klingel");
  set("wg_klingel_ok");
  await transfer("wg", 3, 8, 8);
});

scene("haltestelle", async () => { await narr("<b>Bushaltestelle Lehrter Str./Invalidenstr.</b>\nBus 123, 245 · zum Hauptbahnhof"); });
scene("baustelle", async () => { await narr("<b>BAUSTELLE</b> – Gehweg gesperrt. Bitte die andere Straßenseite benutzen."); learn("baustelle"); });
scene("bauarbeiter", async () => {
  face();
  await say("Bauarbeiter", "Halt! Hier ist eine [[baustelle|Baustelle]].");
  const i = await ask(ME, "(…)", ["Wie lange noch?", "Wo ist die Lehrter Straße?"]);
  if (i === 0) await say("Bauarbeiter", "Die Baustelle? Seit 2019. Fertig ist sie… bald. Sagt der Chef. Jedes Jahr.");
  else await say("Bauarbeiter", "Lehrter Straße? Falsche Richtung! Zurück. Dann die Straße mit den alten Häusern.");
  await say("Bauarbeiter", "Gehen Sie die [[umleitung|Umleitung]]. Bitte da lang.");
  learn("baustelle", "umleitung");
});
scene("spaeti_schild", async () => {
  await narr("<b>SPÄTI</b> · Spätkauf · jeden Tag bis 2 Uhr");
  await narr("<c3=707078,D8D8D0>Ein Späti ist ein kleiner Laden. Er ist auch abends und am Sonntag offen.</c3>");
});

scene("ercan", async () => {
  face();
  if (done("q_pfand")) {
    friend("ercan", 1, true);
    if (ep() >= 3) await say("Ercan", "Na, Nachbarin! Schon gehört? Jonas hat beim Fußball wieder geweint. Vor Freude, sagt er.");
    else if (flag("mb_done")) await say("Ercan", "Angemeldet? Beim ersten Termin? Respekt! Ich habe drei Termine gebraucht.");
    else await say("Ercan", "Alles gut? Der Späti ist immer offen. Fast immer.");
    return;
  }
  if (!flag("pfand_flasche")) {
    quest("q_pfand");
    await say("Ercan", "Hallo! Was möchtest du?");
    const i = await ask(ME, "(…)", ["Ein Wasser, bitte.", "Haben Sie Wasser?", "Nichts, danke."]);
    if (i === 2) { await say("Ercan", "Kein Problem. Gucken ist gratis!"); return; }
    await say("Ercan", "Klar. Ein Wasser kostet 1,19 Euro. Plus 25 Cent [[pfand|Pfand]].");
    const j = await ask(ME, "(Pfand?)", ["Was ist Pfand?", "Okay, danke."]);
    if (j === 0) await say("Ercan", "Du bringst die leere Flasche zurück. Dann bekommst du die 25 Cent wieder.");
    else await say("Ercan", "Bring die leere Flasche zurück! Dann bekommst du das Geld wieder.");
    learn("pfand");
    step("q_pfand", "kaufen");
    set("pfand_flasche");
    friend("ercan", 1);
    await think("Ich trinke das Wasser. Jetzt ist die Flasche leer. Ich bringe sie später zurück.");
  } else {
    await say("Ercan", "Hallo! Was gibt's?");
    const i = await ask(ME, "(…)", ["Hier ist die leere Flasche.", "Noch ein Wasser, bitte."], -1, { correct: 0 });
    if (i === 1) await say("Ercan", "Erst die alte Flasche, dann die neue!");
    await say("Ercan", "Danke! Hier sind 25 Cent. Siehst du? Geld zurück.");
    step("q_pfand", "zurueck");
    finish("q_pfand", 8);
    diary("d_pfand", "Pfand: Man bezahlt für die Flasche. Man bringt sie zurück. Dann bekommt man das Geld wieder. Leere Flaschen sind hier Geld!");
  }
});

scene("pendlerin", async () => {
  face();
  await say("Pendlerin", "Der Bus kommt in drei Minuten. Sagt die App.");
  await say("Pendlerin", "In Berlin heißt das: in drei bis zehn Minuten.");
});
scene("student", async () => {
  face();
  if (active("q_ankommen") && !stepDone("q_ankommen", "klingel")) await say("Student", "Suchst du die Lehrter Straße? Da drüben! Die Nummer 12 ist rechts.");
  else {
    await say("Student", "Ich studiere Informatik. Und du?");
    const i = await ask(ME, "(…)", ["Ich bin Krankenpflegerin.", "Ich arbeite bald. Hoffentlich."]);
    await say("Student", i === 0 ? "Pflege? Super! Hier gibt es viele Jobs in der Pflege." : "Das klappt! Pflegekräfte werden hier überall gesucht.");
  }
});
scene("jugendliche", async () => {
  if (!flag("digga_done")) {
    await say("Jugendlicher", "[[digga|Digga]], läuft bei dir?");
    await say(ME, "Was… läuft?");
    await say("Jugendliche", "Haha! Das heißt: »Alles gut bei dir?«");
    const i = await ask(ME, "(…)", ["Ja. Läuft bei mir.", "Ich verstehe das nicht."]);
    await say("Jugendlicher", i === 0 ? "Stark! Du lernst schnell." : "Kein Ding. Das ist Jugendsprache. Die steht in keinem Buch.");
    if (i === 1) learn("verstehe_nicht");
    learn("digga");
    set("digga_done");
  } else await say("Jugendliche", "Läuft bei dir? Läuft bei dir!");
});
scene("rentner", async () => {
  face();
  await say("Rentner", "Na, [[wat]] suchen Se denn?");
  learn("wat");
  if (active("q_ankommen") && !stepDone("q_ankommen", "klingel")) await say("Rentner", "Die Lehrter? Da drüben! Die Zwölf ist rechts. Das Haus mit der grünen Fassade.");
  else await say("Rentner", "Ick wohne hier seit 1961. Ick habe allet gesehen. Die Mauer, die Wende – und jetzt Baustellen.");
});
scene("mutter", async () => {
  face();
  if (!flag("mutter_done")) {
    await say("Mutter", "[[entschuldigung|Entschuldigung]], wie spät ist es? Mein Handy ist leer.");
    const i = await ask(ME, "(Es ist 10:20 Uhr.)", ["Es ist zwanzig nach zehn.", "Es ist zehn Uhr zwanzig.", "Es ist halb elf."], -1, { correct: [0, 1] });
    if (i === 2) { wrong("Halb elf ist 10:30 Uhr!"); await say("Mutter", "Halb elf? Ah, Ihre Uhr zeigt 10:20. Das ist »zwanzig nach zehn«. Danke trotzdem!"); }
    else { await say("Mutter", "Danke! Dann gehen wir noch zum Spielplatz."); points(4, "geholfen"); }
    set("mutter_done");
  } else await say("Mutter", "Danke nochmal!");
});
scene("joggerin", async () => {
  face();
  await say("Joggerin", "Morgen!");
  learn("morgen_gruss");
  await think("»Morgen«? Ah – das heißt »Guten Morgen«. Nur kürzer.");
});
scene("polizist", async () => {
  face();
  await say("Polizist", "Guten Tag. Alles in Ordnung? Brauchen Sie Hilfe?");
  if (active("q_ankommen") && !stepDone("q_ankommen", "klingel")) await say("Polizist", "Die Lehrter Straße? Das ist die große Straße hier. Nummer 12 ist rechts.");
  else {
    const i = await ask(ME, "(…)", ["Nein, danke. Alles gut.", "Ist Berlin gefährlich?"]);
    if (i === 1) await say("Polizist", "Nicht sehr. Passen Sie auf Ihre Tasche auf. Und auf die Fahrräder!");
    else await say("Polizist", "Dann einen schönen Tag!");
  }
});

// -------------------------------------------------------------------------------
// WG – Ankunft
// -------------------------------------------------------------------------------
scene("wg_ankunft", async () => {
  const jonas = ev("Jonas");
  if (jonas) await walk(jonas, "LLLLDd");
  await say("Jonas", "Hey! Du bist {name}, oder? Willkommen! Ich bin Jonas.");
  const i = await ask(ME, "(Was sage ich?)", ["Guten Tag, Herr Becker. Freut mich.", "Hallo Jonas! Freut mich."], -1, { correct: 1 });
  if (i === 0) await say("Jonas", "Herr Becker?! Nein, nein. Ich bin Jonas. In der WG sagen wir »du«.");
  else await say("Jonas", "Genau! In der WG sagen wir »du«.");
  await say("Jonas", "»Sie« sagst du beim Amt. Bei der Arbeit. Zu fremden Leuten.");
  await say("Jonas", "»Du« sagst du zu Freunden. In der WG. Zu Kindern.");
  learn("duzen", "wg");
  await Mini.quiz([
    { speaker: "Jonas", q: "Test! Du brauchst meine Hilfe. Was sagst du?", o: ["Kannst du mir helfen?", "Können Sie mir helfen?"], a: 0, why: "Zu mir in der WG? Zu förmlich! Sag »du«.", yes: "Perfekt!" },
    { speaker: "Jonas", q: "Und beim Amt? Zur Beamtin?", o: ["Kannst du mir helfen?", "Können Sie mir helfen?"], a: 1, why: "Beim Amt lieber »Sie«.", yes: "Genau! Beim Amt immer »Sie«." },
  ]);
  await say("Jonas", "Sprichst du Deutsch?");
  await say(ME, "Ein bisschen.");
  await say("Jonas", "Ein bisschen ist super! " + o("jonas"));
  await say("Jonas", "Ich komme aus Passau. Ich studiere hier. In Berlin kommen viele Leute von woanders.");
  friend("jonas", 1);
  const mai = ev("Mai");
  if (mai) { mai.visible = true; face(mai); }
  await say("Mai", "Hi! Du bist {name}, oder? Ich bin Mai. Ich wohne im Zimmer neben dir.");
  await say("Mai", "Ich mache eine Ausbildung zur Pflegefachfrau. Jonas hat erzählt, du bist auch aus der Pflege?");
  await say(ME, "Ja! {in_land} war ich Krankenpflegerin. Hier muss mein Diplom erst anerkannt werden.");
  await say("Mai", "Ich bin vor drei Jahren aus Hanoi gekommen. Am Anfang habe ich im Bus manchmal geweint, weil ich die Durchsagen nicht verstanden habe.");
  await say("Mai", "Jetzt verstehe ich sie. Und manchmal ist es gar nicht besser. »Wegen einer Störung im Betriebsablauf…« Hihi.");
  friend("mai", 1);
  set("mai_met");
  await say("Jonas", "Bring deine Sachen hoch. Dein Zimmer ist oben, die Treppe rechts.");
  await say("Mai", "Und dann komm runter! Heute Abend kochen wir zusammen. Alle drei.");
  await say("Jonas", "WG-Tradition! Seit… heute. Ich habe sie gerade erfunden.");
  step("q_ankommen", "wg");
  set("wg_arrived");
  finish("q_ankommen", 20);
  giveSkill("wege");
  quest("q_abend");
  if (jonas) await walk(jonas, "uRRRRUu");
});

scene("zimmer_ankommen", async () => {
  set("zimmer_gesehen");
  step("q_abend", "zimmer");
  await think("Mein Zimmer. Ein Bett, ein Schrank, ein Fenster. Und ein alter Laptop von Jonas.");
  await think("Es ist klein. Aber es ist meins.");
  diary("d_zimmer", "Mein erstes Zimmer in Deutschland. Durch das Fenster sehe ich Dächer und einen Baukran. Ich habe Mamas Foto auf das Regal gestellt.");
});

// -------------------------------------------------------------------------------
// Der erste gemeinsame Abend: zusammen kochen, essen, Stadt – Land – Fluss
// -------------------------------------------------------------------------------
scene("wg_abend", async () => {
  await say("Jonas", "(von unten) {name}! Kommst du? Wir fangen an!");
  await transfer("wg", 5, 3, 2);
  place("Jonas", 4, 3, 6);
  place("Mai", 6, 3, 4);
  Audio_.bgm("Lappet Town");
  const i = await ask(ME, "(Ich frage…)", ["Was kochen wir?", "Was gibt es heute?", "Ich habe Hunger!"]);
  if (i === 2) await say("Jonas", "Sehr gut. Hunger ist die wichtigste Zutat.");
  await say("Jonas", "Nudeln mit Tomatensoße. Das ist das Einzige, was ich kann. Aber das kann ich perfekt.");
  await say("Mai", "Und ich mache einen Salat. Damit wir nicht nur Nudeln essen.");
  learn("kochen");
  await say("Mai", "{name}, kannst du mir bitte das Salz geben?");
  await Cook.give("Mai", "Kannst du mir bitte das [[salz|Salz]] geben?", ["tomate", "salz", "zwiebel", "butter"], "salz");
  learn("salz");
  await say("Mai", "Danke!");
  await say("Jonas", "Wo ist die Zwiebel? Ich habe sie gerade noch gesehen…");
  await Cook.give("Jonas", "Wo ist die [[zwiebel|Zwiebel]]?", ["kartoffel", "apfel", "zwiebel", "knoblauch"], "zwiebel",
    k => k === "knoblauch" ? "Fast! Das ist Knoblauch. Die Zwiebel ist größer." : "Nein, die Zwiebel ist rund und braun. Und sie macht, dass man weint.");
  learn("zwiebel");
  await say("Jonas", "Kannst du sie [[schneiden]]? Ich weine immer beim Zwiebelschneiden.");
  await Cook.give("Jonas", "Was brauchst du zum Schneiden?", ["loeffel", "messer", "pfanne", "topf"], "messer",
    k => k === "loeffel" ? "Mit dem Löffel? Viel Glück!" : "Damit kann man nicht schneiden. Ich meine das [[messer|Messer]].");
  learn("schneiden", "messer");
  await think("Ich schneide die Zwiebel. Jonas hat recht – man weint.");
  await say("Mai", "Wie viele Nudeln brauchen wir? Ungefähr 100 Gramm pro Person.");
  await Mini.quiz([{ speaker: "Mai", q: "Wir sind drei Personen. Wie viel Gramm?", o: ["30 Gramm", "300 Gramm", "3 Kilo"], a: 1,
    why: "100 Gramm mal drei Personen…", yes: "Genau! 300 Gramm. Außer Jonas isst mit. Dann 500." }]);
  await say("Jonas", "Die Nudeln kommen in den [[topf|Topf]]. Und jetzt: die Soße! Gib mir mal die…");
  await say("Jonas", "Ach, wie heißt das nochmal auf Deutsch? Rot, rund… Ich bin so müde, ich vergesse sogar Deutsch.");
  await Typing.task({ speaker: "Jonas", prompt: "Wie heißt das auf Deutsch?", pic: "🍅", answers: ["Tomate", "Tomaten"], mode: "word",
    hints: ["die T…", "die Tom…"], label: "Küche", word: null });
  learn("it_tomate", true);
  await say("Jonas", "Tomate! Danke. Siehst du, du kannst schon mehr Deutsch als ich.");
  learn("topf");
  step("q_abend", "kochen");
  points(8, "zusammen gekocht");
  // Essen
  await UI.tone(0.6, 0.4);
  await narr("Eine halbe Stunde später. Drei Teller, eine große Schüssel Nudeln, ein Salat.");
  await UI.tone(0, 0.4);
  const e = await ask(ME, "(Ich probiere…)", ["Mmh, das ist [[lecker]]!", "Gut.", "Das ist sehr… italienisch?"], -1, { correct: 0 });
  learn("lecker", "schmecken");
  if (e === 0) await say("Jonas", "Danke! Ich gebe das Kompliment an meine Mama weiter. Es ist ihr Rezept.");
  else if (e === 2) await say("Jonas", "Haha! Italienisch aus Passau. Das ist eine neue Küche.");
  else await say("Jonas", "»Gut« ist in Bayern das höchste Kompliment. Danke!");
  await say("Jonas", "Sag mal, wie schreibt man eigentlich deinen Namen? Ich mache ein Schild für die Klingel.");
  learn("buchstabieren");
  await Typing.task({ speaker: "Jonas", prompt: "Wie buchstabierst du deinen Namen? Schreib ihn bitte auf.", answers: [SR.playerName() + " " + o("last"), SR.playerName()],
    mode: "name", label: "Buchstabieren", hints: [`${SR.playerName()} …`, `${SR.playerName()} ${o("last")}`] });
  await say("Jonas", `${SR.playerName()} ${o("last")}. Perfekt. Morgen klebe ich es an die Klingel.`);
  await say("Mai", "Und jetzt: Spieleabend! Wir spielen »Stadt – Land – Fluss«.");
  step("q_abend", "essen");
  friend("jonas", 1); friend("mai", 1);
  // Spieleabend
  learn("spieleabend");
  await say("Jonas", "Also, die Regeln: Jemand sagt das Alphabet im Kopf, jemand anders sagt Stopp, dann der Buchstabe, und dann schreiben alle eine Stadt, ein Land und einen Fluss, und wer zuerst fertig ist, ruft Stopp, und gleiche Antworten geben fünf Punkte und…");
  const r = await ask(ME, "(Hm…)", ["Ich verstehe die [[regel|Regeln]] nicht.", "Okay… ich glaube, ich verstehe.", "Langsamer, bitte!"], -1, { correct: [0, 2] });
  learn("regel");
  if (r === 1) await say("Mai", "Wirklich? Ich habe es nach drei Jahren noch nicht verstanden. Ich erkläre es einfacher.");
  else await say("Mai", "Ich auch nicht, als Jonas es mir erklärt hat. Ich erkläre es einfacher.");
  await say("Mai", "Es gibt einen Buchstaben. Zum Beispiel »B«. Du schreibst eine Stadt mit B. Ein Land mit B. Einen Fluss mit B. Fertig.");
  await say("Mai", "Eine Antwort nur von dir: 10 Punkte. Die gleiche Antwort wie jemand anders: 5 Punkte. Nichts: 0 Punkte.");
  await say("Jonas", "…Das habe ich doch gesagt.");
  await say("Mai", "Nein. Du hast es gesagt wie eine Durchsage am Hauptbahnhof.");
  await say("Jonas", "A… B… Stopp! Der Buchstabe ist: <b>B</b>!");
  const others = { Jonas: { Stadt: "Bonn", Land: "Belgien", Fluss: null }, Mai: { Stadt: "Berlin", Land: "Brasilien", Fluss: "Brahmaputra" } };
  const res = await SLF.round("B", others);
  await UI.withPaper("Stadt – Land – Fluss · Buchstabe B", "<b>Du</b>\n" + res.lines.join("\n") + `\n<b>Summe: ${res.total}</b>\n\n<b>Jonas</b>: Bonn, Belgien, –\n<b>Mai</b>: Berlin, Brasilien, Brahmaputra`, "paper", async () => {
    await say("Jonas", "Fluss mit B? Es gibt keinen Fluss mit B. Das ist unfair.");
    await say("Mai", "Brahmaputra.");
    await say("Jonas", "…Das ist kein Fluss. Das ist ein Zauberspruch.");
    await say("Mai", "Das ist ein Fluss in Asien. 2.900 Kilometer lang. Zehn Punkte für mich.");
    if (res.total >= 20) await say("Jonas", `${res.total} Punkte?! Am ersten Abend? Ich glaube, wir haben einen Profi in der WG.`);
    else await say("Jonas", "Nicht schlecht für das erste Mal! Ich hatte beim ersten Mal null Punkte. Und ich bin Deutscher.");
  });
  points(10, "Spieleabend");
  step("q_abend", "spiel");
  finish("q_abend", 15);
  friend("jonas", 1); friend("mai", 1);
  set("wg_abend_done");
  diary("d_ep1", "Heute bin ich in Berlin angekommen. Tarek von der Bahn hat mir den Weg erklärt. Rechts, links, geradeaus. Jetzt wohne ich in einer WG. Wir haben zusammen gekocht und »Stadt – Land – Fluss« gespielt. Jonas kennt keinen Fluss mit B. Mai schon. Ich glaube, ich mag die beiden.");
  await say("Jonas", "Ach ja, noch etwas, bevor ich's vergesse. Bist du schon angemeldet?");
  await ask(ME, "(Angemeldet?)", ["Was heißt »anmelden«?", "Nein. Muss ich das?"]);
  await say("Jonas", "Du hast eine neue Wohnung. Dann musst du dich [[anmelden|anmelden]]. Beim [[buergeramt|Bürgeramt]].");
  await say("Jonas", "Das musst du in zwei Wochen machen. Ohne Anmeldung: kein Bankkonto. Kein Job. Nichts.");
  await say("Jonas", "Also, Frau {nachname}: Sie müssen sich beim Bürgeramt anmelden! Haha. Sorry, Beamten-Stimme.");
  learn("anmelden", "buergeramt");
  await say(ME, "Ich muss mich beim Bürgeramt anmelden. Okay. Das schaffe ich. Aber nicht heute.");
  await say("Mai", "Nicht heute. Heute bist du angekommen. Das reicht.");
  await finishEpisode(1, 10);
  await say("Jonas", "Schlaf gut! Morgen machen wir einen Termin. Das ist auch so eine Art Spiel. Nur ohne Gewinner.");
});

scene("treppe_hoch", async () => {
  await transfer("wg", 29, 3, 2, { fadeTime: 0.15 });
  if (flag("wg_arrived") && !flag("zimmer_gesehen")) await World.call("zimmer_ankommen");
});
