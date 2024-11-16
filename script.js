// Elements
const startButton = document.getElementById("start-button");
const welcomeScreen = document.getElementById("welcome-screen");
const gameContainer = document.getElementById("game-container");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");
const restartButton = document.getElementById("restart-button");
const livesDisplay = document.getElementById("lives");
const scoreDisplay = document.getElementById("score");

// Game Variables
let paddleX = parseInt(window.getComputedStyle(paddle).left);
let ballX = 0;
let ballY = 0;
let ballSpeedX = 3;
let ballSpeedY = -3;
let paddleSpeed = 10;
let lives = 3;
let score = 0;
let isMovingLeft = false;
let isMovingRight = false;

// Start Game
startButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  gameContainer.style.display = "block";
  startGame();
});

// Restart Game
restartButton.addEventListener("click", () => {
  resetGame();
});

// Paddle Controls
leftButton.addEventListener("mousedown", () => (isMovingLeft = true));
leftButton.addEventListener("mouseup", () => (isMovingLeft = false));
rightButton.addEventListener("mousedown", () => (isMovingRight = true));
rightButton.addEventListener("mouseup", () => (isMovingRight = false));

// Paddle Touch Controls
paddle.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX));
paddle.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  paddleX += touchX - touchStartX;
  touchStartX = touchX;
  updatePaddlePosition();
});

// Move Paddle
function updatePaddlePosition() {
  if (isMovingLeft && paddleX > 0) paddleX -= paddleSpeed;
  if (isMovingRight && paddleX < window.innerWidth - paddle.offsetWidth)
    paddleX += paddleSpeed;
  paddle.style.left = `${paddleX}px`;
  requestAnimationFrame(updatePaddlePosition);
}

// Ball Logic
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 0 || ballX >= window.innerWidth - ball.offsetWidth) ballSpeedX *= -1;
  if (ballY <= 0) ballSpeedY *= -1;

  // Collision with paddle
  const paddleRect = paddle.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();
  if (
    ballRect.bottom >= paddleRect.top &&
    ballRect.right >= paddleRect.left &&
    ballRect.left <= paddleRect.right
  ) {
    ballSpeedY *= -1;
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  // Ball falls below
  if (ballY >= window.innerHeight) {
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`;
    if (lives <= 0) resetGame();
    ballX = window.innerWidth / 2;
    ballY = window.innerHeight / 2;
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  requestAnimationFrame(moveBall);
}

// Reset Game
function resetGame() {
  lives = 3;
  score = 0;
  ballX = window.innerWidth / 2;
  ballY = window.innerHeight / 2;
  ballSpeedX = 3;
  ballSpeedY = -3;
  livesDisplay.textContent = `Lives: ${lives}`;
  scoreDisplay.textContent = `Score: ${score}`;
}

// Start the Game Logic
function startGame() {
  resetGame();
  moveBall();
  updatePaddlePosition();
}
