#===============================================================================
# Sprachreise – Minispiele
#   Paper            : Papier-/Bildschirm-Overlay (Brief, Formular, Webseite, Aushang)
#   Mini.quiz        : Multiple Choice mit Erklärung bei Fehlern (kein Game Over)
#   Mini.form        : Formular ausfüllen (Pflichtfelder / freiwillige Felder)
#   Mini.find_errors : Fehler in einem ausgefüllten Formular finden
#   Mini.pick_docs   : Richtige Unterlagen auswählen (Mehrfachauswahl)
#   Mini.phone       : Telefonat mit Wiederholen-Option, danach Verständnisfragen
#   Mini.letter      : Brief lesen, danach Verständnisfragen
#===============================================================================
module SR
  #-----------------------------------------------------------------------------
  # Overlay mit Papier-Optik. Bleibt sichtbar, während Fragen gestellt werden.
  #-----------------------------------------------------------------------------
  class Paper
    STYLES = {
      :paper  => [Color.new(250, 248, 236), Color.new(60, 60, 70),   Color.new(200, 196, 180)],
      :screen => [Color.new(232, 240, 252), Color.new(30, 50, 90),   Color.new(110, 140, 190)],
      :phone  => [Color.new(36, 40, 52),    Color.new(232, 236, 248), Color.new(90, 200, 120)],
      :board  => [Color.new(196, 160, 112), Color.new(40, 32, 24),   Color.new(120, 84, 48)]
    }

    attr_accessor :line_h

    def initialize(title, body, style = :paper, height = 272)
      @line_h = 24
      @viewport = Viewport.new(0, 0, Graphics.width, Graphics.height)
      @viewport.z = 99_998
      @style = style
      @title = title
      @height = height
      @sprite = Sprite.new(@viewport)
      @sprite.bitmap = Bitmap.new(Graphics.width - 24, height)
      @sprite.x = 12
      @sprite.y = 6
      self.body = body
    end

    def body=(text)
      bg, fg, accent = STYLES[@style]
      b = @sprite.bitmap
      b.clear
      b.fill_rect(0, 0, b.width, b.height, Color.new(30, 30, 36))
      b.fill_rect(2, 2, b.width - 4, b.height - 4, bg)
      b.fill_rect(2, 2, b.width - 4, 30, accent)
      if @style == :board
        [[8, 8], [b.width - 16, 8]].each { |x, y| b.fill_rect(x, y, 8, 8, Color.new(200, 40, 40)) }
      end
      pbSetSystemFont(b)
      title_col = (@style == :phone) ? Color.new(20, 24, 32) : Color.new(248, 248, 248)
      pbDrawShadowText(b, 12, 4, b.width - 24, 26, SR::UI.fmt(@title), title_col, Color.new(0, 0, 0, 60))
      shadow = (@style == :phone) ? Color.new(0, 0, 0, 120) : Color.new(fg.red, fg.green, fg.blue, 40)
      drawFormattedTextEx(b, 14, 38, b.width - 28, SR::UI.fmt(text), fg, shadow, @line_h)
    end

    def dispose
      @sprite.bitmap.dispose
      @sprite.dispose
      @viewport.dispose
    end
  end

  module Mini
    module_function

    # Paper anzeigen, Block ausführen, wieder schließen
    def with_paper(title, body, style = :paper, height = 272)
      paper = SR::Paper.new(title, body, style, height)
      begin
        ret = yield(paper)
      ensure
        paper.dispose
      end
      return ret
    end

    #---------------------------------------------------------------------------
    # Quiz. questions: [{:q, :o => [..], :a => index | [indices], :why, :speaker, :retry}]
    # Gibt Anzahl beim ersten Versuch richtig beantworteter Fragen zurück.
    #---------------------------------------------------------------------------
    def quiz(questions, pts_each = 4)
      first_try = 0
      questions.each do |q|
        tries = 0
        loop do
          tries += 1
          i = SR::UI.choose(q[:speaker], q[:q], q[:o])
          ok = q[:a].is_a?(Array) ? q[:a].include?(i) : i == q[:a]
          if ok
            pbSEPlay("Voltorb Flip point", 70) rescue nil
            SR::UI.say(q[:speaker], q[:yes]) if q[:yes]
            first_try += 1 if tries == 1
            SR.add_points(tries == 1 ? pts_each : 1, nil, true)
            break
          end
          SR.mistake
          SR::UI.toast("Nicht ganz - versuch's nochmal!", :mistake)
          SR::UI.say(q[:speaker], q[:why] || "Hmm, das stimmt nicht ganz.")
          break if q[:retry] == false
        end
      end
      SR::UI.toast(_INTL("{1} von {2} beim ersten Versuch richtig", first_try, questions.length)) if questions.length > 1
      return first_try
    end

    #---------------------------------------------------------------------------
    # Formular ausfüllen.
    # fields: [{:label, :o => [Optionen], :a => richtige(r) Index(e), :req => Pflichtfeld?,
    #           :why => Erklärung, :word => Wort-Key}]
    # Freiwillige Felder: Option "(leer lassen)" ist meist richtig.
    #---------------------------------------------------------------------------
    def form(title, fields, intro = nil)
      values = Array.new(fields.length, "")
      errors = 0
      render = proc do
        txt = ""
        fields.each_with_index do |f, i|
          star = (f[:req] && SR.skill?(:formulare)) ? "<c3=C03030,F0C0C0>*</c3>" : ""
          val = values[i].empty? ? "<c3=A0A0A8,E8E8E0>________</c3>" : "<c3=2040A0,C0D0F0>#{values[i]}</c3>"
          txt += "#{f[:label]}#{star}: #{val}\n"
        end
        txt
      end
      lines = fields.length
      lh = (lines > 9) ? 21 : 24
      height = [[lines * lh + 50, 160].max, 290].min
      with_paper(title, "", :paper, height) do |paper|
        paper.line_h = lh
        paper.body = render.call
        SR::UI.say(nil, intro) if intro
        fields.each_with_index do |f, i|
          loop do
            prompt = "<b>#{f[:label]}</b>" + (f[:hint] ? "\n#{f[:hint]}" : "")
            if SR.skill?(:formulare)
              prompt += f[:req] ? "  <c3=C03030,F0C0C0>(Pflichtfeld)</c3>" : "  <c3=307030,C0E0C0>(freiwillig)</c3>"
            end
            k = SR::UI.choose(nil, prompt, f[:o])
            ok = f[:a].is_a?(Array) ? f[:a].include?(k) : k == f[:a]
            if ok
              values[i] = (f[:o][k].start_with?("(") ? "-" : f[:o][k])
              paper.body = render.call
              SR.learn(f[:word]) if f[:word]
              SR.add_points(2, nil, true)
              SR::UI.say(nil, f[:yes]) if f[:yes]
              break
            end
            errors += 1
            SR.mistake
            SR::UI.toast("Fehler im Formular - kein Problem!", :mistake)
            SR::UI.say(f[:who], f[:why] || "Das passt hier nicht.")
          end
        end
        pbSEPlay("Mining found all", 70) rescue nil
        pbWait(0.5)
      end
      return errors
    end

    #---------------------------------------------------------------------------
    # Fehler finden: rows = [[Text, falsch?, Erklärung]]
    #---------------------------------------------------------------------------
    def find_errors(title, rows, speaker = nil)
      found = []
      wrong_total = rows.count { |r| r[1] }
      attempts = 0
      render = proc do
        rows.each_with_index.map do |r, i|
          found.include?(i) ? "<c3=C03030,F0C0C0>[!] #{r[0]}</c3>" : "     #{r[0]}"
        end.join("\n")
      end
      with_paper(title, render.call, :paper, [rows.length * 24 + 52, 288].min) do |paper|
        while found.length < wrong_total
          opts = rows.each_with_index.map { |r, i| (found.include?(i) ? "[!] " : "") + r[0].gsub(/<[^>]*>/, "") }
          opts.push("Alles korrekt.")
          k = SR::UI.choose(speaker, _INTL("Was stimmt nicht? (Noch {1} Fehler)", wrong_total - found.length), opts)
          attempts += 1
          if k == rows.length
            SR.mistake
            SR::UI.say(nil, "Hm... Ich schaue lieber nochmal genau hin. Irgendwo ist noch ein Fehler.")
          elsif rows[k][1] && !found.include?(k)
            found.push(k)
            pbSEPlay("Voltorb Flip mark", 80) rescue nil
            paper.body = render.call
            SR::UI.say(nil, rows[k][2])
            SR.add_points(4, nil, true)
          elsif found.include?(k)
            SR::UI.say(nil, "Das habe ich schon markiert.")
          else
            SR.mistake
            SR::UI.say(nil, rows[k][2] || "Nein, das ist richtig so.")
          end
        end
      end
      return attempts
    end

    #---------------------------------------------------------------------------
    # Unterlagen auswählen. docs: [[key, nötig?(:yes/:no/:ok), Kommentar]]
    # :ok = nicht nötig, aber unschädlich. Gibt fehlende nötige Keys zurück.
    #---------------------------------------------------------------------------
    def pick_docs(speaker, prompt, docs)
      chosen = []
      loop do
        opts = docs.map { |d| (chosen.include?(d[0]) ? "[x] " : "[  ] ") + SR::DOCUMENTS[d[0]][:name] }
        opts.push("Fertig - das gebe ich ab.")
        k = SR::UI.choose(speaker, prompt, opts)
        if k == docs.length
          break if !chosen.empty?
          SR::UI.say(nil, "Ich muss schon etwas abgeben...")
          next
        end
        key = docs[k][0]
        chosen.include?(key) ? chosen.delete(key) : chosen.push(key)
      end
      missing = []
      docs.each do |d|
        if d[1] == :yes && !chosen.include?(d[0])
          missing.push(d[0])
        elsif d[1] == :no && chosen.include?(d[0])
          SR.mistake
          SR::UI.say(speaker, d[2])
        elsif d[1] == :ok && chosen.include?(d[0]) && d[2]
          SR::UI.say(speaker, d[2])
        end
      end
      SR.add_points(missing.empty? ? 6 : 2, nil, true)
      return missing
    end

    #---------------------------------------------------------------------------
    # Telefonat. lines: Text (wird nach und nach angezeigt); slow: langsamere Fassung.
    #---------------------------------------------------------------------------
    def phone(caller, lines, slow_lines, questions)
      pbMEPlay("Register phone", 90) rescue nil
      with_paper("Anruf: #{caller}", "<c3=60D080,103020>Verbunden</c3>", :phone, 120) do |paper|
        heard = lines
        loop do
          heard.each { |l| SR::UI.say(caller, l) }
          k = SR::UI.choose(SR.player_name, "(Habe ich alles verstanden?)",
                            ["Ja, alles klar.",
                             "Entschuldigung, können Sie das bitte wiederholen? Etwas langsamer, bitte."])
          break if k == 0
          SR.learn(:wiederholen)
          heard = slow_lines
        end
      end
      return quiz(questions, 5)
    end

    #---------------------------------------------------------------------------
    # Brief lesen. pages: Liste von Textseiten. Danach Fragen.
    #---------------------------------------------------------------------------
    def letter(title, pages, questions = [])
      with_paper(title, pages[0], :paper, 288) do |paper|
        pages.each_with_index do |pg, i|
          paper.body = pg
          SR::UI.say(nil, i < pages.length - 1 ? "(Weiterlesen ...)" : "(Ende des Briefes.)")
        end
        if SR.skill?(:briefe)
          SR::UI.say(nil, "<c3=307030,C0E0C0>Tipp: Achte auf Fristen, Beträge und was du tun musst.</c3>")
        end
        # Fragen, während der Brief noch sichtbar ist (wie im echten Leben: nochmal nachlesen erlaubt)
        paper.body = pages.join("
")[0, 600] if pages.length > 1 && pages.join.length < 600
        quiz(questions, 5)
      end
    end
  end
end
