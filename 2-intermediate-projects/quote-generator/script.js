const textEl = document.getElementById('text');
const authorEl = document.getElementById('author');
const tagEl = document.getElementById('tag');
const newBtn = document.getElementById('newBtn');
const copyBtn = document.getElementById('copyBtn');

const FALLBACK_QUOTES = [
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", tags: ["technology", "wisdom"] },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", tags: ["technology", "wisdom"] },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson", tags: ["technology"] },
    { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie", tags: ["technology", "inspirational"] },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", tags: ["technology"] },
    { text: "Premature optimization is the root of all evil.", author: "Donald Knuth", tags: ["technology", "wisdom"] },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", tags: ["technology", "wisdom"] },
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra", tags: ["technology", "wisdom"] },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", tags: ["technology"] },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck", tags: ["technology", "wisdom"] },
    { text: "The only way to go fast is to go well.", author: "Kent Beck", tags: ["technology", "wisdom"] },
    { text: "Controlling complexity is the essence of computer programming.", author: "Brian Kernighan", tags: ["technology", "wisdom"] },
    { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch", tags: ["technology", "wisdom"] },
    { text: "Testing shows the presence, not the absence of bugs.", author: "Edsger W. Dijkstra", tags: ["technology", "wisdom"] },
    { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine", tags: ["technology", "inspirational"] },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", tags: ["wisdom", "inspirational"] },
    { text: "Technology is best when it brings people together.", author: "Matt Mullenweg", tags: ["technology", "happiness"] },
    { text: "The only way to have a friend is to be one.", author: "Ralph Waldo Emerson", tags: ["friendship", "wisdom"] },
    { text: "Happiness depends upon ourselves.", author: "Aristotle", tags: ["happiness", "wisdom"] },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", tags: ["inspirational", "wisdom"] }
];

function setLoading(isLoading) {
    newBtn.disabled = isLoading;
    copyBtn.disabled = isLoading;
    if (isLoading) {
        const sk = document.createElement("div");
        sk.className = "skeleton";
        sk.style.width = '70%';
        textEl.replaceChildren(sk);
        authorEl.textContent = "-";
    }
}

function renderQuote({ text, author }) {
    textEl.textContent = `"${text}"`;
    authorEl.textContent = `- ${author || 'Unknown'}`;
}

async function getQuote(tag) {
    const url = new URL('https://api.quotable.io/random');
    if (tag && tag !== 'any') url.searchParams.set('tags', tag);

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { text: data.content, author: data.author };
}

function pickFallbackByTag(tag) {
    const pool = (tag && tag !== 'any') ? FALLBACK_QUOTES.filter(q => q.tags?.includes(tag)) : FALLBACK_QUOTES;
    const list = pool.length ? pool : FALLBACK_QUOTES;
    return list[Math.floor(Math.random() * list.length)];
}

async function loadQuote(tag) {
    setLoading(true);
    try {
        const selectedTag = tagEl.value;
        const q = await getQuote(selectedTag);
        renderQuote(q);
    } catch (err) {
        const q = pickFallbackByTag(tagEl.value);
        renderQuote(q);
        console.warn("Using fallback quote due to error:", err?.message || err)
    } finally {
        setLoading(false);
    }
}

newBtn.addEventListener('click', loadQuote);
tagEl.addEventListener('change', loadQuote);

copyBtn.addEventListener('click', async () => {
    const txt = `${textEl.textContent} ${authorEl.textContent}`;
    try {
        await navigator.clipboard.writeText(txt);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 900);
    }
    catch {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", txt);
    }
});

loadQuote();