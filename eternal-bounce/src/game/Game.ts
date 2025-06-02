import { Container, Graphics } from "pixi.js";
import { Paddle } from "../entities/Paddle";
import { app } from "../main";
import { PhysicSystem } from "../systems/physics/PhysicSystem";
import { sceneManager } from "../systems/SceneManager";
import { SystemManager } from "../systems/SystemManager";
import { LevelSystem } from "../systems/LevelSystem";

export class Game {
  public gameField = new Container();
  public systems = new SystemManager(this);

  platform!: Paddle;

  readonly gameWidth = 1000;
  readonly gameHeight = 1000;

  constructor() {
    this.setupContainers();
    this.setupSystems();
    this.setupLevel();

    this.resize(sceneManager.width, sceneManager.height);
  }

  private setupLevel() {
    const level = this.systems.get("level") as LevelSystem;
    level.init();
  }

  private setupContainers() {
    const bg = new Graphics();
    bg.rect(0, 0, this.gameWidth, this.gameHeight);
    bg.fill({ color: 0x000000, alpha: 0.2 });

    this.gameField.label = "GameField";
    this.gameField.addChild(bg);
  }

  private setupSystems() {
    this.systems.addSystem(PhysicSystem);
    this.systems.addSystem(LevelSystem);

    app.ticker.add(this.systems.update, this.systems);

    const phys = this.systems.get("physics") as PhysicSystem;
    phys.debugDraw = true;
    this.gameField.addChild(phys.debugGraphics);
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
