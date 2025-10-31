const ball = document.getElementById('ball');

// Controls
const boxSizeInput = document.getElementById('box-size');
const ballSizeInput = document.getElementById('ball-size');
const ballSpeedInput = document.getElementById('ball-speed');
const ballColorInput = document.getElementById('ball-color');
const bgColorInput = document.getElementById('bg-color');
const saveButton = document.getElementById('save-defaults');
const pauseButton = document.getElementById('pause-ball');
const toggleBallButton = document.getElementById('toggle-ball');
const controls = document.querySelector('.controls');

const boxSizeValue = document.getElementById('box-size-value');
const ballSizeValue = document.getElementById('ball-size-value');
const ballSpeedValue = document.getElementById('ball-speed-value');
const ballColorValue = document.getElementById('ball-color-value');
const bgColorValue = document.getElementById('bg-color-value');
const soundEnabledInput = document.getElementById('sound-enabled');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

boxSizeInput.max = screen.width;

function setCSSVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

const soundOffset = 50; // ms

function updateBallAnimation() {
  const boxSize = parseInt(boxSizeInput.value, 10);
  const ballSize = parseInt(ballSizeInput.value, 10);
  const speed = parseInt(ballSpeedInput.value, 10);

  const distance = boxSize - ballSize;
  if (distance <= 0 || speed <= 0) {
    setCSSVar('--ball-speed', '0s'); // Or some other sensible default to stop animation
    ballSpeedValue.textContent = `${speed}px/s`;
    return;
  }

  const duration = distance / speed;
  setCSSVar('--ball-speed', `${duration}s`);
  ballSpeedValue.textContent = `${speed}px/s`;

  clearInterval(soundInterval);
  soundInterval = setInterval(playSound, duration * 1000 - soundOffset);
}

boxSizeInput.addEventListener('input', (e) => {
  const size = `${e.target.value}px`;
  setCSSVar('--box-size', size);
  boxSizeValue.textContent = size;
  updateBallAnimation();
});

ballSizeInput.addEventListener('input', (e) => {
  const size = `${e.target.value}px`;
  setCSSVar('--ball-size', size);
  ballSizeValue.textContent = size;
  updateBallAnimation();
});

ballSpeedInput.addEventListener('input', updateBallAnimation);

function updateBallColor(color) {
  setCSSVar('--ball-color', color);
  ballColorValue.textContent = color;
  ballColorInput.value = color;
}

function updateBgColor(color) {
  setCSSVar('--bg-color', color);
  bgColorValue.textContent = color;
  bgColorInput.value = color;
}

ballColorInput.addEventListener('input', (e) => updateBallColor(e.target.value));

bgColorInput.addEventListener('input', (e) => updateBgColor(e.target.value));

let soundInterval;

function playSound() {
  if (soundEnabledInput.checked) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
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

function initialize() {
  boxSizeInput.dispatchEvent(new Event('input'));
  ballSizeInput.dispatchEvent(new Event('input'));
  ballSpeedInput.dispatchEvent(new Event('input'));
  updateBallColor(ballColorInput.value);
  updateBgColor(bgColorInput.value);
  updateBallAnimation();
}

function loadDefaults() {
  const defaults = JSON.parse(localStorage.getItem('emdr-defaults'));
  if (defaults) {
    boxSizeInput.value = defaults.boxSize;
    boxSizeInput.dispatchEvent(new Event('input'));

    ballSizeInput.value = defaults.ballSize;
    ballSizeInput.dispatchEvent(new Event('input'));

    ballSpeedInput.value = defaults.ballSpeed;
    ballSpeedInput.dispatchEvent(new Event('input'));

    updateBallColor(defaults.ballColor);

    updateBgColor(defaults.bgColor);

    soundEnabledInput.checked = defaults.soundEnabled;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initialize();
  loadDefaults();
});

let isPaused = false;

pauseButton.addEventListener('click', () => {
  isPaused = !isPaused;
  if (isPaused) {
    ball.style.animationPlayState = 'paused';
    pauseButton.textContent = 'Resume';
    clearInterval(soundInterval);
  } else {
    ball.style.animationPlayState = 'running';
    pauseButton.textContent = 'Pause';
    const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ball-speed'));
    soundInterval = setInterval(playSound, duration * 1000 - soundOffset);
  }
});

let isBallVisible = true;

toggleBallButton.addEventListener('click', () => {
  isBallVisible = !isBallVisible;
  if (isBallVisible) {
    ball.style.display = 'block';
    toggleBallButton.textContent = 'Remove Ball';
  } else {
    ball.style.display = 'none';
    toggleBallButton.textContent = 'Show Ball';
  }
});

let fadeOutTimer;

function showControls() {
  controls.classList.remove('fade-out');
}

function hideControls() {
  controls.classList.add('fade-out');
}

function resetFadeOutTimer() {
  clearTimeout(fadeOutTimer);
  showControls();
  fadeOutTimer = setTimeout(hideControls, 2000);
}

document.addEventListener('mousemove', resetFadeOutTimer);

resetFadeOutTimer();