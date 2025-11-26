const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
})

const randomNumber = Math.floor(Math.random() * 10) + 1;

function ask(){
    readline.question("guess a number between 1 and 10:", (input) => {
        const guess = Number(input);

        if(isNaN(guess)) {
            console.log("please enter a valid number");
            ask();
            return;
        }

        if(guess === randomNumber) {
            console.log("you guessed the correct number")
            readline.close();
        }
        else {
            console.log(guess > randomNumber ? "too high" : "too low");
            ask();
            return;
        }
    });
}

ask();