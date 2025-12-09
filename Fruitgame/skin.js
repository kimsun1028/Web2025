const unlocked = {
    watermelon: localStorage.getItem("unlock_watermelon")
};

document.querySelectorAll(".skin-btn").forEach(btn => {
    const skin = btn.dataset.skin;

    // 해금되지 않았으면 스킵
    if (skin !== "default" && !unlocked[skin]) return;

    // 버튼 활성화
    btn.disabled = false;

    btn.addEventListener("click", () => {
        localStorage.setItem("currentSkin", skin);
        alert(`스킨 '${skin}' 장착 완료!`);
    });
});
