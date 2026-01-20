let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

const currentOperandDisplay = document.getElementById('currentOperand');
const previousOperandDisplay = document.getElementById('previousOperand');
const buttons = document.querySelectorAll('.btn');

function updateDisplay() {
    currentOperandDisplay.textContent = currentOperand;
    
    if (operation !== null) {
        const operatorSymbol = getOperatorSymbol(operation);
        previousOperandDisplay.textContent = `${previousOperand} ${operatorSymbol}`;
    } else {
        previousOperandDisplay.textContent = previousOperand;
    }
}

function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    if (number === '0' && currentOperand === '0') return;
    
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentOperand = '0';
        shouldResetScreen = false;
    }
    
    if (currentOperand.includes('.')) return;
    
    currentOperand += '.';
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '' && previousOperand === '') return;
    
    if (previousOperand !== '' && !shouldResetScreen) {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    
    highlightOperator(op);
    updateDisplay();
}

function calculate() {
    if (operation === null || shouldResetScreen) return;
    
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentOperand = 'Error';
                previousOperand = '';
                operation = null;
                shouldResetScreen = true;
                clearOperatorHighlight();
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = formatResult(result);
    previousOperand = '';
    operation = null;
    shouldResetScreen = true;
    
    clearOperatorHighlight();
    updateDisplay();
}

function formatResult(result) {
    if (!isFinite(result)) return 'Error';
    
    const rounded = parseFloat(result.toPrecision(12));
    
    if (Math.abs(rounded) > 999999999999) {
        return rounded.toExponential(6);
    }
    
    return rounded.toString();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;
    
    clearOperatorHighlight();
    updateDisplay();
}

function deleteDigit() {
    if (shouldResetScreen) return;
    
    if (currentOperand === 'Error') {
        clearAll();
        return;
    }
    
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    
    updateDisplay();
}

function highlightOperator(op) {
    clearOperatorHighlight();
    
    buttons.forEach(button => {
        if (button.dataset.action === 'operator' && button.dataset.value === op) {
            button.classList.add('active');
        }
    });
}

function clearOperatorHighlight() {
    buttons.forEach(button => {
        button.classList.remove('active');
    });
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        switch (action) {
            case 'number':
                appendNumber(value);
                break;
            case 'decimal':
                appendDecimal();
                break;
            case 'operator':
                chooseOperation(value);
                break;
            case 'equals':
                calculate();
                break;
            case 'clear':
                clearAll();
                break;
            case 'delete':
                deleteDigit();
                break;
        }
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        event.preventDefault();
        appendNumber(key);
    } else if (key === '.') {
        event.preventDefault();
        appendDecimal();
    } else if (key === '+' || key === '-') {
        event.preventDefault();
        chooseOperation(key);
    } else if (key === '*' || key === 'x' || key === 'X') {
        event.preventDefault();
        chooseOperation('*');
    } else if (key === '/') {
        event.preventDefault();
        chooseOperation('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteDigit();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        event.preventDefault();
        clearAll();
    }
});

updateDisplay();