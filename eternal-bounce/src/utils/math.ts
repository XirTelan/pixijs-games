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

  public clone() {
    return new Vector2(this.x, this.y);
  }

  public scale(value: number) {
    if (isFinite(value)) {
      this.x *= value;
      this.y *= value;
    } else {
      this.x = 0;
      this.y = 0;
    }

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

  public length(isSquared = false) {
    const length = this.x ** 2 + this.y ** 2;
    return isSquared ? length : Math.sqrt(length);
  }
}

export function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}
