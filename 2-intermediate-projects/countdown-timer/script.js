const display = document.getElementById("display");
const timeInput = document.getElementById("timeInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let timerId = null;
let target = 0;
let remaining = 0;
let running = false;

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDuration(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? `${pad2(h)}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
}

function parseDuration(text) {
    const v = String(text).trim();
    if (!v) return null;
    if (/^\d+$/.test(v)) return Number(v);
    const parts = v.split(':').map((p) => Number(p));
    if (parts.some(n => !Number.isFinite(n) || n < 0 || !Number.isInteger(n))) return null;

    if (parts.length === 2) {
        const [mm, ss] = parts;
        if (ss >= 60) return null;
        return mm * 60 + ss;
    }

    if (parts.length === 3) {
        const [hh, mm, ss] = parts;
        if (mm >= 60 || ss >= 60) return null;
        return hh * 3600 + mm * 60 + ss;
    }
    return null;
}

function updateUi() {
    display.textContent = formatDuration(remaining);
    startBtn.disabled = running;
    pauseBtn.disabled = !running && remaining === 0;
    resetBtn.disabled = remaining === 0 && !running;
    pauseBtn.textContent = running ? 'Pause' : 'Resume';
}

function tick() {
    const secs = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    if (secs !== remaining) {
        remaining = secs;
        display.textContent = formatDuration(remaining);
    }
    if (remaining <= 0) {
        stop();
        alert('Time is up!');
    }
}

function start() {
    if (running) return;

    if (remaining === 0) {
        const parsed = parseDuration(timeInput.value);
        if (parsed === null || parsed <= 0) {
            alert("Enter a valid duration");
            return;
        }
        remaining = parsed;
    }

    target = Date.now() + remaining * 1000;
    running = true;
    updateUi();

    clearInterval(timerId);
    timerId = setInterval(tick, 200);
    tick();
}

function pause() {
    if (!running) return;
    remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    running = false;
    clearInterval(timerId);
    updateUi();
}

function resume() {
    if (running || remaining === 0) return;
    target = Date.now() + remaining * 1000;
    running = true;
    updateUi();
    clearInterval(timerId);
    timerId = setInterval(tick, 200);
    tick();
}

function reset() {
    clearInterval(timerId);
    timerId = null;
    remaining = 0;
    running = false;
    updateUi();
}

function stop() {
    clearInterval(timerId);
    timerId = null;
    running = false;
    remaining = 0;
    updateUi();
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', () => running ? pause() : resume());
resetBtn.addEventListener('click', reset);

timeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') start();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && running) {
        remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
        updateUi();
        tick();
    }
});

updateUi();