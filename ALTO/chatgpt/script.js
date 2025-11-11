// Tabs
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        tabContents.forEach(c => c.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// TIMER
let timerInterval;
let timerSeconds = 0;
let timerRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
        timerSeconds++;
        timerDisplay.textContent = formatTime(timerSeconds);
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    timerDisplay.textContent = "00:00:00";
}

function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// COUNTDOWN
let countdownInterval;
let countdownRunning = false;
let remainingSeconds = 0;

const countdownDisplay = document.getElementById('countdownDisplay');
const errorMsg = document.getElementById('errorMsg');

document.getElementById('startCountdown').addEventListener('click', startCountdown);
document.getElementById('pauseCountdown').addEventListener('click', pauseCountdown);
document.getElementById('resetCountdown').addEventListener('click', resetCountdown);

function startCountdown() {
    if (countdownRunning) return;
    const minutes = parseInt(document.getElementById('minutesInput').value);

    if (isNaN(minutes) || minutes < 0) {
        errorMsg.textContent = "❌ Ingresa un número válido de minutos.";
        return;
    }

    if (remainingSeconds === 0) {
        remainingSeconds = minutes * 60;
    }

    errorMsg.textContent = "";
    countdownRunning = true;

    countdownInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            clearInterval(countdownInterval);
            countdownRunning = false;
            countdownDisplay.textContent = "00:00";
            alert("⏰ ¡Tiempo terminado!");
        } else {
            remainingSeconds--;
            countdownDisplay.textContent = formatCountdown(remainingSeconds);
        }
    }, 1000);
}

function pauseCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
}

function resetCountdown() {
    pauseCountdown();
    remainingSeconds = 0;
    countdownDisplay.textContent = "00:00";
    document.getElementById('minutesInput').value = "";
    errorMsg.textContent = "";
}

function formatCountdown(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}
