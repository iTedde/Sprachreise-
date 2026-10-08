// Sprachreise – Episode 4: Wohnung & Konto (Bürokratie) · Köln-Ehrenfeld
// Deutschland: Wohnungsmarkt, Kaltmiete/Warmmiete/Kaution, Schufa, Ummeldung, Girokonto, Überweisung
// Deutsch: Anzeigen lesen, Perfekt (»Ich habe … gearbeitet«), telefonisch einen Termin machen, Verwendungszweck schreiben
// Menschen: Frau Hoffmann, Luca, Frau Jansen, Herr Wagner · Veränderung: Sie macht Behördengänge jetzt allein – und ohne Panik.
"use strict";

Object.assign(SR.WORDS, {
  lebenslauf: { de: "Lebenslauf", art: "der", pl: "die Lebensläufe", en: "CV, résumé", cat: "Arbeit", ex: "Bitte bringen Sie Ihren Lebenslauf mit." },
  schichtdienst: { de: "Schichtdienst", art: "der", en: "shift work", cat: "Arbeit", ex: "In der Pflege arbeitet man im Schichtdienst: Früh, Spät, Nacht." },
  arbeitsvertrag: { de: "Arbeitsvertrag", art: "der", pl: "die Arbeitsverträge", en: "employment contract", cat: "Arbeit", ex: "Ich habe meinen Arbeitsvertrag unterschrieben.", pts: 6 },
  probezeit: { de: "Probezeit", art: "die", en: "probation period", cat: "Arbeit", ex: "Die Probezeit dauert sechs Monate." },
  anzeige: { de: "Wohnungsanzeige", art: "die", pl: "die Wohnungsanzeigen", en: "flat advert", cat: "Wohnen", ex: "Ich lese jeden Tag Wohnungsanzeigen." },
  kaltmiete: { de: "Kaltmiete", art: "die", en: "rent without utilities", cat: "Wohnen", ex: "Die Kaltmiete ist 650 Euro.", note: "Kaltmiete = nur die Wohnung. Ohne Heizung, Wasser, Müll." },
  nebenkosten: { de: "Nebenkosten", art: "die (Pl.)", en: "additional costs, utilities", cat: "Wohnen", ex: "Die Nebenkosten sind 200 Euro.", note: "Heizung, Wasser, Müll, Hausreinigung … Abkürzung: NK" },
  warmmiete: { de: "Warmmiete", art: "die", en: "rent incl. utilities", cat: "Wohnen", ex: "Die Warmmiete ist 850 Euro.", note: "Warmmiete = Kaltmiete + Nebenkosten." },
  kaution: { de: "Kaution", art: "die", en: "deposit", cat: "Wohnen", ex: "Die Kaution sind drei Kaltmieten.", note: "Höchstens drei Kaltmieten. Man bekommt sie beim Auszug zurück.", pts: 5 },
  besichtigung: { de: "Besichtigung", art: "die", pl: "die Besichtigungen", en: "viewing", cat: "Wohnen", ex: "Die Besichtigung ist am Dienstag um 18 Uhr." },
  schufa: { de: "Schufa-Auskunft", art: "die", en: "credit report", cat: "Wohnen", ex: "Der Vermieter will eine Schufa-Auskunft sehen.", note: "Zeigt, ob man Schulden hat. Neu in Deutschland? Dann steht da oft noch fast nichts." },
  mieter: { de: "Mieter / Mieterin", art: "der / die", en: "tenant", cat: "Wohnen", ex: "Als Mieterin habe ich Rechte." },
  ummelden: { de: "sich ummelden", en: "to register a change of address", cat: "Behörden", ex: "Nach dem Umzug muss ich mich ummelden." },
  konto: { de: "Konto", art: "das", pl: "die Konten", en: "bank account", cat: "Bank", ex: "Ich möchte ein Konto eröffnen.", note: "Für das Gehalt braucht man ein Girokonto." },
  iban: { de: "IBAN", art: "die", en: "IBAN (account number)", cat: "Bank", ex: "Meine IBAN beginnt mit DE.", note: "DE + 2 Prüfziffern + Bankleitzahl + Kontonummer = 22 Zeichen." },
  ueberweisung: { de: "Überweisung", art: "die", pl: "die Überweisungen", en: "bank transfer", cat: "Bank", ex: "Ich mache eine Überweisung an die Vermieterin." },
  verwendungszweck: { de: "Verwendungszweck", art: "der", en: "payment reference", cat: "Bank", ex: "Verwendungszweck: Kaution Körnerstraße 21", pts: 5 },
  geldautomat: { de: "Geldautomat", art: "der", pl: "die Geldautomaten", en: "cash machine, ATM", cat: "Bank", ex: "Ich hole Geld am Geldautomaten." },
  pin: { de: "PIN", art: "die", en: "PIN", cat: "Bank", ex: "Die PIN kommt mit der Post." },
  veedel: { de: "Veedel", art: "das", en: "neighbourhood (Cologne)", cat: "Köln", ex: "Ehrenfeld ist mein Veedel.", note: "Kölsch für »Viertel«, Stadtteil." },
  hausordnung: { de: "Hausordnung", art: "die", en: "house rules", cat: "Wohnen", ex: "Laut Hausordnung ist ab 22 Uhr Ruhe." },
});

Object.assign(SR.QUESTS, {
  q_job: { title: "Das Vorstellungsgespräch", ep: 4,
    desc: "Montag, halb zehn, St.-Marien-Klinikum in Köln-Ehrenfeld. Das Klinikum liegt an der Venloer Straße, westlich vom Hauptbahnhof.",
    steps: [["weg", "Das Klinikum in Ehrenfeld finden"], ["gespraech", "Das Gespräch führen"], ["zusage", "Eine Antwort bekommen"]] },
  q_wohnung: { title: "Eine Wohnung in Köln", ep: 4,
    desc: "Die Stelle ist meine – aber ich wohne im Hostel. Ich brauche eine Wohnung. In Köln. Sofort. Viel Glück, sagt jeder.",
    steps: [["anzeigen", "Wohnungsanzeigen verstehen"], ["besichtigung", "Zur Besichtigung gehen"], ["anruf", "Frau Jansen anrufen"], ["vertrag", "Den Mietvertrag prüfen und unterschreiben"]] },
  q_ummelden: { title: "Ummelden in Köln", ep: 4,
    desc: "Neue Stadt, neue Adresse: Ich muss mich im Kundenzentrum Ehrenfeld ummelden. Diesmal weiß ich, was ich brauche.",
    steps: [["termin", "Einen Termin buchen"], ["amt", "Zum Kundenzentrum gehen"], ["mb", "Die neue Meldebescheinigung bekommen"]] },
  q_konto: { title: "Ein Konto eröffnen", ep: 4,
    desc: "Ohne Konto kein Gehalt – und keine Kaution. Die Rheinbank ist an der Venloer Straße.",
    steps: [["eroeffnen", "Ein Girokonto eröffnen"], ["iban", "Die IBAN verstehen"], ["kaution", "Die Kaution überweisen"]] },
  q_luca: { title: "Ein Cappuccino in Ehrenfeld", ep: 4, side: true,
    desc: "Im Café »Da Luca« riecht es nach Kaffee und Neapel.",
    steps: [["bestellen", "Einen Cappuccino bestellen"]] },
});

Object.assign(SR.DOCUMENTS, {
  arbeitsvertrag: { name: "Arbeitsvertrag", short: "St.-Marien-Klinikum Köln",
    text: "Arbeitsvertrag\nArbeitgeber: St.-Marien-Klinikum Köln\nArbeitnehmerin: {name} {nachname}\nTätigkeit: Pflegekraft (Anerkennungsverfahren läuft)\nBeginn: 1. des Monats · Vollzeit, Schichtdienst\nProbezeit: 6 Monate\n<c3=707078,D8D8D0>Vereinfachte Darstellung.</c3>" },
  mietvertrag_koeln: { name: "Mietvertrag (Köln)", short: "Körnerstraße 21, 2. OG",
    text: "Mietvertrag · Körnerstraße 21, 2. OG, 50823 Köln\nVermieterin: Hannelore Jansen\nMieterin: {name} {nachname}\nKaltmiete: 650 € · Nebenkosten: 200 € · Warmmiete: 850 €\nKaution: 1.950 € (drei Kaltmieten)\nEinzug: 1. des Monats" },
  wgb_koeln: { name: "Wohnungsgeberbestätigung (Köln)", short: "Unterschrieben von Frau Jansen",
    text: "Bestätigung des Wohnungsgebers\nWohnungsgeberin: Hannelore Jansen\nAnschrift: Körnerstraße 21, 50823 Köln\nMeldepflichtige Person: {name} {nachname}\nUnterschrift: H. Jansen <c3=307030,C0E0C0>(an der richtigen Stelle!)</c3>" },
  meldebescheinigung_koeln: { name: "Meldebescheinigung (Köln)", short: "Körnerstraße 21, 50823 Köln",
    text: "Einfache Meldebescheinigung\n{name} {nachname}\nKörnerstraße 21, 50823 Köln – Hauptwohnung\nStadt Köln · Kundenzentrum Ehrenfeld" },
  girokarte: { name: "Girokarte", short: "Rheinbank – Karte kommt per Post",
    text: "Girokonto bei der Rheinbank\nIBAN: DE12 3705 0198 0012 3456 78\nKarte: kommt per Post\nPIN: kommt per Post – <i>in einem anderen Brief, an einem anderen Tag</i>" },
});

// ------------------------------------------------------------------------------
scene("ep4_start", async () => {
  await UI.tone(1, 0.6);
  await UI.episodeCard(4, "Kaltmiete, Warmmiete, Kaution, IBAN.\nNeue Stadt – neue Formulare.");
  set("tarek_koeln", false);
  await narr("Ich schlafe zwei Nächte in einem Hostel am Dom. Acht Betten, sieben Menschen, die schnarchen.");
  await narr("Montag, 8:45 Uhr. Das Vorstellungsgespräch ist um halb zehn. Also um 9:30 Uhr. Nicht um 10:30 Uhr!");
  await UI.tone(0, 0.6);
  quest("q_job");
  await think("Das Klinikum ist in Ehrenfeld. Venloer Straße. Westlich vom Bahnhof – also links an der Domplatte vorbei.");
});

scene("klinik_zu", async () => { await narr("St.-Marien-Klinikum. Haupteingang."); });
scene("schild_venloer", async () => { await narr("<b>Venloer Straße</b>\n◀ Ehrenfeld-Gürtel   ▶ Innenstadt / Dom"); learn("veedel", true); });
scene("kvb", async () => {
  await narr("<b>KVB</b> · Haltestelle Körnerstraße\nLinie 3, 4 → Neumarkt · Linie 13 → Sülzgürtel");
  await think("KVB – so heißen hier die Busse und Bahnen. In Berlin war es die BVG. Jede Stadt hat ihre eigene Abkürzung.");
});
scene("parkbank_koeln", async () => { await narr("Eine Bank im Park. Von hier hört man die Kirchenglocken – und die Straßenbahn."); });
scene("koelner_ehrenfeld", async () => {
  face();
  if (!flag("veedel_lektion")) {
    await say("Kölner", "Na, neu im Veedel?");
    await ask(ME, "(Veedel?)", ["Was ist ein Veedel?", "Ja, ich bin neu hier."]);
    await say("Kölner", "Veedel – so sagen wir in Köln zum Viertel. Ehrenfeld ist das beste Veedel. Sagen alle aus Ehrenfeld.");
    learn("veedel");
    set("veedel_lektion");
  } else await say("Kölner", "Et kütt wie et kütt. – Es kommt, wie es kommt. Das ist Kölsch. Und eine Lebensphilosophie.");
});
scene("kiosk_frau", async () => { face(); await say("Kioskfrau", "Büdchen nennen wir das hier. Nicht Späti. Büdchen! Zeitung? Kaugummi? Lotto?"); });
scene("radfahrer", async () => { face(); await say("Radfahrer", "Vorsicht, Radweg! …Ach, das ist der Gehweg. Dann Vorsicht, ich!"); });
scene("mutter_koeln", async () => { face(); await say("Mutter", "Die Kita hier hat eine Warteliste von zwei Jahren. Mein Sohn ist drei. Wir warten seit der Geburt."); });
scene("rhein_noch_nicht", async () => { await think("Da hinten geht es zum Rhein. Später – erst Job, Wohnung, Konto."); await walk("player", "L"); });

// ------------------------------------------------------------------------------
// Vorstellungsgespräch
// ------------------------------------------------------------------------------
scene("vorstellung", async () => {
  step("q_job", "weg");
  if (!flag("vorstellung_drin")) {
    set("vorstellung_drin");
    await narr("Das Büro der Pflegedirektion. Zwei Schreibtische, viele Ordner, ein Kaktus.");
  }
  const hof = ev("Frau Hoffmann");
  await walk("player", "UU");
  player().dir = 8;
  await say("Frau Hoffmann", "Frau {nachname}? Guten Morgen! Pünktlich um halb zehn. Sehr schön. Wir hatten ja telefoniert.");
  await say("Frau Hoffmann", "Das ist Herr Brückner, er leitet die Station 3B. Bitte, setzen Sie sich.");
  learn("lebenslauf");
  const a = await ask("Frau Hoffmann", "Erzählen Sie uns doch kurz etwas über sich.", [
    "Ich heiße {name} {nachname}. Ich bin Krankenpflegerin.",
    "Ich heiße {name} {nachname}, ich komme {aus_land} und habe dort als Krankenpflegerin gearbeitet. Jetzt lerne ich Deutsch und möchte hier in der Pflege arbeiten.",
    "Ich… Pflege. Ja.",
  ], -1, { correct: 1 });
  if (a === 1) { points(6, "gut vorgestellt"); await say("Frau Hoffmann", "Sehr schön, danke."); }
  else if (a === 0) await say("Frau Hoffmann", "Kurz und klar. Gut. Erzählen Sie gern noch etwas mehr – wir haben Zeit.");
  else await say("Frau Hoffmann", "Ganz ruhig. Wir beißen nicht. Herr Brückner nur montags. Hihi.");
  await say("Herr Brückner", "Wie lange haben Sie schon als Krankenpflegerin gearbeitet?");
  await Typing.task({ speaker: "Herr Brückner", prompt: "»Wie lange haben Sie schon als Krankenpflegerin gearbeitet?«\n<span class=sub>Antworte im Perfekt. Du hast fünf Jahre gearbeitet.</span>",
    answers: ["Ich habe fünf Jahre als Krankenpflegerin gearbeitet."], mode: "sentence", place: "bottom", label: "Perfekt",
    need: [["habe"], ["fünf", "5"], ["jahre"], ["gearbeitet"]],
    tips: ["Perfekt: »Ich habe … gearbeitet.«", "Wie lange? Fünf …", "Fünf Jahre!", "Am Ende kommt das Partizip: gearbeitet."] });
  await say("Herr Brückner", "Fünf Jahre. Gut. Und – warum möchten Sie in Deutschland arbeiten?");
  const lvl = SR.levelIndex();
  const opts = ["Ich möchte arbeiten und ich lerne Deutsch.", "Weil es hier viel Geld gibt."];
  if (lvl >= 1) opts.splice(1, 0, "Ich möchte gerne hier arbeiten, weil ich mich beruflich weiterentwickeln und gleichzeitig mein Deutsch verbessern möchte.");
  const b = await ask(ME, "(Was antworte ich?)", opts, -1, { correct: lvl >= 1 ? 1 : 0 });
  if (opts[b].startsWith("Weil es hier viel Geld")) { wrong("Ehrlich – aber nicht ideal im Vorstellungsgespräch."); await say("Herr Brückner", "Ehrlich… Na ja, reich wird man in der Pflege leider nicht. Aber man wird gebraucht."); }
  else if (b === 1 && lvl >= 1) { points(8, "Nebensatz mit »weil«"); await say("Herr Brückner", "Ein Nebensatz mit »weil« – im Vorstellungsgespräch. Respekt."); }
  else await say("Herr Brückner", "Gut. Deutsch lernen ist wichtig. Auf der Station spricht keiner langsam.");
  learn("schichtdienst");
  await say("Herr Brückner", "Bei uns arbeiten Sie im [[schichtdienst|Schichtdienst]]. Frühdienst, Spätdienst, manchmal Nachtdienst. Ist das ein Problem?");
  await ask(ME, "(…)", ["Nein, das kenne ich schon.", "Nachtdienst? Hm… okay."]);
  const f = await ask("Frau Hoffmann", "Haben Sie noch Fragen an uns?", ["Nein.", "Ja: Wie läuft die Einarbeitung?", "Ja: Gibt es Hilfe bei der Anerkennung meines Diploms?"], -1, { correct: [1, 2] });
  if (f === 0) await say("Frau Hoffmann", "Tipp für das nächste Mal: Immer eine Frage stellen! Das zeigt Interesse.");
  else if (f === 1) { points(4); await say("Herr Brückner", "Sie bekommen eine Kollegin an die Seite. Vier Wochen lang. Meistens Aga. Sie werden sie mögen. Oder fürchten."); }
  else { points(4); await say("Frau Hoffmann", "Ja. Wir helfen bei den Papieren für die Anerkennung. Und mit B1 können Sie bei uns anfangen – B2 brauchen Sie später für die volle Anerkennung."); }
  step("q_job", "gespraech");
  await say("Frau Hoffmann", "…Frau {nachname}, ich mache es kurz: Wir möchten Sie gern einstellen. Ab dem Ersten des nächsten Monats.");
  await exclaim(player());
  await say(ME, "Wirklich?! Danke! Vielen, vielen Dank!");
  learn("arbeitsvertrag", "probezeit");
  await say("Frau Hoffmann", "Hier ist Ihr Arbeitsvertrag. Lesen Sie ihn in Ruhe. Probezeit sechs Monate. Und dann brauchen Sie noch: eine Wohnung in Köln, die Ummeldung und ein deutsches Konto für das Gehalt.");
  doc("arbeitsvertrag");
  step("q_job", "zusage");
  finish("q_job", 30);
  set("job_zusage");
  friend("hoffmann", 1);
  await say("Herr Brückner", "Wohnung in Köln… Da wünsche ich Ihnen viel Glück. Ehrlich. Viel Glück.");
  quest("q_wohnung"); quest("q_konto");
  diary("d_job", "ICH HABE EINEN JOB! St.-Marien-Klinikum, Station 3B. Herr Brückner hat »Viel Glück« zur Wohnungssuche gesagt. Zweimal. Das macht mir Angst.");
  await think("Zuerst brauche ich einen Kaffee. Und dann eine Wohnung. Gegenüber ist ein Café.");
});

scene("hoffmann", async () => {
  face(ev("Frau Hoffmann"));
  if (ep() === 4) await say("Frau Hoffmann", flag("eingezogen") ? "Sie haben eine Wohnung? In zwei Wochen? Dann sind Sie für Köln bereit." : "Wohnung, Ummeldung, Konto. In dieser Reihenfolge – und bitte nicht verzweifeln.");
  else if (ep() === 8) await World.call("hoffmann_ep8");
  else await say("Frau Hoffmann", "Alles gut auf Station? Wenn es Probleme gibt – meine Tür ist offen. Meistens.");
});
scene("kaiser", async () => {
  face(ev("Herr Kaiser"));
  if (ep() === 8) { await World.call("kaiser_ep8"); return; }
  await say("Herr Kaiser", "Personalabteilung, Kaiser. Gehaltsabrechnung, Urlaubsanträge, Bescheinigungen. Ich bin der Mann für Papier.");
});
scene("station_zu", async () => { await narr("»Zu den Stationen« – Zutritt nur für Personal."); });

// ------------------------------------------------------------------------------
// Café »Da Luca«
// ------------------------------------------------------------------------------
scene("luca", async () => {
  face(ev("Luca"));
  if (ep() === 5 && active("q_cafe2")) { await World.call("cafe2"); return; }
  if (!met("luca")) {
    quest("q_luca");
    await say("Luca", "Buongiorno! Willkommen bei »Da Luca«. Neu hier? Ich kenne alle Gesichter in Ehrenfeld. Deins nicht.");
    await say(ME, "Ja, ich bin neu. Seit heute habe ich einen Job im Klinikum!");
    await say("Luca", "Complimenti! Dann brauchst du einen Kaffee. Was möchtest du?");
    await Typing.task({ speaker: "Luca", prompt: "Bestell einen Cappuccino.", answers: ["Einen Cappuccino, bitte.", "Ich hätte gern einen Cappuccino.", "Ich möchte einen Cappuccino, bitte."],
      mode: "sentence", place: "top", label: "Bestellen", minWords: 2, need: [["cappuccino", "capuccino", "cappucino"], ["einen"]], tips: ["Was möchtest du? Einen C…", "Akkusativ: EINEN Cappuccino."] });
    await say("Luca", "Ecco! Ein Cappuccino. Vor elf Uhr. Perfekt. Nach elf Uhr trinkt man in Italien keinen Cappuccino. Aber wir sind ja in Köln.");
    step("q_luca", "bestellen");
    finish("q_luca", 8);
    friend("luca", 1);
    await say("Luca", "Und? Was machst du heute noch? Du siehst aus wie jemand mit einer Liste.");
    await say(ME, "Ich suche eine Wohnung.");
    await say("Luca", "Ahhh. Eine Wohnung in Köln. Dann brauchst du zwei Cappuccini. Hier, die Zeitung – Seite 14, Wohnungsanzeigen. Viel Glück.");
    await World.call("anzeigen");
    return;
  }
  if (active("q_wohnung") && !flag("jansen_tipp") && flag("besichtigung1_done")) {
    await say("Luca", "Und? Wie war die Besichtigung?");
    await say(ME, "Dreißig Leute. Eine Wohnung. Und der Makler wollte eine Schufa-Auskunft, die ich nicht habe.");
    await say("Luca", "Mamma mia. Hör zu: Frau Jansen, eine Stammkundin – ihr gehört das Haus in der Körnerstraße 21. Die Wohnung im zweiten Stock wird frei. Sie inseriert nicht im Internet. Sie mag keine Internet-Menschen.");
    await say("Luca", "Ruf sie an. Sag, dass Luca dich schickt. Und sei höflich. Sehr höflich. Sie ist… eine Dame.");
    set("jansen_tipp");
    await World.call("jansen_anruf");
    return;
  }
  if (ep() >= 5) { await say("Luca", "Ciao, bella! Das Übliche? Cappuccino – vor elf natürlich."); return; }
  await say("Luca", flag("eingezogen") ? "Nachbarin! Jetzt bist du eine echte Ehrenfelderin. Der erste Kaffee als Nachbarin geht aufs Haus." : "Noch einen Cappuccino? Die Wohnungssuche ist lang. Der Kaffee ist stark.");
});
scene("cafe_gast", async () => { face(); await say("Gast", "Ich wohne seit 1998 in Ehrenfeld. Damals war die Miete die Hälfte. Und der Kaffee auch."); });
scene("kuchentheke", async () => { await narr("Tiramisu, Käsekuchen, Apfelstrudel – und ein Schild: »Kuchen nur mit Kaffee. Sagt Luca.«"); });

// Wohnungsanzeigen lesen (Abkürzungen, Warmmiete, Kaution)
scene("anzeigen", async () => {
  learn("anzeige");
  await UI.withPaper("Kölner Rundschau · Wohnungsmarkt", "<b>Ehrenfeld</b>: 2 ZKB, 52 m², 650 € KM + 200 € NK, Kaution 3 KM, EBK, Balkon. Besichtigung Di 18 Uhr, Körnerstr. 8\n\n<b>Nippes</b>: 1-Zi.-App., 28 m², 720 € warm, nur an Studenten\n\n<b>Lindenthal</b>: 4 ZKB, 120 m², 2.400 € KM – »Schufa und Gehaltsnachweise der letzten 5 Jahre erforderlich«", "paper", async () => {
    await think("ZKB? KM? NK? EBK? Das ist eine Geheimsprache.");
    await Mini.quiz([
      { q: "»2 ZKB« heißt…", o: ["2 Zimmer, Küche, Bad", "2 Zimmer, kein Balkon", "2 km zum Bahnhof"], a: 0, why: "Z = Zimmer, K = Küche, B = Bad." },
      { q: "»650 € KM + 200 € NK« – wie hoch ist die Warmmiete?", o: ["650 €", "850 €", "200 €"], a: 1, why: "Warmmiete = Kaltmiete + Nebenkosten: 650 + 200 = 850 €." },
      { q: "»Kaution 3 KM« – wie viel Kaution muss ich zahlen?", o: ["600 €", "1.950 €", "2.550 €"], a: 1, why: "Drei Kaltmieten: 3 × 650 € = 1.950 €. Die Nebenkosten zählen nicht mit." },
      { q: "»EBK« bedeutet…", o: ["Einbauküche", "Eigener Balkon", "Erdgeschoss, Badewanne, Keller"], a: 0, why: "EBK = Einbauküche. In Deutschland ist das nicht selbstverständlich – manchmal muss man die Küche selbst mitbringen!" },
    ], 5);
  });
  learn("kaltmiete", "nebenkosten", "warmmiete", "kaution");
  step("q_wohnung", "anzeigen");
  set("besichtigung1");
  await think("Ehrenfeld, Körnerstraße 8. Besichtigung heute um 18 Uhr. Das ist gleich um die Ecke!");
  diary("d_anzeigen", "In deutschen Wohnungsanzeigen fehlen die Vokale. 2 ZKB, KM, NK, EBK. Wie bei SMS. Aber teurer.");
});

// ------------------------------------------------------------------------------
// Besichtigung Körnerstraße 8 (Satire: 30 Leute, Schufa-Paradox)
// ------------------------------------------------------------------------------
scene("koerner8", async () => {
  if (!flag("besichtigung1")) { await narr("Körnerstraße 8. Ein Mehrfamilienhaus."); return; }
  await narr("Körnerstraße 8. Vor der Tür stehen schon zwanzig Leute. Alle mit Mappen.");
});
scene("besichtigung_start", async () => {
  set("besichtigung1_start");
  learn("besichtigung");
  await narr("Die Wohnung ist voll. Sehr voll. Ich zähle 31 Menschen. In 52 Quadratmetern.");
  await say("Herr Krämer", "So, meine Damen und Herren! Ich bin Herr Krämer, der Makler. Bitte nicht alle gleichzeitig ins Bad.");
  await say("Interessent", "(flüstert) Ich bin schon bei der 47. Besichtigung. Ich habe ein Excel dafür.");
  await think("Ich muss mit dem Makler sprechen. Er steht oben in der Küche.");
});
scene("interessent", async () => {
  face();
  const lines = ["Ich habe eine Mappe mit 40 Seiten. Mit Fotos von meiner Katze. Vermieter lieben Katzenfotos.",
    "Wir sind ein Paar, beide Beamte, keine Kinder, keine Haustiere, keine Hobbys. Wir sind perfekte Mieter.",
    "Ich biete 100 Euro mehr! …Darf man das sagen? Darf man das nicht sagen?",
    "Die Küche ist kleiner als mein Kleiderschrank.",
    "Ich suche seit acht Monaten. Ich wohne bei meiner Mutter. Ich bin 41.",
    "Haben Sie die Schufa schon dabei? Ich habe sie laminiert."];
  await say("Interessent", lines[(SR.EV.id || 0) % lines.length]);
});
scene("makler", async () => {
  face();
  if (flag("besichtigung1_done")) { await say("Herr Krämer", "Wir melden uns. Vielleicht. Wahrscheinlich nicht."); return; }
  await say("Herr Krämer", "Ja? Haben Sie Interesse? Dann bräuchte ich: Ihre Schufa-Auskunft, die letzten drei Gehaltsnachweise und einen Arbeitsvertrag.");
  learn("schufa");
  const i = await ask(ME, "(Hm…)", ["Ich habe einen Arbeitsvertrag! Hier.", "Was ist eine Schufa?"]);
  if (i === 1) await say("Herr Krämer", "Eine Auskunft über Ihre Schulden. Ob Sie Ihre Rechnungen bezahlen. Ohne Schufa keine Wohnung.");
  await say(ME, "Ich bin neu in Deutschland. Ich habe noch keine Schufa-Geschichte. Und noch kein Gehalt – ich fange ja erst an.");
  await say("Herr Krämer", "Hm. Kein Gehaltsnachweis, keine Schufa… Dann wird es schwierig.");
  await say(ME, "Ich bekomme kein Gehalt ohne Konto, kein Konto ohne Anmeldung, keine Anmeldung ohne Wohnung und keine Wohnung ohne Gehalt?");
  await say("Herr Krämer", "Ja. So ist der Wohnungsmarkt. Ich mache die Regeln nicht. Ich verdiene nur daran.");
  await think("Das ist wie beim Bürgeramt in Berlin. Nur mit mehr Leuten.");
  step("q_wohnung", "besichtigung");
  set("besichtigung1_done");
  points(6);
  diary("d_besichtigung", "Besichtigung mit 31 Menschen. Ein Mann hatte seine Schufa laminiert. Ich hatte nur meinen Arbeitsvertrag und Hoffnung. Hoffnung reicht in Köln nicht.");
  await think("Ich gehe zu Luca. Ich brauche einen Kaffee. Und einen Plan.");
  await transfer("ehrenfeld", 36, 19, 2);
});

// ------------------------------------------------------------------------------
// Frau Jansen anrufen, Besichtigung Körnerstraße 21, Mietvertrag
// ------------------------------------------------------------------------------
scene("jansen_anruf", async () => {
  await think("Frau Jansen anrufen. Sehr höflich. Ich schreibe mir vorher auf, was ich sage.");
  Audio_.me("phone");
  const p = UI.paper("Anruf: Frau Jansen", "<c3=60D080,103020>Verbunden</c3>", "phone");
  try {
    await say("Frau Jansen", "Jansen?");
    await Typing.task({ speaker: "Frau Jansen", prompt: "Stell dich vor und sag, warum du anrufst: Du möchtest die Wohnung besichtigen.\n<span class=sub>Zum Beispiel: »Guten Tag, hier ist … Ich möchte die Wohnung besichtigen.«</span>",
      answers: ["Guten Tag, hier ist {name} {nachname}. Ich möchte die Wohnung besichtigen."], mode: "sentence", label: "Telefon", place: "bottom", pts: 8,
      need: [["möchte", "würde", "hätte"], ["wohnung"], ["besichtigen", "anschauen", "ansehen", "sehen"]],
      tips: ["Was möchtest du? »Ich möchte …«", "Was? Die W…", "Was möchtest du mit der Wohnung machen? b…"] });
    await say("Frau Jansen", "Ah. Hat Luca Sie geschickt? Er hat schon angerufen. Er sagt, Sie sind Krankenschwester und sehr höflich.");
    await say("Frau Jansen", "Kommen Sie doch gleich vorbei. Körnerstraße 21. Klingeln Sie bei Jansen, Erdgeschoss.");
  } finally { p.close(); }
  step("q_wohnung", "anruf");
  set("jansen_termin");
});
scene("koerner21", async () => {
  if (flag("schluessel")) { await narr("Klingelschild: <b>Wagner · {nachname} · Jansen</b>"); return; }
  if (!flag("jansen_termin")) { await narr("Körnerstraße 21. Klingelschilder: Jansen, Wagner, Schmitz-Bölling, (leer)."); return; }
  if (flag("mietvertrag_ok")) {
    if (!flag("kaution_ok")) { await narr("Frau Jansen ist nicht zu Hause. Ein Zettel: »Schlüssel gibt es, wenn die Kaution da ist. H. J.«"); return; }
    await World.call("schluessel_uebergabe");
    return;
  }
  await narr("Ich klingle bei Jansen.");
  await say("Frau Jansen", "Kommen Sie, kommen Sie. Die Wohnung ist im zweiten Stock. Vorsicht, die Treppe ist frisch geputzt.");
  await narr("Im Treppenhaus öffnet sich eine Tür. Ein älterer Herr schaut heraus. Er sagt nichts. Er schaut nur.");
  await say("Herr Wagner", "…Neue Mieterin?");
  await say("Frau Jansen", "Vielleicht, Herr Wagner. Vielleicht.");
  await say("Herr Wagner", "Hier ist ab 22 Uhr Ruhe. Mittwoch ist Treppenhaus. Und Fahrräder gehören in den Keller. Nicht in den Flur. Guten Tag.");
  await narr("Die Tür geht zu.");
  learn("hausordnung");
  friend("wagner", 0);
  await say("Frau Jansen", "Das war Herr Wagner. Er ist… sehr zuverlässig. Er nimmt Pakete an. Für das ganze Haus. Ob man will oder nicht.");
  await narr("Die Wohnung: zwei Zimmer, Küche, Bad. Ein Balkon zum Hof. Ein Baum vor dem Fenster.");
  await think("Ich will diese Wohnung. Sehr.");
  await say("Frau Jansen", "Sie arbeiten im Klinikum, sagt Luca. Mein verstorbener Mann war dort, am Ende. Die Schwestern waren sehr gut zu ihm.");
  await say("Frau Jansen", "Schufa? Ach, Kind. Ich habe einen Arbeitsvertrag gesehen, und ich habe Luca. Das reicht mir.");
  await say("Frau Jansen", "Hier ist der Mietvertrag. Lesen Sie ihn gut durch. Mein Neffe hat ihn geschrieben. Er ist Jurist. Also… lesen Sie ihn wirklich gut.");
  const errs = await Mini.findErrors("Mietvertrag · Körnerstraße 21, 2. OG", [
    ["Mieterin: {name} {nachname}", false, "Mein Name. Richtig."],
    ["Kaltmiete: 650 € monatlich", false, "Das steht auch in der Absprache."],
    ["Kaution: fünf Monatskaltmieten (3.250 €)", true, "Fünf Kaltmieten? Die Kaution darf höchstens drei Kaltmieten sein. Also 1.950 €."],
    ["Nebenkostenvorauszahlung: 200 €", false, "Das passt."],
    ["Die Mieterin muss jedes Jahr alle Räume neu streichen.", true, "Jedes Jahr streichen? So eine Klausel ist meistens unwirksam. Das muss raus."],
    ["Haustiere: nach Absprache", false, "Das ist normal."],
    ["Einzug: 1. des Monats", false, "Passt zu meinem Job!"],
  ], "Frau Jansen");
  await say("Frau Jansen", "Ach du liebe Zeit. Fünf Kaltmieten! Und jedes Jahr streichen! Mein Neffe ist ein Idiot. Ein Jurist, aber ein Idiot.");
  await say("Frau Jansen", "Drei Kaltmieten Kaution. Kein Streichen. Ich korrigiere das sofort. Mit Kugelschreiber. Und Unterschrift – an der richtigen Stelle!");
  doc("mietvertrag_koeln"); doc("wgb_koeln");
  learn("mieter");
  step("q_wohnung", "vertrag");
  finish("q_wohnung", 30);
  set("mietvertrag_ok"); set("wagner_draussen");
  await say("Frau Jansen", "Die Schlüssel bekommen Sie, wenn die Kaution auf meinem Konto ist. 1.950 Euro. Ich bin altmodisch, aber nicht naiv.");
  await think("Kaution überweisen – dafür brauche ich ein Konto. Und für das Konto brauche ich… die Anmeldung in Köln. Und dafür habe ich jetzt die Wohnungsgeberbestätigung!");
  quest("q_ummelden");
  await think("Termin im Kundenzentrum… Ich weiß ja, wie das geht: neu laden, neu laden, neu laden.");
  await narr("Zwanzig Minuten und vierzehn Mal »Neu laden« später: <b>Termin morgen, 8:40 Uhr, Kundenzentrum Ehrenfeld.</b>");
  step("q_ummelden", "termin");
  diary("d_jansen", "Ich habe eine Wohnung! Fast. Frau Jansen hat keine Schufa verlangt. Ihr Neffe hat einen Mietvertrag mit zwei Fehlern geschrieben. Ich habe beide gefunden. Und der Nachbar heißt Herr Wagner. Ab 22 Uhr ist Ruhe.");
});

// ------------------------------------------------------------------------------
// Kundenzentrum Ehrenfeld – Ummeldung (diesmal souverän)
// ------------------------------------------------------------------------------
scene("kz_zu", async () => { await narr("Kundenzentrum Ehrenfeld · Bürgerservice\nTermine nach Vereinbarung."); });
scene("kz_schalter", async () => {
  face(ev("Frau Berger"));
  if (hasDoc("meldebescheinigung_koeln")) { await say("Frau Berger", "Sie sind ja schon fertig. Alles Gute in Köln!"); return; }
  if (!stepDone("q_ummelden", "termin")) { await say("Frau Berger", "Haben Sie einen Termin? Nein? Dann bitte online buchen."); return; }
  step("q_ummelden", "amt");
  await say("Frau Berger", "Guten Morgen. Was kann ich für Sie tun?");
  const i = await ask(ME, "(Was sage ich?)", [
    "Guten Morgen. Ich möchte mich ummelden. Ich bin von Berlin nach Köln gezogen. Hier sind mein Pass, das ausgefüllte Formular und die Wohnungsgeberbestätigung.",
    "Ich habe ein Termin. Ummelden.",
  ], -1, { correct: 0 });
  learn("ummelden");
  if (i === 1) {
    await say("Frau Berger", "Einen Termin. Ja. Und für die Ummeldung brauche ich…");
    await say(ME, "…Entschuldigung. EINEN Termin. Hier: Pass, Formular, Wohnungsgeberbestätigung.");
  } else points(10, "alles in einem Satz");
  await say("Frau Berger", "…");
  await say("Frau Berger", "Alles dabei? Formular ausgefüllt? Unterschrift an der richtigen Stelle?");
  await say(ME, "Ja. Ich habe es zweimal kontrolliert.");
  await say("Frau Berger", "Sie sind die Erste heute, die alles dabeihat. Ich hole meine Kollegin. Die glaubt mir das sonst nicht.");
  se("pc", 0.8); await wait(0.5);
  await say("Frau Berger", "So. Ihre neue Meldebescheinigung. Willkommen in Köln, Frau {nachname}.");
  takeDoc("wgb_koeln");
  doc("meldebescheinigung_koeln");
  step("q_ummelden", "mb");
  finish("q_ummelden", 25);
  diary("d_ummelden", "Ummeldung in Köln: fünf Minuten. Fünf! In Berlin waren es zwei Besuche, ein Satire-Film und Frau Schulz. Heute habe ich nur einen Satz gesagt. Einen langen Satz.");
  await think("In Berlin hätte ich das nicht gekonnt. Jetzt schon.");
});
scene("kz_wartender", async () => { face(); await say("Wartender", "Ich bin hier für einen neuen Personalausweis. Mein alter ist im Rhein. Lange Geschichte. Karneval."); });
scene("kz_frau", async () => { face(); await say("Frau", "In Köln heißt das Bürgeramt »Kundenzentrum«. Wir sind hier alle Kunden. Kunden, die nicht gehen dürfen."); });

// ------------------------------------------------------------------------------
// Rheinbank – Konto, IBAN, Überweisung
// ------------------------------------------------------------------------------
scene("bank_zu", async () => { await narr("Rheinbank · Filiale Ehrenfeld."); });
scene("geldautomat", async () => {
  learn("geldautomat");
  if (!flag("konto")) await narr("Ein Geldautomat. Ohne Karte bringt er mir nichts.");
  else await narr("Ein Geldautomat. Meine Karte kommt per Post. Die PIN auch. Separat.");
});
scene("bank_kundin", async () => { face(); await say("Kundin", "Ich mache immer noch Überweisungen auf Papier. Mein Enkel sagt, das ist wie Brieftauben. Aber Brieftauben kommen an."); });
scene("bank_schalter", async () => {
  face(ev("Herr Yıldız"));
  if (flag("kaution_ok")) { await say("Herr Yıldız", "Ihre Karte kommt in fünf bis sieben Werktagen. Die PIN in einem separaten Brief. An einem anderen Tag. Aus Sicherheitsgründen."); learn("pin"); return; }
  if (!flag("konto")) {
    await say("Herr Yıldız", "Guten Tag! Was kann ich für Sie tun?");
    const i = await ask(ME, "(…)", ["Ich möchte ein Konto eröffnen.", "Ich brauche Geld."], -1, { correct: 0 });
    if (i === 1) await say("Herr Yıldız", "Das brauchen wir alle. Aber Sie meinen wahrscheinlich: ein Konto eröffnen?");
    learn("konto");
    await say("Herr Yıldız", "Gern. Dafür brauche ich von Ihnen ein paar Unterlagen.");
    const docs = [["reisepass", "yes"], ["meldebescheinigung_koeln", "yes"], ["arbeitsvertrag", "ok", "Den Arbeitsvertrag schaue ich mir auch gern an – für das Gehaltskonto."],
      ["diplom", "no", "Ihr Diplom brauchen wir nicht. Wir sind eine Bank, kein Krankenhaus."]];
    if (hasDoc("meldebescheinigung")) docs.push(["meldebescheinigung", "no", "Die Berliner Meldebescheinigung ist alt. Ich brauche die aktuelle aus Köln."]);
    const miss = await Mini.pickDocs("Herr Yıldız", "Welche Unterlagen geben Sie ab?", docs);
    if (miss.length) { await say("Herr Yıldız", "Mir fehlt noch: " + miss.map(k => SR.DOCUMENTS[k].name).join(", ") + "."); await say(ME, "Ach ja, hier."); }
    se("pc", 0.8); await wait(0.4);
    await say("Herr Yıldız", "Wunderbar. Ihr Girokonto ist eröffnet. Hier ist Ihre IBAN.");
    step("q_konto", "eroeffnen");
    set("konto");
    learn("iban");
    await UI.withPaper("Ihre Kontodaten", "<b>IBAN</b>: DE12 3705 0198 0012 3456 78\n<b>BIC</b>: RHEIDEK1XXX\nKontoinhaberin: {name} {nachname}", "screen", async () => {
      await Mini.quiz([
        { speaker: "Herr Yıldız", q: "Womit beginnt jede deutsche IBAN?", o: ["Mit DE", "Mit KÖ", "Mit 00"], a: 0, why: "DE steht für Deutschland. Dann kommen zwei Prüfziffern." },
        { speaker: "Herr Yıldız", q: "Wie viele Zeichen hat eine deutsche IBAN?", o: ["12", "22", "34"], a: 1, why: "22: DE + 2 Prüfziffern + 8 Ziffern Bankleitzahl + 10 Ziffern Kontonummer." },
      ], 4);
    });
    step("q_konto", "iban");
    doc("girokarte");
  }
  await say("Herr Yıldız", "Möchten Sie gleich eine Überweisung machen?");
  learn("ueberweisung");
  await say(ME, "Ja. Die Kaution für meine Wohnung. An Frau Jansen.");
  await Mini.form("Überweisung · Rheinbank", [
    { label: "Empfänger", req: true, o: ["Hannelore Jansen", "Herr Wagner", "Rheinbank"], a: 0, why: "Die Kaution geht an die Vermieterin: Hannelore Jansen." },
    { label: "IBAN Empfänger", req: true, o: ["DE44 3705 0198 0099 8877 66", "DE12 3705 0198 0012 3456 78", "44 3705 0198"], a: 0,
      why: "DE12… ist MEINE IBAN. Und ohne DE ist es keine IBAN. Die richtige steht im Mietvertrag: DE44…" },
    { label: "Betrag (Euro)", req: true, type: { prompt: "<b>Betrag</b> – drei Kaltmieten à 650 €", answers: ["1950", "1.950", "1950,00", "1.950,00"], mode: "word",
      validate: v => v.replace(/[.\s€]/g, "").replace(",00", "") === "1950" ? { ok: true, perfect: true } : { ok: false, msg: "3 × 650 = ?" }, hints: ["3 × 650 …", "1.950"] } },
    { label: "Verwendungszweck", req: true, word: "verwendungszweck",
      type: { prompt: "<b>Verwendungszweck</b> – wofür ist das Geld? (Kaution + Adresse)", answers: ["Kaution Körnerstraße 21"], mode: "sentence", minWords: 2,
        need: [["kaution"], ["körnerstraße", "koernerstrasse", "körnerstr", "21"]], tips: ["Wofür? K…", "Für welche Wohnung? Die Adresse!"] } },
  ], "Herr Yıldız: »Den Verwendungszweck nicht vergessen – sonst weiß Frau Jansen nicht, wofür das Geld ist.«");
  step("q_konto", "kaution");
  finish("q_konto", 25);
  set("kaution_ok");
  learn("pin");
  await say("Herr Yıldız", "Erledigt! Ihre Girokarte kommt per Post. Die PIN kommt auch per Post.");
  await say(ME, "Zusammen?");
  await say("Herr Yıldız", "Nein! Getrennt. In zwei Briefen. An verschiedenen Tagen. Aus Sicherheitsgründen.");
  await think("In Deutschland ist sogar die Post vorsichtig.");
  diary("d_bank", "Ich habe ein deutsches Konto. Meine IBAN hat 22 Zeichen. Ich kann sie noch nicht auswendig. Die Kaution ist überwiesen – mit Verwendungszweck. Jetzt muss Frau Jansen nur noch die Schlüssel finden.");
  await think("Jetzt zu Frau Jansen – Körnerstraße 21!");
});

// ------------------------------------------------------------------------------
// Schlüssel, Einzug, Herr Wagner
// ------------------------------------------------------------------------------
scene("schluessel_uebergabe", async () => {
  await say("Frau Jansen", "Die Kaution ist da. Mit Verwendungszweck! Wissen Sie, wie viele Leute das vergessen? Hier sind Ihre Schlüssel.");
  await narr("Drei Schlüssel: Haustür, Wohnung, Keller. Und ein vierter. »Für den Briefkasten. Den vergisst man immer.«");
  set("schluessel");
  points(10, "Schlüssel!");
  await say("Frau Jansen", "Willkommen in der Körnerstraße, Frau {nachname}.");
  await transfer("wohnung", 3, 8, 8);
});
scene("einzug", async () => {
  set("eingezogen");
  Audio_.bgm("Lappet Town");
  await narr("Meine Wohnung. Zwei Zimmer. Die Vormieterin hat einen Tisch, zwei Stühle und ein Bett dagelassen. Und einen Kaktus.");
  await think("Ein Kaktus. Wie bei Frau Hoffmann. Vielleicht ist das in Köln Pflicht.");
  await narr("Es klopft. Herr Wagner. Er hält ein Paket in der Hand.");
  place("Herr Wagner", 3, 7, 8);
  show("Herr Wagner", true);
  const w = ev("Herr Wagner");
  if (w) { w.visible = true; w.setSprite("OW 21"); }
  await say("Herr Wagner", "Ihr Paket. Kam heute Morgen. Ich habe es angenommen. Für Sie.");
  await say(ME, "Oh! Danke, Herr Wagner. Das ist sehr nett.");
  await say("Herr Wagner", "Das ist nicht nett. Das ist Ordnung. …Die Hausordnung hängt unten im Flur. Mittwoch ist Treppenhaus.");
  await say("Herr Wagner", "…Guten Abend.");
  if (w) w.visible = false;
  friend("wagner", 1);
  await narr("Das Paket ist von Mai und Jonas. Darin: eine Club-Mate, ein Stadtplan von Köln mit Jonas' Notizen – und Mais Ordner. Beschriftet: »Ordner Nr. 2«.");
  await sms("WG Lehrter 12 🏠", [{ from: "Jonas", text: "Ist das Paket angekommen?? 📦" }],
    { prompt: "Erzähl deinen Freunden die große Neuigkeit: Du hast eine Wohnung!", answers: ["Ich habe eine Wohnung!", "Ja! Und ich habe eine Wohnung!"], mode: "sentence", minWords: 2,
      need: [["habe", "hab"], ["wohnung"]], tips: ["Was hast du? »Ich habe …«", "Was hast du jetzt? Eine W…"] },
    [{ from: "Mai", text: "JAAAA 🎉🎉" }, { from: "Kofi", text: "In KÖLN?? In einer Woche?? Das ist illegal 😂" }, { from: "Jonas", text: "Ich bin offiziell neidisch. Ich suche seit 2019." }], { group: true });
  diary("d_ep4", "Job, Wohnung, Ummeldung, Konto – in zwei Wochen. Ohne Schufa. Mit Luca. Und Herr Wagner hat mein Paket angenommen. »Das ist nicht nett. Das ist Ordnung.« Ich glaube, er mag mich. Ein bisschen.");
  await finishEpisode(4, 20);
  await World.call("ep5_start");
});
scene("bett_koeln", async () => {
  if (ep() === 5 && !flag("ep5_morgen")) { await World.call("ep5_schlafen"); return; }
  if (ep() === 7 && !flag("ep7_started")) { await World.call("ep7_start"); return; }
  await think("Mein Bett in Köln. Durch das Fenster sieht man einen Baum. Und Herrn Wagners Wäsche.");
});
scene("kueche_koeln", async () => { await narr("Eine kleine Einbauküche. EBK! Ein Herd, ein Kühlschrank und ein Kaktus auf der Fensterbank."); });
scene("tisch_koeln", async () => {
  await narr("Der Tisch. Darauf: Mais Ordner Nr. 2, mein Arbeitsvertrag und eine Liste.");
  await think(ep() <= 5 ? "Mai hatte recht. In Deutschland braucht man mindestens drei Ordner." : "Der Ordner wird dicker. Ich glaube, ich brauche bald Ordner Nr. 3.");
});
scene("laptop_koeln", async () => {
  if (ep() === 8 && !flag("abh_termin")) { await World.call("abh_termin_buchen"); return; }
  if (ep() === 6 && active("q_krank")) { await think("Ich bin zu müde für den Laptop. Mein Kopf ist heiß."); return; }
  await narr("Mein Laptop. Neue Nachrichten von Mama, von Carmen – und eine Werbung für Wohnungsversicherungen.");
});
scene("wagner", async () => {
  face();
  const lv = friendLevel("wagner");
  if (ep() === 4) await say("Herr Wagner", "Ihr Fahrrad steht im Flur. …Ach, Sie haben gar kein Fahrrad. Dann ist es gut.");
  else if (ep() === 5 && !done("q_wagner")) await World.call("wagner_paket");
  else if (ep() === 8 && flag("abh_termin") && !flag("wagner_mut")) await World.call("wagner_ep8");
  else if (lv >= 3) await say("Herr Wagner", ["Guten Tag. Das Wetter ist heute akzeptabel.", "Haben Sie gegessen? Sie arbeiten zu viel. Wie meine Frau damals.", "Die Tonnen sind heute richtig getrennt. Danke."][U.rand(3)]);
  else await say("Herr Wagner", "Guten Tag. Mittwoch ist Treppenhaus.");
});

// Freie Reisen (ab Episode 4, Reisezentren)
scene("reisezentrum_frei", async () => {
  const st = S();
  const allowed = st.cities.filter(c => c !== st.currentCity && (c === "berlin" || c === "koeln" || ep() > 10));
  if (!allowed.length || [7].includes(ep())) { await narr("<b>DB Reisezentrum</b>\nHeute keine Reise geplant."); return; }
  if ((await ask(null, "Mit dem Zug fahren?", ["Ja, die Deutschlandkarte öffnen", "Noch nicht"], -1, { correct: 0, multi: true })) !== 0) return;
  await Karte.travel(null, { allowed });
});
scene("koeln_reisezentrum", async () => {
  if (ep() === 7 && flag("ep7_started") && !flag("reise_frankfurt")) { await World.call("reise_start"); return; }
  await World.call("reisezentrum_frei");
});
scene("tarek_koeln", async () => { face(); await say("Tarek", "Ich bin heute nur zum Umsteigen hier. Köln Hbf – der einzige Bahnhof mit einem Dom als Wartesaal."); });
scene("jonas_besuch", async () => { face(); await say("Jonas", "Besuch aus Köln! Bleibst du zum Essen? Es gibt… Nudeln mit Tomatensoße. Was sonst."); });
scene("mai_besuch", async () => { face(); await say("Mai", "Wie geht es dir? Du siehst müde aus. Und glücklich. Beides gleichzeitig – das ist Pflege."); });
