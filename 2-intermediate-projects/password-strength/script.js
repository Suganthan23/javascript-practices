document.addEventListener('DOMContentLoaded', () => {
    const pwEl = document.getElementById('pw');
    const toggle = document.getElementById('toggle');
    const labelEl = document.getElementById('label');
    const tipsEl = document.getElementById('tips');
    const bars = [1, 2, 3, 4].map(n => document.getElementById('b' + n));

    if (!pwEl || !toggle || !labelEl || !tipsEl || bars.some(b => !b)) {
        console.error('Password meter: missing required DOM elements.');
        return;
    }

    const COMMON = new Set([
        'password', 'password1', 'password123', 'admin', 'welcome', 'letmein',
        'login', 'qwerty', 'abc123', 'iloveyou', 'monkey', 'dragon',
        '123456', '123456789', '111111', '000000'
    ]);

    function hasSimpleSequence(lower) {
        const runs = [
            'abcdefghijklmnopqrstuvwxyz',
            '0123456789',
            'qwertyuiopasdfghjklzxcvbnm'
        ];

        for (const run of runs) {
            const rev = run.split('').reverse().join('');
            for (let i = 0; i <= run.length - 3; i++) {
                const seq = run.slice(i, i + 3);
                const seqRev = rev.slice(i, i + 3);
                if (lower.includes(seq) || lower.includes(seqRev)) return true;
            }
        }
        return false;
    }

    function analyzePassword(pw) {
        const s = String(pw ?? '');
        const lower = s.toLowerCase();
        const len = s.length;

        const hasLower = /[a-z]/.test(s);
        const hasUpper = /[A-Z]/.test(s);
        const hasDigit = /\d/.test(s);
        const hasSymbol = /[^A-Za-z0-9]/.test(s);
        const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

        const isCommon = COMMON.has(lower);
        const hasRepeat = /(.)\1{2,}/.test(s);
        const hasSequence = hasSimpleSequence(lower);

        let score = 0;
        if (len >= 8) score++;
        if (len >= 12) score++;
        if (classes >= 3) score++;
        if (classes >= 4) score++;

        if (hasRepeat || hasSequence) score = Math.max(0, score - 1);
        if (isCommon || len < 4) score = 0;

        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const labelIndex = Math.min(Math.max(score, 0), 4);

        const tips = [];
        if (len < 12) tips.push('Password must be at least 12 characters long');
        if (!hasLower) tips.push('Password must contain at least one lowercase letter');
        if (!hasUpper) tips.push('Password must contain at least one uppercase letter');
        if (!hasDigit) tips.push('Password must contain at least one digit');
        if (!hasSymbol) tips.push('Password must contain at least one symbol');
        if (hasRepeat) tips.push('Avoid repeated characters (e.g., aaa, 111).');
        if (hasSequence) tips.push('Avoid sequences (e.g., abc, 123, qwe).');
        if (isCommon) tips.push('Password is too common');

        return { score, label: labels[labelIndex], tips };
    }

    function render({ score, label, tips }) {
        labelEl.textContent = `Strength: ${label}`;

        bars.forEach(b => (b.className = 'bar'));

        for (let i = 0; i < score; i++) {
            const cls =
                score <= 1 ? 'fill-1' :
                    score === 2 ? 'fill-2' :
                        score === 3 ? 'fill-3' : 'fill-4';
            bars[i].classList.add(cls);
        }

        tipsEl.innerHTML = '';
        const show = tips.slice(0, 4);

        if (show.length === 0 && pwEl.value.length > 0) {
            const li = document.createElement('li');
            li.textContent = 'Nice — no obvious issues detected.';
            tipsEl.appendChild(li);
            return;
        }

        show.forEach(t => {
            const li = document.createElement('li');
            li.textContent = t;
            tipsEl.appendChild(li);
        });
    }

    pwEl.addEventListener('input', () => render(analyzePassword(pwEl.value)));

    toggle.addEventListener('click', () => {
        const isPassword = pwEl.getAttribute('type') === 'password';
        pwEl.setAttribute('type', isPassword ? 'text' : 'password');
        toggle.textContent = isPassword ? 'Hide' : 'Show';
        pwEl.focus();
    });

    render(analyzePassword(pwEl.value || ''));
});