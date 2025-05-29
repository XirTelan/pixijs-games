import { Container, Rectangle } from "pixi.js";
import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { sceneManager } from "../systems/SceneManager";

export class Game {
  public stage = new Container();
  private readonly _hitArea: Rectangle;

  public gameField = new Container();
  public hitContainer = new Container();

  platform: Paddle;
  startBall: Ball;

  constructor() {
    this.stage.addChild(this.gameField);

    this.platform = new Paddle(0, -50);

    this.startBall = new Ball(this.gameField);

    this.platform.snapBall(this.startBall);

    this._hitArea = new Rectangle();

    this.hitContainer.interactive = true;
    this.hitContainer.hitArea = this._hitArea;

    this.gameField.addChild(this.platform.viewContainer, this.hitContainer);

    this.hitContainer.once(
      "pointertap",
      this.platform.launchBall,
      this.platform
    );
    this.resize(sceneManager.width, sceneManager.height);
  }

  public resize(w: number, h: number) {
    const centerX = w * 0.5;
    const centerY = h * 0.5;

    this.gameField.x = centerX
    this.gameField.y = h;

    this._hitArea.x = -w / 2;
    this._hitArea.y = -h;
    this._hitArea.width = w;
    this._hitArea.height = h;
  }
}
