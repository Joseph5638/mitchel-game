const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const restartButton = document.getElementById('restart-button');
const livesText = document.getElementById('lives');
const scoreText = document.getElementById('score');

// Load sound effects
const bounceSound = new Audio('bounce.mp3');
const missSound = new Audio('miss.mp3');

let paddleSpeed = 8;
let ballSpeed = 3.5;
let ballDirectionX = 1;
let ballDirectionY = 1;
let ballX = 190;
let ballY = 0;
let paddleX = 160;
let movingLeft = false;
let movingRight = false;
let lives = 3;
let score = 0;

// Show the game screen after the welcome screen
startButton.addEventListener('click', () => {
  welcomeScreen.style.display = 'none'; // Hide the welcome screen
  gameContainer.style.display = 'block'; // Show the game
  movePaddle();
  moveBall();
});

// Paddle movement logic
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') movingLeft = true;
  if (event.key === 'ArrowRight') movingRight = true;
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') movingLeft = false;
  if (event.key === 'ArrowRight') movingRight = false;
});

function movePaddle() {
  if (movingLeft && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
  if (movingRight && paddleX < 320) {
    paddleX += paddleSpeed;
  }
  paddle.style.left = `${paddleX}px`;
  paddle.style.transition = 'left 0.1s ease'; // Smooth paddle movement animation

  requestAnimationFrame(movePaddle);
}

function moveBall() {
  ballX += ballSpeed * ballDirectionX;
  ballY += ballSpeed * ballDirectionY;

  // Bounce off walls with a bounce effect
  if (ballX <= 0 || ballX >= 380) {
    ballDirectionX *= -1;
    bounceSound.play();
    ball.style.animation = 'bounce 0.2s ease-out'; // Bounce animation for ball
    setTimeout(() => ball.style.animation = '', 200); // Reset animation
  }
  if (ballY <= 0) {
    ballDirectionY *= -1;
    bounceSound.play();
    ball.style.animation = 'bounce 0.2s ease-out'; // Ball bounce animation
    setTimeout(() => ball.style.animation = '', 200); // Reset animation
  }

  // Check for paddle collision and interaction
  if (
    ballY >= 570 &&
    ballX >= paddleX &&
    ballX <= paddleX + 80
  ) {
    const hitPosition = (ballX - paddleX) / 80;
    ballDirectionX = hitPosition - 0.5;
    if (ballDirectionY > 0) ballDirectionY *= -1;
    ballSpeed += 0.25;
    bounceSound.play();
    ball.style.animation = 'bounce 0.2s ease-out';
    setTimeout(() => ball.style.animation = '', 200);
    
    // Increase score with a small animation
    score += 10;
    scoreText.classList.add('pulse'); // Trigger pulse effect for score
    setTimeout(() => scoreText.classList.remove('pulse'), 300); // Remove pulse after animation

    console.log(`Score: ${score}`);
  }

  if (ballY > 600) {
    lives -= 1;
    if (lives > 0) {
      alert(`You missed! Lives remaining: ${lives}`);
    } else {
      alert(`Game Over! Final Score: ${score}`);
      restartGame();
      return;
    }
    
    // Update lives text with animation
    livesText.classList.add('shake'); // Trigger shake effect for lives
    setTimeout(() => livesText.classList.remove('shake'), 300); // Reset animation

    ballX = 190;
    ballY = 0;
    ballDirectionY = 1;
    ballDirectionX = 1;
    ballSpeed = 3.5;
    missSound.play();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  requestAnimationFrame(moveBall);
}

function restartGame() {
  ballX = 190;
  ballY = 0;
  ballDirectionX = 1;
  ballDirectionY = 1;
  paddleX = 160;
  ballSpeed = 3.5;
  lives = 3;
  score = 0;

  paddle.style.left = `${paddleX}px`;
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  moveBall();
}

restartButton.addEventListener('click', restartGame);
