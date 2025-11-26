const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function apply(nums, callback){
    const out = [];
    for(let i = 0; i < nums.length; i++){
        out.push(callback(nums[i], i, nums));
    }
    return out;
}

const callbacks = {
    double: n => n * 2,
    square: n => n * n,
    negate: n => -n,
}

function parseNumbers(p){
    const pnum = String(p).trim().split(/[\s,]+/).filter(Boolean);
    if (!pnum.length) return null;
    const numbers = pnum.map(Number);
    if (numbers.some(n => !Number.isFinite(n))) return null;
    return numbers;
}

function start(){
    readline.question("Enter a list of numbers separated by spaces or commas: ", (input) => {
        const numbers = parseNumbers(input);
        if (!numbers) {
            console.log("Please enter a valid list of numbers.\n");
            return start();
        }
        
        readline.question("Choose callback (double/square/negate): ", (name) => {
            const key = String(name).trim().toLowerCase();
            const cb = 
                key.startsWith('d') ? callbacks.double :
                key.startsWith('s') ? callbacks.square :
                key.startsWith('n') ? callbacks.negate : null;
            if(!cb){
                console.log("Please choose one of double/square/negate.\n");
                return start();
            }

            const result = apply(numbers, cb);
            console.log(`Result : ${result.join(", ")}`);
            
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