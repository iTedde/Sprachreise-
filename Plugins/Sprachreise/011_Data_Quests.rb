#===============================================================================
# Sprachreise – Aufgaben (Questlog). :steps = [[key, Text], ...]
#===============================================================================
module SR
  QUESTS = {
    # --- Episode 1 ---------------------------------------------------------------------
    :q_ankommen => {
      :title => "Wo muss ich hin?", :episode => 1,
      :desc  => "Ich bin in Berlin! Mein WG-Zimmer ist in der Lehrter Straße 12, bei Jonas Becker. Aber wie komme ich dahin?",
      :steps => [[:info, "Am Hauptbahnhof nach dem Weg fragen"],
                 [:strasse, "Die Lehrter Straße finden"],
                 [:hausnr, "Das Haus Nummer 12 finden"],
                 [:klingel, "Bei Jonas klingeln"],
                 [:wg, "In der WG ankommen"]] },
    :q_automat => {
      :title => "Der Fahrkartenautomat", :episode => 1, :side => true,
      :desc  => "Eine ältere Dame am Europaplatz hat Probleme mit dem Fahrkartenautomaten.",
      :steps => [[:hilfe, "Frau Kowalski helfen"], [:entwerten, "Lernen, was »entwerten« heißt"]] },
    :q_baecker => {
      :title => "Frühstück am Bahnhof", :episode => 1, :side => true,
      :desc  => "Ich habe Hunger. In der Bahnhofshalle gibt es eine Bäckerei.",
      :steps => [[:bestellen, "Etwas bestellen"], [:bezahlen, "Richtig bezahlen"]] },
    :q_pfand => {
      :title => "Pfand zurück!", :episode => 1, :side => true,
      :desc  => "Am Späti habe ich Wasser gekauft. Auf die Flasche gibt es Pfand. Was heißt das?",
      :steps => [[:kaufen, "Am Späti etwas zu trinken kaufen"], [:zurueck, "Die leere Flasche zurückbringen"]] },
    # --- Episode 2 ---------------------------------------------------------------------
    :q_anmeldung => {
      :title => "Anmeldung beim Bürgeramt", :episode => 2,
      :desc  => "In Deutschland muss man sich innerhalb von zwei Wochen nach dem Einzug anmelden. Dafür brauche ich einen Termin und die richtigen Unterlagen.",
      :steps => [[:termin, "Einen Termin vereinbaren (Laptop)"],
                 [:pass, "Reisepass mitnehmen"],
                 [:formular, "Anmeldeformular ausdrucken (Copyshop)"],
                 [:wgb, "Wohnungsgeberbestätigung besorgen"],
                 [:amt, "Zum Bürgeramt gehen"],
                 [:ausfuellen, "Das Formular ausfüllen"],
                 [:mb, "Die Meldebescheinigung bekommen"]] },
    :q_muell => {
      :title => "Herr Krause und die Mülltrennung", :episode => 2, :side => true,
      :desc  => "Der Nachbar Herr Krause findet, dass in der WG falsch getrennt wird. Vier Tonnen, viele Regeln.",
      :steps => [[:tonnen, "Die Tonnen ansehen"], [:sortieren, "Den Müll richtig sortieren"]] },
    :q_tourist => {
      :title => "Wo ist der Bahnhof?", :episode => 2, :side => true,
      :desc  => "Ein Tourist hat sich verlaufen. Kann ich ihm auf Deutsch den Weg erklären?",
      :steps => [[:erklaeren, "Den Weg zum Hauptbahnhof erklären"]] },
    :q_kurs => {
      :title => "Ein Deutschkurs", :episode => 2, :side => true,
      :desc  => "Am Schwarzen Brett im Copyshop hängt ein Aushang der Volkshochschule.",
      :steps => [[:lesen, "Den Aushang lesen"], [:verstehen, "Die wichtigsten Infos verstehen"]] },
    :q_mohammed => {
      :title => "Termin oder Terminvereinbarung?", :episode => 2, :side => true,
      :desc  => "Ein Mann im Wartebereich hat Tipps für das Leben mit Behörden.",
      :steps => [[:reden, "Mit Mohammed sprechen"]] },
    :q_koeln => {
      :title => "Ein Anruf aus Köln", :episode => 2,
      :desc  => "Ich habe mich bei einem Krankenhaus in Köln beworben. Und jetzt klingelt das Telefon ...",
      :steps => [[:brief, "Den Brief vom Finanzamt verstehen"],
                 [:anruf, "Das Telefonat verstehen"],
                 [:fahrkarte, "Im Reisezentrum eine Fahrt nach Köln buchen"],
                 [:reise, "Nach Köln fahren"]] },
  }
end
