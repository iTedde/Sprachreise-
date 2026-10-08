// Sprachreise – Start
"use strict";

const Screen = {
  fit() {
    const g = document.getElementById("game"), st = document.getElementById("stage");
    const w = window.innerWidth, h = window.innerHeight;
    const touch = document.body.classList.contains("touch");
    let s;
    if (touch && h > w) {             // Hochformat: Spiel oben, Steuerung unten
      s = Math.min(w / 512, (h * 0.62) / 384);
      st.style.alignItems = "flex-start"; st.style.paddingTop = Math.max(8, (h * 0.62 - 384 * s) / 2) + "px";
    } else {
      s = Math.min(w / 512, h / 384);
      st.style.alignItems = "center"; st.style.paddingTop = "0";
    }
    if (s > 1 && !touch) s = Math.max(1, Math.floor(s * 4) / 4);
    g.style.transform = `scale(${s})`;
    g.style.margin = `${(384 * s - 384) / 2}px ${(512 * s - 512) / 2}px`;
  },
};

async function boot() {
  Input.init();
  UI.init();
  World.init();
  Options.load();
  Screen.fit();
  window.addEventListener("resize", () => Screen.fit());
  window.addEventListener("orientationchange", () => setTimeout(() => Screen.fit(), 200));
  document.body.addEventListener("touchstart", () => Screen.fit(), { once: true, passive: true });
  try { await Promise.race([document.fonts.load("21px PowerGreen"), U.sleep(2500)]); } catch (e) { }
  await Gfx.ready([Gfx.img("img/ui/title.png"), Gfx.img("img/chars/SR_Heldin.png")]);
  document.getElementById("boot").remove();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !window.SR_TEST) {
    navigator.serviceWorker.register("sw.js").catch(() => { });
  }
  // Automatisch speichern, wenn die App in den Hintergrund geht
  document.addEventListener("visibilitychange", () => { if (document.hidden && World.map && SR.state.origin) SR.save("auto"); });
  World.run();
  if (window.SR_TEST && SR_TEST.active) { SR_TEST.start(); return; }
  await Title.run();
}
window.addEventListener("load", boot);

// Hooks für die Android-App (Zurück-Taste, Pause)
window.SR_back = function () { Input.press("back"); setTimeout(() => Input.release("back"), 60); };
window.SR_pause = function () { try { if (World.map && SR.state.origin) SR.save("auto"); if (Audio_.ctx) Audio_.ctx.suspend(); } catch (e) { } };
window.SR_resume = function () { try { if (Audio_.ctx) Audio_.ctx.resume(); } catch (e) { } };
