const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function strReverse(s) {
    readline.question("Enter a string: ", (t) => {
        const s = String(t).trim();
        if (s.length === 0) {
            console.log("please enter a valid string");
            return strReverse();
        }

        console.log("Reversed string : ", [...s].reverse().join(""));
        readline.question("Run again? (y/n): ", (ans) => {
            if (String(ans).trim().toLowerCase() === "y") {
                console.log("");
                strReverse();
            } else {
                readline.close();
            }
        });
    });
}

strReverse();