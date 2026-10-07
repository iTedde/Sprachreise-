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

    PLACEHOLDERS = {
      "{nachname}" => :last, "{stadt}" => :city, "{land}" => :land, "{aus_land}" => :aus,
      "{in_land}" => :inn, "{staat}" => :staat, "{sprache}" => :label,
      "{pass}" => :pass_head, "{uni}" => :uni, "{buch}" => :buch, "{heimweh}" => :heimweh
    }
    GLOSS_COLOR = "<c3=2858B8,C8D8F0>"
    TRANS_COLOR = "<c3=808090,E0E0D8>"

    def fmt(text)
      t = text.to_s.gsub("{name}", SR.player_name)
      PLACEHOLDERS.each { |k, f| t = t.gsub(k, SR.o(f)) }
      t = t.gsub("{mail}", "#{SR.player_name.downcase}@mail.com")
      # [[wort]] oder [[wort|Anzeige]] -> Wort hervorheben, Übersetzung in Klammern
      t = t.gsub(/\[\[(\w+)(?:\|([^\]]+))?\]\]/) do
        key = $1.to_sym
        shown = $2 || (SR::WORDS[key] ? SR::WORDS[key][:de] : $1)
        if SR::WORDS[key] && SR.gloss?
          "#{GLOSS_COLOR}#{shown}</c3> #{TRANS_COLOR}(#{SR.tr(key)})</c3>"
        else
          "#{GLOSS_COLOR}#{shown}</c3>"
        end
      end
      return fallback_font(safe(t))
    end

    # Text ohne Formatierungs-Tags (für Logs, Listen)
    def plain(text)
      return fmt(text).gsub(/<[^>]*>/, "")
    end

    # Zeichen, die »Power Green« nicht hat (Arabisch, Kyrillisch, ş, ğ, ı ...),
    # automatisch in der Ersatzschrift »SR Unifont« darstellen.
    RUN_GLUE = /[\s\.,!?:;\-()«»"'\/]/
    def fallback_font(text)
      return text if text.ascii_only?
      text.split(/(<[^>]*>)/).map do |seg|
        next seg if seg.start_with?("<") && seg.end_with?(">")
        out = +""
        run = +""
        pending = +""
        seg.each_char do |c|
          if SR::FONT_OK[c]
            if run.empty?
              out << c
            elsif c =~ RUN_GLUE
              pending << c
            else
              out << wrap_run(run) << pending << c
              run = +""
              pending = +""
            end
          else
            run << pending << c
            pending = +""
          end
        end
        out << wrap_run(run) << pending if !run.empty?
        out
      end.join
    end

    def wrap_run(run)
      return "<fn=SR Unifont>#{run}</fn>"
    end

    #---------------------------------------------------------------------------
    # Zeichenhilfen
    #---------------------------------------------------------------------------
    NAVY  = Color.new(44, 52, 80)
    WHITE = Color.new(248, 248, 248)

    # Abgerundetes Rechteck (Pixel-Optik)
    def rrect(b, x, y, w, h, col, r = 4)
      r = [r, h / 2, w / 2].min
      (0...h).each do |j|
        inset = 0
        if j < r
          inset = r - Math.sqrt((r * r) - ((r - j - 0.5)**2)).round
        elsif j >= h - r
          jj = h - 1 - j
          inset = r - Math.sqrt((r * r) - ((r - jj - 0.5)**2)).round
        end
        b.fill_rect(x + inset, y + j, w - (2 * inset), 1, col)
      end
    end

    def text_width(b, text)
      return b.text_size(text.gsub(/<[^>]*>/, "")).width
    end

    #---------------------------------------------------------------------------
    # Namensschild (Reiter oben links am Textfenster)
    #---------------------------------------------------------------------------
    class NameTag
      def initialize(s, vp); @s = s; @vp = vp; end
      def visible=(v); @s.visible = v; end
      def dispose
        return if @s.disposed?
        @s.bitmap.dispose
        @s.dispose
        @vp.dispose
      end
    end

    def make_namebox(name, msgwindow)
      return nil if !name || name.empty?
      label = plain(name)
      vp = Viewport.new(0, 0, Graphics.width, Graphics.height)
      vp.z = 100_001
      s = Sprite.new(vp)
      tmp = Bitmap.new(1, 1)
      pbSetSmallFont(tmp)
      w = [text_width(tmp, label) + 24, 64].max
      tmp.dispose
      h = 26
      s.bitmap = Bitmap.new(w, h)
      b = s.bitmap
      col = (name == SR.player_name) ? Color.new(40, 104, 176) : NAVY
      rrect(b, 0, 0, w, h, Color.new(0, 0, 0, 70), 7)
      rrect(b, 0, 0, w, h - 2, col, 7)
      pbSetSmallFont(b)
      drawFormattedTextEx(b, 12, 2, w - 16, fmt(name), WHITE, Color.new(0, 0, 0, 90), 22)
      s.x = msgwindow.x + 14
      s.y = msgwindow.y - h + 8
      return NameTag.new(s, vp)
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
      win.y = [msgwindow.y - win.height + 2, 0].max
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
    # Hinweise oben rechts: dunkle Plakette mit farbigem Streifen, gleitet herein
    #---------------------------------------------------------------------------
    TOAST_TIME = 2.8
    @fast = false
    def fast=(v); @fast = v; end
    TOAST_COLORS = {
      :points => Color.new(88, 184, 104), :quest => Color.new(96, 152, 232),
      :diary => Color.new(232, 168, 64), :map => Color.new(96, 152, 232),
      :mistake => Color.new(232, 112, 72)
    }
    @toasts = []

    def toast(text, kind = :points)
      se = { :points => "Voltorb Flip point", :quest => "Voltorb Flip mark",
             :diary => "GUI naming confirm", :map => "GUI naming confirm",
             :mistake => "Player bump" }[kind]
      pbSEPlay(se, 70) rescue nil if se
      while @toasts.length >= 4
        old = @toasts.shift
        old[:s].bitmap.dispose
        old[:s].dispose
        old[:vp].dispose
      end
      vp = Viewport.new(0, 0, Graphics.width, Graphics.height)
      vp.z = 99_990   # hinter Text- und Auswahlfenstern
      s = Sprite.new(vp)
      tmp = Bitmap.new(1, 1)
      pbSetSmallFont(tmp)
      txt = fmt(text)
      w = [[text_width(tmp, txt) + 30, 120].max, Graphics.width - 16].min
      tmp.dispose
      h = 26
      s.bitmap = Bitmap.new(w, h)
      b = s.bitmap
      rrect(b, 0, 0, w, h, Color.new(24, 28, 44, 235), 6)
      b.fill_rect(5, 5, 4, h - 10, TOAST_COLORS[kind] || TOAST_COLORS[:quest])
      pbSetSmallFont(b)
      drawFormattedTextEx(b, 16, 2, w - 20, txt, WHITE, Color.new(0, 0, 0, 120), 22)
      y = 52   # unter dem Ortsschild
      @toasts.each { |t| y = [y, t[:y] + h + 4].max }
      s.y = y
      s.x = Graphics.width
      @toasts.push({ :s => s, :vp => vp, :start => System.uptime, :y => y, :w => w })
    end

    def update_toasts
      return if @toasts.empty?
      now = System.uptime
      @toasts.each do |t|
        age = now - t[:start]
        target = Graphics.width - t[:w] - 6
        slide = [age / 0.18, 1.0].min
        t[:s].x = Graphics.width + ((target - Graphics.width) * (1 - ((1 - slide)**3)))
        t[:s].opacity = (age > TOAST_TIME - 0.4) ? [(TOAST_TIME - age) / 0.4, 0].max * 255 : 255
      end
      @toasts.reject! do |t|
        next false if now - t[:start] < TOAST_TIME
        t[:s].bitmap.dispose
        t[:s].dispose
        t[:vp].dispose
        true
      end
    end

    def clear_toasts
      @toasts.each { |t| t[:s].bitmap.dispose; t[:s].dispose; t[:vp].dispose }
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
      bg.bitmap.fill_rect(0, 0, Graphics.width, Graphics.height, Color.new(10, 12, 24, 120))
      w = Graphics.width - 64
      h = small ? 172 : 120
      y0 = ((Graphics.height - h) / 2) - 16
      card = Sprite.new(vp)
      card.bitmap = Bitmap.new(w, h + 4)
      b = card.bitmap
      rrect(b, 0, 4, w, h, Color.new(0, 0, 0, 80), 10)
      rrect(b, 0, 0, w, h, NAVY, 10)
      rrect(b, 3, 3, w - 6, h - 6, Color.new(252, 251, 246), 8)
      rrect(b, 3, 3, w - 6, 32, color, 8)
      b.fill_rect(3, 24, w - 6, 11, color)
      pbSetSmallFont(b)
      pbDrawShadowText(b, 0, 9, w, 24, plain(title), WHITE, Color.new(0, 0, 0, 90), 1)
      pbSetSystemFont(b)
      b.font.size = 34 rescue nil
      pbDrawShadowText(b, 0, 44, w, 44, plain(big), Color.new(36, 40, 56), Color.new(200, 200, 208), 1)
      pbSetSystemFont(b)
      if small
        b.fill_rect(24, 92, w - 48, 1, Color.new(220, 216, 204))
        drawFormattedTextEx(b, 22, 98, w - 44, fmt(small), Color.new(70, 74, 92), Color.new(214, 214, 220), 28)
      end
      card.x = 32
      card.y = y0
      card.opacity = 0
      start = System.uptime
      loop do
        Graphics.update
        Input.update
        pbUpdateSceneMap
        update_toasts
        t = System.uptime - start
        k = [t / 0.18, 1].min
        card.opacity = k * 255
        card.y = y0 + ((1 - k) * 18)
        break if t > 0.4 && (Input.trigger?(Input::USE) || Input.trigger?(Input::BACK))
        break if t > 6
        if @fast && t > 0.3
          SR::Autotest.shot("banner") if defined?(SR::Autotest) && SR::Autotest.active?
          break
        end
      end
      card.bitmap.dispose
      card.dispose
      bg.bitmap.dispose
      bg.dispose
      vp.dispose
      Input.update
    end

    def new_word(w, key = nil)
      word = w[:art] ? "#{w[:art]} #{w[:de]}" : w[:de]
      trans = key ? SR.tr(key) : w[:en]
      small = "<c3=2858B8,C8D8F0>= #{trans}</c3>" + (w[:ex] ? "\n„#{w[:ex]}“" : "")
      banner(_INTL("NEUES WORT GELERNT"), word, small, "Pkmn move learnt", Color.new(40, 132, 80))
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
      pbDrawShadowText(b, 0, 100, b.width, 32, _INTL("EPISODE {1} VON 10", num), Color.new(200, 200, 216), Color.new(0, 0, 0), 1)
      b.font.size = 40 rescue nil
      pbDrawShadowText(b, 0, 176, b.width, 48, plain(ep[1]), Color.new(248, 248, 248), Color.new(0, 0, 0), 1)
      pbSetSystemFont(b)
      pbDrawShadowText(b, 0, 232, b.width, 32, plain(ep[2]), Color.new(255, 206, 80), Color.new(0, 0, 0), 1)
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
        if bitmap.text_size(t.gsub(/<[^>]*>/, "")).width > maxw && !cur.empty?
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
      # ausgewählte Zeile leicht hinterlegen
      if index == self.index
        SR::UI.rrect(self.contents, rect.x, rect.y + 1, rect.width - 2, rect.height - 2, Color.new(214, 226, 246), 5)
      end
      rect = drawCursor(index, rect)
      lines = @lines[index] || []
      lines.each_with_index do |l, i|
        drawFormattedTextEx(self.contents, rect.x, rect.y + 2 + (i * LINE_H), rect.width, l,
                            self.baseColor, self.shadowColor, LINE_H)
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
