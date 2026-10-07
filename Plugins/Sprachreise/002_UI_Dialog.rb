#===============================================================================
# Sprachreise – Dialog-UI
# * Nachrichtenfenster mit Namensschild
# * Antwortauswahl mit mehrzeiligen Optionen (lange B1-Sätze passen hinein)
# * Hinweise ("Toasts"), die nicht blockieren
# * Banner: Neues Wort, Dokument, Fähigkeit, Niveau-Aufstieg, Episode
#===============================================================================
module SR
  module UI
    PLAYER_COLOR = "<c3=3050C8,C8D0F0>"
    NPC_COLOR    = "<c3=505058,D0D0C8>"

    module_function

    # Ersetzt Zeichen, die die Spielschrift nicht enthält
    SAFE_CHARS = { "„" => "»", "“" => "«", "‚" => "'", "‘" => "'", "–" => "-", "—" => "-",
                   "€" => "Euro", "✓" => "■", "☐" => "□", "☑" => "■", "►" => "▶", "◄" => "◀",
                   "→" => "▶", "←" => "◀", "…" => "..." }
    def safe(text)
      t = text.to_s.dup
      SAFE_CHARS.each { |k, v| t.gsub!(k, v) }
      return t
    end

    def fmt(text)
      return safe(text.to_s.gsub("{name}", SR.player_name))
    end

    #---------------------------------------------------------------------------
    # Namensschild über dem Nachrichtenfenster
    #---------------------------------------------------------------------------
    def make_namebox(name, msgwindow)
      return nil if !name || name.empty?
      color = (name == SR.player_name) ? PLAYER_COLOR : NPC_COLOR
      win = Window_AdvancedTextPokemon.new(color + fmt(name))
      win.setSkin(MessageConfig.pbGetSpeechFrame)
      win.resizeToFit(color + fmt(name), Graphics.width / 2)
      win.width = [win.width, 112].max
      win.x = 8
      win.y = msgwindow.y - win.height + 10
      win.z = msgwindow.z + 1
      win.back_opacity = MessageConfig::WINDOW_OPACITY
      return win
    end

    def say(name, text, opts = {})
      msgwindow = pbCreateMessageWindow(nil)
      namebox = make_namebox(name, msgwindow)
      pbMessageDisplay(msgwindow, fmt(text))
      namebox&.dispose
      pbDisposeMessageWindow(msgwindow)
      Input.update
    end

    #---------------------------------------------------------------------------
    # Auswahl. Gibt Index zurück; cancel = Index bei Abbruch (-1 = nicht abbrechbar)
    #---------------------------------------------------------------------------
    def choose(name, text, options, cancel = -1)
      msgwindow = pbCreateMessageWindow(nil)
      namebox = make_namebox(name, msgwindow)
      ret = pbMessageDisplay(msgwindow, fmt(text), true,
                             proc { |mw|
                               namebox.visible = false if namebox
                               next SR::UI.choice_loop(mw, options.map { |o| fmt(o) }, cancel)
                             })
      namebox&.dispose
      pbDisposeMessageWindow(msgwindow)
      Input.update
      return ret
    end

    def choice_loop(msgwindow, options, cancel)
      win = SR::ChoiceWindow.new(options, Graphics.width - 16)
      win.x = 8
      win.y = [msgwindow.y - win.height + 4, 0].max
      win.z = 99999 + 2
      win.index = 0
      ret = 0
      loop do
        Graphics.update
        Input.update
        win.update
        msgwindow&.update
        SR::UI.update_toasts
        if Input.trigger?(Input::BACK) && cancel >= 0
          pbPlayCancelSE
          ret = cancel
          break
        end
        if Input.trigger?(Input::USE)
          pbPlayDecisionSE
          ret = win.index
          break
        end
        pbUpdateSceneMap
      end
      win.dispose
      Input.update
      return ret
    end

    #---------------------------------------------------------------------------
    # Nicht blockierende Hinweise oben rechts
    #---------------------------------------------------------------------------
    TOAST_TIME = 2.6
    @toasts = []

    def toast(text, kind = :points)
      se = { :points => "Voltorb Flip point", :quest => "Voltorb Flip mark",
             :diary => "GUI naming confirm", :map => "GUI naming confirm",
             :mistake => "Player bump" }[kind]
      pbSEPlay(se, 70) rescue nil if se
      vp = Viewport.new(0, 0, Graphics.width, Graphics.height)
      vp.z = 100_005
      color = { :points => "<c3=207020,B0E0B0>", :quest => "<c3=2050A0,B8C8F0>",
                :diary => "<c3=805020,F0D8B0>", :map => "<c3=2050A0,B8C8F0>",
                :mistake => "<c3=A04020,F0C8B0>" }[kind] || ""
      text = fmt(text)
      # höchstens 4 Hinweise gleichzeitig
      while @toasts.length >= 4
        old = @toasts.shift
        old[:win].dispose
        old[:vp].dispose
      end
      win = Window_AdvancedTextPokemon.new(color + text)
      win.viewport = vp
      win.setSkin(MessageConfig.pbGetSystemFrame)
      win.resizeToFit(color + text, Graphics.width - 32)
      win.x = Graphics.width - win.width - 4
      y = 4
      @toasts.each { |t| y = [y, t[:win].y + t[:win].height - 4].max if !t[:win].disposed? }
      win.y = y
      win.opacity = 0
      win.contents_opacity = 0
      @toasts.push({ :win => win, :vp => vp, :start => System.uptime })
    end

    def update_toasts
      return if @toasts.empty?
      now = System.uptime
      @toasts.each do |t|
        age = now - t[:start]
        a = if age < 0.2 then age / 0.2
            elsif age > TOAST_TIME - 0.4 then [(TOAST_TIME - age) / 0.4, 0].max
            else 1.0
            end
        t[:win].opacity = (a * 255).to_i
        t[:win].contents_opacity = (a * 255).to_i
      end
      @toasts.reject! do |t|
        if now - t[:start] >= TOAST_TIME
          t[:win].dispose
          t[:vp].dispose
          true
        else
          false
        end
      end
    end

    def clear_toasts
      @toasts.each { |t| t[:win].dispose; t[:vp].dispose }
      @toasts.clear
    end

    #---------------------------------------------------------------------------
    # Großes Banner (blockiert, bis Taste gedrückt)
    #---------------------------------------------------------------------------
    def banner(title, big, small = nil, se = "Pkmn move learnt", color = Color.new(48, 96, 200))
      pbSEPlay(se, 80) rescue nil if se
      vp = Viewport.new(0, 0, Graphics.width, Graphics.height)
      vp.z = 100_010
      bg = Sprite.new(vp)
      bg.bitmap = Bitmap.new(Graphics.width, Graphics.height)
      bg.bitmap.fill_rect(0, 0, Graphics.width, Graphics.height, Color.new(0, 0, 0, 110))
      h = small ? 168 : 120
      y0 = (Graphics.height - h) / 2 - 20
      card = Sprite.new(vp)
      card.bitmap = Bitmap.new(Graphics.width - 48, h)
      b = card.bitmap
      b.fill_rect(0, 0, b.width, b.height, Color.new(40, 40, 48))
      b.fill_rect(3, 3, b.width - 6, b.height - 6, Color.new(248, 248, 240))
      b.fill_rect(3, 3, b.width - 6, 34, color)
      pbSetSystemFont(b)
      pbDrawShadowText(b, 0, 7, b.width, 28, fmt(title), Color.new(248, 248, 248), Color.new(0, 0, 0, 90), 2)
      b.font.size = 34 rescue nil
      pbDrawShadowText(b, 0, 46, b.width, 44, fmt(big), Color.new(40, 40, 56), Color.new(200, 200, 208), 2)
      pbSetSystemFont(b)
      if small
        drawTextEx(b, 18, 94, b.width - 36, 2, fmt(small), Color.new(80, 80, 96), Color.new(208, 208, 216))
      end
      card.x = 24
      card.y = y0
      card.opacity = 0
      start = System.uptime
      loop do
        Graphics.update
        Input.update
        pbUpdateSceneMap
        update_toasts
        t = System.uptime - start
        card.opacity = [t / 0.15, 1].min * 255
        card.y = y0 + (1 - [t / 0.15, 1].min) * 16
        break if t > 0.4 && (Input.trigger?(Input::USE) || Input.trigger?(Input::BACK))
        break if t > 6
      end
      card.bitmap.dispose
      card.dispose
      bg.bitmap.dispose
      bg.dispose
      vp.dispose
      Input.update
    end

    def new_word(w)
      word = w[:art] ? "#{w[:art]} #{w[:de]}" : w[:de]
      banner(_INTL("NEUES WORT GELERNT"), word, "= #{w[:en]}" + (w[:ex] ? "    „#{w[:ex]}“" : ""),
             "Pkmn move learnt", Color.new(40, 120, 72))
    end

    def level_up(code, desc)
      pbMEPlay("Evolution success") rescue nil
      banner(_INTL("SPRACHNIVEAU GESTIEGEN!"), "Deutsch #{code}", desc, nil, Color.new(200, 120, 32))
    end

    def episode_complete(num)
      ep = SR::EPISODES[num - 1]
      pbMEPlay("Badge get") rescue nil
      banner(_INTL("EPISODE {1} GESCHAFFT", num), ep[1],
             _INTL("Sprachniveau: {1}  ·  {2} Sprachpunkte  ·  {3} Wörter",
                   SR.level_name, SR.points, SR.state.words.length), nil, Color.new(168, 48, 48))
    end

    # Titelkarte zu Beginn einer Episode
    def episode_card(num)
      ep = SR::EPISODES[num - 1]
      vp = Viewport.new(0, 0, Graphics.width, Graphics.height)
      vp.z = 100_020
      s = Sprite.new(vp)
      s.bitmap = Bitmap.new(Graphics.width, Graphics.height)
      b = s.bitmap
      b.fill_rect(0, 0, b.width, b.height, Color.new(24, 28, 40))
      b.fill_rect(0, 150, b.width, 4, Color.new(0, 0, 0))
      b.fill_rect(0, 154, b.width, 4, Color.new(221, 0, 0))
      b.fill_rect(0, 158, b.width, 4, Color.new(255, 206, 0))
      pbSetSystemFont(b)
      pbDrawShadowText(b, 0, 100, b.width, 32, _INTL("EPISODE {1} VON 10", num), Color.new(200, 200, 216), Color.new(0, 0, 0), 2)
      b.font.size = 40 rescue nil
      pbDrawShadowText(b, 0, 176, b.width, 48, fmt(ep[1]), Color.new(248, 248, 248), Color.new(0, 0, 0), 2)
      pbSetSystemFont(b)
      pbDrawShadowText(b, 0, 232, b.width, 32, fmt(ep[2]), Color.new(255, 206, 80), Color.new(0, 0, 0), 2)
      s.opacity = 0
      start = System.uptime
      loop do
        Graphics.update
        Input.update
        t = System.uptime - start
        s.opacity = if t < 0.5 then t / 0.5 * 255
                    elsif t > 2.6 then [(3.1 - t) / 0.5, 0].max * 255
                    else 255
                    end
        break if t >= 3.1
      end
      b.dispose
      s.dispose
      vp.dispose
    end
  end

  #=============================================================================
  # Auswahlfenster mit Zeilenumbruch
  #=============================================================================
  class ChoiceWindow < Window_DrawableCommand
    LINE_H = 28

    def initialize(options, width)
      @options = options
      @lines = []
      tmp = Bitmap.new(1, 1)
      pbSetSystemFont(tmp)
      maxw = width - 32 - 16 - 16
      @options.each { |o| @lines.push(SR::ChoiceWindow.wrap(tmp, o, maxw)) }
      tmp.dispose
      @maxlines = [@lines.map { |l| l.length }.max || 1, 1].max
      super(0, 0, width, 64)
      self.rowHeight = @maxlines * LINE_H + 4
      self.height = [(@options.length * self.rowHeight) + self.borderY, Graphics.height - 100].min
      self.setSkin(MessageConfig.pbGetSystemFrame)
      refresh
    end

    def self.wrap(bitmap, text, maxw)
      words = text.split(" ")
      lines = []
      cur = ""
      words.each do |w|
        t = cur.empty? ? w : cur + " " + w
        if bitmap.text_size(t).width > maxw && !cur.empty?
          lines.push(cur)
          cur = w
        else
          cur = t
        end
      end
      lines.push(cur) if !cur.empty?
      return lines
    end

    def itemCount
      return @options ? @options.length : 0
    end

    def drawItem(index, _count, rect)
      pbSetSystemFont(self.contents)
      rect = drawCursor(index, rect)
      lines = @lines[index] || []
      lines.each_with_index do |l, i|
        pbDrawShadowText(self.contents, rect.x, rect.y + 2 + (i * LINE_H), rect.width, LINE_H, l,
                         self.baseColor, self.shadowColor)
      end
    end
  end
end

#===============================================================================
# Toasts auch während normaler Kartenaktualisierung weiterführen
#===============================================================================
class Scene_Map
  alias __sr_update update unless method_defined?(:__sr_update)
  def update
    __sr_update
    SR::UI.update_toasts
  end

  alias __sr_miniupdate miniupdate unless method_defined?(:__sr_miniupdate)
  def miniupdate
    __sr_miniupdate
    SR::UI.update_toasts
  end
end
