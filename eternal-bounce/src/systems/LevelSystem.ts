import { Container } from "pixi.js";
import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Game } from "../game/Game";
import { onBallCollide } from "../utils/phys";
import { ISystem } from "../utils/types";
import { PhysicsBody, PhysicSystem } from "./physics";
import { Keyboard } from "./Keyboard";
import { Brick } from "../entities/Brick";

export class LevelSystem implements ISystem {
  static SYSTEM_ID = "level";

  game!: Game;
  gameField!: Container;

  private bricks: PhysicsBody[] = [];
  private ballsOnField: PhysicsBody[] = [];

  platform!: Paddle;

  private gameWidth!: number;
  private gameHeight!: number;

  offset = {
    x: 100,
    y: 100,
  };

  update(deltaTime: number): void {}

  init(w = 1000, h = 1000) {
    if (!this.game) {
      throw Error("Game instance undefined");
    }

    this.gameWidth = w;
    this.gameHeight = h;
    this.gameField = this.game.gameField;

    this.setupPlatform();
    this.setupColliders();

    this.setupHotkeys();

    this.generateGridLevel(10, 10, 100, 100);
  }
  private setupHotkeys() {
    if (import.meta.env.DEV)
      Keyboard.events.on("keyup", (key) => {
        if (key === "KeyQ") this.addBall();
      });
  }

  private addBall() {
    const startBall = new Ball(this.gameField, this.game);
    this.ballsOnField.push(startBall.body!);
    this.platform.snapBall(startBall);
  }

  private setupPlatform() {
    this.platform = new Paddle(this.game);
    this.gameField.addChild(this.platform.viewContainer);

    this.platform.body.setPosition(
      this.gameWidth / 2 - this.platform.viewContainer.width / 2,
      this.gameHeight - 100
    );
  }

  private setupColliders() {
    const phys = this.game.systems.get("physics") as PhysicSystem;

    phys.addCollider(
      this.ballsOnField,
      this.platform.body,
      (ball, platform) => {
        onBallCollide(ball, platform);
        const vx = platform.position.x - platform.prevPosition.x;
        ball.velocity.x += vx * 0.5;
        ball.velocity.scale(1.05);
        ball.setVelocity(ball.velocity.x, ball.velocity.y);
      }
    );
    phys.addCollider(this.ballsOnField, this.bricks, (ball, brick) => {
      onBallCollide(ball, brick);
      brick.onHit?.(ball);
    });
  }

  generateGridLevel(
    rows: number,
    cols: number,
    startX: number,
    startY: number,
    brickWidth = 64,
    brickHeight = 32,
    padding = 8
  ) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (brickWidth + padding);
        const y = startY + row * (brickHeight + padding);

        const brick = new Brick(this.game, x, y, {
          width: brickWidth,
          height: brickHeight,
          hitPoints: 3,
          type: "default",
        });

        this.bricks.push(brick.body);
        this.gameField.addChild(brick.container);
      }
    }
  }

  clear() {
    for (const brick of this.bricks) {
      // brick.destroy();
    }
    this.bricks = [];
  }
}
