const { PythonModuleParser } = require("../python-module-parser");
const { RudimentaryInterpreter } = require("../rudimentary-interpreter");
const { SExpressionParser } = require("../s-expr-parser");

module.exports.DesugarTests = () => {
  for (let i = 0; i < tests.length; i++) {
    testDesugar(tests[i].input, tests[i].expected, i);
  }
};

function testDesugar(input, expected, numTest) {
  const testName = `Desugar Parser ${numTest}`;
  console.log(`\nStart Test : ${testName}`);

  const parsed = SExpressionParser(input);
  const ast = PythonModuleParser(parsed);
  const answer = RudimentaryInterpreter(ast);

  console.log(`Returned: ${answer}`);
  console.log(`Expected: ${expected}`);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : " + testName);
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : " + testName);
  }
  console.log(`End Test : ${testName}\n`);
}

const tests = [
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])",
    expected: "(value 9)",
  },
  {
    input:
      "(Module [body ((Expr [value (Constant [value 5] [kind #f])]))] [type_ignores ()])",
    expected: "(value 5)",
  },
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (BinOp [left (Constant [value 5] [kind #f])] [op (Mult)] [right (Constant [value 8] [kind #f])])])]))] [type_ignores ()])",
    expected: "(value 43)",
  },
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 2] [kind #f])])] [op (Mult)] [right (Constant [value 2] [kind #f])])]))] [type_ignores ()])",
    expected: "(value 14)",
  },
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (BinOp [left (Constant [value 4] [kind #f])] [op (Mult)] [right (Constant [value 2] [kind #f])])] [op (Sub)] [right (BinOp [left (Constant [value 1] [kind #f])] [op (Mult)] [right (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])])])]))] [type_ignores ()])",
    expected: "(value 1)",
  },
  {
    input:
      "(Module [body ((Expr [value (UnaryOp [op (USub)] [operand (Constant [value 1] [kind #f])])]))] [type_ignores ()])",
    expected: "(value -1)",
  },
];