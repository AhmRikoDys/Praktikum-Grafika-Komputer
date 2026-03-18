let player;
let obstacles = [];
let particles = [];
let powerups = [];

let score = 0;
let level = 1;
let speed = 5;
let highScore = localStorage.getItem("carHighScore") || 0;

let gameState = "menu";

let lanes = [];
let currentLane = 1;
let targetX;

let shield = false;
let shieldTimer = 0;

let slowMotion = 0;
let screenFlash = 0;

// ================= SETUP =================
function setup() {
  createCanvas(400, 700);

  lanes = [width * 0.25, width * 0.5, width * 0.75];

  player = {
    x: lanes[1],
    y: height - 100,
    w: 40,
    h: 70
  };

  targetX = player.x;
}

// ================= DRAW =================
function draw() {
  drawBackground();

  if (gameState === "menu") drawMenu();
  else if (gameState === "play") playGame();
  else if (gameState === "gameover") drawGameOver();
}

// ================= BACKGROUND =================
function drawBackground() {
  if (level < 3) background(135, 206, 235);
  else if (level < 5) background(255, 120, 80);
  else {
    background(10, 10, 30);

    // bintang
    for (let i = 0; i < 50; i++) {
      fill(255);
      circle(random(width), random(height), 2);
    }
  }
}

// ================= GAME =================
function playGame() {
  if (slowMotion > 0) {
    frameRate(30);
    slowMotion--;
  } else {
    frameRate(60);
  }

  drawRoad();
  updatePlayer();
  drawPlayer();

  handleObstacles();
  handlePowerUps();
  handleParticles();

  drawUI();
  updateLevel();

  if (shield) {
    shieldTimer--;
    if (shieldTimer <= 0) shield = false;
  }

  if (screenFlash > 0) {
    fill(255, 255, 255, 100);
    rect(0, 0, width, height);
    screenFlash--;
  }
}

// ================= ROAD =================
function drawRoad() {
  fill(30);
  rect(width * 0.1, 0, width * 0.8, height);

  stroke(0, 255, 255);
  strokeWeight(3);

  for (let y = 0; y < height; y += 40) {
    line(width / 2, y + frameCount % 40, width / 2, y + 20 + frameCount % 40);
  }
}

// ================= PLAYER =================
function updatePlayer() {
  player.x = lerp(player.x, targetX, 0.2);
}

function drawPlayer() {
  noStroke();

  // glow
  fill(0, 255, 255, 80);
  rect(player.x, player.y, player.w + 10, player.h + 10, 10);

  fill(0, 255, 255);
  rect(player.x, player.y, player.w, player.h, 10);

  if (shield) {
    stroke(0, 200, 255);
    noFill();
    ellipse(player.x, player.y, 70);
  }
}

// ================= OBSTACLES =================
function handleObstacles() {
  if (frameCount % int(60 / (level * 0.7)) === 0) {
    obstacles.push({
      x: random(lanes),
      y: -50,
      w: 40,
      h: 70
    });
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.y += speed;

    fill(255, 50, 50);
    rect(o.x, o.y, o.w, o.h, 10);

    // NEAR MISS
    let d = dist(player.x, player.y, o.x, o.y);
    if (d < 80 && d > 50) {
      score += 10;
      slowMotion = 10;
      screenFlash = 5;
    }

    if (o.y > height) {
      score += 5;
      obstacles.splice(i, 1);
    }

    if (collide(player, o)) {
      if (shield) {
        obstacles.splice(i, 1);
        shield = false;
      } else {
        gameOver();
      }
    }
  }
}

// ================= POWER UPS =================
function handlePowerUps() {
  if (frameCount % 180 === 0) {
    powerups.push({
      x: random(lanes),
      y: -50,
      type: random(["coin", "shield", "boost"])
    });
  }

  for (let i = powerups.length - 1; i >= 0; i--) {
    let p = powerups[i];
    p.y += speed;

    if (p.type === "coin") fill(255, 215, 0);
    if (p.type === "shield") fill(0, 200, 255);
    if (p.type === "boost") fill(255, 0, 255);

    ellipse(p.x, p.y, 20);

    if (collide(player, {x:p.x,y:p.y,w:20,h:20})) {
      if (p.type === "coin") score += 10;
      if (p.type === "shield") {
        shield = true;
        shieldTimer = 180;
      }
      if (p.type === "boost") speed += 2;

      powerups.splice(i, 1);
    }

    if (p.y > height) powerups.splice(i, 1);
  }
}

// ================= PARTICLES =================
function handleParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(0, 255, 255, 150);
    circle(p.x, p.y, 4);
  }
}

// ================= UI =================
function drawUI() {
  fill(255);
  textSize(18);
  text("Score: " + score, 20, 30);
  text("Level: " + level, 20, 60);

  let mode = "Easy";
  if (level >= 3) mode = "Medium";
  if (level >= 5) mode = "Hard";

  text("Mode: " + mode, 20, 90);
}

// ================= LEVEL =================
function updateLevel() {
  level = floor(score / 50) + 1;
  speed = 5 + level * 0.5;
}

// ================= COLLISION =================
function collide(a, b) {
  return !(
    a.x + a.w / 2 < b.x - b.w / 2 ||
    a.x - a.w / 2 > b.x + b.w / 2 ||
    a.y + a.h / 2 < b.y - b.h / 2 ||
    a.y - a.h / 2 > b.y + b.h / 2
  );
}

// ================= MENU =================
function drawMenu() {
  background(10);
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("CYBER ROAD PRO", width/2, height/2 - 50);
  textSize(16);
  text("ENTER untuk mulai", width/2, height/2);
}

// ================= GAME OVER =================
function drawGameOver() {
  background(0);
  fill(255);
  textAlign(CENTER);

  textSize(30);
  text("GAME OVER", width/2, height/2 - 50);

  textSize(18);
  text("Score: " + score, width/2, height/2);
  text("Tekan R untuk restart", width/2, height/2 + 50);
}

// ================= CONTROL =================
function keyPressed() {
  if (gameState === "menu" && keyCode === ENTER) startGame();
  if (gameState === "gameover" && key === 'r') startGame();

  if (gameState === "play") {
    if (keyCode === LEFT_ARROW && currentLane > 0) currentLane--;
    if (keyCode === RIGHT_ARROW && currentLane < 2) currentLane++;
    targetX = lanes[currentLane];
  }
}

// ================= START =================
function startGame() {
  score = 0;
  level = 1;
  speed = 5;
  obstacles = [];
  powerups = [];
  currentLane = 1;
  targetX = lanes[1];
  gameState = "play";
}

// ================= GAME OVER =================
function gameOver() {
  gameState = "gameover";
}