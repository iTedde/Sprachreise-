// Sprachreise – Episode 9: Nicht mit mir (Alltag + gesellschaftlicher Konflikt) · Köln-Ehrenfeld, Veedelsfest
// Deutschland: Ein Fest für alle – Menschen aus vielen Ländern, jede Figur individuell. Und: Vorurteile, Zivilcourage.
// Deutsch: argumentieren, nachfragen, sachlich widersprechen (A2 → B1), Gesprächsstrategien
// Menschen: Ralf, Ioana, Yaras Mutter, Kofi (zu Besuch) · Veränderung: Sie spricht für andere – ruhig, klar, mit Argumenten.
// Gestaltung nach Abschnitt 57–65: kein Moralpredigt-Text, keine Textwände. Situation → Behauptung → Reaktion → Argument → Konsequenz.
"use strict";

Object.assign(SR.WORDS, {
  veedelsfest: { de: "Veedelsfest", art: "das", en: "neighbourhood festival (Cologne)", cat: "Köln", ex: "Am Samstag ist Veedelsfest in Ehrenfeld." },
  behauptung: { de: "Behauptung", art: "die", pl: "die Behauptungen", en: "claim, assertion", cat: "Argumentieren", ex: "Das ist nur eine Behauptung. Gibt es Beweise?", pts: 5 },
  verallgemeinerung: { de: "Verallgemeinerung", art: "die", en: "generalisation", cat: "Argumentieren", ex: "»Alle« ist oft eine Verallgemeinerung.", pts: 6 },
  vorurteil: { de: "Vorurteil", art: "das", pl: "die Vorurteile", en: "prejudice", cat: "Argumentieren", ex: "Das ist ein Vorurteil.", pts: 5 },
  herkunft: { de: "Herkunft", art: "die", en: "origin, background", cat: "Gesellschaft", ex: "Man kann Menschen nicht nach ihrer Herkunft beurteilen." },
  beurteilen: { de: "beurteilen", en: "to judge", cat: "Argumentieren", ex: "Man sollte Menschen nach ihrem Verhalten beurteilen." },
  suendenbock: { de: "Sündenbock", art: "der", en: "scapegoat", cat: "Argumentieren", ex: "Für das Problem wird ein Sündenbock gesucht.", pts: 6 },
  sachlich: { de: "sachlich", en: "objective, matter-of-fact", cat: "Argumentieren", ex: "Bleib ruhig und sachlich." },
  quelle: { de: "Quelle", art: "die", en: "source", cat: "Argumentieren", ex: "Welche Quelle hast du dafür?" },
  zivilcourage: { de: "Zivilcourage", art: "die", en: "civil courage", cat: "Gesellschaft", ex: "Zivilcourage heißt: hinsehen und helfen – ohne sich selbst in Gefahr zu bringen.", pts: 8 },
  ordnerin: { de: "Ordnerin", art: "die", pl: "die Ordnerinnen", en: "steward (female)", cat: "Alltag", ex: "Bei Problemen hilft die Ordnerin.", note: "männlich: der Ordner. Achtung: auch »Ordner« = Aktenordner!" },
  notruf: { de: "Notruf 110", art: "der", en: "emergency number (police)", cat: "Gesellschaft", ex: "Bei Gewalt ruft man die 110.", note: "110 = Polizei · 112 = Feuerwehr und Rettungsdienst" },
});

Object.assign(SR.QUESTS, {
  q_fest: { title: "Veedelsfest in Ehrenfeld", ep: 9,
    desc: "Die Venloer Straße ist gesperrt – heute feiert ganz Ehrenfeld. Alle meine Leute sind da. Sogar Kofi ist aus Berlin gekommen!",
    steps: [["ankommen", "Aufs Fest gehen"], ["freunde", "Mit den Freunden an ihren Ständen sprechen"], ["leute", "Neue Leute kennenlernen"], ["abend", "Den Abend genießen"]] },
  q_nmm: { title: "Nicht mit mir", ep: 9, side: true,
    desc: "Am Bierstand redet ein Mann laut über »die Ausländer«. Ich könnte weggehen. Oder ruhig widersprechen.",
    steps: [["behauptung", "Die Behauptung hören"], ["nachfragen", "Nachfragen"], ["pruefen", "Die Begründung prüfen"], ["gegen", "Ein Gegenargument formulieren"], ["abschluss", "Das Gespräch abschließen"]] },
  q_zivil: { title: "Zivilcourage", ep: 9, side: true,
    desc: "Jemand bedroht Yaras Mutter. Was tue ich – ohne mich selbst in Gefahr zu bringen?",
    steps: [["helfen", "Richtig reagieren"], ["danach", "Mit Yara sprechen"]] },
});

// ------------------------------------------------------------------------------
scene("ep9_start", async () => {
  set("ep9_started");
  await UI.episodeCard(9, "Ein Fest für alle. Und ein Gespräch, das nicht leicht ist.");
  Audio_.bgm("Radio - March");
  await narr("Samstag. Durch das Fenster höre ich Musik. Trommeln, Gitarren, ein Akkordeon. Und Lachen.");
  Audio_.me("phone");
  await say("Aga", "(am Telefon) Schätzchen! Bist du wach?! Heute ist Veedelsfest! Die ganze Venloer ist gesperrt! Ich hab einen Pierogi-Stand! Und rate mal, wer aus Berlin gekommen ist!");
  await say("Kofi", "(im Hintergrund) ICH! Ich bin gekommen! Wegen der Pierogi!");
  learn("veedelsfest");
  set("fest_bereit");
  quest("q_fest");
  await think("Kofi in Köln! Ich gehe runter.");
});
scene("fest_bleiben", async () => { await think("Ich bleibe noch. Das Fest ist so schön."); await walk("player", "L"); });

scene("fest_start", async () => {
  set("fest_start");
  step("q_fest", "ankommen");
  await narr("Die Venloer Straße ist nicht wiederzuerkennen. Keine Autos – nur Stände, Tische, Lichterketten. Es riecht nach Falafel, Waffeln, Grillwurst und Pierogi.");
  await narr("Auf einer Bühne spielt eine Band. Kinder tanzen. Herr Wagner steht am Bierstand. Er… lächelt?");
  await narr("<c3=3050C8,C8D0F0>Tipp:</c3> Sprich mit deinen Freunden an ihren Ständen – und mit Leuten, die du noch nicht kennst.");
});
async function festAbendCheck() {
  if (!flag("fest_done") && stepDone("q_fest", "freunde") && (flag("nmm_ende") || flag("nmm_angeboten"))) await World.call("fest_abend");
}
function festFreunde() {
  const n = ["fest_luca_ok", "fest_yara_ok", "fest_aga_ok", "fest_kofi_ok"].filter(flag).length;
  if (n >= 4) step("q_fest", "freunde");
  const m = ["fest_oma_ok", "fest_mann_ok", "fest_frau_ok", "fest_kind_ok", "ioana_ok"].filter(flag).length;
  if (m >= 3) step("q_fest", "leute");
}
scene("fest_luca", async () => {
  face();
  if (!flag("fest_luca_ok")) {
    await say("Luca", "Bella! Gelato? Pistazie, Stracciatella oder… »Kölsch-Sorbet«. Das habe ich erfunden. Es schmeckt wie Kölsch. Niemand mag es.");
    await say("Luca", "Weißt du, ich bin seit 20 Jahren hier. Am Anfang war ich »der Italiener«. Dann »Luca vom Café«. Heute bin ich einfach Luca. Aus Ehrenfeld.");
    await say("Luca", "Heimat ist nicht, wo du geboren bist. Heimat ist, wo jemand weiß, wie du deinen Kaffee trinkst.");
    set("fest_luca_ok"); friend("luca", 1); festFreunde();
  } else { await say("Luca", "Noch ein Gelato? Für dich: gratis. Für Kofi: doppelter Preis. Er hat mein Kölsch-Sorbet beleidigt."); await festAbendCheck(); }
});
scene("fest_yara", async () => {
  face();
  if (!flag("fest_yara_ok")) {
    await say("Yara", "{name}! Das ist der Stand meiner Familie. Meine Mutter macht die besten Falafel in Köln. Mama, das ist {name}, meine Freundin aus dem Krankenhaus.");
    await say("Yaras Mutter", "Hallo! Willkommen! Essen, essen!");
    await say("Yara", "Meine Mutter spricht nicht viel Deutsch. Sie ist mit 58 Jahren gekommen. Für sie ist alles schwerer. Die Sprache, die Ämter, die Nachbarn.");
    await say("Yara", "Aber sie kennt alle Gemüsehändler in Ehrenfeld. Und alle kennen sie. Integration sieht nicht immer aus wie im Lehrbuch.");
    set("fest_yara_ok"); friend("yara", 1); festFreunde();
  } else await say("Yara", flag("eskalation_done") ? "Danke nochmal. Meine Mutter sagt, du bist jetzt ihre zweite Tochter. Sie meint das ernst. Du bekommst jetzt jeden Freitag Falafel." : "Noch Falafel? Meine Mutter hat mir verboten, dich gehen zu lassen, bevor du satt bist.");
});
scene("fest_aga", async () => {
  face();
  if (!flag("fest_aga_ok")) {
    await say("Aga", "Pierogi! Mit Kartoffeln und Käse oder mit Kraut. Rezept meiner Babcia. Meiner Oma.");
    await say("Aga", "Weißt du, was komisch ist? In Polen bin ich jetzt »die Deutsche«. Und hier manchmal noch »die Polin«. Nach zwölf Jahren!");
    await say("Aga", "Ich habe beschlossen: Ich bin beides. Und Kölnerin. Drei Sachen. Das ist kein Problem, das ist ein Upgrade.");
    set("fest_aga_ok"); friend("aga", 1); festFreunde();
  } else { await say("Aga", "Noch Pierogi? Herr Brückner hat schon zwölf gegessen. Er hat gesagt, das bleibt unter uns."); await festAbendCheck(); }
});
scene("fest_kofi", async () => {
  face();
  if (!flag("fest_kofi_ok")) {
    await say("Kofi", "{name}!!! Köln! Ich bin in Köln! Ein Berliner in Köln – das ist fast ein diplomatischer Besuch.");
    await say("Kofi", "Ich helfe hier am Jollof-Stand von Adaeze. Sie ist aus Lagos, aus Nigeria. Wir streiten seit einer Stunde, welcher Jollof besser ist: der ghanaische oder der nigerianische.");
    await say("Adaeze", "(vom Stand) Der nigerianische! Natürlich!");
    await say("Kofi", "Siehst du? Westafrikanische Diplomatie. Sehr ernst.");
    const i = await ask(ME, "(…)", ["Ich probiere beide und entscheide dann!", "Kann man nicht einfach beide mögen?"]);
    await say("Kofi", i === 0 ? "Gefährlich! Aber mutig." : "Nein. Absolut nicht. …Okay, vielleicht ein bisschen.");
    set("fest_kofi_ok"); friend("kofi", 1); festFreunde();
  } else { await say("Kofi", "Hast du Herrn Wagner gesehen? Er hat mit mir über Fußball geredet. 20 Minuten! Er ist Effzeh-Fan. Wir sind jetzt Freunde."); await festAbendCheck(); }
});
scene("fest_oma", async () => {
  face();
  await say("Frau Engel", "Kindchen! Ich bin's! Frau Engel! Die Hüfte ist wieder gut – ich tanze schon wieder!");
  await say("Frau Engel", "Siehste? Et hätt noch immer jot jejange.");
  if (!flag("fest_oma_ok")) { set("fest_oma_ok"); festFreunde(); points(4); }
});
scene("fest_mann", async () => {
  face();
  if (!flag("fest_mann_ok")) {
    await say("Mann", "Ich bin Emre. Der Enkel von Herrn Demir – Sie haben meinen Opa gepflegt! Er erzählt allen von der »netten Schwester mit dem Akzent«.");
    await say("Emre", "Ich bin in Ehrenfeld geboren. Wenn mich jemand fragt »Woher kommst du?«, sage ich: »Aus Ehrenfeld.« Und dann fragen sie: »Nein, woher wirklich?«");
    await say("Emre", "Wirklich? Aus Ehrenfeld. Venloer Straße. Dritter Stock.");
    learn("herkunft");
    set("fest_mann_ok"); festFreunde(); points(4);
  } else await say("Emre", "Grüßen Sie meinen Opa! Er sagt, er kommt nächstes Jahr zum Fest. Mit Hüfte oder ohne.");
});
scene("fest_frau", async () => {
  face();
  if (!flag("fest_frau_ok")) {
    await say("Frau", "Ich bin Marta, aus Krakau. Ich wohne seit 30 Jahren hier. Am Anfang dachte ich, die Deutschen sind kalt.");
    await say("Marta", "Dann hatte ich einen Rohrbruch. Und der ganze Hausflur hat mir geholfen. Mit Eimern. Um drei Uhr nachts. Seitdem weiß ich: Sie sind nicht kalt. Sie brauchen nur einen Anlass.");
    set("fest_frau_ok"); festFreunde(); points(4);
  } else await say("Marta", "Viel Spaß noch! Und probieren Sie die Waffeln – die macht der Kindergarten.");
});
scene("fest_kind", async () => {
  face();
  await say("Kind", "Ich habe fünf Sprachen! Deutsch, Arabisch, Englisch, ein bisschen Kölsch und Kindergarten-Sprache!");
  if (!flag("fest_kind_ok")) { set("fest_kind_ok"); festFreunde(); }
});
scene("fest_band", async () => { await narr("♪ Die Band spielt ein Lied auf Kölsch. Alle singen mit. Ich verstehe kein Wort – und singe trotzdem mit. ♪"); });
scene("ioana", async () => {
  face();
  if (!flag("ioana_ok")) {
    await say("Ioana", "Hallo! Ich bin Ioana, heute Ordnerin. Alles gut bei euch? Wenn es Probleme gibt – ich bin hier. Mit Funkgerät.");
    await say("Ioana", "Sonst fahre ich die Linie 13. Im Bus sehe ich ganz Köln. Die meisten Menschen sind nett. Für die anderen gibt es mich.");
    learn("ordnerin");
    set("ioana_ok"); friend("ioana", 1); festFreunde();
  } else await say("Ioana", "Alles ruhig. Fast. Am Bierstand wird es manchmal laut. Ich habe ein Auge drauf.");
});
scene("fest_bier", async () => { face(); await say("Köbes", "Kölsch? Wasser? Fassbrause? Hier gibt's alles. Außer Altbier. Das ist hier verboten. Fast."); });
scene("fest_wagner", async () => {
  face();
  if (!flag("nmm_angeboten")) { await World.call("nmm_beginn"); return; }
  if (flag("nmm_ende")) { await say("Herr Wagner", "Ich bin stolz auf dich. Ich meine… auf Sie. Auf… Ach. Ich sag's später."); await festAbendCheck(); return; }
  await say("Herr Wagner", "Ralf ist ein alter Kollege. Er war nicht immer so. Er hat viel verloren.");
});

// ------------------------------------------------------------------------------
// NICHT MIT MIR – Argumentation als Dialogkampf
// ------------------------------------------------------------------------------
scene("ralf", async () => {
  face();
  if (flag("nmm_ende")) {
    if (fval("nmm_ausgang") === "A") await say("Ralf", "…Hab nachgedacht. Über das mit dem Sündenbock. Ich sag nicht, dass du recht hast. Ich sag nur: Ich hab nachgedacht.");
    else await say("Ralf", "Hmpf.");
    return;
  }
  if (!flag("nmm_angeboten")) { await World.call("nmm_beginn"); return; }
  await World.call("nmm_debatte");
});
scene("nmm_beginn", async () => {
  set("nmm_angeboten");
  await say("Herr Wagner", "Ah, Frau {nachname}! Kommen Sie, ein Kölsch? Das ist Ralf, ein alter Kollege von der Post.");
  await say("Ralf", "Tach.");
  await narr("Yaras Mutter geht vorbei, mit einem Tablett Falafel. Ralf schaut ihr nach.");
  await say("Ralf", "Siehste, Herbert. Überall die. Die nehmen uns doch alle die Wohnungen weg.");
  await say("Herr Wagner", "Ralf…");
  quest("q_nmm");
  learn("behauptung");
  const i = await ask(ME, "(Ich könnte weggehen. Oder ruhig etwas sagen.)", ["Ich sage etwas. Ruhig und sachlich.", "Ich gehe lieber. Heute nicht."]);
  if (i === 1) {
    await think("Ich muss nicht jede Diskussion führen. Aber… vielleicht später.");
    await narr("<c3=707078,D8D8D0>(Du kannst später mit Ralf sprechen.)</c3>");
    return;
  }
  await World.call("nmm_debatte");
});

scene("nmm_debatte", async () => {
  if (flag("nmm_ende")) return;
  Audio_.bgm("Cave");
  Debate.open_("Ralf", "Ralf");
  try {
    // --- Phase 1: Behauptung ---------------------------------------------------
    Debate.phase(0);
    await Debate.claim("Die nehmen uns doch alle die Wohnungen weg.");
    step("q_nmm", "behauptung");
    const a = await Debate.choose("(Wie reagiere ich?)", [
      { t: "Das stimmt nicht.", s: "widerspruch", open: 4, reply: "Doch! Das sieht doch jeder!" },
      { t: "Was genau meinst du mit »alle«?", s: "verallg", open: 15, reply: "Na ja… man hört das ständig." },
      { t: "Du bist doof.", s: "angriff", calm: -35, open: -12, reply: "Ach, jetzt werd mal nicht frech, Mädchen. Siehste, Herbert? So sind die." },
      { t: "Wie kommst du darauf?", s: "nachfragen", open: 12, reply: "Man hört das ständig." },
    ]);
    if (a.s === "angriff") {
      await narr("<c3=C03030,F0C0C0>Ein persönlicher Angriff macht das Gespräch nicht besser. Ralf fühlt sich jetzt bestätigt.</c3>");
      await think("Das war nicht klug. Ich atme durch. Nochmal – sachlich.");
      await Debate.choose("(Ein neuer Versuch…)", [
        { t: "Entschuldigung, das war unfair. Aber: Was meinst du genau mit »alle«?", s: "verallg", open: 12, calm: 10, reply: "…Na. Man hört das halt ständig." },
        { t: "Wie kommst du darauf?", s: "nachfragen", open: 8, reply: "Man hört das ständig." },
      ]);
    } else if (a.s === "widerspruch") {
      await Debate.choose("(Er wird lauter. Was jetzt?)", [
        { t: "Okay. Was genau meinst du mit »alle«?", s: "verallg", open: 12, reply: "Na ja… man hört das ständig." },
        { t: "Doch, das stimmt nicht!", s: "widerspruch", open: -4, calm: -10, reply: "Nein! DOCH!" },
      ]);
    }
    // --- Phase 2: Nachfragen -----------------------------------------------------
    Debate.phase(1);
    learn("quelle");
    await Debate.choose("(»Man hört das ständig.« – Und jetzt?)", [
      { t: "Von wem hörst du das?", s: "nachfragen", open: 10, reply: "Im Internet. Und mein Schwager sagt das auch." },
      { t: "Ja, das hört man oft.", s: "schweigen", open: -5, reply: "Siehste! Sogar sie sagt das." },
      { t: "Das ist Quatsch.", s: "widerspruch", calm: -5, open: 0, reply: "Quatsch? Das steht überall!" },
    ]);
    await Debate.choose("(Er hat keine richtige Quelle.)", [
      { t: "Gibt es dafür konkrete Zahlen?", s: "fakten", open: 14, reply: "Zahlen… Zahlen kann man fälschen. Ich glaub, was ich seh." },
      { t: "Dein Schwager ist bestimmt ein Experte.", s: "angriff", calm: -10, open: -8, reply: "Lass meinen Schwager aus dem Spiel!" },
      { t: "Hast du selbst eine Wohnung verloren – wegen eines Ausländers?", s: "nachfragen", open: 12, reply: "…Nee. Nicht direkt." },
    ]);
    step("q_nmm", "nachfragen");
    await Debate.identify("Verallgemeinerung", "Aus »man hört das« und »mein Schwager sagt« wird »alle«. Ein Gerücht oder eine einzelne Erfahrung beweist keine allgemeine Aussage.");
    learn("verallgemeinerung");
    // --- Phase 3: Begründung prüfen ------------------------------------------------
    Debate.phase(2);
    await say("Ralf", "Weißte, meine Tochter sucht seit zwei Jahren eine Wohnung. Zwei Jahre! Mit Kind. Nix. Und dann seh ich die Neuen, die alle irgendwo wohnen…");
    await Debate.choose("(Da steckt ein echtes Problem dahinter.)", [
      { t: "Das klingt wirklich schwer. Ich habe auch gesucht – bei einer Besichtigung waren 31 Leute. Es gibt zu wenig Wohnungen. Für alle.", s: "perspektive", open: 20, reply: "…31 Leute? Bei meiner Tochter waren es 40." },
      { t: "Dann soll sie halt woanders suchen.", s: "angriff", calm: -5, open: -10, reply: "Pfff. Du hast keine Ahnung." },
      { t: "Ja, und das ist die Schuld der Ausländer?", s: "widerspruch", open: 6, reply: "Na… ich sag ja nur." },
    ]);
    step("q_nmm", "pruefen");
    await Debate.identify("Sündenbock", "Ein echtes Problem – zu wenige, zu teure Wohnungen – wird einer Gruppe »in die Schuhe geschoben«. Das löst das Problem nicht. Es macht nur Menschen zu Gegnern.");
    learn("suendenbock");
    // --- Phase 4: Gegenargument ------------------------------------------------------
    Debate.phase(3);
    await Debate.claim("Und die bekommen doch alles vom Staat. Die wollen sich gar nicht integrieren. Die sind doch alle gleich.");
    learn("vorurteil", "herkunft", "beurteilen");
    await Debate.write("»Die sind doch alle gleich.« – Schreib eine kurze Antwort.", [
      { answers: ["Nicht alle Menschen sind gleich."], mode: "sentence", need: [["nicht"], ["alle"], ["gleich"]], tips: ["Benutze »nicht«.", "Wen meinst du? »alle«", "»… sind gleich«"] },
      { answers: ["Nicht alle Menschen sind gleich. Jeder Mensch ist anders."], mode: "sentence", need: [["nicht"], ["alle", "jeder"], ["gleich", "anders"]], tips: ["»nicht …«", "»alle« oder »jeder Mensch«", "»gleich« / »anders«"] },
      { answers: ["Man kann nicht alle Menschen nach ihrer Herkunft beurteilen."], mode: "sentence", need: [["nicht"], ["alle", "menschen"], ["herkunft"], ["beurteilen", "bewerten"]], tips: ["»Man kann nicht …«", "»… alle Menschen …«", "»… nach ihrer Herkunft …«", "»… beurteilen.«"] },
      { answers: ["Ich finde es unfair, eine ganze Gruppe von Menschen für das Verhalten einzelner Personen verantwortlich zu machen."], mode: "sentence",
        need: [["unfair", "ungerecht"], ["gruppe"], ["einzelner", "einzelne", "einzelnen"], ["verantwortlich"]], tips: ["»Ich finde es unfair, …«", "»… eine ganze Gruppe …«", "»… für das Verhalten einzelner Personen …«", "»… verantwortlich zu machen.«"] },
    ]);
    const c = await Debate.choose("(Und jetzt ein Beispiel aus meinem Leben?)", [
      { t: "Ich zahle Steuern und Krankenkasse – wie du. Yara ist Apothekerin, Aga ist Pflegefachfrau, Herr Demir hat 35 Jahre bei Ford gearbeitet.", s: "widerspruch", open: 16, reply: "…Demir? Der Ali Demir? Bei Ford? Den kenn ich. Der war in Halle 4. Ein feiner Kerl." },
      { t: "Ihr Deutschen seid doch alle so!", s: "angriff", calm: -15, open: -15, reply: "Ach! Jetzt sind WIR alle gleich, oder was?!" },
      { t: "Du hast ja recht…", s: "schweigen", open: -10, reply: "Siehste. Endlich sagt's mal einer." },
    ]);
    if (c.s === "angriff") await Debate.identify("Verallgemeinerung – umgekehrt", "»Ihr Deutschen seid alle so« ist derselbe Fehler, nur in die andere Richtung. Auch Ralf ist nicht »die Deutschen«.");
    if (c.s === "schweigen") await narr("<c3=707078,D8D8D0>Zustimmen, nur damit es ruhig wird, bestätigt die Behauptung. Nicht jede Behauptung muss man akzeptieren – nur weil sie selbstbewusst klingt.</c3>");
    step("q_nmm", "gegen");
    learn("sachlich");
    // --- Phase 5: Abschluss -------------------------------------------------------
    Debate.phase(4);
    await Debate.claim("Ach, früher war alles besser. Die passen einfach nicht zu uns.");
    const d = await Debate.choose("(Wie schließe ich ab?)", [
      { t: "Was genau war früher besser, Ralf?", s: "nachfragen", open: 12, reply: "Früher… hatte ich Arbeit. 30 Jahre. Dann haben sie die Abteilung zugemacht. Seitdem ist alles… anders." },
      { t: "Ich glaube, wir kommen heute nicht weiter. Ich sehe das anders. Schönen Abend noch.", s: "ende", reply: "…Ja. Dir auch." },
      { t: "Wer ist »uns«? Ich wohne auch hier. Ich bin deine Nachbarin.", s: "perspektive", open: 14, reply: "…Hm." },
    ]);
    let outcome;
    if (d.s === "ende") outcome = "D";
    else if (Debate.open >= 60) outcome = "A";
    else if (Debate.calm >= 50 && friendLevel("wagner") >= 3) outcome = "C";
    else outcome = "B";
    Debate.close();
    if (outcome === "A") {
      if (d.s === "nachfragen") await say(ME, "Das tut mir leid, Ralf. Wirklich. Aber daran sind nicht die Leute schuld, die heute hier Falafel verkaufen.");
      await say("Ralf", "…Vielleicht hab ich das zu einfach gesagt.");
      await say("Ralf", "Die Frau von der Apotheke… die ist ja eigentlich nett. Die hat mir mal mit meinen Tabletten geholfen. Sehr geduldig.");
      await say("Herr Wagner", "Siehst du, Ralf. Manchmal muss man nur zuhören. Und dann nachdenken.");
      await UI.banner("AUSGANG", "Er denkt darüber nach.", "Kein Sieg. Aber ein Anfang. Manchmal ändert ein ruhiges Gespräch mehr als ein lauter Streit.", "#3c8c50");
    } else if (outcome === "C") {
      await say("Herr Wagner", "Ralf. Jetzt hör mir mal zu. Ich bin seit 74 Jahren Kölner. Und diese junge Frau arbeitet nachts im Krankenhaus, wenn du schläfst.");
      await say("Herr Wagner", "Meine Elfriede hat 38 Jahre auf derselben Station gearbeitet. Wenn du so über die Leute redest, redest du auch über die, die dich mal pflegen werden.");
      await say("Ralf", "…Herbert, ich mein ja nur…");
      await say("Herr Wagner", "Ich weiß, was du meinst. Und ich sehe das anders.");
      await UI.banner("AUSGANG", "Jemand anderes greift ein.", "Herr Wagner hat dir den Rücken gestärkt. Gemeinsam ist Widersprechen leichter – und überzeugender.", "#3c6cc8");
    } else if (outcome === "D") {
      await narr("Ich gehe zurück zu meinen Freunden. Mein Herz klopft. Aber ich habe gesagt, was ich denke. Ruhig.");
      await UI.banner("AUSGANG", "Du beendest das Gespräch.", "Wenn ein Gespräch nicht mehr konstruktiv ist, darf man es beenden. Das ist keine Niederlage. Es ist eine Entscheidung.", "#606878");
    } else {
      await say("Ralf", "Ihr mit euren Argumenten. Ich bleib dabei. Herbert, noch ein Kölsch.");
      await UI.banner("AUSGANG", "Er bleibt uneinsichtig.", "Gute Argumente sind wichtig – aber man kann nicht jeden Menschen sofort überzeugen. Vielleicht denkt er morgen darüber nach. Vielleicht nicht.", "#a06030");
    }
    set("nmm_ausgang", outcome);
    set("nmm_ende");
    step("q_nmm", "abschluss");
    finish("q_nmm", outcome === "A" ? 50 : outcome === "C" ? 45 : 35);
    giveSkill("argumente");
    friend("wagner", 1);
    diary("d_nmm", {
      A: "Ich habe mit Ralf gesprochen. Ruhig. Ich habe nachgefragt, statt zu schreien. Am Ende hat er gesagt: »Vielleicht hab ich das zu einfach gesagt.« Das ist nicht viel. Aber es ist etwas.",
      B: "Ralf bleibt bei seiner Meinung. Ich habe nicht »gewonnen«. Aber ich habe nicht geschwiegen. Und ich bin ruhig geblieben. Das war wichtig – für mich.",
      C: "Herr Wagner hat mit Ralf geredet. Über seine Elfriede, über die Station, über mich. Ich habe nicht gewusst, dass er so reden kann. Ich war nicht allein.",
      D: "Ich habe das Gespräch beendet. Ich habe gesagt, dass ich es anders sehe, und bin gegangen. Ich muss nicht jeden überzeugen. Aber ich muss nicht alles akzeptieren.",
    }[outcome]);
    await narr("<c3=3050C8,C8D0F0>Gelernt:</c3> Nicht jede Behauptung muss man akzeptieren, nur weil sie selbstbewusst ausgesprochen wird. Nachfragen, Quellen prüfen, Verallgemeinerungen erkennen – und ruhig bleiben.");
    Audio_.bgm("Radio - March");
    set("eskalation");
    World.refresh();
  } finally { Debate.close(); }
  await wait(0.4);
  await narr("Plötzlich: laute Stimmen. Vom Falafel-Stand.");
  await World.call("zivilcourage");
});

// ------------------------------------------------------------------------------
// Zivilcourage – wenn aus Worten eine Bedrohung wird
// ------------------------------------------------------------------------------
scene("dieter", async () => {
  face();
  if (flag("eskalation_done")) return;
  await World.call("zivilcourage");
});
scene("zivilcourage", async () => {
  quest("q_zivil");
  Audio_.bgm("Cave");
  await narr("Am Falafel-Stand wird es laut. Ein Mann – Ralfs Freund Dieter, sehr betrunken – steht vor Yaras Mutter. Er stößt gegen den Tisch. Ein Schild fällt um.");
  await say("Dieter", "Geht doch dahin zurück, wo ihr herkommt!");
  await narr("Yaras Mutter steht ganz still. Yara ist gerade nicht am Stand.");
  learn("zivilcourage");
  const chosen = new Set();
  const opts = [
    ["allein", "Allein zu ihm gehen und ihn wegschubsen."],
    ["ioana", "Ioana, die Ordnerin, rufen. Sie hat ein Funkgerät."],
    ["freunde", "Kofi und Luca dazuholen."],
    ["mutter", "Zu Yaras Mutter gehen, sie ansprechen und bei ihr bleiben."],
    ["weg", "Wegschauen. Das ist nicht mein Problem."],
    ["notruf", "Die 110 anrufen."],
  ];
  while (true) {
    const avail = opts.filter(o => !chosen.has(o[0]));
    const good = avail.map((o, i) => ["ioana", "freunde", "mutter"].includes(o[0]) ? i : -1).filter(i => i >= 0);
    const k = await ask(ME, `(Was tue ich? ${chosen.size ? "Und was noch?" : ""})`, avail.map(o => o[1]).concat(chosen.size >= 2 ? ["Das reicht – jetzt abwarten, was passiert."] : []), -1,
      { correct: good.length && chosen.size < 2 ? good : [avail.length] });
    if (k === avail.length) break;
    const key = avail[k][0];
    if (key === "allein") {
      mistake();
      await narr("<c3=C03030,F0C0C0>Lieber nicht.</c3> Allein körperlich eingreifen kann gefährlich werden – für dich und für andere. Zivilcourage heißt nicht: allein kämpfen.");
      continue;
    }
    if (key === "weg") {
      mistake();
      await narr("<c3=C03030,F0C0C0>Wegschauen</c3> lässt Yaras Mutter allein. Du musst kein Held sein. Aber du kannst etwas tun, ohne dich in Gefahr zu bringen.");
      continue;
    }
    if (key === "notruf") {
      learn("notruf");
      await narr("Gut zu wissen: <b>110</b> (Polizei), wenn jemand angegriffen wird oder es gefährlich wird. Hier ist eine Ordnerin ganz in der Nähe – sie kann schneller da sein. Die 110 bleibt der nächste Schritt, wenn es schlimmer wird.");
      chosen.add(key);
      points(3);
      continue;
    }
    chosen.add(key);
    points(6, "Zivilcourage");
    if (key === "ioana") await say("Ioana", "(ins Funkgerät) Security zum Falafel-Stand, bitte. Sofort. – Ich komme!");
    if (key === "freunde") await say("Kofi", "Was ist los? …Okay. Luca, komm. Wir stellen uns einfach dazu. Ruhig.");
    if (key === "mutter") {
      await say(ME, "Hallo, ich bin {name}, Yaras Freundin. Ich bleibe bei Ihnen. Kommen Sie, wir gehen ein Stück zur Seite.");
      await say("Yaras Mutter", "(nimmt deine Hand) …Danke.");
    }
    const n = ["ioana", "freunde", "mutter"].filter(x => chosen.has(x)).length;
    if (n >= 2) break;
  }
  await narr("Ioana kommt mit zwei Kollegen von der Security. Sie sprechen ruhig, aber sehr klar mit Dieter. Er wird lauter – dann leiser. Dann bringen sie ihn vom Fest.");
  await say("Ioana", "Alles in Ordnung bei Ihnen? Gut, dass Sie mich gerufen haben. Genau so macht man das.");
  await say("Ioana", "Nicht allein hingehen. Hilfe holen. Bei der betroffenen Person bleiben. Und wenn's gefährlich wird: 110.");
  friend("ioana", 1);
  step("q_zivil", "helfen");
  set("eskalation_done");
  World.refresh();
  Audio_.bgm("Radio - March");
  await narr("Yara kommt angerannt. Sie umarmt ihre Mutter. Dann mich.");
  await say("Yara", "Danke. Danke, dass du da warst. Das passiert nicht oft. Aber es passiert. Und meistens schauen alle weg.");
  await say("Yara", "Du musst nicht laut sein. Du musst nicht kämpfen. Du musst nur… da sein. Das ist das Wichtigste.");
  step("q_zivil", "danach");
  finish("q_zivil", 30);
  friend("yara", 1);
  diary("d_zivil", "Ein betrunkener Mann hat Yaras Mutter bedroht. Ich habe Ioana gerufen und bin bei Yaras Mutter geblieben. Ich war nicht mutig wie im Film. Ich war einfach da. Yara sagt, das ist das Wichtigste.");
  await World.call("fest_abend");
});

// ------------------------------------------------------------------------------
// Abend: Mai ruft an – Hamburg. Abschied von Köln.
// ------------------------------------------------------------------------------
scene("fest_abend", async () => {
  if (flag("fest_done")) return;
  if (!stepDone("q_fest", "freunde")) { await think("Ich will noch mit allen meinen Freunden sprechen."); return; }
  step("q_fest", "abend");
  set("fest_done");
  await UI.tone(0.5, 0.8);
  await narr("Es wird dunkel. Die Lichterketten leuchten. Alle sitzen an einem langen Tisch: Aga, Luca, Yara und ihre Mutter, Kofi, Adaeze, Frau Engel, Emre, Ioana – und Herr Wagner.");
  await UI.tone(0, 0.6);
  Audio_.me("phone");
  await say("Mai", "(am Telefon) {name}! Hörst du mich? Es ist so laut bei dir! Ich muss dir was sagen: Die Stelle in Hamburg – sie ist frei. Intensivstation, Weiterbildung, ab dem Ersten. Sie wollen DICH.");
  await say("Mai", "Und in meiner neuen WG ist noch ein Zimmer frei. Mit Blick auf den Hafen. Fast. Wenn man sich aus dem Fenster lehnt.");
  const i = await ask(ME, "(Hamburg…)", ["Ja! Ich komme nach Hamburg!", "Ich… muss darüber nachdenken."]);
  if (i === 1) {
    await say("Mai", "Natürlich. Denk nach. Aber nicht zu lange – die Stelle wartet nicht ewig.");
    await narr("Ich schaue auf den langen Tisch. Auf meine Freunde. Aga sieht mich an und nickt. Sie hat alles gehört.");
    await say("Aga", "Schätzchen. Geh. Weiterbildung, Intensiv, Mai. Wir sind nicht weg. Wir sind nur in Köln.");
    await say(ME, "…Ja. Ich komme nach Hamburg, Mai.");
  }
  await say("Mai", "JAAA! Hamburg, wir kommen!");
  unlockCity("hamburg");
  await narr("Am Tisch wird es still. Dann hebt Luca sein Glas.");
  await say("Luca", "Auf {name}! Die einzige Person, die in zwei Wochen eine Wohnung in Köln gefunden hat – und sie jetzt freiwillig wieder hergibt!");
  await say("Aga", "Auf Station 3B!");
  await say("Yara", "Auf Mut!");
  await say("Kofi", "Auf Jollof! Ghanaischen!");
  await say("Herr Wagner", "…Auf…");
  await narr("Herr Wagner steht auf. Er räuspert sich. Dreimal.");
  await say("Herr Wagner", "Ich habe 41 Jahre Briefe in die ganze Welt geschickt. Ich war nie weg. Und dann kam die Welt zu mir. In den zweiten Stock.");
  await say("Herr Wagner", "{name}… darf ich »du« sagen?");
  await exclaim(player());
  await ask(ME, "(Herr Wagner bietet mir das »Du« an!)", ["Sehr gerne, Herbert.", "Ja! Natürlich!"]);
  learn("duzen");
  await say("Herr Wagner", "Gut. Dann… schreib mir eine Postkarte aus Hamburg. Mit der Hand. Und der Topf von der Suppe – den behältst du.");
  friend("wagner", 5);
  await say("Herr Wagner", "Und hier. Mein alter Stadtplan von Hamburg. 1985. Da war ich auf einem Lehrgang. Die Straßen haben sich bestimmt nicht so sehr verändert.");
  finish("q_fest", 40);
  diary("d_ep9", "Veedelsfest. Ich habe mit einem Mann über Vorurteile geredet und einer Frau geholfen, die bedroht wurde. Und am Ende hat Herr Wagner mir das »Du« angeboten. Herbert. Ich gehe nach Hamburg. Und ich weiß jetzt: Ich habe in Köln eine Familie.");
  await finishEpisode(9, 30);
  await World.call("ep10_start");
});
