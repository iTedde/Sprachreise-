// Sprachreise – Episode 2: Das Bürgeramt (leichte Bürokratie) · Berlin-Moabit
// Deutschland: Anmeldung, Termine, Mülltrennung, Integrationskurs · Deutsch: Formulare, Akkusativ, Schreiben von Namen/Adresse
// Menschen: Frau Petersen, Mohammed, Frau Schulz, Herr Krause · Veränderung: Zum ersten Mal hilft sie jemand anderem.
"use strict";

Object.assign(SR.QUESTS.q_anmeldung, { desc: "In Deutschland muss man sich innerhalb von zwei Wochen nach dem Einzug anmelden. Dafür brauche ich einen Termin und die richtigen Unterlagen." });

function baTick() {
  if (!flag("nummer") || flag("aufgerufen")) return;
  const n = count("ba_wait");
  if (n >= 2) {
    UI.queue(async () => {
      Audio_.se("tab_end", 0.9);
      await say("Anzeige", "♪ Ding-Dong ♪\n<b>B-117</b> bitte zu <b>Platz 1</b>.");
    });
    set("aufgerufen");
    UI.toast("Deine Nummer wurde aufgerufen!", "quest");
  } else UI.toast(`Die Zeit vergeht… (B-11${4 + n})`, "quest");
}

// -------------------------------------------------------------------------------
// WG: Schlafen -> nächste Episode beginnt
// -------------------------------------------------------------------------------
scene("bett", async () => {
  if (ep() === 1 && !flag("wg_abend_done")) { await think("Ein Bett. Endlich. Aber unten warten Jonas und Mai."); return; }
  if (ep() === 2 && !flag("ep2_started")) {
    if (!(await UI.confirm(null, "Schlafen gehen?"))) return;
    Audio_.bgmStop(1);
    await UI.tone(1, 0.8);
    await narr("Die erste Nacht in Berlin. Draußen fährt eine S-Bahn. Irgendwo bellt ein Hund. Irgendwo ruft jemand »Digga«.");
    await think("{heimweh} Aber ich bin hier. Ich habe es geschafft – bis hierher.");
    await UI.episodeCard(2, "Termin, Formular, Wohnungsgeberbestätigung.\nWillkommen in der deutschen Bürokratie.");
    set("ep2_started");
    quest("q_anmeldung");
    step("q_anmeldung", "pass");
    await UI.tone(0, 0.8);
    Audio_.bgm(World.map.d.bgm, true);
    await narr("Am nächsten Morgen. Montag, 8 Uhr.");
    await think("Heute kümmere ich mich um die Anmeldung. Jonas sagt, ich brauche zuerst einen Termin. Online. Auf dem Laptop.");
    return;
  }
  if (ep() === 3 && !flag("ep3_started")) {
    if (!(await UI.confirm(null, "Schlafen gehen?"))) return;
    await World.call("ep3_start");
    return;
  }
  await think(ep() <= 3 ? "Ich bin nicht müde. Es gibt zu viel zu tun!" : "Mein altes Bett in Berlin. Jonas hat nichts verändert. Nur ein Poster: »Du fehlst.«");
});

scene("laptop", async () => {
  if (!flag("wg_arrived")) { await think("Ein Laptop."); return; }
  if (!flag("ep2_started")) {
    if (!flag("mama_call")) {
      Audio_.me("phone");
      await say("Mama", o("mama1"));
      await say(ME, `${o("ja_mama")} Ich bin angekommen. ${o("alles_gut")} Alles gut.`);
      await say("Mama", o("mama2"));
      const i = await ask(ME, "(Was erzähle ich?)", ["Ja. Ein Mann von der Bahn hat mir geholfen. Und meine Mitbewohner sind sehr nett.", "Es ist alles… ein bisschen viel."]);
      if (i === 1) await say("Mama", `${o("schritt")}. Schritt für Schritt. Du schaffst das.`);
      else await say("Mama", `${o("toll")} Siehst du? Du schaffst das.`);
      await think("Ich habe Heimweh. Ein bisschen. Aber das sage ich ihr nicht.");
      diary("d_heimweh", "Videoanruf mit Mama. Sie hat gefragt, ob ich glücklich bin. Ich habe »ja« gesagt. Das stimmt. Meistens. Ein bisschen Heimweh gehört dazu.");
      set("mama_call");
    } else await think("Mama ist gerade nicht online. " + o("zeit"));
    return;
  }
  if (stepDone("q_anmeldung", "termin")) {
    await UI.withPaper("Posteingang", "<b>Terminbestätigung</b> – Bürgeramt Moabit, 10:20 Uhr\n<b>Re: WG-Party?</b> – von Jonas\n<b>Ihre Bewerbung</b> – St.-Marien-Klinikum Köln: Eingangsbestätigung" +
      (ep() >= 3 ? "\n<b>VHS Berlin-Mitte</b> – Einstufungstest: Anmeldung" : ""), "screen", async () => {
      await think(ep() >= 3 ? "Die VHS! Der Einstufungstest ist in der Turmstraße." : "Mein Termin ist um 10:20 Uhr. Ich darf ihn nicht verpassen!");
    });
    return;
  }
  // --- Minispiel: Terminvereinbarung ---
  await UI.withPaper("service.berlin.de · Terminvereinbarung", "Dienstleistung: <b>Anmeldung einer Wohnung</b>\n\n<c3=C03030,F0C0C0>Leider sind aktuell keine Termine verfügbar.</c3>\nBitte versuchen Sie es zu einem späteren Zeitpunkt erneut.", "screen", async p => {
    learn("terminvereinbarung");
    let tries = 0;
    while (true) {
      const i = await ask(null, "Was tun?", ["Seite neu laden", "Alle Bürgerämter in Berlin anzeigen", "Jonas fragen"], -1, { correct: 0 });
      if (i === 0) {
        tries++;
        if (tries < 3) {
          p.set(`Dienstleistung: <b>Anmeldung einer Wohnung</b>\n\n<c3=C03030,F0C0C0>Leider sind aktuell keine Termine verfügbar.</c3>\n(Versuch ${tries + 1})`);
          await think(tries === 1 ? "Immer noch nichts." : "Wieder nichts. Langsam verstehe ich, warum Jonas so gelacht hat.");
        } else {
          p.set("Dienstleistung: <b>Anmeldung einer Wohnung</b>\n\n<c3=208030,C0F0C0>NEU: Bürgeramt Moabit – HEUTE, 10:20 Uhr</c3>\n(Ein Termin wurde kurzfristig abgesagt.)\nBürgeramt Marzahn – in 6 Wochen");
          const j = await ask(null, "Freie Termine:", ["Bürgeramt Moabit – heute, 10:20 Uhr", "Bürgeramt Marzahn – in 6 Wochen"], -1, { correct: 0 });
          if (j === 1) await think("Sechs Wochen? Aber ich muss mich innerhalb von zwei Wochen anmelden! Nein, Moabit ist besser – und um die Ecke.");
          break;
        }
      } else if (i === 1) {
        p.set("Bürgeramt Spandau – in 5 Wochen\nBürgeramt Marzahn – in 6 Wochen\nBürgeramt Moabit – keine Termine\nBürgeramt Kreuzberg – keine Termine");
        await think("In sechs Wochen? Aber ich muss mich innerhalb von zwei Wochen anmelden! Das ist… ein Paradox.");
        await say("Jonas", "(von unten) Willkommen in Berlin! Lade die Seite immer wieder neu. Morgens werden abgesagte Termine frei!");
      } else await say("Jonas", "(von unten) Neu laden! Immer wieder neu laden! Morgens um acht werden abgesagte Termine frei.");
    }
    p.set("<b>Ihre Daten</b>\nName: {nachname}, {name}\nE-Mail: ____________\nDienstleistung: Anmeldung einer Wohnung\nBürgeramt Moabit, heute, 10:20 Uhr");
    await think("Schnell buchen, bevor ihn jemand anderes nimmt! Ich muss nur noch meine E-Mail-Adresse eintippen.");
    const mail = SR.playerName().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "") + "@mail.com";
    await Typing.task({ prompt: "E-Mail-Adresse:", answers: [mail], mode: "word", label: "Online-Formular", place: "bottom", pts: 3,
      intro: `<span class=sub>Meine Adresse: ${mail}</span>`, hints: ["Erst der Name, dann @, dann mail.com", mail] });
    Audio_.se("found", 0.8);
    p.set("<c3=208030,C0F0C0><b>Ihr Termin wurde gebucht.</b></c3>\nVorgangsnummer: 4711-0815\n\n<b>Benötigte Unterlagen:</b>\n- Reisepass oder Ausweis\n- ausgefülltes Anmeldeformular\n- Wohnungsgeberbestätigung (siehe Merkblatt)");
    learn("termin", "unterlagen");
    doc("termin");
    step("q_anmeldung", "termin");
    const i = await ask(null, "»siehe Merkblatt«…", ["Auf »Merkblatt« klicken", "Keine Zeit, schnell weiter!"]);
    if (i === 0) {
      p.set("<c3=C03030,F0C0C0>Fehler 404</c3>\nDie angeforderte Seite wurde nicht gefunden.\n\nBitte versuchen Sie es später erneut.");
      await think("Fehler 404. Natürlich.");
    }
    await think("Wohnungs… geber… be… stätigung? Das Wort ist länger als meine Straße. Was soll das sein?");
    await think("Egal. Erst das Anmeldeformular. Das muss man ausdrucken. Aber wir haben keinen Drucker…");
  });
  diary("d_termin", "Einen Termin beim Bürgeramt zu bekommen ist wie ein Lottogewinn. Ich habe dreimal neu geladen – und plötzlich: heute, 10:20 Uhr! Jonas sagt, ich soll mir das Datum merken. Als Feiertag.");
});

// -------------------------------------------------------------------------------
// WG: Mitbewohner und Möbel
// -------------------------------------------------------------------------------
scene("jonas", async () => {
  face();
  if (!flag("wg_arrived")) await say("Jonas", "Hey!");
  else if (ep() === 1) await say("Jonas", flag("zimmer_gesehen") ? "Gleich gibt's Essen!" : "Dein Zimmer ist oben. Die Treppe rechts. Bring deine Sachen hoch!");
  else if (ep() === 2) {
    if (!flag("ep2_started")) await say("Jonas", "Schlaf gut! Dein Bett ist oben. Morgen kümmern wir uns um den Termin.");
    else if (!stepDone("q_anmeldung", "termin")) {
      await say("Jonas", "Morgen! Termine fürs Bürgeramt gibt's nur online. Mein alter Laptop steht oben in deinem Zimmer.");
      await say("Jonas", "Tipp: Immer wieder neu laden. Das ist kein Witz. Das ist Berlin.");
    } else if (!stepDone("q_anmeldung", "formular")) {
      await say("Jonas", "Du hast einen Termin? Heute schon?! Du bist ein Glückskind.");
      await say("Jonas", "Ausdrucken? Wir haben keinen Drucker. Geh zum Copyshop »Kopierkönig« in der Turmstraße. Links runter, dann rechts.");
      learn("ausdrucken");
    } else if (flag("ba_need_wgb") && !hasDoc("wgb")) {
      await say("Jonas", "Wohnungsgeberbestätigung? Haha, das Wort habe ich am Anfang auch gehasst.");
      await say("Jonas", "Das muss Frau Schulz unterschreiben, unsere Vermieterin. Sie ist meistens im Hinterhof bei ihren Blumen.");
    } else if (!flag("mb_done")) await say("Jonas", "Viel Glück beim Amt! Und denk dran: immer »Sie« sagen. Und lächeln. Lächeln hilft.");
    else await say("Jonas", "Du hast die Meldebescheinigung! Ich bin so stolz auf dich.");
  } else await World.call("jonas_ep3");
});

scene("mai", async () => {
  face();
  if (ep() === 1) { await say("Mai", "Hast du Hunger? Ich hoffe, du magst Nudeln. Jonas kann nur Nudeln."); return; }
  if (ep() === 2) {
    if (!flag("mai_ziel")) {
      await say("Mai", "Für die Anerkennung brauchst du später B2. Aber B1 ist der erste große Schritt. Mach einen Integrationskurs!");
      await say(ME, "B1. Das ist mein Ziel.");
      set("mai_ziel");
      friend("mai", 1);
      diary("d_ziel", "Mai kommt aus Vietnam und ist schon im zweiten Ausbildungsjahr. Sie sagt: B1 ist der erste große Schritt. Mein Ziel: B1. Ich schreibe es hier auf, damit ich es nicht vergesse.");
    } else if (flag("mb_done")) await say("Mai", "Meldebescheinigung beim ersten Versuch? Ich hab drei Wochen gebraucht! Du bist ein Naturtalent.");
    else await say("Mai", "Tipp von mir: Leg dir einen Ordner an. Für alle Briefe. In Deutschland brauchst du mindestens drei Ordner.");
    return;
  }
  await World.call("mai_ep3");
});

scene("kuehlschrank", async () => {
  await narr("Auf dem Joghurt klebt ein Zettel: »NICHT ESSEN! – J.«");
  await narr("Auf der Butter: »Gehört allen. Außer Jonas. – M.«");
});
scene("spuele", async () => {
  await narr("Viel Geschirr. Sehr viel Geschirr.");
  await think("Laut Putzplan ist diese Woche… Jonas dran. Natürlich.");
  learn("putzplan");
});
scene("esstisch", async () => { await narr(flag("wg_abend_done") ? "Der Esstisch. Hier haben wir am ersten Abend »Stadt – Land – Fluss« gespielt." : "Ein großer Tisch mit vier Stühlen."); });
scene("fenster", async () => { await narr("Dächer, Antennen, Baukräne. Ganz hinten blinkt der Fernsehturm."); });
scene("regal", async () => { await narr("Ein Lehrbuch »Deutsch A2«, {buch} und ein Foto von Mama."); });
scene("fernseher", async () => { await narr("Jonas sagt: Sonntag um 20:15 Uhr läuft »Tatort«. Das ist in Deutschland fast ein Gesetz."); });
scene("kalender", async () => {
  await UI.withPaper("PUTZPLAN WG Lehrter 12", "<b>Woche 40</b>\nKüche: Jonas\nBad: Mai\nMüll: {name} <c3=C03030,F0C0C0>(neu!)</c3>\n\n<c3=707078,D8D8D0>Wer nicht putzt, kocht am Sonntag für alle.</c3>", "paper", async () => {
    learn("putzplan");
    await think("Müll – das bin ich. Hoffentlich ist das nicht kompliziert.");
  });
});

// -------------------------------------------------------------------------------
// Copyshop »Kopierkönig«
// -------------------------------------------------------------------------------
scene("kaya", async () => {
  if (stepDone("q_anmeldung", "formular")) { await say("Herr Kaya", "Na, hat's geklappt mit dem Amt? Wenn Sie noch Kopien brauchen – ich bin hier. Sechs Tage die Woche."); return; }
  if (!stepDone("q_anmeldung", "termin")) {
    await say("Herr Kaya", "Guten Tag! Kopieren, drucken, scannen, binden. Was brauchen Sie?");
    await think("Ich weiß noch nicht genau, was ich ausdrucken muss. Erst den Termin machen.");
    return;
  }
  await say("Herr Kaya", "Guten Tag! Was kann ich für Sie tun?");
  const i = await ask(ME, "(Was sage ich?)", ["Ich möchte etwas ausdrucken.", "Ich brauche ein Formular… Papier… drucken?", "Haben Sie Kaffee?"], -1, { correct: 0 });
  if (i === 0) points(3, "klar formuliert");
  else if (i === 1) await say("Herr Kaya", "Ah, Sie möchten etwas <b>ausdrucken</b>. Kein Problem.");
  else await say("Herr Kaya", "Kaffee? Nein, nur Toner. Der ist auch schwarz, schmeckt aber schlechter. Sie möchten etwas ausdrucken?");
  learn("ausdrucken");
  await say("Herr Kaya", "Schicken Sie mir die Datei einfach per E-Mail. …Ah, da ist sie. »Anmeldung bei der Meldebehörde«.");
  const j = await ask("Herr Kaya", "Schwarzweiß oder farbig?", ["Schwarzweiß, bitte.", "Farbig, bitte."]);
  if (j === 1) await say("Herr Kaya", "Farbig? Für ein Amtsformular? Glauben Sie mir, Schwarzweiß reicht.");
  const k = await ask("Herr Kaya", "Wie viele Exemplare?", ["Eins, bitte.", "Zwei, bitte. Zur Sicherheit."]);
  if (k === 1) { await say("Herr Kaya", "Zwei ist klug. Beim Amt geht immer irgendwas schief."); points(2); }
  se("pc", 0.8);
  await wait(0.5);
  await say("Herr Kaya", "Bitte schön. Das macht 40 Cent.");
  learn("formular", "kopie");
  doc("anmeldeformular");
  step("q_anmeldung", "formular");
  await say("Herr Kaya", "Und übrigens: Am Schwarzen Brett hängt ein Aushang für Deutschkurse. Falls Sie Interesse haben.");
});
scene("copy_kopierer", async () => { await narr("Ein riesiger Kopierer. Ein Zettel: »Papierstau? Bitte NICHT selbst reparieren! – Die Geschäftsleitung«"); });
scene("copy_brett", async () => {
  quest("q_kurs");
  await UI.withPaper("Schwarzes Brett", "<b>Deutsch lernen an der Volkshochschule!</b>\nIntegrationskurs A1 bis B1\nMontag bis Freitag, 9:00 – 12:15 Uhr\nEinstufungstest: jeden Samstag, 10 Uhr\nVHS Berlin-Mitte, Turmstraße 75\nKosten: oft kostenlos – wir beraten Sie!", "board", async () => {
    step("q_kurs", "lesen");
    learn("integrationskurs");
    if (!done("q_kurs")) {
      await Mini.quiz([
        { q: "Wann ist der Kurs?", o: ["Montag bis Freitag, vormittags", "Nur am Samstag", "Jeden Abend"], a: 0, why: "Lies nochmal: »Montag bis Freitag, 9:00 – 12:15 Uhr«." },
        { q: "Bis zu welchem Niveau geht der Integrationskurs?", o: ["A1", "B1", "C2"], a: 1, why: "Da steht »A1 bis B1«." },
        { q: "Was muss man zuerst machen?", o: ["Einen Einstufungstest", "Sofort bezahlen", "Einen Termin beim Bürgeramt machen"], a: 0, why: "Zuerst kommt der Einstufungstest – jeden Samstag." },
      ]);
      step("q_kurs", "verstehen");
      doc("vhs_flyer");
      finish("q_kurs", 10);
      await think("Integrationskurs bis B1. Das ist genau mein Ziel. Ich mache den Einstufungstest – am Samstag!");
    }
  });
});
scene("copy_getraenke", async () => { await narr("Ein Kühlschrank voller Club-Mate. Jonas sagt, das trinken in Berlin alle Studenten. Zum Frühstück."); });
scene("copy_papier", async () => { await narr("Ordner, Briefumschläge, Klarsichthüllen. Ein Schild: »Bürokratie-Starterpaket – 9,99 Euro«."); });
scene("copy_kundin", async () => {
  face();
  await say("Kundin", "Ich drucke meine Bewerbung. Zum zwölften Mal. Diesmal mit Foto.");
  await say("Kundin", "Lebenslauf, Anschreiben, Zeugnisse… In Deutschland wollen sie immer alles. Am besten in einer Mappe.");
  learn("bewerbung");
});

// -------------------------------------------------------------------------------
// Bürgeramt Moabit
// -------------------------------------------------------------------------------
scene("ba_eingang", async () => {
  const brandt = ev("Herr Brandt");
  await walk("player", "U");
  if (brandt) face(brandt);
  await say("Herr Brandt", "Guten Tag. Haben Sie einen Termin?");
  const i = await ask(ME, "(Was sage ich?)", ["Nein, aber ich bin jetzt hier.", "Ja. Ich habe ein Termin um 10:20 Uhr.", "Was ist ein Termin?"]);
  if (i === 0) {
    await say("Herr Brandt", "Das sehe ich. Ohne Termin geht hier aber leider gar nichts.");
    await say(ME, "Doch, doch! Warten Sie… Ich habe einen! Hier, auf dem Handy. 10:20 Uhr.");
    await say("Herr Brandt", "Ach so. Sie HABEN einen Termin. Warum sagen Sie das nicht gleich?");
  } else if (i === 1) {
    await say("Herr Brandt", "<b>Einen</b> Termin.");
    await say(ME, "Einen Termin. Danke.");
    UI.toast("Grammatik: Ich habe EINEN Termin (Akkusativ)", "diary");
    set("akkusativ_lesson");
  } else {
    await say("Herr Brandt", "Ein Termin ist eine feste Uhrzeit, zu der Sie hier dran sind. Haben Sie so etwas?");
    await say(ME, "Ach so! Ja. Um 10:20 Uhr.");
  }
  learn("termin");
  await say("Herr Brandt", "Gut. Dann ziehen Sie bitte eine Wartenummer am Automaten. Dort links. Und dann warten Sie, bis Ihre Nummer auf der Anzeige erscheint.");
  learn("wartenummer");
  step("q_anmeldung", "amt");
  set("ba_first_visit");
});
scene("ba_nummer", async () => {
  if (flag("mb_done")) await narr("Der Nummernautomat. Heute brauche ich ihn nicht mehr.");
  else if (!flag("nummer")) {
    await narr("Nummernautomat · <b>Bitte Taste drücken</b>");
    se("vending", 0.8);
    await narr("Ihre Wartenummer: <b>B-117</b>");
    set("nummer");
    await think("B-117. Auf der Anzeige steht gerade B-113. Ich warte. Vielleicht rede ich mit den anderen Leuten hier.");
  } else await narr("Ich habe schon eine Nummer: B-117.");
});
scene("ba_anzeige", async () => {
  if (flag("aufgerufen") && !flag("mb_done")) { await narr("<b>B-117 ▶ Platz 1</b>"); await think("Das bin ich!"); }
  else if (flag("nummer")) { await narr(`<b>B-11${4 + (fval("ba_wait") || 0)} ▶ Platz 1</b>`); baTick(); }
  else await narr("Aufrufanzeige: <b>B-113 ▶ Platz 1</b>");
});
scene("ba_platz2", async () => { await narr("Platz 2. Ein Schild: »Heute nicht besetzt.«"); await narr("Darunter, kleiner: »Morgen vermutlich auch nicht.«"); });
scene("ba_akten", async () => { await narr("Aktenordner bis zur Decke. Auf einem steht: »Ablage – Sonstiges – Verschiedenes (3)«."); });
scene("ba_poster", async () => {
  await narr("Ein Plakat: »Passierschein A38 – erhalten Sie hier NICHT. Bitte wenden Sie sich an Platz 1 im 2. Stock.«");
  await think("Das Gebäude hat nur ein Stockwerk…");
});
scene("brandt", async () => {
  face();
  if (flag("mb_done")) await say("Herr Brandt", "Alles erledigt? Na also. Geht doch. Schönen Tag noch.");
  else { await say("Herr Brandt", "Bitte warten Sie, bis Ihre Nummer aufgerufen wird. Ruhe bitte im Wartebereich."); baTick(); }
});
scene("mohammed", async () => {
  face();
  if (done("q_mohammed")) { await say("Mohammed", "Viel Glück! Und denk dran: Mach von allem eine Kopie."); baTick(); return; }
  quest("q_mohammed");
  await say("Mohammed", "Erster Termin hier?");
  await say(ME, "Ja. Und Sie?");
  await say("Mohammed", "Mein… zwölfter? Ich habe aufgehört zu zählen. Du kannst »du« sagen, wir Wartenden müssen zusammenhalten.");
  await say("Mohammed", "Ich bin 2016 aus Afghanistan gekommen. Jetzt mache ich eine Ausbildung als Fachinformatiker. Heute nur eine Adressänderung.");
  await say("Mohammed", "Ein Tipp: »Termin« und »Terminvereinbarung« sind zwei verschiedene Dinge.");
  await say("Mohammed", "Die Terminvereinbarung ist das Buchen. Der Termin ist, wenn du hier sitzt. Viele haben eine »Terminvereinbarung« im Kopf – und sitzen dann hier ohne Termin.");
  learn("terminvereinbarung");
  await say("Mohammed", "Und noch ein Tipp: Mach von allem eine Kopie. Von ALLEM.");
  friend("mohammed", 1);
  step("q_mohammed", "reden");
  finish("q_mohammed", 8);
  diary("d_mohammed", "Heute habe ich gelernt, dass »Termin« nicht dasselbe ist wie »Terminvereinbarung«. Mohammed hat es mir erklärt. Er wartet heute zum zwölften Mal. Er lacht trotzdem.");
  baTick();
});
scene("ba_wartende", async () => { face(); await say("Wartende", "Ich warte seit zwei Stunden. Mein Sohn hat in der Zeit Laufen gelernt."); baTick(); });
scene("ba_student", async () => {
  face();
  await say("Student", "Ich melde mich um. Ich wohne seit drei Wochen in Neukölln. Das ist… eine Woche zu spät. Pssst.");
  await say("Student", "Man hat zwei Wochen Zeit nach dem Umzug. Die Frist ist ernst gemeint. Aber die Termine nicht.");
  baTick();
});
scene("petersen", async () => {
  face();
  if (flag("mb_done")) await say("Frau Petersen", "Schönen Tag noch, Frau {nachname}. Und viel Erfolg in Berlin!");
  else if (flag("aufgerufen")) await say("Frau Petersen", "B-117? Kommen Sie bitte vor an den Tisch.");
  else await say("Frau Petersen", "Bitte warten Sie, bis Ihre Nummer angezeigt wird. Ich bin gleich für Sie da.");
});

scene("ba_schalter", async () => {
  if (flag("mb_done")) { await say("Frau Petersen", "Sie haben alles. Schönen Tag noch!"); return; }
  if (!flag("nummer")) { await say("Frau Petersen", "Bitte ziehen Sie zuerst eine Wartenummer. Der Automat ist da vorne links."); return; }
  if (!flag("aufgerufen")) { await say("Frau Petersen", "Ihre Nummer ist noch nicht dran. Bitte nehmen Sie kurz Platz."); baTick(); return; }
  if (!flag("ba_talked")) {
    await say("Frau Petersen", "Guten Tag. Wie kann ich Ihnen helfen?");
    const i = await ask(ME, "(Was sage ich?)", ["Ich brauche Hilfe.", "Ich möchte mich anmelden.", "Was ist anmelden?"], -1, { correct: 1 });
    if (i === 0) {
      await say("Frau Petersen", "Dafür bin ich da. Worum geht es denn?");
      await say(ME, "Ich… wohne neu hier. Anmelden?");
      await say("Frau Petersen", "Ah, eine Anmeldung. Gut.");
    } else if (i === 1) { points(4, "klar formuliert"); await say("Frau Petersen", "Sehr gut, eine Anmeldung."); }
    else {
      await say("Frau Petersen", "Sie sind hier, um sich anzumelden. Wir tragen Ihre neue Adresse ins Melderegister ein. Das wollen Sie.");
      await say(ME, "Ach so. Ja. Das will ich.");
    }
    learn("sachbearbeiterin");
    set("ba_talked");
  } else await say("Frau Petersen", "Da sind Sie ja wieder! Haben Sie jetzt alles?");
  const docs = [["reisepass", "yes"]];
  docs.push([hasDoc("anmeldeformular_ok") ? "anmeldeformular_ok" : "anmeldeformular", "yes"]);
  if (hasDoc("wgb")) docs.push(["wgb", "yes"]);
  docs.push(["mietvertrag", "ok", "Den Mietvertrag brauche ich für die Anmeldung nicht. Aber gut, dass Sie ihn dabeihaben."]);
  docs.push(["diplom", "no", "Ihr Diplom ist schön, aber das brauchen wir hier nicht. Damit gehen Sie später zur Anerkennungsstelle."]);
  docs.push(["termin", "ok"]);
  const missing = await Mini.pickDocs("Frau Petersen", "Welche Unterlagen haben Sie dabei?", docs);
  if (missing.includes("reisepass")) { await say("Frau Petersen", "Ohne Ausweisdokument geht es leider nicht. Haben Sie Ihren Pass dabei?"); await say(ME, "Ja! Hier. Entschuldigung."); }
  if (missing.includes("anmeldeformular") || missing.includes("anmeldeformular_ok")) { await say("Frau Petersen", "Und das Anmeldeformular?"); await say(ME, "Ach ja, hier!"); }
  if (!hasDoc("wgb")) {
    // --- Die berühmte Satire-Szene ---
    await say("Frau Petersen", "Hm. Leider fehlt hier noch etwas.");
    await say(ME, "Was fehlt?");
    await say("Frau Petersen", "Das Formular fehlt.");
    await say(ME, "Welches Formular?");
    await say("Frau Petersen", "Das Formular, das auf dem Merkblatt steht.");
    await say(ME, "Welches Merkblatt?");
    await say("Frau Petersen", "Das bekommen Sie online.");
    await say(ME, "Online stand »Fehler 404«.");
    await say("Frau Petersen", "Ja. Die Seite. Die ist seit März kaputt.");
    learn("merkblatt");
    await say("Frau Petersen", "Haben Sie denn die Bescheinigung?");
    await say(ME, "Welche Bescheinigung?");
    await say("Frau Petersen", "Die Bescheinigung, dass Sie hier wohnen.");
    await say(ME, "Aber… genau deshalb bin ich doch hier.");
    await say("Frau Petersen", "Ja.");
    await narr("…");
    await say("Frau Petersen", "Ohne Bescheinigung geht es leider nicht.");
    learn("bescheinigung");
    await think("Ich habe das Gefühl, ich bin in einem Film. Einem sehr deutschen Film.");
    await say("Frau Petersen", "Hören Sie, ich erkläre es Ihnen. Es heißt <b>Wohnungsgeberbestätigung</b>. Ihre Vermieterin bestätigt damit, dass Sie eingezogen sind.");
    await say("Frau Petersen", "Ein Blatt Papier, eine Unterschrift. Ich gebe Ihnen das Formular mit.");
    await say("Frau Petersen", "Und wenn Sie heute noch wiederkommen, nehme ich Sie ohne neue Nummer dran. Versprochen.");
    learn("wgb");
    await say(ME, "Danke! Das ist sehr nett.");
    await say("Frau Petersen", "Pssst. Nicht weitersagen. Sonst wollen das alle.");
    set("ba_need_wgb");
    diary("d_satire", "Ich brauche eine Bescheinigung, dass ich hier wohne, um mich anzumelden, dass ich hier wohne. Ich habe laut gelacht. Frau Petersen auch. Ein bisschen.");
    return;
  }
  if (!hasDoc("anmeldeformular_ok")) {
    await say("Frau Petersen", "Die Wohnungsgeberbestätigung ist da – prima. Aber Ihr Anmeldeformular ist ja noch leer!");
    await say("Frau Petersen", "Füllen Sie es bitte dort am Tisch aus. Mit Kugelschreiber. Ich warte.");
    set("need_fill");
    return;
  }
  await say("Frau Petersen", "Pass, Formular, Wohnungsgeberbestätigung… Sehr schön. Einen Moment, bitte.");
  se("pc", 0.8); await wait(0.6);
  await say("Frau Petersen", "Familienname {nachname}… Staatsangehörigkeit {staat}… Einzug am ersten Oktober…");
  se("buy", 0.8); await wait(0.6);
  await say("Frau Petersen", "So. Hier ist Ihre <b>Meldebescheinigung</b>. Herzlichen Glückwunsch, Frau {nachname}. Sie wohnen jetzt offiziell in Berlin.");
  takeDoc("anmeldeformular_ok"); takeDoc("wgb");
  doc("meldebescheinigung");
  learn("meldebescheinigung");
  step("q_anmeldung", "mb");
  await say("Frau Petersen", "Gut aufbewahren! Die brauchen Sie für die Bank, die Krankenkasse, den Arbeitgeber…");
  await say("Frau Petersen", "Und Ihre Steuer-Identifikationsnummer kommt in ein paar Wochen automatisch per Post.");
  const i = await ask(ME, "(Was sage ich zum Abschied?)", ["Danke.", "Vielen Dank! Sie waren sehr nett und haben mir sehr geholfen."], -1, { correct: 1 });
  if (i === 1) { points(4, "freundlich"); await say("Frau Petersen", "Sagen Sie das bitte nicht so laut. Sonst kommen alle zu mir."); }
  else await say("Frau Petersen", "Gern geschehen. Alles Gute!");
  set("mb_done");
  finish("q_anmeldung", 30);
  diary("d_mb", "Ich bin angemeldet! »Wohnungsgeberbestätigung« hat 24 Buchstaben. Ich kann es jetzt schreiben. Und aussprechen. Fast.");
  await think("Ich wohne jetzt offiziell in Berlin. Ich muss Jonas und Mai davon erzählen!");
});

scene("ba_formulartisch", async () => {
  if (hasDoc("anmeldeformular_ok") || flag("mb_done")) { await narr("Kugelschreiber an Ketten. Damit sie niemand mitnimmt."); return; }
  if (!hasDoc("anmeldeformular")) { await narr("Formulare in vielen Sprachen. {sprache} ist leider gerade aus."); return; }
  await think("Okay. Das Anmeldeformular. Ganz ruhig. Feld für Feld.");
  const last = o("last"), first = SR.playerName();
  const errors = await Mini.form("Anmeldung bei der Meldebehörde", [
    { label: "Familienname", req: true, word: "familienname",
      type: { prompt: "<b>Familienname</b> – schreib deinen Nachnamen.", answers: [last], mode: "name", hints: [last[0] + "…", last],
        validate: v => U.norm(v) === U.norm(first) && U.norm(first) !== U.norm(last) ? { ok: false, msg: "Das ist mein Vorname! Familienname = Nachname, der Name der Familie." } : null } },
    { label: "Vorname", req: true, type: { prompt: "<b>Vorname</b>", answers: [first], mode: "name", hints: [first[0] + "…", first] } },
    { label: "Doktorgrad", req: false, o: ["(leer lassen)", "Dr."], a: 0, why: "Ich habe keinen Doktortitel. Das Feld bleibt leer." },
    { label: "Ordensname/Künstlername", req: false, o: ["(leer lassen)", "DJ " + first.slice(0, 4), "Schwester {name}"], a: 0,
      why: `Ein Künstlername? Nein… auch wenn »DJ ${first.slice(0, 4)}« cool klingt. Leer lassen!` },
    { label: "Geburtsdatum", req: true, o: ["14.03.1998", "03/14/1998", "1998-14-03"], a: 0, word: "geburtsdatum", why: "In Deutschland schreibt man: Tag. Monat. Jahr. Also 14.03.1998." },
    { label: "Familienstand", req: true, o: ["ledig", "verheiratet", "geschieden", "verwitwet"], a: 0, word: "familienstand", why: "Ich bin nicht verheiratet. »Ledig« heißt: nicht verheiratet." },
    { label: "Staatsangehörigkeit", req: true, o: ["{staat}", "{stadt}", "Krankenpflegerin"], a: 0, word: "staatsangehoerigkeit", why: "Staatsangehörigkeit ist das Land, nicht die Stadt oder der Beruf." },
    { label: "Religionsgesellschaft", req: false, o: ["römisch-katholisch", "keine", "(leer lassen)"], a: [0, 1, 2], yes: "Hinweis: Wer hier eine Kirche angibt, zahlt später Kirchensteuer, wenn man arbeitet. Gut zu wissen!" },
    { label: "Neue Wohnung: Straße, Hausnummer", req: true, word: "adresse",
      type: { prompt: "<b>Straße und Hausnummer</b> der neuen Wohnung", answers: ["Lehrter Straße 12", "Lehrter Str. 12", "Lehrterstraße 12"], mode: "word", hints: ["Lehrter …", "Lehrter Straße 1…"],
        validate: v => /\b12\b/.test(v) ? null : { ok: false, msg: "Die Hausnummer fehlt oder stimmt nicht. Ich wohne in der Nummer 12!" } } },
    { label: "Einzugsdatum", req: true, o: ["01.10.", "heute", "14.03."], a: 0, word: "einzug", why: "Das Einzugsdatum steht im Mietvertrag: 01.10." },
    { label: "Die Wohnung ist meine", req: true, o: ["Hauptwohnung", "Nebenwohnung"], a: 0, word: "hauptwohnung", why: "Ich habe keine andere Wohnung in Deutschland. Das hier ist meine Hauptwohnung." },
    { label: "Unterschrift", req: true, o: ["Im Feld »Ort, Datum, Unterschrift«", "Im Feld »Nur für Behördenvermerke«"], a: 0, word: "unterschrift",
      why: "Leider an der falschen Stelle! Das Feld ist für das Amt. Ich unterschreibe unten bei »Ort, Datum, Unterschrift«." },
  ], "Felder mit Stern sind Pflichtfelder. Die anderen sind freiwillig.");
  learn("ausfuellen", "pflichtfeld", "ledig");
  takeDoc("anmeldeformular");
  doc("anmeldeformular_ok");
  step("q_anmeldung", "ausfuellen");
  await think(errors === 0 ? "Keine Fehler! Ich bin ein Formular-Profi." : "Geschafft! Ein paar Fehler, aber jetzt ist alles richtig.");
  if (flag("need_fill")) await say("Frau Petersen", "(ruft) Fertig? Dann kommen Sie bitte wieder zu mir!");
});

// -------------------------------------------------------------------------------
// Hinterhof: Frau Schulz (Vermieterin) und Herr Krause (Mülltrennung)
// -------------------------------------------------------------------------------
scene("schulz", async () => {
  face();
  if (!flag("wg_arrived")) {
    await say("Frau Schulz", "Sie sind bestimmt die neue Mieterin! Ich bin Frau Schulz, mir gehört das Haus.");
    await say("Frau Schulz", "Klingeln Sie bei Becker, dritter Stock. Der Jonas wartet schon.");
    learn("vermieterin");
  } else if (flag("ba_need_wgb") && !hasDoc("wgb")) {
    await say(ME, "Frau Schulz, ich brauche eine… Wohnungsgeberbestätigung. Für das Bürgeramt.");
    await say("Frau Schulz", "Wohnungsgeber… was? Ach, die Bestätigung! Bin ich da der Wohnungsgeber?");
    await say("Frau Schulz", "…Ja. Ich glaube, das bin ich. Geben Sie her, Kindchen.");
    se("confirm", 0.6); await wait(0.5);
    await say("Frau Schulz", "So, fertig! Schauen Sie lieber nochmal drüber. Meine Augen sind nicht mehr die besten.");
    await Mini.findErrors("Bestätigung des Wohnungsgebers", [
      ["Wohnungsgeberin: Ingrid Schulz", false, "Das stimmt."],
      ["Anschrift: Lehrter Straße 21, 10557 Berlin", true, "Moment – Lehrter Straße 21? Ich wohne in der Zwölf! Die Zahlen sind vertauscht."],
      ["Einzug am: 01.10.", false, "Das stimmt, das steht auch im Mietvertrag."],
      ["Meldepflichtige Person: {name} {nachname}", false, "Mein Name – " + o("name_ok")],
      ["Art: Einzug", false, "Richtig, ich ziehe ein."],
      ["Unterschrift: im Feld »Nur für Behördenvermerke«", true, "Frau Schulz hat das Formular unterschrieben… leider an der falschen Stelle!"],
    ], "Frau Schulz");
    await say("Frau Schulz", "Ach Gottchen! Einundzwanzig statt zwölf. Und unterschrieben im Amtsfeld. Das korrigieren wir.");
    await say("Frau Schulz", "Wissen Sie, ich vermiete seit 1987. Früher hat man einfach »Herzlich willkommen« gesagt.");
    await say("Frau Schulz", "…Also: Herzlich willkommen, Frau {nachname}. Auch ohne Formular.");
    doc("wgb");
    step("q_anmeldung", "wgb");
    learn("vermieterin");
    await think("Jetzt schnell zurück zum Bürgeramt! Frau Petersen wartet.");
  } else if (flag("mb_done")) await say("Frau Schulz", "Angemeldet? Wunderbar! Dann sind Sie jetzt eine richtige Berlinerin. Fast. Die Schnauze kommt noch.");
  else await say("Frau Schulz", "Meine Geranien! Die einzigen Mieter, die sich nie beschweren.");
});

scene("krause", async () => {
  face();
  if (!flag("ep2_started")) { await say("Herr Krause", "Hm. Neue Mieterin? Dann lernen Sie erstmal Mülltrennung. Morgen."); return; }
  if (done("q_muell")) { await say("Herr Krause", "Hmpf. Nicht schlecht. Besser als der Jonas. Aber sagen Sie ihm das nicht."); return; }
  quest("q_muell");
  await say("Herr Krause", "Sie sind also die Neue. Im Putzplan steht: Müll – Sie. Na, dann zeigen Sie mal.");
  await say("Herr Krause", "Vier Tonnen. Grau, gelb, braun, blau. Jede hat ihre Regeln. Ich frage, Sie antworten.");
  step("q_muell", "tonnen");
  const bins = ["Restmüll (grau)", "Gelbe Tonne", "Biomüll (braun)", "Altpapier (blau)", "Gar keine Tonne!"];
  await Mini.quiz([
    { speaker: "Herr Krause", q: "Ein leerer Joghurtbecher?", o: bins, a: 1, why: "Verpackung aus Plastik kommt in die Gelbe Tonne. Ausspülen müssen Sie ihn nicht. Löffelrein reicht." },
    { speaker: "Herr Krause", q: "Eine Bananenschale?", o: bins, a: 2, why: "Bananenschale ist Bio. Essensreste, Schalen, Kaffeesatz: braune Tonne." },
    { speaker: "Herr Krause", q: "Die alte Zeitung von gestern?", o: bins, a: 3, why: "Papier, Pappe, Zeitungen: blaue Tonne. Altpapier." },
    { speaker: "Herr Krause", q: "Ein voller Staubsaugerbeutel?", o: bins, a: 0, why: "Der kommt in den Restmüll. Alles, was nirgendwo sonst hinpasst: graue Tonne." },
    { speaker: "Herr Krause", q: "Und eine leere Plastikflasche mit Pfand?", o: bins, a: 4, why: "Pfandflaschen? Die bringt man zurück in den Laden! Da gibt's Geld zurück." },
  ]);
  learn("restmuell", "gelbe_tonne", "biomuell", "altpapier");
  step("q_muell", "sortieren");
  finish("q_muell", 12);
  await say("Herr Krause", "Hmpf. Nicht schlecht. Besser als der Jonas.");
  await say("Herr Krause", "…Und Glas kommt in den Container an der Ecke. Nach Farben! Weiß, braun, grün. Und nicht am Sonntag einwerfen. Ruhezeit!");
  diary("d_muell", "Herr Krause hat mich geprüft: Mülltrennung. Vier Tonnen, plus Glascontainer, plus Pfand. Ich habe bestanden. Er hat fast gelächelt. Fast.");
});

[[1, "GRAUE TONNE", "Restmüll", "restmuell"], [2, "GELBE TONNE", "Verpackungen: Plastik, Metall, Verbundstoffe", "gelbe_tonne"],
 [3, "BRAUNE TONNE", "Biomüll: Essensreste, Schalen, Kaffeesatz", "biomuell"], [4, "BLAUE TONNE", "Papier, Pappe, Zeitungen", "altpapier"]].forEach(d => {
  scene("tonne_" + d[0], async () => {
    await narr(`<b>${d[1]}</b>\n${d[2]}`);
    if (flag("ep2_started")) learn(d[3]);
    if (active("q_muell")) step("q_muell", "tonnen");
  });
});

// -------------------------------------------------------------------------------
// Der Tourist – zum ersten Mal hilft {name} jemand anderem
// -------------------------------------------------------------------------------
scene("tourist", async () => {
  face();
  quest("q_tourist");
  await say("Tourist", "Excuse me… sorry… Hauptbahnhof? Main station? My German is very bad.");
  await think("Er versteht auch nicht alles. So wie ich vor ein paar Tagen.");
  const i = await ask(ME, "(Ich erkläre den Weg – auf Deutsch!)", ["Sorry, I don't know.", "Gehen Sie geradeaus, über die Straße. Dann sehen Sie den Hauptbahnhof.", "Links, dann rechts, dann links, dann rechts…"], -1, { correct: 1 });
  if (i === 0) {
    await say("Tourist", "Oh… okay. Thanks anyway.");
    await think("Moment! Ich weiß es doch! Ich bin den Weg selbst gegangen.");
    await say(ME, "Warten Sie! Gehen Sie geradeaus, über die Straße. Dann sehen Sie den Hauptbahnhof.");
  } else if (i === 2) {
    await say("Tourist", "Left… right…? Sorry, too fast!");
    await say(ME, "Ah, Entschuldigung. Langsamer: Ge-ra-de-aus. Über die Straße. Da ist der Hauptbahnhof.");
    learn("langsamer");
  }
  await say("Tourist", "Gerade… aus? Ah, straight ahead! Danke! Danke schön! Your German is very good!");
  await think("Sehr gut? Mein Deutsch? …Ein bisschen gut, vielleicht. Am Anfang hat Tarek mir den Weg erklärt. Jetzt erkläre ich ihn.");
  finish("q_tourist", i === 1 ? 14 : 8);
  set("tourist_done");
  diary("d_tourist", "Heute hat mich jemand nach dem Weg gefragt. Und ich konnte helfen. Auf Deutsch! Vor einer Woche hat mir Tarek denselben Weg erklärt.");
});

// -------------------------------------------------------------------------------
// WG-Feier nach der Anmeldung -> Ende Episode 2
// -------------------------------------------------------------------------------
scene("wg_feier", async () => {
  set("wg_feier_done");
  const jonas = ev("Jonas");
  if (jonas) face(jonas);
  await say("Jonas", "Und?! Wie war's?");
  const i = await ask(ME, "(Was erzähle ich?)", ["Ich habe die Meldebescheinigung!",
    "Ich habe die Meldebescheinigung bekommen. Beim ersten Termin! Aber vorher musste ich noch eine Wohnungsgeberbestätigung holen."], -1, { correct: 1 });
  if (i === 1) { points(5, "ganzer Satz"); await say("Jonas", "Wow – du hast gerade »Wohnungsgeberbestätigung« gesagt, ohne zu stottern. Ich bin beeindruckt."); }
  await say("Jonas", "Beim ERSTEN Termin? Ich brauchte drei! Darauf trinken wir ein Glas… Leitungswasser. Wir sind Studenten.");
  await say("Mai", "Leitungswasser ist in Deutschland sehr gut. Das ist kein Witz. Das ist ein Fakt.");
  await say("Jonas", "Morgen ist Samstag. Dann machen wir den großen WG-Einkauf. Und am Abend: Fußball im Eckhaus! Kofi kommt auch.");
  await say("Mai", "Und du wolltest doch zum Einstufungstest an die VHS, oder? Der ist samstags. In der Turmstraße.");
  friend("jonas", 1); friend("mai", 1);
  giveSkill("formulare");
  diary("d_ep2", "Ich bin angemeldet. Vor einer Woche konnte ich nicht mal eine Schrippe bestellen. Heute habe ich ein Formular mit 12 Feldern ausgefüllt und einem Touristen den Weg erklärt.");
  await finishEpisode(2, 20);
  await think("Ein langer Tag. Ich gehe schlafen. Morgen ist Samstag – mein erster freier Tag in Berlin.");
});
