import type { Build } from "@/types";

export const builds: Build[] = [
  {
    id: "b_1",
    userId: "u_sarah",
    authorName: "sarah_codes",
    authorAvatar: "linear-gradient(135deg, #FF6B9D, #7C5CFC)",
    title: "Pixel Pet Garden",
    description: "A virtual garden where you grow pixel-art pets. Built with pure HTML/CSS/JS.",
    isPublished: true,
    thumbnailGradient: "linear-gradient(135deg, #6bcf7f, #4ecdc4)",
    viewCount: 3420,
    likeCount: 287,
    createdAt: "2026-06-20T10:00:00Z",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html>
<head>
<title>Pixel Pet Garden</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🌱 Pixel Pet Garden</h1>
  <div class="garden">
    <div class="pet">🐱</div>
    <div class="pet">🐶</div>
    <div class="pet">🦊</div>
  </div>
  <button onclick="water()">💧 Water (3)</button>
  <p id="msg">Click to water your pets!</p>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        language: "css",
        content: `body { font-family: sans-serif; text-align: center; background: #1a1a2e; color: #e8e8f0; }
.garden { display: flex; gap: 1rem; justify-content: center; margin: 2rem 0; }
.pet { font-size: 3rem; background: #252544; padding: 1rem; border-radius: 12px; transition: transform 0.2s; }
.pet:hover { transform: scale(1.1); }
button { background: #7c5cfc; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; }
button:hover { background: #6b4ce0; }`,
      },
      {
        name: "script.js",
        language: "js",
        content: `let water = 3;
function water() {
  if (water > 0) {
    water--;
    const msgs = ["Your pets are thriving! 🌟", "So happy! 💖", "Growing strong! 🌿"];
    document.getElementById('msg').textContent = msgs[Math.floor(Math.random()*msgs.length)];
    document.querySelector('button').textContent = '💧 Water (' + water + ')';
  } else {
    document.getElementById('msg').textContent = "You're out of water! Come back tomorrow. 🌙";
  }
}`,
      },
    ],
  },
  {
    id: "b_2",
    userId: "u_marco",
    authorName: "marco.dev",
    authorAvatar: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
    title: "Snake Reloaded",
    description: "A neon-flavored take on the classic Snake game. Use arrow keys to play.",
    isPublished: true,
    thumbnailGradient: "linear-gradient(135deg, #4ecdc4, #7c5cfc)",
    viewCount: 5210,
    likeCount: 412,
    createdAt: "2026-06-12T08:30:00Z",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html>
<head><title>Snake</title><link rel="stylesheet" href="style.css"></head>
<body>
<canvas id="game" width="400" height="400"></canvas>
<p>Use arrow keys. Score: <span id="score">0</span></p>
<script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        language: "css",
        content: `body { background: #0d0d1a; color: #4ecdc4; font-family: monospace; text-align: center; }
canvas { border: 2px solid #4ecdc4; box-shadow: 0 0 20px #4ecdc4; }`,
      },
      {
        name: "script.js",
        language: "js",
        content: `const c = document.getElementById('game');
const ctx = c.getContext('2d');
const SIZE = 20;
let snake = [{x:10,y:10}];
let dir = {x:1,y:0};
let food = {x:5,y:5};
let score = 0;
function loop(){
  snake.unshift({x:(snake[0].x+dir.x+20)%20, y:(snake[0].y+dir.y+20)%20});
  if(snake[0].x===food.x && snake[0].y===food.y){
    score++; document.getElementById('score').textContent=score;
    food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};
  } else { snake.pop(); }
  ctx.fillStyle='#0d0d1a'; ctx.fillRect(0,0,400,400);
  ctx.fillStyle='#4ecdc4'; snake.forEach(s=>ctx.fillRect(s.x*SIZE,s.y*SIZE,SIZE-1,SIZE-1));
  ctx.fillStyle='#ff6b9d'; ctx.fillRect(food.x*SIZE,food.y*SIZE,SIZE-1,SIZE-1);
}
addEventListener('keydown',e=>{
  if(e.key==='ArrowUp') dir={x:0,y:-1};
  if(e.key==='ArrowDown') dir={x:0,y:1};
  if(e.key==='ArrowLeft') dir={x:-1,y:0};
  if(e.key==='ArrowRight') dir={x:1,y:0};
});
setInterval(loop,150);`,
      },
    ],
  },
  {
    id: "b_3",
    userId: "u_aria",
    authorName: "aria_makes",
    authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
    title: "Lofi Study Timer",
    description: "A pomodoro timer with a calming gradient background. Stay focused, stay cozy.",
    isPublished: true,
    thumbnailGradient: "linear-gradient(135deg, #f0a04b, #ff6b9d)",
    viewCount: 1890,
    likeCount: 156,
    createdAt: "2026-07-01T14:00:00Z",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html><head><title>Lofi Timer</title><link rel="stylesheet" href="style.css"></head>
<body>
<div class="card">
<h1>🍅 Lofi Timer</h1>
<h2 id="time">25:00</h2>
<button id="btn" onclick="toggle()">Start</button>
</div>
<script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        language: "css",
        content: `body { background: linear-gradient(135deg,#f0a04b,#ff6b9d); min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif; }
.card { background: rgba(0,0,0,0.4); padding:2rem 3rem; border-radius:20px; text-align:center; color:white; backdrop-filter: blur(8px); }
h2 { font-size:3rem; margin:1rem 0; font-variant-numeric: tabular-nums; }
button { background:white; color:#ff6b9d; border:none; padding:0.6rem 2rem; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem; }`,
      },
      {
        name: "script.js",
        language: "js",
        content: `let sec=25*60, running=false, t;
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function tick(){ if(sec>0){sec--; document.getElementById('time').textContent=fmt(sec);} else {clearInterval(t); running=false; document.getElementById('btn').textContent='Restart';} }
function toggle(){ if(!running){running=true; document.getElementById('btn').textContent='Pause'; t=setInterval(tick,1000);} else {running=false; clearInterval(t); document.getElementById('btn').textContent='Resume';} }`,
      },
    ],
  },
  {
    id: "b_4",
    userId: "u_kenji",
    authorName: "kenji_pixel",
    authorAvatar: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
    title: "Pixel Art Maker",
    description: "Draw pixel art on an 16x16 grid. Export your masterpiece as ASCII.",
    isPublished: true,
    thumbnailGradient: "linear-gradient(135deg, #7c5cfc, #4ecdc4)",
    viewCount: 2740,
    likeCount: 198,
    createdAt: "2026-06-28T09:15:00Z",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html><head><title>Pixel Art</title><link rel="stylesheet" href="style.css"></head>
<body>
<h1>🎨 Pixel Art Maker</h1>
<input type="color" id="color" value="#7c5cfc">
<div id="grid"></div>
<script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        language: "css",
        content: `body{font-family:sans-serif;text-align:center;background:#1a1a2e;color:#e8e8f0;}
#grid{display:grid;grid-template-columns:repeat(16,24px);gap:1px;justify-content:center;margin:1rem auto;}
.cell{width:24px;height:24px;background:#252544;cursor:pointer;}
.cell:hover{outline:2px solid #ff6b9d;}`,
      },
      {
        name: "script.js",
        language: "js",
        content: `const grid=document.getElementById('grid');
for(let i=0;i<256;i++){const c=document.createElement('div');c.className='cell';c.onclick=()=>{c.style.background=document.getElementById('color').value;};grid.appendChild(c);}`,
      },
    ],
  },
];

export function getBuildById(id: string): Build | undefined {
  return builds.find((b) => b.id === id);
}
