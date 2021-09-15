const fs = require("fs");

function mainParser() {
  // const stringInput = fs.readFileSync(0).toString();
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";
  console.log("Input string: " + stringInput);

  let res = SExpressionParser3(stringInput, 0, []);
  console.log("\nResult");
  console.log(res[2]);
  console.log(JSON.stringify(res[3], null, 2));
}

function SExpressionParser3(inputString, index, parenStack) {
  let start = new SExp();

  // Return if the index is larger than the input string
  if (index >= inputString.length)
    return [index, inputString, [...parenStack], start];

  atomRes = getAllAtoms(inputString, index, []);
  if (atomRes[1].length !== 0) {
    console.log("Atoms: " + atomRes[1]);
    index = atomRes[0];
    start.symbol = [...start.symbol, ...atomRes[1]];
    console.log(start.symbol)
  }
  
  // Add the paren or bracket to the stack if is the current char
  if (checkOpenParens(inputString[index])) {
    console.log("Push onto stack : " + inputString[index]);
    parenStack = [...parenStack, inputString[index]];
    console.log(parenStack);
  }

  // console.log(inputString[index])
  // Pop bracket or paren off stack if matches current char type
  if (checkCloseParens(inputString[index])) {
    if (
      (inputString[index] === "]" &&
        parenStack[parenStack.length - 1] === "[") ||
      (inputString[index] === ")" && parenStack[parenStack.length - 1] === "(")
    ) {
      console.log(
        "Current brace : " +
          inputString[index] +
          " pop off " +
          parenStack[parenStack.length - 1]
      );
      parenStack = parenStack.filter((el, ind) => ind < parenStack.length - 1);
      console.log(parenStack);
      return [index, inputString, [...parenStack]];
    }
  }

  // Get all corresponding SubExpressions
  let res = getAllSubExpressions(inputString, index + 1, parenStack);
  index = res[0];
  inputString = res[1];
  parenStack = res[2];

  return [index, inputString, [...parenStack]];
}

function getAllSubExpressions(inputString, index, parenStack) {
  if (parenStack.length === 0) {
    return [index, inputString, [...parenStack]]
  }

  let res = SExpressionParser3(inputString, index, parenStack);
  index = res[0];
  inputString = res[1];

  return getAllSubExpressions(inputString, index + 1, [...res[2]]);
}

// function SExpressionParser(inputString, index, parenStack) {
//   if (index >= inputString.length) return [index, [...parenStack]];

//   console.log("\n NEW ENTRY");
//   let start = new SExp();
//   parens = nextCharNotParen(inputString, index, []);
//   parenStack = [...parenStack, ...parens];
//   start.paren = [...start.paren, ...parens];
//   inputString = inputString.slice(start.paren.length);
//   inputString = inputString.slice(nextCharNotWhiteSpace(inputString, 0));
//   index = 0;
//   console.log("\nAfter slice and char: " + inputString);

//   atomRes = getAllAtoms(inputString, index, []);
//   console.log("Atoms: " + atomRes[1]);
//   index += atomRes[0];
//   start.symbol = [...start.symbol, ...atomRes[1]];

//   index = nextCharNotWhiteSpace(inputString, index);
//   inputString = inputString.slice(index);
//   index = 0;
//   console.log("index, char :" + index + " - " + inputString[index]);
//   console.log(start);

//   if (checkCloseParens(inputString[index])) {
//     // if (
//     //   (inputString[index] === "]" &&
//     //     parenStack[parenStack.length - 1] === "[") ||
//     //   (inputString[index] === ")" && parenStack[parenStack.length - 1] === "(")
//     // ) {
//     parenStack = parenStack.filter((elm, ind) => ind === parenStack.length - 1);
//     start.paren = [...start.paren, inputString[index]];
//     console.log(parenStack);
//     index = index + 1;
//     // } else {
//     //   let res = SExpressionParser(inputString, index, [...parenStack]);
//     //   index = res[0];
//     //   parenStack = res[1];
//     //   start.rest = [...start.rest, res[2]];
//     // }
//   }

//   index = nextCharNotWhiteSpace(inputString, index);
//   inputString = inputString.slice(index);
//   index = 0;
//   if (checkOpenParens(inputString[index])) {
//     parenStack = [...parenStack, inputString[index]];
//     let res = getAllSubExpressions(inputString, index, [...parenStack], []);
//     index = res[0];
//     inputString = res[1];
//     parenStack = res[2];
//     start.rest = [...start.rest, ...res[3]];
//   }

//   return [index, inputString, [...parenStack], start];
// }

// function getAllSubExpressions(inputString, index, parenStack, listExpressions) {
//   if (
//     (inputString[index] === "]" && parenStack[parenStack.length - 1] === "[") ||
//     (inputString[index] === ")" && parenStack[parenStack.length - 1] === "(")
//   ) {
//     return [index, inputString, [...parenStack], [...listExpressions]];
//   }

//   let res = SExpressionParser3(inputString, index, parenStack);
//   listExpressions = [...listExpressions, res[3]];
//   index = res[0];
//   inputString = res[1];
//   if (res[2] === undefined) {
//     return [index, inputString, [res[2]], [...listExpressions]];
//   }

//   return getAllSubExpressions(
//     inputString,
//     index + 1,
//     [...res[2]],
//     [...listExpressions]
//   );
// }

function getAllAtoms(inputString, index, listAtoms) {
  // console.log(inputString);
  if (
    checkCloseParens(inputString[index]) ||
    checkOpenParens(inputString[index])
  ) {
    return [index, listAtoms];
  }

  index = nextCharNotWhiteSpace(inputString, index);
  // console.log("Current index" + index);
  atom = AtomParser(inputString, index);
  if (atom === null) {
    return [index, listAtoms];
  }
  index += atom.length
  // console.log(atom);
  listAtoms = [...listAtoms, atom];
  index = nextCharNotWhiteSpace(inputString, index);
  // console.log(index);
  return getAllAtoms(inputString, index, listAtoms);
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
  // console.log(inputString[index]);
  if (inputString[index] !== " " && index < inputString.length) {
    return index;
  }
  return nextCharNotWhiteSpace(inputString, index + 1);
}

function nextCharNotParen(inputString, index, stack) {
  if (!checkOpenParens(inputString[index])) {
    return stack;
  }
  return nextCharNotParen(inputString, index + 1, [
    ...stack,
    inputString[index],
  ]);
}

function checkOpenParens(character) {
  return character === "(" || character === "[";
}

function checkCloseParens(character) {
  return character === ")" || character === "]";
}

class SExp {
  constructor() {
    this.paren = [];
    this.symbol = [];
    this.rest = [];
  }
}

mainParser();
