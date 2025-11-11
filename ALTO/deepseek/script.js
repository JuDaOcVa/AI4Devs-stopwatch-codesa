// Elementos DOM
const timerBtn = document.getElementById('timerBtn');
const countdownBtn = document.getElementById('countdownBtn');
const displayTime = document.getElementById('displayTime');
const status = document.getElementById('status');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const errorMessage = document.getElementById('errorMessage');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const presetBtns = document.querySelectorAll('.preset-btn');
const notification = document.getElementById('notification');

// Variables de estado
let mode = 'timer'; // 'timer' o 'countdown'
let isRunning = false;
let isPaused = false;
let timerInterval;
let totalSeconds = 0;
let remainingSeconds = 0;

// Cambiar entre modos
timerBtn.addEventListener('click', () => {
    if (mode !== 'timer') {
        switchMode('timer');
    }
});

countdownBtn.addEventListener('click', () => {
    if (mode !== 'countdown') {
        switchMode('countdown');
    }
});

function switchMode(newMode) {
    mode = newMode;
    
    // Actualizar botones de modo
    timerBtn.classList.toggle('active', mode === 'timer');
    countdownBtn.classList.toggle('active', mode === 'countdown');
    
    // Actualizar interfaz
    if (mode === 'timer') {
        status.textContent = 'Listo para comenzar';
        displayTime.textContent = '00:00:00';
        resetInputs();
        resetTimer();
    } else {
        status.textContent = 'Configura el tiempo';
        displayTime.textContent = '00:00:00';
        resetInputs();
        resetTimer();
    }
}

// Botones de control
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Botones predefinidos
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.getAttribute('data-minutes'));
        setPresetTime(minutes);
    });
});

// Establecer tiempo predefinido
function setPresetTime(minutes) {
    if (mode === 'countdown') {
        hoursInput.value = 0;
        minutesInput.value = minutes;
        secondsInput.value = 0;
        validateInputs();
    }
}

// Validar entradas
function validateInputs() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    let isValid = true;
    let errorMsg = '';
    
    if (hours < 0 || hours > 23) {
        isValid = false;
        errorMsg = 'Las horas deben estar entre 0 y 23';
    } else if (minutes < 0 || minutes > 59) {
        isValid = false;
        errorMsg = 'Los minutos deben estar entre 0 y 59';
    } else if (seconds < 0 || seconds > 59) {
        isValid = false;
        errorMsg = 'Los segundos deben estar entre 0 y 59';
    } else if (mode === 'countdown' && hours === 0 && minutes === 0 && seconds === 0) {
        isValid = false;
        errorMsg = 'El tiempo debe ser mayor a 0 para el countdown';
    }
    
    if (isValid) {
        errorMessage.style.display = 'none';
        startBtn.disabled = false;
    } else {
        errorMessage.textContent = errorMsg;
        errorMessage.style.display = 'block';
        startBtn.disabled = true;
    }
    
    return isValid;
}

// Añadir event listeners para validación en tiempo real
hoursInput.addEventListener('input', validateInputs);
minutesInput.addEventListener('input', validateInputs);
secondsInput.addEventListener('input', validateInputs);

// Iniciar temporizador
function startTimer() {
    if (!validateInputs()) return;
    
    if (mode === 'timer') {
        // Timer: comenzar desde 0
        totalSeconds = 0;
        isRunning = true;
        isPaused = false;
        status.textContent = 'Timer en marcha...';
    } else {
        // Countdown: establecer tiempo inicial
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
        remainingSeconds = totalSeconds;
        isRunning = true;
        isPaused = false;
        status.textContent = 'Countdown en marcha...';
    }
    
    updateDisplay();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    
    // Iniciar el intervalo
    timerInterval = setInterval(updateTimer, 1000);
}

// Pausar temporizador
function pauseTimer() {
    if (isRunning) {
        if (isPaused) {
            // Reanudar
            isPaused = false;
            pauseBtn.textContent = 'Pausar';
            status.textContent = mode === 'timer' ? 'Timer en marcha...' : 'Countdown en marcha...';
            timerInterval = setInterval(updateTimer, 1000);
        } else {
            // Pausar
            isPaused = true;
            clearInterval(timerInterval);
            pauseBtn.textContent = 'Reanudar';
            status.textContent = mode === 'timer' ? 'Timer pausado' : 'Countdown pausado';
        }
    }
}

// Reiniciar temporizador
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    
    if (mode === 'timer') {
        displayTime.textContent = '00:00:00';
        status.textContent = 'Listo para comenzar';
    } else {
        if (totalSeconds > 0) {
            displayTime.textContent = formatTime(totalSeconds);
            status.textContent = 'Countdown reiniciado';
        } else {
            displayTime.textContent = '00:00:00';
            status.textContent = 'Configura el tiempo';
        }
    }
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    pauseBtn.textContent = 'Pausar';
}

// Actualizar temporizador
function updateTimer() {
    if (mode === 'timer') {
        // Timer: incrementar
        totalSeconds++;
        updateDisplay(totalSeconds);
    } else {
        // Countdown: decrementar
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay(remainingSeconds);
            
            if (remainingSeconds === 0) {
                // Countdown completado
                clearInterval(timerInterval);
                isRunning = false;
                status.textContent = '¡Countdown completado!';
                showNotification();
                startBtn.disabled = true;
                pauseBtn.disabled = true;
            }
        }
    }
}

// Actualizar pantalla
function updateDisplay(seconds = null) {
    if (mode === 'timer') {
        displayTime.textContent = formatTime(totalSeconds);
    } else {
        displayTime.textContent = formatTime(seconds !== null ? seconds : remainingSeconds);
    }
}

// Formatear tiempo (HH:MM:SS)
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

// Añadir cero inicial si es necesario
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Reiniciar entradas
function resetInputs() {
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    errorMessage.style.display = 'none';
    startBtn.disabled = false;
}

// Mostrar notificación
function showNotification() {
    notification.classList.add('show');
    
    // Reproducir sonido (simulado)
    try {
        // En un entorno real, aquí podrías reproducir un sonido
        console.log("Reproduciendo sonido de notificación");
    } catch (error) {
        console.error("Error al reproducir sonido:", error);
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Inicializar
resetInputs();