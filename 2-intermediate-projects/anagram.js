const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function normalise(s) {
    return String(s).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isAnagram(a, b) {
    const x = normalise(a);
    const y = normalise(b);
    if (!x || !y) return false;
    if (x.length !== y.length) return false;
    return [...x].sort().join('') === [...y].sort().join('');
}

function start() {
    readline.question("Enter first text: ", (a) => {
        if (!String(a).trim()) {
            console.log("please enter a valid text");
            return start();
        }
        readline.question("Enter second text: ", (b) => {
            if (!String(b).trim()) {
                console.log("please enter a valid text");
                return start();
            }

            const result = isAnagram(a, b);
            console.log(`${a} and ${b} are ${result ? "anagrams" : "not anagrams"}`);

            readline.question("Run again? (y/n): ", (ans) => {
                if (String(ans).trim().toLowerCase() === "y") {
                    console.log("");
                    start();
                } else {
                    readline.close();
                }
            });
        });
    });
}

start();