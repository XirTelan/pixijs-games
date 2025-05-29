import { Container, Ticker } from "pixi.js";

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
