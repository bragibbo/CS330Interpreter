const fs = require("fs");

function mainParser() {
  // const stringInput = fs.readFileSync(0).toString();
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";
  console.log("Input string: " + stringInput);

  let res = SExpressionParser(stringInput, 0, [], []);
  console.log(JSON.stringify(res[2]));
}

function SExpressionParser(inputString, index, parenStack, total) {
  if (index >= inputString.length) return [index, [...parenStack]];
  let newIndex = nextCharNotWhiteSpace(inputString, index);
  let oldIndex = newIndex;

  // console.log("index, char :" + index + " - " + inputString[index]);
  let struct = {}


  if (checkOpenParens(inputString[newIndex])) {
    parenStack.push(inputString[newIndex]);
    let res = SExpressionParser(
      inputString,
      newIndex + 1,
      [...parenStack],
      total
    );
    newIndex = res[0];
    parenStack = res[1];
  }

  const atom = AtomParser(inputString, newIndex);
  if (atom != null) {
    console.log("Atoms: " + atom);
    newIndex += atom.length;
    newIndex = nextCharNotWhiteSpace(inputString, newIndex);
    let res = SExpressionParser(inputString, newIndex, [...parenStack], total);
    newIndex = res[0];
    parenStack = res[1];
  }

  if (checkCloseParens(inputString[newIndex])) {
    parenStack = parenStack.filter((elm, ind) => ind < parenStack.length - 1);
    if (parenStack.length !== 0) {
      let res = SExpressionParser(
        inputString,
        newIndex + 1,
        [...parenStack],
        total
      );
      newIndex = res[0];
      parenStack = res[1];
    }
  }
  let finalIndex = newIndex

  // total.push(inputString.substring(oldIndex, finalIndex + 1))

  return [newIndex, [...parenStack], [...total]];
}

function getNextParen(inputString, index) {
  if (checkCloseParens(inputString[index]) || checkOpenParens(inputString[index])) {
    return index
  }

  return getNextParen(inputString, index)
}

function AtomParser(inputString, index) {
  if (!isNaN(inputString[index])) {
    return parseFullNumber(inputString, index);
  } else if (inputString[index] === '"') {
    return parseFullString(inputString, index);
  } else if (inputString[index] === "#" && inputString[index + 1] === "f") {
    return "#f";
  } else if (
    !checkCloseParens(inputString[index]) &&
    !checkOpenParens(inputString[index])
  ) {
    return parseFullSymbol(inputString, index);
  }

  return null;
}

function parseFullNumber(inputString, index) {
  if (
    checkCloseParens(inputString[index + 1]) ||
    inputString[index + 1] === " "
  ) {
    return inputString[index];
  }
  return inputString[index] + parseFullNumber(inputString, index + 1);
}

function parseFullString(inputString, index) {
  if (inputString[index + 1] === '"') {
    return inputString[index];
  }
  return inputString[index] + parseFullString(inputString, index + 1);
}

function parseFullSymbol(inputString, index) {
  if (
    inputString[index + 1] === " " ||
    checkCloseParens(inputString[index + 1])
  ) {
    return inputString[index];
  }
  return inputString[index] + parseFullSymbol(inputString, index + 1);
}

function nextCharNotWhiteSpace(inputString, index) {
  if (inputString[index] !== " " && index < inputString.length) {
    return index;
  }
  return nextCharNotWhiteSpace(inputString, index + 1);
}

function checkOpenParens(character) {
  return character === "(" || character === "[";
}

function checkCloseParens(character) {
  return character === ")" || character === "]";
}

mainParser();
