const startBtn = document.querySelector("#start-btn")
const gameArea = document.querySelector("#game-area");
let score = 0;
let timer = 60;
let timerId = null;



// 게임 시작 함수
startBtn.onclick = function gameStart() {
    gamearea.innerHTML = "";
    score = 0;
    createFruits();
    startTimer();

};


function createFruits() {

}

function startTimer() {
    
}