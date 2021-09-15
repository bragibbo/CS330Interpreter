const fs = require("fs");

function mainParser() {
  // const stringInput = fs.readFileSync(0).toString();
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";
  console.log("Input string: " + stringInput);

  let res = SExpressionParser(stringInput, 0, []);
  console.log("\nResult")
  console.log(JSON.stringify(res[2], null, 2));
}

function SExpressionParser(inputString, index, parenStack) {
  if (index >= inputString.length) return [index, [...parenStack]];

  console.log("\n NEW ENTRY")
  let start = new SExp()
  start.paren = [...start.paren, nextCharNotParen(inputString, index, [])]
  inputString = inputString.slice(start.paren.length)
  inputString = inputString.slice(nextCharNotWhiteSpace(inputString, 0));
  index = 0
  console.log("\nAfter slice and char: " + inputString)

  atomRes = getAllAtoms(inputString, index, []);
  console.log("Atoms: " + atomRes[1]);
  index += atomRes[0]
  // let res = SExpressionParser(inputString, index, [...parenStack]);
  // index = res[0];
  // parenStack = res[1];
  start.symbol = [...start.symbol, atomRes[1]]

  index = nextCharNotWhiteSpace(inputString, index);
  inputString = inputString.slice(index)
  index = 0
  console.log("index, char :" + index + " - " + inputString[index]);
  console.log(start)

  if

  if (checkOpenParens(inputString[index])) {
    parenStack.push(inputString[index]);
    let res = SExpressionParser(
      inputString,
      index,
      [...parenStack]
    );
    index = res[0];
    parenStack = res[1];
    start.rest = res[2]
  }

  return [index, [...parenStack], start];
}

function getNextParen(inputString, index) {
  if (checkCloseParens(inputString[index]) || checkOpenParens(inputString[index])) {
    return index
  }

  return getNextParen(inputString, index)
}

function getAllAtoms(inputString, index, listAtoms) {
  console.log(inputString)
  if (checkCloseParens(inputString[index]) || checkOpenParens(inputString[index])) {
    return [index, listAtoms]
  }
  
  index = nextCharNotWhiteSpace(inputString, index)
  console.log(index)
  atom = AtomParser(inputString, index)
  if (atom === null) {
    return [index, listAtoms]
  }
  console.log(atom)
  listAtoms = [...listAtoms, atom]
  index = nextCharNotWhiteSpace(inputString, index)
  console.log(index)
  return getAllAtoms(inputString, index + atom.length, listAtoms)
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
  console.log(inputString[index])
  if (inputString[index] !== " " && index < inputString.length) {
    return index;
  }
  return nextCharNotWhiteSpace(inputString, index + 1);
}

function nextCharNotParen(inputString, index, stack) {
  if (!checkOpenParens(inputString[index])) {
    return stack
  }
  return nextCharNotParen(inputString, index + 1, [...stack, inputString[index]]);
}

function nextCharParen(inputString, index) {
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

class SExp {
  constructor(symbol, rest, paren) {
    this.paren = []
    this.symbol = []
  }
}

mainParser();
