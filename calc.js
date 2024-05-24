function calculate() {
    const inputEl = document.getElementById("js-calc-input");
    const initValue = inputEl.value;

    try {
        const result = evaulateInitValue(initValue);
        inputEl.value = result;
        lastResult = result;
    } catch (e) {
        inputEl.value = `Error: ${e.message}`;
    }
}

function evaulateInitValue(initValue) {
    const tokens = tokenize(initValue);
    const rpn = toRPN(tokens);
    return evaulateRPN(rpn);
}

function tokenize(initValue) {
    const regex = /\d+(\.\d+)?|[\+\-\*\/\(\)]/g;
    return initValue.match(regex);
}

function toRPN(tokens) {
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    }
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach(token => {
        if (/\d/.test(token)) {
            outputQueue.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        } else if (['+','-','*','/'].includes(token)) {
            while (operatorStack.length && precedence[token] <= precedence[operatorStack[operatorStack.length -1]]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token)
        }
    });

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }
    return outputQueue;
}

function evaulateRPN(rpn) {
    const stack = [];

    rpn.forEach(token => {
        if (/\d/.test(token)) {
            stack.push(parseFloat(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
            }
        }
    })
    return stack[0];
}

function clearInput() {
    const inputEl = document.getElementById("js-calc-input");
    if (inputEl.value == lastResult) {
        inputEl.value = '';
    } else {
        return;
    }
}

