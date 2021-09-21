const PythonModuleParser =
  require("../python-module-parser").PythonModuleParser;
const SExpressionParser = require("../s-expr-parser").SExpressionParser;

module.exports.RunParserTests = () => {
  testEntireModule1();
  testEntireModule2();
  testEntireModule3();
  testEntireModule4();
  testEntireModule5();
};

function testEntireModule1() {
  console.log("\nStart Test : testEntireModule1");
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";
  const expected =
    '{"module":{"exprStmt":{"expr":{"left":{"value":"5","kind":"#f"},"op":{"type":"Add"},"right":{"value":"4","kind":"#f"}}}}}';

  const parsed = SExpressionParser(stringInput);
  const ast = JSON.stringify(PythonModuleParser(parsed));

  console.log("Returned: " + ast);
  console.log("Expected: " + expected);
  if (expected === ast) {
    console.log("Test Passed : testEntireModule1");
  } else {
    throw new Error("Test Failed : testEntireModule1");
  }
  console.log("End Test : testEntireModule1\n");
}

function testEntireModule2() {
  console.log("\nStart Test : testEntireModule2");
  const stringInput =
    "(Module [body ((Expr [value (Constant [value 5] [kind #f])]))] [type_ignores ()])";
  const expected = '{"module":{"exprStmt":{"expr":{"value":"5","kind":"#f"}}}}';

  const parsed = SExpressionParser(stringInput);
  const ast = JSON.stringify(PythonModuleParser(parsed));

  console.log("Returned: " + ast);
  console.log("Expected: " + expected);
  if (expected === ast) {
    console.log("Test Passed : testEntireModule2");
  } else {
    throw new Error("Test Failed : testEntireModule2");
  }
  console.log("End Test : testEntireModule2\n");
}

function testEntireModule3() {
  console.log("\nStart Test : testEntireModule3");
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 3] [kind #f])] [op (Add)] [right (BinOp [left (Constant [value 5] [kind #f])] [op (Mult)] [right (Constant [value 8] [kind #f])])])]))] [type_ignores ()])";
  const expected =
    '{"module":{"exprStmt":{"expr":{"left":{"value":"3","kind":"#f"},"op":{"type":"Add"},"right":{"left":{"value":"5","kind":"#f"},"op":{"type":"Mult"},"right":{"value":"8","kind":"#f"}}}}}}';

  const parsed = SExpressionParser(stringInput);
  const ast = JSON.stringify(PythonModuleParser(parsed));

  console.log("Returned: " + ast);
  console.log("Expected: " + expected);
  if (expected === ast) {
    console.log("Test Passed : testEntireModule3");
  } else {
    throw new Error("Test Failed : testEntireModule3");
  }
  console.log("End Test : testEntireModule3\n");
}

function testEntireModule4() {
  console.log("\nStart Test : testEntireModule4");
  const stringInput =
    "(Module [body ((Expr [value (UnaryOp [op (USub)] [operand (Constant [value 1] [kind #f])])]))] [type_ignores ()])";
  const expected =
    '{"module":{"exprStmt":{"expr":{"op":{"type":"USub"},"operand":{"value":"1","kind":"#f"}}}}}';

  const parsed = SExpressionParser(stringInput);
  const ast = JSON.stringify(PythonModuleParser(parsed));

  console.log("Returned: " + ast);
  console.log("Expected: " + expected);
  if (expected === ast) {
    console.log("Test Passed : testEntireModule4");
  } else {
    console.log("Test Failed : testEntireModule4");
  }
  console.log("End Test : testEntireModule4\n");
}

function testEntireModule5() {
  console.log("\nStart Test : testEntireModule5");
  const stringInput =
    '(Module [body ((Expr [value (Constant [value "Hello"] [kind #f])]))] [type_ignores ()])';
  const expected =
    '{"module":{"exprStmt":{"expr":{"value":"Hello","kind":"#f"}}}}';

  const parsed = SExpressionParser(stringInput);
  const ast = JSON.stringify(PythonModuleParser(parsed));

  console.log("Returned: " + ast);
  console.log("Expected: " + expected);
  if (expected === ast) {
    console.log("Test Passed : testEntireModule5");
  } else {
    console.log("Test Failed : testEntireModule5");
  }
  console.log("End Test : testEntireModule5\n");
}
