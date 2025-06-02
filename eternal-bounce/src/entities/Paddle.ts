import { Container, Sprite, Ticker } from "pixi.js";
import { app } from "../main";
import { Keyboard } from "../systems/Keyboard";
import { Ball } from "./Ball";
import { PhysicsBody, PhysicsState } from "../systems/physics/PhysicsBody";
import { Game } from "../game/Game";
import { PhysicSystem } from "../systems/physics/PhysicSystem";

const SPEED = 10;

export class Paddle {
  private game: Game;
  speed: number;
  viewContainer: Container;
  body: PhysicsBody;
  acceleration = 100;
  friction = 1;
  snappedBalls: Ball[] = [];

  constructor(game: Game, x = 0, y = 0) {
    this.viewContainer = new Container({ x, y, label: "paddle" });
    this.game = game;

    const sprite = Sprite.from("paddle.png");
    this.viewContainer.addChild(sprite);

    this.speed = SPEED;

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
    const velocity = this.body.velocity;

    const isLeftPressed = Keyboard.state?.get("ArrowLeft");
    const isRightPressed = Keyboard.state?.get("ArrowRight");

    if (isLeftPressed) {
      velocity.x -= this.acceleration * dt;
    } else if (isRightPressed) {
      velocity.x += this.acceleration * dt;
    } else {
      const vx = this.body.velocity.x;
      const frictionDelta = this.friction * dt;

      if (vx > 0) {
        velocity.x = Math.max(0, velocity.x - frictionDelta);
      } else if (vx < 0) {
        velocity.x = Math.min(0, velocity.x + frictionDelta);
      }
    }

    velocity.x = Math.max(-this.speed, Math.min(this.speed, velocity.x));
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
