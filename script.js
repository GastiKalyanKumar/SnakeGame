const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

let snake;
let food;
let direction;
let score;
let gameInterval;
let paused = false;

const gridSize = 20;
const tileCount = 20;

let highScore =
localStorage.getItem("snakeHighScore") || 0;

highScoreEl.textContent = highScore;

function initGame(){

    snake = [{x:10,y:10}];

    direction = {x:0,y:0};

    food = randomFood();

    score = 0;

    scoreEl.textContent = score;

    clearInterval(gameInterval);

    let speed =
    document.getElementById("difficulty").value;

    gameInterval =
    setInterval(gameLoop,speed);
}

function randomFood(){
    return {
        x:Math.floor(Math.random()*tileCount),
        y:Math.floor(Math.random()*tileCount)
    };
}

function gameLoop(){
    if(paused) return;

    update();
    draw();
}

function update(){

    const head = {
        x:snake[0].x + direction.x,
        y:snake[0].y + direction.y
    };

    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
    ){
        gameOver();
        return;
    }

    for(let i=1;i<snake.length;i++){
        if(
            head.x === snake[i].x &&
            head.y === snake[i].y
        ){
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if(
        head.x === food.x &&
        head.y === food.y
    ){
        score++;
        scoreEl.textContent = score;

        eatSound.currentTime = 0;
        eatSound.play();

        food = randomFood();

    }else{
        snake.pop();
    }
}

function draw(){

    ctx.clearRect(0,0,400,400);

    for(let i=0;i<20;i++){
        for(let j=0;j<20;j++){
            ctx.strokeStyle="#1f2937";
            ctx.strokeRect(i*20,j*20,20,20);
        }
    }

    snake.forEach((segment,index)=>{

        ctx.fillStyle =
        index===0 ? "#00ff88" : "#22c55e";

        ctx.fillRect(
            segment.x*20,
            segment.y*20,
            18,
            18
        );
    });

    ctx.fillStyle="#ff4757";

    ctx.beginPath();

    ctx.arc(
        food.x*20+10,
        food.y*20+10,
        8,
        0,
        Math.PI*2
    );

    ctx.fill();
}

function gameOver(){

    gameOverSound.play();

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "snakeHighScore",
            highScore
        );

        highScoreEl.textContent =
        highScore;
    }

    clearInterval(gameInterval);

    setTimeout(()=>{
        alert(
            "Game Over!\nScore: "
            + score
        );
    },200);
}

document.addEventListener(
    "keydown",
    e=>{

        if(e.key==="ArrowUp" &&
           direction.y===0)
            direction={x:0,y:-1};

        else if(e.key==="ArrowDown" &&
                direction.y===0)
            direction={x:0,y:1};

        else if(e.key==="ArrowLeft" &&
                direction.x===0)
            direction={x:-1,y:0};

        else if(e.key==="ArrowRight" &&
                direction.x===0)
            direction={x:1,y:0};
    }
);

document
.getElementById("pauseBtn")
.addEventListener("click",()=>{

    paused=!paused;

    document
    .getElementById("pauseBtn")
    .textContent =
    paused ? "Resume" : "Pause";
});

document
.getElementById("restartBtn")
.addEventListener("click",initGame);

document
.getElementById("difficulty")
.addEventListener("change",initGame);

initGame();