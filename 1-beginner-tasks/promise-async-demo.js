const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function fakeRequest(label, delayMs, shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(shouldFail) reject(new Error(`${label} failed`));
            else resolve({label, delayMs, at : new Date().toLocaleTimeString()});
        }, delayMs);
    });
}

function runThen(delay, shouldFail){
    console.log("Start (then/catch)");
    const f = fakeRequest("Demo", delay, shouldFail);
    console.log("This prints before the promise settles");
    f.then((data) => {
        console.log("Result : ", data);
    }).catch((err) => {
        console.log("Error : ", err.message);
    }).finally(() => again());
}

async function runAwait(delay, shouldFail){
    console.log("Start (async/await)");
    const f = fakeRequest("Demo", delay, shouldFail);
    console.log("This prints before the await settles");
    try {
        const data = await f;
        console.log("Result : ", data);
        } catch (err) {
        console.log("Error : ", err.message);
    } finally {
        again();
    }
}

function askInputs(){
    readline.question("Mode (then/await): ", (m) => {
        const mode = String(m).trim().toLowerCase();

         readline.question("Delay (ms): ", (d) => {
            const delay = Number.parseFloat(String(d).trim());
            if(!Number.isFinite(delay) || !Number.isInteger(delay) || delay < 0){
                console.log("please enter a valid number");
                return askInputs();
            }

            readline.question("Fail? (y/n): ", (ans) => {
                const shouldFail = String(ans).trim().toLowerCase() === "y";
                if(mode === "then"){
                    runThen(delay, shouldFail);
                } else runAwait(delay, shouldFail);
            });
        });
    });                
}

function again(){
    readline.question("Run again? (y/n): ", (ans) => {
        if (String(ans).trim().toLowerCase() === "y") {
            console.log("");
            askInputs();
        } else {
            readline.close();
        }
    });
}

askInputs();