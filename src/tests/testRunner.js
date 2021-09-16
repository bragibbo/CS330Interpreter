const ParserTests = require("./parserTests").RunParserTests;
const RunRudInterpTests = require("./rudInterpTests").RunRudInterpTests;

module.exports.TestRunner = () => {
  ParserTests();
  RunRudInterpTests();
};
