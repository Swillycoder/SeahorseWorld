const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const bg_img = new Image();
bg_img.src = 'https://raw.githubusercontent.com/Swillycoder/SeahorseWorld/main/bg.png';

const seahorse_img = new Image();
seahorse_img.src = 'https://raw.githubusercontent.com/Swillycoder/SeahorseWorld/main/seahorse.png';

const crispbag_img = new Image();
crispbag_img.src = 'https://raw.githubusercontent.com/Swillycoder/SeahorseWorld/main/crispbag.png';

const bottle_img = new Image();
bottle_img.src = 'https://raw.githubusercontent.com/Swillycoder/SeahorseWorld/main/bottle.png';

const exit_img = new Image();
exit_img.src = 'https://raw.githubusercontent.com/Swillycoder/SeahorseWorld/main/exit_screen.png';

const intro_img = new Image();
intro_img.src = 'https://raw.githubusercontent.com/Swillycoder/SeahorseWorld/main/intro_bg.png';

let mouseX = 0;
let mouseY = 0;
let mouseClicked = false;
const keys = {
    Space: false,
    KeyP: false
};

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 64;
        this.speed = 2;
        this.angle = 0;
        this.image = seahorse_img
    }

    update() {
        if (mouseClicked && mouseY < 500) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy); // Distance to the mouse click

            // Move the player towards the mouse
            if (distance > this.speed) {
                // Normalize direction and apply speed
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                // If close enough, move directly to the target position
                this.x = mouseX;
                this.y = mouseY;
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y)
    }
}

class Trash {
    constructor(x, y,speedX, speedY, image, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image = image
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y)
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) {
            this.resetX();
        }
        if (this.y > canvas.height - 125) {
            this.resetY();
        }
    }

    resetX() {
        this.x = -this.width; // Start off the left side
        this.y = Math.random() * (canvas.height - this.height); // Random y position
    }

    resetY(){
        this.y = -this.height;
        this.x = Math.random() * (canvas.width - this.width);
    }
}

const player = new Player(canvas.width / 2, canvas.height / 2);
let trashArray1 = [];
let trashArray2 = [];
let crispbagScore = 0
let bottleScore = 0

// Function to spawn trash
function spawnTrash(array, x, y,speedX, speedY, image, width, height) {
    let newTrash = new Trash(
        x, 
        y, 
        speedX,
        speedY,
        image,
        width,
        height,
    );
    array.push(newTrash);
}

for (let i = 0; i < 10; i++) {
    spawnTrash(trashArray1, 
        Math.random() * (canvas.width - 25) - canvas.width,
        Math.random() * (canvas.height - 150),
        1,
        0,
        crispbag_img,
        50,
        50,
)};
    for (let i = 0; i < 5; i++) {
    spawnTrash(trashArray2,
        Math.random() * (canvas.width - 25),
        Math.random() * (canvas.height - 25) - canvas.height,
        0,
        1,
        bottle_img,
        50,
        50,
)};

function gameStart() {
    ctx.drawImage(intro_img,0,0);
}

function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

const countdownDuration = 10 * 1000; // 10 seconds
const endTime = Date.now() + countdownDuration;

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}`;
  }

function timerText() {
    const currentTime = Date.now();
    const remainingTime = Math.max(0, endTime - currentTime);
    ctx.font = '40px Impact';
    ctx.fillStyle = 'red';
    ctx.fillText(formatTime(remainingTime), 212, 553);
    if (remainingTime <= 0) {
        gameOverMessage();
    }
}

function gameOverMessage () {
    ctx.drawImage(exit_img, 0,0)
    ctx.font = '40px Impact';
    ctx.textAlign = 'center'
    ctx.fillStyle = 'yellow'
    ctx.fillText(`${crispbagScore}`, 288, 289);
    ctx.fillText(`${bottleScore}`, 564, 285);
    gameOver = true
    requestAnimationFrame(gameOverMessage);
}

function scoreText() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Impact';
    ctx.fillText(`${bottleScore}`, 660, 538);
    ctx.fillText(`${crispbagScore}`, 660, 580);
}

let gameOver = true

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.fillStyle = 'skyblue';
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg_img, 0, 0)
        // Update and draw all trash items
        for (let i = trashArray1.length - 1; i >= 0; i--) {
            let trash = trashArray1[i];
            if (isColliding(player, trash)) {
                crispbagScore += 1
                trashArray1.splice(i, 1); // Remove collided object
                spawnTrash(trashArray1, Math.random() * (canvas.width - 25) - canvas.width, Math.random() * (canvas.height - 125),
                1, 0, crispbag_img, 50, 50);
                continue; // Skip further processing for this trash
                
            }
            trash.update();
            trash.draw();
        }

        for (let i = trashArray2.length - 1; i >= 0; i--) {
            let trash = trashArray2[i];
            if (isColliding(player, trash)) {
                bottleScore += 1
                trashArray2.splice(i, 1); // Remove collided object
                spawnTrash(trashArray2, Math.random() * (canvas.width - 25), Math.random() * (canvas.height - 25) - canvas.height,
                0, 1, bottle_img, 50,50);
                continue; // Skip further processing for this trash
                
            }
            trash.update();
            trash.draw();
        }

        player.update();
        player.draw(ctx);
        timerText();
        scoreText();
        requestAnimationFrame(gameLoop);
    }
}

gameStart();

// Handle mouse click event
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    mouseClicked = true;
});

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
    if (e.code === 'Space' && gameOver) {
        gameOver = false;
        gameLoop();
    }
    if (e.code === 'KeyP' && gameOver) {
        location.reload();
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});
