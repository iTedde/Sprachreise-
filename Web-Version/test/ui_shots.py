"""Screenshots einzelner Oberflächen (ohne Autotest) zur Sichtprüfung."""
import sys, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "www" / "index.html").as_uri()
OUT = ROOT / "test" / "shots"; OUT.mkdir(exist_ok=True)
SETUP = """async (a) => {
  const t = document.querySelector('.title'); if (t) t.remove(); Input.modal = []; UI.modalCount = 0;
  SR.applyState(SR.newState()); S().origin = a.lang || 'es'; S().name = SR.o('first'); S().episode = a.ep || 1;
  for (const f of (a.flags || [])) set(f);
  await World.transfer(a.map, a.x, a.y, a.dir || 2, {noFade: true});
  await U.sleep(300);
  if (a.scene) { World.busy++; World.runScene(a.scene, a.ev ? World.eventByName(a.ev) : null).finally(() => World.busy--); }
  if (a.js) await (new Function('return (async () => {' + a.js + '})()'))();
}"""
CASES = {
  "typing": dict(map="supermarkt", x=6, y=9, dir=4, ep=3, js="Shop.start(['milch','brot','eier','reis','tomate']); Typing.task({prompt:'Wie heißt das auf Deutsch?', pic:'🍅', answers:['Tomate'], mode:'word', label:'Einkauf'});"),
  "chat": dict(map="eckhaus", x=6, y=8, ep=3, js="sms('Kofi',[{from:'Kofi',text:'Hey! Heute Abend Fußball im Eckhaus! Wir treffen uns gegen sechs.'}],{prompt:'»Gegen sechs«? Frag nach, ob er 18 Uhr meint.',answers:['18 Uhr?'],mode:'sentence',minWords:1});"),
  "debate": dict(map="stadtfest", x=38, y=15, dir=8, ep=9, flags=["fest_start"], js="Debate.open_('Ralf','Ralf'); Debate.phase(1); Debate.open=35; Debate.calm=70; Debate.update(); Debate.choose('(Wie reagiere ich?)',[{t:'Das stimmt nicht.',s:'widerspruch'},{t:'Was genau meinst du mit »alle«?',s:'verallg',open:15},{t:'Du bist doof.',s:'angriff'},{t:'Wie kommst du darauf?',s:'nachfragen'}]);"),
  "mappe": dict(map="wg", x=5, y=6, ep=3, js="learn('termin','pfand','duzen',true); quest('q_einkauf'); friend('jonas',3); friend('mai',4); diary('x','Test-Tagebuch: Heute war ein guter Tag.'); doc('reisepass',true); points(520,null,true); Mappe.open('progress');"),
  "mappe_kontakte": dict(map="wg", x=5, y=6, ep=5, js="friend('jonas',3); friend('mai',4); friend('aga',2); friend('wagner',3); Mappe.open('people');"),
  "karte": dict(map="koeln_hbf", x=12, y=13, ep=7, js="unlockCity('koeln',true); unlockCity('frankfurt',true); unlockCity('muenchen',true); S().currentCity='koeln'; Karte.show('travel',['frankfurt']);"),
  "dialog": dict(map="moabit", x=30, y=20, ep=1, js="ask('{name}','(Was sage ich?)',['[[entschuldigung|Entschuldigung]], ich brauche Hilfe.','Ich… Lehrter Straße? Wo?','Sprechen Sie {sprache}?']);"),
  "banner": dict(map="hbf", x=16, y=17, ep=1, js="UI.newWord(SR.WORDS.wgb,'wgb');"),
  "paper": dict(map="ehrenfeld", x=31, y=9, ep=4, js="Mini.findErrors('Mietvertrag · Körnerstraße 21, 2. OG',[['Mieterin: {name} {nachname}',false,'ok'],['Kaltmiete: 650 € monatlich',false,'ok'],['Kaution: fünf Monatskaltmieten (3.250 €)',true,'x'],['Die Mieterin muss jedes Jahr alle Räume neu streichen.',true,'x']],'Frau Jansen');"),
  "icons": dict(map="wg", x=5, y=3, ep=1, js="Cook.give('Mai','Kannst du mir bitte das [[salz|Salz]] geben?',['tomate','salz','zwiebel','butter'],'salz');"),
  "rhein": dict(map="rheinufer", x=30, y=9, ep=5),
  "hamburg": dict(map="hamburg", x=23, y=21, ep=10),
}
def main():
    names = sys.argv[1:] or list(CASES)
    mobile = "--mobile" in names; names = [n for n in names if n != "--mobile"]
    with sync_playwright() as p:
        b = p.chromium.launch(channel="msedge", headless=True)
        ctx = b.new_context(viewport={"width": 844, "height": 390}, has_touch=True, is_mobile=True, device_scale_factor=2) if mobile else b.new_context(viewport={"width": 1024, "height": 768})
        for n in names:
            pg = ctx.new_page(); logs = []
            pg.on("pageerror", lambda e: logs.append(str(e)))
            pg.goto(URL); pg.wait_for_timeout(1200)
            pg.evaluate(SETUP, CASES[n]); pg.wait_for_timeout(1500)
            pg.screenshot(path=str(OUT / f"ui_{n}{'_m' if mobile else ''}.png")); print(n, logs[:3])
            pg.close()
        b.close()
main()
