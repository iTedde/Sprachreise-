#===============================================================================
# Sprachreise – Deutschlandkarte & Reisesystem
# Karte: Graphics/UI/Sprachreise/deutschland.png (erzeugt aus echten Koordinaten)
# :view   -> nur ansehen (Pausemenü)
# :travel -> Ziel wählen (Reisezentrum), gibt City-Key zurück
#===============================================================================
module SR
  module Karte
    # Pixelpositionen auf deutschland.png
    CITIES = {
      :berlin      => { :name => "Berlin",     :pos => [227, 132], :map => [SR::MAP_HBF, 16, 17, 2],
                        :info => "Hauptstadt. Hier beginnt die Reise: Ankommen, WG, Bürgeramt.", :ep => [1, 2] },
      :koeln       => { :name => "Köln",       :pos => [57, 199],  :map => [SR::MAP_KOELN_HBF, 12, 17, 8],
                        :info => "Dom, Rhein, Kölsch. Wohnung, Krankenkasse, Bank.", :ep => [3, 4, 5] },
      :duesseldorf => { :name => "Düsseldorf", :pos => [52, 186],  :map => nil,
                        :info => "Nur 25 Minuten von Köln. Ein Vorstellungsgespräch wartet.", :ep => [6, 7] },
      :frankfurt   => { :name => "Frankfurt",  :pos => [102, 234], :map => nil,
                        :info => "Umsteigen am größten Bahnknoten Deutschlands.", :ep => [8] },
      :muenchen    => { :name => "München",    :pos => [179, 318], :map => nil,
                        :info => "Eine Freundin, ein Biergarten - und viel Verspätung.", :ep => [8] },
      :dresden     => { :name => "Dresden",    :pos => [236, 194], :map => nil,
                        :info => "Elbe, Barock und eine ruhigere Atmosphäre.", :ep => [8] },
      :hamburg     => { :name => "Hamburg",    :pos => [137, 88],  :map => nil,
                        :info => "Hafen, Speicherstadt - und der große Bürokratie-Test.", :ep => [9, 10] }
    }
    ROUTE = [:berlin, :koeln, :duesseldorf, :frankfurt, :muenchen, :dresden, :hamburg]
    # Reisedauer und Zug für jede Verbindung (für die Reiseanimation)
    TRAINS = {
      [:berlin, :koeln] => ["ICE 949", "ca. 4 Std. 20 Min.", "über Hannover, Bielefeld, Dortmund"],
      [:koeln, :berlin] => ["ICE 940", "ca. 4 Std. 20 Min.", "über Dortmund, Bielefeld, Hannover"]
    }

    class Scene
      def initialize(mode = :view)
        @mode = mode
      end

      def main
        SR::UI.clear_toasts
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
        @sp[:cursor].ox = 8
        @sp[:cursor].oy = 8
        @list = selectable
        cur = SR.state.current_city
        @index = [@list.index(cur) || 0, 0].max
        draw
        ret = nil
        pbFadeInAndShow(@sp)
        loop do
          Graphics.update
          Input.update
          t = System.uptime
          @sp[:cursor].opacity = 160 + (Math.sin(t * 6) * 90).to_i
          if Input.trigger?(Input::DOWN) || Input.trigger?(Input::RIGHT)
            pbPlayCursorSE
            @index = (@index + 1) % @list.length
            draw
          elsif Input.trigger?(Input::UP) || Input.trigger?(Input::LEFT)
            pbPlayCursorSE
            @index = (@index - 1) % @list.length
            draw
          elsif Input.trigger?(Input::BACK)
            pbPlayCloseMenuSE
            break
          elsif Input.trigger?(Input::USE) && @mode == :travel
            key = @list[@index]
            if !SR.state.cities.include?(key)
              pbPlayBuzzerSE
            elsif key == SR.state.current_city
              pbPlayBuzzerSE
            else
              pbPlayDecisionSE
              ret = key
              break
            end
          end
        end
        pbFadeOutAndHide(@sp)
        pbDisposeSpriteHash(@sp)
        @viewport.dispose
        return ret
      end

      def selectable
        return ROUTE.dup
      end

      def draw_ring(b)
        b.clear
        [[0, 6, 16, 4], [6, 0, 4, 16]].each { |r| b.fill_rect(*r, Color.new(255, 255, 255)) }
        b.fill_rect(5, 5, 6, 6, Color.new(220, 30, 30))
      end

      def draw
        b = @sp[:ov].bitmap
        b.clear
        pbSetSmallFont(b)
        # Route
        ROUTE.each_cons(2) do |a, c|
          pa = CITIES[a][:pos]
          pc = CITIES[c][:pos]
          known = SR.state.cities.include?(a) && SR.state.cities.include?(c)
          dotted_line(b, pa, pc, known ? Color.new(200, 32, 32) : Color.new(80, 90, 80, 160))
        end
        # Städte
        CITIES.each do |key, c|
          x, y = c[:pos]
          unlocked = SR.state.cities.include?(key)
          col = unlocked ? Color.new(220, 30, 30) : Color.new(110, 110, 110)
          b.fill_rect(x - 4, y - 4, 9, 9, Color.new(30, 30, 30))
          b.fill_rect(x - 3, y - 3, 7, 7, unlocked ? Color.new(255, 255, 255) : Color.new(180, 180, 176))
          b.fill_rect(x - 2, y - 2, 5, 5, col)
          if key == SR.state.current_city
            b.fill_rect(x - 6, y - 6, 13, 2, Color.new(255, 206, 0))
            b.fill_rect(x - 6, y + 5, 13, 2, Color.new(255, 206, 0))
          end
          name = unlocked ? c[:name] : "?"
          lx = (key == :duesseldorf) ? x - 4 - b.text_size(name).width - 4 : x + 7
          ly = (key == :duesseldorf) ? y - 16 : y - 10
          pbDrawShadowText(b, lx, ly, 120, 20, SR::UI.plain(name), Color.new(24, 24, 32), Color.new(240, 240, 232))
        end
        # Cursor
        sel = @list[@index]
        @sp[:cursor].x = CITIES[sel][:pos][0]
        @sp[:cursor].y = CITIES[sel][:pos][1]
        # Infotafel rechts
        x0 = 318
        w = Graphics.width - x0 - 10
        pbSetSystemFont(b)
        pbDrawShadowText(b, x0, 10, w, 28, "DEUTSCHLAND", Color.new(248, 248, 248), Color.new(0, 0, 0))
        pbSetSmallFont(b)
        title = (@mode == :travel) ? "Wohin möchtest du fahren?" : "Deine Reiseroute"
        pbDrawShadowText(b, x0, 38, w, 20, SR::UI.plain(title), Color.new(255, 206, 80), Color.new(0, 0, 0))
        c = CITIES[sel]
        unlocked = SR.state.cities.include?(sel)
        pbSetSystemFont(b)
        pbDrawShadowText(b, x0, 72, w, 28, SR::UI.plain(unlocked ? c[:name] : "???"), Color.new(248, 248, 248), Color.new(0, 0, 0))
        pbSetSmallFont(b)
        eps = c[:ep].map { |e| "Ep. #{e}" }.join(", ")
        info = unlocked ? c[:info] : "Noch nicht freigeschaltet."
        drawFormattedTextEx(b, x0, 100, w, SR::UI.fmt("<c3=C8C8D8,202838>#{eps}</c3>\n#{info}"),
                            Color.new(220, 220, 232), Color.new(20, 24, 36), 22)
        if sel == SR.state.current_city
          pbDrawShadowText(b, x0, 250, w, 20, "Du bist hier.", Color.new(255, 206, 80), Color.new(0, 0, 0))
        end
        help = (@mode == :travel) ? "C: Fahren   X: Zurück" : "X: Zurück"
        pbDrawShadowText(b, x0, Graphics.height - 28, w, 20, help, Color.new(160, 168, 190), Color.new(0, 0, 0))
        pbDrawShadowText(b, x0, Graphics.height - 52, w, 20,
                         SR::UI.plain("Deutsch #{SR.level_name} · #{SR.points} SP"), Color.new(160, 220, 160), Color.new(0, 0, 0))
      end

      def dotted_line(b, p1, p2, col)
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        steps = [dx.abs, dy.abs].max
        return if steps == 0
        (0..steps).step(3) do |i|
          x = p1[0] + (dx * i / steps)
          y = p1[1] + (dy * i / steps)
          b.fill_rect(x - 1, y - 1, 2, 2, col)
        end
      end
    end

    module_function

    # Reiseanimation auf der Karte: Zug fährt von A nach B
    def travel_animation(from, to)
      viewport = Viewport.new(0, 0, Graphics.width, Graphics.height)
      viewport.z = 100_000
      bg = Sprite.new(viewport)
      bg.bitmap = Bitmap.new("Graphics/UI/Sprachreise/deutschland")
      ov = Sprite.new(viewport)
      ov.bitmap = Bitmap.new(Graphics.width, Graphics.height)
      train = Sprite.new(viewport)
      train.bitmap = Bitmap.new(22, 10)
      tb = train.bitmap
      tb.fill_rect(0, 1, 22, 8, Color.new(30, 30, 40))
      tb.fill_rect(1, 2, 20, 6, Color.new(245, 245, 250))
      tb.fill_rect(1, 6, 20, 1, Color.new(220, 20, 20))
      [3, 8, 13].each { |x| tb.fill_rect(x, 3, 3, 2, Color.new(40, 60, 110)) }
      train.ox = 11
      train.oy = 5
      info = TRAINS[[from, to]] || ["ICE", "", ""]
      b = ov.bitmap
      x0 = 318
      w = Graphics.width - x0 - 10
      pbSetSystemFont(b)
      pbDrawShadowText(b, x0, 10, w, 28, info[0], Color.new(248, 248, 248), Color.new(0, 0, 0))
      pbSetSmallFont(b)
      drawFormattedTextEx(b, x0, 44, w,
                          SR::UI.fmt("#{CITIES[from][:name]} Hbf\n▼\n#{CITIES[to][:name]} Hbf\n\n#{info[1]}\n#{info[2]}"),
                          Color.new(220, 220, 232), Color.new(20, 24, 36), 22)
      p1 = CITIES[from][:pos]
      p2 = CITIES[to][:pos]
      pbBGMPlay("Bicycle") rescue nil
      start = System.uptime
      dur = 3.2
      loop do
        Graphics.update
        Input.update
        t = [(System.uptime - start) / dur, 1.0].min
        e = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2)**2) / 2
        train.x = p1[0] + ((p2[0] - p1[0]) * e)
        train.y = p1[1] + ((p2[1] - p1[1]) * e)
        b.fill_rect(train.x.to_i - 1, train.y.to_i - 1, 2, 2, Color.new(200, 32, 32)) if (System.uptime * 10).to_i.even?
        break if t >= 1.0 && System.uptime - start > dur + 0.6
      end
      [bg, ov, train].each { |s| s.bitmap.dispose; s.dispose }
      viewport.dispose
    end

    # Komplette Reise: Karte wählen -> Animation -> Ankunft
    def travel(forced_to = nil)
      to = forced_to
      if !to
        pbFadeOutIn { to = Scene.new(:travel).main }
      end
      return false if !to
      from = SR.state.current_city
      dest = CITIES[to][:map]
      if !dest
        SR::UI.say(nil, "Diese Stadt ist in der Demo noch nicht spielbar.")
        return false
      end
      pbFadeOutIn(99_999) { travel_animation(from, to) }
      SR.state.current_city = to
      SR.transfer(dest[0], dest[1], dest[2], dest[3])
      return true
    end
  end
end
