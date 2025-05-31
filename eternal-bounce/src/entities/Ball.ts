import { Container, Graphics } from "pixi.js";

import { PhysicsBody, PhysicsState } from "../systems/physics/PhysicsBody";
import { Game } from "../game/Game";
import { PhysicSystem } from "../systems/physics/PhysicSystem";

export class Ball {
  parent: Container;
  private game: Game;

  view = new Container({ label: "ball" });
  body: PhysicsBody;

  isActive = false;

  constructor(parent: Container, game: Game) {
    this.parent = parent;
    this.game = game;

    const physSys = game.systems.get("physics") as PhysicSystem;

    const graph = new Graphics().circle(0, 0, 10).fill({
      color: "#ffff00",
    });

    this.view.addChild(graph);

    this.body = new PhysicsBody(physSys, this.view);
    this.body.setState(PhysicsState.STATIC);

    physSys.addBody(this.body);
  }

  setPosition(x: number, y: number) {
    this.body.setPosition(x, y);
  }
  setVelocity(x: number, y: number) {
    this.body.setVelocity(x, y);
  }
}
