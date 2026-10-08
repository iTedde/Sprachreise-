// Sprachreise – Episode 3: Mein Kiez (Alltag, Freunde, Einkaufen) · Berlin
// Deutschland: Supermarkt, Pfand, Fußball, Volkshochschule, »gegen sechs« · Deutsch: Lebensmittel schreiben, bestellen, Umgangssprache
// Menschen: Kofi, Carmen (+ Jonas, Mai) · Veränderung: Aus Mitbewohnern werden Freunde – und dann heißt es Abschied nehmen.
"use strict";

Object.assign(SR.WORDS, {
  einkaufszettel: { de: "Einkaufszettel", art: "der", pl: "die Einkaufszettel", en: "shopping list", cat: "Einkaufen", ex: "Schreib das bitte auf den Einkaufszettel." },
  kasse: { de: "Kasse", art: "die", pl: "die Kassen", en: "checkout, till", cat: "Einkaufen", ex: "Wir bezahlen an der Kasse." },
  bar_zahlen: { de: "bar zahlen", en: "to pay cash", cat: "Einkaufen", ex: "Zahlen Sie bar oder mit Karte?" },
  bon: { de: "Bon", art: "der", pl: "die Bons", en: "receipt", cat: "Einkaufen", ex: "Brauchen Sie den Bon?", note: "Auch: Kassenbon, Quittung, Beleg." },
  angebot: { de: "Angebot", art: "das", pl: "die Angebote", en: "special offer", cat: "Einkaufen", ex: "Die Bananen sind heute im Angebot." },
  kuehlschrank: { de: "Kühlschrank", art: "der", pl: "die Kühlschränke", en: "fridge", cat: "Wohnen", ex: "Die Milch kommt in den Kühlschrank." },
  einstufungstest: { de: "Einstufungstest", art: "der", en: "placement test", cat: "Lernen", ex: "Vor dem Kurs macht man einen Einstufungstest.", pts: 5 },
  kurs: { de: "Kurs", art: "der", pl: "die Kurse", en: "course", cat: "Lernen", ex: "Mein Kurs beginnt am Montag." },
  gegen_sechs: { de: "gegen sechs", en: "around six (o'clock)", cat: "Uhrzeit", ex: "Wir treffen uns gegen sechs.", note: "»gegen« + Uhrzeit = ungefähr. »Gegen sechs« = so um 18 Uhr. Auch: »so um sechs«.", pts: 5 },
  tor: { de: "Tor", art: "das", pl: "die Tore", en: "goal", cat: "Fußball", ex: "Was für ein Tor!" },
  knapp: { de: "knapp", en: "close, narrow", cat: "Umgangssprache", ex: "Das war knapp!", note: "Fast wäre etwas passiert – aber nur fast." },
  umgangssprache: { de: "Umgangssprache", art: "die", en: "colloquial language", cat: "Umgangssprache", ex: "In der Umgangssprache sagt man »Wie geht's?«.", pts: 5 },
  abschied: { de: "Abschied", art: "der", en: "farewell", cat: "Gefühle", ex: "Der Abschied ist schwer." },
  vermissen: { de: "vermissen", en: "to miss (someone)", cat: "Gefühle", ex: "Ich werde euch vermissen." },
  schmecken: { de: "schmecken", en: "to taste", cat: "Essen", ex: "Wie schmeckt dir das?" },
});

Object.assign(SR.QUESTS, {
  q_einkauf: { title: "Der große WG-Einkauf", ep: 3,
    desc: "Samstag ist Einkaufstag. Jonas diktiert, ich schreibe den Einkaufszettel. Dann gehen wir zusammen in den Supermarkt in der Turmstraße.",
    steps: [["liste", "Den Einkaufszettel schreiben"], ["markt", "Zum Supermarkt in der Turmstraße gehen"], ["regale", "Alles auf der Liste finden"], ["kasse", "An der Kasse bezahlen"]] },
  q_vhs: { title: "Der Einstufungstest", ep: 3,
    desc: "Samstags um 10 Uhr ist an der Volkshochschule der Einstufungstest für den Integrationskurs. Welches Niveau habe ich wirklich?",
    steps: [["anmelden", "Sich am Empfang anmelden"], ["test", "Den Test machen"], ["ergebnis", "Das Ergebnis bekommen"]] },
  q_fussball: { title: "Fußballabend im Eckhaus", ep: 3,
    desc: "Jonas' bester Freund Kofi lädt zum Fußball ins Eckhaus ein. »Gegen sechs.« Was heißt das eigentlich?",
    steps: [["nachricht", "Kofis Nachricht beantworten"], ["eckhaus", "Ins Eckhaus gehen"], ["spiel", "Das Spiel zusammen schauen"]] },
  q_cafe: { title: "Einen Kaffee, bitte!", ep: 3, side: true,
    desc: "Im Eckhaus gibt es tagsüber Kaffee. Ich bestelle zum ersten Mal ganz allein.",
    steps: [["bestellen", "Einen Kaffee bestellen"], ["bezahlen", "Bezahlen"]] },
  q_oma: { title: "Wann kommt der Bus?", ep: 3, side: true,
    desc: "Eine ältere Dame an der Turmstraße kann den Fahrplan nicht lesen.",
    steps: [["lesen", "Den Fahrplan lesen"], ["helfen", "Oma Hilde helfen"]] },
  q_abschied: { title: "Abschied von Berlin", ep: 3,
    desc: "Ich fahre nach Köln. Aber vorher gibt es eine Abschiedsparty in der WG.",
    steps: [["party", "Die Abschiedsparty feiern"], ["nachricht", "Den Freunden schreiben"]] },
});
Object.assign(SR.QUESTS.q_koeln, { ep: 3, desc: "Ich habe mich bei einem Krankenhaus in Köln beworben. Und dann klingelt das Telefon …" });

Object.assign(SR.DOCUMENTS, {
  kurs_b1: { name: "VHS: Kursbestätigung", short: "Integrationskurs, Modul B1.1",
    text: "Volkshochschule Berlin-Mitte\nErgebnis Einstufungstest: <b>A2+</b>\nEmpfehlung: Integrationskurs, Modul B1.1\n<c3=707078,D8D8D0>Kurse gibt es in jeder Stadt – auch in Köln. Die Bestätigung gilt deutschlandweit.</c3>" },
});

// ------------------------------------------------------------------------------
// Start der Episode (aus der Szene »bett«)
// ------------------------------------------------------------------------------
scene("ep3_start", async () => {
  Audio_.bgmStop(1);
  await UI.tone(1, 0.8);
  await narr("Zwei Wochen später.");
  await UI.episodeCard(3, "Einkaufen, Kaffee, Fußball – und Freunde.\nBerlin ist nicht nur Bürgeramt.");
  set("ep3_started");
  await UI.tone(0, 0.8);
  Audio_.bgm(World.map.d.bgm, true);
  await narr("Samstagmorgen. Draußen scheint die Sonne. Endlich keine Behörde.");
  await say("Jonas", "(von unten) {name}! Post für dich! Sieht sehr offiziell aus. Grauer Umschlag. Das sind immer die gefährlichen.");
  await transfer("wg", 6, 6, 8, { fadeTime: 0.15 });
  place("Jonas", 6, 5, 2); place("Mai", 4, 5, 6);
  quest("q_koeln");
  await think("Ein Brief vom Amt. Mein Herz klopft. Habe ich etwas falsch gemacht?");
  await Mini.letter("Brief", [
    "Bundeszentralamt für Steuern\n53221 Bonn\n\nFrau\n{name} {nachname}\nLehrter Straße 12\n10557 Berlin\n\n<b>Mitteilung Ihrer steuerlichen Identifikationsnummer</b>",
    "Sehr geehrte Frau {nachname},\n\nIhnen wurde die folgende Identifikationsnummer zugeteilt:\n<b>12 345 678 901</b>\n\nDiese Nummer gilt lebenslang. Sie ändert sich auch bei einem Umzug nicht.\n\nBitte bewahren Sie dieses Schreiben sorgfältig auf. <b>Eine Antwort ist nicht erforderlich.</b>",
  ], [
    { q: "Von wem ist der Brief?", o: ["Vom Bundeszentralamt für Steuern", "Vom Bürgeramt", "Von der Krankenkasse"], a: 0, why: "Oben links steht der Absender: Bundeszentralamt für Steuern." },
    { q: "Muss ich jetzt etwas tun?", o: ["Nein – nur gut aufbewahren.", "Ja, innerhalb von zwei Wochen antworten.", "Ja, 12 Euro bezahlen."], a: 0, why: "Da steht: »Eine Antwort ist nicht erforderlich.« Nur aufbewahren!" },
    { q: "Wann ändert sich die Nummer?", o: ["Nie – sie gilt lebenslang.", "Bei jedem Umzug.", "Jedes Jahr."], a: 0, why: "»Diese Nummer gilt lebenslang.«" },
  ]);
  learn("steuer_id", "aufbewahren");
  doc("steuer_id");
  step("q_koeln", "brief");
  await think("Keine Strafe. Kein Problem. Nur eine Nummer. Und ich habe den ganzen Brief verstanden. Allein!");
  await say("Mai", "Siehst du? Nicht jeder graue Umschlag ist gefährlich. Nur die meisten.");
  await say("Jonas", "So! Heute ist Samstag. Das heißt: großer WG-Einkauf. Der Kühlschrank ist leer. Sehr leer. Er hallt.");
  await say("Mai", "Und du wolltest zum Einstufungstest an die VHS, oder? Der ist heute. Turmstraße, gleich hinter dem Rathaus, nach links.");
  await say("Jonas", "Und heute Abend: Fußball! Kofi schreibt bestimmt noch. Kofi ist mein bester Freund. Er ist laut. Du wirst ihn lieben.");
  quest("q_einkauf"); quest("q_vhs");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Sprich mit Jonas, um den Einkaufszettel zu schreiben. Die Turmstraße liegt westlich vom Rathaus.");
});

function ep3CheckEvening() {
  if (flag("einkauf_done") && flag("vhs_done") && !flag("kofi_sms")) UI.queue(() => World.call("kofi_sms"));
}

scene("jonas_ep3", async () => {
  const j = SR.EV;
  if (ep() !== 3) { await World.call("jonas_besuch"); return; }
  if (!stepDone("q_einkauf", "liste")) {
    await say("Jonas", "Okay, Einkaufszettel! Ich sage, du schreibst. Ich kann meine eigene Schrift nicht lesen.");
    learn("einkaufszettel");
    await say("Jonas", "Also: Wir brauchen Milch, Brot, Eier, Reis und Tomaten.");
    await Typing.task({ speaker: "Jonas", prompt: "Schreib den Einkaufszettel: <i>»Wir brauchen Milch, Brot, Eier, Reis und Tomaten.«</i>\n<span class=sub>(Nur die fünf Wörter, mit Leerzeichen oder Komma.)</span>",
      answers: ["Milch", "Brot", "Eier", "Reis", "Tomaten"], mode: "list", label: "Einkaufszettel", pts: 8, place: "top" });
    await say("Jonas", "Perfekt. Deine Schrift ist besser als meine. Das ist aber auch nicht schwer.");
    learn("it_milch", "it_brot", "it_eier", "it_reis", "it_tomate", true);
    Shop.start(["milch", "brot", "eier", "reis", "tomate"]);
    step("q_einkauf", "liste");
    await say("Jonas", "Der Supermarkt ist in der Turmstraße. Erst zum Rathaus, dann links. Ich komme nach – ich muss noch meine Schuhe finden.");
    await say("Jonas", "Und nimm die leeren Flaschen mit! Pfand!");
    set("pfand_tuete");
    return;
  }
  if (!flag("einkauf_done")) { await say("Jonas", "Ich komme gleich! Ein Schuh ist da. Der andere… ist irgendwo."); return; }
  if (!flag("vhs_done")) { await say("Jonas", "Danke für den Einkauf! Und viel Glück beim Test an der VHS. Du schaffst das!"); return; }
  if (!flag("fussball_done")) { await say("Jonas", "Heute Abend Fußball! Kofi wartet im Eckhaus. »Gegen sechs.«"); return; }
  await say("Jonas", "Was für ein Abend! Kofi hat geschrieben, du hättest mehr geschrien als er.");
});

scene("mai_ep3", async () => {
  if (ep() !== 3) { await World.call("mai_besuch"); return; }
  if (!flag("vhs_done")) {
    await say("Mai", "Beim Einstufungstest: keine Panik. Es gibt kein »Durchfallen«. Der Test sagt nur, in welchen Kurs du gehst.");
    await say("Mai", "Und wenn du etwas nicht verstehst: Frag! Das ist auch Deutsch.");
  } else if (!flag("einkauf_done")) await say("Mai", "Bringst du Reis mit? Ohne Reis bin ich ein trauriger Mensch.");
  else await say("Mai", "Du bist jetzt richtig angekommen. Du kennst den Supermarkt, die VHS und bald auch Kofi. Das ist Berlin: Leute.");
});

// ------------------------------------------------------------------------------
// Turmstraße
// ------------------------------------------------------------------------------
scene("supermarkt_zu", async () => { await narr("Supermarkt »Frisch & Fröhlich«. Heute geschlossen – Inventur."); });
scene("eckhaus_zu", async () => { await narr("»Eckhaus« – Café am Tag, Kneipe am Abend. Gerade zu."); });
scene("vhs_zu", async () => { await narr("Volkshochschule Berlin-Mitte. Am Wochenende geschlossen."); });
scene("schild_supermarkt", async () => {
  await narr("<b>Frisch & Fröhlich</b> · Supermarkt\nMo–Sa 7–22 Uhr · <c3=C03030,F0C0C0>Sonntag geschlossen</c3>");
  if (ep() === 3) await think("Montag bis Samstag. Am Sonntag ist zu. Das weiß ich jetzt.");
});
scene("schild_eckhaus", async () => {
  await narr("<b>ECKHAUS</b> · Café & Kneipe\nTagsüber: Kaffee & Kuchen · Abends: Fußball live!\n<i>»Heute: Union – Hertha, 18:30 Uhr«</i>");
});
scene("schild_vhs", async () => { await narr("<b>Volkshochschule Berlin-Mitte</b>\nDeutschkurse · Integrationskurse · Einstufungstest: Samstag 10 Uhr"); learn("integrationskurs"); });
scene("parkbank_turm", async () => { await narr("Eine Parkbank. Jemand hat »Berlin ❤« eingeritzt."); await think("Ich setze mich kurz. Nur eine Minute. Die Stadt ist laut – und trotzdem gemütlich."); });
scene("haltestelle_turm", async () => {
  await UI.withPaper("Fahrplan · Bus 123 · Turmstraße", "<b>Richtung Hauptbahnhof</b>\nMo–Fr: alle 10 Minuten\nSa: 8:05 · 8:25 · 8:45 · 9:05 · 9:25 …\nSo: alle 30 Minuten\n<c3=707078,D8D8D0>Jetzt: Samstag, 9:12 Uhr</c3>", "board", async () => {
    if (active("q_oma") && !stepDone("q_oma", "lesen")) {
      await Mini.quiz([{ q: "Es ist Samstag, 9:12 Uhr. Wann kommt der nächste Bus?", o: ["Um 9:25 Uhr", "In 10 Minuten", "Um 9:05 Uhr"], a: 0,
        why: "Am Samstag fährt der Bus nicht alle 10 Minuten. Nach 9:12 Uhr kommt 9:25 Uhr." }]);
      step("q_oma", "lesen");
      await think("9:25 Uhr. Das sage ich Oma Hilde.");
    } else await think("Mo–Fr, Sa, So. Drei verschiedene Fahrpläne. Typisch.");
  });
});
scene("oma_hilde", async () => {
  face();
  if (done("q_oma")) { await say("Oma Hilde", "Danke nochmal, Kindchen! Mein Enkel sagt immer: »Oma, guck aufs Handy.« Ick hab aber keen Handy."); return; }
  quest("q_oma");
  if (!stepDone("q_oma", "lesen")) {
    await say("Oma Hilde", "Entschuldigung, junge Frau! Können Se mir sagen, wann der Bus kommt? Meine Augen…");
    await say(ME, "Ich schaue mal auf den Fahrplan.");
    return;
  }
  const i = await ask(ME, "(Ich sage es ihr.)", ["Der nächste Bus kommt um 9:25 Uhr.", "Bus… 9 Uhr… 25?"], -1, { correct: 0 });
  if (i === 0) points(4, "ganzer Satz");
  await say("Oma Hilde", "Um fünf vor halb zehn? Wunderbar! Dann schaff ick noch meine Schrippen.");
  await think("»Fünf vor halb zehn« = 9:25 Uhr. Die Berliner machen es mir nicht leicht.");
  step("q_oma", "helfen");
  finish("q_oma", 10);
  diary("d_oma", "Oma Hilde hat 9:25 Uhr »fünf vor halb zehn« genannt. Ich habe zwei Minuten gerechnet. Aber ich habe ihr geholfen – mit dem Fahrplan.");
});
scene("kind_turm", async () => { face(); await say("Kind", "Weißt du, was »Hunger« auf Englisch heißt? »Hungry«! Ich kann Englisch!"); });
scene("student_turm", async () => { face(); await say("Student", "Die VHS? Die mit dem lila Dach. Ich mache da einen Kochkurs. Thailändisch. Mein Pad Thai ist… mutig."); });
scene("kofi_turm", async () => {
  face();
  await say("Kofi", "{name}! Mein Hals tut weh. Zu viel geschrien. Hat sich gelohnt!");
  friend("kofi", 0, true);
});

// ------------------------------------------------------------------------------
// Supermarkt
// ------------------------------------------------------------------------------
scene("supermarkt_eintritt", async () => {
  step("q_einkauf", "markt");
  Shop.show();
  place("Jonas", 6, 12, 8);
  await say("Jonas", "(außer Atem) Da bin ich! Beide Schuhe. Es ist ein guter Tag.");
  await say("Jonas", "Also: Du hast die Liste. Ich… schaue mir die Chips an. Für die Wissenschaft.");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Geh zu den Regalen und nimm, was auf der Liste steht. Du musst jedes Wort auf Deutsch schreiben!");
});
scene("jonas_markt", async () => {
  face();
  const miss = Shop.missing();
  if (miss.length) await say("Jonas", `Was fehlt noch? ${miss.length === 1 ? "Ein Ding" : miss.length + " Dinge"}. Ich glaube, ${SR.ITEMS[miss[0]].de === "Eier" ? "die Eier sind im Kühlregal" : SR.ITEMS[miss[0]].de === "Milch" ? "die Milch ist im Kühlregal oben rechts" : "das ist irgendwo bei den Regalen"}.`);
  else await say("Jonas", "Alles da? Dann ab zur Kasse! Vorne links.");
});
scene("regal_kuehl", async () => { await Shop.shelf("Kühlregal: Milch, Käse, Butter, Eier", ["milch", "kaese", "butter", "eier"]); learn("kuehlschrank"); });
scene("regal_obst", async () => { await Shop.shelf("Obst", ["apfel", "banane", "zitrone"]); });
scene("regal_gemuese", async () => { await Shop.shelf("Gemüse", ["tomate", "zwiebel", "kartoffel", "gurke", "karotte"]); });
scene("regal_brot", async () => { await Shop.shelf("Brot & Backwaren", ["brot", "broetchen"]); });
scene("regal_trocken", async () => { await Shop.shelf("Reis, Nudeln & Gewürze", ["reis", "nudeln", "salz", "kaffee"]); });
scene("regal_suess", async () => { await Shop.shelf("Süßes & Snacks", ["schokolade", "chips"]); });
scene("regal_getraenke", async () => { await Shop.shelf("Getränke", ["wasser", "saft"]); });
scene("regal_haushalt", async () => { await narr("Haushalt: Spülmittel, Schwämme – und sehr, sehr viel Klopapier."); });
scene("regal_angebote", async () => { await narr("»Angebot der Woche: Spargel!« Ein Schild erklärt: Im Frühling essen die Deutschen sehr viel weißen Spargel."); learn("angebot"); });
scene("sonderangebote", async () => { await narr("<b>ANGEBOT</b>: Bananen 0,99 € / kg statt 1,49 €"); learn("angebot"); await think("»Angebot« heißt: billiger als normal. Gut zu wissen."); });
scene("lager", async () => { await narr("Aufzug. »Nur für Personal.«"); });
scene("kunde_markt", async () => { face(); await say("Kunde", "Wissen Sie, wo die Hefe ist? Seit Corona finde ich nie Hefe."); });
scene("filialleiter", async () => {
  face();
  await say("Filialleiter", "Willkommen bei »Frisch & Fröhlich«! Ich bin der Filialleiter. Fröhlich bin ich nur am Freitag.");
});
scene("pfandautomat", async () => {
  if (!flag("pfand_tuete") || flag("pfand_markt_done")) { await narr("Der Pfandautomat. Er summt zufrieden."); return; }
  await narr("Der Pfandautomat. Ich stecke die erste Flasche hinein.");
  se("bump", 0.6);
  await narr("<c3=C03030,F0C0C0>»Leergut nicht erkannt.«</c3>");
  const i = await ask(ME, "(Hm…)", ["Die Flasche nochmal drehen.", "Den Automaten schütteln.", "Den Filialleiter fragen."], -1, { correct: 0 });
  if (i === 1) { wrong("Automaten schütteln hilft nie."); await narr("Der Automat piept beleidigt."); }
  if (i === 2) await say("Filialleiter", "Etikett nach vorne! Der Automat muss den Strichcode sehen. Er ist ein bisschen… deutsch.");
  se("vending", 0.8);
  await narr("Die Flasche verschwindet. <b>0,25 €</b>. Noch fünf Flaschen… <b>Pfandbon: 1,50 €</b>");
  set("pfand_markt_done");
  points(4);
  await think("Ich habe einen Pfandbon! Den gebe ich an der Kasse ab.");
});
scene("kassiererin", async () => {
  face();
  if (!fval("shop")) { await say("Kassiererin", "Schönen Tag noch!"); return; }
  await World.call("kasse");
});
scene("kasse", async () => {
  if (!fval("shop")) { await narr("Die Kasse. Heute habe ich schon bezahlt."); return; }
  const miss = Shop.missing();
  if (miss.length) { await say("Kassiererin", "Alles? …Sie haben ja noch fast nichts im Korb."); await think(`Mir fehlen noch ${miss.length} Sachen auf der Liste.`); return; }
  step("q_einkauf", "regale");
  learn("kasse");
  await say("Kassiererin", "Hallo! Sammeln Sie Punkte?");
  await think("Punkte? Wie bei Sprachpunkten?");
  const i = await ask(ME, "(Sammeln Sie Punkte?)", ["Nein, danke.", "Was für Punkte?", "Ja, Sprachpunkte!"]);
  if (i === 2) await say("Kassiererin", "Haha! Die nehmen wir leider nicht. Nur Payback.");
  if (i === 1) await say("Kassiererin", "Mit einer Kundenkarte sammelt man Punkte. Für Rabatt. Aber Sie haben keine – macht nichts.");
  se("buy", 0.6); await wait(0.3);
  await say("Kassiererin", "Das macht dreizehn neunundvierzig.");
  await Mini.quiz([{ speaker: "Kassiererin", q: "Dreizehn neunundvierzig.", o: ["13,49 €", "30,49 €", "13,94 €"], a: 0, why: "»Dreizehn« = 13, »neunundvierzig« = 49 Cent. Also 13,49 €." }]);
  if (flag("pfand_markt_done")) { await say(ME, "Und hier ist noch ein Pfandbon."); await say("Kassiererin", "Super, dann sind's elf neunundneunzig."); }
  await say("Kassiererin", "Zahlen Sie bar oder mit Karte?");
  learn("bar_zahlen");
  const k = await ask(ME, "(Wie zahle ich?)", ["Bar, bitte.", "Mit Karte, bitte."]);
  if (k === 1) await say("Kassiererin", "Ah, Sie haben schon ein deutsches Konto? …Nein? Dann nehme ich doch Bargeld. Hier in Deutschland zahlen viele Leute noch bar.");
  await say("Kassiererin", "Brauchen Sie den Bon?");
  learn("bon");
  await ask(ME, "(Den Bon?)", ["Ja, bitte.", "Nein, danke."]);
  await say("Kassiererin", "Schönen Tag noch!");
  await think("Das ging so schnell! Sie spricht wie eine Maschine. Aber ich habe alles verstanden.");
  step("q_einkauf", "kasse");
  const extra = fval("shop").extra || [];
  Shop.end();
  finish("q_einkauf", 25);
  set("einkauf_done");
  friend("jonas", 1);
  await say("Jonas", extra.length ? "Und du hast sogar noch " + extra.map(k => SR.ITEMS[k].de).join(" und ") + " mitgenommen. Du bist eine echte WG-Bewohnerin." : "Perfekt! Alles da. Und nur das, was auf der Liste stand. Du bist disziplinierter als ich.");
  await say("Jonas", "Ich bringe alles nach Hause. Geh du ruhig weiter – die VHS ist gleich gegenüber.");
  diary("d_einkauf", "Großer Einkauf mit Jonas. Ich musste jedes Wort selbst schreiben: Milch, Brot, Eier, Reis, Tomaten. Die Kassiererin hat so schnell gesprochen wie ein ICE. Und der Pfandautomat mag nur Flaschen mit dem Etikett nach vorne.");
  ep3CheckEvening();
});

// ------------------------------------------------------------------------------
// Volkshochschule – Einstufungstest, Carmen
// ------------------------------------------------------------------------------
scene("vhs_empfang", async () => {
  face();
  if (flag("vhs_done")) { await say("Frau Albrecht", "Viel Erfolg im Kurs! Und: Ein Kurs ist wie ein Fahrrad. Man muss treten."); return; }
  if (!stepDone("q_vhs", "anmelden")) {
    await say("Frau Albrecht", "Guten Morgen! Sind Sie zum Einstufungstest hier?");
    learn("einstufungstest");
    await ask(ME, "(…)", ["Ja, genau.", "Ja. Ich möchte einen Integrationskurs machen."], -1, { correct: 1 });
    await say("Frau Albrecht", "Dann brauche ich ein paar Daten. Wie ist Ihr Nachname?");
    await Typing.task({ speaker: "Frau Albrecht", prompt: "Wie ist Ihr Nachname?", answers: [o("last")], mode: "name", label: "Anmeldung", place: "top", hints: [o("last")[0] + "…", o("last")] });
    await say("Frau Albrecht", "Und Ihre Adresse? Straße und Hausnummer, Postleitzahl und Ort.");
    await Typing.task({ speaker: "Frau Albrecht", prompt: "Ihre Adresse, bitte. <span class=sub>(Postleitzahl: 10557)</span>",
      answers: ["Lehrter Straße 12, 10557 Berlin"], mode: "sentence", label: "Adresse", place: "top",
      need: [["lehrter"], ["12"], ["10557"], ["berlin"]], tips: ["Die Straße fehlt: Lehrter Straße.", "Die Hausnummer fehlt: 12.", "Die Postleitzahl fehlt: 10557.", "Die Stadt fehlt: Berlin."], minWords: 3 });
    await say("Frau Albrecht", "Danke. Der Test dauert 30 Minuten. Bitte setzen Sie sich an den Platz dort links, am Computer.");
    step("q_vhs", "anmelden");
    return;
  }
  if (!stepDone("q_vhs", "test")) { await say("Frau Albrecht", "Der Testplatz ist dort links. Keine Angst – es gibt kein Durchfallen."); return; }
  await say("Frau Albrecht", "So, Frau {nachname}, Ihr Ergebnis: A2 plus. Sehr gut! Wir empfehlen Ihnen das Modul B1.1.");
  await say(ME, "B1… Das ist mein Ziel!");
  await say("Frau Albrecht", "Dann sind Sie ja auf dem richtigen Weg. Der Kurs beginnt in zwei Wochen. Hier ist Ihre Bestätigung.");
  doc("kurs_b1"); learn("kurs");
  step("q_vhs", "ergebnis");
  finish("q_vhs", 25);
  set("vhs_done");
  diary("d_vhs", "Einstufungstest: A2+! Frau Albrecht hat gesagt, ich bin auf dem richtigen Weg zu B1. Und ich habe Carmen kennengelernt. Sie kommt aus Sevilla und hat mir ihren Bleistift geliehen.");
  ep3CheckEvening();
});
scene("vhs_test", async () => {
  if (!stepDone("q_vhs", "anmelden")) { await narr("Ein Computer. »Einstufungstest – bitte am Empfang anmelden.«"); return; }
  if (stepDone("q_vhs", "test")) { await narr("»Vielen Dank. Ihr Test ist beendet.«"); return; }
  await narr("<b>Einstufungstest Deutsch</b> · Teil 1 von 1\nBitte beantworten Sie die Fragen.");
  if (!flag("carmen_met")) {
    await say("Carmen", "(flüstert) Psst! Hast du einen Bleistift? Für Notizen. Meiner ist kaputt. Oh – wir haben ja einen Computer. Egal.");
    set("carmen_bleistift");
  }
  await Mini.quiz([
    { q: "Ich ___ seit drei Wochen in Berlin.", o: ["wohne", "wohnen", "gewohnt"], a: 0, why: "Ich wohne – mit »ich« endet das Verb auf -e." },
    { q: "Gestern ___ ich beim Bürgeramt.", o: ["bin", "war", "habe"], a: 1, why: "Gestern = Vergangenheit. Ich war beim Bürgeramt." },
    { q: "Ich habe ___ Termin um 10 Uhr.", o: ["ein", "einen", "einem"], a: 1, why: "Akkusativ, maskulin: einen Termin. (Herr Brandt wäre stolz.)" },
    { q: "Welcher Satz ist höflich?", o: ["Gib mir das Formular!", "Könnten Sie mir bitte das Formular geben?", "Formular. Jetzt."], a: 1, why: "»Könnten Sie … bitte …?« ist sehr höflich." },
    { q: "»Ich komme nicht, ___ ich krank bin.«", o: ["weil", "aber", "und"], a: 0, why: "Grund = weil. Und das Verb steht am Ende: »weil ich krank bin«." },
    { q: "Lesen: »Der Kurs findet ab Montag wöchentlich statt.« Was heißt »wöchentlich«?", o: ["jede Woche", "jeden Tag", "einmal im Monat"], a: 0, why: "Woche → wöchentlich = jede Woche." },
  ], 5);
  step("q_vhs", "test");
  await narr("»Vielen Dank. Bitte gehen Sie mit Ihrem Ergebnis zum Empfang.«");
});
scene("carmen_vhs", async () => {
  face();
  if (!flag("carmen_met")) {
    await say("Carmen", "¡Hola! Bist du auch für den Test hier? Ich bin Carmen. Ich bin so nervös. Mein Herz macht Flamenco.");
    await say("Carmen", "Woher kommst du?");
    await Typing.task({ speaker: "Carmen", prompt: "»Woher kommst du?« – Antworte mit einem ganzen Satz.",
      answers: ["Ich komme " + o("aus") + ".", "Ich komme aus " + o("city") + "."], mode: "sentence", place: "top", label: "Satz",
      need: [["komme", "bin"], ["aus", "von"]], tips: ["Benutze das Verb »kommen«: Ich komme …", "Woher? → »aus«: Ich komme aus …"] });
    learn("verstehe_nicht", true);
    if (SR.origin() === "es") await say("Carmen", `¡Qué bien! ${o("land")}? Wir sprechen die gleiche Sprache! Aber heute nur Deutsch, okay? Sonst lernen wir nichts.`);
    else await say("Carmen", "Ich komme aus Sevilla. In Spanien. Da ist es jetzt 25 Grad. Hier sind es 12. Ich friere seit sechs Monaten.");
    await say("Carmen", "Ich bin Erzieherin. Im Frühling ziehe ich nach München – ich habe dort eine Stelle in einer Kita!");
    await say("Carmen", "Gib mir deine Nummer. Wenn ich in München bin, musst du mich besuchen. Versprochen?");
    await ask(ME, "(…)", ["Versprochen!", "Wenn ich Zeit habe… ja!"]);
    set("carmen_met");
    friend("carmen", 2);
    return;
  }
  if (!flag("vhs_done")) await say("Carmen", "Hast du schon den Test gemacht? Ich glaube, ich war gut. Oder sehr schlecht. Eins von beiden.");
  else await say("Carmen", "B1.1? Ich auch! Wir schaffen B1 zusammen. ¡Ánimo!");
});
scene("vhs_teilnehmer", async () => {
  face();
  await say("Kursteilnehmer", "Ich mache heute schon zum zweiten Mal den Test. Beim ersten Mal hatte ich zu viel Kaffee. Ich habe alles angekreuzt.");
});
scene("vhs_aushang", async () => {
  await narr("<b>Kursprogramm</b>\nDeutsch B1 · Deutsch für den Beruf · Orientierungskurs: »Leben in Deutschland« · Kochkurs Thailändisch");
  await think("»Orientierungskurs« – da lernt man über Politik, Geschichte und das Zusammenleben. Gehört zum Integrationskurs.");
});

// ------------------------------------------------------------------------------
// Eckhaus – Café (tagsüber)
// ------------------------------------------------------------------------------
scene("eckhaus_theke", async () => {
  if (flag("fussball_abend") && !flag("fussball_done")) { await say("Kellnerin", "Heute Abend nur Getränke! Die Küche schaut Fußball."); return; }
  if (done("q_cafe")) { await say("Kellnerin", "Noch einen Kaffee? Mit Hafermilch? Mit Hafermilch, oder? Hier trinken alle Hafermilch."); return; }
  quest("q_cafe");
  await say("Kellnerin", "Hallo! Was darf's sein?");
  const r = await Typing.task({ speaker: "Kellnerin", prompt: "»Was darf's sein?« – Bestell einen Kaffee.",
    answers: ["Einen Kaffee, bitte.", "Ich möchte einen Kaffee, bitte.", "Ich hätte gern einen Kaffee."], mode: "sentence", label: "Bestellen", place: "top", minWords: 2,
    need: [["kaffee"]], tips: ["Was möchtest du? Einen K…"],
    validate: v => {
      const n = U.norm(v);
      if (n.includes("kaffee") && /\bein kaffee/.test(n) && !/\beinen kaffee/.test(n)) return { ok: true, note: "Grammatik: <b>einen</b> Kaffee (Akkusativ) – wie »einen Termin«!" };
      return null;
    } });
  step("q_cafe", "bestellen");
  if (!/bitte/i.test(r.text)) await say("Kellnerin", "Gerne. (Ein »bitte« wäre schön gewesen. Aber ich bin ja nicht Ihre Oma.)");
  await say("Kellnerin", "Mit Milch? Mit Hafermilch? Mit Sojamilch? Mit Mandelmilch?");
  await ask(ME, "(So viele Milchsorten!)", ["Mit normaler Milch, bitte.", "Schwarz, bitte.", "Mit… Hafermilch?"]);
  await say("Kellnerin", "Kommt sofort. Das macht zwei achtzig.");
  await Mini.quiz([{ speaker: "Kellnerin", q: "Zwei achtzig.", o: ["2,80 €", "2,08 €", "28 €"], a: 0, why: "»Zwei achtzig« = 2 Euro und 80 Cent." }]);
  step("q_cafe", "bezahlen");
  finish("q_cafe", 10);
  diary("d_kaffee", "Ich habe ganz allein einen Kaffee bestellt. »Einen Kaffee, bitte.« – mit »einen«, wie bei »einen Termin«. Die Kellnerin hat mich gefragt, welche Milch ich will. Es gibt in Berlin mehr Milchsorten als Kaffeesorten.");
});
scene("eckhaus_tv", async () => {
  if (flag("fussball_abend") && !flag("fussball_done")) { await narr("Das Spiel läuft. 1:1. Alle starren auf den Fernseher."); return; }
  await narr("Ein großer Fernseher. Jetzt läuft eine Kochsendung ohne Ton.");
});
scene("gast_eckhaus", async () => { face(); await say("Gast", "Ich komme jeden Samstag hierher. Wegen des Kuchens. Der Käsekuchen ist der beste in Moabit. Mindestens."); });
scene("laptop_mann", async () => { face(); await say("Laptop-Mann", "Ich bin Freelancer. Ich arbeite hier. Seit drei Jahren. Mit einem Kaffee."); });

// ------------------------------------------------------------------------------
// Kofis Nachricht: »gegen sechs« (Abschnitt Missverständnisse)
// ------------------------------------------------------------------------------
scene("kofi_sms", async () => {
  set("kofi_sms");
  quest("q_fussball");
  Audio_.se("point", 0.8);
  await think("Mein Handy vibriert. Eine Nachricht von einer unbekannten Nummer.");
  await sms("Kofi", [{ from: "Kofi", text: "Hey {name}! Hier ist Kofi, Jonas' Freund 😎 Heute Abend Fußball im Eckhaus! Wir treffen uns gegen sechs." }],
    { prompt: "»Gegen sechs«? Frag nach, ob er 18 Uhr meint.", answers: ["18 Uhr?", "Um 18 Uhr?", "18:00 Uhr?"], mode: "sentence", minWords: 1,
      validate: v => /18|achtzehn/.test(v) ? { ok: true } : { ok: false, msg: "Frag nach der Uhrzeit: »18 Uhr?«" } },
    [{ from: "Kofi", text: "Ja 👍" }]);
  const i = await ask(ME, "(Ich schreibe zurück…)", ["Warum sagst du dann nicht 18 Uhr?", "Okay!"]);
  if (i === 0) {
    await sms("Kofi", [{ from: ME, text: "Warum sagst du dann nicht 18 Uhr?" }, { from: "Kofi", text: "Keine Ahnung 😂 So sagen wir das. »Gegen sechs« heißt: so ungefähr um sechs. Vielleicht 18:10. Vielleicht 18:20. Nie 17:50." }], null);
  } else await sms("Kofi", [{ from: ME, text: "Okay!" }, { from: "Kofi", text: "PS: »gegen sechs« = ungefähr 18 Uhr. Nicht früher! 😅" }], null);
  learn("gegen_sechs");
  await sms("Kofi", [{ from: "Kofi", text: "Kommst du?" }],
    { prompt: "Antworte Kofi kurz: Du kommst.", answers: ["Ja, bis später!", "Bis später!", "Ich komme!", "Ja, ich komme. Bis später!"], mode: "sentence", minWords: 1,
      need: [["ja", "komme", "bis", "gerne", "klar", "okay"]], tips: ["Zum Beispiel: »Ja, bis später!«"] },
    [{ from: "Kofi", text: "Yes!! ⚽🔥" }]);
  step("q_fussball", "nachricht");
  set("fussball_abend");
  friend("kofi", 1);
  await narr("Am Abend. Gegen sechs. Also: ungefähr um sechs.");
  await think("Das Eckhaus ist in der Turmstraße.");
});

// ------------------------------------------------------------------------------
// Fußballabend
// ------------------------------------------------------------------------------
scene("fussball_start", async () => {
  step("q_fussball", "eckhaus");
  Audio_.bgm("Triple Triad");
  await narr("Das Eckhaus ist voll. Rot-weiße Schals, blaue Schals, viele Stimmen. Auf dem Fernseher: Union gegen Hertha.");
  await say("Kofi", "{name}! Da bist du ja! 18:14 Uhr – perfekt »gegen sechs«. Du lernst schnell!");
  await say("Kofi", "Ich bin Kofi. Ich komme aus Accra, aus Ghana. Ich studiere Maschinenbau an der TU. Und ich bin Union-Fan. Das ist wichtiger.");
  const i = await ask(ME, "(…)", ["Freut mich! Ich bin {name}. Ich verstehe nichts von Fußball.", "Hallo Kofi! Für wen bist du?"]);
  if (i === 0) await say("Kofi", "Perfekt. Dann bist du heute für Union. Einfache Regel.");
  else await say("Kofi", "Für Union! Jonas ist für Hertha. Wir sind trotzdem beste Freunde. Das ist wahre Liebe.");
  await say("Jonas", "Hertha ist eine schwierige Liebe. Wie die Deutsche Bahn.");
  learn("tor", "knapp");
  await narr("Das Spiel läuft. Ein Spieler schießt – der Ball fliegt knapp am Tor vorbei.");
  await say("Kofi", "Oooh! Das war knapp!");
  await say("Fan", "Der hat den Ball komplett verschenkt! Mensch!");
  await Mini.quiz([
    { speaker: "Kofi", q: "Test! »Das war knapp« – was heißt das?", o: ["Fast ein Tor – aber nur fast.", "Das war langweilig.", "Der Ball ist kaputt."], a: 0,
      why: "»Knapp« = fast. Der Ball war fast im Tor.", yes: "Genau! Fast. Fußball ist 90 Minuten »fast«." },
    { speaker: "Kofi", q: "Und »Der hat den Ball verschenkt«?", o: ["Er hat den Ball einem Fan geschenkt.", "Er hat den Ball dumm verloren – an den Gegner.", "Er hat ein Tor geschossen."], a: 1,
      why: "»Verschenkt« heißt hier: Er hat den Ball dem anderen Team gegeben. Ohne Grund. Schlimm!", yes: "Genau. Und der Fan da drüben sagt das jedes Spiel." },
  ]);
  await narr("Minute 89. 1:1. Ein Freistoß. Alle stehen auf. Der Ball fliegt… und…");
  await Typing.task({ prompt: "Der Ball ist drin! Was rufen alle? <span class=sub>(drei Buchstaben und ein Ausrufezeichen)</span>", answers: ["Tor!", "Tor", "Toooor!"], mode: "word", label: "Schnell!", place: "top", pts: 4,
    validate: v => /^\s*to+r+!*\s*$/i.test(v) ? { ok: true, perfect: true } : null, hints: ["T…!", "Tor!"] });
  Audio_.se("levelup_se", 0.8);
  await say("Kofi", "TOOOOOR! Was für ein Tor! Hast du das gesehen?!");
  await say("Jonas", "…Ich hasse Fußball.");
  await say("Kofi", "Du liebst Fußball. Du hasst nur Hertha heute.");
  step("q_fussball", "spiel");
  await World.call("umgangssprache");
  finish("q_fussball", 25);
  set("fussball_done");
  friend("kofi", 2); friend("jonas", 1);
  giveSkill("alltag");
  diary("d_fussball", "Fußball im Eckhaus! Ich habe »Tor!« geschrien. Laut. Kofi sagt, das war mein erster richtiger deutscher Satz. Und »gegen sechs« heißt: nicht um sechs. Nie um sechs.");
  await say("Kofi", "Komm, wir gehen. Jonas muss nach Hause und traurig sein. Wir begleiten ihn.");
  await transfer("turmstrasse", 16, 7, 2);
});
scene("umgangssprache", async () => {
  await say("Kofi", "Weißt du, was ich am Anfang in Deutschland nicht verstanden habe? Im Deutschkurs habe ich gelernt: »Wie geht es Ihnen?«");
  await say("Kofi", "Und dann sagt jemand im Stadion: »Na, alles klar? Wie geht's?« Ich dachte, das sind zwei verschiedene Sprachen!");
  learn("umgangssprache");
  await Mini.match("Lehrbuch ↔ Alltag", [
    ["Das ist ausgezeichnet.", "Das ist echt gut."],
    ["Ich möchte mich bei Ihnen bedanken.", "Danke dir!"],
    ["Wie geht es Ihnen?", "Wie geht's?"],
    ["Auf Wiedersehen.", "Tschüss! / Ciao!"],
  ], "Kofi", "Ein Spiel! Links steht Lehrbuch-Deutsch. Du sagst mir, wie man es im Alltag sagt.");
  await say("Kofi", "Und wann sagt man was? Beim Amt, bei der Arbeit, bei fremden Leuten: eher Lehrbuch. Mit Freunden, in der Kneipe: Alltag.");
  await Mini.quiz([
    { speaker: "Kofi", q: "Du bist im Bürgeramt bei Frau Petersen. Was sagst du am Ende?", o: ["Danke dir! Tschüss!", "Vielen Dank für Ihre Hilfe. Auf Wiedersehen!"], a: 1,
      why: "Beim Amt lieber höflich und mit »Sie«." },
    { speaker: "Kofi", q: "Und zu mir, nach dem Spiel?", o: ["Ich möchte mich bei Ihnen für den Abend bedanken.", "Danke dir! War echt gut!"], a: 1,
      why: "Zu mir? Sag »du«! Sonst denke ich, ich bin dein Chef." },
  ]);
  await say("Kofi", "Siehst du? Du sprichst jetzt zwei Sprachen Deutsch.");
});
scene("kofi_eckhaus", async () => { face(); await say("Kofi", "Psst! Das Spiel läuft!"); });
scene("jonas_eckhaus", async () => { face(); await say("Jonas", "Wenn Hertha verliert, sprich mich zwei Tage nicht an. Danke."); });
scene("fan_eckhaus", async () => { face(); await say("Fan", flag("fussball_done") ? "Was für ein Spiel! Ich habe keine Stimme mehr." : "Schiri! Hast du Tomaten auf den Augen?!"); learn("it_tomate", true); });
scene("fan2_eckhaus", async () => { face(); await say("Fan", "Ich bin seit 1987 Fan. Meine Frau sagt, ich habe zwei Familien. Sie ist die zweite."); });

// ------------------------------------------------------------------------------
// Anruf aus Köln + Abschiedsparty
// ------------------------------------------------------------------------------
scene("wg_abschied", async () => {
  set("abschied_done");
  place("Jonas", 6, 5, 2); place("Mai", 4, 5, 6);
  await narr("Sonntag. Die Sonne scheint durch das Küchenfenster. Mai macht Kaffee.");
  Audio_.me("phone");
  await wait(0.4);
  await think("Mein Handy! Eine Nummer aus Köln…?");
  await Mini.phone("Frau Hoffmann", [
    "Guten Tag, hier spricht Sabine Hoffmann vom St.-Marien-Klinikum in Köln, Pflegedirektion. Entschuldigen Sie den Anruf am Sonntag.",
    "Wir haben Ihre Bewerbung erhalten und würden Sie gerne persönlich kennenlernen.",
    "Hätten Sie am Montag nächster Woche um halb zehn Zeit für ein Vorstellungsgespräch bei uns in Köln?",
    "Bitte bringen Sie Ihren Lebenslauf und Ihre Zeugnisse mit.",
  ], [
    "Gerne. Also, langsam: Hier ist Frau Hoffmann. Vom Krankenhaus. In Köln.",
    "Wir möchten Sie kennenlernen. Zu einem Vorstellungsgespräch.",
    "Am Montag. Um halb zehn. Also neun Uhr dreißig.",
    "Bitte bringen Sie mit: Ihren Lebenslauf. Und Ihre Zeugnisse.",
  ]);
  const i = await ask(ME, "(Was antworte ich?)", ["Ja, gerne! Am Montag um halb zehn passt mir sehr gut.", "Ja… Montag… zehn Uhr dreißig?", "Was ist ein Vorstellungsgespräch?"], -1, { correct: 0 });
  if (i === 0) { points(6, "souverän am Telefon"); await say("Frau Hoffmann", "Wunderbar! Dann bis Montag. Ich schicke Ihnen die Einladung per E-Mail."); }
  else if (i === 1) { await say("Frau Hoffmann", "Halb zehn – das ist neun Uhr dreißig. Eine halbe Stunde vor zehn."); await say(ME, "Ah! Neun Uhr dreißig. Ja, gerne!"); }
  else { await say("Frau Hoffmann", "Ein Gespräch, in dem wir uns kennenlernen. Wir stellen Fragen, Sie stellen Fragen. Keine Angst!"); await say(ME, "Ah, ein Interview! Ja, sehr gerne. Am Montag um halb zehn."); }
  learn("halb_zehn", "vorstellungsgespraech");
  await Mini.quiz([
    { q: "Wer hat angerufen?", o: ["Ein Krankenhaus in Köln", "Das Bürgeramt", "Jonas' Mutter"], a: 0, why: "Frau Hoffmann vom St.-Marien-Klinikum in Köln." },
    { q: "Wann ist das Gespräch?", o: ["Montag, 9:30 Uhr", "Montag, 10:30 Uhr", "Dienstag, 9:30 Uhr"], a: 0, why: "»Halb zehn« heißt: eine halbe Stunde VOR zehn. Also 9:30 Uhr. Eine klassische Falle!" },
    { q: "Was soll ich mitbringen?", o: ["Lebenslauf und Zeugnisse", "Nur meinen Pass", "Kuchen"], a: 0, why: "Lebenslauf und Zeugnisse. Kuchen ist aber nie verkehrt." },
  ], 5);
  doc("einladung");
  step("q_koeln", "anruf");
  set("anruf_done");
  unlockCity("koeln");
  friend("hoffmann", 0);
  await say("Jonas", "Wer war das? …KÖLN?! Du gehst nach Köln?");
  await say(ME, "Erstmal nur zum Vorstellungsgespräch. Aber… wenn sie mich nehmen…");
  await say("Mai", "Dann nehmen sie dich. Pflegekräfte werden überall gesucht. Und du bist gut.");
  await say("Jonas", "Dann brauchst du da eine Wohnung. Und eine Krankenkasse. Und ein Konto. Und dich wieder anmelden. Willkommen in Level zwei der deutschen Bürokratie.");
  await say("Jonas", "Aber vorher: Abschiedsparty! Heute Abend. Hier. Ich lade alle ein.");
  learn("abschied");
  quest("q_abschied");
  // --- Party ---
  await UI.tone(1, 0.6);
  await narr("Am Abend.");
  Audio_.bgm("Radio - March");
  set("party");
  World.refresh();
  place("Kofi WG", 1, 6, 6); place("Carmen WG", 8, 4, 4); place("Mohammed WG", 9, 7, 8); place("Ercan WG", 3, 7, 8);
  place("Jonas", 6, 5, 2); place("Mai", 4, 5, 6);
  place(World.player, 5, 7, 8);
  await UI.tone(0, 0.6);
  await narr("Die kleine WG-Küche ist voll. Kofi hat Musik mitgebracht, Ercan Getränke aus dem Späti, Carmen eine Tortilla, Mohammed Kopien von allen Fotos.");
  await say("Kofi", "Eine Rede! Eine Rede!");
  const r = await ask(ME, "(Eine Rede? Ich…)", ["Danke für alles. Ich werde euch [[vermissen]].", "Äh… Prost!", "Ich bin erst seit drei Wochen hier, aber ihr seid schon wie eine Familie für mich."], -1, { correct: [0, 2] });
  learn("vermissen");
  if (r === 1) await say("Kofi", "Prost! Kurz und gut. Das ist eine deutsche Rede.");
  else if (r === 2) { points(6, "B1-Satz"); await say("Mai", "…Ich weine nicht. Das sind die Zwiebeln. Es gibt keine Zwiebeln. Egal."); }
  else await say("Jonas", "Wir dich auch. Aber Köln ist nur vier Stunden mit dem ICE. Plus Verspätung: sechs.");
  await say("Carmen", "Und wenn ich in München bin, besuchst du mich. Du hast es versprochen!");
  await say("Mohammed", "Mein Tipp für Köln: Mach von allem eine Kopie. Von ALLEM. Hier, ich habe dir schon eine Mappe gemacht.");
  await say("Ercan", "Und wenn du zurückkommst: Der Späti ist immer offen. Fast immer.");
  friend("carmen", 1); friend("mohammed", 1); friend("ercan", 1);
  step("q_abschied", "party");
  await UI.tone(1, 0.6);
  unset("party");
  World.refresh();
  place(World.player, 5, 6, 8);
  await narr("Später in der Nacht. Alle sind gegangen. Ich liege im Bett und schreibe in die WG-Gruppe.");
  await UI.tone(0, 0.4);
  await sms("WG Lehrter 12 🏠", [{ from: "Kofi", text: "Gute Nacht Leute!! Was für ein Wochenende ⚽🎉" }, { from: "Carmen", text: "Muchas gracias por todo 💛" }],
    { prompt: "Schreib allen: Danke für den schönen Abend.", answers: ["Danke für den schönen Abend!", "Danke für den schönen Abend."], mode: "sentence",
      need: [["danke", "vielen dank"], ["abend"]], tips: ["Fang an mit »Danke für …«", "Was war schön? Der … (Abend)"] },
    [{ from: "Jonas", text: "Danke DIR! 🥲" }, { from: "Mai", text: "Schlaf gut, Kölnerin 😄" }], { group: true });
  step("q_abschied", "nachricht");
  finish("q_abschied", 20);
  diary("d_abschied", "Abschiedsparty. Kofi, Carmen, Mohammed, Ercan, Jonas, Mai. Vor drei Wochen kannte ich niemanden in Deutschland. Heute hatte ich zu wenig Stühle.");
  await think("Morgen fahre ich nach Köln. Die Fahrkarte kaufe ich im Reisezentrum am Hauptbahnhof. Bei Tarek.");
});

// ------------------------------------------------------------------------------
// Reisezentrum – Fahrkarte kaufen und reisen
// ------------------------------------------------------------------------------
scene("reisezentrum", async () => {
  if (ep() === 7 && flag("berlin_rueckfahrt")) { await World.call("reise_zurueck"); return; }
  if (ep() === 10 && flag("finale_zug")) { await World.call("finale_bahnhof"); return; }
  if (!flag("abschied_done") || ep() !== 3) {
    if (ep() >= 4) { await World.call("reisezentrum_frei"); return; }
    await narr("<b>DB Reisezentrum</b>\nFahrkarten, Reservierungen, Auskunft.\nTäglich 6 – 22 Uhr.");
    if (ep() <= 3) await think("Im Moment muss ich nirgendwohin. Zum Glück.");
    return;
  }
  if (!hasDoc("ice_ticket")) {
    await say("Tarek", "Na, wen haben wir denn da! Die Lehrter Straße haben Sie damals gefunden, ja?");
    await say(ME, "Ja! Rechts, erste links, geradeaus. Ich habe es nicht vergessen.");
    await say("Tarek", "Und heute? Wohin soll es gehen?");
    const i = await ask(ME, "(Wie sage ich es?)", ["Köln. Ticket. Bitte.", "Ich möchte eine Fahrkarte nach Köln.", "Ich hätte gern eine Fahrkarte nach Köln, bitte. Am liebsten eine direkte Verbindung, ohne Umsteigen."], -1, { correct: 2 });
    learn("umsteigen");
    if (i === 0) await say("Tarek", "Köln, Ticket, bitte – verstanden! Aber ich weiß, dass Sie mehr können.");
    else if (i === 1) { points(4); await say("Tarek", "Sehr gut. Klar und höflich."); }
    else {
      points(8, "Satz auf B1-Niveau");
      await say("Tarek", "Wow. Vor drei Wochen haben Sie »Lehrter Straße… wo?« gesagt. Und jetzt? Konjunktiv! »Ich hätte gern«!");
      await think("Er hat recht. Ich spreche anders als am Anfang.");
    }
    await say("Tarek", "Es gibt einen direkten ICE. ICE 949, ab Gleis 4, 11:52 Uhr. Ohne Umsteigen. Mit Sparpreis – das heißt Zugbindung: nur dieser Zug!");
    await say("Tarek", "Gute Reise. Und viel Glück in Köln! Ich bin sicher, die nehmen Sie.");
    friend("tarek", 1);
    doc("ice_ticket");
    step("q_koeln", "fahrkarte");
  }
  if ((await ask(null, "Jetzt mit dem Zug nach Köln fahren?", ["Ja, die Deutschlandkarte öffnen", "Noch nicht"], -1, { correct: 0, multi: true })) === 0) {
    await Karte.travel("koeln");
  }
});

scene("koeln_noch_nicht", async () => { await think("Erst schaue ich mir den Dom an. Er ist direkt da oben!"); await walk("player", "R"); });

scene("koeln_ankunft", async () => {
  await durchsage("Meine Damen und Herren, in Kürze erreichen wir Köln Hauptbahnhof. Ausstieg in Fahrtrichtung rechts.");
  await durchsage("Wir bedanken uns für Ihre Reise und wünschen Ihnen einen schönen Tag.");
  await think("Ich habe die ganze Durchsage verstanden. Jedes Wort.");
  await walk("player", "UUUU");
  player().dir = 8;
  await wait(0.3);
  await exclaim(player());
  await scrollCam(0, -190, 1.6);
  await think("Der Dom… Er ist riesig! Direkt neben dem Bahnhof!");
  learn("dom");
  step("q_koeln", "reise");
  finish("q_koeln", 15);
  await think("Vor drei Wochen habe ich gesagt: »Ein bisschen.«");
  await think("Heute habe ich einen Brief vom Amt verstanden, ein Telefonat geführt, einen Einkaufszettel geschrieben, Fußball geschaut – und mich von Freunden verabschiedet.");
  await think("Es ist schwierig. Aber ich kann es lernen.");
  await scrollCam(0, 190, 1.2);
  set("koeln_done");
  diary("d_ep3", "Berlin war mein erstes Zuhause in Deutschland. Jetzt beginnt Köln. Ich habe Angst. Und ich freue mich. Beides gleichzeitig. Mai sagt, das ist normal.");
  await finishEpisode(3, 20);
  await World.call("ep4_start");
});

scene("koelner", async () => {
  face();
  await say("Kölner", "Alaaf! …Ach, ist ja gar kein Karneval. Egal. Willkommen in Kölle!");
  await say("Kölner", "»Kölle« ist Köln auf Kölsch. Kölsch ist unser Dialekt. Und unser Bier. Und eigentlich alles.");
});
scene("koeln_reisende", async () => {
  face();
  await say("Reisende", "Der Zug nach Düsseldorf? Fährt alle zehn Minuten. Wenn er fährt.");
  await say("Reisende", "Köln und Düsseldorf mögen sich übrigens nicht so. Sag in Köln nie, dass dir Düsseldorf gefällt!");
});
scene("dom", async () => {
  await narr("<b>Der Kölner Dom</b>");
  await narr("157 Meter hoch. Gebaut von 1248 bis 1880 – über 600 Jahre.");
  await think("Über 600 Jahre Bauzeit. Länger als eine Terminvergabe beim Bürgeramt. Knapp.");
  learn("dom");
});

// WG-Gäste (nur während der Party sichtbar)
scene("party_gast", async () => { face(); await say(SR.EV.name.replace(" WG", ""), "Auf {name}! Und auf Köln!"); });
