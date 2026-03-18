let player;
let enemies = [];
let particles = [];

let score = 0;
let level = 1;
let highScore = 0;

let gameState = "menu"; // menu, play, gameover

let osc;

// ================= SETUP =================
function setup() {
  createCanvas(400, 700); // mobile style
  player = new Player();

  highScore = localStorage.getItem("highScore") || 0;

  // sound
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

// ================= DRAW =================
function draw() {
  drawBackground();

  if (gameState === "menu") {
    drawMenu();
  } 
  else if (gameState === "play") {
    playGame();
  } 
  else if (gameState === "gameover") {
    drawGameOver();
  }
}

// ================= BACKGROUND =================
function drawBackground() {
  background(10, 10, 25);

  stroke(40);
  for (let i = 0; i < width; i += 40) {
    line(i, 0, i, height);
  }
  for (let j = 0; j < height; j += 40) {
    line(0, j, width, j);
  }
}

// ================= MENU =================
function drawMenu() {
  textAlign(CENTER);

  fill(0, 200, 255);
  textSize(40);
  text("NEON DODGE", width/2, 200);

  fill(255);
  textSize(18);
  text("Tap / Press SPACE to Start", width/2, 300);

  textSize(16);
  text("High Score: " + highScore, width/2, 350);
}

// ================= GAME =================
function playGame() {
  player.update();
  player.show();

  // spawn
  if (frameCount % max(25 - level * 2, 8) === 0) {
    enemies.push(new Enemy());
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].show();

    if (player.hits(enemies[i])) {
      explode(player.x, player.y);
      playSound(200);
      gameState = "gameover";

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
    }

    if (enemies[i].offscreen()) {
      enemies.splice(i, 1);
      score++;

      playSound(600);

      if (score % 50 === 0) {
        level++;
        playSound(1000);
      }
    }
  }

  updateParticles();
  drawUI();
}

// ================= UI =================
function drawUI() {
  push();

  // Panel
  noStroke();
  fill(0, 0, 0, 200);
  rect(10, 10, 160, 70, 12);

  textSize(20);
  textStyle(BOLD);

  // posisi lebih ke kanan
  let xPos = 45;

  // outline
  fill(0);
  text("Score: " + score, xPos + 1, 36);
  text("Level: " + level, xPos + 1, 61);

  // teks utama
  fill(0, 255, 255);
  text("Score: " + score, xPos, 35);

  fill(255);
  text("Level: " + level, xPos, 60);

  pop();
}

// ================= PLAYER =================
class Player {
  constructor() {
    this.x = width/2;
    this.y = height - 80;
    this.size = 20;
    this.speed = 6;
  }

  update() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.speed;

    this.x = constrain(this.x, this.size, width - this.size);
  }

  show() {
    noStroke();

    for (let i = 5; i > 0; i--) {
      fill(0, 200, 255, 20);
      ellipse(this.x, this.y, this.size + i * 6);
    }

    fill(0, 200, 255);
    ellipse(this.x, this.y, this.size);
  }

  hits(e) {
    return dist(this.x, this.y, e.x, e.y) < this.size/2 + e.size/2;
  }
}

// ================= ENEMY =================
class Enemy {
  constructor() {
    this.x = random(30, width - 30);
    this.y = -30;
    this.size = random(20, 30);
    this.speed = random(2 + level, 4 + level);
    this.type = floor(random(3));

    this.r = random(100,255);
    this.g = random(100,255);
    this.b = random(100,255);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    noStroke();

    for (let i = 5; i > 0; i--) {
      fill(this.r, this.g, this.b, 20);
      this.drawShape(this.size + i*5);
    }

    fill(this.r, this.g, this.b);
    this.drawShape(this.size);
  }

  drawShape(s) {
    push();
    translate(this.x, this.y);

    if (this.type === 0) rectMode(CENTER), rect(0,0,s);
    else if (this.type === 1) ellipse(0,0,s);
    else {
      rotate(PI/4);
      rectMode(CENTER);
      rect(0,0,s);
    }

    pop();
  }

  offscreen() {
    return this.y > height;
  }
}

// ================= PARTICLE =================
function explode(x, y) {
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(x, y));
  }
}

class Particle {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.vx = random(-3,3);
    this.vy = random(-3,3);
    this.life = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 5;
  }

  show() {
    noStroke();
    fill(255, this.life);
    ellipse(this.x, this.y, 5);
  }
}

function updateParticles() {
  for (let i = particles.length-1; i>=0; i--) {
    particles[i].update();
    particles[i].show();

    if (particles[i].life < 0) {
      particles.splice(i,1);
    }
  }
}

// ================= GAME OVER =================
function drawGameOver() {
  textAlign(CENTER);

  fill(255,50,50);
  textSize(32);
  text("GAME OVER", width/2, 250);

  fill(255);
  textSize(18);
  text("Score: " + score, width/2, 300);
  text("High Score: " + highScore, width/2, 330);

  textSize(14);
  text("Press SPACE to Restart", width/2, 380);

  updateParticles();
}

// ================= CONTROL =================
function keyPressed() {
  if (key === ' ') {
    if (gameState === "menu") startGame();
    else if (gameState === "gameover") startGame();
  }
}

function mousePressed() {
  if (gameState === "menu" || gameState === "gameover") {
    startGame();
  }
}

function startGame() {
  enemies = [];
  particles = [];
  score = 0;
  level = 1;
  gameState = "play";
}

// ================= SOUND =================
function playSound(freq) {
  osc.freq(freq);
  osc.amp(0.2, 0.05);
  osc.amp(0, 0.2);
}