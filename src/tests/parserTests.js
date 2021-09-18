const { PythonModuleParser } = require("../python-module-parser");
const { SExpressionParser } = require("../s-expr-parser");

module.exports.ParserTests = () => {
  for (let i = 0; i < tests.length; i++) {
    testParser(tests[i].input, tests[i].expected, i);
  }
};

function testParser(input, expected, numTest) {
  const testName = `Parser ${numTest}`;
  console.log(`\nStart Test : ${testName}`);

  const parsed = SExpressionParser(input);
  const answer = JSON.stringify(PythonModuleParser(parsed));

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
    expected:
      '{"module":{"exprStmt":{"expr":{"left":{"value":"5","kind":"#f"},"op":{"type":"Add"},"right":{"value":"4","kind":"#f"}}}}}',
  },
  {
    input:
      "(Module [body ((Expr [value (Constant [value 5] [kind #f])]))] [type_ignores ()])",
    expected: '{"module":{"exprStmt":{"expr":{"value":"5","kind":"#f"}}}}',
  },
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (BinOp [left (Constant [value 5] [kind #f])] [op (Mult)] [right (Constant [value 8] [kind #f])])])]))] [type_ignores ()])",
    expected:
      '{"module":{"exprStmt":{"expr":{"left":{"value":"3","kind":"#f"},"op":{"type":"Add"},"right":{"left":{"value":"5","kind":"#f"},"op":{"type":"Mult"},"right":{"value":"8","kind":"#f"}}}}}}',
  },
  {
    input:
      "(Module [body ((Expr [value (UnaryOp [op (USub)] [operand (Constant [value 1] [kind #f])])]))] [type_ignores ()])",
    expected:
      '{"module":{"exprStmt":{"expr":{"op":{"type":"USub"},"operand":{"value":"1","kind":"#f"}}}}}',
  },
];
