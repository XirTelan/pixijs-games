import { Application } from "pixi.js";
import { sceneManager } from "./systems/SceneManager";
import { MainMenu } from "./scenes/MainMenu";
import { initAssets } from "./assets";

export const app = new Application();

(async () => {
  await app.init({
    resolution: Math.max(window.devicePixelRatio, 2),
    background: "#1099bb",
    resizeTo: window,
  });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  if (import.meta.env.DEV) window.__PIXI_APP__ = app;

  window.addEventListener("resize", resize);
  sceneManager.initialize(app);
  await initAssets();
  sceneManager.launch(MainMenu);
  resize();
})();

function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const minWidth = 375;
  const minHeight = 700;

  const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
  const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
  const scale = scaleX > scaleY ? scaleX : scaleY;
  const width = windowWidth * scale;
  const height = windowHeight * scale;

  app.renderer.canvas.style.width = `${windowWidth}px`;
  app.renderer.canvas.style.height = `${windowHeight}px`;
  window.scrollTo(0, 0);

  app.renderer.resize(width, height);
  sceneManager.resize(width, height);
}
