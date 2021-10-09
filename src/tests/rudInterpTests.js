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

  let answer;
  try {
    const parsed = SExpressionParser(input);
    const surfaceAST = PythonModuleParser(parsed);
    const coreAST = Desugar(surfaceAST);
    answer = RudimentaryInterpreter(coreAST);
  } catch (e) {
    answer = e.message;
  }

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
    expected: "(value Hello)",
  },
  {
    input:
      '(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value "hello"] [kind #f])])]))] [type_ignores ()])',
    expected: "(value 5hello)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 5)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ((arg [arg "input"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "input"] [ctx (Load)])] [op (Add)] [right (Constant [value 5] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 4] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 9)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "echo"] [args (arguments [posonlyargs ()] [args ((arg [arg "t"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "t"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "other"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Call [func (Name [id "echo"] [ctx (Load)])] [args ((Name [id "x"] [ctx (Load)]))] [keywords ()])] [op (Add)] [right (Constant [value 1] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "other"] [ctx (Load)])] [args ((Constant [value 4] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 5)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "echo"] [args (arguments [posonlyargs ()] [args ((arg [arg "t"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "t"] [ctx (Load)])] [op (Add)] [right (Constant [value 1] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "other"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Call [func (Name [id "echo"] [ctx (Load)])] [args ((Name [id "x"] [ctx (Load)]))] [keywords ()])] [op (Add)] [right (Constant [value 1] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "nexts"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Call [func (Name [id "other"] [ctx (Load)])] [args ((Name [id "y"] [ctx (Load)]))] [keywords ()])] [op (Add)] [right (Constant [value 1] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "nexts"] [ctx (Load)])] [args ((Constant [value 1] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 4)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]) (arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 4] [kind #f]) (Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 9)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "echo"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]) (arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Sub)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Call [func (Name [id "echo"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]) (Name [id "x"] [ctx (Load)]))] [keywords ()])] [op (Add)] [right (Constant [value 3] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 6] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 2)",
  },
  {
    input:
      '(Module [body ((FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Name [id "y"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 10] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound variable")',
  },
  {
    input:
      '(Module [body ((FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Name [id "y"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 10] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound variable")',
  },
  {
    input:
      '(Module [body ((Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 3] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unknown function")',
  },
  {
    input:
      '(Module [body ((FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]) (arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 20] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "arity mismatch")',
  },
  {
    input:
      '(Module [body ((FunctionDef [name "m"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]) (arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "m"] [ctx (Load)])] [args ((Constant [value 19] [kind #f]) (Constant [value 3] [kind #f]) (Constant [value 4] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "arity mismatch")',
  },
  // {
  //   input:
  //     '(Module [body ((FunctionDef [name "r"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((FunctionDef [name "t"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "r"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
  //   expected: "(value 5)",
  // },
  // {
  //   input:
  //     '(Module [body ((FunctionDef [name "r"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Return [value (Call [func (Name [id "test"] [ctx (Load)])] [args ()] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "r"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
  //   expected: "(value 5)",
  // },
];
