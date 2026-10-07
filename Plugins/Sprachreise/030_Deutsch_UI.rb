#===============================================================================
# Sprachreise – Deutsche Oberfläche
# Übersetzt die wichtigsten englischen Essentials-Texte (Menü, Speichern, Laden).
# Abgeschlossene Episoden werden als "Orden" gezählt (Ladebildschirm: Episoden).
#===============================================================================
module SR
  UI_DE = {
    "Bag" => "Tasche", "Save" => "Speichern", "Options" => "Optionen", "Quit Game" => "Spiel beenden",
    "Continue" => "Weiterspielen", "New Game" => "Neues Spiel", "Yes" => "Ja", "No" => "Nein",
    "Would you like to save the game?" => "Möchtest du das Spiel speichern?",
    "{1} saved the game." => "{1} hat das Spiel gespeichert.",
    "The game was saved." => "Das Spiel wurde gespeichert.",
    "Save failed." => "Speichern fehlgeschlagen.",
    "Are you sure you want to quit the game?" => "Möchtest du das Spiel wirklich beenden?",
    "There is a different game file that is already saved." => "Es gibt bereits einen anderen Spielstand.",
    "If you save now, the other file's adventure, including items and Pokémon, will be entirely lost." =>
      "Wenn du jetzt speicherst, geht der andere Spielstand verloren.",
    "Are you sure you want to save now and overwrite the other save file?" =>
      "Möchtest du wirklich speichern und den anderen Spielstand überschreiben?",
    "WARNING!" => "ACHTUNG!",
    "Player" => "Spielerin", "Badges" => "Episoden", "Badges:" => "Episoden:", "Time:" => "Spielzeit:",
    "Delete all saved data?" => "Alle Spielstände löschen?",
    "No save file was found." => "Kein Spielstand gefunden.",
    "Music Volume" => "Musik", "SE Volume" => "Effekte", "Text Speed" => "Textgeschwindigkeit",
    "Speech Frame" => "Textfenster", "Menu Frame" => "Menürahmen", "Screen Size" => "Bildschirmgröße",
    "Default Movement" => "Bewegung", "Walking" => "Gehen", "Running" => "Rennen",
    "Slow" => "Langsam", "Normal" => "Normal", "Fast" => "Schnell", "Inst" => "Sofort",
    "Close" => "Schließen", "Close the screen." => "Bildschirm schließen.",
    "Your name?" => "Dein Name?",
    "Enter text using the keyboard. Press\nEnter to confirm, or Esc to cancel." =>
      "Gib den Text mit der Tastatur ein.\nEnter: bestätigen, Esc: abbrechen.",
    "Enter text using the keyboard.\nPress Enter to confirm." =>
      "Gib den Text mit der Tastatur ein.\nEnter: bestätigen."
  }
end

alias __sr_intl _INTL unless defined?(__sr_intl)
def _INTL(*arg)
  if arg[0].is_a?(String) && SR::UI_DE.has_key?(arg[0])
    arg = arg.dup
    arg[0] = SR::UI_DE[arg[0]]
  end
  return __sr_intl(*arg)
end

# Episoden als Orden zählen (für Lade-/Speicherbildschirm)
module SR
  class << self
    alias __sr_finish_episode finish_episode unless method_defined?(:__sr_finish_episode)
  end

  def self.finish_episode(num, pts_bonus = 0)
    $player.badges[num - 1] = true if $player && $player.badges
    __sr_finish_episode(num, pts_bonus)
  end
end
