const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function wordCounter(s){
    const trimmed = String(s).trim();
    if(!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

function start(){
    readline.question("Enter a string: ", (input) => { 
        const text = String(input);
        if(!text.trim()){
            console.log("please enter a valid string");
            return start();
        }

        const words = wordCounter(text);
        console.log(`The string has ${words} words`);

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