const { type } = require("os");

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function getByPath(obj, path) {
    if (path === "" || path === null) return { found: true, value: obj };
    const parts = String(path).split(".").map(p => p.trim()).filter(p => p.length > 0);

    let cur = obj;
    for (const key of parts) {
        if (cur !== null && typeof cur === "object" && Object.prototype.hasOwnProperty.call(cur, key)) {
            cur = cur[key];
        } else {
            return { found: false, value: null };
        }
    }
    return { found: true, value: cur };
}

function start() {
    readline.question("Enter an object/array in JSON format: ", (raw) => {
        let obj;
        try {
            obj = JSON.parse(String(raw).trim());
        } catch {
            console.log("Invalid JSON object/array .\n");
            return start();
        }
        if (obj === null || typeof obj !== "object") {
            console.log("Please enter a valid JSON object/array .\n");
            return start();
        }

        readline.question("Enter a key/path : ", (p) => {
            const path = String(p).trim();
            if (!path) {
                console.log("Please enter a valid key/path .\n");
                return start();
            }

            const res = getByPath(obj, path);
            if (res.found) {
                const v = res.value;
                console.log("Value : ", (v !== null && typeof v === "object") ? JSON.stringify(v, null, 2) : v);
            } else {
                console.log("Path not found .\n");
            }

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