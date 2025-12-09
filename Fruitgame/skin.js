const unlocked = {
    watermelon: localStorage.getItem("unlock_watermelon") === "true"
};

let toastTimer = null;

function showSkinToast(msg) {
    const toast = document.getElementById("skin-toast");
    toast.textContent = msg;

    toast.classList.remove("hidden");
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(10px)";

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(0px)";
        setTimeout(() => toast.classList.add("hidden"), 400);
        toastTimer = null;
    }, 2000);
}


document.querySelectorAll(".skin-btn").forEach(btn => {
    const skin = btn.dataset.skin;

    // 잠겨 있으면 locked 클래스 추가 + 클릭 불가능
    if (skin === "watermelon" && !unlocked.watermelon) {
        btn.classList.add("locked");
    }

    btn.addEventListener("click", () => {

        // 🔒 해금 안 된 경우 → 선택 금지 + 알림
        if (skin === "watermelon" && !unlocked.watermelon) {
            showSkinToast("🔒 수박 스킨은 아직 해금되지 않았습니다! (20점 업적 필요)");
            return;
        }

        // ✔ 정상 선택
        localStorage.setItem("currentSkin", skin);

        const txt = document.getElementById("current-skin-text");
        txt.innerText =
            skin === "default"
                ? "현재 스킨 : 기본 사과 🍎"
                : "현재 스킨 : 수박 🍉";

        showSkinToast("🎨 스킨이 변경되었습니다!");
    });
});
