// Potential features to add:
    // Limit button clicking to left clicks only
    // If the user does 6 + 3 it will compute 9 but if they keep hitting = it will keep adding 3
    // +/- button to allow user to change a number to a negative number

let calcWrapper = document.getElementById('calculator-wrapper');
let calcEle = document.getElementById('calculation');

let calcArr = [];
const operators = ['÷', '×', '−', '+'];
let tempNum = 'none';
let tempOperator = 'none';

// Updates the number on the display when a user presses a number or decimal button
function updateNum(event) {
    let buttonPressed = event.target;
    let displayedNum = calcEle.innerText;

    // Prevents the user from entering a number greater than 10 digits
    // inclusive of a decimal point
    if (displayedNum.length + 1 > 10 || displayedNum === 'error' || displayedNum === 'NaN') {
        return;
    }

    // if length of calcArr is 1 or 3 and user presses a number, assume they want to start a new calculation
    if (calcArr.length === 3 || calcArr.length === 1) {
        // clear the array
        calcArr = [];
        // update the display with the number pressed or '0.' if they press decimal
        if (buttonPressed.innerText === '.') {
            calcEle.innerText = '0.';
            return;
        } else {
            calcEle.innerText = buttonPressed.innerText;
            return;
        }
    }

    if (displayedNum === '0' || displayedNum === '') {
        if (buttonPressed.innerText === '.') {
            // if display shows 0 or is blank and the user presses '.', update display to '0.'
            calcEle.innerText = '0.';
        } else {
            // if display shows 0 or is blank and user presses a number, update display to number pressed
            calcEle.innerText = buttonPressed.innerText;
        }
    } else if (displayedNum !== '0' && displayedNum !== 'error' && displayedNum !== 'NaN') {
        // if display has more than a 0 (for example 0. or any other number)
        if (displayedNum.indexOf('.') === -1) {
            // if there is no decimal somewhere, add the number/decimal pressed to the end
            calcEle.innerText = displayedNum + buttonPressed.innerText;
        } else if (displayedNum.indexOf('.') >= 0 && buttonPressed.innerText !== '.') {
            // if there is a decimal and they pressed a number, add the number pressed to the end
            calcEle.innerText = displayedNum + buttonPressed.innerText;
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
        } else if (buttonPressed.classList.contains('operator') || buttonPressed.classList.contains('equals')) {
            buttonPressed.style.backgroundColor = 'var(--color-operators-pressed)';
        }
    }
    
    if (event.type === 'mouseup' || event.type === 'mouseleave') {
        if (buttonPressed.classList.contains('function')) {
            buttonPressed.style.backgroundColor = 'var(--color-functions)';
        } else if (buttonPressed.classList.contains('main-button')) {
            buttonPressed.style.backgroundColor = 'var(--color-numbers)';
        } else if (buttonPressed.classList.contains('operator') || buttonPressed.classList.contains('equals')) {
            buttonPressed.style.backgroundColor = 'var(--color-operators)';
        }
    }

}

// Checks to see if a float is out of range
function outOfRange(num) {
    if (num > 9999999999 || num < -9999999999) {
        return true;
    } else {
        return false;
    }
}

// Function button clicked (AC to clear, DEL to delete one digit if no operator button was pressed)
function funcButton(event) {
    let buttonPressed = event.target.innerText;

    if (buttonPressed === 'AC') {
        calcEle.innerText = '0';
        calcArr = [];
        tempNum = 'none';
        tempOperator = 'none';
    } else if (buttonPressed === 'DEL' && calcEle.innerText !== 'error' && calcEle.innerText !== 'NaN') {
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

// Calls the appropriate arithmetic function
function calculate(num1, num2, operation) {
    switch(operation) {
        case '÷':
            return parseFloat(divide(num1, num2).toFixed(4));
        case '×':
            return parseFloat(multiply(num1, num2).toFixed(4));
        case '−':
            return parseFloat(subtract(num1, num2).toFixed(4));
        case '+':
            return parseFloat(add(num1, num2).toFixed(4));
    }
}

// Handles scenarios where the equals button is pressed
function equals(event) {

    // if display is showing an error, do nothing
    if (calcEle.innerText === 'error' || calcEle.innerText === 'NaN') {
        return;
    }

    // if user presses = and..
    if (calcArr.length === 0) {
        // calcArr is empty, push the number on display into array:
        calcArr.push(parseFloat(calcEle.innerText));
    } else if (calcArr.length === 1) {
        // calcArr has one item in it, replace it with number on display
        calcArr[0] = parseFloat(calcEle.innerText);
    } else if (calcArr.length === 2) {
        // if length is 2
            // if display is blank, push 0 to calcArr
            if (calcEle.innerText === '') {
                calcArr.push(0);
            } else {
                calcArr.push(parseFloat(calcEle.innerText));
            }
            // calculate calcArr[0] and calcArr[2] and display on screen
            calcEle.innerText = calculate(calcArr[0], calcArr[2], calcArr[1]);
    } else if (calcArr.length === 3) {
        calcArr = [];
        calcArr.push(parseFloat(calcEle.innerText));
    }

    // Verify displayed number isn't out of range or too long
    if (outOfRange(parseFloat(calcEle.innerText)) || calcEle.innerText.length > 10) {
        calcEle.innerText = 'error';
    }
}

// Handles scenarios where an operator button is pressed
function updateOperation(event) {
    let operatorUsed = event.target.innerText;
    let currentDisplay = calcEle.innerText;

    if (currentDisplay === 'error' || currentDisplay === 'NaN') {
        return;
    }

    if (calcArr.length === 0) {
        // if they hit an operator and calcArr is empty
            // add number on display to array
            calcArr.push(parseFloat(calcEle.innerText));
            // add operator to array
            calcArr.push(operatorUsed);
            // change display to blank to make it ready for a new number
            calcEle.innerText = '';
    } else if (operators.indexOf(calcArr[calcArr.length - 1]) >= 0) {
        // if they hit an operator and the last item in calcArray is an operator and the display is blank
            // override the operator with the one pressed
        if (calcEle.innerText === '') {
            calcArr[calcArr.length - 1] = operatorUsed;
        } else {
            // if display is not blank perform calculation for calcArr[0] and displayed num with operator calcArr[1]
            calcEle.innerText = calculate(calcArr[0], parseFloat(currentDisplay), calcArr[1]);
            // clear array
            calcArr = [];
            // push calculation to array
            calcArr.push(parseFloat(calcEle.innerText));
            calcArr.push(operatorUsed);
            calcEle.innerText = '';
        }
    } else if (calcArr.length === 1) {
        // if they hit an operator and calcArray has something in it and the length is 1
            // add the operator to the array
            calcArr.push(operatorUsed);
            calcEle.innerText = '';
    } else if (calcArr.length === 3) {
        // if they hit an operator and calcArray has 3 items in it
            // calculate operation on numbers in array
            tempNum = calculate(calcArr[0], calcArr[2], calcArr[1]);
            // clear array, push tempNum and operatorUsed to calcArr
            calcArr = [];
            calcArr.push(tempNum);
            calcArr.push(operatorUsed);
            // change display to blank to make it ready for a new number
            calcEle.innerText = '';
            // clear tempNum
            tempNum = 'none';
    }
}

// Arithmetic functions
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

// Event listeners
calcWrapper.addEventListener('mousedown', changeButtonColor);
calcWrapper.addEventListener('mouseup', changeButtonColor);
document.querySelector('.equals').addEventListener('mousedown', changeButtonColor);
document.querySelector('.equals').addEventListener('mousedown', equals);

document.querySelectorAll('.main-button').forEach(element => {
    element.addEventListener('mousedown', updateNum);
});

document.querySelectorAll('.function').forEach(element => {
    element.addEventListener('mousedown', funcButton);
});

document.querySelectorAll('.operator').forEach(element => {
    element.addEventListener('mousedown', updateOperation);
});

document.querySelectorAll('.button').forEach(element => {
    element.addEventListener('mouseleave', changeButtonColor);
});