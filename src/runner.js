const fs = require("fs");
const SExpressionParser = require("./s-expr-parser").SExpressionParser;
const PythonModuleParser = require("./python-module-parser").PythonModuleParser;
const TestRunner = require("./tests/testRunner.js").TestRunner;

function main() {
  if (process.env.DEBUG_PARSER && process.env.DEBUG_PARSER === "true") {
    TestRunner();
    return;
  }

  try {
    const stringInput = fs.readFileSync(0).toString();

    let parsedSExressionList = SExpressionParser(stringInput, 0, []);
    let ast = PythonModuleParser(parsedSExressionList);
    
    console.log("\n" + JSON.stringify(ast, null, 1));
  } catch (e) {
    console.error("Error interpreting program: " + e);
  }
}

main();
