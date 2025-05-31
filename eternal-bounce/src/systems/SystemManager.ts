import { Ticker } from "pixi.js";
import { ISystem, ISystemConstructor } from "../utils/types";

export class SystemManager {
  private systems = new Map<string, ISystem>();

  addSystem(system: ISystemConstructor) {
    const instance = new system();
    this.systems.set(system.SYSTEM_ID, instance);
  }

  update(ticker: Ticker) {
    this.systems.forEach((system) => system.update(ticker.deltaTime));
  }

  get(id: string) {
    return this.systems.get(id);
  }
}
