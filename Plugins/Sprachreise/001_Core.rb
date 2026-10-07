#===============================================================================
# Sprachreise – Kernsystem
# Spielstand, Sprachpunkte, Sprachlevel, Wörter, Aufgaben, Dokumente, Tagebuch.
# Alles wird in $sprachreise gespeichert (eigener SaveData-Eintrag).
#===============================================================================
module SR
  # Map-IDs (werden von tools/build_maps.py erzeugt – hier zentral gepflegt)
  MAP_HBF        = 76
  MAP_MOABIT     = 77
  MAP_WG         = 78
  MAP_BUERGERAMT = 79
  MAP_COPYSHOP   = 80
  MAP_KOELN_HBF  = 81

  PLAYER_CHARACTER_ID = 3
  DEFAULT_NAME        = "Daniela"

  # Sprachniveaus: [ab Punkten, Kürzel, Beschreibung]
  LEVELS = [
    [0,   "A2",  "Grundlagen"],
    [300,  "A2+", "Mehr Wortschatz"],
    [700,  "B1-", "Komplexere Sätze"],
    [1200, "B1",  "Selbstständige Kommunikation"]
  ]

  # Fähigkeiten, die durch Episoden freigeschaltet werden
  SKILLS = {
    :wege       => ["Wegbeschreibungen verstehen", "Du verstehst links, rechts und geradeaus – und findest Adressen."],
    :formulare  => ["Formulare verstehen", "Pflichtfelder werden in Formular-Minispielen markiert."],
    :briefe     => ["Behördenbrief verstehen", "Hinweise bei langen Briefen."],
    :telefon    => ["Telefonieren", "Komplexere Telefongespräche werden möglich."],
    :selbststaendig => ["Selbstständig kommunizieren", "Komplexere Dialogoptionen werden freigeschaltet."]
  }

  # Die 10 Episoden des Spiels (Demo: 1 und 2 spielbar)
  EPISODES = [
    [1,  "Ankommen",                  "Berlin"],
    [2,  "Das Bürgeramt",             "Berlin"],
    [3,  "Die Wohnung",               "Köln"],
    [4,  "Krankenkasse",              "Köln"],
    [5,  "Bank und Finanzen",         "Köln"],
    [6,  "Arbeitssuche",              "Düsseldorf"],
    [7,  "Ausländerbehörde",          "Köln/Düsseldorf"],
    [8,  "Deutschland entdecken",     "Frankfurt – München – Dresden"],
    [9,  "Der große Bürokratie-Test", "Hamburg"],
    [10, "B1",                        "Hamburg"]
  ]
  DEMO_LAST_EPISODE = 2

  module_function

  def state
    $sprachreise ||= SprachreiseState.new
    return $sprachreise
  end

  def player_name
    return ($player && $player.name && !$player.name.empty?) ? $player.name : o(:first)
  end

  # ---- Herkunft / Muttersprache --------------------------------------------------
  def origin
    k = state.origin
    return (k && SR::ORIGINS[k]) ? k : :es
  end

  # Feld aus dem Herkunftsprofil (z.B. o(:stadt) -> "Medellín")
  def o(field)
    return SR::ORIGINS[origin][field] || ""
  end

  # Übersetzung eines Wortes in die Muttersprache
  def tr(key)
    w = SR::WORDS[key]
    return "" if !w
    return w[:en] if origin == :en
    t = SR::WORD_TR[key]
    return (t && t[origin]) || w[:en]
  end

  def gloss?
    return state.gloss != false
  end

  # ---- Flags -------------------------------------------------------------------
  def flag?(key);  return !!state.flags[key]; end
  def flag(key);   return state.flags[key];   end
  def set(key, value = true)
    state.flags[key] = value
    refresh_map
  end
  def unset(key)
    state.flags.delete(key)
    refresh_map
  end
  def count(key)
    state.flags[key] = (state.flags[key] || 0) + 1
    return state.flags[key]
  end

  def refresh_map
    $game_map.need_refresh = true if $game_map
  end

  # ---- Sprachpunkte & Niveau -----------------------------------------------------
  def points; return state.points; end

  def level_index(pts = state.points)
    idx = 0
    LEVELS.each_with_index { |l, i| idx = i if pts >= l[0] }
    return idx
  end

  def level_name(pts = state.points); return LEVELS[level_index(pts)][1]; end

  def next_level_points
    i = level_index
    return nil if i >= LEVELS.length - 1
    return LEVELS[i + 1][0]
  end

  # Vergibt Sprachpunkte; zeigt Meldung und ggf. Niveau-Aufstieg
  def add_points(n, reason = nil, quiet = false)
    return if n <= 0
    before = level_index
    state.points += n
    SR::UI.toast(_INTL("+{1} Sprachpunkte", n) + (reason ? "  ·  #{reason}" : "")) if !quiet
    after = level_index
    SR::UI.level_up(LEVELS[after][1], LEVELS[after][2]) if after > before
  end

  # ---- Wörter --------------------------------------------------------------------
  def word?(key); return state.words.has_key?(key); end

  # Lernt ein Wort aus SR::WORDS. Zeigt "NEUES WORT GELERNT".
  def learn(key, quiet = false)
    w = SR::WORDS[key]
    raise "Unbekanntes Wort: #{key}" if !w
    return false if word?(key)
    state.words[key] = { :map => ($game_map ? $game_map.map_id : 0), :episode => state.episode }
    SR::UI.new_word(w, key) if !quiet
    add_points(w[:pts] || 3, nil, true)
    return true
  end

  def learn_all(*keys)
    keys.each { |k| learn(k) }
  end

  # ---- Aufgaben (Questlog) ---------------------------------------------------------
  # Status: nil (unbekannt), :active, :done
  def quest_start(qid, quiet = false)
    q = SR::QUESTS[qid]
    raise "Unbekannte Aufgabe: #{qid}" if !q
    return if state.quests[qid]
    state.quests[qid] = { :status => :active, :steps => {} }
    SR::UI.toast(_INTL("Neue Aufgabe: {1}", q[:title]), :quest) if !quiet
    refresh_map
  end

  def quest_active?(qid); return state.quests[qid] && state.quests[qid][:status] == :active; end
  def quest_done?(qid);   return state.quests[qid] && state.quests[qid][:status] == :done; end
  def quest_known?(qid);  return !!state.quests[qid]; end

  def step_done?(qid, step)
    return false if !state.quests[qid]
    return !!state.quests[qid][:steps][step]
  end

  def step(qid, step, quiet = false)
    quest_start(qid, true) if !state.quests[qid]
    return if state.quests[qid][:steps][step]
    state.quests[qid][:steps][step] = true
    txt = SR::QUESTS[qid][:steps].find { |s| s[0] == step }
    SR::UI.toast("■ " + (txt ? txt[1] : step.to_s), :quest) if !quiet && txt
    refresh_map
  end

  def quest_finish(qid, pts = 0)
    quest_start(qid, true) if !state.quests[qid]
    return if quest_done?(qid)
    SR::QUESTS[qid][:steps].each { |s| state.quests[qid][:steps][s[0]] = true }
    state.quests[qid][:status] = :done
    q = SR::QUESTS[qid]
    SR::UI.toast(_INTL("Aufgabe erledigt: {1}", q[:title]), :quest)
    add_points(pts, q[:side] ? "Nebenaufgabe" : "Hauptaufgabe") if pts > 0
    refresh_map
  end

  # ---- Dokumente -------------------------------------------------------------------
  def doc?(key); return state.docs.include?(key); end

  def give_doc(key, quiet = false)
    d = SR::DOCUMENTS[key]
    raise "Unbekanntes Dokument: #{key}" if !d
    return if doc?(key)
    state.docs.push(key)
    if !quiet
      pbMEPlay("Item get") rescue nil
      SR::UI.banner(_INTL("DOKUMENT ERHALTEN"), d[:name], d[:short])
    end
  end

  def take_doc(key)
    state.docs.delete(key)
  end

  # ---- Tagebuch ----------------------------------------------------------------------
  def diary(key, text)
    return if state.diary.any? { |e| e[0] == key }
    state.diary.push([key, state.episode, text])
    SR::UI.toast(_INTL("Neuer Tagebucheintrag"), :diary)
  end

  # ---- Fähigkeiten -------------------------------------------------------------------
  def skill?(key); return state.skills.include?(key); end
  def give_skill(key)
    return if skill?(key)
    state.skills.push(key)
    s = SKILLS[key]
    SR::UI.banner(_INTL("NEUE FÄHIGKEIT"), s[0], s[1])
  end

  # ---- Städte / Reisen ---------------------------------------------------------------
  def unlock_city(key, quiet = false)
    return if state.cities.include?(key)
    state.cities.push(key)
    SR::UI.toast(_INTL("Neues Reiseziel: {1}", SR::Karte::CITIES[key][:name]), :map) if !quiet
  end

  # ---- Episoden ----------------------------------------------------------------------
  def episode; return state.episode; end

  def finish_episode(num, pts_bonus = 0)
    return if state.episodes_done.include?(num)
    state.episodes_done.push(num)
    add_points(pts_bonus, _INTL("Episode {1} geschafft", num)) if pts_bonus > 0
    SR::UI.episode_complete(num)
    state.episode = num + 1
  end

  def transfer(map_id, x, y, dir = 2)
    $game_temp.player_new_map_id    = map_id
    $game_temp.player_new_x         = x
    $game_temp.player_new_y         = y
    $game_temp.player_new_direction = dir
    $game_temp.player_transferring  = true
    Graphics.freeze
    $game_temp.transition_processing = true
    $game_temp.transition_name       = ""
    $scene.miniupdate if $scene.is_a?(Scene_Map)
  end

  # ---- Lernfehler-Statistik (für Fortschrittsanzeige) ---------------------------------
  def mistake(key = nil)
    state.mistakes += 1
  end
end

#===============================================================================
# Der eigentliche Spielstand (top-level Klasse, damit SaveData ensure_class geht)
#===============================================================================
class SprachreiseState
  attr_accessor :points, :words, :flags, :quests, :docs, :diary, :skills
  attr_accessor :cities, :episode, :episodes_done, :mistakes, :current_city
  attr_accessor :origin, :gloss

  def initialize
    @points        = 0
    @words         = {}
    @flags         = {}
    @quests        = {}
    @docs          = []
    @diary         = []
    @skills        = []
    @cities        = [:berlin]
    @episode       = 1
    @episodes_done = []
    @mistakes      = 0
    @current_city  = :berlin
    @origin        = nil
    @gloss         = true
  end
end

SaveData.register(:sprachreise) do
  ensure_class :SprachreiseState
  save_value { $sprachreise }
  load_value { |value| $sprachreise = value }
  new_game_value { SprachreiseState.new }
end

#===============================================================================
# Spielfigur (Gen-4-Sprite "SR_Daniela"), wird zur Laufzeit registriert,
# damit keine PBS-Neukompilierung nötig ist.
#===============================================================================
module GameData
  class PlayerMetadata
    def self.load
      super
      self::DATA[SR::PLAYER_CHARACTER_ID] = self.new({
        :id           => SR::PLAYER_CHARACTER_ID,
        :trainer_type => :POKEMONTRAINER_Leaf,
        :walk_charset => "SR_Heldin",
        :run_charset  => "SR_Heldin",
        :home         => [SR::MAP_WG, 5, 6, 8]
      })
    end
  end

  # Kartenmetadaten (Ortsschild beim Betreten, keine Tag/Nacht-Tönung)
  class MapMetadata
    SR_MAPS = {
      SR::MAP_HBF        => ["Berlin Hauptbahnhof", true],
      SR::MAP_MOABIT     => ["Berlin-Moabit", true],
      SR::MAP_WG         => ["WG Lehrter Straße", false],
      SR::MAP_BUERGERAMT => ["Bürgeramt Moabit", true],
      SR::MAP_COPYSHOP   => ["Copyshop „Kopierkönig“", false],
      SR::MAP_KOELN_HBF  => ["Köln Hauptbahnhof", true]
    }
    def self.load
      super
      SR_MAPS.each do |id, data|
        self::DATA[id] = self.new({ :id => id, :real_name => data[0],
                                    :announce_location => data[1], :outdoor_map => false })
      end
    end
  end
end

#===============================================================================
# Event-Schnittstelle
#===============================================================================
class Interpreter
  # Aufruf aus Event-Skriptbefehlen: sr_talk(:tarek)
  def sr_talk(id)
    SR::Talk.run(id, get_self)
  end

  def sr_event(id)
    SR::Talk.run(id, get_self)
  end
end

#===============================================================================
# Dialog-/Szenen-Registry. Inhalte definieren Szenen mit SR::Talk.define.
#===============================================================================
module SR
  module Talk
    @scenes = {}
    module_function

    def define(id, &block)
      @scenes[id] = block
    end

    def exists?(id); return @scenes.has_key?(id); end
    def ids; return @scenes.keys; end

    def run(id, event = nil)
      blk = @scenes[id]
      if !blk
        pbMessage(_INTL("[Sprachreise] Szene '{1}' fehlt.", id.to_s))
        return
      end
      $game_player.straighten if $game_player
      ctx = SR::Scene.new(event)
      ctx.instance_exec(event, &blk)
      SR.refresh_map
    end
  end

  # Kontext, in dem Szenen laufen (Hilfsfunktionen für Inhalte)
  class Scene
    attr_reader :ev
    def initialize(ev); @ev = ev; end

    def me; return SR.player_name; end
    def o(field); return SR.o(field); end
    def say(name, text, opts = {});        SR::UI.say(name, text, opts); end
    def think(text);                        SR::UI.say(SR.player_name, "<i>(#{text})</i>"); end
    def narr(text);                         SR::UI.say(nil, text); end
    def ask(name, text, options, cancel = -1); return SR::UI.choose(name, text, options, cancel); end
    def confirm(name, text); return SR::UI.choose(name, text, ["Ja", "Nein"], 1) == 0; end
    def learn(*keys);                       keys.each { |k| SR.learn(k) }; end
    def points(n, reason = nil);            SR.add_points(n, reason); end
    def wrong(text = nil)
      SR.mistake
      SR::UI.toast(text || "Kein Problem – daraus lernt man!", :mistake)
    end
    def flag?(k); return SR.flag?(k); end
    def set(k, v = true); SR.set(k, v); end
    def unset(k); SR.unset(k); end
    def count(k); return SR.count(k); end
    def quest(q); SR.quest_start(q); end
    def step(q, s); SR.step(q, s); end
    def step?(q, s); return SR.step_done?(q, s); end
    def finish(q, pts = 0); SR.quest_finish(q, pts); end
    def active?(q); return SR.quest_active?(q); end
    def done?(q); return SR.quest_done?(q); end
    def known?(q); return SR.quest_known?(q); end
    def doc(k); SR.give_doc(k); end
    def doc?(k); return SR.doc?(k); end
    def diary(k, t); SR.diary(k, t); end
    def skill(k); SR.give_skill(k); end
    def skill?(k); return SR.skill?(k); end
    def level; return SR.level_index; end
    def se(name, vol = 80, pitch = 100); pbSEPlay(name, vol, pitch) rescue nil; end
    def wait(sec); pbWait(sec); end
    def face_player; @ev.turn_toward_player if @ev; end

    # Event dieser Karte per Name oder ID
    def event(name_or_id)
      return $game_player if name_or_id == :player
      return $game_map.events[name_or_id] if name_or_id.is_a?(Integer)
      $game_map.events.each_value { |e| return e if e.name == name_or_id }
      return nil
    end

    # Bewegung: dirs = "UULLD..." (U/D/L/R; u/d/l/r = nur drehen)
    def walk(who, dirs, wait_done = true, speed = nil)
      e = (who.is_a?(String) || who.is_a?(Integer) || who == :player) ? event(who) : who
      return if !e
      cmds = []
      cmds += [PBMoveRoute::CHANGE_SPEED, speed] if speed
      dirs.each_char do |c|
        case c
        when "U" then cmds.push(PBMoveRoute::UP)
        when "D" then cmds.push(PBMoveRoute::DOWN)
        when "L" then cmds.push(PBMoveRoute::LEFT)
        when "R" then cmds.push(PBMoveRoute::RIGHT)
        when "u" then cmds.push(PBMoveRoute::TURN_UP)
        when "d" then cmds.push(PBMoveRoute::TURN_DOWN)
        when "l" then cmds.push(PBMoveRoute::TURN_LEFT)
        when "r" then cmds.push(PBMoveRoute::TURN_RIGHT)
        when "." then cmds += [PBMoveRoute::WAIT, 8]
        end
      end
      pbMoveRoute(e, cmds)
      wait_moves(e) if wait_done
    end

    def wait_moves(*evs)
      loop do
        Graphics.update
        Input.update
        pbUpdateSceneMap
        break if evs.all? { |e| !e.move_route_forcing }
      end
    end

    def exclaim(e = @ev)
      pbExclaim(e) rescue nil
      pbWait(0.3)
    end

    # Sofortiger Kartenwechsel aus einer Szene heraus (mit Überblendung)
    def transfer(map_id, x, y, dir = 2)
      SR.transfer(map_id, x, y, dir)
    end

    # Minispiele
    def minigame(id, *args); return SR::Mini.send(id, *args); end
  end
end
