const { ParserTests } = require("./parserTests");
const { RudimentaryInterpreterTests } = require("./rudInterpTests");
const { DesugarTests } = require("./desugarTests");

module.exports.TestRunner = () => {
  ParserTests();
  RudimentaryInterpreterTests();
};
