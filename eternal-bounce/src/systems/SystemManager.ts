import { Ticker } from "pixi.js";
import { ISystem, ISystemConstructor } from "../utils/types";
import { Game } from "../game/Game";

export class SystemManager {
  private _game: Game;
  private systems = new Map<string, ISystem>();

  constructor(game: Game) {
    this._game = game;
  }

  addSystem(system: ISystemConstructor) {
    const instance = new system();
    instance.game = this._game;
    this.systems.set(system.SYSTEM_ID, instance);
  }

  update(ticker: Ticker) {
    this.systems.forEach((system) => system.update(ticker.deltaTime));
  }

  get(id: string) {
    return this.systems.get(id);
  }
}
