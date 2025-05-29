import { Container, Graphics, Ticker } from "pixi.js";
import { app } from "../main";
import { Vector2 } from "../utils/math";

export class Ball {
  view = new Container();
  parent: Container;

  isActive = false;

  constructor(parent: Container) {
    this.parent = parent;

    const graph = new Graphics().circle(0, 0, 10).fill({
      color: "#ffff00",
    });
    this.view.addChild(graph);
    app.ticker.add(this.update, this);
  }

  update(time: Ticker) {
    if (false) return;

  }

  applyForce(vector: Vector2) {

  }
}
