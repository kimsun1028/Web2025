const startBtn = document.querySelector("#start-btn");
const gameArea = document.querySelector("#game-area");
const scoreDisplay = document.querySelector("#score");
const timerDisplay = document.querySelector("#timer");

let score = 0;
let timer = 60;
let timerId = null;



// 게임 시작 함수
startBtn.onclick = function gameStart() {
    gameArea.innerHTML = "";
    score = 0;
    createFruits();
    startTimer();

};


function createFruits() {
    const rows = 10;
    const cols = 17;

    for (let i = 0; i < rows; i++){
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let j = 0; j < cols; j++) {
            const apple = document.createElement("div");
            apple.classList.add("apple");

            // 1 ~ 9 랜덤 숫자 부여
            const num = Math.floor(Math.random() * 9) + 1;
            apple.textContent = num;

            rowDiv.appendChild(apple);
        }

        gameArea.appendChild(rowDiv);
    }
}

function startTimer() {
    clearInterval(timerId);
    timer = 60;
    timerDisplay.textContent = timer;

    timerId = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;

        if (timer <= 0) {
            clearInterval(timerId);
            alert(`게임 종료! 총 점수 : ${score}`);
        }
    }, 1000);
}