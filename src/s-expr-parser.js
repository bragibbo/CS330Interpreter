const { SExprParse, SExprParen, SExprBracket, Atom } = require("./types");

module.exports.SExpressionParser = (stringToParse) => {
  let expression = parse([new SExprParse("d", [])], stringToParse);
  return expression[0].listSExpr[0];
};

function parse(parenStack, str) {
  if (str.length === 0) {
    return parenStack;
  }

  // Check for open paren
  const newParenStack = checkOpenParens(str[0])
    ? parse([...parenStack, new SExprParse(str[0], [])], str.slice(1).trim())
    : parenStack;

  // Take off as many atoms as you want
  // atomRes[0] === inputString, atomRes[1] === atom list
  const atomRes = getAllAtoms(str, 0, []);

  // res[0] === parenStack, res[1] === inputString
  const res = wrapSExpression(newParenStack, atomRes[0], atomRes[1]);

  if (res[0].length <= 1) {
    return res[0];
  }

  return parse(res[0], res[1].trim());
}

function wrapSExpression(parenStack, str, atoms) {
  if (
    (str[0] === "]" && parenStack.at(-1).paren === "[") ||
    (str[0] === ")" && parenStack.at(-1).paren === "(")
  ) {
    let tmpSExpr = getSExprByType(str[0], [
      ...parenStack.at(-1).listSExpr,
      ...atoms,
    ]);
    let tmpSExpr2 = new SExprParse(parenStack.at(-2).paren, [
      ...parenStack.at(-2).listSExpr,
      tmpSExpr,
    ]);
    let tmpStack2 = parenStack.filter(
      (elm, ind) =>
        ind !== parenStack.length - 2 && ind !== parenStack.length - 1
    );

    return [[...tmpStack2, tmpSExpr2], str.trim().slice(1).trim()];
  } else {
    let tmpSExpr = new SExprParse(parenStack.at(-1).paren, [
      ...parenStack.at(-1).listSExpr,
      ...atoms,
    ]);
    let tmpStack2 = parenStack.filter(
      (elm, ind) => ind !== parenStack.length - 1
    );
    return [[...tmpStack2, tmpSExpr], str];
  }
}

function getSExprByType(type, listExpr) {
  if (type === "]") {
    return new SExprBracket([...listExpr]);
  } else {
    return new SExprParen([...listExpr]);
  }
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
  
  let sliceIndex = atom[0] === "string" ? index + 2 + atom[1].length  : index + atom[1].length;
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
  if (inputString[index] === '"') {
    return parseFullString(inputString, index + 1)
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
