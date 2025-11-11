// Variables globales para el Timer
let timerInterval;
let timerRunning = false;
let timerSeconds = 0;

// Variables globales para el Countdown
let countdownInterval;
let countdownRunning = false;
let countdownSeconds = 0;
let originalCountdownSeconds = 0;

// Funciones para cambiar entre pestañas
function switchTab(tab) {
    // Actualizar botones de pestañas
    document.querySelectorAll('.tab').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');

    // Mostrar/ocultar secciones
    if (tab === 'timer') {
        document.getElementById('timer-section').classList.remove('hidden');
        document.getElementById('countdown-section').classList.add('hidden');
    } else {
        document.getElementById('timer-section').classList.add('hidden');
        document.getElementById('countdown-section').classList.remove('hidden');
    }
}

// Funciones del Timer
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
    document.getElementById('timer-display').classList.remove('alarm');
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    document.getElementById('timer-display').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Funciones del Countdown
function startCountdown() {
    if (!countdownRunning) {
        // Si es la primera vez que se inicia, obtener el tiempo de los inputs
        if (countdownSeconds === 0) {
            const hours = parseInt(document.getElementById('hours').value) || 0;
            const minutes = parseInt(document.getElementById('minutes').value) || 0;
            const seconds = parseInt(document.getElementById('seconds').value) || 0;
            
            countdownSeconds = hours * 3600 + minutes * 60 + seconds;
            originalCountdownSeconds = countdownSeconds;
            
            if (countdownSeconds === 0) {
                alert('Por favor, ingresa un tiempo válido');
                return;
            }
        }
        
        countdownRunning = true;
        countdownInterval = setInterval(() => {
            if (countdownSeconds > 0) {
                countdownSeconds--;
                updateCountdownDisplay();
                
                // Alarma cuando llegue a cero
                if (countdownSeconds === 0) {
                    playAlarm();
                }
            } else {
                pauseCountdown();
            }
        }, 1000);
    }
}

function pauseCountdown() {
    if (countdownRunning) {
        countdownRunning = false;
        clearInterval(countdownInterval);
    }
}

function resetCountdown() {
    pauseCountdown();
    countdownSeconds = 0;
    originalCountdownSeconds = 0;
    updateCountdownDisplay();
    document.getElementById('countdown-display').classList.remove('alarm');
    
    // Limpiar inputs
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
}

function updateCountdownDisplay() {
    const hours = Math.floor(countdownSeconds / 3600);
    const minutes = Math.floor((countdownSeconds % 3600) / 60);
    const seconds = countdownSeconds % 60;
    
    const display = document.getElementById('countdown-display');
    display.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Efecto visual cuando queda poco tiempo
    if (countdownSeconds <= 10 && countdownSeconds > 0) {
        display.classList.add('alarm');
    }
}

function playAlarm() {
    const display = document.getElementById('countdown-display');
    display.classList.add('alarm');
    
    // Crear sonido de alarma simple (beep)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.log('Audio no disponible');
    }
    
    // Mostrar alerta visual
    alert('¡Tiempo terminado!');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateTimerDisplay();
    updateCountdownDisplay();
});