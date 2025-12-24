const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const toggle12 = document.getElementById("toggle12");

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatTime(d, use12) {
    let h = d.getHours();
    const m = pad2(d.getMinutes());
    const s = pad2(d.getSeconds());

    if(use12){
        const ampm = h >= 12 ? ' PM' : ' AM';
        h = h%12 || 12;
        return `${pad2(h)}:${m}:${s}${ampm}`;
    }
    return `${pad2(h)}:${m}:${s}`;
}

function formatDate(d){
    return d.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

let timeoutId = null;

function tick(){
    const now = new Date();
    timeEl.textContent = formatTime(now, toggle12.checked);
    dateEl.textContent = formatDate(now);

    const ms = 1000 - now.getMilliseconds();
    timeoutId = setTimeout(tick, ms);
}

toggle12.addEventListener('change', () => {
    const now = new Date();
    timeEl.textContent = formatTime(now, toggle12.checked);
});

document.addEventListener('visibilitychange', () => {
    if(!document.hidden) {
        clearTimeout(timeoutId);
        tick();
    }
});

tick();