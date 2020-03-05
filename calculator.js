"use strict"

/* uses:
	opers.js
	alg.js
	interaction.js
*/

let calculated = false;

let timer;
let isTimerRunning = false;

function backspaceButtonDown(event) {
	isTimerRunning = true;
	timer = setTimeout(function () {
		input.value = '';
		isTimerRunning = false;
	}, 600);
}

function backspaceButtonUp(event) {
	if (isTimerRunning) {
		input.value = input.value.slice(0, -1);
		clearTimeout(timer);
		isTimerRunning = false;
	};
}

let input;
function makeInput() {
	let inputDiv = document.createElement('div');
	inputDiv.className = 'input';

	input = document.createElement('input');

	input.oninput = function (event) {
		if (calculated) {
			let diff = this.value[this.value.length - 1];

			if (!opers.includes(diff)) {
				this.value = diff;
			}

			calculated = false;
		}

		this.value = correct(this.value);
	};

	inputDiv.append(input);

	let backspace = document.createElement('div');
	backspace.className = 'button';
	backspace.innerText = '⌫';

	backspace.addEventListener('pointerdown', backspaceButtonDown);
	backspace.addEventListener('pointerup', backspaceButtonUp);

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

	subgrid.append( makeNumButton(10) );
	subgrid.append( makeNumButton(0) );

	for (let i = 7; i >= 1; i -= 3) {
		for (let j = 0; j < 3; j++)
			subgrid.append( makeNumButton(i+j) );
	}

	return subgrid;
}


function makeOpers() {
	let subgrid = makeDivClass('subgrid');
	subgrid.classList.add('opers');

	opers.concat(['=']).forEach(function (oper) {
		let button = makeDivClass('button');
		button.innerText = oper;

		if (oper == '=') {
			button.style['grid-column'] = '1 / 3';

			button.addEventListener('pointerdown', function (event) {
				input.value = calculate(input.value);
			});

		} else addInputOnClick(button);

		subgrid.append(button);
	});

	return subgrid;
}


function addInputOnClick(button, num) {
	button.addEventListener('pointerdown', function (event) {
		inputValue(input, input.value + button.innerText);
		console.log('down');
	});
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

window.oncontextmenu = function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
};

let calc = makeCalculator();
document.body.append(calc);
document.onkeydown = function (event) {
	if (event.code == 'Enter') {
		input.value = calculate(input.value);
		calculated = true;
	}
	input.focus();
}
