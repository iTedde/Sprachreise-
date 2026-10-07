#===============================================================================
# Sprachreise – Episode 1: Ankommen (Berlin Hauptbahnhof & Moabit)
# Jede Szene wird von einem Map-Event per sr_talk(:id) aufgerufen.
#===============================================================================
module SR
  # Hilfsfunktion für Durchsagen
  def self.durchsage(text)
    pbSEPlay("GUI naming tab swap start", 80) rescue nil
    SR::UI.say("Durchsage", "♪ " + text)
  end
end

#-------------------------------------------------------------------------------
# PROLOG – Ankunft im ICE
#-------------------------------------------------------------------------------
SR::Talk.define(:prolog) do
  $game_screen.start_tone_change(Tone.new(-255, -255, -255, 0), 0)
  $game_player.turn_up
  pbWait(0.1)
  pbChangePlayer(SR::PLAYER_CHARACTER_ID)
  $player.has_running_shoes = true if $player.respond_to?(:has_running_shoes=)
  pbBGMPlay("New Start", 80) rescue nil
  narr("Irgendwo zwischen Hannover und Berlin.\nIm ICE 1043.")
  SR.durchsage("Sehr geehrte Fahrgäste, in wenigen Minuten erreichen wir Berlin Hauptbahnhof.")
  SR.durchsage("Sie haben Anschluss an die S-Bahn, die U-Bahn und an den Fernverkehr. Ausstieg in Fahrtrichtung links.")
  narr("Eine junge Frau sieht aus dem Fenster. Sie hat ein Wort verstanden: »Berlin«.")
  narr("Wie heißt sie?")
  name = pbEnterPlayerName("Dein Vorname?", 1, 12, SR::DEFAULT_NAME)
  name = SR::DEFAULT_NAME if !name || name.strip.empty?
  $player.name = name.strip
  think("Por fin. Endlich. Berlin.")
  think("Vor zwei Jahren habe ich in Medellín als Krankenpflegerin gearbeitet. Jetzt will ich hier arbeiten. Dafür muss ich Deutsch lernen. Richtig Deutsch. B1 - und später B2.")
  think("Ich spreche schon ein bisschen. Ungefähr A2, sagt meine Lehrerin. Mal sehen, ob die Berliner das auch so sehen.")
  [:reisepass, :visum, :diplom, :mietvertrag].each { |d| SR.give_doc(d, true) }
  SR.learn(:reisepass, true)
  se("Door slide", 90)
  $game_screen.start_tone_change(Tone.new(0, 0, 0, 0), 20)
  pbWait(0.8)
  $game_map.autoplay
  SR.durchsage("Berlin Hauptbahnhof. Bitte beachten Sie beim Aussteigen die Lücke zwischen Zug und Bahnsteig.")
  learn(:hauptbahnhof)
  think("So viele Menschen. So viele Schilder. Und alle reden so schnell!")
  narr("<c3=3050C8,C8D0F0>Tipp:</c3> Im Menü (X oder Esc) findest du deine <b>Sprachmappe</b>: Wörterbuch, Aufgaben, Dokumente und Tagebuch.")
  narr("Wenn du mit Leuten sprichst, lernst du neue Wörter. Fehler sind kein Problem - aus Fehlern lernt man.")
  quest(:q_ankommen)
  think("Meine Adresse: Lehrter Straße 12, bei Jonas Becker. Aber wo ist das? Ich frage lieber jemanden. Vielleicht den Mann von der Bahn in der Halle?")
  diary(:d_prolog, "Ich bin in Berlin! Im Zug habe ich die Durchsage fast verstanden. Fast. Hauptbahnhof heißt »main station«. Das Wort ist so lang wie der Bahnhof.")
  set(:prolog_done)
end

#-------------------------------------------------------------------------------
# TAREK – DB-Mitarbeiter in der Bahnhofshalle (Mentor in Episode 1)
#-------------------------------------------------------------------------------
SR::Talk.define(:tarek) do
  face_player
  if !flag?(:tarek_done)
    say("Tarek", "Guten Tag! Kann ich Ihnen helfen?")
    i = ask(me, "(Was sage ich?)", ["Entschuldigung, ich brauche Hilfe.",
                                     "Ich... Lehrter Straße? Wo?",
                                     "Sprechen Sie Spanisch?"])
    case i
    when 0
      points(3, "höflich gefragt")
      learn(:entschuldigung)
      say("Tarek", "Sehr gerne. Was suchen Sie denn?")
      say(me, "Ich suche diese Adresse. Hier, auf meinem Handy.")
    when 1
      say("Tarek", "Ah, Sie suchen die Lehrter Straße? Kein Problem.")
      say("Tarek", "Kleiner Tipp für Berlin: Sagen Sie zuerst »Entschuldigung«. Dann sind die Leute gleich viel netter.")
      learn(:entschuldigung)
    when 2
      say("Tarek", "¿Español? Un poquito. Ich war ein Jahr in Valencia, im Studium.")
      say("Tarek", "Aber wissen Sie was? Wir üben Deutsch. Das hilft Ihnen hier mehr. Was suchen Sie?")
      say(me, "Lehrter Straße. Nummer 12.")
    end
    learn(:adresse)
    say("Tarek", "Lehrter Straße 12. Also: Sie gehen hier raus zum Europaplatz, dann rechts die Invalidenstraße entlang, die erste Straße links ist die Lehrter, dann immer geradeaus, die Zwölf ist rechts.")
    think("...Was? Das war sehr schnell.")
    loop do
      j = ask(me, "(Was sage ich jetzt?)", ["Entschuldigung, ich verstehe das nicht.",
                                             "Können Sie bitte langsamer sprechen?",
                                             "Alles klar, danke!"])
      if j == 0
        learn(:verstehe_nicht)
        say("Tarek", "Kein Problem! Das war auch schnell. Ich erkläre es Schritt für Schritt.")
        break
      elsif j == 1
        learn(:langsamer)
        points(3, "nachgefragt")
        say("Tarek", "Natürlich. Ganz langsam.")
        break
      else
        say("Tarek", "Wirklich? Dann sagen Sie mir: Wohin gehen Sie nach dem Ausgang?")
        k = ask(me, "(Hmm...)", ["Links.", "Rechts.", "Ich... weiß es nicht mehr."])
        if k == 1
          say("Tarek", "Richtig! Aber ich erkläre es trotzdem nochmal langsam. Sicher ist sicher.")
        else
          wrong("Nicht schlimm - nachfragen ist erlaubt!")
          say("Tarek", "Sehen Sie? Deshalb: nochmal langsam.")
        end
        break
      end
    end
    say("Tarek", "Erstens: Dort oben ist der <b>Ausgang</b>. Zum Europaplatz.")
    learn(:ausgang)
    say("Tarek", "Zweitens: Draußen gehen Sie <b>rechts</b>. Das ist die Invalidenstraße.")
    learn(:rechts)
    say("Tarek", "Drittens: Die erste Straße <b>links</b>. Das ist die Lehrter Straße.")
    learn(:links, :strasse)
    say("Tarek", "Und dann immer <b>geradeaus</b>. Die Nummer 12 ist auf der rechten Seite. Gerade Nummern rechts, ungerade links.")
    learn(:geradeaus)
    minigame(:quiz, [
      { :speaker => "Tarek", :q => "Also, nochmal zusammen. Sie gehen raus, und dann?",
        :o => ["Rechts, dann die erste Straße links, dann geradeaus.",
               "Links, dann rechts, dann zurück.",
               "Geradeaus, bis zum Wasser."],
        :a => 0, :why => "Nicht ganz. Raus, dann RECHTS. Die erste Straße LINKS. Dann GERADEAUS.",
        :yes => "Perfekt!" },
      { :speaker => "Tarek", :q => "Und auf welcher Seite ist die Nummer 12?",
        :o => ["Auf der linken Seite.", "Auf der rechten Seite."],
        :a => 1, :why => "Die geraden Nummern - 10, 12, 14 - sind rechts." }
    ])
    i = ask(me, "(Wie bedanke ich mich?)", ["Danke schön!", "Okay.", "Tschüss."])
    learn(:danke)
    if i == 0
      say("Tarek", "Gern geschehen! Und herzlich willkommen in Berlin.")
    else
      say("Tarek", "Ein »Danke« freut hier übrigens jeden. Aber gern geschehen! Willkommen in Berlin.")
    end
    say("Tarek", "Ich heiße übrigens Tarek. Wenn Sie mal wieder verreisen wollen: Ich bin oft hier im Reisezentrum.")
    step(:q_ankommen, :info)
    set(:tarek_done)
    think("Mein erstes richtiges Gespräch auf Deutsch. Und er hat mich verstanden!")
  elsif flag?(:anruf_done)
    say("Tarek", "Sie wollen verreisen? Kommen Sie, wir gehen zum Reisezentrum - gleich da links, an der Säule mit dem Schild.")
  elsif flag?(:mb_done)
    say("Tarek", "Na, schon angemeldet? Was, beim ersten Termin? Respekt. Das schaffen nicht mal alle Berliner.")
  elsif SR.state.episode >= 2
    say("Tarek", "Hallo! Na, wie gefällt Ihnen Berlin?")
    say(me, "Gut! Aber die Bürokratie... ist kompliziert.")
    say("Tarek", "Willkommen in Deutschland. Hier hat sogar die Bürokratie eine Bürokratie.")
  else
    say("Tarek", "Raus, rechts, erste links, geradeaus. Die Zwölf ist rechts. Sie schaffen das!")
  end
end

SR::Talk.define(:hbf_noch_nicht) do
  if !flag?(:prolog_done)
    next
  end
  think("Hmm. Ich weiß noch nicht genau, wohin ich muss. Ich frage lieber jemanden. Der Mann von der Bahn in der Halle sieht nett aus.")
  walk(:player, "D")
end

#-------------------------------------------------------------------------------
# Bahnhofshalle
#-------------------------------------------------------------------------------
SR::Talk.define(:hbf_tafel) do
  SR::Mini.with_paper("ABFAHRT · DEPARTURE", "<b>Zeit   Zug       Ziel                Gleis</b>\n" \
      "11:52  ICE 949   Köln Hbf            4\n" \
      "11:58  ICE 1007  München Hbf         6   <c3=E04040,F0C0C0>+15 Min</c3>\n" \
      "12:03  RE 1      Frankfurt (Oder)    12  <c3=E04040,F0C0C0>fällt aus</c3>\n" \
      "12:10  IC 2027   Hamburg-Altona      7\n" \
      "12:14  S 7       Ahrensfelde         15", :screen, 200) do
    think("»Fällt aus« - das heißt: Der Zug kommt gar nicht. Und »+15 Min« ist eine Verspätung.")
    learn(:verspaetung, :gleis)
    if !flag?(:tafel_seen)
      set(:tafel_seen)
      think("Ich bin froh, dass ich nicht mehr mit dem Zug weiter muss.")
    end
  end
end

SR::Talk.define(:hbf_schild) do
  narr("BERLIN HAUPTBAHNHOF")
  narr("Ein Turmbahnhof: Oben fahren die Züge von Ost nach West, unten von Nord nach Süd. Einer der größten Kreuzungsbahnhöfe Europas.")
end

SR::Talk.define(:hbf_pendler) do
  face_player
  if count(:pendler) == 1
    say("Pendler", "Entschuldigung, keine Zeit, keine Zeit! Mein Zug hat Verspätung - und ich trotzdem!")
    learn(:entschuldigung)
  else
    say("Pendler", "Zwanzig Minuten Verspätung. Wie jeden Tag. Ich nenne das inzwischen »Fahrplan«.")
    learn(:verspaetung)
  end
end

SR::Talk.define(:hbf_familie) do
  face_player
  if !flag?(:familie_done)
    say("Kind", "Mama, warum spricht die Frau so anders?")
    say("Mutter", "Weil sie noch eine andere Sprache spricht. Vielleicht sogar drei!")
    say("Kind", "Wow. Ich kann nur eine.")
    i = ask(me, "(Was sage ich?)", ["Ich spreche Spanisch. Und ein bisschen Deutsch.", "Äh... Hallo."])
    if i == 0
      say("Kind", "Ein bisschen ist schon ganz schön viel!")
      points(3)
    else
      say("Kind", "Hallo! Ich bin Ben. Ich bin fünf.")
    end
    set(:familie_done)
  else
    say("Mutter", "Ben möchte jetzt auch Spanisch lernen. Danke dafür!")
  end
end

SR::Talk.define(:hbf_reisende) do
  face_player
  say("Reisende", "Gleis 4 oder Gleis 6? Auf der Tafel steht Gleis 4, in der App Gleis 6.")
  say("Reisende", "Ich stelle mich einfach in die Mitte und renne, wenn er kommt.")
  learn(:gleis)
end

SR::Talk.define(:baeckerei) do
  face_player
  if done?(:q_baecker)
    say("Bäckerin", "Na, hat die Schrippe geschmeckt? Komm wieder, Kleene!")
    next
  end
  quest(:q_baecker)
  say("Bäckerin", "Wat darf's denn sein?")
  i = ask(me, "(Bestellen...)", ["Ein Brötchen, bitte.", "Zwei Schrippen, bitte.", "Was ist eine »Schrippe«?"])
  if i == 2 || i == 0
    say("Bäckerin", "In Berlin heißt det Brötchen »Schrippe«. Woanders sagen se Brötchen, im Süden Semmel. Gleiches Brot, drei Namen.")
  end
  learn(:schrippe)
  step(:q_baecker, :bestellen)
  say("Bäckerin", "Eine Schrippe. Macht eins zwanzig.")
  minigame(:quiz, [
    { :speaker => "Bäckerin", :q => "Eins zwanzig, bitte.",
      :o => ["1,20 Euro", "12,00 Euro", "1,02 Euro"], :a => 0,
      :why => "»Eins zwanzig« heißt: ein Euro und zwanzig Cent. 1,20 Euro.",
      :yes => "Danke schön, stimmt so. Schönen Tag noch!" }
  ])
  step(:q_baecker, :bezahlen)
  finish(:q_baecker, 6)
  diary(:d_schrippe, "In Berlin heißt das Brötchen »Schrippe«. Warum hat ein Brot drei Namen? Deutschland ist kompliziert. Aber lecker.")
end

#-------------------------------------------------------------------------------
# Europaplatz
#-------------------------------------------------------------------------------
SR::Talk.define(:automat) do
  SR::Mini.with_paper("Fahrkartenautomat · BVG", "<b>Bitte wählen Sie:</b>\n" \
      "Einzelfahrschein Berlin AB\n" \
      "Kurzstrecke (bis 3 Stationen U/S-Bahn)\n" \
      "24-Stunden-Karte Berlin AB\n" \
      "Deutschlandticket: nur im Abo\n" \
      "<c3=707078,D8D8D0>(Preise im Spiel vereinfacht)</c3>", :screen, 200) do
    think("So viele Möglichkeiten. Und alles auf Deutsch.")
    learn(:fahrkarte)
  end
end

SR::Talk.define(:kowalski) do
  face_player
  if done?(:q_automat)
    say("Frau Kowalski", "Danke nochmal, Kindchen! Und nicht vergessen: immer entwerten!")
    next
  end
  quest(:q_automat)
  say("Frau Kowalski", "Junge Frau? Können Sie mir mal helfen? Ich habe meine Brille zu Hause vergessen. Was steht da auf dem Automaten?")
  i = ask(me, "(Ich kann es versuchen...)", ["Ja, gerne. Ich lese es vor.", "Ich verstehe nicht so gut Deutsch..."])
  if i == 1
    say("Frau Kowalski", "Ach was. Lesen können Sie doch? Dann lesen Sie einfach vor. Ich erkläre den Rest.")
  end
  say(me, "Da steht: Einzelfahrschein. Kurzstrecke. 24-Stunden-Karte.")
  say("Frau Kowalski", "Ich fahre nur drei Stationen. Zu meiner Tochter nach Wedding.")
  minigame(:quiz, [
    { :speaker => "Frau Kowalski", :q => "Welche Fahrkarte brauche ich da?",
      :o => ["Einzelfahrschein AB", "Kurzstrecke", "24-Stunden-Karte"], :a => 1,
      :why => "Hm, das ist teurer als nötig. Für bis zu drei Stationen gibt es was Billigeres...",
      :yes => "Genau! Die Kurzstrecke. Sie sind ja ein Profi!" }
  ])
  learn(:kurzstrecke)
  step(:q_automat, :hilfe)
  say("Frau Kowalski", "Und jetzt passen Sie auf, das ist wichtig: Die Karte müssen Sie <b>entwerten</b>. Da, in dem kleinen Kasten. Stempeln!")
  say("Frau Kowalski", "Sonst ist sie nicht gültig. Und wenn die Kontrolle kommt, kostet das 60 Euro. Auch wenn Sie die Karte bezahlt haben!")
  say(me, "Gekauft, aber nicht gültig? Das ist... sehr deutsch.")
  say("Frau Kowalski", "Hihi. Willkommen in Berlin.")
  learn(:entwerten)
  step(:q_automat, :entwerten)
  say("Frau Kowalski", "Wo wollen Sie denn hin? ...Lehrter Straße? Da brauchen Sie keine Fahrkarte, das ist gleich um die Ecke. Zu Fuß!")
  learn(:zu_fuss)
  finish(:q_automat, 10)
  diary(:d_kowalski, "Eine Fahrkarte kaufen reicht nicht. Man muss sie auch »entwerten«. Frau Kowalski sagt, sonst kostet es 60 Euro. Ich habe ihr geholfen - und sie mir.")
end

SR::Talk.define(:taxi) do
  face_player
  say("Taxifahrer", "Taxi? Wo soll's hingehen?")
  say(me, "Lehrter Straße?")
  say("Taxifahrer", "Lehrter Straße? Det sind fünf Minuten zu Fuß, junge Frau! Dafür steig ick nich mal aus'm Auto.")
  learn(:zu_fuss)
  say("Taxifahrer", "Raus hier, rechts, erste links. Und »det« heißt »das«. Berlinerisch, gratis dazu.")
  learn(:wat)
end

SR::Talk.define(:musiker) do
  face_player
  if !flag?(:musiker_done)
    narr("♪ ... ♪ Eine Gitarre. Ein Lied auf Spanisch.")
    say("Musiker", "Hey! Du hast gelächelt, als ich gesungen habe. Woher kommst du?")
    i = ask(me, "(Woher komme ich?)", ["Aus Kolumbien.", "Ich komme aus Medellín, in Kolumbien."])
    points(i == 1 ? 4 : 2)
    say("Musiker", "¡Qué bien! Ich bin aus Valparaíso, Chile. Seit sieben Jahren in Berlin.")
    say("Musiker", "Am Anfang war alles schwer. Die Sprache, die Ämter, der Winter. Vor allem der Winter.")
    say("Musiker", "Heute ist Berlin mein Zuhause. Du schaffst das auch. Paso a paso - Schritt für Schritt.")
    set(:musiker_done)
    think("Schritt für Schritt. Das merke ich mir.")
  else
    narr("♪ ... Paso a paso ... ♪")
  end
end

#-------------------------------------------------------------------------------
# Moabit – Straßen, Schilder, Häuser
#-------------------------------------------------------------------------------
SR::Talk.define(:schild_lehrter) do
  narr("<b>Lehrter Straße</b>")
  if active?(:q_ankommen) && !step?(:q_ankommen, :strasse)
    step(:q_ankommen, :strasse)
    learn(:strasse)
    think("Lehrter Straße! Hier bin ich richtig. Jetzt geradeaus... und die Zwölf ist auf der rechten Seite.")
  end
end

SR::Talk.define(:schild_invaliden) do
  narr("<b>Invalidenstraße</b>\n▶ Lehrter Straße    ◀ Hauptbahnhof")
end

SR::Talk.define(:schild_turm) do
  narr("<b>Turmstraße</b>\nRathaus Tiergarten · Bürgeramt Moabit")
end

SR::Talk.define(:schild_ba) do
  narr("<b>Bezirksamt Mitte von Berlin</b>\nBürgeramt Moabit\nTermine nur nach vorheriger Vereinbarung.")
  if SR.state.episode < 2
    think("Bürgeramt... Was ist das? Klingt wichtig.")
  end
end

SR::Talk.define(:ba_zu) do
  narr("Rathaus Tiergarten. Die Tür ist zu.")
  narr("Öffnungszeiten: Mo-Fr nach Terminvereinbarung. Heute: Sonntag.")
  think("In Deutschland ist sonntags fast alles geschlossen. Daran muss ich mich gewöhnen.")
end

SR::Talk.define(:copy_zu) do
  narr("Copyshop »Kopierkönig«. Ein Schild an der Tür: »Sonntag Ruhetag«.")
  think("Schon wieder zu. Nur der Späti hat offen. Ich verstehe langsam, warum es Spätis gibt.")
end

SR::Talk.define(:haus10) do
  narr("Lehrter Straße <b>10</b>")
  learn(:hausnummer)
  step(:q_ankommen, :strasse) if active?(:q_ankommen)
  think("Zehn. Ich brauche die Zwölf. Die ist bestimmt gleich daneben.") if !step?(:q_ankommen, :klingel)
end

SR::Talk.define(:haus14) do
  narr("Lehrter Straße <b>14</b>")
  learn(:hausnummer)
  step(:q_ankommen, :strasse) if active?(:q_ankommen)
  think("Vierzehn. Zu weit! Die Zwölf muss zwischen der 10 und der 14 sein.") if !step?(:q_ankommen, :klingel)
end

SR::Talk.define(:haus11) do
  narr("Lehrter Straße <b>11</b>")
  think("Elf - eine ungerade Nummer. Tarek hat gesagt: Die geraden Nummern sind auf der anderen Seite.") if !step?(:q_ankommen, :klingel)
end

SR::Talk.define(:wg_klingel) do
  if flag?(:wg_klingel_ok)
    narr(SR.state.episode >= 2 ? "Klingelschild 3. OG: <b>Becker / Fischer / Ríos</b>" : "Klingelschild 3. OG: <b>Becker / Fischer</b>")
    think("Da steht schon mein Name! Mit Akzent. Jonas hat sich Mühe gegeben.") if SR.state.episode >= 2
    next
  end
  narr("Lehrter Straße <b>12</b>")
  learn(:hausnummer)
  step(:q_ankommen, :strasse)
  step(:q_ankommen, :hausnr)
  think("Hier ist es! Jetzt muss ich klingeln. Aber wo?")
  learn(:klingel)
  loop do
    i = ask(nil, "<b>Klingelschilder</b>", ["EG: Nowak", "1. OG: Yılmaz", "2. OG: Hausverwaltung Schulz", "3. OG: Becker / Fischer"])
    se("Door slide", 60)
    case i
    when 0
      say("Gegensprechanlage", "Ja?! Wir kaufen nichts! Und wir abonnieren auch nichts!")
      wrong("Falsche Klingel!")
    when 1
      say("Gegensprechanlage", "Hallo? ... Jonas? Der wohnt ganz oben, Schatz. Dritter Stock. Bei Becker klingeln!")
      wrong("Falsche Klingel - aber ein guter Tipp!")
    when 2
      say("Gegensprechanlage", "Schulz? ... Ach, Sie sind bestimmt die neue Mieterin! Klingeln Sie mal bei Becker, der Jonas ist oben.")
      learn(:vermieterin)
    when 3
      break
    end
  end
  say("Gegensprechanlage", "Ja, hallo?")
  i = ask(me, "(Was sage ich?)", ["Hallo, hier ist {name}. Die neue Mitbewohnerin.",
                                   "Ich bin {name}. Ich wohne hier... ab heute?",
                                   "Guten Tag, Herr Becker. Hier ist Frau Ríos."])
  learn(:mitbewohner)
  if i == 2
    say("Gegensprechanlage", "Herr Becker? Haha! Komm hoch, dritter Stock!")
  else
    say("Gegensprechanlage", "Endlich! Komm hoch, dritter Stock!")
  end
  se("Door enter", 80)
  step(:q_ankommen, :klingel)
  set(:wg_klingel_ok)
  transfer(SR::MAP_WG, 3, 8, 8)
end

SR::Talk.define(:haltestelle) do
  narr("<b>Bushaltestelle Lehrter Str./Invalidenstr.</b>\nLinien 123, 245 · Richtung Hauptbahnhof")
end

SR::Talk.define(:baustelle) do
  narr("<b>BAUSTELLE</b> - Gehweg gesperrt. Fußgänger bitte andere Straßenseite benutzen.")
  learn(:baustelle)
end

SR::Talk.define(:bauarbeiter) do
  face_player
  say("Bauarbeiter", "Hier is' gesperrt, junge Frau. Baustelle!")
  i = ask(me, "(...)", ["Wie lange noch?", "Wo ist die Lehrter Straße?"])
  if i == 0
    say("Bauarbeiter", "Die Baustelle? Seit 2019. Fertig wird se... bald. Sagt der Chef. Jedes Jahr.")
  else
    say("Bauarbeiter", "Lehrter? Falsche Richtung! Zurück, dann rechts rein. Die Straße mit den Altbauten.")
  end
  say("Bauarbeiter", "Folgen Se einfach der Umleitung. Also... der Umleitung von der Umleitung.")
  learn(:baustelle, :umleitung)
end

SR::Talk.define(:spaeti_schild) do
  narr("<b>SPÄTI</b> · Spätkauf · täglich bis 2 Uhr")
  narr("<c3=707078,D8D8D0>Ein Späti ist ein kleiner Laden mit Getränken und Snacks, der auch abends und sonntags offen hat. Sehr Berlin.</c3>")
end

SR::Talk.define(:ercan) do
  face_player
  if done?(:q_pfand)
    if flag?(:mb_done)
      say("Ercan", "Angemeldet? Beim ersten Termin? Respekt. Ich hab drei Anläufe gebraucht - und ich bin hier geboren!")
    else
      say("Ercan", "Na, alles fit? Wenn du was brauchst - der Späti hat immer offen. Fast immer.")
    end
    next
  end
  if !flag?(:pfand_flasche)
    quest(:q_pfand)
    say("Ercan", "Hallo! Was kann ich für dich tun?")
    i = ask(me, "(...)", ["Ein Wasser, bitte.", "Haben Sie Wasser?", "Nichts, danke."])
    if i == 2
      say("Ercan", "Kein Problem. Gucken ist umsonst!")
      next
    end
    say("Ercan", "Klar. Ein Wasser: ein Euro neunzehn. Plus fünfundzwanzig Cent Pfand.")
    j = ask(me, "(Pfand?)", ["Was ist Pfand?", "Okay, danke."])
    if j == 0
      say("Ercan", "Pfand ist wie... Geld, das du dir leihst. Bringst du die leere Flasche zurück, kriegst du die 25 Cent wieder.")
    else
      say("Ercan", "Und vergiss nicht: Flasche zurückbringen, dann gibt's das Pfand wieder!")
    end
    learn(:pfand)
    step(:q_pfand, :kaufen)
    set(:pfand_flasche)
    think("Ich trinke das Wasser. Jetzt habe ich eine leere Flasche. Und 25 Cent, die nicht mehr mir gehören. Noch nicht.")
  else
    say("Ercan", "Ah, die Wasser-Frau! Was gibt's?")
    i = ask(me, "(...)", ["Ich habe die leere Flasche. Kann ich sie zurückgeben?", "Noch ein Wasser, bitte."])
    if i == 1
      say("Ercan", "Erst die alte Flasche, dann die neue. Sonst wird dein Zimmer ein Flaschenlager!")
    end
    say("Ercan", "Klar! Hier, fünfundzwanzig Cent. Siehst du - Geld zurück.")
    step(:q_pfand, :zurueck)
    finish(:q_pfand, 8)
    diary(:d_pfand, "Pfand: Man bezahlt für die Flasche und bekommt das Geld zurück. Ein Land, in dem man mit leeren Flaschen Geld verdient. Ich mag das.")
  end
end

SR::Talk.define(:pendlerin) do
  face_player
  say("Pendlerin", "Der Bus kommt laut App in drei Minuten.")
  say("Pendlerin", "Das heißt in Berlin: irgendwann zwischen jetzt und zehn Minuten.")
end

SR::Talk.define(:student) do
  face_player
  if active?(:q_ankommen) && !step?(:q_ankommen, :klingel)
    say("Student", "Suchst du was? Lehrter Straße? Da drüben, die Straße mit den Altbauten. Die Zwölf ist rechts, zwischen der 10 und der 14.")
  else
    say("Student", "Ich studiere Informatik an der TU. Und du?")
    i = ask(me, "(...)", ["Ich bin Krankenpflegerin.", "Ich... arbeite. Bald. Hoffentlich."])
    say("Student", i == 0 ? "Pflege? Respekt! Ihr werdet hier echt gebraucht." : "Das wird schon! Pflegekräfte werden hier überall gesucht.")
  end
end

SR::Talk.define(:jugendliche) do
  if !flag?(:digga_done)
    say("Jugendlicher", "Digga, guck mal. Läuft bei dir?")
    say(me, "Was... läuft?")
    say("Jugendliche", "Haha, chill. Das heißt: »Alles gut bei dir?«")
    i = ask(me, "(...)", ["Ja. Läuft... bei mir.", "Ich verstehe das nicht."])
    say("Jugendlicher", i == 0 ? "Ehrenfrau! Du lernst schnell." : "Kein Ding. Das ist Jugendsprache. Steht in keinem Lehrbuch.")
    learn(:verstehe_nicht) if i == 1
    learn(:digga)
    set(:digga_done)
  else
    say("Jugendliche", "Läuft bei dir? Läuft bei dir!")
  end
end

SR::Talk.define(:rentner) do
  face_player
  say("Rentner", "Na, wat suchen Se denn?")
  learn(:wat)
  if active?(:q_ankommen) && !step?(:q_ankommen, :klingel)
    say("Rentner", "Lehrter? Na, da stehen Se doch fast drauf! Die Zwölf is' da drüben, rechts. Det Haus mit der grünen Fassade.")
  else
    say("Rentner", "Ick wohn hier seit 1961. Hab schon allet gesehen. Die Mauer, die Wende - und jetzt jede Woche 'ne neue Baustelle.")
  end
end

SR::Talk.define(:mutter) do
  face_player
  if !flag?(:mutter_done)
    say("Mutter", "Entschuldigung, wissen Sie, wie spät es ist? Mein Handy ist leer.")
    i = ask(me, "(Es ist 10:20 Uhr.)", ["Es ist zwanzig nach zehn.", "Es ist zehn Uhr zwanzig.", "Es ist halb elf."])
    if i == 2
      wrong("Halb elf wäre 10:30 Uhr!")
      say("Mutter", "Halb elf? ...Oh, Sie meinen zwanzig nach zehn? Ihr Handy zeigt 10:20. Danke trotzdem!")
    else
      say("Mutter", "Danke! Dann schaffen wir es noch zum Spielplatz.")
      points(4, "geholfen")
    end
    set(:mutter_done)
  else
    say("Mutter", "Danke nochmal! Kinder und Uhrzeiten - das ist hier ein Vollzeitjob.")
  end
end

SR::Talk.define(:joggerin) do
  face_player
  say("Joggerin", "Morgen!")
  learn(:morgen_gruss)
  think("»Morgen«? Ach so - »Guten Morgen«, nur kürzer. Die Deutschen sparen Wörter. Außer bei Wörtern wie »Hauptbahnhof«.")
end

SR::Talk.define(:polizist) do
  face_player
  say("Polizist", "Guten Tag. Alles in Ordnung? Brauchen Sie Hilfe?")
  if active?(:q_ankommen) && !step?(:q_ankommen, :klingel)
    say("Polizist", "Die Lehrter Straße? Das ist die große Straße hier, Richtung Norden. Nummer 12 ist auf der rechten Seite.")
  else
    i = ask(me, "(...)", ["Nein, danke. Alles gut.", "Ist Berlin gefährlich?"])
    if i == 1
      say("Polizist", "Nicht gefährlicher als andere Großstädte. Passen Sie auf Ihre Tasche auf - und auf Fahrradfahrer. Die sind gefährlicher als ich.")
    else
      say("Polizist", "Dann einen schönen Tag!")
    end
  end
end

#-------------------------------------------------------------------------------
# WG – Ankunft (Ende Episode 1)
#-------------------------------------------------------------------------------
SR::Talk.define(:wg_ankunft) do
  jonas = event("Jonas")
  walk(jonas, "LLLDd") if jonas
  say("Jonas", "Hey! Du musst {name} sein! Willkommen! Ich bin Jonas.")
  i = ask(me, "(Was sage ich?)", ["Guten Tag, Herr Becker. Freut mich.", "Hallo Jonas! Freut mich."])
  if i == 0
    say("Jonas", "Herr Becker?! Bitte nicht. Herr Becker ist mein Vater. In der WG sagen wir alle »du«.")
  else
    say("Jonas", "Genau so! In der WG sagen wir alle »du«.")
  end
  say("Jonas", "»Sie« sagst du beim Amt, bei der Arbeit, zu fremden Leuten. »Du« in der WG, zu Freunden, zu Kindern.")
  learn(:duzen, :wg)
  minigame(:quiz, [
    { :speaker => "Jonas", :q => "Test! Du willst mich um Hilfe bitten. Was sagst du?",
      :o => ["Kannst du mir helfen?", "Können Sie mir helfen?"], :a => 0,
      :why => "Zu mir? In der WG? Viel zu förmlich. Sag einfach »du«!", :yes => "Perfekt! Du bist offiziell WG-tauglich." },
    { :speaker => "Jonas", :q => "Und morgen beim Amt, zur Beamtin?",
      :o => ["Kannst du mir helfen?", "Können Sie mir helfen?"], :a => 1,
      :why => "Lieber nicht. Beim Amt immer »Sie«. Sonst guckt die Beamtin sehr streng.", :yes => "Genau! Beim Amt immer »Sie«." }
  ])
  say("Jonas", "Sprichst du Deutsch?")
  say(me, "Ein bisschen.")
  say("Jonas", "Ein bisschen ist mehr als mein Spanisch. Ich kann nur »una cerveza, por favor«.")
  say("Jonas", "Ich komme übrigens aus Passau. Ich studiere hier Stadtplanung. Keine Sorge: In Berlin ist niemand von hier.")
  say("Jonas", "Dein Zimmer ist oben, die Treppe hoch. Und, sag mal... hast du dich schon angemeldet?")
  i = ask(me, "(Angemeldet?)", ["Was ist »anmelden«?", "Nein. Muss ich das?"])
  say("Jonas", "Wenn man in Deutschland in eine Wohnung zieht, muss man sich anmelden. Beim <b>Bürgeramt</b>. Innerhalb von zwei Wochen.")
  say("Jonas", "Ohne Anmeldung gibt's kein Bankkonto, keine Steuer-ID, keinen Arbeitsvertrag... eigentlich nix.")
  say("Jonas", "Also: Sie müssen sich beim Bürgeramt anmelden, Frau Ríos! Haha. Sorry, Beamtenmodus.")
  learn(:anmelden, :buergeramt)
  say(me, "Ich muss mich beim Bürgeramt anmelden. Okay. Das schaffe ich.")
  step(:q_ankommen, :wg)
  set(:wg_arrived)
  finish(:q_ankommen, 20)
  SR.give_skill(:wege)
  diary(:d_ep1, "Heute bin ich in Berlin angekommen. Tarek von der Bahn hat mir den Weg erklärt - auf Deutsch! Rechts, links, geradeaus. Jetzt wohne ich in einer WG. Jonas sagt »du«. Und bald: Bürgeramt. Was auch immer das genau ist.")
  SR.finish_episode(1, 10)
  say("Jonas", "Ruh dich erstmal aus. Dein Bett ist oben, ganz links. Morgen machen wir einen Termin!")
  walk(jonas, "uRRRUu") if jonas
end
