// html 요소 반환
const startBtn = document.querySelector("#start-btn");
const gameArea = document.querySelector("#game-area");
const scoreDisplay = document.querySelector("#score");
const timerDisplay = document.querySelector("#timer");

// 전역 변수 설정
let score = 0;
let timer = 120;
let selectBox = null;
let timerId = null;
let startX = null;
let startY = null;
let isDragging = false;

// 이벤트리스너 설정
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

// 과일 생성 함수
function createFruits() {
    const rows = 10;
    const cols = 17;

    for (let i = 0; i < rows; i++){
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let j = 0; j < cols; j++) {
            const fruit = document.createElement("div");
            fruit.classList.add("fruit");

            const num = Math.floor(Math.random() * 9) + 1;
            fruit.textContent = num;

            rowDiv.appendChild(fruit);
        }

        gameArea.appendChild(rowDiv);
    }
}

// 타이머 시작 함수
function startTimer() {
    clearInterval(timerId);
    timer = 120;
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

// 마우스 클릭 시 이벤트 함수
function mdown(e) {
    isDragging = true;
    console.log("마우스 클릭!");
    startX = e.pageX;
    startY = e.pageY;
    selectBox = document.createElement("div");
    selectBox.classList.add("select-box")
    document.body.appendChild(selectBox);

}

// 마우스 움직일 시 이벤트 함수
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

// 마우스 땔 시 이벤트 함수
function mup(e) {
    isDragging = false
    console.log("마우스 때기!");
    
   
    removeFruit();
     const fruits = gameArea.querySelectorAll(".fruit")
    for (let fruit of fruits) {
        fruit.classList.remove("selected");
    }
    selectBox.remove();
}

// 과일 제거 함수
function removeFruit() {
    let selectedFruits = gameArea.querySelectorAll(".fruit.selected");
    let total = 0;
    let num = 0
    for (const selected of selectedFruits){
        total += parseInt(selected.textContent)
    }
    if (total == 10){
        for (const selected of selectedFruits){
            num++;
            selected.textContent = ""
        selected.classList.add("empty")
        selected.classList.remove("fruit")
        }
        score += num;
        scoreDisplay.textContent = score;
    }
}

// 과일 선택 함수
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

// 선택 여부 반환 함수
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