const unlocked = {
    watermelon: localStorage.getItem("unlock_watermelon")
};

document.querySelectorAll(".skin-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        const skin = btn.dataset.skin;

        // 현재 스킨 저장
        localStorage.setItem("currentSkin", skin);

        // 화면에 표시
        const txt = document.getElementById("current-skin-text");
        if (txt) {
            if (skin === "default") txt.innerText = "현재 스킨 : 기본 사과 🍎";
            else if (skin === "watermelon") txt.innerText = "현재 스킨 : 수박 🍉";
        }

    });
});

// 페이지 로드 시 현재 스킨 표시
window.addEventListener("load", () => {
    const skin = localStorage.getItem("currentSkin") || "default";
    const txt = document.getElementById("current-skin-text");
    if (txt) {
        if (skin === "default") txt.innerText = "현재 스킨 : 기본 사과 🍎";
        else if (skin === "watermelon") txt.innerText = "현재 스킨 : 수박 🍉";
    }
});
