const { SExprParse, SExprParen, SExprBracket, Atom } = require("./types");

module.exports.SExpressionParser = (stringToParse) => {
  let expression = parse([new SExprParse("d", [])], stringToParse);
  return expression[0].listSExpr[0];
};

function parse(parenStack, str) {
  // Check for open paren
  const newParenStack = checkOpenParens(str[0])
    ? parse([...parenStack, new SExprParse(str[0], [])], str.slice(1).trim())
    : parenStack;

  // Take off as many atoms as you want
  atomRes = getAllAtoms(str, 0, []);
  let newStr = atomRes[0];

  let nextParenStack = [];
  if (newStr[0] === "]" && newParenStack.at(-1).paren === "[") {
    let tmpSExpr = new SExprBracket([
      ...newParenStack.at(-1).listSExpr,
      ...atomRes[1],
    ]);
    let tmpSExpr2 = new SExprParse(newParenStack.at(-2).paren, [
      ...newParenStack.at(-2).listSExpr,
      tmpSExpr,
    ]);
    let tmpStack2 = newParenStack.filter(
      (elm, ind) =>
        ind !== newParenStack.length - 2 && ind !== newParenStack.length - 1
    );
    nextParenStack = [...tmpStack2, tmpSExpr2];
    newStr = newStr.trim().slice(1).trim();
  } else if (newStr[0] === ")" && newParenStack.at(-1).paren === "(") {
    let tmpSExpr = new SExprParen([
      ...newParenStack.at(-1).listSExpr,
      ...atomRes[1],
    ]);
    let tmpSExpr2 = new SExprParse(newParenStack.at(-2).paren, [
      ...newParenStack.at(-2).listSExpr,
      tmpSExpr,
    ]);
    let tmpStack2 = newParenStack.filter(
      (elm, ind) =>
        ind !== newParenStack.length - 2 && ind !== newParenStack.length - 1
    );
    nextParenStack = [...tmpStack2, tmpSExpr2];
    newStr = newStr.trim().slice(1).trim();
  } else {
    let tmpSExpr = new SExprParse(newParenStack.at(-1).paren, [
      ...newParenStack.at(-1).listSExpr,
      ...atomRes[1],
    ]);
    let tmpStack2 = newParenStack.filter(
      (elm, ind) => ind !== newParenStack.length - 1
    );
    nextParenStack = [...tmpStack2, tmpSExpr];
  }

  if (nextParenStack.length <= 1) {
    return nextParenStack;
  }

  return parse(nextParenStack, newStr.trim());
}

function getAllAtoms(str, index, listAtoms) {
  if (checkCloseParens(str[index]) || checkOpenParens(str[index])) {
    return [str, [...listAtoms]];
  }

  atom = AtomParser(str.trim(), 0);
  if (atom === null) {
    return [str, [...listAtoms]];
  }
  newlistAtoms = [...listAtoms, new Atom(...atom)];
  let sliceIndex = index + atom[1].length;
  return getAllAtoms(str.slice(sliceIndex).trim(), 0, newlistAtoms);
}

function AtomParser(inputString, index) {
  if (!isNaN(inputString[index])) {
    return ["number", parseFullNumber(inputString, index)];
  } else if (inputString[index] === '"') {
    return ["string", parseFullString(inputString, index)];
  } else if (inputString[index] === "#" && inputString[index + 1] === "f") {
    return ["boolean", "#f"];
  } else if (
    !checkCloseParens(inputString[index]) &&
    !checkOpenParens(inputString[index])
  ) {
    return ["symbol", parseFullSymbol(inputString, index)];
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
