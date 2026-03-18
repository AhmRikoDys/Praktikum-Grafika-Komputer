let cols = 10;
let rows = 20;
let size = 30;

let grid = [];
let current;
let dropInterval;
let timer = 0;

let score = 0;
let level = 1;
let highScore = localStorage.getItem("tetrisHigh") || 0;

let gameState = "menu";
let difficulty = "Easy";

const colors = [
  null,
  [0,255,255],
  [255,255,0],
  [160,0,255],
  [255,0,0],
  [0,255,0],
  [255,150,0],
  [0,0,255]
];

const shapes = [
  [],
  [[1,1,1,1]],
  [[2,2],[2,2]],
  [[0,3,0],[3,3,3]],
  [[4,4,0],[0,4,4]],
  [[0,5,5],[5,5,0]],
  [[6,0,0],[6,6,6]],
  [[0,0,7],[7,7,7]]
];

// 🔊 SOUND
let osc;

function setup(){
  createCanvas(500,600);
  osc = new p5.Oscillator('square');
  osc.start();
  osc.amp(0);

  resetGame();
}

function draw(){
  drawBackground();

  if(gameState==="menu"){
    drawMenu();
  } else if(gameState==="play"){
    gameLoop();
  } else if(gameState==="gameover"){
    drawGameOver();
  }
}

// 🌌 BACKGROUND
function drawBackground(){
  background(10,10,25);

  stroke(30,30,60);
  for(let x=0;x<width;x+=40){
    line(x,0,x,height);
  }
  for(let y=0;y<height;y+=40){
    line(0,y,width,y);
  }
}

// ✨ GLOW TEXT
function glowText(txt, x, y, size){
  textSize(size);
  textAlign(CENTER);

  for(let i=8; i>0; i--){
    fill(0,255,255,20);
    text(txt, x+i*0.5, y+i*0.5);
  }

  fill(255);
  text(txt, x, y);
}

// 🎮 MENU
function drawMenu(){
  glowText("MODERN TETRIS", width/2, 180, 42);

  fill(200);
  textSize(18);
  textAlign(CENTER);
  text("Tekan SPACE untuk mulai", width/2, 240);
  text("Pilih Level: 1 Easy | 2 Medium | 3 Hard", width/2, 270);

  fill(0,255,255);
  text("Difficulty: "+difficulty, width/2, 310);
}

// 🔁 RESET
function resetGame(){
  grid = Array(rows).fill().map(()=>Array(cols).fill(0));
  score = 0;
  level = 1;
  spawn();
}

// 🎲 SPAWN
function spawn(){
  let id = floor(random(1, shapes.length));
  current = {
    shape: shapes[id],
    x: 4,
    y: 0
  };
}

// 🎯 GAME LOOP
function gameLoop(){
  drawGrid();
  drawPiece();

  timer++;
  if(timer > dropInterval){
    current.y++;
    if(collide()){
      current.y--;
      merge();
      clearLines();
      spawn();
      playSound();

      if(collide()){
        gameState="gameover";
        if(score > highScore){
          highScore = score;
          localStorage.setItem("tetrisHigh", highScore);
        }
      }
    }
    timer = 0;
  }

  drawUI();
}

// 🎨 GRID (Glow Block)
function drawGrid(){
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      let val = grid[y][x];

      if(val){
        let c = colors[val];

        noStroke();
        for(let i=6;i>0;i--){
          fill(c[0],c[1],c[2],20);
          rect(x*size+50-i/2,y*size+50-i/2,size+i,size+i,6);
        }

        fill(c);
        rect(x*size+50,y*size+50,size,size,5);
      } else {
        noFill();
        stroke(50);
        rect(x*size+50,y*size+50,size,size);
      }
    }
  }
}

// 🧱 PIECE (Glow)
function drawPiece(){
  for(let y=0;y<current.shape.length;y++){
    for(let x=0;x<current.shape[y].length;x++){
      let val = current.shape[y][x];

      if(val){
        let c = colors[val];

        noStroke();
        for(let i=6;i>0;i--){
          fill(c[0],c[1],c[2],25);
          rect((current.x+x)*size+50-i/2,(current.y+y)*size+50-i/2,size+i,size+i,6);
        }

        fill(c);
        rect((current.x+x)*size+50,(current.y+y)*size+50,size,size,5);
      }
    }
  }
}

// 🧠 COLLISION
function collide(){
  for(let y=0;y<current.shape.length;y++){
    for(let x=0;x<current.shape[y].length;x++){
      if(current.shape[y][x]){
        let nx = current.x+x;
        let ny = current.y+y;

        if(nx<0 || nx>=cols || ny>=rows || (grid[ny] && grid[ny][nx])){
          return true;
        }
      }
    }
  }
  return false;
}

// 🧷 MERGE
function merge(){
  for(let y=0;y<current.shape.length;y++){
    for(let x=0;x<current.shape[y].length;x++){
      if(current.shape[y][x]){
        grid[current.y+y][current.x+x] = current.shape[y][x];
      }
    }
  }
}

// 🧹 CLEAR
function clearLines(){
  let lines = 0;

  for(let y=rows-1;y>=0;y--){
    if(grid[y].every(v=>v)){
      grid.splice(y,1);
      grid.unshift(Array(cols).fill(0));
      lines++;
      y++;
    }
  }

  if(lines>0){
    score += lines * 100;
    level = floor(score / 500) + 1;
    dropInterval = max(5, dropInterval - 1);
  }
}

// 🎨 UI
function drawUI(){
  textAlign(LEFT);
  glowText("Score: "+score, 380, 100, 18);
  glowText("Level: "+level, 380, 130, 18);
  glowText("High: "+highScore, 380, 160, 18);
}

// 💀 GAME OVER
function drawGameOver(){
  glowText("GAME OVER", width/2, 250, 42);

  fill(255);
  textSize(20);
  textAlign(CENTER);
  text("Score: "+score, width/2,300);
  text("High Score: "+highScore, width/2,330);
  text("Tekan SPACE untuk ulang", width/2,380);
}

// 🔊 SOUND
function playSound(){
  osc.freq(200);
  osc.amp(0.3,0.05);
  osc.amp(0,0.2);
}

// 🎮 CONTROL
function keyPressed(){
  if(gameState==="menu"){
    if(key==='1'){difficulty="Easy"; dropInterval=40;}
    if(key==='2'){difficulty="Medium"; dropInterval=25;}
    if(key==='3'){difficulty="Hard"; dropInterval=15;}

    if(key===' '){
      gameState="play";
      resetGame();
    }
    return;
  }

  if(gameState==="play"){
    if(keyCode===LEFT_ARROW){
      current.x--;
      if(collide()) current.x++;
    }
    if(keyCode===RIGHT_ARROW){
      current.x++;
      if(collide()) current.x--;
    }
    if(keyCode===DOWN_ARROW){
      current.y++;
      if(collide()) current.y--;
    }
    if(key===' '){
      rotate();
    }
  }

  if(gameState==="gameover"){
    if(key===' '){
      gameState="menu";
    }
  }
}

// 🔄 ROTATE
function rotate(){
  let newShape=[];

  for(let x=0;x<current.shape[0].length;x++){
    newShape[x]=[];
    for(let y=current.shape.length-1;y>=0;y--){
      newShape[x].push(current.shape[y][x]);
    }
  }

  let old=current.shape;
  current.shape=newShape;

  if(collide()){
    current.shape=old;
  }
}