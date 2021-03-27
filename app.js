// After you do 9 + 3 and hit enter you get 12
// If you then hit + 10 you will get 15 because secondNum
// is not getting updated

// Also, what if you do 9 + 3 + 4? It doesn't update
// the calculation after hitting the second operator

let calcWrapper = document.getElementById('calculator-wrapper');
let calcEle = document.getElementById('calculation');

let firstNum = 0;
let secondNum = 0;

let operation = 'none'; // none, divide, multiply, subtract, or add
let calculation = 'none';

function updateNum(event) {
    let buttonPressed = event.target;

    // Prevents the user from entering a number greater than 10 digits
    // inclusive of a decimal point
    if (calcEle.innerText.length + 1 > 10) {
        return;
    }

    if (buttonPressed.classList.contains('main-button') && (calcEle.innerText === '0' || calcEle.innerText === '')) {
        if (buttonPressed.innerText === '.') {
            calcEle.innerText = '0.';
        } else {
            calcEle.innerText = buttonPressed.innerText;
        }
    } else if (buttonPressed.classList.contains('main-button') && calcEle.innerText !== '0' && calcEle.innerText !== 'error' && calcEle.innerText !== 'NaN') {
        // If there isn't already a decimal, then append number to calcEle
        if (calcEle.innerText.indexOf('.') === -1) {
            calcEle.innerText = calcEle.innerText + buttonPressed.innerText;
        } else if (calcEle.innerText.indexOf('.') >= 0 && buttonPressed.innerText !== '.') {
            calcEle.innerText = calcEle.innerText + buttonPressed.innerText;
        }
    }
}

// Darkens background color of button when clicked
function changeButtonColor(event) {
    let buttonPressed = event.target;

    if (event.type === 'mousedown') {
        if (buttonPressed.classList.contains('function')) {
            buttonPressed.style.backgroundColor = 'var(--color-functions-pressed)';
        } else if (buttonPressed.classList.contains('main-button')) {
            buttonPressed.style.backgroundColor = 'var(--color-numbers-pressed)';
        } else if (buttonPressed.classList.contains('operator')) {
            buttonPressed.style.backgroundColor = 'var(--color-operators-pressed)';
        }
    }
    
    if (event.type === 'mouseup' || event.type === 'mouseleave') {
        if (buttonPressed.classList.contains('function')) {
            buttonPressed.style.backgroundColor = 'var(--color-functions)';
        } else if (buttonPressed.classList.contains('main-button')) {
            buttonPressed.style.backgroundColor = 'var(--color-numbers)';
        } else if (buttonPressed.classList.contains('operator')) {
            buttonPressed.style.backgroundColor = 'var(--color-operators)';
        }
    }

}

// Checks to see if innerText of the element is out of range
function outOfRange(num) {
    if (num > 999999999 || num < -999999999) {
        return true;
    } else {
        return false;
    }
}

// Function button clicked (AC to clear, DEL to delete one digit if no operator button was pressed)
function funcButton(event) {
    let buttonPressed = event.target;

    if (buttonPressed.classList.contains('function')) {
        if (buttonPressed.innerText === 'AC') {
            calcEle.innerText = '0';
            firstNum = 0;
            secondNum = 0;
            calculation = 'none';
            operation = 'none';
        } else if (buttonPressed.innerText === 'DEL' && calcEle.innerText !== 'error' && calcEle.innerText !== 'NaN') {
            // if calcEle.innerText is...
                // any single digit or 0., make it 0
            if (calcEle.innerText === '0.' || calcEle.innerText.length === 1) {
                calcEle.innerText = '0';
            } else {
                // #.#, remove last char
                // multiple nums, remove last char
                calcEle.innerText = calcEle.innerText.slice(0, -1);
            }
        }
    }
}

function updateOperation(event) {
    let buttonPressed = event.target;

    if (calcEle.innerText === 'error' || calcEle.innerText === 'NaN') {
        return;
    }

    if (buttonPressed.classList.contains('operator') && event.target.innerText === '=') {
        // If they clicked '=', perform the operation stored in 'operation' between firstNum and secondNum

        secondNum = parseFloat(calcEle.innerText);
        // if (calculation === 'none') {
        //     secondNum = parseFloat(calcEle.innerText);
        // }

        if (operation === 'none') {
            return;
        }

        switch(operation) {
            case 'divide':
                calculation = divide(firstNum, secondNum).toFixed(4);
                break;
            case 'multiply':
                calculation = multiply(firstNum, secondNum).toFixed(4);
                break;
            case 'subtract':
                calculation = subtract(firstNum, secondNum).toFixed(4);
                break;
            case 'add':
                calculation = add(firstNum, secondNum).toFixed(4);
                break;
        }
        // Then show calculated result in display div (check if overflow error and make sure to limit result to 4 decimal places)
        if (outOfRange(parseFloat(calculation))) {
            calcEle.innerText = 'error';
        } else if (calcEle.innerText.length + 1 > 10) {
            calcEle.innerText = 'error';
        } else {
            calcEle.innerText = parseFloat(calculation);
            firstNum = parseFloat(calculation);
        }
        
        // Move the calculated result into firstNum and leave operation and secondNum in case they want to hit '=' again and again

    } else if (buttonPressed.classList.contains('operator')) {
        // If they clicked a different operator (multiply, add, etc.), change 'operation' to the appropriate operator and store the display number into firstNum (up to a maximum of 4 decimal places)

        switch(buttonPressed.innerText) {
            case '÷':
                operation = 'divide';
                // if innerText === '' then don't update firstNum
                updateFirst(calcEle.innerText);
                calcEle.innerText = '';
                break;
            case '×':
                operation = 'multiply';
                updateFirst(calcEle.innerText);
                calcEle.innerText = '';
                break;
            case '−':
                operation = 'subtract';
                updateFirst(calcEle.innerText);
                calcEle.innerText = '';
                break;
            case '+':
                operation = 'add';
                updateFirst(calcEle.innerText);
                calcEle.innerText = '';
                break;
        }
    }
}

function updateFirst(string) {
    if (string !== '') {
        firstNum = parseFloat(calcEle.innerText);
    }
}

function divide(num1, num2) {
    return num1 / num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function add(num1, num2) {
    return num1 + num2;
}

// Event handlers
let buttonHandler = (event) => { 
    changeButtonColor(event);
    updateNum(event);
    funcButton(event);
    updateOperation(event);
 }


// Event listeners
calcWrapper.addEventListener('mousedown', buttonHandler);
calcWrapper.addEventListener('mouseup', changeButtonColor);
document.querySelectorAll('.button').forEach(element => {
    element.addEventListener('mouseleave', changeButtonColor);
});