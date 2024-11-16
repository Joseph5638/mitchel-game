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
let ballX = window.innerWidth / 2;
let ballY = window.innerHeight / 2;
let ballSpeedX = 2.5;
let ballSpeedY = -2.5;
let paddleSpeed = 10;
let isMovingLeft = false;
let isMovingRight = false;
let isTouching = false;
let touchStartX = 0; // Starting touch position
let lives = 3;
let score = 0;

// Event Listeners for Start and Restart
startButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  gameContainer.style.display = "block";
  startGame();
});

restartButton.addEventListener("click", resetGame);

// Event Listeners for Buttons
leftButton.addEventListener("mousedown", () => (isMovingLeft = true));
leftButton.addEventListener("mouseup", () => (isMovingLeft = false));
rightButton.addEventListener("mousedown", () => (isMovingRight = true));
rightButton.addEventListener("mouseup", () => (isMovingRight = false));
leftButton.addEventListener("touchstart", () => (isMovingLeft = true));
leftButton.addEventListener("touchend", () => (isMovingLeft = false));
rightButton.addEventListener("touchstart", () => (isMovingRight = true));
rightButton.addEventListener("touchend", () => (isMovingRight = false));

// Event Listeners for Paddle Touch Controls
paddle.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isTouching = true;
  touchStartX = e.touches[0].clientX;
});

paddle.addEventListener("touchmove", (e) => {
  if (!isTouching) return;
  e.preventDefault();
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;
  paddleX += deltaX;

  // Keep paddle within boundaries
  if (paddleX < 0) paddleX = 0;
  if (paddleX > window.innerWidth - paddle.offsetWidth) {
    paddleX = window.innerWidth - paddle.offsetWidth;
  }

  paddle.style.left = `${paddleX}px`;
  touchStartX = touchX;
});

paddle.addEventListener("touchend", () => {
  isTouching = false;
});

// Keyboard Controls for Paddle
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") isMovingLeft = true;
  if (e.key === "ArrowRight") isMovingRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") isMovingLeft = false;
  if (e.key === "ArrowRight") isMovingRight = false;
});

// Paddle Movement
function movePaddle() {
  if (isMovingLeft && paddleX > 0) paddleX -= paddleSpeed;
  if (isMovingRight && paddleX < window.innerWidth - paddle.offsetWidth) {
    paddleX += paddleSpeed;
  }
  paddle.style.left = `${paddleX}px`;
  requestAnimationFrame(movePaddle);
}

// Ball Movement and Collision
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with walls
  if (ballX <= 0 || ballX >= window.innerWidth - ball.offsetWidth) {
    ballSpeedX *= -1;
  }

  if (ballY <= 0) {
    ballSpeedY *= -1;
  }

  // Ball collision with paddle
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

  // Ball falls below the paddle
  if (ballY >= window.innerHeight) {
    lives--;
    livesDisplay.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
      alert("Game Over! Try Again.");
      resetGame();
      return;
    }
    resetBall();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  requestAnimationFrame(moveBall);
}

// Reset Ball Position
function resetBall() {
  ballX = window.innerWidth / 2;
  ballY = window.innerHeight / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 2.5;
  ballSpeedY = -2.5;
}

// Reset Game
function resetGame() {
  lives = 3;
  score = 0;
  paddleX = window.innerWidth / 2 - paddle.offsetWidth / 2;
  resetBall();
  livesDisplay.textContent = `Lives: ${lives}`;
  scoreDisplay.textContent = `Score: ${score}`;
}

// Start the Game
function startGame() {
  resetGame();
  movePaddle();
  moveBall();
}
