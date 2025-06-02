import { PhysicsBody } from "../systems/physics/PhysicsBody";

export function getCollisionSide(a: PhysicsBody, b: PhysicsBody) {
  const dx = a.x + a.width / 2 - (b.x + b.width / 2);
  const dy = a.y + a.height / 2 - (b.y + b.height / 2);

  const combinedHalfWidths = (a.width + b.width) / 2;
  const combinedHalfHeights = (a.height + b.height) / 2;

  const wy = combinedHalfWidths * dy;
  const hx = combinedHalfHeights * dx;

  if (wy > hx) {
    return wy > -hx ? "top" : "right";
  } else {
    return wy > -hx ? "left" : "bottom";
  }
}

export function onBallCollide(ball: PhysicsBody, target: PhysicsBody) {
  const side = getCollisionSide(target, ball);
  const normal = {
    top: { x: 0, y: -1 },
    bottom: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }[side];

  const { x: vx, y: vy } = ball.velocity;
  const dot = vx * normal.x + vy * normal.y;
  ball.velocity.set(vx - 2 * dot * normal.x, vy - 2 * dot * normal.y);

  switch (side) {
    case "top":
      ball.y = target.y - ball.height;
      break;
    case "bottom":
      ball.y = target.y + target.height;
      break;
    case "left":
      ball.x = target.x - ball.width;
      break;
    case "right":
      ball.x = target.x + target.width;
      break;
  }
}
