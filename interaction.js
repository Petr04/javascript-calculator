function makeDivClass(className) {
	let div = document.createElement('div');
	div.className = className;
	return div
}

function inputValue(input, value) {
	input.value = value;
	input.dispatchEvent(new Event('input'));
}
