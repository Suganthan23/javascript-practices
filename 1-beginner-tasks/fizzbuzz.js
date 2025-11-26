const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function fizzBuzz(n) {
    const out = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) out.push("FizzBuzz");
        else if (i % 3 === 0) out.push("Fizz");
        else if (i % 5 === 0) out.push("Buzz");
        else out.push(String(i));
    }
    return out;
}

function start(){
    readline.question("Enter a number: ", (input) => {
        const n = Number.parseFloat(String(input).trim());

        if(!isFinite(n) || !Number.isInteger(n) || n < 1){
            console.log("please enter a valid number");
            return start();
        }

        const result = fizzBuzz(n);
        console.log(result.join("\n"));

        readline.question("Run again? (y/n): ", (ans) => {
            if (String(ans).trim().toLowerCase() === "y") {
                console.log("");
                start();
            } else {
                readline.close();
            }
        });
    });
}

start();