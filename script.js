const ball = document.getElementById('ball');

// Controls
const boxSizeInput = document.getElementById('box-size');
const ballSizeInput = document.getElementById('ball-size');
const ballSpeedInput = document.getElementById('ball-speed');
const ballColorInput = document.getElementById('ball-color');
const bgColorInput = document.getElementById('bg-color');
const saveButton = document.getElementById('save-defaults');
const pauseButton = document.getElementById('pause-ball');
const removeAddButton = document.getElementById('toggle-ball');
const controls = document.querySelector('.controls');

const boxSizeValue = document.getElementById('box-size-value');
const ballSizeValue = document.getElementById('ball-size-value');
const ballSpeedValue = document.getElementById('ball-speed-value');
const ballColorValue = document.getElementById('ball-color-value');
const bgColorValue = document.getElementById('bg-color-value');
const soundEnabledInput = document.getElementById('sound-enabled');
const plinkSound = document.getElementById('plink-sound');

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

ballColorInput.addEventListener('input', (e) => {
  setCSSVar('--ball-color', e.target.value);
  ballColorValue.textContent = e.target.value;
});

bgColorInput.addEventListener('input', (e) => {
  setCSSVar('--bg-color', e.target.value);
  bgColorValue.textContent = e.target.value;
});

let soundInterval;

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

function initialize() {
  boxSizeInput.dispatchEvent(new Event('input'));
  ballSizeInput.dispatchEvent(new Event('input'));
  ballSpeedInput.dispatchEvent(new Event('input'));
  ballColorInput.dispatchEvent(new Event('input'));
  bgColorInput.dispatchEvent(new Event('input'));
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

    ballColorInput.value = defaults.ballColor;
    ballColorInput.dispatchEvent(new Event('input'));

    bgColorInput.value = defaults.bgColor;
    bgColorInput.dispatchEvent(new Event('input'));

    soundEnabledInput.checked = defaults.soundEnabled;
  }
}

initialize();
loadDefaults();

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

removeAddButton.addEventListener('click', () => {
  isBallVisible = !isBallVisible;
  if (isBallVisible) {
    ball.style.display = 'block';
    removeAddButton.textContent = 'Remove Ball';
  } else {
    ball.style.display = 'none';
    removeAddButton.textContent = 'Show Ball';
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