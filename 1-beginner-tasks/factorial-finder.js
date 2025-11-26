const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function ask() {
    readline.question("Enter a non-negative integer(0,100): ", (input) => {
        const value = Number.parseFloat(String(input).trim());

        if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > 100) {
            console.log("please enter a valid number");
            return ask();
        }

        const result = factorial(value);
        console.log(`The factorial of ${value} is ${result}`);

        readline.question("Find the factorial for another number? (y/n): ", (ans) => {
            if (String(ans).trim().toLowerCase() === "y") {
                console.log("");
                ask();
            } else {
                readline.close();
            }
        });
    });
}

ask();