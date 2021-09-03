import Collider from "./Collider.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FRICTION = 0.5;
const WEIGHT = 0.3;

export default class Gun {
  x;
  y;
  bulletMass;
  fill;
  angle;
  anchorX;
  anchorY;
  lastShootTime = Date.now();
  bullets = [];

  constructor(x, y, bulletMass, fill) {
    this.x = x;
    this.y = y;
    this.anchorX = x + 25;
    this.anchorY = y - 15;
    this.bulletMass = bulletMass;
    this.fill = fill;

    // this.direction = Math.random() > 0.5 ? 1 : -1;

    // this.velY = Math.random() * 30 - 30;
    // this.velX = (Math.random() * 10 + 10) * this.direction;
  }

  shoot() {
    const bullet = new Collider(this.anchorX, this.anchorY, this.bulletMass, 10, 10, "red");
    bullet.velX = 120;
    bullet.velY = 12;

    this.bullets.push({ bullet, created: Date.now(), index: window.colliders.length });
  }

  update() {
    if (window.mouse.isPressed) {
      const angle = Math.atan2(window.mouse.y - this.anchorY, window.mouse.x - this.anchorX);
      console.log(angle);
      if ((angle * 180) / Math.PI < 10 && (angle * 180) / Math.PI > -70) {
        this.angle = angle;
      }

      if (Date.now() - this.lastShootTime > 300) {
        this.lastShootTime = Date.now();
        this.shoot();
      }
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (Date.now()  - this.bullets[i].created > 1000) {
        window.colliders.splice(this.bullets[i].index, 1);
      }
    }
  }

  draw() {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, 50, 60);

    ctx.fillStyle = "#666";

    ctx.translate(this.anchorX, this.anchorY);
    ctx.rotate(this.angle);
    ctx.translate(-this.anchorX, -this.anchorY);
    ctx.fillRect(this.x, this.y - 30, 110, 40);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
