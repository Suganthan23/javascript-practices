const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function parseNumbers(p){
    const pnum = String(p).trim().split(/[\s,]+/).filter(Boolean);
    if (pnum.length === 0) return null;
    const numbers = pnum.map(Number);
    if (numbers.some(n => !Number.isFinite(n))) return null;
    return numbers;
}

const mapDouble = number => number.map(n => n * 2);
const filterEven = number => number.filter(n => n % 2 === 0);
const sum = number => number.reduce((acc, n) => acc + n, 0);

function start() {
    readline.question("Enter a list of numbers separated by spaces or commas: ", (input) => {
        const numbers = parseNumbers(input);
        if (!numbers) {
            console.log("Please enter a valid list of numbers.\n");
            return start();
        } 
        console.log("Original list :", numbers.join(""));
        console.log("Map(double) :", mapDouble(numbers).join(""));
        console.log("Filter(even) :", filterEven(numbers).join(""));
        console.log("Reduce(sum) :", sum(numbers));
        console.log("");

        readline.question("Try another list? (y/n): ", (ans) => {
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