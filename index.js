const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

const palettes = [
  { centre: "#d19aa5", edge: "#87525f", border: "#e5b2bd" },
  { centre: "#d2a782", edge: "#876246", border: "#ebc49c" },
  { centre: "#d5c68d", edge: "#887749", border: "#eee0a9" },
  { centre: "#94bba0", edge: "#567b63", border: "#b5d5bf" },
  { centre: "#8bbabd", edge: "#4e7c80", border: "#b1d9dc" },
  { centre: "#9aa8cb", edge: "#586889", border: "#c1cce7" },
  { centre: "#b09dc0", edge: "#706080", border: "#d2c1e2" },
  { centre: "#c99ab7", edge: "#815b75", border: "#e3b7d0" },
];
const circles = [];
const circleCount = 34;
let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  circles.length = 0;
  for (let i = 0; i < circleCount; i += 1) {
    const radius = 12 + Math.random() * 36;
    circles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      bob: 18 + Math.random() * 52,
      sway: 8 + Math.random() * 24,
      speed: 0.00035 + Math.random() * 0.00055,
      phase: Math.random() * Math.PI * 2,
      palette: palettes[i % palettes.length],
      outlined: i % 3 !== 0,
    });
  }
}

function draw(time) {
  ctx.clearRect(0, 0, width, height);

  for (const circle of circles) {
    const wave = time * circle.speed + circle.phase;
    const x = circle.x + Math.sin(wave * 0.65) * circle.sway;
    const y = circle.y + Math.sin(wave) * circle.bob;
    const fill = ctx.createRadialGradient(
      x - circle.radius * 0.18,
      y - circle.radius * 0.2,
      circle.radius * 0.08,
      x,
      y,
      circle.radius,
    );
    fill.addColorStop(0, circle.palette.centre);
    fill.addColorStop(1, circle.palette.edge);

    ctx.beginPath();
    ctx.arc(x, y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

    if (circle.outlined) {
      const border = ctx.createLinearGradient(
        x - circle.radius,
        y - circle.radius,
        x + circle.radius,
        y + circle.radius,
      );
      border.addColorStop(0, circle.palette.border);
      border.addColorStop(1, circle.palette.edge);
      ctx.lineWidth = Math.max(1.5, circle.radius * 0.07);
      ctx.strokeStyle = border;
      ctx.stroke();
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(draw);
