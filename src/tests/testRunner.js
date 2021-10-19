const { ParserTests } = require("./parserTests");
const { RudimentaryInterpreterTests } = require("./rudInterpTests");
const { DesugarTests } = require("./desugarTests");

module.exports.TestRunner = () => {
  let numFailedTests = 0;
  numFailedTests += ParserTests();
  numFailedTests += DesugarTests();
  numFailedTests += RudimentaryInterpreterTests();

  if (numFailedTests > 0) {
    console.log("\n\u{01b}[31mTests Failed\033[m : " + numFailedTests);
  } else {
    console.log("\n\u{01b}[32mAll Tests Passed!\033[m");
  }
};
