#===============================================================================
# Sprachreise – Episode 2: Das Bürgeramt
#===============================================================================
module SR
  # Warten im Bürgeramt: Jedes Gespräch im Wartebereich lässt die Zeit vergehen.
  def self.ba_tick
    return if !SR.flag?(:nummer) || SR.flag?(:aufgerufen)
    n = SR.count(:ba_wait)
    if n >= 2
      pbSEPlay("GUI naming tab swap end", 90) rescue nil
      SR::UI.say("Anzeige", "♪ Ding-Dong ♪\n<b>B-117</b> bitte zu <b>Platz 1</b>.")
      SR.set(:aufgerufen)
      SR::UI.toast("Deine Nummer wurde aufgerufen!", :quest)
    else
      SR::UI.toast("Die Zeit vergeht... (B-11#{4 + n})", :quest)
    end
  end
end

#-------------------------------------------------------------------------------
# WG: Schlafen -> Episode 2 beginnt
#-------------------------------------------------------------------------------
SR::Talk.define(:bett) do
  if flag?(:wg_arrived) && !flag?(:ep2_started)
    if confirm(nil, "Schlafen gehen?")
      pbBGMFade(1.0) rescue nil
      $game_screen.start_tone_change(Tone.new(-255, -255, -255, 0), 20)
      pbWait(1.0)
      narr("Die erste Nacht in Berlin. Draußen fährt eine S-Bahn. Irgendwo bellt ein Hund. Irgendwo ruft jemand »Digga«.")
      think("Ich vermisse Mamas Arepas. Und die Sonne. Aber ich bin hier. Ich habe es geschafft - bis hierher.")
      SR::UI.episode_card(2)
      set(:ep2_started)
      quest(:q_anmeldung)
      step(:q_anmeldung, :pass)
      $game_screen.start_tone_change(Tone.new(0, 0, 0, 0), 20)
      $game_map.autoplay
      pbWait(0.6)
      narr("Am nächsten Morgen. Montag, 8 Uhr.")
      think("Heute kümmere ich mich um die Anmeldung. Jonas sagt, ich brauche zuerst einen Termin. Online. Auf dem Laptop.")
    end
  elsif flag?(:ep2_started)
    think("Ich bin nicht müde. Es gibt zu viel zu tun!")
  else
    think("Ein Bett. Endlich. Aber zuerst muss ich ankommen.")
  end
end

SR::Talk.define(:laptop) do
  if !flag?(:wg_arrived)
    think("Ein Laptop.")
    next
  end
  if !flag?(:ep2_started)
    if !flag?(:mama_call)
      pbMEPlay("Register phone", 80) rescue nil
      say("Mama", "¿Mija? ¿Cómo estás? ¿Ya llegaste?")
      say(me, "Sí, Mamá. Ich bin angekommen. Todo bien. Alles gut.")
      say("Mama", "¿Y la gente? ¿Son amables?")
      i = ask(me, "(Was erzähle ich?)", ["Ja. Ein Mann von der Bahn hat mir geholfen.", "Es ist alles... ein bisschen viel."])
      if i == 1
        say("Mama", "Paso a paso, mija. Schritt für Schritt. Du hast schon so viel geschafft.")
      else
        say("Mama", "¡Qué bueno! Siehst du? Du schaffst das.")
      end
      think("Ich habe Heimweh. Ein bisschen. Aber das sage ich ihr nicht.")
      diary(:d_heimweh, "Videoanruf mit Mama. Sie hat gefragt, ob ich glücklich bin. Ich habe »ja« gesagt. Das stimmt. Meistens. Ein bisschen Heimweh gehört dazu.")
      set(:mama_call)
    else
      think("Mama schläft jetzt. In Medellín ist es sieben Stunden früher.")
    end
    next
  end
  if step?(:q_anmeldung, :termin)
    SR::Mini.with_paper("Posteingang", "<b>Terminbestätigung</b> - Bürgeramt Moabit, 10:20 Uhr\n<b>Re: WG-Party?</b> - von Jonas\n<b>Ihre Bewerbung</b> - St.-Marien-Klinikum Köln: Eingangsbestätigung", :screen, 150) do
      think("Mein Termin ist um 10:20 Uhr. Ich darf ihn nicht verpassen!")
    end
    next
  end
  # --- Minispiel: Terminvereinbarung -------------------------------------------
  SR::Mini.with_paper("service.berlin.de · Terminvereinbarung",
                      "Dienstleistung: <b>Anmeldung einer Wohnung</b>\n\n<c3=C03030,F0C0C0>Leider sind aktuell keine Termine verfügbar.</c3>\nBitte versuchen Sie es zu einem späteren Zeitpunkt erneut.", :screen, 190) do |p|
    learn(:terminvereinbarung)
    tries = 0
    loop do
      i = ask(nil, "Was tun?", ["Seite neu laden", "Alle Bürgerämter in Berlin anzeigen", "Jonas fragen"])
      case i
      when 0
        tries += 1
        if tries < 3
          p.body = "Dienstleistung: <b>Anmeldung einer Wohnung</b>\n\n<c3=C03030,F0C0C0>Leider sind aktuell keine Termine verfügbar.</c3>\n(Versuch #{tries + 1})"
          think(tries == 1 ? "Immer noch nichts." : "Wieder nichts. Langsam verstehe ich, warum Jonas so gelacht hat.")
        else
          p.body = "Dienstleistung: <b>Anmeldung einer Wohnung</b>\n\n<c3=208030,C0F0C0>NEU: Bürgeramt Moabit - HEUTE, 10:20 Uhr</c3>\n(Ein Termin wurde kurzfristig abgesagt.)\nBürgeramt Marzahn - in 6 Wochen"
          j = ask(nil, "Freie Termine:", ["Bürgeramt Moabit - heute, 10:20 Uhr", "Bürgeramt Marzahn - in 6 Wochen"])
          if j == 1
            think("Sechs Wochen? Aber ich muss mich innerhalb von zwei Wochen anmelden! Nein, Moabit ist besser - und um die Ecke.")
          end
          break
        end
      when 1
        p.body = "Bürgeramt Spandau - in 5 Wochen\nBürgeramt Marzahn - in 6 Wochen\nBürgeramt Moabit - keine Termine\nBürgeramt Kreuzberg - keine Termine"
        think("In sechs Wochen? Aber ich muss mich innerhalb von zwei Wochen anmelden! Das ist... ein Paradox.")
        say("Jonas", "(von unten) Willkommen in Berlin! Lade die Seite immer wieder neu. Morgens werden abgesagte Termine frei!")
      when 2
        say("Jonas", "(von unten) Neu laden! Immer wieder neu laden! Morgens um acht werden abgesagte Termine frei.")
      end
    end
    p.body = "<b>Ihre Daten</b>\nName: Ríos, {name}\nE-Mail: {name}.rios@mail.co\nDienstleistung: Anmeldung einer Wohnung\nBürgeramt Moabit, heute, 10:20 Uhr"
    think("Schnell buchen, bevor ihn jemand anderes nimmt!")
    se("Mining found all", 80)
    p.body = "<c3=208030,C0F0C0><b>Ihr Termin wurde gebucht.</b></c3>\nVorgangsnummer: 4711-0815\n\n<b>Benötigte Unterlagen:</b>\n- Reisepass oder Ausweis\n- ausgefülltes Anmeldeformular\n- Wohnungsgeberbestätigung (siehe Merkblatt)"
    learn(:termin, :unterlagen)
    doc(:termin)
    step(:q_anmeldung, :termin)
    i = ask(nil, "»siehe Merkblatt«...", ["Auf »Merkblatt« klicken", "Keine Zeit, schnell weiter!"])
    if i == 0
      p.body = "<c3=C03030,F0C0C0>Fehler 404</c3>\nDie angeforderte Seite wurde nicht gefunden.\n\nBitte versuchen Sie es später erneut."
      think("Fehler 404. Natürlich.")
    end
    think("Wohnungs... geber... be... stätigung? Das Wort ist länger als meine Straße. Was soll das sein?")
    think("Egal. Erst das Anmeldeformular. Das muss man ausdrucken. Aber wir haben keinen Drucker...")
  end
  diary(:d_termin, "Einen Termin beim Bürgeramt zu bekommen ist wie ein Lottogewinn. Ich habe dreimal neu geladen - und plötzlich: heute, 10:20 Uhr! Jonas sagt, ich soll mir das Datum merken. Als Feiertag.")
end

#-------------------------------------------------------------------------------
# WG: Mitbewohner und Möbel
#-------------------------------------------------------------------------------
SR::Talk.define(:jonas) do
  face_player
  if !flag?(:wg_arrived)
    say("Jonas", "Hey!")
  elsif !flag?(:ep2_started)
    say("Jonas", "Schlaf gut! Dein Bett ist oben. Morgen kümmern wir uns um den Termin.")
  elsif !step?(:q_anmeldung, :termin)
    say("Jonas", "Morgen! Termine fürs Bürgeramt gibt's nur online. Mein alter Laptop steht oben in deinem Zimmer.")
    say("Jonas", "Tipp: Immer wieder neu laden. Das ist kein Witz. Das ist Berlin.")
  elsif !step?(:q_anmeldung, :formular)
    say("Jonas", "Du hast einen Termin? Heute schon?! Du bist ein Glückskind.")
    say("Jonas", "Ausdrucken? Wir haben keinen Drucker. Geh zum Copyshop »Kopierkönig« in der Turmstraße. Links runter, dann rechts.")
    learn(:ausdrucken)
  elsif flag?(:ba_need_wgb) && !doc?(:wgb)
    say("Jonas", "Wohnungsgeberbestätigung? Haha, das Wort habe ich am Anfang auch gehasst.")
    say("Jonas", "Das muss Frau Schulz unterschreiben, unsere Vermieterin. Sie ist meistens im Hinterhof bei ihren Blumen.")
  elsif !flag?(:mb_done)
    say("Jonas", "Viel Glück beim Amt! Und denk dran: immer »Sie« sagen. Und lächeln. Lächeln hilft.")
  elsif !flag?(:anruf_done)
    say("Jonas", "Du hast die Meldebescheinigung! Ich bin so stolz auf dich.")
  else
    say("Jonas", "Köln, hm? Fahr mit dem ICE vom Hauptbahnhof. Tickets gibt's im Reisezentrum. Und schreib mir!")
  end
end

SR::Talk.define(:mai) do
  face_player
  if !flag?(:mai_met)
    say("Mai", "Hi! Du bist {name}, oder? Ich bin Mai. Ich wohne im Zimmer neben dir.")
    say("Mai", "Ich mache eine Ausbildung zur Pflegefachfrau. Jonas hat erzählt, du bist auch aus der Pflege?")
    say(me, "Ja! In Kolumbien war ich Krankenpflegerin. Hier muss mein Diplom erst anerkannt werden.")
    say("Mai", "Ich bin vor drei Jahren aus Hanoi gekommen. Am Anfang habe ich im Bus manchmal geweint, weil ich die Durchsagen nicht verstanden habe.")
    say("Mai", "Jetzt verstehe ich sie. Und manchmal ist es gar nicht besser. »Wegen einer Störung im Betriebsablauf...« Hihi.")
    say("Mai", "Für die Anerkennung brauchst du später B2. Aber B1 ist der erste große Schritt. Mach einen Integrationskurs!")
    say(me, "B1. Das ist mein Ziel.")
    set(:mai_met)
    diary(:d_ziel, "Mai kommt aus Vietnam und ist schon im zweiten Ausbildungsjahr. Sie sagt: B1 ist der erste große Schritt. Mein Ziel: B1. Ich schreibe es hier auf, damit ich es nicht vergesse.")
  elsif flag?(:mb_done)
    say("Mai", "Meldebescheinigung beim ersten Versuch? Ich hab drei Wochen gebraucht! Du bist ein Naturtalent.")
  else
    say("Mai", "Tipp von mir: Leg dir einen Ordner an. Für alle Briefe. In Deutschland brauchst du mindestens drei Ordner.")
  end
end

SR::Talk.define(:kuehlschrank) do
  narr("Auf dem Joghurt klebt ein Zettel: »NICHT ESSEN! - J.«")
  narr("Auf der Butter: »Gehört allen. Außer Jonas. - M.«")
end

SR::Talk.define(:spuele) do
  narr("Viel Geschirr. Sehr viel Geschirr.")
  think("Laut Putzplan ist diese Woche... Jonas dran. Natürlich.")
  learn(:putzplan)
end

SR::Talk.define(:fenster) do
  narr("Dächer, Antennen, Baukräne. Ganz hinten blinkt der Fernsehturm.")
end

SR::Talk.define(:regal) do
  narr("Ein Lehrbuch »Deutsch A2«, ein Roman von García Márquez und ein Foto von Mama vor ihrem Laden.")
end

SR::Talk.define(:fernseher) do
  narr("Jonas sagt: Sonntag um 20:15 Uhr läuft »Tatort«. Das ist in Deutschland fast ein Gesetz.")
end

SR::Talk.define(:kalender) do
  SR::Mini.with_paper("PUTZPLAN WG Lehrter 12", "<b>Woche 40</b>\nKüche: Jonas\nBad: Mai\nMüll: {name} <c3=C03030,F0C0C0>(neu!)</c3>\n\n<c3=707078,D8D8D0>Wer nicht putzt, kocht am Sonntag für alle.</c3>", :paper, 190) do
    learn(:putzplan)
    think("Müll - das bin ich. Hoffentlich ist das nicht kompliziert.")
  end
end

#-------------------------------------------------------------------------------
# Copyshop »Kopierkönig«
#-------------------------------------------------------------------------------
SR::Talk.define(:kaya) do
  if step?(:q_anmeldung, :formular)
    say("Herr Kaya", "Na, hat's geklappt mit dem Amt? Wenn Sie noch Kopien brauchen - ich bin hier. Sechs Tage die Woche.")
    next
  end
  if !step?(:q_anmeldung, :termin)
    say("Herr Kaya", "Guten Tag! Kopieren, drucken, scannen, binden. Was brauchen Sie?")
    think("Ich weiß noch nicht genau, was ich ausdrucken muss. Erst den Termin machen.")
    next
  end
  say("Herr Kaya", "Guten Tag! Was kann ich für Sie tun?")
  i = ask(me, "(Was sage ich?)", ["Ich möchte etwas ausdrucken.", "Ich brauche ein Formular... Papier... drucken?", "Haben Sie Kaffee?"])
  case i
  when 0
    points(3, "klar formuliert")
  when 1
    say("Herr Kaya", "Ah, Sie möchten etwas <b>ausdrucken</b>. Kein Problem.")
  when 2
    say("Herr Kaya", "Kaffee? Nein, nur Toner. Der ist auch schwarz, schmeckt aber schlechter. Sie möchten etwas ausdrucken?")
  end
  learn(:ausdrucken)
  say("Herr Kaya", "Schicken Sie mir die Datei einfach per E-Mail. ...Ah, da ist sie. »Anmeldung bei der Meldebehörde«.")
  j = ask("Herr Kaya", "Schwarzweiß oder farbig?", ["Schwarzweiß, bitte.", "Farbig, bitte."])
  say("Herr Kaya", "Farbig? Für ein Amtsformular? Glauben Sie mir, Schwarzweiß reicht.") if j == 1
  k = ask("Herr Kaya", "Wie viele Exemplare?", ["Eins, bitte.", "Zwei, bitte. Zur Sicherheit."])
  if k == 1
    say("Herr Kaya", "Zwei ist klug. Beim Amt geht immer irgendwas schief.")
    points(2)
  end
  se("PC access", 80)
  pbWait(0.5)
  say("Herr Kaya", "Bitte schön. Das macht 40 Cent.")
  learn(:formular, :kopie)
  doc(:anmeldeformular)
  step(:q_anmeldung, :formular)
  say("Herr Kaya", "Und übrigens: Am Schwarzen Brett hängt ein Aushang für Deutschkurse. Falls Sie Interesse haben.")
end

SR::Talk.define(:copy_kopierer) do
  narr("Ein riesiger Kopierer. Ein Zettel: »Papierstau? Bitte NICHT selbst reparieren! - Die Geschäftsleitung«")
end

SR::Talk.define(:copy_brett) do
  quest(:q_kurs)
  SR::Mini.with_paper("Schwarzes Brett", "<b>Deutsch lernen an der Volkshochschule!</b>\nIntegrationskurs A1 bis B1\nMontag bis Freitag, 9:00 - 12:15 Uhr\nEinstufungstest: jeden Dienstag, 10 Uhr\nVHS Berlin-Mitte, Raum 104\nKosten: oft kostenlos - wir beraten Sie!", :board, 220) do
    step(:q_kurs, :lesen)
    learn(:integrationskurs)
    if !done?(:q_kurs)
      minigame(:quiz, [
        { :q => "Wann ist der Kurs?", :o => ["Montag bis Freitag, vormittags", "Nur am Samstag", "Jeden Abend"], :a => 0,
          :why => "Lies nochmal: »Montag bis Freitag, 9:00 - 12:15 Uhr«." },
        { :q => "Bis zu welchem Niveau geht der Integrationskurs?", :o => ["A1", "B1", "C2"], :a => 1,
          :why => "Da steht »A1 bis B1«." },
        { :q => "Was muss man zuerst machen?", :o => ["Einen Einstufungstest", "Sofort bezahlen", "Einen Termin beim Bürgeramt machen"], :a => 0,
          :why => "Zuerst kommt der Einstufungstest - jeden Dienstag." }
      ])
      step(:q_kurs, :verstehen)
      doc(:vhs_flyer)
      finish(:q_kurs, 10)
      think("Integrationskurs bis B1. Das ist genau mein Ziel. Ich mache den Einstufungstest!")
    end
  end
end

SR::Talk.define(:copy_getraenke) do
  narr("Ein Kühlschrank voller Club-Mate. Jonas sagt, das trinken in Berlin alle Studenten. Zum Frühstück.")
end

SR::Talk.define(:copy_papier) do
  narr("Ordner, Briefumschläge, Klarsichthüllen. Ein Schild: »Bürokratie-Starterpaket - 9,99 Euro«.")
end

SR::Talk.define(:copy_kundin) do
  face_player
  say("Kundin", "Ich drucke meine Bewerbung. Zum zwölften Mal. Diesmal mit Foto.")
  say("Kundin", "Lebenslauf, Anschreiben, Zeugnisse... In Deutschland wollen sie immer alles. Am besten in einer Mappe.")
  learn(:bewerbung)
end

#-------------------------------------------------------------------------------
# Bürgeramt Moabit
#-------------------------------------------------------------------------------
SR::Talk.define(:ba_eingang) do
  brandt = event("Herr Brandt")
  walk(:player, "U") rescue nil
  brandt.turn_toward_player if brandt
  say("Herr Brandt", "Guten Tag. Haben Sie einen Termin?")
  i = ask(me, "(Was sage ich?)", ["Nein, aber ich bin jetzt hier.",
                                   "Ja. Ich habe ein Termin um 10:20 Uhr.",
                                   "Was ist ein Termin?"])
  case i
  when 0
    say("Herr Brandt", "Das sehe ich. Ohne Termin geht hier aber leider gar nichts.")
    say(me, "Doch, doch! Warten Sie... Ich habe einen! Hier, auf dem Handy. 10:20 Uhr.")
    say("Herr Brandt", "Ach so. Sie HABEN einen Termin. Warum sagen Sie das nicht gleich?")
  when 1
    say("Herr Brandt", "<b>Einen</b> Termin.")
    say(me, "Einen Termin. Danke.")
    SR::UI.toast("Grammatik: Ich habe EINEN Termin (Akkusativ)", :diary)
    set(:akkusativ_lesson)
  when 2
    say("Herr Brandt", "Ein Termin ist eine feste Uhrzeit, zu der Sie hier dran sind. Haben Sie so etwas?")
    say(me, "Ach so! Ja. Um 10:20 Uhr.")
  end
  learn(:termin)
  say("Herr Brandt", "Gut. Dann ziehen Sie bitte eine Wartenummer am Automaten. Dort links. Und dann warten Sie, bis Ihre Nummer auf der Anzeige erscheint.")
  learn(:wartenummer)
  step(:q_anmeldung, :amt)
  set(:ba_first_visit)
end

SR::Talk.define(:ba_nummer) do
  if flag?(:mb_done)
    narr("Der Nummernautomat. Heute brauche ich ihn nicht mehr.")
  elsif !flag?(:nummer)
    narr("Nummernautomat · <b>Bitte Taste drücken</b>")
    se("Vending machine dispense", 80)
    narr("Ihre Wartenummer: <b>B-117</b>")
    set(:nummer)
    think("B-117. Auf der Anzeige steht gerade B-113. Ich warte. Vielleicht rede ich mit den anderen Leuten hier.")
  else
    narr("Ich habe schon eine Nummer: B-117.")
  end
end

SR::Talk.define(:ba_anzeige) do
  if flag?(:aufgerufen) && !flag?(:mb_done)
    narr("<b>B-117 ▶ Platz 1</b>")
    think("Das bin ich!")
  elsif flag?(:nummer)
    narr("<b>B-11#{4 + (SR.flag(:ba_wait) || 0)} ▶ Platz 1</b>")
    SR.ba_tick
  else
    narr("Aufrufanzeige: <b>B-113 ▶ Platz 1</b>")
  end
end

SR::Talk.define(:ba_platz2) do
  narr("Platz 2. Ein Schild: »Heute nicht besetzt.«")
  narr("Darunter, kleiner: »Morgen vermutlich auch nicht.«")
end

SR::Talk.define(:ba_akten) do
  narr("Aktenordner bis zur Decke. Auf einem steht: »Ablage - Sonstiges - Verschiedenes (3)«.")
end

SR::Talk.define(:ba_poster) do
  narr("Ein Plakat: »Passierschein A38 - erhalten Sie hier NICHT. Bitte wenden Sie sich an Platz 1 im 2. Stock.«")
  think("Das Gebäude hat nur ein Stockwerk...")
end

SR::Talk.define(:brandt) do
  face_player
  if flag?(:mb_done)
    say("Herr Brandt", "Alles erledigt? Na also. Geht doch. Schönen Tag noch.")
  else
    say("Herr Brandt", "Bitte warten Sie, bis Ihre Nummer aufgerufen wird. Ruhe bitte im Wartebereich.")
    SR.ba_tick
  end
end

SR::Talk.define(:mohammed) do
  face_player
  if done?(:q_mohammed)
    say("Mohammed", "Viel Glück! Und denk dran: Mach von allem eine Kopie.")
    SR.ba_tick
    next
  end
  quest(:q_mohammed)
  say("Mohammed", "Erster Termin hier?")
  say(me, "Ja. Und Sie?")
  say("Mohammed", "Mein... zwölfter? Ich habe aufgehört zu zählen. Du kannst »du« sagen, wir Wartenden müssen zusammenhalten.")
  say("Mohammed", "Ich bin 2016 aus Afghanistan gekommen. Jetzt mache ich eine Ausbildung als Fachinformatiker. Heute nur eine Adressänderung.")
  say("Mohammed", "Ein Tipp: »Termin« und »Terminvereinbarung« sind zwei verschiedene Dinge.")
  say("Mohammed", "Die Terminvereinbarung ist das Buchen. Der Termin ist, wenn du hier sitzt. Viele haben eine »Terminvereinbarung« im Kopf - und sitzen dann hier ohne Termin.")
  learn(:terminvereinbarung)
  say("Mohammed", "Und noch ein Tipp: Mach von allem eine Kopie. Von ALLEM.")
  step(:q_mohammed, :reden)
  finish(:q_mohammed, 8)
  diary(:d_mohammed, "Heute habe ich gelernt, dass »Termin« nicht dasselbe ist wie »Terminvereinbarung«. Mohammed hat es mir erklärt. Er wartet heute zum zwölften Mal. Er lacht trotzdem.")
  SR.ba_tick
end

SR::Talk.define(:ba_wartende) do
  face_player
  say("Wartende", "Ich warte seit zwei Stunden. Mein Sohn hat in der Zeit Laufen gelernt.")
  SR.ba_tick
end

SR::Talk.define(:ba_student) do
  face_player
  say("Student", "Ich melde mich um. Ich wohne seit drei Wochen in Neukölln. Das ist... eine Woche zu spät. Pssst.")
  say("Student", "Man hat zwei Wochen Zeit nach dem Umzug. Die Frist ist ernst gemeint. Aber die Termine nicht.")
  SR.ba_tick
end

SR::Talk.define(:petersen) do
  face_player
  if flag?(:mb_done)
    say("Frau Petersen", "Schönen Tag noch, Frau Ríos. Und viel Erfolg in Berlin!")
  elsif flag?(:aufgerufen)
    say("Frau Petersen", "B-117? Kommen Sie bitte vor an den Tisch.")
  else
    say("Frau Petersen", "Bitte warten Sie, bis Ihre Nummer angezeigt wird. Ich bin gleich für Sie da.")
  end
end

SR::Talk.define(:ba_schalter) do
  if flag?(:mb_done)
    say("Frau Petersen", "Sie haben alles. Schönen Tag noch!")
    next
  end
  if !flag?(:nummer)
    say("Frau Petersen", "Bitte ziehen Sie zuerst eine Wartenummer. Der Automat ist da vorne links.")
    next
  end
  if !flag?(:aufgerufen)
    say("Frau Petersen", "Ihre Nummer ist noch nicht dran. Bitte nehmen Sie kurz Platz.")
    SR.ba_tick
    next
  end
  # --- Erstes Gespräch ---------------------------------------------------------
  if !flag?(:ba_talked)
    say("Frau Petersen", "Guten Tag. Wie kann ich Ihnen helfen?")
    i = ask(me, "(Was sage ich?)", ["Ich brauche Hilfe.", "Ich möchte mich anmelden.", "Was ist anmelden?"])
    case i
    when 0
      say("Frau Petersen", "Dafür bin ich da. Worum geht es denn?")
      say(me, "Ich... wohne neu hier. Anmelden?")
      say("Frau Petersen", "Ah, eine Anmeldung. Gut.")
    when 1
      points(4, "klar formuliert")
      say("Frau Petersen", "Sehr gut, eine Anmeldung.")
    when 2
      say("Frau Petersen", "Sie sind hier, um sich anzumelden. Wir tragen Ihre neue Adresse ins Melderegister ein. Das wollen Sie.")
      say(me, "Ach so. Ja. Das will ich.")
    end
    learn(:sachbearbeiterin)
    set(:ba_talked)
  else
    say("Frau Petersen", "Da sind Sie ja wieder! Haben Sie jetzt alles?")
  end
  # --- Unterlagen abgeben ------------------------------------------------------
  docs = [[:reisepass, :yes, nil]]
  docs.push([doc?(:anmeldeformular_ok) ? :anmeldeformular_ok : :anmeldeformular, :yes, nil])
  docs.push([:wgb, :yes, nil]) if doc?(:wgb)
  docs.push([:mietvertrag, :ok, "Den Mietvertrag brauche ich für die Anmeldung nicht. Aber gut, dass Sie ihn dabeihaben."])
  docs.push([:diplom, :no, "Ihr Diplom ist schön, aber das brauchen wir hier nicht. Damit gehen Sie später zur Anerkennungsstelle."])
  docs.push([:termin, :ok, nil])
  missing = SR::Mini.pick_docs("Frau Petersen", "Welche Unterlagen haben Sie dabei?", docs)
  if missing.include?(:reisepass)
    say("Frau Petersen", "Ohne Ausweisdokument geht es leider nicht. Haben Sie Ihren Pass dabei?")
    say(me, "Ja! Hier. Entschuldigung.")
  end
  if missing.include?(:anmeldeformular) || missing.include?(:anmeldeformular_ok)
    say("Frau Petersen", "Und das Anmeldeformular?")
    say(me, "Ach ja, hier!")
  end
  if !doc?(:wgb)
    # --- Die berühmte Satire-Szene -----------------------------------------------
    say("Frau Petersen", "Hm. Leider fehlt hier noch etwas.")
    say(me, "Was fehlt?")
    say("Frau Petersen", "Das Formular fehlt.")
    say(me, "Welches Formular?")
    say("Frau Petersen", "Das Formular, das auf dem Merkblatt steht.")
    say(me, "Welches Merkblatt?")
    say("Frau Petersen", "Das bekommen Sie online.")
    say(me, "Online stand »Fehler 404«.")
    say("Frau Petersen", "Ja. Die Seite. Die ist seit März kaputt.")
    learn(:merkblatt)
    say("Frau Petersen", "Haben Sie denn die Bescheinigung?")
    say(me, "Welche Bescheinigung?")
    say("Frau Petersen", "Die Bescheinigung, dass Sie hier wohnen.")
    say(me, "Aber... genau deshalb bin ich doch hier.")
    say("Frau Petersen", "Ja.")
    narr("...")
    say("Frau Petersen", "Ohne Bescheinigung geht es leider nicht.")
    learn(:bescheinigung)
    think("Ich habe das Gefühl, ich bin in einem Film. Einem sehr deutschen Film.")
    say("Frau Petersen", "Hören Sie, ich erkläre es Ihnen. Es heißt <b>Wohnungsgeberbestätigung</b>. Ihre Vermieterin bestätigt damit, dass Sie eingezogen sind.")
    say("Frau Petersen", "Ein Blatt Papier, eine Unterschrift. Ich gebe Ihnen das Formular mit.")
    say("Frau Petersen", "Und wenn Sie heute noch wiederkommen, nehme ich Sie ohne neue Nummer dran. Versprochen.")
    learn(:wgb)
    say(me, "Danke! Das ist sehr nett.")
    say("Frau Petersen", "Pssst. Nicht weitersagen. Sonst wollen das alle.")
    set(:ba_need_wgb)
    diary(:d_satire, "Ich brauche eine Bescheinigung, dass ich hier wohne, um mich anzumelden, dass ich hier wohne. Ich habe laut gelacht. Frau Petersen auch. Ein bisschen.")
    next
  end
  if !doc?(:anmeldeformular_ok)
    say("Frau Petersen", "Die Wohnungsgeberbestätigung ist da - prima. Aber Ihr Anmeldeformular ist ja noch leer!")
    say("Frau Petersen", "Füllen Sie es bitte dort am Tisch aus. Mit Kugelschreiber. Ich warte.")
    set(:need_fill)
    next
  end
  # --- Alles da: Meldebescheinigung ---------------------------------------------
  say("Frau Petersen", "Pass, Formular, Wohnungsgeberbestätigung... Sehr schön. Einen Moment, bitte.")
  se("PC access", 80)
  pbWait(0.6)
  say("Frau Petersen", "Familienname Ríos, mit Akzent... Staatsangehörigkeit kolumbianisch... Einzug am ersten Oktober...")
  se("Mart buy item", 80)
  pbWait(0.6)
  say("Frau Petersen", "So. Hier ist Ihre <b>Meldebescheinigung</b>. Herzlichen Glückwunsch, Frau Ríos. Sie wohnen jetzt offiziell in Berlin.")
  SR.take_doc(:anmeldeformular_ok)
  SR.take_doc(:wgb)
  doc(:meldebescheinigung)
  learn(:meldebescheinigung)
  step(:q_anmeldung, :mb)
  say("Frau Petersen", "Gut aufbewahren! Die brauchen Sie für die Bank, die Krankenkasse, den Arbeitgeber...")
  say("Frau Petersen", "Und Ihre Steuer-Identifikationsnummer kommt in ein paar Wochen automatisch per Post.")
  i = ask(me, "(Was sage ich zum Abschied?)", ["Danke.", "Vielen Dank! Sie waren sehr nett und haben mir sehr geholfen."])
  if i == 1
    points(4, "freundlich")
    say("Frau Petersen", "Sagen Sie das bitte nicht so laut. Sonst kommen alle zu mir.")
  else
    say("Frau Petersen", "Gern geschehen. Alles Gute!")
  end
  set(:mb_done)
  finish(:q_anmeldung, 30)
  diary(:d_mb, "Ich bin angemeldet! »Wohnungsgeberbestätigung« hat 24 Buchstaben. Ich kann es jetzt schreiben. Und aussprechen. Fast.")
  think("Ich wohne jetzt offiziell in Berlin. Ich muss Jonas davon erzählen!")
end

SR::Talk.define(:ba_formulartisch) do
  if doc?(:anmeldeformular_ok) || flag?(:mb_done)
    narr("Kugelschreiber an Ketten. Damit sie niemand mitnimmt.")
    next
  end
  if !doc?(:anmeldeformular)
    narr("Formulare in vielen Sprachen. Spanisch ist leider gerade aus.")
    next
  end
  think("Okay. Das Anmeldeformular. Ganz ruhig. Feld für Feld.")
  errors = SR::Mini.form("Anmeldung bei der Meldebehörde", [
    { :label => "Familienname", :req => true, :o => ["Ríos", "{name}"], :a => 0, :word => :familienname,
      :why => "Familienname heißt Nachname - der Name der Familie. Der Vorname kommt gleich." },
    { :label => "Vorname", :req => true, :o => ["{name}", "Ríos"], :a => 0 },
    { :label => "Doktorgrad", :req => false, :o => ["(leer lassen)", "Dr."], :a => 0,
      :why => "Ich habe keinen Doktortitel. Das Feld bleibt leer." },
    { :label => "Ordensname/Künstlername", :req => false, :o => ["(leer lassen)", "DJ Dani", "Schwester {name}"], :a => 0,
      :why => "Ein Künstlername? Nein... auch wenn »DJ Dani« cool klingt. Leer lassen!" },
    { :label => "Geburtsdatum", :req => true, :o => ["14.03.1998", "03/14/1998", "1998-14-03"], :a => 0, :word => :geburtsdatum,
      :why => "In Deutschland schreibt man: Tag. Monat. Jahr. Also 14.03.1998." },
    { :label => "Familienstand", :req => true, :o => ["ledig", "verheiratet", "geschieden", "verwitwet"], :a => 0, :word => :familienstand,
      :why => "Ich bin nicht verheiratet. »Ledig« heißt: nicht verheiratet." },
    { :label => "Staatsangehörigkeit", :req => true, :o => ["kolumbianisch", "Medellín", "Krankenpflegerin"], :a => 0, :word => :staatsangehoerigkeit,
      :why => "Staatsangehörigkeit ist das Land, nicht die Stadt oder der Beruf." },
    { :label => "Religionsgesellschaft", :req => false, :o => ["römisch-katholisch", "keine", "(leer lassen)"], :a => [0, 1, 2],
      :yes => "Hinweis: Wer hier eine Kirche angibt, zahlt später Kirchensteuer, wenn man arbeitet. Gut zu wissen!" },
    { :label => "Einzugsdatum", :req => true, :o => ["01.10.", "heute", "14.03."], :a => 0, :word => :einzug,
      :why => "Das Einzugsdatum steht im Mietvertrag: 01.10." },
    { :label => "Die Wohnung ist meine", :req => true, :o => ["Hauptwohnung", "Nebenwohnung"], :a => 0, :word => :hauptwohnung,
      :why => "Ich habe keine andere Wohnung in Deutschland. Das hier ist meine Hauptwohnung." },
    { :label => "Unterschrift", :req => true, :o => ["Im Feld »Ort, Datum, Unterschrift«", "Im Feld »Nur für Behördenvermerke«"], :a => 0, :word => :unterschrift,
      :why => "Leider an der falschen Stelle! Das Feld ist für das Amt. Ich unterschreibe unten bei »Ort, Datum, Unterschrift«." }
  ], "Felder mit Stern sind Pflichtfelder. Die anderen sind freiwillig.")
  learn(:ausfuellen, :pflichtfeld, :ledig)
  SR.take_doc(:anmeldeformular)
  doc(:anmeldeformular_ok)
  step(:q_anmeldung, :ausfuellen)
  think(errors == 0 ? "Keine Fehler! Ich bin ein Formular-Profi." : "Geschafft! Ein paar Fehler, aber jetzt ist alles richtig.")
  if flag?(:need_fill)
    say("Frau Petersen", "(ruft) Fertig? Dann kommen Sie bitte wieder zu mir!")
  end
end

#-------------------------------------------------------------------------------
# Hinterhof: Frau Schulz (Vermieterin) und Herr Krause (Mülltrennung)
#-------------------------------------------------------------------------------
SR::Talk.define(:schulz) do
  face_player
  if !flag?(:wg_arrived)
    say("Frau Schulz", "Sie sind bestimmt die neue Mieterin! Ich bin Frau Schulz, mir gehört das Haus.")
    say("Frau Schulz", "Klingeln Sie bei Becker, dritter Stock. Der Jonas wartet schon.")
    learn(:vermieterin)
  elsif flag?(:ba_need_wgb) && !doc?(:wgb)
    say(me, "Frau Schulz, ich brauche eine... Wohnungsgeberbestätigung. Für das Bürgeramt.")
    say("Frau Schulz", "Wohnungsgeber... was? Ach, die Bestätigung! Bin ich da der Wohnungsgeber?")
    say("Frau Schulz", "...Ja. Ich glaube, das bin ich. Geben Sie her, Kindchen.")
    se("GUI naming confirm", 60)
    pbWait(0.5)
    say("Frau Schulz", "So, fertig! Schauen Sie lieber nochmal drüber. Meine Augen sind nicht mehr die besten.")
    SR::Mini.find_errors("Bestätigung des Wohnungsgebers", [
      ["Wohnungsgeberin: Ingrid Schulz", false, "Das stimmt."],
      ["Anschrift: Lehrter Straße 21, 10557 Berlin", true, "Moment - Lehrter Straße 21? Ich wohne in der Zwölf! Die Zahlen sind vertauscht."],
      ["Einzug am: 01.10.", false, "Das stimmt, das steht auch im Mietvertrag."],
      ["Meldepflichtige Person: {name} Ríos", false, "Mein Name - richtig geschrieben, sogar mit Akzent!"],
      ["Art: Einzug", false, "Richtig, ich ziehe ein."],
      ["Unterschrift: im Feld »Nur für Behördenvermerke«", true, "Frau Schulz hat das Formular unterschrieben... leider an der falschen Stelle!"]
    ], "Frau Schulz")
    say("Frau Schulz", "Ach Gottchen! Einundzwanzig statt zwölf. Und unterschrieben im Amtsfeld. Das korrigieren wir.")
    say("Frau Schulz", "Wissen Sie, ich vermiete seit 1987. Früher hat man einfach »Herzlich willkommen« gesagt.")
    say("Frau Schulz", "...Also: Herzlich willkommen, Frau Ríos. Auch ohne Formular.")
    doc(:wgb)
    step(:q_anmeldung, :wgb)
    learn(:vermieterin)
    think("Jetzt schnell zurück zum Bürgeramt! Frau Petersen wartet.")
  elsif flag?(:mb_done)
    say("Frau Schulz", "Angemeldet? Wunderbar! Dann sind Sie jetzt eine richtige Berlinerin. Fast. Die Schnauze kommt noch.")
  else
    say("Frau Schulz", "Meine Geranien! Die einzigen Mieter, die sich nie beschweren.")
  end
end

SR::Talk.define(:krause) do
  face_player
  if !flag?(:ep2_started)
    say("Herr Krause", "Hm. Neue Mieterin? Dann lernen Sie erstmal Mülltrennung. Morgen.")
    next
  end
  if done?(:q_muell)
    say("Herr Krause", "Hmpf. Nicht schlecht. Besser als der Jonas. Aber sagen Sie ihm das nicht.")
    next
  end
  quest(:q_muell)
  say("Herr Krause", "Sie sind also die Neue. Im Putzplan steht: Müll - Sie. Na, dann zeigen Sie mal.")
  say("Herr Krause", "Vier Tonnen. Grau, gelb, braun, blau. Jede hat ihre Regeln. Ich frage, Sie antworten.")
  step(:q_muell, :tonnen)
  bins = ["Restmüll (grau)", "Gelbe Tonne", "Biomüll (braun)", "Altpapier (blau)", "Gar keine Tonne!"]
  minigame(:quiz, [
    { :speaker => "Herr Krause", :q => "Ein leerer Joghurtbecher?", :o => bins, :a => 1,
      :why => "Verpackung aus Plastik kommt in die Gelbe Tonne. Ausspülen müssen Sie ihn nicht. Löffelrein reicht." },
    { :speaker => "Herr Krause", :q => "Eine Bananenschale?", :o => bins, :a => 2,
      :why => "Bananenschale ist Bio. Essensreste, Schalen, Kaffeesatz: braune Tonne." },
    { :speaker => "Herr Krause", :q => "Die alte Zeitung von gestern?", :o => bins, :a => 3,
      :why => "Papier, Pappe, Zeitungen: blaue Tonne. Altpapier." },
    { :speaker => "Herr Krause", :q => "Ein voller Staubsaugerbeutel?", :o => bins, :a => 0,
      :why => "Der kommt in den Restmüll. Alles, was nirgendwo sonst hinpasst: graue Tonne." },
    { :speaker => "Herr Krause", :q => "Und eine leere Plastikflasche mit Pfand?", :o => bins, :a => 4,
      :why => "Pfandflaschen? Die bringt man zurück in den Laden! Da gibt's Geld zurück." }
  ])
  learn(:restmuell, :gelbe_tonne, :biomuell, :altpapier)
  step(:q_muell, :sortieren)
  finish(:q_muell, 12)
  say("Herr Krause", "Hmpf. Nicht schlecht. Besser als der Jonas.")
  say("Herr Krause", "...Und Glas kommt in den Container an der Ecke. Nach Farben! Weiß, braun, grün. Und nicht am Sonntag einwerfen. Ruhezeit!")
  diary(:d_muell, "Herr Krause hat mich geprüft: Mülltrennung. Vier Tonnen, plus Glascontainer, plus Pfand. Ich habe bestanden. Er hat fast gelächelt. Fast.")
end

{ 1 => ["GRAUE TONNE", "Restmüll", :restmuell], 2 => ["GELBE TONNE", "Verpackungen: Plastik, Metall, Verbundstoffe", :gelbe_tonne],
  3 => ["BRAUNE TONNE", "Biomüll: Essensreste, Schalen, Kaffeesatz", :biomuell],
  4 => ["BLAUE TONNE", "Papier, Pappe, Zeitungen", :altpapier] }.each do |n, d|
  SR::Talk.define(:"tonne_#{n}") do
    narr("<b>#{d[0]}</b>\n#{d[1]}")
    learn(d[2]) if flag?(:ep2_started)
    step(:q_muell, :tonnen) if active?(:q_muell)
  end
end

#-------------------------------------------------------------------------------
# Der Tourist – zum ersten Mal hilft {name} jemand anderem
#-------------------------------------------------------------------------------
SR::Talk.define(:tourist) do
  face_player
  quest(:q_tourist)
  say("Tourist", "Excuse me... sorry... Hauptbahnhof? Main station? My German is very bad.")
  think("Er versteht auch nicht alles. So wie ich vor ein paar Tagen.")
  i = ask(me, "(Ich erkläre den Weg - auf Deutsch!)", ["Sorry, I don't know.",
                                                       "Gehen Sie geradeaus, über die Straße. Dann sehen Sie den Hauptbahnhof.",
                                                       "Links, dann rechts, dann links, dann rechts..."])
  case i
  when 0
    say("Tourist", "Oh... okay. Thanks anyway.")
    think("Moment! Ich weiß es doch! Ich bin den Weg selbst gegangen.")
    say(me, "Warten Sie! Gehen Sie geradeaus, über die Straße. Dann sehen Sie den Hauptbahnhof.")
  when 2
    say("Tourist", "Left... right...? Sorry, too fast!")
    say(me, "Ah, Entschuldigung. Langsamer: Ge-ra-de-aus. Über die Straße. Da ist der Hauptbahnhof.")
    learn(:langsamer)
  end
  say("Tourist", "Gerade... aus? Ah, straight ahead! Danke! Danke schön! Your German is very good!")
  think("Sehr gut? Mein Deutsch? ...Ein bisschen gut, vielleicht. Am Anfang hat Tarek mir den Weg erklärt. Jetzt erkläre ich ihn.")
  finish(:q_tourist, i == 1 ? 14 : 8)
  set(:tourist_done)
  diary(:d_tourist, "Heute hat mich jemand nach dem Weg gefragt. Und ich konnte helfen. Auf Deutsch! Vor einer Woche hat mir Tarek denselben Weg erklärt.")
end
