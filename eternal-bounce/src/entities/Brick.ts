import { Container, Graphics } from "pixi.js";
import { PhysicsBody } from "../systems/physics/PhysicsBody";
import { Game } from "../game/Game";
import { PhysicSystem } from "../systems/physics/PhysicSystem";
import { BrickOptions } from "../utils/types";

//temp
const colors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff];

export class Brick {
  public container: Container;
  public body: PhysicsBody;
  public isDisabled = false;

  public width = 64;
  public height = 32;
  public hitPoints = 1;

  public game: Game;

  constructor(
    game: Game,
    public x: number,
    public y: number,
    brickOptions: BrickOptions
  ) {
    this.game = game;
    this.container = new Container({ label: "Brick" });

    this.container.position.set(x, y);

    const { width, height, hitPoints } = brickOptions;
    this.hitPoints = hitPoints;

    const gfx = new Graphics()
      .rect(0, 0, width, height)
      .fill({ color: colors[this.hitPoints] });

    this.container.addChild(gfx);

    const phys = this.game.systems.get("physics") as PhysicSystem;
    this.body = new PhysicsBody(phys, this.container);
    this.body.onHit = this.onHit.bind(this);
    phys.addBody(this.body);
  }

  private onHit(other: PhysicsBody) {
    if (this.isDisabled) return;

    this.hitPoints--;

    if (this.hitPoints <= 0) {
      this.disable();
    } else {
      this.flash();
    }
  }

  private flash() {
    const gfx = this.container.children[0] as Graphics;
    const width = this.width;
    const height = this.height;

    gfx.clear();
    gfx.rect(0, 0, width, height).fill({ color: 0xffffff });

    setTimeout(() => {
      gfx.clear();
      gfx.rect(0, 0, width, height).fill({ color: colors[this.hitPoints] });
    }, 100);
  }

  public disable() {
    this.container.visible = false;
    this.body.disable();
  }
}
