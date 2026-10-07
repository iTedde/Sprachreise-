#===============================================================================
# Sprachreise – Episode 1: Ankommen (Berlin Hauptbahnhof & Moabit)
# Jede Szene wird von einem Map-Event per sr_talk(:id) aufgerufen.
#
# Sprache in Episode 1: einfach (A2). Kurze Hauptsätze, Präsens, bekannte Wörter.
# [[wort]] markiert ein Lernwort; die Übersetzung in der Muttersprache steht
# dann in Klammern dahinter (abschaltbar im Menü).
# Platzhalter: {name} {nachname} {stadt} {land} {aus_land} {in_land} {staat} {sprache}
#===============================================================================
module SR
  # Hilfsfunktion für Durchsagen
  def self.durchsage(text)
    pbSEPlay("GUI naming tab swap start", 80) rescue nil
    SR::UI.say("Durchsage", "♪ " + text)
  end

  # Auswahl der Muttersprache / Herkunft (Beginn des Spiels)
  def self.choose_origin
    opts = SR::LANG_ORDER.map { |l| "#{SR::ORIGINS[l][:native]}   -   #{SR::ORIGINS[l][:label]}" }
    loop do
      i = SR::UI.choose(nil, "Welche Sprache sprichst du zu Hause?\n<c3=707078,D8D8D0>(Die Übersetzungen im Spiel erscheinen in dieser Sprache.)</c3>", opts)
      SR.state.origin = SR::LANG_ORDER[i]
      text = "Du spielst <b>#{SR.o(:first)} #{SR.o(:last)}</b> #{SR.o(:aus)}.\n" \
             "Sie ist Krankenpflegerin aus #{SR.o(:city)}. Einverstanden?"
      break if SR::UI.choose(nil, text, ["Ja, los geht's!", "Andere Sprache wählen"]) == 0
    end
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
  narr("Willkommen bei SPRACHREISE!\nDu lernst Deutsch - Schritt für Schritt.")
  SR.choose_origin
  name = pbEnterPlayerName("Dein Vorname?", 1, 12, o(:first))
  name = o(:first) if !name || name.strip.empty?
  $player.name = name.strip
  narr("Im ICE nach Berlin.")
  SR.durchsage("Sehr geehrte Fahrgäste, in wenigen Minuten erreichen wir Berlin Hauptbahnhof.")
  think("Ich verstehe nur zwei Wörter: »Berlin« und »Hauptbahnhof«. Das ist genug!")
  think("#{o(:endlich)} Endlich. Berlin.")
  think("Ich bin Krankenpflegerin. Ich komme #{o(:aus)}. Ich will in Deutschland arbeiten.")
  think("Dafür brauche ich Deutsch. Mein Ziel: B1.")
  think("Ich spreche schon ein bisschen. Ungefähr A2.")
  [:reisepass, :visum, :diplom, :mietvertrag].each { |d| SR.give_doc(d, true) }
  SR.learn(:reisepass, true)
  se("Door slide", 90)
  $game_screen.start_tone_change(Tone.new(0, 0, 0, 0), 20)
  pbWait(0.8)
  $game_map.autoplay
  SR.durchsage("Berlin Hauptbahnhof. Bitte alle aussteigen.")
  learn(:hauptbahnhof)
  think("So viele Menschen! Und alle sprechen so schnell.")
  narr("<c3=3050C8,C8D0F0>Tipp:</c3> Drücke X oder Esc für das Menü. Dort ist deine <b>Sprachmappe</b>.")
  narr("Blaue Wörter sind neu. Die Übersetzung steht in Klammern. Fehler sind kein Problem!")
  quest(:q_ankommen)
  think("Meine [[adresse]]: Lehrter Straße 12. Aber wo ist das? Ich frage den Mann von der Bahn. Er steht in der Halle.")
  diary(:d_prolog, "Ich bin in Berlin! Im Zug habe ich die Durchsage fast verstanden. Fast. Das Wort »Hauptbahnhof« ist so lang wie der Bahnhof.")
  set(:prolog_done)
end

#-------------------------------------------------------------------------------
# TAREK – DB-Mitarbeiter in der Bahnhofshalle (Mentor in Episode 1)
#-------------------------------------------------------------------------------
SR::Talk.define(:tarek) do
  face_player
  if !flag?(:tarek_done)
    say("Tarek", "Guten Tag! Kann ich helfen?")
    i = ask(me, "(Was sage ich?)", ["[[entschuldigung|Entschuldigung]], ich brauche Hilfe.",
                                     "Ich... Lehrter Straße? Wo?",
                                     "Sprechen Sie {sprache}?"])
    case i
    when 0
      points(3, "höflich gefragt")
      learn(:entschuldigung)
      say("Tarek", "Sehr gerne. Was suchen Sie?")
      say(me, "Ich suche diese [[adresse]]. Hier, auf dem Handy.")
    when 1
      say("Tarek", "Ah, die Lehrter Straße. Kein Problem!")
      say("Tarek", "Ein Tipp: Sagen Sie zuerst »[[entschuldigung|Entschuldigung]]«. Das ist höflich.")
      learn(:entschuldigung)
    when 2
      say("Tarek", o(:tarek))
      say("Tarek", "Aber wir sprechen Deutsch, okay? Das hilft Ihnen hier. Was suchen Sie?")
      say(me, "Die Lehrter Straße. Nummer 12.")
    end
    learn(:adresse)
    say("Tarek", "Lehrter Straße 12. Also: Sie gehen hier raus zum Europaplatz, dann rechts die Invalidenstraße entlang, die erste links ist die Lehrter, dann immer geradeaus, die Zwölf ist rechts.")
    think("...Was? Das war sehr schnell.")
    loop do
      j = ask(me, "(Was sage ich jetzt?)", ["Entschuldigung, ich verstehe das nicht.",
                                             "Können Sie bitte [[langsamer]] sprechen?",
                                             "Alles klar, danke!"])
      if j == 0
        learn(:verstehe_nicht)
        say("Tarek", "Kein Problem! Ich erkläre es langsam.")
        break
      elsif j == 1
        learn(:langsamer)
        points(3, "nachgefragt")
        say("Tarek", "Natürlich. Ganz langsam.")
        break
      else
        say("Tarek", "Wirklich? Dann eine Frage: Wohin gehen Sie nach dem Ausgang?")
        k = ask(me, "(Hmm...)", ["Links.", "Rechts.", "Ich weiß es nicht mehr."])
        if k == 1
          say("Tarek", "Richtig! Ich erkläre es trotzdem nochmal langsam.")
        else
          wrong("Nicht schlimm - Nachfragen ist gut!")
          say("Tarek", "Kein Problem. Nochmal langsam.")
        end
        break
      end
    end
    say("Tarek", "Eins: Dort oben ist der [[ausgang]].")
    learn(:ausgang)
    say("Tarek", "Zwei: Draußen gehen Sie [[rechts]].")
    learn(:rechts)
    say("Tarek", "Drei: Die erste [[strasse|Straße]] [[links]]. Das ist die Lehrter Straße.")
    learn(:links, :strasse)
    say("Tarek", "Vier: Dann immer [[geradeaus]]. Die Nummer 12 ist rechts.")
    learn(:geradeaus)
    minigame(:quiz, [
      { :speaker => "Tarek", :q => "Also: Sie gehen raus. Und dann?",
        :o => ["Rechts, dann links, dann geradeaus.",
               "Links, dann rechts, dann zurück.",
               "Geradeaus, bis zum Wasser."],
        :a => 0, :why => "Nicht ganz. Raus. Dann RECHTS. Dann LINKS. Dann GERADEAUS.",
        :yes => "Perfekt!" },
      { :speaker => "Tarek", :q => "Und wo ist die Nummer 12?",
        :o => ["Links.", "Rechts."],
        :a => 1, :why => "Die Nummern 10, 12 und 14 sind rechts." }
    ])
    i = ask(me, "(Wie sage ich danke?)", ["[[danke|Danke schön]]!", "Okay.", "Tschüss."])
    learn(:danke)
    if i == 0
      say("Tarek", "Gern geschehen! Willkommen in Berlin.")
    else
      say("Tarek", "Man sagt auch »Danke schön«. Das freut die Leute! Willkommen in Berlin.")
    end
    say("Tarek", "Ich heiße Tarek. Ich arbeite oft hier im Reisezentrum.")
    step(:q_ankommen, :info)
    set(:tarek_done)
    think("Mein erstes Gespräch auf Deutsch. Und er versteht mich!")
  elsif flag?(:anruf_done)
    say("Tarek", "Sie wollen eine Fahrkarte? Das Reisezentrum ist gleich da links. Beim Schild an der Säule.")
  elsif flag?(:mb_done)
    say("Tarek", "Schon beim Bürgeramt angemeldet? Beim ersten Termin? Respekt!")
  elsif SR.state.episode >= 2
    say("Tarek", "Hallo! Na, wie gefällt Ihnen Berlin?")
    say(me, "Gut! Aber die Bürokratie ist kompliziert.")
    say("Tarek", "Willkommen in Deutschland. Hier hat sogar die Bürokratie eine Bürokratie.")
  else
    say("Tarek", "Raus, rechts, links, geradeaus. Die Zwölf ist rechts. Sie schaffen das!")
  end
end

SR::Talk.define(:hbf_noch_nicht) do
  next if !flag?(:prolog_done)
  think("Wohin muss ich? Ich weiß es noch nicht. Ich frage den Mann von der Bahn. Er steht in der Halle.")
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
    think("»+15 Min« heißt: Der Zug kommt 15 Minuten später. Das ist eine [[verspaetung|Verspätung]].")
    think("»Fällt aus« heißt: Der Zug kommt gar nicht.")
    learn(:verspaetung, :gleis)
  end
end

SR::Talk.define(:hbf_schild) do
  narr("BERLIN HAUPTBAHNHOF")
  narr("Oben fahren Züge von Osten nach Westen. Unten fahren Züge von Norden nach Süden.")
end

SR::Talk.define(:hbf_pendler) do
  face_player
  if count(:pendler) == 1
    say("Pendler", "[[entschuldigung|Entschuldigung]]! Keine Zeit! Mein Zug kommt!")
    learn(:entschuldigung)
  else
    say("Pendler", "Mein Zug hat 20 Minuten [[verspaetung|Verspätung]]. Wie jeden Tag.")
    learn(:verspaetung)
  end
end

SR::Talk.define(:hbf_familie) do
  face_player
  if !flag?(:familie_done)
    say("Kind", "Mama, warum spricht die Frau so anders?")
    say("Mutter", "Sie spricht noch eine andere Sprache. Das ist toll!")
    say("Kind", "Ich spreche nur eine Sprache.")
    i = ask(me, "(Was sage ich?)", ["Ich spreche {sprache}. Und ein bisschen Deutsch.", "Äh... Hallo."])
    if i == 0
      say("Kind", "Ein bisschen ist schon viel!")
      points(3)
    else
      say("Kind", "Hallo! Ich heiße Ben. Ich bin fünf.")
    end
    set(:familie_done)
  else
    say("Mutter", "Ben will jetzt auch {sprache} lernen. Danke!")
  end
end

SR::Talk.define(:hbf_reisende) do
  face_player
  say("Reisende", "Ist mein Zug auf [[gleis|Gleis]] 4 oder auf Gleis 6? Die Tafel sagt 4. Die App sagt 6.")
  say("Reisende", "Ich warte in der Mitte. Dann renne ich.")
  learn(:gleis)
end

SR::Talk.define(:baeckerei) do
  face_player
  if done?(:q_baecker)
    say("Bäckerin", "Na, schmeckt die Schrippe? Bis morgen!")
    next
  end
  quest(:q_baecker)
  say("Bäckerin", "Hallo! Was möchten Sie?")
  i = ask(me, "(Bestellen...)", ["Ein Brötchen, bitte.", "Zwei Schrippen, bitte.", "Was ist eine Schrippe?"])
  if i == 2 || i == 0
    say("Bäckerin", "In Berlin heißt das Brötchen [[schrippe|Schrippe]]. Ein Brot, zwei Namen!")
  end
  learn(:schrippe)
  step(:q_baecker, :bestellen)
  say("Bäckerin", "Eine Schrippe. Das macht eins zwanzig.")
  minigame(:quiz, [
    { :speaker => "Bäckerin", :q => "Eins zwanzig, bitte.",
      :o => ["1,20 Euro", "12,00 Euro", "1,02 Euro"], :a => 0,
      :why => "»Eins zwanzig« = ein Euro und zwanzig Cent. Also 1,20 Euro.",
      :yes => "Danke! Schönen Tag noch!" }
  ])
  step(:q_baecker, :bezahlen)
  finish(:q_baecker, 6)
  diary(:d_schrippe, "In Berlin heißt das Brötchen »Schrippe«. Im Süden heißt es »Semmel«. Ein Brot, drei Namen! Aber es ist lecker.")
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
    think("So viele [[fahrkarte|Fahrkarten]]. Welche brauche ich?")
    learn(:fahrkarte)
  end
end

SR::Talk.define(:kowalski) do
  face_player
  if done?(:q_automat)
    say("Frau Kowalski", "Danke nochmal! Und immer schön stempeln!")
    next
  end
  quest(:q_automat)
  say("Frau Kowalski", "Hallo, junge Frau! Können Sie mir helfen? Ich habe meine Brille nicht dabei.")
  say("Frau Kowalski", "Was steht auf dem Automaten?")
  i = ask(me, "(Ich versuche es...)", ["Ja, gerne. Ich lese vor.", "Mein Deutsch ist nicht so gut..."])
  if i == 1
    say("Frau Kowalski", "Ach was! Sie können lesen. Lesen Sie einfach vor.")
  end
  say(me, "Da steht: Einzelfahrschein. Kurzstrecke. 24-Stunden-Karte.")
  say("Frau Kowalski", "Ich fahre nur drei Stationen. Zu meiner Tochter.")
  minigame(:quiz, [
    { :speaker => "Frau Kowalski", :q => "Welche Fahrkarte brauche ich?",
      :o => ["Einzelfahrschein AB", "Kurzstrecke", "24-Stunden-Karte"], :a => 1,
      :why => "Hm, das ist zu teuer. Für drei Stationen gibt es etwas Billigeres...",
      :yes => "Genau! Die [[kurzstrecke|Kurzstrecke]]. Sie sind ein Profi!" }
  ])
  learn(:kurzstrecke)
  step(:q_automat, :hilfe)
  say("Frau Kowalski", "Und jetzt passen Sie auf! Die Karte müssen Sie [[entwerten]]. Da, im roten Kasten. Stempeln!")
  say("Frau Kowalski", "Ohne Stempel ist die Karte nicht gültig. Das kostet 60 Euro Strafe!")
  say(me, "Ich kaufe die Karte. Aber sie ist nicht gültig? Das ist... sehr deutsch.")
  say("Frau Kowalski", "Hihi. Willkommen in Berlin!")
  learn(:entwerten)
  step(:q_automat, :entwerten)
  say("Frau Kowalski", "Und Sie? Die Lehrter Straße? Das ist ganz nah. Da gehen Sie [[zu_fuss|zu Fuß]]!")
  learn(:zu_fuss)
  finish(:q_automat, 10)
  diary(:d_kowalski, "Eine Fahrkarte kaufen ist nicht genug. Man muss sie auch »entwerten« - stempeln. Frau Kowalski hat es mir erklärt. Und ich habe ihr vorgelesen.")
end

SR::Talk.define(:taxi) do
  face_player
  say("Taxifahrer", "Taxi? Wohin?")
  say(me, "Lehrter Straße?")
  say("Taxifahrer", "Lehrter Straße? Det sind fünf Minuten [[zu_fuss|zu Fuß]]! Det lohnt sich nich.")
  learn(:zu_fuss)
  say("Taxifahrer", "Raus hier, rechts, erste links. Und »det« heißt »das«. Das ist Berlinerisch!")
  learn(:wat)
end

SR::Talk.define(:musiker) do
  face_player
  if !flag?(:musiker_done)
    narr("♪ ... ♪ Ein Mann spielt Gitarre.")
    say("Musiker", "Hey! Woher kommst du?")
    i = ask(me, "(Woher komme ich?)", ["Ich komme {aus_land}.", "Ich komme aus {stadt}. Das ist {in_land}."])
    points(i == 1 ? 4 : 2)
    say("Musiker", "#{o(:toll)} Ich komme #{o(:musiker_aus)}. Aus #{o(:musiker_her).split(',')[0]}. Ich wohne seit sieben Jahren in Berlin.")
    say("Musiker", "Am Anfang war alles schwer. Die Sprache. Die Ämter. Der Winter!")
    say("Musiker", "Heute ist Berlin mein Zuhause. Du schaffst das auch. #{o(:schritt)} - Schritt für Schritt.")
    set(:musiker_done)
    think("Schritt für Schritt. Das merke ich mir.")
  else
    narr("♪ ... #{o(:schritt)} ... ♪")
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
    think("Die Lehrter Straße! Jetzt geradeaus. Die Zwölf ist rechts.")
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
    think("[[buergeramt|Bürgeramt]]? Was ist das? Es klingt wichtig.")
  end
end

SR::Talk.define(:ba_zu) do
  narr("Rathaus Tiergarten. Die Tür ist zu.")
  narr("Heute ist Sonntag. Geschlossen.")
  think("In Deutschland ist am Sonntag fast alles zu. Das ist neu für mich.")
end

SR::Talk.define(:copy_zu) do
  narr("Copyshop »Kopierkönig«. Ein Schild: »Sonntag geschlossen«.")
  think("Schon wieder zu! Nur der Späti ist offen.")
end

SR::Talk.define(:haus10) do
  narr("Lehrter Straße <b>10</b>")
  learn(:hausnummer)
  step(:q_ankommen, :strasse) if active?(:q_ankommen)
  think("Zehn. Ich brauche die Zwölf. Sie ist bestimmt daneben.") if !step?(:q_ankommen, :klingel)
end

SR::Talk.define(:haus14) do
  narr("Lehrter Straße <b>14</b>")
  learn(:hausnummer)
  step(:q_ankommen, :strasse) if active?(:q_ankommen)
  think("Vierzehn. Zu weit! Die Zwölf ist zwischen 10 und 14.") if !step?(:q_ankommen, :klingel)
end

SR::Talk.define(:haus11) do
  narr("Lehrter Straße <b>11</b>")
  think("Elf. Die Zwölf ist auf der anderen Seite.") if !step?(:q_ankommen, :klingel)
end

SR::Talk.define(:wg_klingel) do
  if flag?(:wg_klingel_ok)
    narr(SR.state.episode >= 2 ? "Klingelschild 3. OG: <b>Becker / Fischer / {nachname}</b>" : "Klingelschild 3. OG: <b>Becker / Fischer</b>")
    think("Da steht schon mein Name! Jonas hat ihn geschrieben.") if SR.state.episode >= 2
    next
  end
  narr("Lehrter Straße <b>12</b>")
  learn(:hausnummer)
  step(:q_ankommen, :strasse)
  step(:q_ankommen, :hausnr)
  think("Hier ist es! Jetzt muss ich klingeln. Aber bei wem?")
  learn(:klingel)
  loop do
    i = ask(nil, "<b>Klingelschilder</b>", ["EG: Nowak", "1. OG: Yılmaz", "2. OG: Hausverwaltung Schulz", "3. OG: Becker / Fischer"])
    se("Door slide", 60)
    case i
    when 0
      say("Gegensprechanlage", "Ja?! Wir kaufen nichts!")
      wrong("Falsche Klingel!")
    when 1
      say("Gegensprechanlage", "Hallo? ... Jonas? Der wohnt oben. Bei Becker klingeln!")
      wrong("Falsche Klingel - aber ein guter Tipp!")
    when 2
      say("Gegensprechanlage", "Schulz? ... Ach, die neue Mieterin! Jonas wohnt oben. Bei Becker.")
      learn(:vermieterin)
    when 3
      break
    end
  end
  say("Gegensprechanlage", "Ja, hallo?")
  i = ask(me, "(Was sage ich?)", ["Hallo, hier ist {name}. Ich bin die neue Mitbewohnerin.",
                                   "Ich bin {name}. Ich wohne hier... ab heute?",
                                   "Guten Tag, Herr Becker. Hier ist Frau {nachname}."])
  learn(:mitbewohner)
  if i == 2
    say("Gegensprechanlage", "Herr Becker? Haha! Komm hoch! Dritter Stock!")
  else
    say("Gegensprechanlage", "Endlich! Komm hoch! Dritter Stock!")
  end
  se("Door enter", 80)
  step(:q_ankommen, :klingel)
  set(:wg_klingel_ok)
  transfer(SR::MAP_WG, 3, 8, 8)
end

SR::Talk.define(:haltestelle) do
  narr("<b>Bushaltestelle Lehrter Str./Invalidenstr.</b>\nBus 123, 245 · zum Hauptbahnhof")
end

SR::Talk.define(:baustelle) do
  narr("<b>BAUSTELLE</b> - Gehweg gesperrt. Bitte die andere Straßenseite benutzen.")
  learn(:baustelle)
end

SR::Talk.define(:bauarbeiter) do
  face_player
  say("Bauarbeiter", "Halt! Hier ist eine [[baustelle|Baustelle]].")
  i = ask(me, "(...)", ["Wie lange noch?", "Wo ist die Lehrter Straße?"])
  if i == 0
    say("Bauarbeiter", "Die Baustelle? Seit 2019. Fertig ist sie... bald. Sagt der Chef. Jedes Jahr.")
  else
    say("Bauarbeiter", "Lehrter Straße? Falsche Richtung! Zurück. Dann die Straße mit den alten Häusern.")
  end
  say("Bauarbeiter", "Gehen Sie die [[umleitung|Umleitung]]. Bitte da lang.")
  learn(:baustelle, :umleitung)
end

SR::Talk.define(:spaeti_schild) do
  narr("<b>SPÄTI</b> · Spätkauf · jeden Tag bis 2 Uhr")
  narr("<c3=707078,D8D8D0>Ein Späti ist ein kleiner Laden. Er ist auch abends und am Sonntag offen.</c3>")
end

SR::Talk.define(:ercan) do
  face_player
  if done?(:q_pfand)
    if flag?(:mb_done)
      say("Ercan", "Angemeldet? Beim ersten Termin? Respekt! Ich habe drei Termine gebraucht.")
    else
      say("Ercan", "Alles gut? Der Späti ist immer offen. Fast immer.")
    end
    next
  end
  if !flag?(:pfand_flasche)
    quest(:q_pfand)
    say("Ercan", "Hallo! Was möchtest du?")
    i = ask(me, "(...)", ["Ein Wasser, bitte.", "Haben Sie Wasser?", "Nichts, danke."])
    if i == 2
      say("Ercan", "Kein Problem. Gucken ist gratis!")
      next
    end
    say("Ercan", "Klar. Ein Wasser kostet 1,19 Euro. Plus 25 Cent [[pfand|Pfand]].")
    j = ask(me, "(Pfand?)", ["Was ist Pfand?", "Okay, danke."])
    if j == 0
      say("Ercan", "Du bringst die leere Flasche zurück. Dann bekommst du die 25 Cent wieder.")
    else
      say("Ercan", "Bring die leere Flasche zurück! Dann bekommst du das Geld wieder.")
    end
    learn(:pfand)
    step(:q_pfand, :kaufen)
    set(:pfand_flasche)
    think("Ich trinke das Wasser. Jetzt ist die Flasche leer. Ich bringe sie später zurück.")
  else
    say("Ercan", "Hallo! Was gibt's?")
    i = ask(me, "(...)", ["Hier ist die leere Flasche.", "Noch ein Wasser, bitte."])
    if i == 1
      say("Ercan", "Erst die alte Flasche, dann die neue!")
    end
    say("Ercan", "Danke! Hier sind 25 Cent. Siehst du? Geld zurück.")
    step(:q_pfand, :zurueck)
    finish(:q_pfand, 8)
    diary(:d_pfand, "Pfand: Man bezahlt für die Flasche. Man bringt sie zurück. Dann bekommt man das Geld wieder. Leere Flaschen sind hier Geld!")
  end
end

SR::Talk.define(:pendlerin) do
  face_player
  say("Pendlerin", "Der Bus kommt in drei Minuten. Sagt die App.")
  say("Pendlerin", "In Berlin heißt das: in drei bis zehn Minuten.")
end

SR::Talk.define(:student) do
  face_player
  if active?(:q_ankommen) && !step?(:q_ankommen, :klingel)
    say("Student", "Suchst du die Lehrter Straße? Da drüben! Die Nummer 12 ist rechts.")
  else
    say("Student", "Ich studiere Informatik. Und du?")
    i = ask(me, "(...)", ["Ich bin Krankenpflegerin.", "Ich arbeite bald. Hoffentlich."])
    say("Student", i == 0 ? "Pflege? Super! Hier gibt es viele Jobs in der Pflege." : "Das klappt! Pflegekräfte werden hier überall gesucht.")
  end
end

SR::Talk.define(:jugendliche) do
  if !flag?(:digga_done)
    say("Jugendlicher", "[[digga|Digga]], läuft bei dir?")
    say(me, "Was... läuft?")
    say("Jugendliche", "Haha! Das heißt: »Alles gut bei dir?«")
    i = ask(me, "(...)", ["Ja. Läuft bei mir.", "Ich verstehe das nicht."])
    say("Jugendlicher", i == 0 ? "Stark! Du lernst schnell." : "Kein Ding. Das ist Jugendsprache. Die steht in keinem Buch.")
    learn(:verstehe_nicht) if i == 1
    learn(:digga)
    set(:digga_done)
  else
    say("Jugendliche", "Läuft bei dir? Läuft bei dir!")
  end
end

SR::Talk.define(:rentner) do
  face_player
  say("Rentner", "Na, [[wat]] suchen Se denn?")
  learn(:wat)
  if active?(:q_ankommen) && !step?(:q_ankommen, :klingel)
    say("Rentner", "Die Lehrter? Da drüben! Die Zwölf ist rechts. Das Haus mit der grünen Fassade.")
  else
    say("Rentner", "Ick wohne hier seit 1961. Ick habe allet gesehen. Die Mauer, die Wende - und jetzt Baustellen.")
  end
end

SR::Talk.define(:mutter) do
  face_player
  if !flag?(:mutter_done)
    say("Mutter", "[[entschuldigung|Entschuldigung]], wie spät ist es? Mein Handy ist leer.")
    i = ask(me, "(Es ist 10:20 Uhr.)", ["Es ist zwanzig nach zehn.", "Es ist zehn Uhr zwanzig.", "Es ist halb elf."])
    if i == 2
      wrong("Halb elf ist 10:30 Uhr!")
      say("Mutter", "Halb elf? Ah, Ihre Uhr zeigt 10:20. Das ist »zwanzig nach zehn«. Danke trotzdem!")
    else
      say("Mutter", "Danke! Dann gehen wir noch zum Spielplatz.")
      points(4, "geholfen")
    end
    set(:mutter_done)
  else
    say("Mutter", "Danke nochmal!")
  end
end

SR::Talk.define(:joggerin) do
  face_player
  say("Joggerin", "Morgen!")
  learn(:morgen_gruss)
  think("»Morgen«? Ah - das heißt »Guten Morgen«. Nur kürzer.")
end

SR::Talk.define(:polizist) do
  face_player
  say("Polizist", "Guten Tag. Alles in Ordnung? Brauchen Sie Hilfe?")
  if active?(:q_ankommen) && !step?(:q_ankommen, :klingel)
    say("Polizist", "Die Lehrter Straße? Das ist die große Straße hier. Nummer 12 ist rechts.")
  else
    i = ask(me, "(...)", ["Nein, danke. Alles gut.", "Ist Berlin gefährlich?"])
    if i == 1
      say("Polizist", "Nicht sehr. Passen Sie auf Ihre Tasche auf. Und auf die Fahrräder!")
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
  walk(jonas, "LLLLDd") if jonas
  say("Jonas", "Hey! Du bist {name}, oder? Willkommen! Ich bin Jonas.")
  i = ask(me, "(Was sage ich?)", ["Guten Tag, Herr Becker. Freut mich.", "Hallo Jonas! Freut mich."])
  if i == 0
    say("Jonas", "Herr Becker?! Nein, nein. Ich bin Jonas. In der WG sagen wir »du«.")
  else
    say("Jonas", "Genau! In der WG sagen wir »du«.")
  end
  say("Jonas", "»Sie« sagst du beim Amt. Bei der Arbeit. Zu fremden Leuten.")
  say("Jonas", "»Du« sagst du zu Freunden. In der WG. Zu Kindern.")
  learn(:duzen, :wg)
  minigame(:quiz, [
    { :speaker => "Jonas", :q => "Test! Du brauchst meine Hilfe. Was sagst du?",
      :o => ["Kannst du mir helfen?", "Können Sie mir helfen?"], :a => 0,
      :why => "Zu mir in der WG? Zu förmlich! Sag »du«.", :yes => "Perfekt!" },
    { :speaker => "Jonas", :q => "Und beim Amt? Zur Beamtin?",
      :o => ["Kannst du mir helfen?", "Können Sie mir helfen?"], :a => 1,
      :why => "Beim Amt lieber »Sie«.", :yes => "Genau! Beim Amt immer »Sie«." }
  ])
  say("Jonas", "Sprichst du Deutsch?")
  say(me, "Ein bisschen.")
  say("Jonas", "Ein bisschen ist super! #{o(:jonas)}")
  say("Jonas", "Ich komme aus Passau. Ich studiere hier. In Berlin kommen viele Leute von woanders.")
  say("Jonas", "Dein Zimmer ist oben. Sag mal... bist du schon angemeldet?")
  ask(me, "(Angemeldet?)", ["Was heißt »anmelden«?", "Nein. Muss ich das?"])
  say("Jonas", "Du hast eine neue Wohnung. Dann musst du dich [[anmelden|anmelden]]. Beim [[buergeramt|Bürgeramt]].")
  say("Jonas", "Das musst du in zwei Wochen machen. Ohne Anmeldung: kein Bankkonto. Kein Job. Nichts.")
  say("Jonas", "Also, Frau {nachname}: Sie müssen sich beim Bürgeramt anmelden! Haha. Sorry, Beamten-Stimme.")
  learn(:anmelden, :buergeramt)
  say(me, "Ich muss mich beim Bürgeramt anmelden. Okay. Das schaffe ich.")
  step(:q_ankommen, :wg)
  set(:wg_arrived)
  finish(:q_ankommen, 20)
  SR.give_skill(:wege)
  diary(:d_ep1, "Heute bin ich in Berlin angekommen. Tarek von der Bahn hat mir den Weg erklärt. Rechts, links, geradeaus. Jetzt wohne ich in einer WG. Jonas sagt »du«. Bald gehe ich zum Bürgeramt.")
  SR.finish_episode(1, 10)
  say("Jonas", "Ruh dich aus. Dein Bett ist oben. Morgen machen wir einen Termin!")
  walk(jonas, "uRRRRUu") if jonas
end
