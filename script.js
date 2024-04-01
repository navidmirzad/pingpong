// Model
class Ball {
  constructor(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.speedIncrement = 0.5; // Speed increment on each hit
  }

  update(leftPaddle, rightPaddle) {
    this.x += this.dx;
    this.y += this.dy;

    // Check collision with walls
    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    // Check collision with paddles
    if (
      this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
      this.y >= leftPaddle.y &&
      this.y <= leftPaddle.y + leftPaddle.height
    ) {
      this.dx = -this.dx;
      this.dx += this.speedIncrement; // Increase speed
    }

    if (
      this.x + this.radius >= rightPaddle.x &&
      this.y >= rightPaddle.y &&
      this.y <= rightPaddle.y + rightPaddle.height
    ) {
      this.dx = -this.dx;
      this.dx -= this.speedIncrement; // Increase speed
    }
  }
}

class Paddle {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
  }

  moveUp() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.y = 0;
    }
  }

  moveDown() {
    this.y += this.speed;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
    }
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

// View
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(ball, leftPaddle, rightPaddle) {
    this.clearCanvas();
    this.context.fillStyle = "black";
    this.context.beginPath();
    this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();

    leftPaddle.draw();
    rightPaddle.draw();
  }
}

// Controller
class GameController {
  constructor(ball, leftPaddle, rightPaddle, renderer) {
    this.ball = ball;
    this.leftPaddle = leftPaddle;
    this.rightPaddle = rightPaddle;
    this.renderer = renderer;

    this.pressedKeys = new Set();

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    this.pressedKeys.add(event.key);
  }

  handleKeyUp(event) {
    this.pressedKeys.delete(event.key);
  }

  updatePaddles() {
    if (this.pressedKeys.has("w")) {
      this.leftPaddle.moveUp();
    }
    if (this.pressedKeys.has("s")) {
      this.leftPaddle.moveDown();
    }
    if (this.pressedKeys.has("ArrowUp")) {
      this.rightPaddle.moveUp();
    }
    if (this.pressedKeys.has("ArrowDown")) {
      this.rightPaddle.moveDown();
    }
  }

  update() {
    this.updatePaddles();
    this.ball.update(this.leftPaddle, this.rightPaddle);
    this.renderer.render(this.ball, this.leftPaddle, this.rightPaddle);
    requestAnimationFrame(this.update.bind(this));
  }
}

// Initialize
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 2, 2);
const leftPaddle = new Paddle(20, canvas.height / 2 - 50, 10, 100, "blue", 5);
const rightPaddle = new Paddle(
  canvas.width - 30,
  canvas.height / 2 - 50,
  10,
  100,
  "red",
  5
);
const renderer = new Renderer(canvas);
const gameController = new GameController(
  ball,
  leftPaddle,
  rightPaddle,
  renderer
);

gameController.update();
