const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
})

function start() {
    readline.question(`Type "C" to convert Celcius to Fahrenheit or type "F" to convert Fahrenheit to Celcius: `, (choice) => {
        if (choice.toUpperCase() === "C") {
            readline.question("Enter the temperature in Celcius: ", (input) => {
                const celcius = parseFloat(input);
                const fahrenheit = (celcius * 9 / 5) + 32;
                console.log(`${celcius}°C is equal to ${fahrenheit}°F`);
                readline.close();
            });
        } else if (choice.toUpperCase() === "F") {
            readline.question("Enter the temperature in Fahrenheit: ", (input) => {
                const fahrenheit = parseFloat(input);
                const celcius = (fahrenheit - 32) * 5 / 9;
                console.log(`${fahrenheit}°F is equal to ${celcius}°C`);
                readline.close();
            });
        } else {
            console.log("Invalid choice");
            start();
        }
    });
}

start();