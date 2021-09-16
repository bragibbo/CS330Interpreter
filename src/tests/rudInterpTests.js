const SExpressionParser = require("../s-expr-parser").SExpressionParser;
const PythonModuleParser =
  require("../python-module-parser").PythonModuleParser;
const RudimentaryInterpreter =
  require("../rudimentary-interpreter").RudimentaryInterpreter;

module.exports.RunRudInterpTests = () => {
  testRud1();
  testRud2();
  testRud3();
  testRud4();
  testRud5();
  testRud6();
};

function testRud1() {
  console.log("\nStart Test : testRud1");
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";
  const expected = "(value 9)";

  const parsed = SExpressionParser(stringInput);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log("Returned: " + answer);
  console.log("Expected: " + expected);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : testRud1");
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : testRud1");
  }
  console.log("End Test : testRud1\n");
}

function testRud2() {
  console.log("\nStart Test : testRud2");
  const stringInput =
    "(Module [body ((Expr [value (Constant [value 5] [kind #f])]))] [type_ignores ()])";
  const expected = "(value 5)";

  const parsed = SExpressionParser(stringInput);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log("Returned: " + answer);
  console.log("Expected: " + expected);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : testRud2");
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : testRud2");
  }
  console.log("End Test : testRud2\n");
}

function testRud3() {
  console.log("\nStart Test : testRud3");
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (BinOp [left (Constant [value 5] [kind #f])] [op (Mult)] [right (Constant [value 8] [kind #f])])])]))] [type_ignores ()])";
  const expected = "(value 43)";

  const parsed = SExpressionParser(stringInput);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log("Returned: " + answer);
  console.log("Expected: " + expected);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : testRud3");
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : testRud3");
  }
  console.log("End Test : testRud3\n");
}

function testRud4() {
  console.log("\nStart Test : testRud4");
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 2] [kind #f])])] [op (Mult)] [right (Constant [value 2] [kind #f])])]))] [type_ignores ()])";
  const expected = "(value 14)";

  const parsed = SExpressionParser(stringInput);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log("Returned: " + answer);
  console.log("Expected: " + expected);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : testRud4");
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : testRud4");
  }
  console.log("End Test : testRud4\n");
}

function testRud5() {
  console.log("\nStart Test : testRud5");
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (BinOp [left (Constant [value 4] [kind #f])] [op (Mult)] [right (Constant [value 2] [kind #f])])] [op (Sub)] [right (BinOp [left (Constant [value 1] [kind #f])] [op (Mult)] [right (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])])])]))] [type_ignores ()])";
  const expected = "(value 1)";

  const parsed = SExpressionParser(stringInput);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log("Returned: " + answer);
  console.log("Expected: " + expected);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : testRud5");
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : testRud5");
  }
  console.log("End Test : testRud5\n");
}

function testRud6() {
  console.log("\nStart Test : testRud6");
  const stringInput =
    "(Module [body ((Expr [value (UnaryOp [op (USub)] [operand (Constant [value 1] [kind #f])])]))] [type_ignores ()])";
  const expected = "(value -1)";

  const parsed = SExpressionParser(stringInput);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log("Returned: " + answer);
  console.log("Expected: " + expected);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : testRud6");
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : testRud6");
  }
  console.log("End Test : testRud6\n");
}
