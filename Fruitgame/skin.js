// 로컬에서 해금 상태 가져오기
const unlocked = {
    banana: localStorage.getItem("unlock_banana"),
    grape: localStorage.getItem("unlock_grape"),
    watermelon: localStorage.getItem("unlock_watermelon")
};

// 버튼 활성화
document.querySelectorAll(".skin-btn").forEach(btn => {
    const skin = btn.dataset.skin;
    if (skin !== "default" && !unlocked[skin]) return;

    btn.disabled = false;

    btn.addEventListener("click", () => {
        localStorage.setItem("currentSkin", skin);
        alert(`스킨 '${skin}' 장착 완료!`);
    });
});
