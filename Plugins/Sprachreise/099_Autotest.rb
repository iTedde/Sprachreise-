#===============================================================================
# Sprachreise – Automatischer Durchspiel-Test
# Nur aktiv, wenn im Spielordner die Datei "sr_autotest.txt" existiert.
# Spielt die Demo komplett durch (echte Map-Events, echte Szenen), prüft
# Erreichbarkeit wichtiger Felder, Speichern/Laden und schreibt:
#   sr_test/log.txt   und   sr_test/*.png (Screenshots)
#===============================================================================
module SR
  module Autotest
    ACTIVE = FileTest.exist?("sr_autotest.txt")
    DIR = "sr_test"

    module_function

    def active?; return ACTIVE; end

    def log(msg)
      @log ||= []
      line = "[#{format('%6.1f', System.uptime - (@t0 || System.uptime))}] #{msg}"
      @log.push(line)
      File.open("#{DIR}/log.txt", "a") { |f| f.puts(line) }
    end

    def shot(name)
      @shot_n = (@shot_n || 0) + 1
      bmp = Graphics.snap_to_bitmap
      bmp.to_file(format("#{DIR}/%03d_%s.png", @shot_n, name))
      bmp.dispose
    rescue StandardError => e
      log("Screenshot fehlgeschlagen: #{e.message}")
    end

    def fail(msg)
      @failures ||= []
      @failures.push(msg)
      log("FEHLER: #{msg}")
    end

    #---------------------------------------------------------------------------
    # Auswahl-Strategie: gleiche Frage erneut -> nächste Option (findet so jede
    # richtige Antwort, ohne die Lösungen zu kennen)
    #---------------------------------------------------------------------------
    def pick(prompt, n)
      key = prompt.to_s
      reverse = @reverse && !@forward_once
      if key == @last_prompt
        @pick_i = reverse ? (@pick_i - 1) % n : (@pick_i + 1) % n
      else
        @pick_i = reverse ? n - 1 : 0
      end
      @last_prompt = key
      return @pick_i
    end

    #---------------------------------------------------------------------------
    # Testablauf
    #---------------------------------------------------------------------------
    def steps
      h = SR::MAP_HBF; m = SR::MAP_MOABIT; w = SR::MAP_WG; b = SR::MAP_BUERGERAMT; c = SR::MAP_COPYSHOP
      return [
        [:shot, "start"], [:expect_map, h], [:check, "SR.flag?(:prolog_done)"],
        [:reach, 16, 16], [:reach, 15, 1], [:reach, 13, 7], [:reach, 12, 9], [:reach, 27, 16],
        [:talk, "Abfahrtstafel"], [:talk, "Hbf-Schild"], [:talk, "Pendler"],
        [:touch, "Ausgang"], [:check, "$game_map.map_id == #{h}"],
        [:talk, "Tarek"], [:check, "SR.flag?(:tarek_done)"], [:shot, "tarek"],
        [:talk, "Baeckerin"], [:check, "SR.quest_done?(:q_baecker)"],
        [:talk, "Familie"], [:talk, "Reisende"],
        [:talk, "Frau Kowalski"], [:check, "SR.quest_done?(:q_automat)"],
        [:talk, "Fahrkartenautomat"], [:talk, "Taxifahrer"], [:talk, "Musiker"], [:talk, "Reisezentrum"],
        [:mappe], [:karte],
        [:touch, "Ausgang"], [:expect_map, m], [:shot, "moabit"],
        [:reach, 32, 19], [:reach, 11, 10], [:reach, 3, 21], [:reach, 14, 22], [:reach, 41, 15],
        [:reach, 38, 16], [:reach, 17, 34], [:reach, 41, 33],
        [:talk, "Schild Lehrter Str"], [:talk, "Haus Nr. 10"], [:talk, "Haus Nr. 14"], [:talk, "Haus Nr. 11"],
        [:talk, "Schild Invalidenstr"], [:talk, "Schild Turmstr"], [:talk, "Schild Buergeramt"],
        [:talk, "Haltestelle"], [:talk, "Baustellenschild"], [:talk, "Spaeti-Schild"],
        [:talk, "Ercan"], [:check, "SR.flag?(:pfand_flasche)"],
        [:talk, "Student"], [:talk, "Rentner"], [:talk, "Joggerin"], [:talk, "Jugendlicher"],
        [:talk, "Mutter"], [:talk, "Polizist"], [:talk, "Bauarbeiter"], [:talk, "Pendlerin"],
        [:talk, "Frau Schulz"], [:talk, "Herr Krause"],
        [:touch, "Tür Bürgeramt"], [:expect_map, m], [:touch, "Tür Copyshop"], [:expect_map, m],
        [:talk, "Ercan"], [:check, "SR.quest_done?(:q_pfand)"],
        [:touch, "Tür Nr. 12"], [:expect_map, w], [:check, "SR.flag?(:wg_arrived)"],
        [:check, "SR.state.episodes_done.include?(1)"], [:shot, "wg"],
        [:talk, "Jonas"], [:talk, "Kuehlschrank"], [:talk, "Spuele"], [:talk, "Fenster"],
        [:touch, "Treppe hoch"], [:reach, 21, 7], [:talk, "Laptop"], [:check, "SR.flag?(:mama_call)"],
        [:talk, "Kalender"], [:talk, "Regal"], [:talk, "Fernseher"],
        [:talk, "Bett"], [:check, "SR.flag?(:ep2_started)"],
        [:talk, "Laptop"], [:check, "SR.step_done?(:q_anmeldung, :termin)"], [:shot, "termin"],
        [:touch, "Treppe runter"], [:talk, "Mai"], [:talk, "Jonas"],
        [:touch, "Ausgang"], [:expect_map, m],
        [:touch, "Tür Copyshop"], [:expect_map, c], [:reach, 4, 7],
        [:talk, "Herr Kaya"], [:check, "SR.doc?(:anmeldeformular)"],
        [:talk, "Schwarzes Brett"], [:check, "SR.quest_done?(:q_kurs)"],
        [:talk, "Kopierer"], [:talk, "Getraenke"], [:talk, "Papier"], [:talk, "Kundin"],
        [:touch, "Ausgang"], [:expect_map, m],
        [:talk, "Tourist"], [:check, "SR.quest_done?(:q_tourist)"],
        [:talk, "Tonne1"], [:talk, "Tonne2"], [:talk, "Tonne3"], [:talk, "Tonne4"],
        [:talk, "Herr Krause"], [:check, "SR.quest_done?(:q_muell)"],
        [:touch, "Tür Bürgeramt"], [:expect_map, b], [:check, "SR.flag?(:ba_first_visit)"], [:shot, "buergeramt"],
        [:reach, 3, 5], [:reach, 7, 8],
        [:talk, "Platz 1"], [:talk, "Nummernautomat"], [:talk, "Aufrufanzeige"],
        [:talk, "Mohammed"], [:check, "SR.quest_done?(:q_mohammed)"], [:talk, "Wartende"],
        [:check, "SR.flag?(:aufgerufen)"], [:talk, "Student BA"], [:talk, "Herr Brandt"],
        [:talk, "Platz 2"], [:talk, "Aktenregal"], [:talk, "Plakat"], [:talk, "Frau Petersen"],
        [:talk, "Platz 1"], [:check, "SR.flag?(:ba_need_wgb)"],
        [:touch, "Ausgang"], [:expect_map, m],
        [:talk, "Frau Schulz"], [:check, "SR.doc?(:wgb)"],
        [:touch, "Tür Bürgeramt"], [:expect_map, b],
        [:talk, "Platz 1"], [:check, "SR.flag?(:need_fill)"],
        [:talk, "Formulartisch"], [:check, "SR.doc?(:anmeldeformular_ok)"],
        [:talk, "Platz 1"], [:check, "SR.flag?(:mb_done)"], [:check, "SR.doc?(:meldebescheinigung)"],
        [:check, "SR.quest_done?(:q_anmeldung)"],
        [:touch, "Ausgang"], [:expect_map, m],
        [:touch, "Tür Nr. 12"], [:expect_map, w],
        [:wait_idle], [:check, "SR.flag?(:anruf_done)"], [:check, "SR.state.episodes_done.include?(2)"],
        [:check, "SR.state.cities.include?(:koeln)"],
        [:touch, "Ausgang"], [:expect_map, m], [:touch, "Zum Hbf"], [:expect_map, h],
        [:save_load],
        [:talk, "Reisezentrum"], [:expect_map, SR::MAP_KOELN_HBF], [:wait_idle], [:shot, "koeln"],
        [:check, "SR.flag?(:koeln_done)"], [:check, "SR.quest_done?(:q_koeln)"],
        [:talk, "Koelner"], [:talk, "Reisende K"], [:talk, "Dom"],
        [:reach, 20, 17], [:reach, 13, 11],
        [:talk, "Rueckfahrt"], [:expect_map, h],
        [:mappe], [:summary]
      ]
    end

    def start
      Dir.mkdir(DIR) rescue nil
      File.open("#{DIR}/log.txt", "w") { |f| f.puts("Sprachreise Autotest #{Time.now}") }
      @t0 = System.uptime
      @reverse = (File.read("sr_autotest.txt").include?("reverse") rescue false)
      @queue = steps
      @frames = 0
      @step_frames = 0
      log("Start. #{@queue.length} Schritte.")
    end

    def busy?
      return true if $game_temp.player_transferring || $game_temp.transition_processing
      return true if $game_temp.message_window_showing
      return true if pbMapInterpreterRunning?
      return true if $game_player.moving?
      return false
    end

    def tick
      return if !@queue
      @frames += 1
      @step_frames += 1
      if @step_frames > 60 * 120
        fail("Zeitüberschreitung bei Schritt #{@cur.inspect}")
        finish
        return
      end
      return if busy?
      return if @wait && @frames < @wait
      @wait = nil
      if @queue.empty?
        finish
        return
      end
      @cur = @queue.shift
      @step_frames = 0
      begin
        run_step(@cur)
      rescue Exception => e
        fail("Ausnahme in #{@cur.inspect}: #{e.class}: #{e.message}\n  " + (e.backtrace || [])[0, 6].join("\n  "))
      end
      @wait = @frames + 4
    end

    def find_event(name)
      $game_map.events.each_value { |e| return e if e.name == name }
      return nil
    end

    def place_next_to(ev)
      [[0, 1, 8], [0, -1, 2], [-1, 0, 6], [1, 0, 4]].each do |dx, dy, dir|
        x = ev.x + dx
        y = ev.y + dy
        next if !$game_map.valid?(x, y)
        next if !$game_map.passable?(x, y, 0)
        next if $game_map.events.values.any? { |o| o != ev && o.x == x && o.y == y && !o.through && o.character_name != "" }
        $game_player.moveto(x, y)
        case dir
        when 2 then $game_player.turn_down
        when 4 then $game_player.turn_left
        when 6 then $game_player.turn_right
        when 8 then $game_player.turn_up
        end
        return true
      end
      $game_player.moveto(ev.x, ev.y + 1)
      return false
    end

    def run_step(s)
      case s[0]
      when :shot
        shot(s[1])
      when :wait_idle
        log("warte")
      when :expect_map
        if $game_map.map_id == s[1]
          log("OK Karte #{s[1]} (#{$game_map.name})")
        else
          fail("Erwartet Karte #{s[1]}, aber auf #{$game_map.map_id}")
        end
      when :check
        if eval(s[1])
          log("OK  #{s[1]}")
          @forward_once = false
        elsif @reverse && @last_talk && !@forward_once
          # andere Antwort gewählt -> Gespräch mit Standardantworten wiederholen
          log("HINWEIS: #{s[1]} nicht erfüllt (alternative Antwort) - wiederhole #{@last_talk.inspect} normal")
          @forward_once = true
          @queue.unshift(s)
          @queue.unshift(@last_talk)
        else
          fail("Prüfung fehlgeschlagen: #{s[1]}")
          @forward_once = false
        end
      when :talk, :touch
        ev = find_event(s[1])
        if !ev
          fail("Event '#{s[1]}' nicht auf Karte #{$game_map.map_id} gefunden")
          return
        end
        if ev.list.nil?
          log("#{s[0]} #{s[1]}: Event inaktiv (keine gültige Seite)")
          return
        end
        @last_talk = s
        ok = place_next_to(ev)
        log("#{s[0]} #{s[1]}" + (ok ? "" : " (kein freies Nachbarfeld!)"))
        fail("Kein freies Feld neben '#{s[1]}'") if !ok && s[0] == :talk
        ev.start
      when :reach
        reach(s[1], s[2])
      when :mappe
        SR::MappeScene::TABS.each_with_index do |t, i|
          sc = SR::MappeScene.new(t[0])
          sc.test_render(DIR + format("/mappe_%s.png", t[0]))
        end
        log("Sprachmappe gerendert")
      when :karte
        SR::Karte::Scene.new(:view).test_render(DIR + "/karte.png")
        log("Deutschlandkarte gerendert")
      when :save_load
        pts = SR.state.points
        words = SR.state.words.length
        if Game.save
          data = SaveData.read_from_file(SaveData::FILE_PATH)
          st = data[:sprachreise]
          if st && st.points == pts && st.words.length == words && st.flags[:mb_done]
            log("OK Speichern/Laden: #{pts} SP, #{words} Wörter")
          else
            fail("Speicherdaten unvollständig")
          end
        else
          fail("Game.save fehlgeschlagen")
        end
      when :summary
        st = SR.state
        log("ZUSAMMENFASSUNG: Niveau #{SR.level_name}, #{st.points} SP, #{st.words.length}/#{SR::WORDS.length} Wörter, " \
            "#{st.docs.length} Dokumente, Aufgaben erledigt #{st.quests.values.count { |q| q[:status] == :done }}/#{SR::QUESTS.length}, " \
            "Fehler gemacht: #{st.mistakes}")
        missing = SR::WORDS.keys - st.words.keys
        log("Nicht gelernte Wörter: #{missing.join(', ')}")
        unused = SR::Talk.ids.reject { |id| (@talked || []).include?(id) }
        log("Nie aufgerufene Szenen: #{unused.join(', ')}")
      end
    end

    # Breitensuche über begehbare Felder (inkl. Event-Kollisionen)
    def reach(tx, ty)
      sx = $game_player.x
      sy = $game_player.y
      seen = { [sx, sy] => true }
      q = [[sx, sy]]
      found = false
      until q.empty?
        x, y = q.shift
        if x == tx && y == ty
          found = true
          break
        end
        [[2, 0, 1], [4, -1, 0], [6, 1, 0], [8, 0, -1]].each do |d, dx, dy|
          nx = x + dx
          ny = y + dy
          next if seen[[nx, ny]]
          next if !$game_map.valid?(nx, ny)
          next if !$game_player.passable?(x, y, d)
          seen[[nx, ny]] = true
          q.push([nx, ny])
        end
      end
      if found
        log("OK erreichbar: (#{tx},#{ty}) von (#{sx},#{sy})")
      else
        fail("NICHT erreichbar: (#{tx},#{ty}) von (#{sx},#{sy}) auf Karte #{$game_map.map_id} - #{seen.length} Felder erreichbar")
      end
    end

    def note_talk(id)
      @talked ||= []
      @talked.push(id) if !@talked.include?(id)
    end

    def finish
      st = (@failures || []).empty? ? "BESTANDEN" : "FEHLGESCHLAGEN (#{@failures.length})"
      log("ENDE: #{st}")
      (@failures || []).each { |f| log("  - " + f.split("\n")[0]) }
      @queue = nil
      File.open("#{DIR}/done.txt", "w") { |f| f.puts(st) }
      begin
        File.delete(SaveData::FILE_PATH) if File.exist?(SaveData::FILE_PATH)
        bak = SaveData::FILE_PATH + ".sr_test_backup"
        File.rename(bak, SaveData::FILE_PATH) if File.exist?(bak)
      rescue StandardError
      end
      $scene = nil
      Kernel.exit!(0) rescue exit
    end
  end
end

#===============================================================================
# Testmodus-Anpassungen (nur aktiv, wenn sr_autotest.txt existiert)
#===============================================================================
TITLE_TEST = SR::Autotest.active? && (File.read("sr_autotest.txt").include?("title") rescue false)
if TITLE_TEST
  # nur den echten Titelbildschirm fotografieren und beenden
  class IntroEventScene
    alias __sr_title_update title_screen_update
    def title_screen_update(scene, args)
      __sr_title_update(scene, args)
      @sr_t ||= System.uptime
      if System.uptime - @sr_t > 2.5
        Dir.mkdir("sr_test") rescue nil
        bmp = Graphics.snap_to_bitmap
        bmp.to_file("sr_test/titel.png")
        bmp.dispose
        File.open("sr_test/done.txt", "w") { |f| f.puts("TITEL OK") }
        Kernel.exit!(0)
      end
    end
  end
end

if SR::Autotest.active? && !TITLE_TEST
  module SR
    module UI
      class << self
        def say(name, text, opts = {})
          plain = fmt(text).gsub(/<[^>]*>/, "").gsub("
", " ")
          SR::Autotest.log("  #{name || '-'}: #{plain[0, 120]}")
          @say_n = (@say_n || 0) + 1
          return if @say_n % 12 != 1
          # gelegentlich sichtbar anzeigen (nur erste Zeilen), für Screenshots
          msgwindow = pbCreateMessageWindow(nil)
          namebox = make_namebox(name, msgwindow)
          msgwindow.letterbyletter = false
          msgwindow.text = fmt(text).split("
")[0][0, 70]
          3.times { Graphics.update; msgwindow.update }
          SR::Autotest.shot("dialog")
          namebox&.dispose
          pbDisposeMessageWindow(msgwindow)
        end

        def choose(name, text, options, cancel = -1)
          opts = options.map { |o| fmt(o) }
          ret = SR::Autotest.pick(text.to_s, opts.length)
          SR::Autotest.log("  ? #{fmt(text).gsub(/<[^>]*>/, '').gsub("
", ' ')[0, 80]}  > #{opts[ret].gsub(/<[^>]*>/, '')[0, 80]}")
          @choose_n = (@choose_n || 0) + 1
          if @choose_n % 8 == 1
            win = SR::ChoiceWindow.new(opts, Graphics.width - 16)
            win.x = 8
            win.y = Graphics.height - win.height - 8
            win.z = 99999 + 2
            win.index = ret
            3.times { Graphics.update; win.update }
            SR::Autotest.shot("auswahl")
            win.dispose
          end
          return ret
        end

        alias __sr_banner_real banner
        def banner(title, big, small = nil, se = nil, color = Color.new(48, 96, 200))
          SR::Autotest.log("  [#{title}] #{big}")
          SR::Autotest.shot("banner") if title.include?("EPISODE") || title.include?("NIVEAU")
        end

        def episode_card(num)
          SR::Autotest.log("  [Episodenkarte #{num}]")
        end
      end
    end

    class << self
      def demo_end_card
        SR::Autotest.log("  [Demo-Endkarte]")
        SR::Autotest.shot("demo_ende")
      end
    end

    module Talk
      class << self
        alias __sr_run_real run
        def run(id, event = nil)
          SR::Autotest.note_talk(id)
          __sr_run_real(id, event)
        rescue Exception => e
          SR::Autotest.fail("Szene :#{id} abgestürzt: #{e.class}: #{e.message}\n  " + (e.backtrace || [])[0, 8].join("\n  "))
        end
      end
    end

    module Karte
      class << self
        alias __sr_travel_real travel
        def travel(forced_to = nil)
          to = forced_to || (SR.state.current_city == :berlin ? :koeln : :berlin)
          SR::Autotest.log("  Reise nach #{to}")
          __sr_travel_real(to)
        end
      end
    end
  end

  def pbEnterPlayerName(*args)
    return "Daniela"
  end

  class Scene_Map
    alias __sr_test_update update
    def update
      __sr_test_update
      SR::Autotest.tick
    end
  end

  # Titelbildschirm überspringen und direkt ein neues Spiel starten
  def pbCallTitle
    return SR::Autotest::StartScene.new
  end

  module SR
    module Autotest
      class StartScene
        def main
          Graphics.transition
          # vorhandenen Spielstand sichern, nach dem Test wiederherstellen
          if File.exist?(SaveData::FILE_PATH)
            File.rename(SaveData::FILE_PATH, SaveData::FILE_PATH + ".sr_test_backup")
          end
          Game.start_new
          SR::Autotest.start
        end
      end
    end
  end
end

#===============================================================================
# Test-Render-Hilfen (auch ohne Testmodus harmlos)
#===============================================================================
module SR
  class MappeScene
    def test_render(path)
      @viewport = Viewport.new(0, 0, Graphics.width, Graphics.height)
      @viewport.z = 99999
      @sprites = {}
      @sprites[:bg] = Sprite.new(@viewport)
      @sprites[:bg].bitmap = Bitmap.new(Graphics.width, Graphics.height)
      @sprites[:detail] = Sprite.new(@viewport)
      @sprites[:detail].bitmap = Bitmap.new(Graphics.width, Graphics.height)
      @sprites[:detail].z = 2
      @list = Window_CommandPokemon.new([""], LIST_W)
      @list.viewport = @viewport
      @list.y = 44
      @list.height = Graphics.height - 44
      @list.z = 3
      draw_bg
      load_tab
      3.times { Graphics.update; @list.update }
      bmp = Graphics.snap_to_bitmap
      bmp.to_file(path)
      bmp.dispose
      @list.dispose
      pbDisposeSpriteHash(@sprites)
      @viewport.dispose
    end
  end

  module Karte
    class Scene
      def test_render(path)
        @viewport = Viewport.new(0, 0, Graphics.width, Graphics.height)
        @viewport.z = 99_999
        @sp = {}
        @sp[:bg] = Sprite.new(@viewport)
        @sp[:bg].bitmap = Bitmap.new("Graphics/UI/Sprachreise/deutschland")
        @sp[:ov] = Sprite.new(@viewport)
        @sp[:ov].bitmap = Bitmap.new(Graphics.width, Graphics.height)
        @sp[:ov].z = 2
        @sp[:cursor] = Sprite.new(@viewport)
        @sp[:cursor].bitmap = Bitmap.new(16, 16)
        draw_ring(@sp[:cursor].bitmap)
        @sp[:cursor].z = 3
        @list = selectable
        @index = 1
        draw
        3.times { Graphics.update }
        bmp = Graphics.snap_to_bitmap
        bmp.to_file(path)
        bmp.dispose
        pbDisposeSpriteHash(@sp)
        @viewport.dispose
      end
    end
  end
end
