function division (trim) {
  let result = 0;
    let left = trim.match(/((\d\.\d)|(\d))*(?=\/)/);
    let right = trim.match(/(?<=\/)((\d\.\d)|(\d))*/);
    if (+right[0] === 0) {
      throw new Error("TypeError: Division by zero.");
    }
    result = +left[0] / +right[0];
    trim = trim.replace(`${left[0]}/${right[0]}`, result);
  return trim;
}

function multiply (trim) {
  let result = 0;
    let left = trim.match(/((\d*\.\d)|(\d))*(?=\*)/);
    let right = trim.match(/(?<=\*)((\d\.\d)|(\d))*/);
    result = +left[0] * +right[0];
    trim = trim.replace(`${left[0]}*${right[0]}`, result);
  return trim;
}

function addition (trim) {
  let result = 0;
    let left = trim.match(/((\d*\.\d)|(\d))*(?=\+)/);
    let right = trim.match(/(?<=\+)((\d\.\d)|(\d))*/);
    result = +left[0] + +right[0];
    trim = trim.replace(`${left[0]}+${right[0]}`, result);
  return trim;
}

function subtraction (trim) {
  let result = 0;
    let left = trim.match(/((\d*\.\d*e\-\d*)|(\d*\.\d*)|(\d*))(?=\-)/);
    let right = trim.match(/(?<=\-)((\d*\.\d*e\-\d*)|(\d\.\d)|(\d))*/);
    if (left[0] === '') {
      left[0] = '-' + right[0];
      right = trim.match(/(?<=\-((\d\.\d)|(\d))*)(\-|\+)((\d\.\d)|(\d))*/);
      result = +left[0] + +right[0];
      trim = trim.replace(`${left[0]}${right[0]}`, result);
    } else {
      result = +left[0] - +right[0];
      trim = trim.replace(`${left[0]}-${right[0]}`, result);
    }
  return trim;
}

function brackets (trim) {
  let open = '';
  let close = trim.indexOf(')');
  for (let i = close - 1; i >= 0; i--) {
    if (trim[i] === '(') {
      open = i;
      break;
    }
  }
  let sub = trim.substring(open + 1, close);
  sub = flow(sub);
  if (sub.indexOf('-') === 0 && (sub.indexOf('+') === -1 && ([...sub.match(/(\-)/g)].length === 1))) {
    if (trim.charAt(open - 1) === '+') {
      trim = trim.replace(`${trim.charAt(open - 1)}(${trim.substring(open + 1, close)})`, sub);
      return trim;
    } else if (trim.charAt(open - 1) === '-') {
      trim = trim.replace(`${trim.charAt(open - 1)}(${trim.substring(open + 1, close)})`, '+' + sub.substring(1));
      return trim;
    } else {
      if (open === 0) {
        trim = '-' + trim;
      } else {
        for (let i = open - 1; i >= 0; i--) {
          if (trim.charAt(i) === '+') {
            trim = trim.substring(0, i) + '-' + trim.substring(i + 1);
            break;
          } else if (trim.charAt(i) === '-') {
            trim = trim.substring(0, i) + '+' + trim.substring(i + 1);
            break;
          } else if (trim.charAt(i) === '(') {
            trim = trim.substring(0, i + 1) + '-' + trim.substring(i + 1);
            break;
          } else if ((i === 0 && trim.charAt(i) === '(') | i === 0) {
            trim = '-' + trim;
          }
        }
      }
      for (let i = close - 1; i >= 0; i--) {
        if (trim[i] === '(') {
          open = i;
          break;
        }
      }
      close = trim.indexOf(')');
      trim = trim.replace(`(${trim.substring(open + 1, close)})`, sub.substring(1));
      return trim;
    }
  } else {
    trim = trim.replace(`(${trim.substring(open + 1, close)})`, sub);
    return trim;
  }
}

function flow (trim) {
  while (trim.indexOf('/') !== -1 | trim.indexOf('*') !== -1) {
    if ((trim.indexOf('/') < trim.indexOf('*') && trim.indexOf('/') !== -1 && trim.indexOf('*') !== -1) | (trim.indexOf('/') !== -1 && trim.indexOf('*') === -1)) {
      trim = division(trim);
    } else {
      trim = multiply(trim);
    }
  }
  while (trim.indexOf('+') !== -1 | trim.indexOf('-') !== -1) {
    if ((trim.indexOf('+') < trim.indexOf('-') && trim.indexOf('+') !== -1 && trim.indexOf('-') !== -1 && trim.indexOf('-') !== 0) | (trim.indexOf('+') !== -1 && trim.indexOf('-') === -1))  {
      trim = addition(trim);
    } else if (trim.indexOf('-') === 0 && trim.indexOf('+') === -1 && ([...trim.match(/(\-)/g)].length === 1)) {
      break;
    } else {
      trim = subtraction(trim);
    }
  }
  return trim;
}

function expressionCalculator(expr) {
 let trim = expr.replace(/[\s]/g, '');
 if (trim.indexOf('(') !== -1 | trim.indexOf(')') !== -1 ) {
  let open = [];
  let close = [];
  for (let i = 0; i < trim.length; i++) {
    if (trim[i] === '(') {
      open.push(trim[i]);
    }
    if (trim[i] === ')') {
     close.push(trim[i]);
    }
  }
   if (open.length === close.length) {
     while (trim.indexOf('(') !== -1) {
      trim = brackets(trim);
     }
   } else {
     throw new Error ("ExpressionError: Brackets must be paired");
   }
 }
 trim = flow(trim);
  return +trim;
}

module.exports =    { expressionCalculator}

//console.log(expressionCalculator(" 24 - 23 * 17 / (  93 + 52 * 70 * (  6 + 91 / (  (  4 / 39 / 8 * 30  ) / (  22 * 97 * (  32 * 20 * (  82 - 80 * 51 / 89 * 9  ) * 56 + 82  ) * 89  ) - 17 - 17  ) / 29 / 81  )  ) "));
