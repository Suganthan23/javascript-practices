const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function isPalindrome(text) {
    const clean = String(text).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (clean.length === 0) return false;
    const reversed = clean.split('').reverse().join('');
    return clean === reversed;
}

function ask() {
    readline.question("Enter a text: ", (input) => {
        const result = String(input).trim();
        if(result.length === 0) {
            console.log("please enter a valid text");
            return ask();
        }

        const isPal = isPalindrome(result);
        console.log(`${result} is ${isPal ? "a palindrome" : "not a palindrome"}`);

        readline.question("Check another text? (y/n): ", (ans) => {
            if (String(ans).trim().toLowerCase() === "y") {
                console.log("");
                ask();
            } else {
                readline.close();
            }
        });
    });
}
ask();