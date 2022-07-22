const btn = document.querySelector(".gameover-title button");
btn.addEventListener("mouseenter", startAnim);
btn.addEventListener("mouseleave", resetAnim);

let startProccessing = false;
let resetProccessing = false;
let currentDistance = 100;

function startAnim() {
    startProccessing = true;
    let interv = setInterval(function () {
        if (currentDistance < 0 || resetProccessing) {
            clearInterval(interv);
            startProccessing = false;
            return;
        }

        btn.style.background = `linear-gradient(0, #0000, #191919 ${currentDistance}%)`;

        currentDistance -= 3;
    }, 0);
}

function resetAnim() {
    resetProccessing = true;

    let interv = setInterval(function () {
        if (currentDistance > 100 || startProccessing) {
            clearInterval(interv);
            resetProccessing = false;
            return;
        }

        btn.style.background = `linear-gradient(0, #0000, #191919 ${currentDistance}%)`;

        currentDistance += 3;
    }, 0);
}
