import { PhysicSystem } from "./PhysicSystem";
import { Vector2 } from "../../utils/math";
import { DisplayObject, IPhysicsBody } from "../../utils/types";

export enum PhysicsState {
  STATIC,
  DYNAMIC,
  KINEMATIC,
}

export class PhysicsBody implements IPhysicsBody {
  owner?: unknown;
  private state: PhysicsState = PhysicsState.STATIC;
  private gameObject: DisplayObject;

  disabled = false;

  force = new Vector2();
  velocity = new Vector2();

  speed: number = 0;
  maxSpeed?: number;

  world: PhysicSystem;

  width: number;
  height: number;
  mass: number = 1;

  prevPosition = new Vector2();
  position = new Vector2();

  allowGravity: boolean = true;

  onHit?(other: PhysicsBody): void;

  constructor(world: PhysicSystem, gameObject: DisplayObject, owner?: unknown) {
    this.owner = owner;
    this.world = world;
    this.gameObject = gameObject;

    const globalPos = gameObject.getGlobalPosition();
    this.position.set(globalPos.x, globalPos.y);

    this.width = gameObject.width;
    this.height = gameObject.height;
  }

  applyForce(forceX: number, forceY: number) {
    if (this.state !== PhysicsState.STATIC) {
      this.force.set(forceX, forceY);
    }
  }

  disable() {
    this.disabled = true;
    this.velocity.set(0);
    this.world.removeBody(this);
  }

  setVelocity(x: number, y: number): void {
    this.velocity.set(x, y);
    this.speed = this.velocity.length();
    if (this.maxSpeed && this.speed > this.maxSpeed) {
      this.velocity.scale(this.maxSpeed / this.speed);
    }
  }

  public get x(): number {
    return this.position.x;
  }
  public get y(): number {
    return this.position.y;
  }
  public set x(x: number) {
    this.position.setX(x);
  }

  public set y(y: number) {
    this.position.setY(y);
  }

  update(deltaTime: number) {
    switch (this.state) {
      case PhysicsState.STATIC:
        return;

      case PhysicsState.DYNAMIC:
        if (this.allowGravity) {
          this.force.y += this.world.gravity;
        }

        this.force.scale(1 / this.mass);

        this.velocity.x += this.force.x * deltaTime;
        this.velocity.y += this.force.y * deltaTime;

        this.force.set(0, 0);

        this.prevPosition.set(this.position.x, this.position.y);

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.checkWorldBounds();
        break;

      case PhysicsState.KINEMATIC:
        this.prevPosition.set(this.position.x, this.position.y);
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.checkWorldBounds();
        break;
    }
  }

  postUpdate() {
    this.updateDisplayPosition();
  }
  updateDisplayPosition() {
    this.gameObject.position.set(this.position.x, this.position.y);
  }

  setState(state: PhysicsState) {
    this.state = state;
  }
  setPosition(x: number, y?: number) {
    this.position.set(x, y);
    this.updateDisplayPosition();
  }

  checkWorldBounds() {
    const bounds = this.world.bounds;
    const pos = this.position;
    const vel = this.velocity;

    if (!bounds) return;

    if (pos.x < bounds.x) {
      pos.x = bounds.x;
      vel.x *= -1;
    } else if (pos.x + this.width > bounds.x + bounds.width) {
      pos.x = bounds.x + bounds.width - this.width;
      vel.x *= -1;
    }

    if (pos.y < bounds.y) {
      pos.y = bounds.y;
      vel.y *= -1;
    } else if (pos.y + this.height > bounds.y + bounds.height) {
      pos.y = bounds.y + bounds.height - this.height;
      vel.y *= -1;
    }
  }
}
