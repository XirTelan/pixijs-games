import { Container, Sprite, Ticker } from "pixi.js";
import { app } from "../main";
import { Keyboard } from "../systems/Keyboard";
import { sceneManager } from "../systems/SceneManager";
import { Ball } from "./Ball";

export class Paddle {
  speed: number;
  viewContainer: Container;

  snappedBalls: Ball[] = [];

  constructor(x = 0, y = 0) {
    this.viewContainer = new Container({ x, y });

    const sprite = Sprite.from("paddle.png");
    sprite.anchor.set(0.5);

    this.speed = 6;

    this.viewContainer.addChild(sprite);

    app.ticker.add(this.update, this);
  }

  update(time: Ticker) {
    const dt = time.deltaTime;
    const halfSceneWidth = sceneManager.width / 2;
    const halfViewWidth = this.viewContainer.width / 2;

    let newX = this.viewContainer.x;
    if (Keyboard.state?.get("ArrowLeft")) {
      newX -= this.speed * dt;
    }
    if (Keyboard.state?.get("ArrowRight")) {
      newX += this.speed * dt;
    }

    newX = Math.max(
      -halfSceneWidth + halfViewWidth,
      Math.min(halfSceneWidth - halfViewWidth, newX)
    );

    this.viewContainer.x = newX;
  }

  snapBall(ball: Ball) {
    ball.view.removeFromParent();
    ball.view.position.set(this.viewContainer.x, -35);
    this.viewContainer.addChild(ball.view);
    this.snappedBalls.push(ball);
  }

  launchBall() {
    if (this.snappedBalls.length === 0) return;

    const ball = this.snappedBalls.pop()!;
    const globalPos = ball.view.getGlobalPosition();

    ball.view.removeFromParent();
    ball.parent.addChild(ball.view);

    const newLocalPos = ball.view.parent.toLocal(globalPos);
    ball.view.position.set(newLocalPos.x, newLocalPos.y);


  }
}
