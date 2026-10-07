#===============================================================================
# Sprachreise – Ende Episode 2: Brief, Telefonat, Reise nach Köln, Demo-Ende
#===============================================================================

#-------------------------------------------------------------------------------
# WG-Epilog nach der Anmeldung (Autorun in der WG)
#-------------------------------------------------------------------------------
SR::Talk.define(:wg_epilog) do
  jonas = event("Jonas")
  jonas.turn_toward_player if jonas
  say("Jonas", "Und?! Wie war's?")
  i = ask(me, "(Was erzähle ich?)", ["Ich habe die Meldebescheinigung!",
                                     "Ich habe die Meldebescheinigung bekommen. Beim ersten Termin! Aber vorher musste ich noch eine Wohnungsgeberbestätigung holen."])
  if i == 1
    points(5, "ganzer Satz")
    say("Jonas", "Wow - du hast gerade »Wohnungsgeberbestätigung« gesagt, ohne zu stottern. Ich bin beeindruckt.")
  end
  say("Jonas", "Beim ERSTEN Termin? Ich brauchte drei! Darauf trinken wir ein Glas... Leitungswasser. Wir sind Studenten.")
  pbBGMFade(1.0) rescue nil
  $game_screen.start_tone_change(Tone.new(-255, -255, -255, 0), 20)
  pbWait(1.0)
  narr("Zwei Wochen später.")
  $game_screen.start_tone_change(Tone.new(0, 0, 0, 0), 20)
  $game_map.autoplay
  pbWait(0.6)
  quest(:q_koeln)
  say("Jonas", "Post für dich! Sieht sehr offiziell aus. Grauer Umschlag. Das sind immer die gefährlichen.")
  think("Ein Brief vom Amt. Mein Herz klopft. Habe ich etwas falsch gemacht?")
  # --- Brief-Minispiel ---------------------------------------------------------
  SR::Mini.letter("Brief", [
    "Bundeszentralamt für Steuern\n53221 Bonn\n\nFrau\n{name} {nachname}\nLehrter Straße 12\n10557 Berlin\n\n<b>Mitteilung Ihrer steuerlichen Identifikationsnummer</b>",
    "Sehr geehrte Frau {nachname},\n\nIhnen wurde die folgende Identifikationsnummer zugeteilt:\n<b>12 345 678 901</b>\n\nDiese Nummer gilt lebenslang. Sie ändert sich auch bei einem Umzug nicht.\n\nBitte bewahren Sie dieses Schreiben sorgfältig auf. <b>Eine Antwort ist nicht erforderlich.</b>"
  ], [
    { :q => "Von wem ist der Brief?", :o => ["Vom Bundeszentralamt für Steuern", "Vom Bürgeramt", "Von der Krankenkasse"], :a => 0,
      :why => "Oben links steht der Absender: Bundeszentralamt für Steuern." },
    { :q => "Muss ich jetzt etwas tun?", :o => ["Nein - nur gut aufbewahren.", "Ja, innerhalb von zwei Wochen antworten.", "Ja, 12 Euro bezahlen."], :a => 0,
      :why => "Da steht: »Eine Antwort ist nicht erforderlich.« Nur aufbewahren!" },
    { :q => "Wann ändert sich die Nummer?", :o => ["Nie - sie gilt lebenslang.", "Bei jedem Umzug.", "Jedes Jahr."], :a => 0,
      :why => "»Diese Nummer gilt lebenslang.«" }
  ])
  learn(:steuer_id, :aufbewahren)
  doc(:steuer_id)
  step(:q_koeln, :brief)
  think("Keine Strafe. Kein Problem. Nur eine Nummer. Und ich habe den ganzen Brief verstanden. Allein!")
  # --- Telefon-Minispiel ---------------------------------------------------------
  pbMEPlay("Register phone", 90) rescue nil
  pbWait(0.4)
  think("Mein Handy! Eine Nummer aus Köln...?")
  SR::Mini.phone("Frau Hoffmann", [
    "Guten Tag, hier spricht Sabine Hoffmann vom St.-Marien-Klinikum in Köln, Pflegedirektion.",
    "Wir haben Ihre Bewerbung erhalten und würden Sie gerne persönlich kennenlernen.",
    "Hätten Sie am Montag um halb zehn Zeit für ein Vorstellungsgespräch bei uns in Köln?",
    "Bitte bringen Sie Ihren Lebenslauf und Ihre Zeugnisse mit."
  ], [
    "Gerne. Also, langsam: Hier ist Frau Hoffmann. Vom Krankenhaus. In Köln.",
    "Wir möchten Sie kennenlernen. Zu einem Vorstellungsgespräch.",
    "Am Montag. Um halb zehn. Also neun Uhr dreißig.",
    "Bitte bringen Sie mit: Ihren Lebenslauf. Und Ihre Zeugnisse."
  ], [])
  i = ask(me, "(Was antworte ich?)", ["Ja, gerne! Am Montag um halb zehn passt mir sehr gut.",
                                      "Ja... Montag... zehn Uhr dreißig?",
                                      "Was ist ein Vorstellungsgespräch?"])
  case i
  when 0
    points(6, "souverän am Telefon")
    say("Frau Hoffmann", "Wunderbar! Dann bis Montag. Ich schicke Ihnen die Einladung per E-Mail.")
  when 1
    say("Frau Hoffmann", "Halb zehn - das ist neun Uhr dreißig. Eine halbe Stunde vor zehn.")
    say(me, "Ah! Neun Uhr dreißig. Ja, gerne!")
  when 2
    say("Frau Hoffmann", "Ein Gespräch, in dem wir uns kennenlernen. Wir stellen Fragen, Sie stellen Fragen. Keine Angst!")
    say(me, "Ah, ein Interview! Ja, sehr gerne. Am Montag um halb zehn.")
  end
  learn(:halb_zehn, :vorstellungsgespraech)
  SR::Mini.quiz([
    { :q => "Wer hat angerufen?", :o => ["Ein Krankenhaus in Köln", "Das Bürgeramt", "Jonas' Mutter"], :a => 0,
      :why => "Frau Hoffmann vom St.-Marien-Klinikum in Köln." },
    { :q => "Wann ist das Gespräch?", :o => ["Montag, 9:30 Uhr", "Montag, 10:30 Uhr", "Dienstag, 9:30 Uhr"], :a => 0,
      :why => "»Halb zehn« heißt: eine halbe Stunde VOR zehn. Also 9:30 Uhr. Eine klassische Falle!" },
    { :q => "Was soll ich mitbringen?", :o => ["Lebenslauf und Zeugnisse", "Nur meinen Pass", "Kuchen"], :a => 0,
      :why => "Lebenslauf und Zeugnisse. Kuchen ist aber nie verkehrt." }
  ], 5)
  doc(:einladung)
  step(:q_koeln, :anruf)
  set(:anruf_done)
  SR.unlock_city(:koeln)
  say("Jonas", "Wer war das? ...KÖLN?! Du gehst nach Köln?")
  say(me, "Erstmal nur zum Vorstellungsgespräch. Aber... wenn sie mich nehmen...")
  say("Jonas", "Dann brauchst du da eine Wohnung. Und eine Krankenkasse. Und ein Konto. Und dich wieder anmelden. Haha. Willkommen in Level zwei der deutschen Bürokratie.")
  say("Jonas", "Fahr mit dem ICE. Tickets gibt's im Reisezentrum am Hauptbahnhof. Und in Köln: Wenn jemand »Alaaf« ruft, ruf einfach zurück.")
  SR.give_skill(:formulare)
  diary(:d_ep2, "Ich bin angemeldet. Ich habe eine Steuer-ID und ein Vorstellungsgespräch in Köln. Vor zwei Wochen konnte ich nicht mal eine Schrippe bestellen. Heute habe ich am Telefon »halb zehn« verstanden.")
  SR.finish_episode(2, 20)
  think("Nächster Halt: Köln. Ich muss zum Hauptbahnhof, ins Reisezentrum.")
end

#-------------------------------------------------------------------------------
# Reisezentrum – Fahrkarte kaufen und reisen
#-------------------------------------------------------------------------------
SR::Talk.define(:reisezentrum) do
  if !flag?(:anruf_done)
    narr("<b>DB Reisezentrum</b>\nFahrkarten, Reservierungen, Auskunft.\nTäglich 6 - 22 Uhr.")
    think("Im Moment muss ich nirgendwohin. Zum Glück.") if SR.state.episode <= 2
    next
  end
  if !doc?(:ice_ticket)
    say("Tarek", "Na, wen haben wir denn da! Die Lehrter Straße haben Sie damals gefunden, ja?")
    say(me, "Ja! Rechts, erste links, geradeaus. Ich habe es nicht vergessen.")
    say("Tarek", "Und heute? Wohin soll es gehen?")
    i = ask(me, "(Wie sage ich es?)", ["Köln. Ticket. Bitte.",
                                       "Ich möchte eine Fahrkarte nach Köln.",
                                       "Ich hätte gern eine Fahrkarte nach Köln, bitte. Am liebsten eine direkte Verbindung, ohne Umsteigen."])
    learn(:umsteigen)
    case i
    when 0
      say("Tarek", "Köln, Ticket, bitte - verstanden! Aber ich weiß, dass Sie mehr können.")
    when 1
      points(4)
      say("Tarek", "Sehr gut. Klar und höflich.")
    when 2
      points(8, "Satz auf B1-Niveau")
      say("Tarek", "Wow. Vor drei Wochen haben Sie »Lehrter Straße... wo?« gesagt. Und jetzt? Konjunktiv! »Ich hätte gern«!")
      think("Er hat recht. Ich spreche anders als am Anfang.")
    end
    say("Tarek", "Es gibt einen direkten ICE. ICE 949, ab Gleis 4, 11:52 Uhr. Ohne Umsteigen. Mit Sparpreis - das heißt Zugbindung: nur dieser Zug!")
    say("Tarek", "Gute Reise. Und viel Glück in Köln! Ich bin sicher, die nehmen Sie.")
    doc(:ice_ticket)
    step(:q_koeln, :fahrkarte)
  end
  if SR::UI.choose(nil, "Jetzt mit dem Zug fahren?", ["Ja, die Deutschlandkarte öffnen", "Noch nicht"]) == 0
    SR::Karte.travel
  end
end

#-------------------------------------------------------------------------------
# Köln Hauptbahnhof – Ende der Demo
#-------------------------------------------------------------------------------
SR::Talk.define(:koeln_ankunft) do
  SR.durchsage("Meine Damen und Herren, in Kürze erreichen wir Köln Hauptbahnhof. Ausstieg in Fahrtrichtung rechts.")
  SR.durchsage("Wir bedanken uns für Ihre Reise und wünschen Ihnen einen schönen Tag.")
  think("Ich habe die ganze Durchsage verstanden. Jedes Wort.")
  walk(:player, "UUUU")
  $game_player.turn_up
  pbWait(0.3)
  exclaim($game_player)
  # Kamera nach oben schwenken, damit der Dom ganz zu sehen ist
  $game_map.start_scroll(8, 6, 4)
  while $game_map.scrolling?
    Graphics.update
    Input.update
    pbUpdateSceneMap
  end
  think("Der Dom... Er ist riesig! Direkt neben dem Bahnhof!")
  learn(:dom)
  step(:q_koeln, :reise)
  finish(:q_koeln, 15)
  think("Vor drei Wochen habe ich gesagt: »Ein bisschen.«")
  think("Heute habe ich einen Brief vom Amt verstanden, ein Telefonat geführt, eine Fahrkarte gekauft - und einem Touristen den Weg erklärt.")
  think("Es ist schwierig. Aber ich kann es lernen.")
  $game_map.start_scroll(2, 6, 4)
  while $game_map.scrolling?
    Graphics.update
    Input.update
    pbUpdateSceneMap
  end
  set(:koeln_done)
  SR.demo_end_card
  narr("Du kannst Köln Hbf noch erkunden. Über das Reisezentrum (das Schild am Bahnsteig) geht es zurück nach Berlin.")
end

SR::Talk.define(:koelner) do
  face_player
  say("Kölner", "Alaaf! ...Ach, ist ja gar kein Karneval. Egal. Willkommen in Kölle!")
  say("Kölner", "»Kölle« ist Köln auf Kölsch. Kölsch ist unser Dialekt. Und unser Bier. Und eigentlich alles.")
end

SR::Talk.define(:koeln_reisende) do
  face_player
  say("Reisende", "Der Zug nach Düsseldorf? Fährt alle zehn Minuten. Wenn er fährt.")
  say("Reisende", "Köln und Düsseldorf mögen sich übrigens nicht so. Sag in Köln nie, dass dir Düsseldorf gefällt!")
end

SR::Talk.define(:dom) do
  narr("<b>Der Kölner Dom</b>")
  narr("157 Meter hoch. Gebaut von 1248 bis 1880 - über 600 Jahre.")
  think("Über 600 Jahre Bauzeit. Länger als eine Terminvergabe beim Bürgeramt. Knapp.")
  learn(:dom)
end

SR::Talk.define(:koeln_rueck) do
  narr("<b>Reisezentrum Köln Hbf</b>")
  if SR::UI.choose(nil, "Mit dem Zug fahren?", ["Ja, die Deutschlandkarte öffnen", "Noch nicht"]) == 0
    SR::Karte.travel
  end
end

#-------------------------------------------------------------------------------
# Demo-Abschlusskarte
#-------------------------------------------------------------------------------
module SR
  def self.demo_end_card
    st = SR.state
    vp = Viewport.new(0, 0, Graphics.width, Graphics.height)
    vp.z = 100_050
    s = Sprite.new(vp)
    s.bitmap = Bitmap.new(Graphics.width, Graphics.height)
    b = s.bitmap
    b.fill_rect(0, 0, b.width, b.height, Color.new(24, 28, 40))
    [[0, 0, 0], [221, 0, 0], [255, 206, 0]].each_with_index do |c, i|
      b.fill_rect(0, 58 + i * 4, b.width, 4, Color.new(*c))
    end
    pbSetSystemFont(b)
    b.font.size = 38 rescue nil
    pbDrawShadowText(b, 0, 14, b.width, 44, "ENDE DER DEMO", Color.new(248, 248, 248), Color.new(0, 0, 0), 1)
    pbSetSystemFont(b)
    lines = [
      "Episode 1: Ankommen  ■",
      "Episode 2: Das Bürgeramt  ■",
      "",
      "Sprachniveau: Deutsch #{SR.level_name}  (#{st.points} Sprachpunkte)",
      "Gelernte Wörter: #{st.words.length}   Dokumente: #{st.docs.length}",
      "Aufgaben erledigt: #{st.quests.values.count { |q| q[:status] == :done }} / #{SR::QUESTS.length}",
      "",
      "Weiter geht es in Episode 3: »Die Wohnung«",
      "Kaltmiete, Warmmiete, Kaution - in Köln."
    ]
    lines.each_with_index do |l, i|
      col = (i >= 7) ? Color.new(255, 206, 80) : Color.new(220, 224, 240)
      pbDrawShadowText(b, 0, 86 + i * 28, b.width, 28, SR::UI.plain(l), col, Color.new(0, 0, 0), 1)
    end
    pbSetSmallFont(b)
    pbDrawShadowText(b, 0, Graphics.height - 30, b.width, 24, "Taste drücken", Color.new(140, 150, 170), Color.new(0, 0, 0), 1)
    s.opacity = 0
    pbMEPlay("Badge get") rescue nil
    start = System.uptime
    loop do
      Graphics.update
      Input.update
      t = System.uptime - start
      s.opacity = [t / 0.6, 1].min * 255
      break if t > 1.0 && (Input.trigger?(Input::USE) || Input.trigger?(Input::BACK))
    end
    b.dispose
    s.dispose
    vp.dispose
  end
end
