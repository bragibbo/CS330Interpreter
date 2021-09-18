const {
  UnaryOp,
  Operator,
  BinOp,
  ExprStamt,
  Module,
  Constant,
  UnaryOperator,
  SurfaceAST,
} = require("./types");

// Grammer:
// mod	 	    ::=	 	(Module [body (expr_stmt)] [type_ignores ()])
//
// expr_stmt 	::=	 	(Expr [value expr])
//
// expr	      ::= 	(BinOp [left expr] [op operator] [right expr])
//              |	 	(UnaryOp [op unaryop] [operand expr])
//              |	 	(Constant [value int] [kind #f])
//
// operator	 	::=	 	(Add)
//              |	 	(Sub)
//              |	 	(Mult)
//
// unaryop	 	::=	 	(UAdd)
//              |	 	(USub)
module.exports.PythonModuleParser = (sExpressions) => {
  if (!sExpressions) {
    throw Error("Unable to parse S Expression list - value: " + sExpressions);
  }

  return new SurfaceAST(parseMod(sExpressions));
};

// Grammer:
// mod  ::=  (Module [body (expr_stmt)] [type_ignores ()])
function parseMod(sExpr) {
  if (
    sExpr.constructor.name === "SExprParen" &&
    sExpr.listSExpr.length === 3 &&
    sExpr.listSExpr[0].value === "Module"
  ) {
    let body = sExpr.listSExpr[1];
    if (
      body.constructor.name === "SExprBracket" &&
      body.listSExpr.length === 2 &&
      body.listSExpr[0].value === "body" &&
      body.listSExpr[1].constructor.name === "SExprParen" &&
      body.listSExpr[1].listSExpr.length === 1
    ) {
      return new Module(parseExprStmt(body.listSExpr[1].listSExpr[0]));
    }
  }
  throw new Error("Unable to Parse Module: " + sExpr);
}

// Grammer:
// expr_stmt  ::=  (Expr [value expr])
function parseExprStmt(sExpr) {
  if (
    sExpr.constructor.name === "SExprParen" &&
    sExpr.listSExpr.length === 2 &&
    sExpr.listSExpr[0].value === "Expr"
  ) {
    let expr = sExpr.listSExpr[1];
    if (
      expr.constructor.name === "SExprBracket" &&
      expr.listSExpr.length === 2 &&
      expr.listSExpr[0].value === "value"
    ) {
      return new ExprStamt(parseExpr(expr.listSExpr[1]));
    }
  }
  throw new Error("Unable to Parse ExprStmt: " + sExpr);
}

// Grammer:
// expr	  ::=	 	(BinOp [left expr] [op operator] [right expr])
//          |	 	(UnaryOp [op unaryop] [operand expr])
//          |	 	(Constant [value int] [kind #f])
function parseExpr(sExpr) {
  if (sExpr.constructor.name === "SExprParen" && sExpr.listSExpr.length > 0) {
    switch (sExpr.listSExpr[0].value) {
      case "BinOp":
        if (
          sExpr.listSExpr.length === 4 &&
          sExpr.listSExpr[1].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[2].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[3].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[1].listSExpr.length === 2 &&
          sExpr.listSExpr[1].listSExpr[0].value === "left" &&
          sExpr.listSExpr[2].listSExpr.length === 2 &&
          sExpr.listSExpr[1].listSExpr[0].constructor.name === "Atom" &&
          sExpr.listSExpr[2].listSExpr[0].value === "op" &&
          sExpr.listSExpr[3].listSExpr.length === 2 &&
          sExpr.listSExpr[3].listSExpr[0].value === "right"
        ) {
          return new BinOp(
            parseExpr(sExpr.listSExpr[1].listSExpr[1]),
            parseOperator(sExpr.listSExpr[2].listSExpr[1]),
            parseExpr(sExpr.listSExpr[3].listSExpr[1])
          );
        }
        break;

      case "UnaryOp":
        if (
          sExpr.listSExpr.length === 3 &&
          sExpr.listSExpr[1].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[2].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[1].listSExpr.length === 2 &&
          sExpr.listSExpr[1].listSExpr[0].constructor.name === "Atom" &&
          sExpr.listSExpr[1].listSExpr[0].value === "op" &&
          sExpr.listSExpr[2].listSExpr.length === 2 &&
          sExpr.listSExpr[2].listSExpr[0].value === "operand"
        ) {
          return new UnaryOp(
            parseUnaryOp(sExpr.listSExpr[1].listSExpr[1]),
            parseExpr(sExpr.listSExpr[2].listSExpr[1])
          );
        }
        break;

      case "Constant":
        if (
          sExpr.listSExpr.length === 3 &&
          sExpr.listSExpr[1].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[1].listSExpr.length === 2 &&
          sExpr.listSExpr[1].listSExpr[0].constructor.name === "Atom" &&
          sExpr.listSExpr[1].listSExpr[0].value === "value" &&
          sExpr.listSExpr[2].listSExpr[0].constructor.name === "Atom" &&
          sExpr.listSExpr[2].listSExpr[0].value === "kind"
        ) {
          return new Constant(
            sExpr.listSExpr[1].listSExpr[1].value,
            sExpr.listSExpr[2].listSExpr[1].value
          );
        }
        break;
    }
  }

  throw new Error("Unable to parse Expr: " + sExpr);
}

// Grammer:
// operator  ::=	 	(Add)
//             |	 	(Sub)
//             |	 	(Mult)
function parseOperator(sExpr) {
  if (
    sExpr.listSExpr.length === 1 &&
    sExpr.listSExpr[0].constructor.name === "Atom"
  ) {
    switch (sExpr.listSExpr[0].value) {
      case "Add":
        return new Operator(sExpr.listSExpr[0].value);
      case "Sub":
        return new Operator(sExpr.listSExpr[0].value);
      case "Mult":
        return new Operator(sExpr.listSExpr[0].value);
    }
  }

  throw new Error("Unable to parse Op: " + sExpr);
}

// Grammer:
// unaryop 	::= 	(UAdd)
//            |	 	(USub)
function parseUnaryOp(sExpr) {
  if (
    sExpr.listSExpr.length === 1 &&
    sExpr.listSExpr[0].constructor.name === "Atom"
  ) {
    switch (sExpr.listSExpr[0].value) {
      case "UAdd":
        return new UnaryOperator(sExpr.listSExpr[0].value);
      case "USub":
        return new UnaryOperator(sExpr.listSExpr[0].value);
    }
  }

  throw new Error("Unable to parse UnaryOp: " + sExpr);
}
