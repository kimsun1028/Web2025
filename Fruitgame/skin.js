const unlocked = {
    strawberry: localStorage.getItem("unlock_strawberry") === "true",
    grape: localStorage.getItem("unlock_grape") === "true",
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
    if ((skin === "strawberry" && !unlocked.strawberry) || 
        (skin === "grape" && !unlocked.grape) ||
        (skin === "watermelon" && !unlocked.watermelon)) {
        btn.classList.add("locked");
    }

    btn.addEventListener("click", () => {

        // 🔒 해금 안 된 경우 → 선택 금지 + 알림
        if (skin === "strawberry" && !unlocked.strawberry) {
            showSkinToast("🔒 딸기 스킨은 아직 해금되지 않았습니다! (30점 업적 필요)");
            return;
        }
        if (skin === "grape" && !unlocked.grape) {
            showSkinToast("🔒 포도 스킨은 아직 해금되지 않았습니다! (60점 업적 필요)");
            return;
        }
        if (skin === "watermelon" && !unlocked.watermelon) {
            showSkinToast("🔒 수박 스킨은 아직 해금되지 않았습니다! (100점 업적 필요)");
            return;
        }

        // ✔ 정상 선택
        localStorage.setItem("currentSkin", skin);

        const txt = document.getElementById("current-skin-text");
        if (skin === "default") {
            txt.innerText = "현재 스킨 : 기본 사과 🍎";
        } else if (skin === "strawberry") {
            txt.innerText = "현재 스킨 : 딸기 🍓";
        } else if (skin === "grape") {
            txt.innerText = "현재 스킨 : 포도 🍇";
        } else if (skin === "watermelon") {
            txt.innerText = "현재 스킨 : 수박 🍉";
        }

        showSkinToast("🎨 스킨이 변경되었습니다!");
        
        // 스킨 팝업 자동 닫기
        const modal = document.getElementById("skin-modal");
        modal.classList.add("hidden");
    });
});
