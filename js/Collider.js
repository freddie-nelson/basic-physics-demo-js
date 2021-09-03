const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FRICTION = 0.5;
const WEIGHT = .3;

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
    if (this.mass === window.IMMOVABLE_MASS) return;

    if (this.velY !== NaN && this.velY !== undefined) {
      this.y += this.velY * (60 / window.FPS);
      this.velY += WEIGHT * (60 / window.FPS);
    }
    if (this.velX !== NaN && this.velX !== undefined) {
      this.x += this.velX * (60 / window.FPS);
      if (this.velX !== 0) this.velX -= FRICTION * (this.velX / Math.abs(this.velX)) * (60 / window.FPS);
    }

    // if (this.direction === 1 && this.velX < 0) this.velX = 0;
    // else if (this.direction === -1 && this.velX > 0) this.velX = 0;
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
        const angle = Math.atan2(c.y - this.y, c.x - this.x);
        
        const m1 = c.mass;
        const m2 = this.mass;
        const u1 = Math.sqrt(c.velX * c.velX + c.velY * c.velY);
        const u2 = Math.sqrt(c.velX * c.velX + c.velY * c.velY);
        // console.log(`u1: ${u1}, v1: `);

        const v1 = ((m1 - m2) * u1) / (m1 + m2);
        const v2 = ((m2 - m1) * u2) / (m1 + m2);

        const vx1 = v1 * Math.cos(angle);
        const vx2 = v2 * Math.cos(angle);

        const vy1 = v1 * Math.sin(angle);
        const vy2 = v2 * Math.sin(angle);

        c.velX = vx1;
        c.velY = vy1;

        this.velX = vx2;
        this.velY = vy2;

      }
    }
  }

  draw() {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
  }
}
