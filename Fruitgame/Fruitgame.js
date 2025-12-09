// html 요소 반환
const startBtn = document.querySelector("#start-btn");
const gameArea = document.querySelector("#game-area");
const scoreDisplay = document.querySelector("#score");
const timerDisplay = document.querySelector("#timer");

// [추가] 게임 오버 팝업창 요소 가져오기
const modal = document.querySelector("#game-over-modal");
const finalScoreDisplay = document.querySelector("#final-score");

// 스킨 요소  추가
const skins = {
    default: "image/Apple.png",
    watermelon: "image/Watermelon.png"
};
// 스킨 요소  추가
const goldenskins = {
    default: "image/Golden_Apple.png",
    watermelon: "image/Golden_Watermelon.png"
};
let currentSkin = localStorage.getItem("currentSkin") || "default";

// 뒤로가기 버튼 추가
document.querySelector("#back-btn").onclick = () => {
    window.location.href = "../index.html"; 
};

// === 업적 시스템 ===
const achievements = {
    score20: {
        unlocked: localStorage.getItem("achv_score20") === "true",
        condition: (score) => score >= 20,
        message: "스킨 해금: 수박 스킨",
        onUnlock: () => localStorage.setItem("unlock_watermelon", true)
    },
    score60: {
        unlocked: localStorage.getItem("achv_score60") === "true",
        condition: (score) => score >= 60,
        message: "업적 해금: 60점 달성!",
        onUnlock: () => {}
    },
    score100: {
        unlocked: localStorage.getItem("achv_score100") === "true",
        condition: (score) => score >= 100,
        message: "업적 해금: 100점 달성!",
        onUnlock: () => {}
    }
};


// 전역 변수 설정
let score = 0;
let timer = 120;
let selectBox = null;
let timerId = null;
let startX = null;
let startY = null;
let isDragging = false;
let tprob = 0.02
let bprob = 0.02
// 최고 점수
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;


// 이벤트리스너 설정
document.addEventListener("mousedown", mdown);
document.addEventListener("mousemove", mmove);
document.addEventListener("mouseup", mup);

// 게임 시작 함수
startBtn.onclick = function gameStart() {
    currentSkin = localStorage.getItem("currentSkin") || "default";
    gameArea.innerHTML = "";
    score = 0;
    createFruits();
    startTimer();
};

// 과일 생성 함수
function createFruits() {
    const total = 10 * 17; // 170칸

    for (let i = 0; i < total; i++) {
        const fruit = document.createElement("div");
        fruit.classList.add("fruit");

        const num = Math.floor(Math.random() * 9) + 1;
        fruit.textContent = num;

        let r = Math.random();

        if (r < tprob) {
            // 타이머 과일
            fruit.classList.add("timer-fruit");

        } else if (r < tprob + bprob) {
            // 황금 과일
            fruit.classList.add("bonus-fruit");
            fruit.style.backgroundImage =
                 `url(${goldenskins[currentSkin] || goldenskins.default})`;

        } else {
            // 일반 과일 스킨 적용
            fruit.style.backgroundImage = `url(${skins[currentSkin]})`;
        }

        gameArea.appendChild(fruit);
    }
}


// 타이머 시작 함수
function startTimer() {
    clearInterval(timerId);
    timer = 120; // 시간 설정
    timerDisplay.textContent = timer;

    // 타이머가 돌기 시작
    timerId = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;

        // 시간이 다 되면?
        if (timer <= 0) {
            clearInterval(timerId);
            
            // 기존: alert(`게임 종료! 총 점수 : ${score}`);  <-- 이거 지우고!
            
            // [변경] 예쁜 팝업창 띄우기
            showGameOverModal(); 
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
    let bonus_num = 0
    let timer_num = 0
    for (const selected of selectedFruits){
        total += parseInt(selected.textContent)
    }
    if (total == 10){
        for (const selected of selectedFruits){
            num++;
            if (selected.classList.contains("bonus-fruit")){
                bonus_num++;
            }
            else if (selected.classList.contains("timer-fruit")){
                timer_num++
            }
            selected.textContent = "";
            selected.classList.add("empty");
            selected.classList.remove("bonus-fruit");
            selected.classList.remove("timer-fruit")
        }
        
        score += num + 4*bonus_num;
        timer += 5*timer_num;
        scoreDisplay.textContent = score;
        // 업적 체크
        for (let key in achievements) {
            if (achievements[key].condition(score)) {
                unlockAchievement(key);
            }
        }

        timerDisplay.textContent = timer;
    }
}

// 과일 선택 함수
function selectFruit(left,top,width,height) {
    let fruit = null;
    const fruits = gameArea.querySelectorAll(".fruit")
    for (let fruit of fruits) {
        if (fruit.classList.contains("empty")) continue; 
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

// [추가] 게임 종료 팝업 띄우는 함수
function showGameOverModal() {
    const modal = document.querySelector("#game-over-modal");
    const finalScore = document.querySelector("#final-score");


    // 점수 넣어주고
    finalScore.textContent = score + "점";
    
    // 숨겨뒀던 창을 보여줌 (hidden 클래스 제거)
    modal.classList.remove("hidden");


     // 최고점수 초기화하는 부분
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    let highScoreBox = document.querySelector("#high-score-text");
    if (!highScoreBox) {
        highScoreBox = document.createElement("p");
        highScoreBox.id = "high-score-text";
        modal.querySelector(".modal-content").appendChild(highScoreBox);
    }
    highScoreBox.textContent = `최고 점수 : ${highScore}점`

    modal.classList.remove("hidden");

    // 스킨 해금 시스템
    if (highScore >= 20) localStorage.setItem("unlock_watermelon", true);

}

// 업적 해금 함수
function unlockAchievement(key) {
    const achv = achievements[key];

    if (!achv || achv.unlocked) return; // 이미 해금되었으면 무시

    achv.unlocked = true;
    localStorage.setItem("achv_" + key, true);

    // 추가 효과가 있으면 실행 
    achv.onUnlock();

    // 팝업 메시지 띄우기
    const toast = document.getElementById("achievement-toast");
    const text = document.getElementById("achievement-text");

    text.textContent = "🏆 " + achv.message;
    toast.classList.add("show");

    // 2.5초 후 자동 사라짐
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
