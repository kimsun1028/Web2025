// 1. HTML 요소 가져오기
const startBtn = document.querySelector("#start-btn");
const soundBtn = document.querySelector("#sound-btn"); 
const gameArea = document.querySelector("#game-area");
const scoreDisplay = document.querySelector("#score");
const timerDisplay = document.querySelector("#timer");
const modal = document.querySelector("#game-over-modal");
const finalScoreDisplay = document.querySelector("#final-score");

// [소리 파일 로드] (경로 ./ 확인 필수!)
const bgm = new Audio("./bgm.mp3");       
const clickSound = new Audio("./click.mp3"); 
const dragSound = new Audio("./click.mp3");  
const popSound = new Audio("./pop.mp3");     

// 소리 크기 및 초기 설정
bgm.volume = 0.5;
bgm.loop = true;
clickSound.volume = 1.0;
dragSound.volume = 0.4;
popSound.volume = 0.8;

//  소리 상태 변수 (true: 켜짐, false: 꺼짐)
let isSoundOn = true; 

// 스킨 요소 추가
const skins = {
    default: "image/Apple.png",
    strawberry: "image/Strawberry.png",
    grape: "image/Grape.png",
    watermelon: "image/Watermelon.png"
};

const goldenskins = {
    default: "image/Golden_Apple.png",
    strawberry: "image/Golden_Strawberry.png",
    grape: "image/Golden_Grape.png",
    watermelon: "image/Golden_Watermelon.png"
};

let currentSkin = localStorage.getItem("currentSkin") || "default"; 

// 2. 전역 변수 설정
let score = 0;
let timer = 120;
let selectBox = null;
let timerId = null;
let scoreAnimationTimer = null;
let startX = null;
let startY = null;
let isDragging = false;
let tprob = 0.02;
let bprob = 0.02;
let lastSelectedCount = 0;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

// === 업적 시스템 ===
const achievements = {
    score30: {
        unlocked: localStorage.getItem("achv_score30") === "true",
        condition: (score) => score >= 30,
        message: "업적 해금: 30점 달성!\n스킨 해금: 딸기 스킨",
        onUnlock: () => localStorage.setItem("unlock_strawberry", "true")
    },
    score60: {
        unlocked: localStorage.getItem("achv_score60") === "true",
        condition: (score) => score >= 60,
        message: "업적 해금: 60점 달성!\n스킨 해금: 포도 스킨",
        onUnlock: () => localStorage.setItem("unlock_grape", "true")
    },
    score100: {
        unlocked: localStorage.getItem("achv_score100") === "true",
        condition: (score) => score >= 100,
        message: "업적 해금: 100점 달성!\n스킨 해금: 수박 스킨",
        onUnlock: () => localStorage.setItem("unlock_watermelon", "true")
    }
};

// 3. 이벤트 리스너
document.addEventListener("mousedown", mdown);
document.addEventListener("mousemove", mmove);
document.addEventListener("mouseup", mup);

// 뒤로가기 버튼
const backBtn = document.querySelector("#back-btn");
if (backBtn) {
    backBtn.onclick = () => {
        // 현재 점수가 최고 점수보다 크면 업데이트
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        // 메인 화면으로 이동
        window.location.href = "../index.html";
    };
}

// [NEW] 소리 버튼 클릭 이벤트
soundBtn.onclick = function() {
    isSoundOn = !isSoundOn; // 상태 반전 (켜짐 <-> 꺼짐)

    // 모든 소리 음소거 처리
    bgm.muted = !isSoundOn;
    clickSound.muted = !isSoundOn;
    dragSound.muted = !isSoundOn;
    popSound.muted = !isSoundOn;

    // 버튼 텍스트 변경
    if (isSoundOn) {
        soundBtn.textContent = "소리 끄기 🔇";
        soundBtn.style.backgroundColor = "#55efc4"; // 켜져있을 땐 초록
        soundBtn.style.boxShadow = "0 5px 0 #00b894";
    } else {
        soundBtn.textContent = "소리 켜기 🔊";
        soundBtn.style.backgroundColor = "#b2bec3"; // 꺼져있을 땐 회색
        soundBtn.style.boxShadow = "0 5px 0 #636e72";
    }
};

// 4. 게임 시작 함수
startBtn.onclick = function gameStart() {
    if (modal) modal.classList.add("hidden");

    // 현재 스킨 로드
    currentSkin = localStorage.getItem("currentSkin") || "default";

    // 음악 재생 (단, 소리가 켜져있을 때만)
    bgm.currentTime = 0;
    if (isSoundOn) {
        bgm.play().catch(e => console.log("BGM 재생 대기"));
    }

    gameArea.innerHTML = "";
    score = 0;
    scoreDisplay.textContent = score;
    createFruits();
    startTimer();
};

// 5. 과일 생성 함수
function createFruits() {
    const total = 10 * 17;
    for (let i = 0; i < total; i++) {
        const fruit = document.createElement("div");
        fruit.classList.add("fruit");
        const num = Math.floor(Math.random() * 9) + 1;
        fruit.textContent = num;

        let r = Math.random();
        if (r < tprob) {
            fruit.classList.add("timer-fruit");
            fruit.style.backgroundImage = `url('image/Timer.png')`;
        }
        else if (r < tprob + bprob) {
            fruit.classList.add("bonus-fruit");
            fruit.style.backgroundImage = `url('${goldenskins[currentSkin]}')`;
        }
        else {
            fruit.style.backgroundImage = `url('${skins[currentSkin]}')`;
        }

        gameArea.appendChild(fruit);
    }
}

// 6. 타이머 함수
function startTimer() {
    clearInterval(timerId);
    timer = 120;
    timerDisplay.textContent = timer;

    timerId = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;

        if (timer <= 0) {
            clearInterval(timerId);
            bgm.pause();
            showGameOverModal();
        }
    }, 1000);
}

// 7. 결과창 표시
function showGameOverModal() {
    // 최고 점수 갱신
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    
    finalScoreDisplay.textContent = score + "점";
    modal.classList.remove("hidden");
}

// 8. 마우스 다운
function mdown(e) {
    if(timer <= 0 && timerId === null) return;

    // 소리 재생 (음소거 상태가 아닐 때만)
    if (isSoundOn) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => {});
    }

    isDragging = true;
    startX = e.pageX;
    startY = e.pageY;
    lastSelectedCount = 0;

    selectBox = document.createElement("div");
    selectBox.classList.add("select-box");
    document.body.appendChild(selectBox);
}

// 9. 마우스 이동
function mmove(e) {
    if (!isDragging) return;

    let currentX = e.pageX;
    let currentY = e.pageY;
    let fromleft = Math.min(startX, currentX);
    let fromtop = Math.min(startY, currentY);
    let width = Math.abs(currentX - startX);
    let height = Math.abs(currentY - startY);

    selectBox.style.left = fromleft + "px";
    selectBox.style.top = fromtop + "px";
    selectBox.style.width = width + "px";
    selectBox.style.height = height + "px";

    selectFruit(fromleft, fromtop, width, height);
}

// 10. 마우스 떼기
function mup(e) {
    if (!isDragging) return;
    isDragging = false;

    removeFruit();

    const fruits = gameArea.querySelectorAll(".fruit");
    for (let fruit of fruits) {
        fruit.classList.remove("selected");
    }

    if (selectBox) {
        selectBox.remove();
        selectBox = null;
    }
}

// 11. 과일 제거
function removeFruit() {
    let selectedFruits = gameArea.querySelectorAll(".fruit.selected");
    let total = 0;
    let num = 0;
    let bonus_num = 0;
    let timer_num = 0;

    for (const selected of selectedFruits) {
        if(selected.textContent === "") continue;
        total += parseInt(selected.textContent);
    }

    if (total === 10) {
        // 성공 소리 재생
        if (isSoundOn) {
            popSound.currentTime = 0;
            popSound.play().catch(e => {});
        }

        for (const selected of selectedFruits) {
            num++;
            if (selected.classList.contains("bonus-fruit")) bonus_num++;
            else if (selected.classList.contains("timer-fruit")) timer_num++;

            selected.textContent = "";
            selected.classList.add("empty");
            selected.classList.remove("bonus-fruit");
            selected.classList.remove("timer-fruit");
            selected.classList.remove("selected");
        }
        
        const earnedPoints = num + 4*bonus_num;
        const oldScore = score;
        
        // 실제 점수는 즉시 업데이트 (연속 득점 시 정확한 계산)
        score += earnedPoints;
        
        // 업적 체크
        for (let key in achievements) {
            if (achievements[key].condition(score)) {
                unlockAchievement(key);
            }
        }
        
        // "기존점수 + 얻은점수" 형태로 표시
        scoreDisplay.textContent = `${oldScore} + ${earnedPoints}`;
        
        // 이전 애니메이션 타이머가 있으면 취소
        if (scoreAnimationTimer) {
            clearTimeout(scoreAnimationTimer);
        }
        
        // 1.5초 후 합산된 점수로 표시만 업데이트
        scoreAnimationTimer = setTimeout(() => {
            scoreDisplay.textContent = score;
            scoreAnimationTimer = null;
        }, 1500);
        
        timer += 5 * timer_num;
        timerDisplay.textContent = timer;
    }
}

// 12. 선택 로직 (드래그 소리)
function selectFruit(left, top, width, height) {
    const fruits = gameArea.querySelectorAll(".fruit");
    let currentSelectedCount = 0;

    for (let fruit of fruits) {
        if (fruit.classList.contains("empty")) continue;

        if (isSelected(fruit, left, top, width, height)) {
            fruit.classList.add("selected");
            currentSelectedCount++;
        } else {
            fruit.classList.remove("selected");
        }
    }

    // 드래그 소리 재생
    if (currentSelectedCount > lastSelectedCount) {
        if (isSoundOn) {
            dragSound.currentTime = 0;
            dragSound.playbackRate = 2.0; 
            dragSound.play().catch(e => {}); 
        }
    }
    
    lastSelectedCount = currentSelectedCount;
}

// 13. 충돌 체크
function isSelected(fruit, left, top, width, height) {
    let rec = fruit.getBoundingClientRect();
    let right = left + width;
    let bottom = top + height;
    return (rec.left < right) && (rec.right > left) && (rec.top < bottom) && (rec.bottom > top);
}

// 14. 업적 해금 함수
function unlockAchievement(key) {
    const achv = achievements[key];

    if (!achv || achv.unlocked) return;

    achv.unlocked = true;
    localStorage.setItem("achv_" + key, "true");

    achv.onUnlock();

    const toast = document.getElementById("achievement-toast");
    const text = document.getElementById("achievement-text");

    text.textContent = "🏆 " + achv.message;

    // hidden 제거해야 화면에 나타남
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, 2500);
}