const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
})

function ask(){
    readline.question("Enter an integer: ", (input) => {
        const value = Number.parseFloat(String(input).trim());

        if(!Number.isFinite(value) || !Number.isInteger(value)){
            console.log("please enter a valid integer");
            return ask();
        }

        const result = (value % 2 === 0) ? "even" : "odd";
        console.log(`${value} is ${result}`)
        readline.question('Continue? (y/n): ', (ans) => {
          if (String(ans).trim().toLowerCase() === 'y') {
            console.log('');
            ask();
          } else {
            readline.close();
          }
        });
});
}

ask();