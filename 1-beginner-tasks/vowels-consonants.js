const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function countVowelsConsonants(s){
    let vowels = 0;
    let consonants = 0;
    let lower = String(s).toLowerCase();

    for(const ch of lower) {
        if (ch >= 'a' && ch <= 'z') {
            if ('aeiou'.includes(ch)) vowels++;
            else consonants++;
        }
    }
    return {vowels, consonants};
}

function start(){
    readline.question("Enter a string: ", (input) => {
        const text = String(input).trim();

        if(text.length === 0){
            console.log("please enter a valid string");
            return start();
        }

        const {vowels, consonants} = countVowelsConsonants(text);
        console.log(`Vowels: ${vowels}`);
        console.log(`Consonants: ${consonants}`); 

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

