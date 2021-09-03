const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FRICTION = 0.5;
const WEIGHT = 2;

export default class Particle {
  x;
  size;
  velY;
  velX;
  direction;
  fill;
  created;

  constructor(x, y, created) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 6;
    this.created = created;

    this.direction = Math.random() > 0.5 ? 1 : -1;

    this.velY = Math.random() * 30 - 30;
    this.velX = (Math.random() * 10 + 10) * this.direction;

    this.fill = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )})`;
  }

  update() {
    this.y += this.velY * (60 / window.FPS);
    this.x += this.velX * (60 / window.FPS);

    this.velX -= FRICTION * this.direction * (60 / window.FPS);
    if (this.direction === 1 && this.velX < 0) this.velX = 0;
    else if (this.direction === -1 && this.velX > 0) this.velX = 0;

    this.velY += WEIGHT * (60 / window.FPS);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
}
