const player = document.getElementById('player');
const maze = document.getElementById('maze');
const scaryContainer = document.getElementById('scaryContainer');
const face1 = document.getElementById('scaryFace1');
const face2 = document.getElementById('scaryFace2');
const levelComplete = document.getElementById('levelComplete');
const levelComplete1 = document.getElementById('levelComplete1');
const levelComplete2 = document.getElementById('levelComplete2');
const levelComplete3 = document.getElementById('levelComplete3');
const levelIndicator = document.getElementById('levelIndicator');

let dragging = false;
let currentLevel = 1;
let walls = [];

const levels = {
    1: [
        { top: '20%', left: '0', width: '80%', height: '5%' },
        { top: '40%', left: '20%', width: '80%', height: '5%' },
        { top: '60%', left: '0', width: '70%', height: '5%' }
    ],
    2: [
        { top: '15%', left: '0', width: '85%', height: '4%' },
        { top: '35%', left: '10%', width: '80%', height: '4%' },
        { top: '50%', left: '0', width: '75%', height: '4%' },
        { top: '70%', left: '5%', width: '85%', height: '4%' },
        { top: '85%', left: '0', width: '90%', height: '4%' }
    ],
    3: [
        { top: '10%', left: '0', width: '90%', height: '3%' },
        { top: '25%', left: '5%', width: '85%', height: '3%' },
        { top: '40%', left: '10%', width: '80%', height: '3%' },
        { top: '55%', left: '0', width: '75%', height: '3%' },
        { top: '70%', left: '5%', width: '85%', height: '3%' },
        { top: '80%', left: '0', width: '90%', height: '3%' },
        { top: '90%', left: '10%', width: '80%', height: '3%' }
    ]
};

function createWalls(level) {
    walls.forEach(w => maze.removeChild(w));
    walls = [];
    levels[level].forEach(data => {
        const wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.top = data.top;
        wall.style.left = data.left;
        wall.style.width = data.width;
        wall.style.height = data.height;
        maze.appendChild(wall);
        walls.push(wall);
    });
}

function startLevel(level) {
    currentLevel = level;
    levelIndicator.textContent = 'Level: ' + level;
    resetPlayer();
    createWalls(level);
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const mazeRect = maze.getBoundingClientRect();

    if (playerRect.left < mazeRect.left || playerRect.top < mazeRect.top ||
        playerRect.right > mazeRect.right || playerRect.bottom > mazeRect.bottom) {
        triggerScary('border');
        return;
    }

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        if (!(playerRect.right < wallRect.left || playerRect.left > wallRect.right ||
            playerRect.bottom < wallRect.top || playerRect.top > wallRect.bottom)) {
            triggerScary('wall');
            return;
        }
    }

    const exitRect = document.getElementById('exit').getBoundingClientRect();
    if (!(playerRect.right < exitRect.left || playerRect.left > exitRect.right ||
        playerRect.bottom < exitRect.top || playerRect.top > exitRect.bottom)) {
        showLevelComplete(currentLevel);
    }
}

function triggerScary(type) {
    face1.style.display = 'none';
    face2.style.display = 'none';
    if (type === 'wall') face1.style.display = 'block';
    if (type === 'border') face2.style.display = 'block';
    scaryContainer.style.display = 'flex';
    setTimeout(() => {
        scaryContainer.style.display = 'none';
        resetPlayer();
    }, 2500);
}

function resetPlayer() {
    player.style.top = '0';
    player.style.left = '0';
}

function showLevelComplete(level) {
    levelComplete1.style.display = 'none';
    levelComplete2.style.display = 'none';
    levelComplete3.style.display = 'none';
    if (level === 1) levelComplete1.style.display = 'block';
    if (level === 2) levelComplete2.style.display = 'block';
    if (level === 3) levelComplete3.style.display = 'block';
    levelComplete.style.display = 'flex';
    levelComplete.style.opacity = 0;
    let displayTime = (level === 3) ? 4000 : 2000;
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        if (opacity >= 1) {
            opacity = 1;
            clearInterval(fadeIn);
        }
        levelComplete.style.opacity = opacity;
    }, 30);
    setTimeout(() => {
        let fadeOutOpacity = 1;
        const fadeOut = setInterval(() => {
            fadeOutOpacity -= 0.05;
            if (fadeOutOpacity <= 0) {
                fadeOutOpacity = 0;
                clearInterval(fadeOut);
                levelComplete.style.display = 'none';
                if (level < 3) {
                    startLevel(level + 1);
                } else {
                    startLevel(1);
                }
            }
            levelComplete.style.opacity = fadeOutOpacity;
        }, 30);
    }, displayTime);
}

function dragMove(e) {
    if (!dragging) return;
    e.preventDefault();
    let touch = e.touches ? e.touches[0] : e;
    const mazeRect = maze.getBoundingClientRect();
    let x = touch.clientX - mazeRect.left - player.offsetWidth / 2;
    let y = touch.clientY - mazeRect.top - player.offsetHeight / 2;
    x = Math.max(0, Math.min(x, maze.offsetWidth - player.offsetWidth));
    y = Math.max(0, Math.min(y, maze.offsetHeight - player.offsetHeight));
    player.style.left = x + 'px';
    player.style.top = y + 'px';
    checkCollision();
}

player.addEventListener('mousedown', () => dragging = true);
player.addEventListener('touchstart', () => dragging = true);
document.addEventListener('mouseup', () => dragging = false);
document.addEventListener('touchend', () => dragging = false);
document.addEventListener('mousemove', dragMove);
document.addEventListener('touchmove', dragMove);

startLevel(1);
