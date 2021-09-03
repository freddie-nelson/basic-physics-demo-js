import Collider from "./Collider.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export default class Crate extends Collider {
  constructor(x, y) {
    super(x, y, 20, 50, 50, "sienna");

    // this.direction = Math.random() > 0.5 ? 1 : -1;

    // this.velY = Math.random() * 30 - 30;
    // this.velX = (Math.random() * 10 + 10) * this.direction;
  }

  draw() {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
    ctx.strokeStyle = "tan";
    ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);
    ctx.strokeStyle = "";
  }
}
