import { Container, Ticker } from "pixi.js";
import { Vector2 } from "./math";
import { Game } from "../game/Game";

export interface Scene extends Container {
  update?: (time: Ticker) => void;
  hide?: () => Promise<void>;
  show?: () => Promise<void>;
  resize?: (w: number, h: number) => void;
}
export interface SceneConstructor {
  readonly SCREEN_ID: string;
  readonly assetBundles?: string[];
  new (): Scene;
}

export interface ISystemConstructor {
  readonly SYSTEM_ID: string;
  new (): ISystem;
}
export interface ISystem<S extends Game = Game> {
  game?: S;
  init?(): void;
  update(deltaTime: number): void;
}
export interface IPhysicsBody {
  world: IPhysicSystem;
  force: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  position: Vector2;
  allowGravity: boolean;
  disabled: boolean;

  x: number;
  y: number;

  applyForce(forceX: number, forceY: number): void;
  update(deltaTime: number): void;
  checkWorldBounds(): void;
}

export type Collider<
  T1 extends IPhysicsBody = IPhysicsBody,
  T2 extends IPhysicsBody = IPhysicsBody,
> = {
  obj1: T1 | T1[];
  obj2: T2 | T2[];
  onCollide: (a: T1, b: T2) => void;
};

export interface IPhysicSystem {
  update(deltaTime: number): void;

  addCollider<
    T1 extends IPhysicsBody = IPhysicsBody,
    T2 extends IPhysicsBody = IPhysicsBody,
  >(
    obj1: T1 | T1[],
    obj2: T2 | T2[],
    onCollide: (a: T1 | T1[], b: T2 | T2[]) => void
  ): void;
}

export type DisplayObject<T = Container> = T extends Container ? T : Container;

export type BrickOptions = {
  width: number;
  height: number;
  hitPoints: number;
  type: string;
};
