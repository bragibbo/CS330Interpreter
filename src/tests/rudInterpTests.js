const { Desugar } = require("../desugar");
const { PythonModuleParser } = require("../python-module-parser");
const { RudimentaryInterpreter } = require("../rudimentary-interpreter");
const { SExpressionParser } = require("../s-expr-parser");

module.exports.RudimentaryInterpreterTests = () => {
  let failedTests = 0;
  for (let i = 0; i < tests.length; i++) {
    result = testRudInterp(tests[i].input, tests[i].expected, i);
    if (!result) {
      failedTests++;
    }
  }
  return failedTests;
};

function testRudInterp(input, expected, numTest) {
  const testName = `Rudimentary Interpreter ${numTest}`;
  console.log(`\nStart Test : ${testName}`);

  const parsed = SExpressionParser(input);
  const surfaceAST = PythonModuleParser(parsed);
  const coreAST = Desugar(surfaceAST);
  const answer = RudimentaryInterpreter(coreAST);

  console.log(`Returned: ${answer}`);
  console.log(`Expected: ${expected}`);
  if (expected === answer) {
    console.log("\u{01b}[32mTest Passed\033[m : " + testName);
  } else {
    console.log("\u{01b}[31mTest Failed\033[m : " + testName);
    return false;
  }
  console.log(`End Test : ${testName}\n`);
  return true;
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
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 6] [kind #f])] [op (Sub)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])",
    expected: "(value 2)",
  },
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Sub)] [right (UnaryOp [op (USub)] [operand (Constant [value 3] [kind #f])])])]))] [type_ignores ()])",
    expected: "(value 8)",
  },
  {
    input:
      '(Module [body ((Expr [value (Constant [value "Hello"] [kind #f])]))] [type_ignores ()])',
    expected:
      '(value Hello)',
  },
  {
    input:
      '(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value "hello"] [kind #f])])]))] [type_ignores ()])',
    expected:
      '(value 5hello)',
  },
];
