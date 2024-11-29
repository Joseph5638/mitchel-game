// Existing elements
const startButton = document.getElementById("start-button");
const settingsButton = document.getElementById("settings-button");
const backButton = document.getElementById("back-button");
const welcomeScreen = document.getElementById("welcome-screen");
const settingsScreen = document.getElementById("settings-screen");
const gameContainer = document.getElementById("game-container");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");
const restartButton = document.getElementById("restart-button");
const pauseButton = document.getElementById("pause-button");
const livesDisplay = document.getElementById("lives");
const scoreDisplay = document.getElementById("score");
const easyButton = document.getElementById("easy-button");
const mediumButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");

// New exit button element
const exitButton = document.getElementById("exit-button");

// Add event listener for exit button
exitButton.addEventListener("click", () => {
  gameContainer.style.display = "none";
  welcomeScreen.style.display = "flex";
  resetGame(); // Optionally reset the game
});

// Existing game variables
let paddleX = parseInt(window.getComputedStyle(paddle).left);
let ballX = window.innerWidth / 2;
let ballY = window.innerHeight / 2;
let ballSpeedX = 2.5;
let ballSpeedY = -2.5;
let paddleSpeed = 10;
let isMovingLeft = false;
let isMovingRight = false;
let isPaused = false;
let lives = 3;
let score = 0;

// Event Listeners for Navigation
startButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  gameContainer.style.display = "block";
  startGame();
});

settingsButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  settingsScreen.style.display = "block";
});

backButton.addEventListener("click", () => {
  settingsScreen.style.display = "none";
  welcomeScreen.style.display = "flex";
});

// Event Listeners for Difficulty Selection
easyButton.addEventListener("click", () => setDifficulty(1.5, 8));
mediumButton.addEventListener("click", () => setDifficulty(2.5, 10));
hardButton.addEventListener("click", () => setDifficulty(6, 15));

function setDifficulty(ballSpeed, paddleSpd) {
  ballSpeedY = -ballSpeed;
  paddleSpeed = paddleSpd;
  alert(`Difficulty set! Ball Speed: ${ballSpeed}, Paddle Speed: ${paddleSpeed}`);
  settingsScreen.style.display = "none";
  welcomeScreen.style.display = "flex";
}

// Event Listeners for Start and Restart
restartButton.addEventListener("click", resetGame);
pauseButton.addEventListener("click", togglePause);

function togglePause() {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";

  if (!isPaused) {
    movePaddle();
    moveBall();
  }
}

// Event Listeners for Buttons
leftButton.addEventListener("mousedown", () => (isMovingLeft = true));
leftButton.addEventListener("mouseup", () => (isMovingLeft = false));
rightButton.addEventListener("mousedown", () => (isMovingRight = true));
rightButton.addEventListener("mouseup", () => (isMovingRight = false));

function movePaddle() {
  if (isPaused) return;
  if (isMovingLeft && paddleX > 0) paddleX -= paddleSpeed;
  if (isMovingRight && paddleX < window.innerWidth - paddle.offsetWidth) paddleX += paddleSpeed;
  paddle.style.left = `${paddleX}px`;
  requestAnimationFrame(movePaddle);
}

function moveBall() {
  if (isPaused) return;
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 0 || ballX >= window.innerWidth - ball.offsetWidth) ballSpeedX *= -1;
  if (ballY <= 0) ballSpeedY *= -1;

  const paddleRect = paddle.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();

  if (
    ballRect.bottom >= paddleRect.top &&
    ballRect.right >= paddleRect.left &&
    ballRect.left <= paddleRect.right &&
    ballSpeedY > 0
  ) {
    ballSpeedY *= -1;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  if (ballY >= window.innerHeight) {
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
      alert("Game Over!");
      resetGame();
      return;
    }
    resetBall();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  requestAnimationFrame(moveBall);
}

function resetBall() {
  ballX = window.innerWidth / 2;
  ballY = window.innerHeight / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 2.5;
  ballSpeedY = -2.5;
}

function resetGame() {
  lives = 3;
  score = 0;
  livesDisplay.textContent = `Lives: ${lives}`;
  scoreDisplay.textContent = `Score: ${score}`;
  resetBall();
}

function startGame() {
  resetGame();
  movePaddle();
  moveBall();
}

// Add enemy elements
const enemies = document.querySelectorAll(".enemy");

// Initialize enemy positions
let enemyPositions = [
  { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
  { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
  { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
];

// Function to move enemies
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.style.left = `${enemyPositions[index].x}px`;
    enemy.style.top = `${enemyPositions[index].y}px`;

    // Move enemies in random directions
    enemyPositions[index].x += (Math.random() * 4 - 2);
    enemyPositions[index].y += (Math.random() * 4 - 2);

    // Collision detection with ball
    const ballRect = ball.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    if (enemyRect.left < ballRect.right && enemyRect.right > ballRect.left &&
        enemyRect.top < ballRect.bottom && enemyRect.bottom > ballRect.top) {
      loseLife();
    }
  });
  requestAnimationFrame(moveEnemies);
}

// Function to handle losing a life
function loseLife() {
  lives--;
  livesDisplay.textContent = `Lives: ${lives}`;
  if (lives <= 0) {
    alert("Game Over!");
    resetGame();
  }
  resetBall();
}

// Call moveEnemies to start the enemy movements
moveEnemies();

// Add block container element
const blockContainer = document.getElementById("block-container");

// Function to create a new block
function createBlock() {
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
  blockContainer.appendChild(block);

  // Remove block after animation
  setTimeout(() => {
    block.remove();
  }, 5000); // Assuming the block takes 5 seconds to fall
}

// Function to check collision between ball and blocks
function checkBlockCollision() {
  const blocks = document.querySelectorAll(".block");
  const ballRect = ball.getBoundingClientRect();

  blocks.forEach(block => {
    const blockRect = block.getBoundingClientRect();
    if (
      ballRect.left < blockRect.right &&
      ballRect.right > blockRect.left &&
      ballRect.top < blockRect.bottom &&
      ballRect.bottom > blockRect.top
    ) {
      // Reverse ball's direction unpredictably
      ballSpeedX = (Math.random() * 4 - 2) * 1.5;
      ballSpeedY *= -1.5;
      block.remove(); // Remove the block after collision
    }
  });
}

// Generate new blocks at random intervals
setInterval(createBlock, 2000); // Create a block every 2 seconds

// Modify moveBall function to include collision check
function moveBall() {
  if (isPaused) return;
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 0 || ballX >= window.innerWidth - ball.offsetWidth) ballSpeedX *= -1;
  if (ballY <= 0) ballSpeedY *= -1;

  const paddleRect = paddle.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();

  if (
    ballRect.bottom >= paddleRect.top &&
    ballRect.right >= paddleRect.left &&
    ballRect.left <= paddleRect.right &&
    ballSpeedY > 0
  ) {
    ballSpeedY *= -1;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  if (ballY >= window.innerHeight) {
    loseLife();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  checkBlockCollision(); // Check for block collisions

  requestAnimationFrame(moveBall);
}

function loseLife() {
  lives--;
  livesDisplay.textContent = `Lives: ${lives}`;
  if (lives <= 0) {
    alert("Game Over!");
    resetGame();
  }
  resetBall();
}

