const fs = require("fs");
const SExpressionParser = require("./s-expr-parser").SExpressionParser
const PythonModuleParser = require("./python-module-parser").PythonModuleParser

function main() {
  const stringInput = fs.readFileSync(0).toString();
  // const stringInput =
  //   "(Module [body ((Expr [value (BinOp [left (Constant [value 5] [kind #f])] [op (Add)] [right (Constant [value 4] [kind #f])])]))] [type_ignores ()])";

  let parsedSExressionList = SExpressionParser(stringInput, 0, []);
  let ast = PythonModuleParser(parsedSExressionList)
  console.log("\n"+JSON.stringify(ast, null, 1))
}

main()