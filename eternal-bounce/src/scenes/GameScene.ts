import { Container } from "pixi.js";
import { Scene } from "../utils/types";

import { Game } from "../game/Game";
import { app } from "../main";

export class GameScene extends Container implements Scene {
  public static SCREEN_ID = "gameScene";
  public static assetBundles = ["game-scene"];

  private readonly _game: Game;

  constructor() {
    super();
    this._game = new Game();
    app.stage.addChild(this._game.stage);
  }

  resize(w: number, h: number) {
    this._game.resize(w, h);
  }
}
