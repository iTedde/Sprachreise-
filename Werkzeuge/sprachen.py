"""Erzeugt Plugins/Sprachreise/013_Data_Sprachen.rb:
   Herkunftsprofile + Übersetzungen des Wörterbuchs.
   Arabisch wird hier bereits in Anzeigeform gebracht (Buchstaben verbinden + rechts-nach-links),
   weil die Spiel-Engine das nicht selbst kann."""
import os
from fontTools.ttLib import TTFont
import arabic_reshaper
from bidi.algorithm import get_display

G = r"X:\Sprachreise\Pokemon Essentials v21.1 2023-07-30 (1)\Pokemon Essentials v21.1 2023-07-30"
OUT = G + r"\Plugins\Sprachreise\013_Data_Sprachen.rb"

LANGS = ["es", "ar", "fr", "en", "tr", "uk"]

ORIGINS = {
  "es": dict(label="Spanisch", native="Español", first="Daniela", last="Ríos", city="Medellín",
             land="Kolumbien", aus="aus Kolumbien", inn="in Kolumbien", staat="kolumbianisch",
             pass_head="República de Colombia - Pasaporte", uni="Universidad de Antioquia, Medellín",
             heimweh="Ich vermisse Mamas Arepas. Und die Sonne.", buch="ein Roman von García Márquez",
             zeit="In Medellín ist es jetzt sieben Stunden früher.", name_ok="sogar mit Akzent!",
             endlich="Por fin.", mama1="¿Mija? ¿Cómo estás? ¿Ya llegaste?", ja_mama="Sí, mamá.",
             alles_gut="Todo bien.", mama2="¿Y la gente? ¿Son amables?", schritt="Paso a paso",
             toll="¡Qué bien!", musiker_her="Valparaíso, Chile", musiker_aus="aus Chile",
             tarek="¿Español? Un poquito. Ich war ein Jahr in Valencia.",
             jonas="Ich kann nur »una cerveza, por favor«."),
  "ar": dict(label="Arabisch", native="العربية", first="Rania", last="Haddad", city="Amman",
             land="Jordanien", aus="aus Jordanien", inn="in Jordanien", staat="jordanisch",
             pass_head="Hashemite Kingdom of Jordan - Passport", uni="Universität von Jordanien, Amman",
             heimweh="Ich vermisse Mamas Mansaf. Und die Sonne.", buch="Gedichte von Mahmud Darwisch",
             zeit="In Amman ist es jetzt eine Stunde später.", name_ok="richtig geschrieben!",
             endlich="أخيرًا.", mama1="حبيبتي، كيف حالك؟", ja_mama="نعم يا ماما.",
             alles_gut="كل شيء بخير.", mama2="والناس؟ هل هم لطفاء؟", schritt="خطوة خطوة",
             toll="يا سلام!", musiker_her="Beirut, Libanon", musiker_aus="aus dem Libanon",
             tarek="Shwayy - ein bisschen! Meine Eltern kommen aus dem Libanon.",
             jonas="Ich kann nur »Schukran«."),
  "fr": dict(label="Französisch", native="Français", first="Aminata", last="Diallo", city="Dakar",
             land="Senegal", aus="aus dem Senegal", inn="im Senegal", staat="senegalesisch",
             pass_head="République du Sénégal - Passeport", uni="Université Cheikh Anta Diop, Dakar",
             heimweh="Ich vermisse Mamas Thieboudienne. Und das Meer.", buch="ein Roman von Mariama Bâ",
             zeit="In Dakar ist es jetzt zwei Stunden früher.", name_ok="richtig geschrieben!",
             endlich="Enfin.", mama1="Ma chérie, ça va ? Tu es arrivée ?", ja_mama="Oui, maman.",
             alles_gut="Tout va bien.", mama2="Et les gens ? Ils sont gentils ?", schritt="Pas à pas",
             toll="Super !", musiker_her="Montréal, Kanada", musiker_aus="aus Kanada",
             tarek="Un peu. Französisch hatte ich in der Schule. Lange her!",
             jonas="Ich kann nur »un croissant, s'il vous plaît«."),
  "en": dict(label="Englisch", native="English", first="Joy", last="Santos", city="Manila",
             land="Philippinen", aus="von den Philippinen", inn="auf den Philippinen", staat="philippinisch",
             pass_head="Republic of the Philippines - Passport", uni="University of the Philippines, Manila",
             heimweh="Ich vermisse Mamas Adobo. Und die Sonne.", buch="ein Roman von Nick Joaquín",
             zeit="In Manila ist es jetzt sechs Stunden später.", name_ok="richtig geschrieben!",
             endlich="Finally.", mama1="Anak? How are you? Did you arrive?", ja_mama="Yes, Ma.",
             alles_gut="Everything's fine.", mama2="And the people? Are they nice?", schritt="Step by step",
             toll="Nice!", musiker_her="Lagos, Nigeria", musiker_aus="aus Nigeria",
             tarek="A little. Aber hier üben wir Deutsch, okay?",
             jonas="Mein Englisch ist okay. Aber mit Deutsch lernst du schneller. Deal?"),
  "tr": dict(label="Türkisch", native="Türkçe", first="Elif", last="Demir", city="Izmir",
             land="Türkei", aus="aus der Türkei", inn="in der Türkei", staat="türkisch",
             pass_head="Türkiye Cumhuriyeti - Pasaport", uni="Ege Üniversitesi, Izmir",
             heimweh="Ich vermisse Mamas Menemen. Und das Meer.", buch="ein Roman von Orhan Pamuk",
             zeit="In Izmir ist es jetzt eine Stunde später.", name_ok="richtig geschrieben!",
             endlich="Nihayet.", mama1="Kızım, nasılsın? Vardın mı?", ja_mama="Evet, anne.",
             alles_gut="Her şey yolunda.", mama2="İnsanlar nasıl? İyiler mi?", schritt="Adım adım",
             toll="Harika!", musiker_her="Ankara, Türkei", musiker_aus="aus der Türkei",
             tarek="Biraz! Ich bin in Neukölln aufgewachsen.",
             jonas="Ich kann nur »çok güzel«. Und »Döner mit alles«."),
  "uk": dict(label="Ukrainisch", native="Українська", first="Olena", last="Kowalenko", city="Lwiw",
             land="Ukraine", aus="aus der Ukraine", inn="in der Ukraine", staat="ukrainisch",
             pass_head="Ukraine - Pasport", uni="Medizinische Universität Lwiw",
             heimweh="Ich vermisse Mamas Borschtsch. Und Omas Garten.", buch="Gedichte von Taras Schewtschenko",
             zeit="In Lwiw ist es jetzt eine Stunde später.", name_ok="richtig geschrieben!",
             endlich="Нарешті.", mama1="Доню, як ти? Ти доїхала?", ja_mama="Так, мамо.",
             alles_gut="Все добре.", mama2="А люди? Вони привітні?", schritt="Крок за кроком",
             toll="Чудово!", musiker_her="Odesa, Ukraine", musiker_aus="aus der Ukraine",
             tarek="Leider nicht. Ich kann nur »Djakuju«. Das heißt danke, oder?",
             jonas="Ich kann nur »Djakuju«."),
}

# Wörterbuch-Übersetzungen (Englisch steht bereits in 010_Data_Woerter.rb)
TR = {
 "entschuldigung": ["perdón / disculpe", "عفوًا", "excusez-moi / pardon", "affedersiniz", "вибачте"],
 "danke": ["muchas gracias", "شكرًا جزيلًا", "merci beaucoup", "çok teşekkürler", "дуже дякую"],
 "verstehe_nicht": ["No lo entiendo.", "لا أفهم ذلك.", "Je ne comprends pas.", "Anlamıyorum.", "Я цього не розумію."],
 "langsamer": ["más despacio", "أبطأ", "plus lentement", "daha yavaş", "повільніше"],
 "wiederholen": ["repetir", "يكرّر", "répéter", "tekrarlamak", "повторити"],
 "hauptbahnhof": ["estación central", "المحطة الرئيسية", "gare centrale", "ana tren istasyonu", "головний вокзал"],
 "gleis": ["andén / vía", "رصيف القطار", "voie / quai", "peron", "колія"],
 "ausgang": ["salida", "مخرج", "sortie", "çıkış", "вихід"],
 "links": ["a la izquierda", "يسار", "à gauche", "sol", "ліворуч"],
 "rechts": ["a la derecha", "يمين", "à droite", "sağ", "праворуч"],
 "geradeaus": ["todo recto", "إلى الأمام", "tout droit", "dümdüz", "прямо"],
 "strasse": ["calle", "شارع", "rue", "cadde / sokak", "вулиця"],
 "adresse": ["dirección", "عنوان", "adresse", "adres", "адреса"],
 "hausnummer": ["número de casa", "رقم المنزل", "numéro de maison", "kapı numarası", "номер будинку"],
 "klingel": ["timbre", "جرس الباب", "sonnette", "zil", "дзвінок"],
 "fahrkarte": ["billete", "تذكرة", "billet / ticket", "bilet", "квиток"],
 "kurzstrecke": ["billete de trayecto corto", "تذكرة مسافة قصيرة", "ticket courte distance", "kısa mesafe bileti", "квиток на коротку відстань"],
 "entwerten": ["validar el billete", "ختم التذكرة", "composter", "bileti onaylatmak", "компостувати"],
 "verspaetung": ["retraso", "تأخير", "retard", "gecikme", "запізнення"],
 "schrippe": ["panecillo", "خبز صغير", "petit pain", "küçük ekmek", "булочка"],
 "pfand": ["depósito de envases", "رسوم العبوات", "consigne", "depozito", "застава за пляшку"],
 "zu_fuss": ["a pie", "سيرًا على الأقدام", "à pied", "yürüyerek", "пішки"],
 "mitbewohner": ["compañero de piso", "شريك السكن", "colocataire", "ev arkadaşı", "сусід по квартирі"],
 "wg": ["piso compartido", "سكن مشترك", "colocation", "paylaşımlı ev", "спільна квартира"],
 "duzen": ["tutear / tratar de usted", "أنت / حضرتك", "tutoyer / vouvoyer", "sen / siz demek", "на «ти» / на «ви»"],
 "anmelden": ["empadronarse", "تسجيل السكن", "déclarer son domicile", "ikamet kaydı yaptırmak", "зареєструватися"],
 "buergeramt": ["oficina de atención ciudadana", "مكتب خدمات المواطنين", "bureau des citoyens", "nüfus müdürlüğü", "бюро громадян"],
 "baustelle": ["obra", "موقع بناء", "chantier", "inşaat alanı", "будівництво"],
 "umleitung": ["desvío", "تحويلة", "déviation", "sapma yolu", "об'їзд"],
 "morgen_gruss": ["¡Buenos días!", "صباح الخير!", "Bonjour !", "Günaydın!", "Доброго ранку!"],
 "digga": ["tío / colega", "يا صاحبي", "mec", "kanka", "братан"],
 "wat": ["qué / eso (dialecto)", "ماذا (لهجة)", "quoi / ça (dialecte)", "ne / şu (şive)", "що / це (діалект)"],
 "putzplan": ["turnos de limpieza", "جدول التنظيف", "planning de ménage", "temizlik planı", "графік прибирання"],
 "termin": ["cita", "موعد", "rendez-vous", "randevu", "запис на прийом"],
 "terminvereinbarung": ["pedir cita", "حجز موعد", "prise de rendez-vous", "randevu alma", "запис (бронювання)"],
 "unterlagen": ["documentos", "مستندات", "documents", "belgeler", "документи"],
 "formular": ["formulario", "استمارة", "formulaire", "form", "бланк"],
 "merkblatt": ["hoja informativa", "نشرة معلومات", "fiche d'information", "bilgi notu", "пам'ятка"],
 "ausdrucken": ["imprimir", "يطبع", "imprimer", "yazdırmak", "роздрукувати"],
 "ausfuellen": ["rellenar", "يملأ", "remplir", "doldurmak", "заповнити"],
 "unterschrift": ["firma", "توقيع", "signature", "imza", "підпис"],
 "pflichtfeld": ["campo obligatorio", "حقل إلزامي", "champ obligatoire", "zorunlu alan", "обов'язкове поле"],
 "familienname": ["apellido", "اسم العائلة", "nom de famille", "soyadı", "прізвище"],
 "familienstand": ["estado civil", "الحالة الاجتماعية", "situation familiale", "medeni durum", "сімейний стан"],
 "ledig": ["soltera / soltero", "أعزب / عزباء", "célibataire", "bekâr", "неодружена"],
 "staatsangehoerigkeit": ["nacionalidad", "الجنسية", "nationalité", "uyruk", "громадянство"],
 "geburtsdatum": ["fecha de nacimiento", "تاريخ الميلاد", "date de naissance", "doğum tarihi", "дата народження"],
 "einzug": ["fecha de mudanza", "تاريخ السكن", "date d'emménagement", "taşınma tarihi", "дата заселення"],
 "hauptwohnung": ["residencia principal", "السكن الرئيسي", "résidence principale", "ana ikametgâh", "основне житло"],
 "wgb": ["confirmación del arrendador", "تأكيد صاحب السكن", "attestation du logeur", "ev sahibi onayı", "підтвердження орендодавця"],
 "vermieterin": ["casera", "صاحبة السكن", "propriétaire", "ev sahibi", "орендодавиця"],
 "wartenummer": ["número de espera", "رقم الانتظار", "numéro d'attente", "sıra numarası", "номер у черзі"],
 "sachbearbeiterin": ["funcionaria", "الموظفة المختصة", "agente administrative", "görevli memur", "працівниця установи"],
 "meldebescheinigung": ["certificado de empadronamiento", "شهادة تسجيل السكن", "attestation de domicile", "ikamet belgesi", "довідка про реєстрацію"],
 "bescheinigung": ["certificado", "شهادة", "attestation", "belge", "довідка"],
 "reisepass": ["pasaporte", "جواز سفر", "passeport", "pasaport", "закордонний паспорт"],
 "kopie": ["copia", "نسخة", "copie", "kopya", "копія"],
 "restmuell": ["basura general", "نفايات عامة", "ordures ménagères", "genel çöp", "змішані відходи"],
 "gelbe_tonne": ["contenedor amarillo", "الحاوية الصفراء", "poubelle jaune", "sarı çöp kutusu", "жовтий контейнер"],
 "biomuell": ["basura orgánica", "نفايات عضوية", "déchets organiques", "organik atık", "органічні відходи"],
 "altpapier": ["papel usado", "ورق مستعمل", "vieux papiers", "atık kâğıt", "макулатура"],
 "integrationskurs": ["curso de integración", "دورة الاندماج", "cours d'intégration", "uyum kursu", "інтеграційний курс"],
 "steuer_id": ["número de identificación fiscal", "الرقم الضريبي", "numéro fiscal", "vergi kimlik numarası", "податковий номер"],
 "aufbewahren": ["guardar", "يحتفظ", "conserver", "saklamak", "зберігати"],
 "vorstellungsgespraech": ["entrevista de trabajo", "مقابلة عمل", "entretien d'embauche", "iş görüşmesi", "співбесіда"],
 "halb_zehn": ["las nueve y media", "التاسعة والنصف", "neuf heures et demie", "dokuz buçuk", "пів на десяту"],
 "bewerbung": ["solicitud de empleo", "طلب توظيف", "candidature", "iş başvurusu", "заявка на роботу"],
 "umsteigen": ["hacer transbordo", "تغيير القطار", "changer de train", "aktarma yapmak", "пересідати"],
 "dom": ["catedral", "كاتدرائية", "cathédrale", "katedral", "собор"],
}

def shape(lang, s):
    if lang != "ar":
        return s
    # Nur Arabisch umformen; lateinische Teile behalten ihre Richtung
    return get_display(arabic_reshaper.reshape(s))

def rb(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("#{", "\\#{") + '"'

def main():
    cm = TTFont(G + r"\Fonts\power green.ttf").getBestCmap()
    ok = "".join(sorted(chr(c) for c in cm if 32 <= c < 0x3000))
    out = ["# Automatisch erzeugt von Werkzeuge/sprachen.py - nicht von Hand bearbeiten.",
           "# Arabische Texte sind bereits in Anzeigeform (verbunden, rechts-nach-links).",
           "module SR"]
    out.append("  # Zeichen, die die Spielschrift »Power Green« enthält (alles andere -> SR Unifont)")
    out.append("  FONT_OK = " + rb(ok) + ".chars.to_h { |c| [c, true] }")
    out.append("  LANG_ORDER = [" + ", ".join(":" + l for l in LANGS) + "]")
    out.append("  ORIGINS = {")
    native_keys = {"endlich", "mama1", "ja_mama", "alles_gut", "mama2", "schritt", "toll", "native"}
    for l in LANGS:
        o = ORIGINS[l]
        fields = []
        for k, v in o.items():
            v = shape(l, v) if k in native_keys else v
            fields.append(f"    :{k} => {rb(v)}")
        out.append(f"   :{l} => {{\n" + ",\n".join("  " + f for f in fields) + "\n   },")
    out.append("  }")
    out.append("  WORD_TR = {")
    for k in sorted(TR):
        vals = TR[k]
        assert len(vals) == 5, k
        d = {"es": vals[0], "ar": vals[1], "fr": vals[2], "tr": vals[3], "uk": vals[4]}
        out.append(f"    :{k} => {{ " + ", ".join(f":{l} => {rb(shape(l, v))}" for l, v in d.items()) + " },")
    out.append("  }")
    out.append("end")
    open(OUT, "w", encoding="utf-8").write("\n".join(out) + "\n")
    print("geschrieben:", OUT, len(TR), "Wörter")

if __name__ == "__main__":
    main()
