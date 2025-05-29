import { Application, Assets, Ticker } from "pixi.js";
import { Scene, SceneConstructor } from "../utils/types";
import { areBundlesLoaded } from "../assets";

class SceneManager {
  private app!: Application;
  private currentScene?: Scene;

  private readonly screenMap = new Map<string, Scene>();

  private _width!: number;
  private _height!: number;

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public initialize(app: Application): void {
    this.app = app;
    this._width = app.canvas.width;
    this._height = app.canvas.height;

    this.app.ticker.add(this.update, this);
  }

  public async launch(newScene: SceneConstructor): Promise<void> {
    const current = this.currentScene;

    if (current) {
      await this._removeScreen(current);
    }

    let screen = this.screenMap.get(newScene.SCREEN_ID);

    if (!screen) {
      if (newScene.assetBundles && !areBundlesLoaded(newScene.assetBundles)) {
        await Assets.loadBundle(newScene.assetBundles);
      }

      screen = new newScene();
      this.screenMap.set(newScene.SCREEN_ID, screen);
    }

    this.currentScene = screen;
    await this.addAndShowScene(this.currentScene);
  }

  private update(time: Ticker): void {
    this.currentScene?.update?.(time);
  }

  private async addAndShowScene(scene: Scene): Promise<void> {
    this.app.stage.addChild(scene);
  }

  public resize(w: number, h: number) {
    this._width = w;
    this._height = h;
    this.currentScene?.resize?.(w, h);
  }

  private async _removeScreen(screen: Scene) {
    if (screen.hide) {
      await screen.hide();
    }

    if (screen.update) {
      this.app.ticker.remove(screen.update, screen);
    }

    if (screen.parent) {
      screen.parent.removeChild(screen);
    }
  }
}

export const sceneManager = new SceneManager();
