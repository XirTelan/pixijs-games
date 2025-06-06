import { EventEmitter } from "pixi.js";

export class Keyboard {
  static events: EventEmitter = new EventEmitter();

  public static readonly state: Map<string, boolean> = new Map();
  public static initialize() {
    document.addEventListener("keydown", Keyboard.keyDown);
    document.addEventListener("keyup", Keyboard.keyUp);
  }
  private static keyDown(e: KeyboardEvent): void {
    Keyboard.state.set(e.code, true);
  }
  private static keyUp(e: KeyboardEvent): void {
    Keyboard.state.set(e.code, false);
    Keyboard.events.emit("keyup", e.code);
  }
}
