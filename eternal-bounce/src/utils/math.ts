export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x: number, y?: number) {
    this.x = x;
    this.y = y ?? x;

    return this;
  }

  public setX(x: number) {
    this.x = x;

    return this;
  }

  public setY(y: number) {
    this.y = y;

    return this;
  }

  public add(n: number): this;
  public add(v: Vector2): this;
  public add(arg: number | Vector2): this {
    if (typeof arg === "number") {
      this.x += arg;
      this.y += arg;
    } else {
      this.x += arg.x;
      this.y += arg.y;
    }

    return this;
  }
}
