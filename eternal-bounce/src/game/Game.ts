import { Container, Graphics } from "pixi.js";
import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { app } from "../main";
import { PhysicSystem } from "../systems/physics/PhysicSystem";
import { sceneManager } from "../systems/SceneManager";
import { SystemManager } from "../systems/SystemManager";
import { IPhysicsBody } from "../utils/types";

export class Game {
  public gameField = new Container();
  public systems = new SystemManager();

  platform!: Paddle;
  ballsOnField: IPhysicsBody[] = [];

  readonly gameWidth = 1000;
  readonly gameHeight = 1000;

  constructor() {
    this.setupContainers();
    this.setupSystems();
    this.setupPlatform();
    this.setupBalls();
    this.setupColliders();
    this.resize(sceneManager.width, sceneManager.height);
  }

  private setupContainers() {
    const bg = new Graphics();
    bg.rect(0, 0, this.gameWidth, this.gameHeight);
    bg.fill({ color: 0x000000, alpha: 0.2 });

    this.gameField.name = "GameField";
    this.gameField.addChild(bg);
  }

  private setupSystems() {
    this.systems.addSystem(PhysicSystem);
    app.ticker.add(this.systems.update, this.systems);

    const phys = this.systems.get("physics") as PhysicSystem;
    phys.debugDraw = true;
    this.gameField.addChild(phys.debugGraphics);
  }

  private setupPlatform() {
    this.platform = new Paddle(this);
    this.gameField.addChild(this.platform.viewContainer);

    this.platform.body.setPosition(
      this.gameWidth / 2 - this.platform.viewContainer.width / 2,
      this.gameHeight - 100
    );
  }

  private setupBalls() {
    const startBall = new Ball(this.gameField, this);
    this.ballsOnField.push(startBall.body!);
    this.platform.snapBall(startBall);
  }

  private setupColliders() {
    const phys = this.systems.get("physics") as PhysicSystem;

    phys.addCollider(
      this.platform.body,
      this.ballsOnField,
      (platform, ball) => {
        const normal = { x: 0, y: -1 };

        const vx = ball.velocity.x;
        const vy = ball.velocity.y;
        const dot = vx * normal.x + vy * normal.y;

        ball.velocity.x = vx - 2 * dot * normal.x;
        ball.velocity.y = vy - 2 * dot * normal.y;

        ball.position.y =
          platform.position.y - platform.height / 2 - ball.height / 2;
      }
    );
  }

  public resize(viewWidth: number, viewHeight: number) {
    const scaleX = viewWidth / this.gameWidth;
    const scaleY = viewHeight / this.gameHeight;

    const scale = Math.min(scaleX, scaleY);

    this.gameField.scale.set(scale);

    this.gameField.x = (viewWidth - this.gameWidth * scale) / 2;
    this.gameField.y = (viewHeight - this.gameHeight * scale) / 2;
  }
}
