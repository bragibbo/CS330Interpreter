const fs = require("fs");
const { Desugar } = require("./desugar");
const { PythonModuleParser } = require("./python-module-parser");
const { RudimentaryInterpreter } = require("./rudimentary-interpreter");
const { SExpressionParser } = require("./s-expr-parser");
const { Substitute } = require("./substitute");
const { TestRunner } = require("./tests/testRunner");

function main() {
  if (process.env.DEBUG_PARSER && process.env.DEBUG_PARSER === "true") {
    TestRunner();
    return;
  }

  try {
    const stringInput = fs.readFileSync(0).toString();

    const parsedSExressionList = SExpressionParser(stringInput, 0, []);
    const surfaceAST = PythonModuleParser(parsedSExressionList);
    const coreAST = Desugar(surfaceAST);
    const substitutedAST = Substitute(coreAST);
    const answer = RudimentaryInterpreter(substitutedAST);

    console.log("\n" + answer);
  } catch (e) {
    console.error(e.message);
  }
}

main();
