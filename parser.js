const fs = require("fs");

function mainParser() {
  // const stringInput = fs.readFileSync(0).toString();
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";

  let parsedString = SExpressionParser(stringInput, 0, []);
  console.log(JSON.stringify(parsedString, null, 2));
}

function SExpressionParser(stringToParse) {
  let expression = parse([new SExprParse("d", [])], stringToParse);
  return expression[0].listSExpr[0]
}

function parse(parenStack, inputString) {
  // Check for open paren
  const newParenStack = checkOpenParens(inputString[0])
    ? parse(
        [...parenStack, new SExprParse(inputString[0], [])],
        inputString.slice(1).trim()
      )
    : parenStack;

  // Take off as many atoms as you want
  atomRes = getAllAtoms(inputString, 0, []);
  let newInputString = atomRes[0];

  let nextParenStack = [];
  if (newInputString[0] === "]" && newParenStack.at(-1).paren === "[") {
    let tmpSExpr = new SExprBracket([...newParenStack.at(-1).listSExpr, ...atomRes[1]]);
    let tmpSExpr2 = new SExprParse(newParenStack.at(-2).paren, [...newParenStack.at(-2).listSExpr, tmpSExpr])
    let tmpStack2 = newParenStack.filter((elm, ind) => ind !== newParenStack.length - 2 && ind !== newParenStack.length - 1)
    nextParenStack = [...tmpStack2, tmpSExpr2];
    newInputString = newInputString.trim().slice(1).trim()

  } else if (newInputString[0] === ")" && newParenStack.at(-1).paren === "(") {
    let tmpSExpr = new SExprParen([...newParenStack.at(-1).listSExpr, ...atomRes[1]]);
    let tmpSExpr2 = new SExprParse(newParenStack.at(-2).paren, [...newParenStack.at(-2).listSExpr, tmpSExpr])
    let tmpStack2 = newParenStack.filter((elm, ind) => ind !== newParenStack.length - 2 && ind !== newParenStack.length - 1)
    nextParenStack = [...tmpStack2, tmpSExpr2];
    newInputString = newInputString.trim().slice(1).trim()

  } else {
    let tmpSExpr = new SExprParse(newParenStack.at(-1).paren, [...newParenStack.at(-1).listSExpr, ...atomRes[1]]);
    let tmpStack2 = newParenStack.filter((elm, ind) => ind !== newParenStack.length - 1)
    nextParenStack = [...tmpStack2, tmpSExpr];
  }

  if (nextParenStack.length <= 1) {
    return nextParenStack;
  }

  return parse(nextParenStack, newInputString.trim());
}

function getAllAtoms(inputString, index, listAtoms) {
  if (
    checkCloseParens(inputString[index]) ||
    checkOpenParens(inputString[index])
  ) {
    return [inputString, [...listAtoms]];
  }

  atom = AtomParser(inputString.trim(), 0);
  if (atom === null) {
    return [inputString, [...listAtoms]];
  }
  newlistAtoms = [...listAtoms, atom];
  let sliceIndex = index + atom.length;
  return getAllAtoms(inputString.slice(sliceIndex).trim(), 0, newlistAtoms);
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

function checkOpenParens(character) {
  return character === "(" || character === "[";
}

function checkCloseParens(character) {
  return character === ")" || character === "]";
}

class SExprParse {
  constructor(paren, listSExpr) {
    if (!arguments.length) {
      this.paren = null;
      this.listSExpr = [];
    } else {
      this.paren = paren;
      this.listSExpr = listSExpr;
    }
  }
}

class SExprBracket {
  constructor(sexpr) {
    if (!arguments.length) {
      this.listSExpr = [];
    } else {
      this.listSExpr = sexpr;
    }
  }
}

class SExprParen {
  constructor(sexpr) {
    if (!arguments.length) {
      this.listSExpr = [];
    } else {
      this.listSExpr = sexpr;
    }
  }}

mainParser();
