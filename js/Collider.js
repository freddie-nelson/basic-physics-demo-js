const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FRICTION = 0.05;
const WEIGHT = 0.3;
const SPRING = 0.7;

export default class Collider {
  x;
  y;
  velY = 0;
  velX = 0;
  mass;
  sizeX;
  sizeY;
  fill;

  constructor(x, y, mass, sizeX, sizeY, fill) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.fill = fill;
    window.colliders.push(this);

    // this.direction = Math.random() > 0.5 ? 1 : -1;

    // this.velY = Math.random() * 30 - 30;
    // this.velX = (Math.random() * 10 + 10) * this.direction;
  }

  update() {
    if (this.mass === window.IMMOVABLE_MASS) {
      // this.velX = 0;
      // this.velY = 0;
      return;
    }

    if (this.velY !== NaN && this.velY !== undefined) {
      this.y += this.velY * (60 / window.FPS);
      this.velY += WEIGHT * (60 / window.FPS);
    }
    if (this.velX !== NaN && this.velX !== undefined) {
      this.x += this.velX * (60 / window.FPS);
      if (this.velX !== 0) {
        let newVelX = this.velX - FRICTION * (this.velX / Math.abs(this.velX)) * (60 / window.FPS);
        if (Math.sign(newVelX) !== Math.sign(this.velX)) newVelX = 0;

        this.velX = newVelX;
      }
    }

    // if (this.direction === 1 && this.velX < 0) this.velX = 0;
    // else if (this.direction === -1 && this.velX > 0) this.velX = 0;
  }

  getCollidingSide(c) {
    const dx = c.x + c.sizeX / 2 - (this.x + this.sizeX / 2);
    const dy = c.y + c.sizeY / 2 - (this.y + this.sizeY / 2);
    const width = (c.sizeX + this.sizeX) / 2;
    const height = (c.sizeY + this.sizeY) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    let side;

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        side = crossWidth > -crossHeight ? "BOTTOM" : "LEFT";
      } else {
        side = crossWidth > -crossHeight ? "RIGHT" : "TOP";
      }
    }

    return side;
  }

  collide() {
    for (let i = 0; i < window.colliders.length; i++) {
      const c = window.colliders[i];
      if (c === this) continue;

      if (
        this.x < c.x + c.sizeX &&
        this.x + this.sizeX > c.x &&
        this.y < c.y + c.sizeY &&
        this.y + this.sizeY > c.y
      ) {
        const m1 = c.mass;
        const m2 = this.mass;
        const u1 = Math.sqrt(c.velX * c.velX + c.velY * c.velY);
        const u2 = Math.sqrt(this.velX * this.velX + this.velY * this.velY);

        let v1 = ((m1 - m2) * u1 + 2 * (m2 * u2)) / (m1 + m2);
        let v2 = u1 - u2 + v1;

        // apply inelastic collision ratio
        v1 *= SPRING;
        v2 *= SPRING;

        // console.log(`u1: ${u1}, v1: ${v1}`);

        // calculate angle between center and point of collision
        const cx = this.x + this.sizeX / 2;
        const cy = this.y + this.sizeY / 2;

        // calculate side of collision on this
        const side = this.getCollidingSide(c);

        // calculate rough point of collision based on colliding side
        let pocX = c.x;
        let pocY = c.y;
        switch (side) {
          case "TOP":
            pocX += c.sizeX / 2;
            break;
          case "BOTTOM":
            pocX += c.sizeX / 2;
            pocY += c.sizeY;
            break;
          case "LEFT":
            pocY += c.sizeY / 2;
            break;
          case "RIGHT":
            pocX += c.sizeX;
            pocY += c.sizeY / 2;
          default:
            break;
        }

        const angle = Math.atan2(pocY - cy, pocX - cx);

        const vx1 = v1 * Math.cos(angle);
        const vx2 = v2 * Math.cos(angle);

        const vy1 = v1 * Math.sin(angle);
        const vy2 = v2 * Math.sin(angle);

        if (c.mass !== window.IMMOVABLE_MASS) c.velX = vx1;
        if (c.mass !== window.IMMOVABLE_MASS) c.velY = vy1;

        this.velX = vx2;
        this.velY = vy2;

        // move this outside of object it is colliding with
        switch (side) {
          case "TOP":
            this.y = c.y + c.sizeY + this.sizeY;
            // console.log("top");
            break;
          case "BOTTOM":
            this.y = c.y - this.sizeY;
            // console.log("bottom");
            break;
          case "LEFT":
            this.x = c.x + c.sizeX + this.sizeX;
            break;
          case "RIGHT":
            this.x = c.x - this.sizeX;
            break;
          default:
            break;
        }
      }
    }
  }

  draw() {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
  }
}
