const startBtn = document.querySelector("#start-btn");
const gameArea = document.querySelector("#game-area");
const scoreDisplay = document.querySelector("#score");
const timerDisplay = document.querySelector("#timer");

let score = 0;
let timer = 60;
let selectBox = null;
let timerId = null;
let startX = null;
let startY = null;
let isDragging = false;


// 🔥 addEventListener 오타 수정
document.addEventListener("mousedown", mdown);
document.addEventListener("mousemove", mmove);
document.addEventListener("mouseup", mup);

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
            const fruit = document.createElement("div");
            fruit.classList.add("fruit");

            // 1 ~ 9 랜덤 숫자 부여
            const num = Math.floor(Math.random() * 9) + 1;
            fruit.textContent = num;

            rowDiv.appendChild(fruit);
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

function mdown(e) {
    isDragging = true;
    console.log("마우스 클릭!");
    startX = e.pageX;
    startY = e.pageY;
    selectBox = document.createElement("div");
    selectBox.classList.add("select-box")
    document.body.appendChild(selectBox);

}

function mmove(e) {
    if (isDragging) {
    console.log("마우스 이동!");
    let currentX = e.pageX;
    let currentY = e.pageY;
    let fromleft = Math.min(startX, currentX)
    let fromtop = Math.min(startY, currentY)
    let width = Math.abs(currentX - startX)
    let height = Math.abs(currentY - startY)

    selectBox.style.left = fromleft + "px"
    selectBox.style.top = fromtop + "px"
    selectBox.style.width = width + "px"
    selectBox.style.height = height + "px"
    selectFruit(fromleft,fromtop,width,height);
    }
    else
        return;
}

function mup() {
    isDragging = false
    console.log("마우스 때기!");
    
    const fruits = gameArea.querySelectorAll(".fruit")
    for (let fruit of fruits) {
        fruit.classList.remove("selected");
    }
    removeFruit();
    selectBox.remove();
}

function removeFruit() {

}

function selectFruit(left,top,width,height) {
    let fruit = null;
    const fruits = gameArea.querySelectorAll(".fruit")
    for (let fruit of fruits) {
        if (isSelected(fruit,left,top,width,height)){
            fruit.classList.add("selected");
        }
        else
            fruit.classList.remove("selected");
    }
}

function isSelected(fruit,left,top,width,height){
    let rec = fruit.getBoundingClientRect();
    let right = left + width
    let bottom = top + height
    if((rec.left < right)&&(rec.right > left)&&(rec.top < bottom)&&(rec.bottom > top)) {
        return true
    }   
    else
        return false
}