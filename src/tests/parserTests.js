const { PythonModuleParser } = require("../python-module-parser");
const { SExpressionParser } = require("../s-expr-parser");

module.exports.ParserTests = () => {
  let failedTests = 0;
  for (let i = 0; i < tests.length; i++) {
    result = testParser(tests[i].input, tests[i].expected, i);
    if (!result) {
      failedTests++;
    }
  }
  return failedTests;
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
    return false;
  }
  console.log(`End Test : ${testName}\n`);
  return true;
}

const tests = [
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])",
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"left":{"value":"5","kind":"#f"},"op":{"type":"Add"},"right":{"value":"4","kind":"#f"}}},"fundef":[]}}}',
  },
  {
    input:
      "(Module [body ((Expr [value (Constant [value 5] [kind #f])]))] [type_ignores ()])",
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"value":"5","kind":"#f"}},"fundef":[]}}}',
  },
  {
    input:
      "(Module [body ((Expr [value (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (BinOp [left (Constant [value 5] [kind #f])] [op (Mult)] [right (Constant [value 8] [kind #f])])])]))] [type_ignores ()])",
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"left":{"value":"3","kind":"#f"},"op":{"type":"Add"},"right":{"left":{"value":"5","kind":"#f"},"op":{"type":"Mult"},"right":{"value":"8","kind":"#f"}}}},"fundef":[]}}}',
  },
  {
    input:
      "(Module [body ((Expr [value (UnaryOp [op (USub)] [operand (Constant [value 1] [kind #f])])]))] [type_ignores ()])",
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"op":{"type":"USub"},"operand":{"value":"1","kind":"#f"}}},"fundef":[]}}}',
  },
  {
    input:
      '(Module [body ((Expr [value (Constant [value "Hello"] [kind #f])]))] [type_ignores ()])',
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"value":"Hello","kind":"#f"}},"fundef":[]}}}',
  },
  {
    input:
      '(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value "hello"] [kind #f])])]))] [type_ignores ()])',
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"left":{"value":"5","kind":"#f"},"op":{"type":"Add"},"right":{"value":"hello","kind":"#f"}}},"fundef":[]}}}',
  },
  {
    input:
      '(Module [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected:
      '{"module":{"body":{"exprStmt":{"expr":{"nameExpr":{"name":"test"},"args":[{"value":"5","kind":"#f"}]}},"fundef":[{"name":"test","arguments":{"args":[{"identifier":"x"}]},"returnStmt":{"expr":{"name":"x"}}}]}}}',
  },
];
