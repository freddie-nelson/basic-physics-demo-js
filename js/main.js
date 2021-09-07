import Particle from "./Particle.js";
import Crate from "./Crate.js";
import Collider from "./Collider.js";
import Gun from "./Gun.js";

window.IMMOVABLE_MASS = 10000;
window.FLOOR_HEIGHT = 100;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.mouse = {
  isPressed: false,
  x: 0,
  y: 0,
};

window.addEventListener("mousedown", () => (window.mouse.isPressed = true));
window.addEventListener("mouseup", () => (window.mouse.isPressed = false));

window.addEventListener("mousemove", (e) => {
  window.mouse.x = e.clientX;
  window.mouse.y = e.clientY;
});

window.keyboard = {
  isPressed: false,
  key: "",
};

window.addEventListener("keyup", () => {
  window.keyboard.isPressed = false;
});

window.addEventListener("keydown", (e) => {
  window.keyboard.isPressed = true;
  window.keyboard.key = e.key.toUpperCase();
});

let particles = [];

const handleParticles = () => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.update();
    p.draw();

    if (Date.now() - p.created > 300) {
      particles.splice(i, 1);
    }
  }
};

const createParticle = () => {
  particles.push(new Particle(window.mouse.x, window.mouse.y, Date.now()));
};

window.colliders = [];

const floor = new Collider(-50000, canvas.height - 100, window.IMMOVABLE_MASS, 100000, 100000, "green");

const handleColliders = () => {
  for (let i = 0; i < window.colliders.length; i++) {
    const c = window.colliders[i];

    c.update();
    c.collide();
    c.draw();
  }
};

const crates = [];
const initCrates = () => {
  let cols = 1;
  let shift = 0;

  for (let r = 1; r < 2; r++) {
    for (let i = 0; i < cols; i++) {
      const c = new Crate(
        canvas.width - (i + r) * 60 - 150 + shift,
        canvas.height - window.FLOOR_HEIGHT - r * 60 - 50
      );
      crates.push(c);
      //  console.log(`x: ${c.x}, y: ${c.y}`);
    }

    // if (shift) shift = 0;
    // else shift = 10;
    // cols -= r + 1;
  }
};
initCrates();

const gun = new Gun(50, canvas.height - window.FLOOR_HEIGHT - 30, 20, "gray");

let deltaTime = 0;
let lastFrameTime = Date.now();

const animate = () => {
  ctx.fillStyle = `rgba(0, 0, 0)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (window.mouse.isPressed && window.keyboard.isPressed && window.keyboard.key == "P") createParticle();
  handleParticles();

  handleColliders();

  floor.draw();

  gun.update();
  gun.draw();

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 40, 20);

  if (Date.now() - lastFrameTime > 0) deltaTime = Date.now() - lastFrameTime;
  lastFrameTime = Date.now();

  window.FPS = 1000 / deltaTime;

  ctx.font = "bold 16px arial";
  ctx.fillStyle = "white";
  ctx.fillText(`${Math.floor(window.FPS)}`, 5, 18);
};

setInterval(animate, 1000 / window.MAX_FPS);
