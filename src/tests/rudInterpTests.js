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
    expected: '(error dynamic "not a number")',
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
    /*
      def g(y):
        return f(y)
      def f(x):
        return x + y
      g(10)
    */
    input:
      '(Module [body ((FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Name [id "y"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 10] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound identifier")',
  },
  {
    /*
      def f(x):
        return x + y
      def g(y):
        return f(y)
      g(10)
    */
    input:
      '(Module [body ((FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Name [id "y"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 10] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound variable")',
  },
  {
    /*
      def f(x):
        return x + y
      def t(r):
        return r
      def g(y):
        return f(y)
      g(10)
    */
    input:
      '(Module [body ((FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "t"] [args (arguments [posonlyargs ()] [args ((arg [arg "r"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "r"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Name [id "y"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 10] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound variable")',
  },
  {
    input:
      '(Module [body ((Expr [value (Call [func (Name [id "test"] [ctx (Load)])] [args ((Constant [value 3] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound identifier")',
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
  {
    /*
      def outer(x):
        def one():
          return x
        def two():
          return one()
        return one() + two()
      outer(5)
    */
    input:
      '(Module [body ((FunctionDef [name "outer"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((FunctionDef [name "one"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "two"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "one"] [ctx (Load)])] [args ()] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Return [value (BinOp [left (Call [func (Name [id "one"] [ctx (Load)])] [args ()] [keywords ()])] [op (Add)] [right (Call [func (Name [id "two"] [ctx (Load)])] [args ()] [keywords ()])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "outer"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 10)",
  },
  {
    /*
      def r(x):
        def t()
          return x
        return x
      r(5)
    */
    input:
      '(Module [body ((FunctionDef [name "r"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((FunctionDef [name "t"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "r"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 5)",
  },
  {
    /*
      def r(x):
        def test():
          return x
        return test()
      r(5)
    */
    input:
      '(Module [body ((FunctionDef [name "r"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Return [value (Call [func (Name [id "test"] [ctx (Load)])] [args ()] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "r"] [ctx (Load)])] [args ((Constant [value 5] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 5)",
  },
  {
    /*
      (lambda x: x) + 2
    */
    input:
      '(Module [body ((Expr [value (BinOp [left (Lambda [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body (Name [id "x"] [ctx (Load)])])] [op (Add)] [right (Constant [value 2] [kind #f])])]))] [type_ignores ()])',
    expected: '(error dynamic "not a number")',
  },
  {
    /*
      def f(g):
        return g(42)
      f(lambda x: x)
    */
    input:
      '(Module [body ((FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "g"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 42] [kind #f]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Lambda [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body (Name [id "x"] [ctx (Load)])]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 42)",
  },
  {
    /*
      def apply(f,x):
        return f(x)

      def g(y):
        return y + 10

      apply(g,20)
    */
    input:
      '(Module [body ((FunctionDef [name "apply"] [args (arguments [posonlyargs ()] [args ((arg [arg "f"] [annotation #f] [type_comment #f]) (arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "f"] [ctx (Load)])] [args ((Name [id "x"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "y"] [ctx (Load)])] [op (Add)] [right (Constant [value 10] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "apply"] [ctx (Load)])] [args ((Name [id "g"] [ctx (Load)]) (Constant [value 20] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 30)",
  },
  {
    /*
      def g(g):
        return g(g)
      g(20)
    */
    input:
      '(Module [body ((FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "g"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Name [id "g"] [ctx (Load)]))] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 20] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "not a function")',
  },
  {
    /*
      def g(g):
        return g + 10
      g(20)
    */
    input:
      '(Module [body ((FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "g"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "g"] [ctx (Load)])] [op (Add)] [right (Constant [value 10] [kind #f])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 20] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: "(value 30)",
  },
  {
    /*
      def x():
        return (lambda x: x)
      x()
    */
    input:
      '(Module [body ((FunctionDef [name "x"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Lambda [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body (Name [id "x"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "x"] [ctx (Load)])] [args ()] [keywords ()])]))] [type_ignores ()])',
    expected: "(value function)",
  },
  {
    /*
      def f():
        return 42

      f()
    */
    input: '(Module [body ((FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Constant [value 42] [kind #f])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "f"] [ctx (Load)])] [args ()] [keywords ()])]))] [type_ignores ()])',
    expected: '(value 42)'
  },
  {
    /*
      def g(x,y):
        return x + y

      g(20,g(1,2))
    */
    input: '(Module [body ((FunctionDef [name "g"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]) (arg [arg "y"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "y"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 20] [kind #f]) (Call [func (Name [id "g"] [ctx (Load)])] [args ((Constant [value 1] [kind #f]) (Constant [value 2] [kind #f]))] [keywords ()]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(value 23)'
  },
  {
    /*
      def f(x):
        return 3 + x
      def d(x,x):
        return x + x

      d(20,2)
    */
    input: '(Module [body ((FunctionDef [name "f"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (Name [id "x"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "d"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]) (arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (BinOp [left (Name [id "x"] [ctx (Load)])] [op (Add)] [right (Name [id "x"] [ctx (Load)])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "d"] [ctx (Load)])] [args ((Constant [value 20] [kind #f]) (Constant [value 2] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error static "duplicate parameter")'
  },
  {
    /*
      38()
    */
    input: '(Module [body ((Expr [value (Call [func (Constant [value 38] [kind #f])] [args ()] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "not a function")'
  },
  {
    /*
      def myfunc(n):
        return lambda a : a * n
      myfunc(2)
    */
    input: '(Module [body ((FunctionDef [name "myfunc"] [args (arguments [posonlyargs ()] [args ((arg [arg "n"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Lambda [args (arguments [posonlyargs ()] [args ((arg [arg "a"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body (BinOp [left (Name [id "a"] [ctx (Load)])] [op (Mult)] [right (Name [id "n"] [ctx (Load)])])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "myfunc"] [ctx (Load)])] [args ((Constant [value 2] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(value function)'
  },
  {
    /*
      (lambda a : a + 3)(2)
    */
    input: '(Module [body ((Expr [value (Call [func (Lambda [args (arguments [posonlyargs ()] [args ((arg [arg "a"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body (BinOp [left (Name [id "a"] [ctx (Load)])] [op (Add)] [right (Constant [value 3] [kind #f])])])] [args ((Constant [value 2] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(value 5)'
  },
  {
    /*
      def myfunc(n):
        return lambda a : a * n
      (myfunc(2))(3)
    */
    input: '(Module [body ((FunctionDef [name "myfunc"] [args (arguments [posonlyargs ()] [args ((arg [arg "n"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Lambda [args (arguments [posonlyargs ()] [args ((arg [arg "a"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body (BinOp [left (Name [id "a"] [ctx (Load)])] [op (Mult)] [right (Name [id "n"] [ctx (Load)])])])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Call [func (Name [id "myfunc"] [ctx (Load)])] [args ((Constant [value 2] [kind #f]))] [keywords ()])] [args ((Constant [value 3] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(value 6)'
  },
  {
    /*
      def myfunc(n):
        return n
      (myfunc(2))(3)
    */
    input: '(Module [body ((FunctionDef [name "myfunc"] [args (arguments [posonlyargs ()] [args ((arg [arg "n"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Name [id "n"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Call [func (Name [id "myfunc"] [ctx (Load)])] [args ((Constant [value 2] [kind #f]))] [keywords ()])] [args ((Constant [value 3] [kind #f]))] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "not a function")'
  },
  {
    /*
      def early(x):
        def inner():
          return 1
        return x
        
      def outer():
        return inner()
        
      outer()
    */
    input: '(Module [body ((FunctionDef [name "early"] [args (arguments [posonlyargs ()] [args ((arg [arg "x"] [annotation #f] [type_comment #f]))] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((FunctionDef [name "inner"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Constant [value 1] [kind #f])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Return [value (Name [id "x"] [ctx (Load)])]))] [decorator_list ()] [returns #f] [type_comment #f]) (FunctionDef [name "outer"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Call [func (Name [id "inner"] [ctx (Load)])] [args ()] [keywords ()])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Name [id "outer"] [ctx (Load)])] [args ()] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "unbound identifier")'
  },
  {
    /*
      def test():
        return 1
        
      test()()
    */
    input: '(Module [body ((FunctionDef [name "test"] [args (arguments [posonlyargs ()] [args ()] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])] [body ((Return [value (Constant [value 1] [kind #f])]))] [decorator_list ()] [returns #f] [type_comment #f]) (Expr [value (Call [func (Call [func (Name [id "test"] [ctx (Load)])] [args ()] [keywords ()])] [args ()] [keywords ()])]))] [type_ignores ()])',
    expected: '(error dynamic "not a function")'
  }
];
