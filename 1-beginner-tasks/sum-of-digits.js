const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function sumOfDigits(n) {
    let sum = 0;
    while (n > 0) {
        sum += n % 10;
        n = Math.floor(n / 10);
    }
    return sum;
}

function ask() {
    readline.question("Enter a number: ", (input) => {
        const value = Number.parseFloat(String(input).trim());

        if (!Number.isFinite(value) || !Number.isInteger(value)) {
            console.log("please enter a valid number");
            return ask();
        }

        const sum = sumOfDigits(value);
        console.log(`The sum of the digits of ${value} is ${sum}`);

        readline.question("Do another calculation? (y/n): ", (ans) => {
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