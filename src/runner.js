const fs = require("fs");
const SExpressionParser = require("./s-expr-parser").SExpressionParser;
const PythonModuleParser = require("./python-module-parser").PythonModuleParser;
const RudimentaryInterpreter = require("./rudimentary-interpreter").RudimentaryInterpreter
const TestRunner = require("./tests/testRunner.js").TestRunner;

function main() {
  if (process.env.DEBUG_PARSER && process.env.DEBUG_PARSER === "true") {
    TestRunner();
    return;
  }

  try {
    const stringInput = fs.readFileSync(0).toString();

    const parsedSExressionList = SExpressionParser(stringInput, 0, []);
    const ast = PythonModuleParser(parsedSExressionList);
    const answer = RudimentaryInterpreter(ast)

    console.log(answer);
  } catch (e) {
    console.error("Error interpreting program: " + e);
  }
}

main();
