let basket;
let fruits = [];
let particles = [];

let score = 0;
let level = 1;
let combo = 1;
let comboTimer = 0;

let highScore = localStorage.getItem("fruitHigh") || 0;

let gameState = "menu";
let difficulty = "";

let speedMultiplier = 1;

// SOUND
let catchSound, boomSound, bgMusic;

// SPRITE
let fruitImg, bombImg;

// UI anim
let fade = 0;

// ================= PRELOAD =================
function preload() {
  soundFormats('mp3','wav');

  catchSound = loadSound('https://cdn.jsdelivr.net/gh/jshawl/p5sounds@master/assets/doorbell.mp3');
  boomSound = loadSound('https://cdn.jsdelivr.net/gh/jshawl/p5sounds@master/assets/beat.mp3');
  bgMusic = loadSound('https://cdn.jsdelivr.net/gh/jshawl/p5sounds@master/assets/beat.mp3');

  // gambar HD
  fruitImg = loadImage('https://i.imgur.com/5cX1Z6C.png');
  bombImg = loadImage('https://i.imgur.com/9z3sK8F.png');
}

// ================= SETUP =================
function setup() {
  createCanvas(500, 600);
  basket = new Basket();
  textAlign(CENTER, CENTER);
}

// ================= DRAW =================
function draw() {
  drawBackground();

  if (gameState === "menu") drawMenu();
  if (gameState === "play") playGame();
  if (gameState === "gameover") drawGameOver();
}

// ================= BACKGROUND =================
function drawBackground() {
  for (let i = 0; i < height; i++) {
    let c = lerpColor(color(10,10,30), color(80,150,255), i/height);
    stroke(c);
    line(0,i,width,i);
  }
}

// ================= MENU =================
function drawMenu() {
  fade = lerp(fade, 255, 0.05);

  fill(255, fade);
  textSize(45);
  text("FRUIT CATCHER", width/2, 120);

  textSize(18);
  text("High Score: " + highScore, width/2, 170);

  drawButton("Easy", 300);
  drawButton("Medium", 360);
  drawButton("Hard", 420);
}

function drawButton(label, y) {
  let scale = 1 + sin(frameCount * 0.1) * 0.05;

  push();
  translate(width/2, y);
  scale(scale);

  fill(0,150,255);
  rectMode(CENTER);
  rect(0, 0, 180, 50, 15);

  fill(255);
  textSize(20);
  text(label, 0, 0);

  pop();
}

function mousePressed() {
  if (gameState === "menu") {
    if (overBtn(300)) startGame("Easy");
    if (overBtn(360)) startGame("Medium");
    if (overBtn(420)) startGame("Hard");
  }
}

function overBtn(y){
  return mouseX > width/2-90 && mouseX < width/2+90 &&
         mouseY > y-25 && mouseY < y+25;
}

// ================= START =================
function startGame(diff){
  difficulty = diff;
  gameState = "play";
  score = 0;
  level = 1;
  combo = 1;
  fruits = [];
  particles = [];

  if (!bgMusic.isPlaying()) {
    bgMusic.loop();
  }

  if (diff==="Easy") speedMultiplier = 2;
  if (diff==="Medium") speedMultiplier = 4;
  if (diff==="Hard") speedMultiplier = 6;
}

// ================= GAME =================
function playGame(){
  basket.update();
  basket.show();

  if (frameCount % 50 === 0){
    fruits.push(new Fruit());
  }

  for (let i = fruits.length-1; i>=0; i--){
    fruits[i].update();
    fruits[i].show();

    if (fruits[i].hits(basket)){
      if (fruits[i].type === "bomb"){
        explode(fruits[i].x, fruits[i].y);
        if (boomSound) boomSound.play();
        gameOver();
      } else {
        combo++;
        comboTimer = 60;
        score += 5 * combo;
        if (catchSound) catchSound.play();
      }
      fruits.splice(i,1);
    }

    else if (fruits[i].offScreen()){
      explode(fruits[i].x, fruits[i].y);
      combo = 1;
      if (boomSound) boomSound.play();
      gameOver();
    }
  }

  // combo turun
  if (comboTimer > 0) comboTimer--;
  else combo = 1;

  // particles
  for (let i = particles.length-1; i>=0; i--){
    particles[i].update();
    particles[i].show();
    if (particles[i].done()) particles.splice(i,1);
  }

  level = floor(score/50)+1;

  drawUI();
}

// ================= UI =================
function drawUI(){
  fill(255);
  textAlign(LEFT);
  textSize(18);
  text("Score: " + score, 20, 30);
  text("Level: " + level, 20, 60);

  if (combo > 1){
    fill(255,200,0);
    textSize(22);
    text("COMBO x" + combo, 20, 90);
  }
}

// ================= GAME OVER =================
function gameOver(){
  gameState = "gameover";
  bgMusic.stop();

  if (score > highScore){
    highScore = score;
    localStorage.setItem("fruitHigh", highScore);
  }
}

function drawGameOver(){
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2-40);

  textSize(20);
  text("Score: " + score, width/2, height/2);
  text("High Score: " + highScore, width/2, height/2+30);
  text("Click to Restart", width/2, height/2+70);
}

function mouseClicked(){
  if (gameState==="gameover") gameState="menu";
}

// ================= BASKET =================
class Basket{
  constructor(){
    this.w=100;
    this.x=width/2;
    this.y=height-40;
  }

  update(){
    if (keyIsDown(LEFT_ARROW)) this.x -= 7;
    if (keyIsDown(RIGHT_ARROW)) this.x += 7;

    if (touches.length > 0){
      this.x = touches[0].x;
    }

    this.x = constrain(this.x, this.w/2, width-this.w/2);
  }

  show(){
    fill(255,150,50);
    rectMode(CENTER);
    rect(this.x,this.y,this.w,25,10);
  }
}

// ================= FRUIT =================
class Fruit{
  constructor(){
    this.x = random(30,width-30);
    this.y = 0;
    this.size = 40;

    this.type = random() < 0.2 ? "bomb" : "fruit";
  }

  update(){
    this.y += speedMultiplier + level;
  }

  show(){
    imageMode(CENTER);
    if (this.type === "fruit"){
      image(fruitImg, this.x, this.y, this.size, this.size);
    } else {
      image(bombImg, this.x, this.y, this.size, this.size);
    }
  }

  hits(b){
    return this.y > b.y-10 &&
           this.x > b.x-b.w/2 &&
           this.x < b.x+b.w/2;
  }

  offScreen(){
    return this.y > height;
  }
}

// ================= PARTICLE =================
class Particle{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.vx=random(-3,3);
    this.vy=random(-3,3);
    this.alpha=255;
  }

  update(){
    this.x+=this.vx;
    this.y+=this.vy;
    this.alpha-=5;
  }

  show(){
    noStroke();
    fill(255,150,0,this.alpha);
    ellipse(this.x,this.y,5);
  }

  done(){
    return this.alpha<0;
  }
}

function explode(x,y){
  for (let i=0;i<30;i++){
    particles.push(new Particle(x,y));
  }
}