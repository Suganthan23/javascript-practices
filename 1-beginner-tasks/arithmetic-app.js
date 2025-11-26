const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
function mul(a, b) { return a * b; }
function div(a, b) { return a / b; } 

function compute(a, op, b) {
  switch (op) {
    case '+': return add(a, b);
    case '-': return sub(a, b);
    case '*': return mul(a, b);
    case '/': return div(a, b);
    default: throw new Error('Unsupported operator');
  }
}

function askNum1(prompt, cb) {
  rl.question(prompt, (input) => {
    const value = Number.parseFloat(String(input).trim());
    if (Number.isNaN(value)) {
      console.log('Please enter a valid number.');
      return askNum1(prompt, cb); 
    }
    cb(value);
  });
}

function askOperator(cb) {
  rl.question('Choose operation (+, -, *, /): ', (input) => {
    const op = String(input).trim();
    if (!['+', '-', '*', '/'].includes(op)) {
      console.log('Please choose one of +, -, *, /.');
      return askOperator(cb);
    }
    cb(op);
  });
}

function askNum2(op, cb) {
  const prompt = 'Enter second number: ';
  rl.question(prompt, (input) => {
    const value = Number.parseFloat(String(input).trim());
    if (Number.isNaN(value)) {
      console.log('Please enter a valid number.');
      return askNum2(op, cb);
    }
    if (op === '/' && value === 0) {
      console.log('Cannot divide by zero. Please enter a non-zero number.');
      return askNum2(op, cb);
    }
    cb(value);
  });
}

function start() {
  askNum1('Enter first number: ', (a) => {
    askOperator((op) => {
      askNum2(op, (b) => {
        const result = compute(a, op, b);
        console.log(`${a} ${op} ${b} = ${result}\n`);
        rl.question('Do another calculation? (y/n): ', (ans) => {
          if (String(ans).trim().toLowerCase().startsWith('y')) {
            console.log('');
            start();
          } else {
            rl.close();
          }
        });
      });
    });
  });
}

start();