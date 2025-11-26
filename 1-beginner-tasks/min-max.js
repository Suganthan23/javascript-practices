const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function minMax(arr){
    let min = arr[0];
    let max = arr[0];
    for(let i = 0; i < arr.length; i++){
        const v = arr[i];
        if(v < min) min = v;
        if(v > max) max = v;
    }
    return {min, max};
}

function start(){
    readline.question("Enter a list of numbers separated by spaces or commas: ", (input) => {
        const array = String(input).trim().split(/[\s,]+/).filter(Boolean);
        if(array.length === 0){
            console.log("please enter a valid list of numbers");
            return start();
        }

        const numbers = array.map(t => Number(t));
        if(numbers.some(n => !Number.isFinite(n))){
            console.log("Please enter a valid list of numbers .\n");
            return start();
        }

        const { min, max } = minMax(numbers);
        console.log(`The minimum is ${min} and the maximum is ${max}`);

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