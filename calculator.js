"use strict"

function makeDivClass(className) {
	let div = document.createElement('div');
	div.className = className;
	return div
}


let square = '²';
let root = '√';
let opers = Array.from('²√*/+-=');
let calculated = false;

function checkDiff(s, diff) {
	// let digits = [];
	// for (let i = 0; i < 10; i++) digits.push(String(i));

	// let last = s[s.length - 1];

	// return (opers + digits + '.').includes(diff) &&
	// 	!( opers.includes(last) && opers.includes(diff) );
	return true;
}

function makeInput() {
	let inputDiv = document.createElement('div');
	inputDiv.className = 'input';

	let input = document.createElement('input');
	input.id = 'input';

	input.lastValue = input.value;

	input.oninput = function (event) {
		let diff = this.value[this.value.length - 1];

		if (calculated) {
			this.lastValue = '';
		}

		let correct = checkDiff(this.lastValue, diff);

		if (!correct)
			this.value = this.lastValue;
		else if (calculated) {
			if (!opers.includes(diff))
				this.value = diff;
			calculated = false;
		}

		this.lastValue = this.value;
	};

	inputDiv.append(input);

	let backspace = document.createElement('div');
	backspace.className = 'button';
	backspace.innerText = '⌫';

	let timer;
	let isTimerRunning = false;

	backspace.addEventListener('mousedown', function (event) {
		isTimerRunning = true;
		timer = setTimeout(function () {
			input.value = '';
			isTimerRunning = false;
		}, 700);
	});
	backspace.addEventListener('mouseup', function (event) {
		if (isTimerRunning) {
			input.value = input.value.slice(0, -1);
			clearTimeout(timer);
			isTimerRunning = false;
		};
	});

	inputDiv.append(backspace);

	return inputDiv;
}


function makeNumButton(i) {
	let button = makeDivClass('button');
	button.classList.add('number');
	button.innerText = i == 10 ? '.' : i;
	addInputOnClick(button, true);

	if (i == 0) {
		button.style['grid-row-start'] = '4';
		button.style['grid-column'] = '1 / 3';
	}

	if (i == 10) {
		button.style['grid-row-start'] = '4';
		button.style['grid-columnt-start'] = '3';
	}

	return button;
}

function makeNumbers() {
	let subgrid = makeDivClass('subgrid');
	subgrid.classList.add('numbers');

	for (let i = 0; i <= 10; i++) {
		subgrid.append( makeNumButton(i) );
	}

	return subgrid;
}


function exprCharType(c) {
	if (opers.includes(c)) {
		return 'oper';
	}
	return 'digit';
}

function splitExpr(expr) {
	let ret = [];
	let lastType = null;

	for (let c of expr) {
		let newType = exprCharType(c);
		if ((newType != lastType) || (lastType == 'oper'))
			ret.push('');

		ret[ret.length - 1] += c;

		lastType = newType;
	}

	return ret;
}

function solveBinary(splitted, oper, f, type) {
	let ret = [];
	let transform = (x) => String(f(Number(x)));

	for (let i = 0; i < splitted.length; i++) {
		if (splitted[i] == oper) {
			if (type == 'prefix') {
				ret.push(transform(splitted[++i]));
			} else {
				ret[i-1] = transform(ret[i-1]);
			}
		} else
			ret.push(splitted[i]);
	}

	return ret;
}

function calculate(expr) {
	let splitted = splitExpr(expr);

	splitted = solveBinary(splitted, square, (x) => x*x, 'postfix');
	splitted = solveBinary(splitted, root, Math.sqrt, 'prefix');

	calculated = true;
	return eval(splitted.join(''));
}

function makeOpers() {
	let subgrid = makeDivClass('subgrid');
	subgrid.classList.add('opers');

	opers.forEach(function (oper) {
		let button = makeDivClass('button');
		button.innerText = oper;

		if (oper == '=') {
			button.style['grid-column'] = '1 / 3';
			button.onclick = function (event) {
				input.value = calculate(input.value);
			};
		} else addInputOnClick(button);

		subgrid.append(button);
	});

	return subgrid;
}

function inputValue(input, value) {
	input.value = value;
	input.dispatchEvent(new Event('input'));
}

function addInputOnClick(button, num) {
	button.onclick = function (event) {
		inputValue(input, input.value + button.innerText)
	};
}


function makeCalculator() {
	let calc = makeDivClass('calculator');
	let buttons = makeDivClass('buttons');
	buttons.classList.add('subgrid');

	buttons.append(makeNumbers());
	buttons.append(makeOpers());

	calc.append(makeInput());
	calc.append(buttons);

	return calc;
}

let calc = makeCalculator();
document.body.append(calc);
document.onkeydown = function (event) {
	if (event.code == 'Enter') {
		if (calculated) {
			input.value = '';
			calculated = false;
		}

		input.value = calculate(input.value);
	}
	input.focus();
}
