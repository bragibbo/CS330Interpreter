const {
  Operator,
  Module,
  CoreAST,
  ExprStamt,
  BinOp,
  Constant,
  UnaryOperator,
  UnaryOp,
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
module.exports.Desugar = (ast) => {
  if (ast.constructor.name === "SurfaceAST") {
    return new CoreAST(desugarModule(ast.module));
  }

  throw new Error("Desurgar - Error interpreting ast: " + JSON.stringify(ast));
};

function desugarModule(mod) {
  if (mod.constructor.name === "Module") {
    return new Module(desugarExprStmt(mod.exprStmt));
  }
  throw new Error(
    "Desurgar - Error interpreting module: " + JSON.stringify(mod)
  );
}

function desugarExprStmt(exprStmt) {
  if (exprStmt.constructor.name === "ExprStamt") {
    return new ExprStamt(desugarExpr(exprStmt.expr));
  }
  throw new Error(
    "Desurgar - Error interpreting expr stmt: " + JSON.stringify(exprStmt)
  );
}

function desugarExpr(expr) {
  switch (expr.constructor.name) {
    case "BinOp":
      const binOp = desugarOperator(expr.op);

      switch (binOp) {
        case "+":
          return new BinOp(
            desugarExpr(expr.left),
            new Operator("Add"),
            desugarExpr(expr.right)
          );
        case "-":
          return new BinOp(
            desugarExpr(expr.left),
            new Operator("Add"),
            desugarExpr(new UnaryOp(new UnaryOperator("USub"), expr.right))
          );
        case "*":
          return new BinOp(
            desugarExpr(expr.left),
            new Operator("Mult"),
            desugarExpr(expr.right)
          );
        default:
          throw new Error(
            "Desurgar - Error invalid bin operator: " + JSON.stringify(op)
          );
      }
    case "UnaryOp":
      const unOp = desugarUnary(expr.op);

      switch (unOp) {
        case "+":
          return new BinOp(
            new Constant(1, "#f"),
            new Operator("Mult"),
            desugarExpr(expr.operand)
          );
        case "-":
          return new BinOp(
            new Constant(-1, "#f"),
            new Operator("Mult"),
            desugarExpr(expr.operand)
          );
        default:
          throw new Error(
            "Desurgar - Error invalid un operator: " + JSON.stringify(op)
          );
      }
    case "Constant":
      return new Constant(expr.value, expr.kind);
  }
  throw new Error(
    "Desurgar - Error interpreting expr: " + JSON.stringify(expr)
  );
}

function desugarOperator(operator) {
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

  throw new Error(
    "Desurgar - Error interpreting operator: " + JSON.stringify(operator)
  );
}

function desugarUnary(unaryOp) {
  if (unaryOp.constructor.name === "UnaryOperator") {
    switch (unaryOp.type) {
      case "UAdd":
        return "+";
      case "USub":
        return "-";
    }
  }
  throw new Error(
    "Desurgar - Error interpreting unary op: " + JSON.stringify(unaryOp)
  );
}
