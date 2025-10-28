const canvas = document.getElementById('box');
const ctx = canvas.getContext('2d');
const stage = document.querySelector('.stage');

let W = canvas.width;
let H = canvas.height;

let radius = 20;
let x = radius + 10; // start near left
let y = H / 2;
let vx = 200; // pixels per second (positive -> right)
let ballColor = '#ff5722';

let last = performance.now();

function draw() {
  ctx.clearRect(0, 0, W, H);

  // draw ball
  ctx.beginPath();
  ctx.fillStyle = ballColor;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // draw left/right guidelines (optional)
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
}

function step(now) {
  const dt = (now - last) / 1000; // seconds
  last = now;

  // update position horizontally only
  x += vx * dt;

  // bounce on left/right edges
  if (x + radius >= W) {
    x = W - radius;
    vx = -Math.abs(vx);
    playSound();
  } else if (x - radius <= 0) {
    x = radius;
    vx = Math.abs(vx);
    playSound();
  }

  draw();
  requestAnimationFrame(step);
}

requestAnimationFrame(step);

// Optional: click to toggle direction
canvas.addEventListener('click', () => { vx = -vx; });

// Controls
const boxSizeInput = document.getElementById('box-size');
const ballSizeInput = document.getElementById('ball-size');
const ballSpeedInput = document.getElementById('ball-speed');
const ballColorInput = document.getElementById('ball-color');
const bgColorInput = document.getElementById('bg-color');
const saveButton = document.getElementById('save-defaults');

const boxSizeValue = document.getElementById('box-size-value');
const ballSizeValue = document.getElementById('ball-size-value');
const ballSpeedValue = document.getElementById('ball-speed-value');
const ballColorValue = document.getElementById('ball-color-value');
const bgColorValue = document.getElementById('bg-color-value');
const soundEnabledInput = document.getElementById('sound-enabled');
const plinkSound = document.getElementById('plink-sound');

boxSizeInput.max = screen.width;

function updateBoxSize(size) {
  W = size;
  H = size;
  canvas.width = W;
  canvas.height = H;
  stage.style.width = `${size}px`;
  stage.style.height = `${size}px`;
  y = H / 2;
  boxSizeInput.value = size;
  boxSizeValue.textContent = `${size}px`;
}

boxSizeInput.addEventListener('input', (e) => {
  const size = parseInt(e.target.value, 10);
  updateBoxSize(size);
});

ballSizeInput.addEventListener('input', (e) => {
  radius = parseInt(e.target.value, 10);
  ballSizeValue.textContent = `${radius}px`;
});

ballSpeedInput.addEventListener('input', (e) => {
  const speed = parseInt(e.target.value, 10);
  vx = vx > 0 ? speed : -speed;
  ballSpeedValue.textContent = `${speed}px/s`;
});

ballColorInput.addEventListener('input', (e) => {
  ballColor = e.target.value;
  ballColorValue.textContent = ballColor;
});

bgColorInput.addEventListener('input', (e) => {
  canvas.style.backgroundColor = e.target.value;
  bgColorValue.textContent = e.target.value;
});

function playSound() {
  if (soundEnabledInput.checked) {
    plinkSound.currentTime = 0;
    plinkSound.play();
  }
}

saveButton.addEventListener('click', () => {
  const defaults = {
    boxSize: boxSizeInput.value,
    ballSize: ballSizeInput.value,
    ballSpeed: ballSpeedInput.value,
    ballColor: ballColorInput.value,
    bgColor: bgColorInput.value,
    soundEnabled: soundEnabledInput.checked,
  };
  localStorage.setItem('emdr-defaults', JSON.stringify(defaults));
});

function loadDefaults() {
  const defaults = JSON.parse(localStorage.getItem('emdr-defaults'));
  if (defaults) {
    updateBoxSize(parseInt(defaults.boxSize, 10));
    
    radius = parseInt(defaults.ballSize, 10);
    ballSizeInput.value = radius;
    ballSizeValue.textContent = `${radius}px`;

    const speed = parseInt(defaults.ballSpeed, 10);
    vx = vx > 0 ? speed : -speed;
    ballSpeedInput.value = speed;
    ballSpeedValue.textContent = `${speed}px/s`;

    ballColor = defaults.ballColor;
    ballColorInput.value = ballColor;
    ballColorValue.textContent = ballColor;

    canvas.style.backgroundColor = defaults.bgColor;
    bgColorInput.value = defaults.bgColor;
    bgColorValue.textContent = defaults.bgColor;

    soundEnabledInput.checked = defaults.soundEnabled;
  }
}

loadDefaults();