const fs = require("fs");
const SExpressionParser = require("./s-expr-parser").SExpressionParser
const PythonModuleParser = require("./python-module-parser").PythonModuleParser

function main() {
  // const stringInput = fs.readFileSync(0).toString();
  const stringInput =
    "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";

  let parsedString = SExpressionParser(stringInput, 0, []);
  console.log("S-Expression Parsed\n" +JSON.stringify(parsedString, null, 2));
  let ast = PythonModuleParser(parsedString)
  console.log("Python Module Parsed\n" + JSON.stringify(ast, null, 1))
}

main()