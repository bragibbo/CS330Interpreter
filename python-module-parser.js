const {
  UnaryOp,
  Operator,
  BinOp,
  ExprStamt,
  Module,
  SExprParen,
} = require("./types");

module.exports.PythonModuleParser = (sExpressions) => {
  return parseMod(sExpressions)
};

function parseMod(listOfSExpr) {
  return new Module(parseExprStmt(parseExprStmt()));
}

function parseExprStmt(listOfSExpr) {
  return new ExprStamt();
}

function expr(listOfSExpr) {
  switch (listOfSExpr[0]) {
    case "BinOp":
      return new BinOp(
        expr(listOfSExpr[1].listOfSExpr),
        operator(listOfSExpr[2].list)
      );

    case "UnaryOp":

    case "Constant":
  }
}

function parseOperator(type) {
  switch (type[0]) {
    case "Add":
      return new Operator(type);
    case "Sub":
      return new Operator(type);
    case "Mult":
      return new Operator(type);
  }
}

function parseUnaryOp(type) {
  switch (type) {
    case "UAdd":
      return new UnaryOp(type);
    case "USub":
      return new UnaryOp(type);
  }
}
