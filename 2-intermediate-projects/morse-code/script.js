const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
    F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
    P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--",
    Z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
    "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
    ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
    "\"": ".-..-.", "$": "...-..-", "@": ".--.-."
};

const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

const $ = (id) => document.getElementById(id);
const modeEl = $("mode");
const inputEl = $("input");
const outputEl = $("output");
const hintEl = $("hint");

function encodeText(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const encodedWords = words.map(w => {
        return w.toUpperCase().split("").map(ch => MORSE[ch] ?? "?").join(" ");
    });
    return encodedWords.join(" / ");
}

function decodeMorse(morse) {
    const normalized = morse.trim().replace(/\s*\/\s*/g, " / ");
    const words = normalized.split(" / ").filter(Boolean);

    const decodedWords = words.map(word => {
        const letters = word.trim().split(/\s+/).filter(Boolean);
        return letters.map(code => REVERSE[code] ?? "?").join("");
    });

    return decodedWords.join(" ");
}

function convert() {
    const mode = modeEl.value;
    const s = inputEl.value;

    if (!s.trim()) {
        outputEl.value = "";
        hintEl.textContent = "";
        return;
    }

    if (mode === "encode") {
        outputEl.value = encodeText(s);
        hintEl.textContent = "Encoding: spaces become “/” between words.";
    } else {
        outputEl.value = decodeMorse(s);
        hintEl.textContent = "Decoding: use spaces between letters and “/” between words.";
    }
}

$("run").addEventListener("click", convert);
inputEl.addEventListener("input", convert);

$("swap").addEventListener("click", () => {
    const a = inputEl.value;
    inputEl.value = outputEl.value;
    outputEl.value = a;
    modeEl.value = (modeEl.value === "encode") ? "decode" : "encode";
    convert();
});

$("clear").addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    hintEl.textContent = "";
    inputEl.focus();
});

$("copyOut").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(outputEl.value);
    } catch {
        // fallback
        outputEl.select();
        document.execCommand("copy");
    }
});