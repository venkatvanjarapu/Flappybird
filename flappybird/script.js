const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// Bird variables
let birdX = 50;
let birdY = canvas.height / 2 - 15;
let birdSpeedY = 0;
const birdSize = 30;

// Gravity and lift force with reduced speed
const gravity = 0.7;
const lift = -10;

// Pipe variables
const pipeWidth = 50;
const pipeHeight = 200;
let pipes = [];

// Bird image
const birdImage = new Image();
birdImage.src = 'https://orig00.deviantart.net/a839/f/2015/213/c/a/flappy_bird_by_jubaaj-d93bpnj.png'; // Replace with the actual path to your bird image

// Game variables
let score = 0;
let isGameOver = false;

function drawBird() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(birdX, birdY, birdSize, birdSize);
    ctx.drawImage(birdImage, birdX, birdY, birdSize, birdSize);
}

function drawPipe(x, openingY) {
    ctx.fillStyle = "#008000";
    ctx.fillRect(x, 0, pipeWidth, openingY);
    ctx.fillRect(x, openingY + pipeHeight, pipeWidth, canvas.height - openingY - pipeHeight);
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    drawBird();

    // Draw pipes
    for (let i = 0; i < pipes.length; i++) {
        drawPipe(pipes[i].x, pipes[i].openingY);
    }

    // Display score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (isGameOver) {
        ctx.fillText("Game Over! Click to play again ", canvas.width / 2 - 120, canvas.height / 2);
        return;
    }

    // Update bird position
    birdY += birdSpeedY;
    birdSpeedY += gravity;

    // Generate pipes
    if (Math.random() < 0.01) {
        const openingY = Math.floor(Math.random() * (canvas.height - pipeHeight));
        pipes.push({ x: canvas.width, openingY });
    }

    // Update pipes position
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 5;

        // Check for collision with bird
        if (
            birdX < pipes[i].x + pipeWidth &&
            birdX + birdSize > pipes[i].x &&
            (birdY < pipes[i].openingY || birdY + birdSize > pipes[i].openingY + pipeHeight)
        ) {
            isGameOver = true;
        }

        // Check for passing pipes
        if (pipes[i].x + pipeWidth < birdX && !pipes[i].passed) {
            pipes[i].passed = true;
            score++;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    // Check for collision with top and bottom walls
    if (birdY < 0 || birdY + birdSize > canvas.height) {
        isGameOver = true;
    }

    requestAnimationFrame(draw);
}

function resetGame() {
    birdY = canvas.height / 2 - 15;
    birdSpeedY = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
}

// Handle mouse click to make the bird jump
canvas.addEventListener("click", function () {
    if (!isGameOver) {
        birdSpeedY = lift;
    } else {
        resetGame();
        draw();
    }
});

// Start the game loop
draw();
