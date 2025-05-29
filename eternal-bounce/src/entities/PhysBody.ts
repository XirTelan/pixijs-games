import { Vector2 } from "../utils/math";

export enum PhysicsState {
  STATIC,
  DYNAMIC,
  KINEMATIC,
}

export class PhysicsBody {
  private state: PhysicsState = PhysicsState.STATIC;
  force: Vector2 = new Vector2();

  applyForce(forceX: number, forceY: number) {
    if (this.state !== PhysicsState.STATIC) {
      this.force.set(forceX, forceY);
    }
  }
}
