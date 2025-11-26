const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function parseNumbers(p){
    const pnum = String(p).trim().split(/[\s,]+/).filter(Boolean);
    if (pnum.length === 0) return null;

    const numbers = pnum.map(t => Number(t));
    if (numbers.some(n => !Number.isFinite(n))) return null;

    return numbers;
}

function sortNumbers(numbers, order = 'asc') {
    const snum = numbers.slice();
    snum.sort((a, b) =>  order === 'desc' ? b - a : a - b);
    return snum;
}

function start() {
    readline.question("Enter a list of numbers separated by spaces or commas: ", (input) => {
        const numbers = parseNumbers(input);
        if (!numbers) {
            console.log("Please enter a valid list of numbers.\n");
            return start();
        }

        readline.question("Sort in ascending or descending order? (asc/desc): ", (ord) => {
            const o = String(ord).trim().toLowerCase();
            const order = o.startsWith('d') ? 'desc' : 'asc';

            const sorted = sortNumbers(numbers, order);
            console.log(`Sorted ${order} : ${sorted.join(", ")}`);

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