const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function unique(arr) {
    return [...new Set(arr)];
}

function frequencies(arr){
    const map = new Map();
    for(const item of arr){
        map.set(item, (map.get(item) || 0) + 1);
    }
    return map;
}

function start(){
    readline.question("Enter a list of numbers separated by spaces or commas: ", (input) => {
        const array = String(input).trim().split(/[\s,]+/).filter(Boolean);
        if(array.length === 0){
            console.log("please enter atleast one item");
            return start();
        }
        
        const uniq = unique(array);
        const freq = frequencies(array);

        console.log("Unique : ", uniq.join(", "));
        console.log("Frequencies : ");
        for (const [k, v] of freq) console.log(`${k} : ${v}`);

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