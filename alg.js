/* uses:
	opers.js
*/

let digits = [];
for (let i = 0; i < 10; i++) digits.push(String(i));

function correct(expr) {
	return Array.from(expr)
		.filter(x => [digits, opers].some(arr => arr.includes(x)))
		.join('');
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

function solveUnary(splitted, oper, f, type) {
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

function calculateNum(expr) {
	let splitted = splitExpr(expr);

	splitted = solveUnary(splitted, square, (x) => x*x, 'postfix');
	splitted = solveUnary(splitted, root, Math.sqrt, 'prefix');

	return eval(splitted.join(''));
}

function calculate(expr) {
	if (expr == '') return '';

	let ret;
	try {
		ret = calculateNum(expr);
	} catch (err) {
		return String(NaN);
	}

	return String(ret);
}
