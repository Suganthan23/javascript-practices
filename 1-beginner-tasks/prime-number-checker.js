const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    const limit = Math.sqrt(n);
    for (let i = 3; i <= limit; i += 2) {
        if (n % i === 0) return false;
    }   
    return true;
}

function ask() {
    readline.question("Enter a number: ", (input) => {
        const value = Number.parseFloat(String(input).trim());
        if (!Number.isFinite(value) || !Number.isInteger(value)) {
            console.log("please enter a valid number");
            return ask();
        }

        const result = isPrime(value);
        console.log(`${value} is ${result ? "prime" : "not prime"}`);

        readline.question("Check another number? (y/n): ", (ans) => {
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