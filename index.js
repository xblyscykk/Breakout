var boardWidth = 600;
var boardHeight = 600;
var context;
var board;
var points = 0;



/*



todo:

[+] fix player, ball collision bugs
[+] generate new pair of blocks once all 100 are at x 5000
[+] make the speed slower or rework the paddle&ball speed increment speed entirely
[+] add original sound effects
[+] fix the movement as it can be bugged at times (hint: just refresh it more often)



*/

//sound effects

var BumpSound = new Audio();
BumpSound.src = "audio/smb_bump.wav";

var FireBallSound = new Audio();
FireBallSound.src = "audio/smb_fireball.wav";

var BreakSound = new Audio();
BreakSound.src = "audio/smb_breakblock.wav";

var GameOverSound = new Audio();
GameOverSound.src = "audio/GameOver.ogg";



//player params
var player = {
    x: 275,
    y: 550,
    width: 50,
    height: 10,
    velocityX: 0,
}

//create a new block param, and every 10 blocks move it up by 25 units
for (let i = 1; i <= 100; i++) {
    window['block' + i] = {
        x: 25 + ((i - 1) % 10) * 55,
        y: 300 - Math.floor((i - 1) / 10) * 25,
        width: 50,
        height: 10,
        velocityX: 0
    };
}


//ball params
var ball = {
    x: 589,
    y: 300,
    width: 10,
    height: 10,
    velocityX: -4,
    velocityY: 3,
}


//creates an array, in which we push 100 random colors we use for the blocks
let randomColors = [];
for (let i = 0; i < 100; i++) {
    let randomColor = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    randomColors.push(randomColor);
}


//params for modifying the player speed
var rightspeed = 4;
var leftspeed = -4;


//draw the blocks



function drawBlocks(){

    //draw 100 blocks, and colour them with the random colors defined before
    for (let i = 1; i <= 100; i++) {
        context.fillStyle = randomColors[i - 1];
        let currentBlock = window['block' + i];
        context.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
    }
    //detect collision for all 100 blocks, and then invert the ball y velocity
    for (let i = 1; i <= 100; i++) {
        let currentBlock = window['block' + i];
        if (detectCollision(ball, currentBlock)) {
        ball.velocityY *= -1;
        BreakSound.play();
        rightspeed += 0.1;
        leftspeed += -0.1;
        points += Math.floor(Math.random() * 10) * 10 + 5;
        currentBlock.x = 5000;
        }
    }
}




//function to draw the board
function drawBoard(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    document.addEventListener("keyup", keyup);
    document.addEventListener("keydown", keydown);
}

window.onload = function(){
    drawBoard();
    requestAnimationFrame(update); //refresh the board per frame
}
function update(){
    requestAnimationFrame(update);
    drawPlayer();
    drawBall();
    drawBlocks();
    drawScore();
}



//draws the score on the screen and centers it
function drawScore(){
    context.fillStyle = "white";
    context.font = "40px Trickster";
    
    let pointsText = points.toString();
    
    let textWidth = context.measureText(pointsText).width;
    
    let xPosition = board.width / 2 - textWidth / 2;
    
    context.fillText(pointsText, xPosition, 60);
}

var ix = 1;


//draw ball and handle ball/player collisions
function drawBall(){
    context.fillStyle = "white";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    ball.y += ball.velocityY;
    ball.x += ball.velocityX;

    if (detectCollision(player,ball)){
        ball.velocityY *= -1;
        BumpSound.play();
    }
    if (ball.x >= 590){
        FireBallSound.play();
        ball.velocityX *= -1;
        ball.velocityX += -0.1;
    }
    if (ball.x <= 0){
        FireBallSound.play();
        ball.velocityX *= -1;
        ball.velocityX += 0.1;
    }

    if (ball.y <= 0 && ix == 1){
        FireBallSound.play();
        ball.velocityY *= -1;
    }
    if (ix == 1 && ball.y >= 600){
        ball.velocityX = 0;
        ball.velocityY = 0;
        GameOverSound.play();
        player.x = 9000;
        ix = 0;
        playcolor = "black";
        console.log("AA");
    }
}

//var containing player color so we can change it on the go
var playcolor = "white";

function drawPlayer(){
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = playcolor;
    context.fillRect(player.x, player.y, player.width, player.height);
    player.x += player.velocityX;

    if (player.x == 550){
        player.velocityX = 0;
    }
    if (player.x >= 551){
        player.x = 550;
    }
    if (player.x == 0){
        player.velocityX = 0;
    }
    if (player.x <= 0){
        player.x = 0;
    }
}

//when key released, stop the player

function keyup(e){
    if (e.code == "ArrowRight" && player.velocityX != leftspeed){
        player.velocityX = 0;
    }
    if (e.code == "ArrowLeft" && player.velocityX != rightspeed){
        player.velocityX = 0;
    }
}


//when key is pressed, move the player
function keydown(e){
    if (e.code == "ArrowRight"){
        player.velocityX = rightspeed;
    }
    if (e.code == "ArrowLeft"){
        player.velocityX = leftspeed;
    }
}




function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && // for detecting square collisions
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
