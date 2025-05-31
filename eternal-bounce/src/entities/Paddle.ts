import { Container, Sprite, Ticker } from "pixi.js";
import { app } from "../main";
import { Keyboard } from "../systems/Keyboard";
import { Ball } from "./Ball";
import { PhysicsBody, PhysicsState } from "../systems/physics/PhysicsBody";
import { Game } from "../game/Game";
import { PhysicSystem } from "../systems/physics/PhysicSystem";

export class Paddle {
  private game: Game;
  speed: number;
  viewContainer: Container;
  body: PhysicsBody;
  snappedBalls: Ball[] = [];

  constructor(game: Game, x = 0, y = 0) {
    this.viewContainer = new Container({ x, y, label: "paddle" });
    this.game = game;

    const sprite = Sprite.from("paddle.png");
    this.viewContainer.addChild(sprite);

    this.speed = 6;

    const phys = game.systems.get("physics") as PhysicSystem;

    this.body = new PhysicsBody(phys, this.viewContainer);

    this.body.setState(PhysicsState.KINEMATIC);
    phys.addBody(this.body);

    app.ticker.add(this.update, this);

    Keyboard.events.on("keyup", (key) => {
      if (key != "Space") return;
      this.launchBall();
    });
  }

  update(time: Ticker) {
    const dt = time.deltaTime;

    let newX = this.viewContainer.x;

    if (Keyboard.state?.get("ArrowLeft")) {
      newX -= this.speed * dt;
    }
    if (Keyboard.state?.get("ArrowRight")) {
      newX += this.speed * dt;
    }

    this.body.setPosition(newX, this.viewContainer.y);
  }

  snapBall(ball: Ball) {
    ball.view.removeFromParent();

    this.viewContainer.addChild(ball.view);

    ball.setPosition(this.viewContainer.width / 2, -50);
    ball.setVelocity(0, 0);

    this.snappedBalls.push(ball);
  }

  launchBall() {
    if (this.snappedBalls.length === 0) return;

    const ball = this.snappedBalls.pop()!;
    const globalPos = ball.view.getGlobalPosition();

    ball.view.removeFromParent();
    ball.parent.addChild(ball.view);
    const newPos = ball.parent.toLocal(globalPos);
    ball.setPosition(newPos.x, newPos.y);

    const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
    const speed = 10;
    ball.body?.setState(PhysicsState.KINEMATIC);
    ball.setVelocity(speed * Math.sin(angle), -speed * Math.cos(angle));
  }
}
