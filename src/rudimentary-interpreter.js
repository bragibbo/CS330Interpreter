const { Operator } = require("./types");

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
module.exports.RudimentaryInterpreter = (ast) => {
  if (ast.constructor.name === "AST") {
    return evalModule(ast.module);
  }
  
  throw new Error("RudInterp - Error interpreting ast: " + JSON.stringify(ast))
};

function evalModule(mod) {
  if (mod.constructor.name === "Module") {
    return evalExprStmt(mod.exprStmt);
  }
  throw new Error("RudInterp - Error interpreting module: " + JSON.stringify(mod));
}

function evalExprStmt(exprStmt) {
  if (exprStmt.constructor.name === "ExprStamt") {
    return evalExpr(exprStmt.expr);
  }
  throw new Error("RudInterp - Error interpreting expr stmt: " + JSON.stringify(exprStmt));
}

function evalExpr(expr) {
  switch (expr.constructor.name) {
    case "BinOp":
      const left = evalExpr(expr.left);
      const op = evalOperator(expr.op);
      const right = evalExpr(expr.right);

      switch (op) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        default:
          throw new Error("RudInterp - Error invalid operator: " + JSON.stringify(op));
      }
    case "UnaryOp":
      return;
    case "Constant":
      return !isNaN(expr.value) ? Number(expr.value) : expr.value;
  }
  throw new Error("RudInterp - Error interpreting expr: " + JSON.stringify(expr));
}

function evalOperator(operator) {
  if (operator.constructor.name === "Operator") {
    switch (operator.type) {
      case "Add":
        return "+";
      case "Sub":
        return "-";
      case "Mult":
        return "*";
    }
  }

  throw new Error("RudInterp - Error interpreting operator: " + JSON.stringify(operator));
}

function evalUnary(unaryOp) {
  throw new Error("RudInterp - Error interpreting unary op: " + JSON.stringify(unaryOp));
}
