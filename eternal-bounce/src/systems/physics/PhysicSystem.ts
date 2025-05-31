import { Container, Graphics } from "pixi.js";
import {
  Collider,
  IPhysicsBody,
  IPhysicSystem,
  ISystem,
} from "../../utils/types";
import { PhysicsBody } from "./PhysicsBody";

export class PhysicSystem implements IPhysicSystem, ISystem {
  static SYSTEM_ID = "physics";
  debugGraphics = new Graphics({ label: "physics debug" });
  private bodies = new Set<PhysicsBody>();
  private colliders = new Set<Collider>();

  debugContainer = new Container();
  private _debugDraw = false;

  bounds = {
    y: 0,
    x: 0,
    height: 1000,
    width: 1000,
  };
  gravity = 10;

  update(deltaTime: number) {
    for (const body of this.bodies) {
      body.update(deltaTime);
    }

    this.updateColliders();

    for (const body of this.bodies) {
      body.postUpdate();
    }
    if (this._debugDraw) {
      this.debugGraphics.clear();
      this.debugDrawBodies();
    }
  }

  private debugDrawBodies() {
    for (const body of this.bodies) {
      this.debugGraphics
        .rect(body.position.x, body.position.y, body.width, body.height)
        .stroke({ color: 0xff0000 });
    }
  }

  addBody(body: PhysicsBody) {
    this.bodies.add(body);
  }

  addCollider<
    T1 extends IPhysicsBody = IPhysicsBody,
    T2 extends IPhysicsBody = IPhysicsBody,
  >(obj1: T1 | T1[], obj2: T2 | T2[], onCollide: (a: T1, b: T2) => void): void {
    this.colliders.add({
      obj1,
      obj2,
      onCollide: onCollide as Collider["onCollide"],
    });
  }

  updateColliders() {
    for (const { obj1, obj2, onCollide } of this.colliders) {
      const group1 = Array.isArray(obj1) ? obj1 : [obj1];
      const group2 = Array.isArray(obj2) ? obj2 : [obj2];

      const isSameGroup = group1 === group2;
      for (let i = 0; i < group1.length; i++) {
        const a = group1[i];

        const startJ = isSameGroup ? i + 1 : 0;

        for (let j = startJ; j < group2.length; j++) {
          const b = group2[j];

          if (a === b) continue;
          if (this.checkAABB(a, b)) {
            onCollide(a, b);
          }
        }
      }
    }
  }

  private checkAABB(a: IPhysicsBody, b: IPhysicsBody) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public getCollisionSide(
    a: PhysicsBody,
    b: PhysicsBody
  ): "left" | "right" | "top" | "bottom" | "inside" {
    const dx = a.x + a.width / 2 - (b.x + b.width / 2);
    const dy = a.y + a.height / 2 - (b.y + b.height / 2);
    const width = (a.width + b.width) / 2;
    const height = (a.height + b.height) / 2;

    const crossWidth = width * dy;
    const crossHeight = height * dx;

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        return crossWidth > -crossHeight ? "bottom" : "left";
      } else {
        return crossWidth > -crossHeight ? "right" : "top";
      }
    }

    return "inside";
  }

  set debugDraw(state: boolean) {
    this._debugDraw = state;
  }
}
