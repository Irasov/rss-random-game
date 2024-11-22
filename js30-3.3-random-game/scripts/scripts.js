const game = document.getElementById('game');
const context = game.getContext("2d");
const bg = new Image();
const player = new Image();
const enemy = new Image();
const ball = new Image();
const startScreen = new Image();
const audioCollision = new Audio();
const audioGoal = new Audio();
const audioMiss = new Audio();
startScreen.src = "assets/image/start-screen.png";
bg.src = "assets/image/cosmos.jpg"; 
player.src = "assets/image/r1.png"; 
enemy.src = "assets/image/r2.png";
ball.src =  "assets/image/ball.png";
audioCollision.src="assets/audio/boom.mp3";
audioGoal.src="assets/audio/goal.mp3";
audioMiss.src="assets/audio/lost.mp3";
const DOWN = 0; // направление шара вверх
const RIGHT = 0; // направление вправо
const UP = 1; // направление шара вниз
const LEFT = 1; // направление шара влево
const LIMIT_UP = 0;
const LIMIT_DOWN = game.height - 50; 
const LIMIT_LEFT = 0;
const LIMIT_RIGHT = game.width - 50;
const WIN = 3;// очки для победы
let results =  []; 
fillRes();// значение для первого ключа
let resHeight = 80; //высота результатов
let keyPress = "stop";
//localStorage.clear();
let playerScore = 0;
let enemyScore = 0;
let posPlayerY = 150;
let posPlayerX = 0;
let posEnemyY = 150;
let posEnemyX = 550;
let posBallX = 50;
let posBallY = 175; 
let speedBall = 2;
let speedEnemy = 1;
let statusGame = 0; // 0 - игра не начата, 1 - игра запущена , 2 - игра завершина
let directionBall =  [DOWN, RIGHT]; 

function init(){
    game.width = 600;
    game.height = 400;
    startScreen.onload = draw; 
}

function draw() {
    context.font = "bold 60px Inter";
    context.fillStyle = "#0000ff";
    if(playerScore === WIN) {
        statusGame = 2;
    }
    if(enemyScore === WIN) {
        statusGame = 2;
    }
    playerMove(keyPress);
    context.drawImage(bg, 0, 0);
    context.fillText(playerScore +" : "+enemyScore, 230, 70);
    context.drawImage(player, posPlayerX, posPlayerY);
    context.drawImage(enemy, posEnemyX, posEnemyY);
    context.drawImage(ball, posBallX, posBallY);
    if(statusGame === 0){
        context.drawImage(startScreen, 0, 0);
    }
    if(statusGame === 2) {
        context.drawImage(bg, 0, 0);
        if(playerScore === WIN){
            addRes("Player");
            resultGame("WIN");
        }
        if(enemyScore === WIN){
            addRes("Enemy");
            resultGame("LOST");
        }
    }
    changeDirectionBall();
    moveBallEnemy();
    if(statusGame === 1){
        requestAnimationFrame(draw);
    }
}

function changeDirectionBall(){
    if(posBallX <= 50 && posBallY + 25 >= posPlayerY  && posBallY + 25 <= posPlayerY + 100) {
        directionBall[0] = RIGHT;
        audioCollision.play();
    }
    if(posBallX >= 500 && posBallY + 25 >= posEnemyY  && posBallY + 25 <= posEnemyY + 100){
        directionBall[0] = LEFT;
        audioCollision.play();
    }
    if( posBallX >= LIMIT_RIGHT ){
        directionBall[0] = LEFT;
        playerScore += 1;
        audioGoal.play();
    } 
    if( posBallX <= LIMIT_LEFT ){
        directionBall[0] = RIGHT;
        enemyScore += 1;
        audioMiss.play();
    } 
    if( posBallY >= LIMIT_DOWN ){
        directionBall[1] = UP;
        audioCollision.play();
    } 
    if( posBallY <= LIMIT_UP ){
        directionBall[1] = DOWN;
        audioCollision.play();
    } 
}

function moveBallEnemy(){
    if(directionBall[0] === RIGHT && directionBall[1] === DOWN ){
        posBallX += speedBall;
        posBallY += speedBall;
        posEnemyY += speedEnemy;

    }
    if(directionBall[0] === RIGHT && directionBall[1] === UP ){
        posBallX += speedBall;
        posBallY -= speedBall;
        posEnemyY -= speedEnemy;
    }
    if(directionBall[0] === LEFT && directionBall[1] === UP ){
        posBallX -= speedBall;
        posBallY -= speedBall;
        posEnemyY -= speedEnemy;
    }
    if(directionBall[0] === LEFT && directionBall[1] === DOWN ){
        posBallX -= speedBall;
        posBallY += speedBall;
        posEnemyY += speedEnemy;
    }
}

function fillRes(){
    if(masRes().length != 0) {
        results = masRes();
        results.sort((a,b) => Number(b.slice(0,b.indexOf(":"))) - Number(a.slice(0,b.indexOf(":"))));
    }else{
        results = ["-1:"]
    }
}

function addRes(name){
    checkTenLocalStorage();
    let  k = "space-" + (Number(results[0].slice(0,results[0].indexOf(":")))+1)+":";
    localStorage.setItem(k , name);
    results = masRes();
    results.sort((a,b) => Number(b.slice(0,b.indexOf(":"))) - Number(a.slice(0,a.indexOf(":"))));
}

function masRes() {
    let mas = [];
    for(let i = 0; i < localStorage.length; i += 1) {
        if(localStorage.key(i).indexOf("space") != -1){
            mas.push(localStorage.key(i).slice(localStorage.key(i).indexOf("-")+1, localStorage.key(i).indexOf(":"))+":"+localStorage.getItem(localStorage.key(i)));
        }   
    }
    return mas;
}

function checkTenLocalStorage(){
    if(localStorage.length === 10) {
        delete localStorage[`space-${results[results.length-1].slice(0,results[results.length-1].indexOf(":"))}:`];
    }
}

function resultGame(res) {
    context.font = "bold 40px Inter";
    context.fillStyle = "#0000ff";
    context.fillText(" You " + res, 180, 40);
    context.font = "bold 16px Inter";
    context.fillText(" To start the game, press the left mouse button", 100, 75);
    context.fillStyle = "#fff";

    for(let i = 0; i < results.length; i += 1){
        resHeight += 30;
        context.fillText(i+1+": "+results[i].slice(results[i].indexOf(":")+1)+" - WIN", 220, resHeight);
    }
}

document.addEventListener("keydown", e =>{
    if(e.key === "ArrowUp") {
        keyPress = "up";
    }
    if(e.key === "ArrowDown"){
        keyPress="down";
    }
});

document.addEventListener("keyup", e =>{
    if(e.key === "ArrowUp") {
        keyPress="stop";
    }
    if(e.key === "ArrowDown"){
        keyPress="stop";
    }
});

function playerMove(x) {
    switch (x) {
        case 'up':
            if(posPlayerY > LIMIT_UP) posPlayerY = posPlayerY - 1.5;
            break;
        case 'down':
            if (posPlayerY + player.height < game.height) posPlayerY = posPlayerY + 1.5;
            break;
        case 'stop':
            break;
    }
}

document.addEventListener("click", function(){
    if(statusGame === 0 || statusGame === 2){
        resHeight = 80;
        playerScore = 0;
        enemyScore = 0;
        statusGame = 1;
        posPlayerY = 150;
        posPlayerX = 0;
        posEnemyY = 150;
        posEnemyX = 550;
        posBallX = 50;
        posBallY = 175; 
        draw();
    } 
})

init();