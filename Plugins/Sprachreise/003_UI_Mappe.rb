#===============================================================================
# Sprachreise – "Sprachmappe" (Pausemenü)
# Reiter: Fortschritt · Aufgaben · Wörterbuch · Dokumente · Tagebuch
# Links/Rechts wechselt den Reiter, Hoch/Runter wählt einen Eintrag.
#===============================================================================
module SR
  class MappeScene
    TABS = [
      [:progress, "Fortschritt"],
      [:quests,   "Aufgaben"],
      [:words,    "Wörter"],
      [:docs,     "Dokumente"],
      [:diary,    "Tagebuch"]
    ]
    BASE   = Color.new(56, 56, 64)
    SHADOW = Color.new(208, 208, 200)
    LIST_W = 210

    def initialize(start_tab = :progress)
      @tab = TABS.index { |t| t[0] == start_tab } || 0
    end

    def main
      SR::UI.clear_toasts
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
      @list.x = 0
      @list.y = 44
      @list.height = Graphics.height - 44
      @list.width = LIST_W
      @list.z = 3
      draw_bg
      load_tab
      pbFadeInAndShow(@sprites) { update_all }
      loop do
        Graphics.update
        Input.update
        update_all
        old = @list.index
        if Input.trigger?(Input::LEFT)
          pbPlayCursorSE
          @tab = (@tab - 1) % TABS.length
          load_tab
        elsif Input.trigger?(Input::RIGHT)
          pbPlayCursorSE
          @tab = (@tab + 1) % TABS.length
          load_tab
        elsif Input.trigger?(Input::BACK)
          pbPlayCloseMenuSE
          break
        elsif Input.trigger?(Input::USE) && current == :docs && @entries[@list.index]
          pbPlayDecisionSE
        end
        draw_detail if @list.index != old
      end
      pbFadeOutAndHide(@sprites) { update_all }
      @list.dispose
      pbDisposeSpriteHash(@sprites)
      @viewport.dispose
    end

    def update_all
      @list.update if @list.visible
      pbUpdateSpriteHash(@sprites)
    end

    def current; return TABS[@tab][0]; end

    def sr_text(b, x, y, w, txt, base, shadow, lh)
      drawFormattedTextEx(b, x, y, w, SR::UI.fmt(txt), base, shadow, lh)
    end

    def draw_bg
      b = @sprites[:bg].bitmap
      b.fill_rect(0, 0, b.width, b.height, Color.new(236, 232, 216))
      # Karopapier
      (0...b.width).step(16) { |x| b.fill_rect(x, 44, 1, b.height, Color.new(216, 220, 232)) }
      (44...b.height).step(16) { |y| b.fill_rect(0, y, b.width, 1, Color.new(216, 220, 232)) }
      b.fill_rect(0, 0, b.width, 40, Color.new(48, 56, 80))
      b.fill_rect(0, 40, b.width, 2, Color.new(0, 0, 0))
      b.fill_rect(0, 42, b.width, 1, Color.new(221, 0, 0))
      b.fill_rect(0, 43, b.width, 1, Color.new(255, 206, 0))
    end

    def draw_tabs
      b = @sprites[:detail].bitmap
      b.clear
      pbSetSmallFont(b)
      x = 4
      TABS.each_with_index do |t, i|
        w = b.text_size(t[1]).width + 12
        if i == @tab
          b.fill_rect(x - 2, 6, w + 4, 30, Color.new(248, 248, 240))
          pbDrawShadowText(b, x, 10, w, 24, SR::UI.plain(t[1]), Color.new(48, 56, 80), Color.new(200, 200, 200), 1)
        else
          pbDrawShadowText(b, x, 10, w, 24, SR::UI.plain(t[1]), Color.new(200, 208, 224), Color.new(24, 28, 40), 1)
        end
        x += w + 4
      end
    end

    #---------------------------------------------------------------------------
    def load_tab
      @entries = []
      case current
      when :progress
        @entries = []
      when :quests
        act  = SR.state.quests.keys.select { |q| SR.quest_active?(q) }
        done = SR.state.quests.keys.select { |q| SR.quest_done?(q) }
        main_first = proc { |a| a.sort_by { |q| [SR::QUESTS[q][:side] ? 1 : 0, SR::QUESTS[q][:episode]] } }
        main_first.call(act).each  { |q| @entries.push([q, (SR::QUESTS[q][:side] ? "· " : "» ") + SR::QUESTS[q][:title]]) }
        main_first.call(done).each { |q| @entries.push([q, "■ " + SR::QUESTS[q][:title]]) }
      when :words
        keys = SR.state.words.keys.sort_by { |k| SR::WORDS[k][:de].downcase }
        keys.each { |k| @entries.push([k, SR::WORDS[k][:de]]) }
      when :docs
        SR.state.docs.each { |k| @entries.push([k, SR::DOCUMENTS[k][:name]]) }
      when :diary
        SR.state.diary.reverse.each_with_index { |e, i| @entries.push([e, "Ep. #{e[1]}: " + diary_title(e[2])]) }
      end
      if current == :progress
        @list.visible = false
      else
        @list.visible = true
        cmds = @entries.map { |e| SR::UI.plain(e[1]) }
        cmds = ["(noch leer)"] if cmds.empty?
        @list.commands = cmds
        @list.index = 0
        @list.width = LIST_W
        @list.height = Graphics.height - 44
      end
      draw_detail
    end

    def diary_title(text)
      t = text.gsub(/<[^>]*>/, "")
      return t.length > 16 ? t[0, 15] + "..." : t
    end

    def draw_detail
      draw_tabs
      b = @sprites[:detail].bitmap
      pbSetSystemFont(b)
      x = (current == :progress) ? 16 : LIST_W + 10
      w = Graphics.width - x - 12
      y = 54
      if current == :progress
        draw_progress(b, x, y, w)
        return
      end
      e = @entries[@list.index]
      if !e
        sr_text(b, x, y, w, empty_text, BASE, SHADOW, 26)
        return
      end
      case current
      when :quests
        q = SR::QUESTS[e[0]]
        st = SR.state.quests[e[0]]
        txt = "<b>#{q[:title]}</b>\n"
        txt += "<c3=806040,E0D0C0>#{q[:side] ? 'Nebenaufgabe' : 'Hauptaufgabe'} · Episode #{q[:episode]}</c3>\n"
        txt += q[:desc] + "\n"
        q[:steps].each do |s|
          ok = st[:steps][s[0]] || st[:status] == :done
          txt += (ok ? "<c3=307030,B8E0B8>[x] " : "[  ] ") + s[1] + (ok ? "</c3>" : "") + "\n"
        end
        sr_text(b, x, y, w, txt, BASE, SHADOW, 24)
      when :words
        wd = SR::WORDS[e[0]]
        info = SR.state.words[e[0]]
        head = wd[:art] ? "#{wd[:art]} #{wd[:de]}" : wd[:de]
        txt = "<b>#{head}</b>\n"
        txt += "<c3=3050C8,C8D0F0>= #{SR.tr(e[0])}</c3>\n"
        txt += "<c3=909098,E0E0D8>Englisch: #{wd[:en]}</c3>\n" if SR.origin != :en
        txt += "<c3=806040,E0D0C0>#{wd[:pl]}</c3>\n" if wd[:pl]
        txt += "\n„#{wd[:ex]}“\n" if wd[:ex]
        txt += "\n<c3=707078,D8D8D0>#{wd[:note]}</c3>\n" if wd[:note]
        txt += "\n<c3=909098,E0E0D8>#{wd[:cat]} · Ep. #{info[:episode]}</c3>"
        sr_text(b, x, y, w, txt, BASE, SHADOW, 24)
        pbSetSmallFont(b)
      when :docs
        d = SR::DOCUMENTS[e[0]]
        txt = "<b>#{d[:name]}</b>\n" + d[:text]
        sr_text(b, x, y, w, txt, BASE, SHADOW, 24)
      when :diary
        txt = "<c3=806040,E0D0C0>Tagebuch · Episode #{e[0][1]}</c3>\n" + e[0][2]
        sr_text(b, x, y, w, txt, BASE, SHADOW, 24)
      end
    end

    def empty_text
      case current
      when :quests then return "Noch keine Aufgaben."
      when :words  then return "Noch keine Wörter gelernt. Sprich mit Leuten!"
      when :docs   then return "Noch keine Dokumente.\nDeine Unterlagen landen hier."
      when :diary  then return "Das Tagebuch ist noch leer."
      end
      return ""
    end

    def draw_progress(b, x, y, w)
      st = SR.state
      li = SR.level_index
      lvl = SR::LEVELS[li]
      sr_text(b, x, y, w, "<b>#{SR.player_name} {nachname}</b> · {stadt} · Ziel: Deutsch B1", BASE, SHADOW, 26)
      y += 32
      # Niveau-Leiste A2 → B1
      bar_x = x
      bar_w = w - 8
      seg = bar_w / SR::LEVELS.length
      SR::LEVELS.each_with_index do |l, i|
        col = (i <= li) ? Color.new(64, 168, 96) : Color.new(200, 200, 196)
        b.fill_rect(bar_x + (i * seg) + 1, y, seg - 2, 22, Color.new(40, 40, 48))
        b.fill_rect(bar_x + (i * seg) + 2, y + 1, seg - 4, 20, col)
        pbDrawShadowText(b, bar_x + (i * seg), y - 1, seg, 24, l[1],
                         (i <= li) ? Color.new(248, 248, 248) : Color.new(120, 120, 128), Color.new(0, 0, 0, 60), 1)
      end
      y += 30
      nxt = SR.next_level_points
      if nxt
        prev = lvl[0]
        frac = (st.points - prev).to_f / (nxt - prev)
        b.fill_rect(x, y, bar_w, 10, Color.new(40, 40, 48))
        b.fill_rect(x + 1, y + 1, ((bar_w - 2) * frac).to_i, 8, Color.new(240, 184, 48))
        y += 14
        sr_text(b, x, y, w, "Sprachpunkte: <b>#{st.points}</b> / #{nxt} bis #{SR::LEVELS[li + 1][1]}", BASE, SHADOW, 24)
      else
        sr_text(b, x, y, w, "Sprachpunkte: <b>#{st.points}</b> – Ziel erreicht!", BASE, SHADOW, 24)
      end
      y += 26
      sr_text(b, x, y, w, "Wörter: <b>#{st.words.length}</b>   Dokumente: <b>#{st.docs.length}</b>   " \
                                      "Erledigt: <b>#{st.quests.values.count { |q| q[:status] == :done }}</b>", BASE, SHADOW, 24)
      y += 32
      # Episoden
      pbSetSmallFont(b)
      SR::EPISODES.each_with_index do |ep, i|
        col = i < 5 ? 0 : 1
        row = i % 5
        ex = x + (col * (w / 2))
        ey = y + (row * 22)
        done = st.episodes_done.include?(ep[0])
        cur = (st.episode == ep[0])
        mark = done ? "[x]" : (cur ? " > " : "[  ]")
        name = (ep[0] > SR::DEMO_LAST_EPISODE && !done && !cur) ? "#{ep[0]}. ???  (#{ep[2]})" : "#{ep[0]}. #{ep[1]}"
        c = done ? Color.new(48, 128, 64) : (cur ? Color.new(48, 80, 176) : Color.new(130, 130, 136))
        pbDrawShadowText(b, ex, ey, w / 2, 22, SR::UI.plain("#{mark} #{name}"), c, SHADOW)
      end
      y += 5 * 22 + 6
      pbSetSmallFont(b)
      skills = st.skills.map { |k| SR::SKILLS[k][0] }
      txt = skills.empty? ? "Fähigkeiten: noch keine" : "Fähigkeiten: " + skills.join(", ")
      sr_text(b, x, y, w, txt, BASE, SHADOW, 20)
      pbSetSystemFont(b)
    end
  end

  def self.open_mappe(tab = :progress)
    pbFadeOutIn { SR::MappeScene.new(tab).main }
  end
end

#===============================================================================
# Pausemenü-Einträge
#===============================================================================
MenuHandlers.add(:pause_menu, :sr_mappe, {
  "name"      => "Sprachmappe",
  "order"     => 5,
  "effect"    => proc { |menu|
    pbPlayDecisionSE
    pbFadeOutIn do
      SR::MappeScene.new(:progress).main
      menu.pbRefresh
    end
    next false
  }
})

MenuHandlers.add(:pause_menu, :sr_karte, {
  "name"      => "Deutschlandkarte",
  "order"     => 6,
  "effect"    => proc { |menu|
    pbPlayDecisionSE
    pbFadeOutIn do
      SR::Karte::Scene.new(:view).main
      menu.pbRefresh
    end
    next false
  }
})

# Der Trainerpass passt nicht zur Geschichte – ausblenden.
MenuHandlers.add(:pause_menu, :trainer_card, {
  "name"      => proc { next $player.name },
  "order"     => 50,
  "condition" => proc { next false },
  "effect"    => proc { |menu| next false }
})

# Übersetzungshilfe: markierte Wörter mit Übersetzung in Klammern
MenuHandlers.add(:pause_menu, :sr_gloss, {
  "name"      => proc { next SR.gloss? ? "Übersetzung: an" : "Übersetzung: aus" },
  "order"     => 7,
  "effect"    => proc { |menu|
    pbPlayDecisionSE
    SR.state.gloss = !SR.gloss?
    pbMessage(SR.gloss? ? 'Übersetzungen werden jetzt angezeigt.' : 'Übersetzungen sind jetzt aus. Mutig!')
    next true
  }
})

# Die Tasche bleibt leer – im Menü ausblenden.
MenuHandlers.add(:pause_menu, :bag, {
  "name"      => "Tasche",
  "order"     => 30,
  "condition" => proc { next false },
  "effect"    => proc { |menu| next false }
})
