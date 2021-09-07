import Collider from "./Collider.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let CANVAS_DIAGONAL = 1000;
const FRICTION = 0.05;
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
  bulletPower = 60;

  constructor(x, y, bulletMass, fill) {
    this.x = x;
    this.y = y;
    this.anchorX = x + 25;
    this.anchorY = y - 15;
    this.bulletMass = bulletMass;
    this.fill = fill;
    CANVAS_DIAGONAL = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

    // this.direction = Math.random() > 0.5 ? 1 : -1;

    // this.velY = Math.random() * 30 - 30;
    // this.velX = (Math.random() * 10 + 10) * this.direction;
  }

  shoot() {
    const bullet = new Collider(this.anchorX, this.anchorY, this.bulletMass, 20, 20, "red");

    const distX = window.mouse.x - this.anchorX;
    const distY = window.mouse.y - this.anchorY;
    const distToMouse = Math.sqrt(distX ** 2 + distY ** 2);

    const power = this.bulletPower * (distToMouse / CANVAS_DIAGONAL);

    bullet.velX = Math.cos(this.angle) * power;
    bullet.velY = Math.sin(this.angle) * power;

    console.log(`velX: ${bullet.velX}, velY: ${bullet.velY}`);

    this.bullets.push({ bullet, created: Date.now(), index: window.colliders.length - 1 });
  }

  update() {
    const angle = Math.atan2(window.mouse.y - this.anchorY, window.mouse.x - this.anchorX);
    if ((angle * 180) / Math.PI < 0 && (angle * 180) / Math.PI > -70) {
      this.angle = angle;
    }

    if (window.mouse.isPressed && Date.now() - this.lastShootTime > 300) {
      this.lastShootTime = Date.now();
      this.shoot();
    }

    // for (let i = this.bullets.length - 1; i >= 0; i--) {
    //   if (Date.now()  - this.bullets[i].created > 1000) {
    //     window.colliders.splice(this.bullets[i].index, 1);
    //   }
    // }
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
