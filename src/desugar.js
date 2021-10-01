const {
  Operator,
  Module,
  CoreAST,
  ExprStamt,
  BinOp,
  Constant,
  UnaryOperator,
  UnaryOp,
  Body,
  Fundef,
  Arg,
  Arguments,
  ReturnStmt,
  NameExpr,
  Call,
} = require("./types");

// mod	 	      ::=	 	(Module [body (fundef ... expr_stmt)] [type_ignores ()])
// fundef	 	    ::=	 	(FunctionDef [name identifier] [args _arguments] [body (return_stmt)] [decorator_list ()] [returns #f] [type_comment #f])
// _arguments	 	::=	 	(arguments [posonlyargs ()] [args (_arg)] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])
// _arg	 	      ::=	 	(arg [arg identifier] [annotation #f] [type_comment #f])
// return_stmt	::=	 	(Return [value expr])
// expr_stmt	 	::=	 	(Expr [value expr])
// expr	 	      ::=	 	(BinOp [left expr] [op operator] [right expr])
//   	            |	 	(UnaryOp [op unaryop] [operand expr])
//  	 	          |	 	(Call [func name_expr] [args (expr)] [keywords ()])
//  	 	          |	 	(Constant [value int] [kind #f])
//  	 	          |	 	name_expr
// name_expr	 	::=	 	(Name [id identifier] [ctx (Load)])
// operator	 	  ::=	 	(Add)
//  	 	          |	 	(Sub)
//  	 	          |	 	(Mult)
// unaryop	 	  ::=	 	(UAdd)
//  	 	          |	 	(USub)
module.exports.Desugar = (ast) => {
  if (ast.constructor.name === "SurfaceAST") {
    return new CoreAST(desugarModule(ast.module));
  }

  throw new Error("Desugar - Error desugaring ast: " + JSON.stringify(ast));
};

function desugarModule(mod) {
  if (mod.constructor.name === "Module") {
    return new Module(desugarBody(mod.body));
  }
  throw new Error("Desugar - Error desugaring module: " + JSON.stringify(mod));
}

function desugarBody(mod) {
  if (mod.constructor.name === "Body") {
    return new Body(desugarExprStmt(mod.exprStmt), desugarFunDef(mod.fundef));
  }
  throw new Error("Desugar - Error desugaring module: " + JSON.stringify(mod));
}

function desugarFunDef(listFunDef) {
  if (listFunDef.every((el) => el.constructor.name === "Fundef")) {
    return listFunDef.map((el) => {
      return new Fundef(
        el.name,
        desugarArguments(el.arguments),
        desugarReturnStmt(el.returnStmt)
      );
    });
  }
  throw new Error(
    "Desugar - Error desugaring Fun def: " + JSON.stringify(listFunDef)
  );
}

function desugarArguments(args) {
  return new Arguments([...args.args.map((el) => desugarArg(el))]);
}

function desugarArg(arg) {
  if (arg.constructor.name === "Arg") {
    return new Arg(arg.identifier);
  }
  throw new Error("Desurgar - Error desugaring Arg: " + JSON.stringify(arg));
}

function desugarReturnStmt(returnStmt) {
  if (returnStmt.constructor.name === "ReturnStmt") {
    return new ReturnStmt(desugarExpr(returnStmt.expr));
  }
  throw new Error(
    "Desurgar - Error desugaring Return Stmt: " + JSON.stringify(returnStmt)
  );
}

function desugarExprStmt(exprStmt) {
  if (exprStmt.constructor.name === "ExprStamt") {
    return new ExprStamt(desugarExpr(exprStmt.expr));
  }
  throw new Error(
    "Desugar - Error desugaring expr stmt: " + JSON.stringify(exprStmt)
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
            "Desugar - Error invalid bin operator: " + JSON.stringify(op)
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
            "Desugar - Error invalid un operator: " + JSON.stringify(op)
          );
      }
    case "Call":
      return new Call(desugarExpr(expr.nameExpr), [
        ...expr.args.map((el) => desugarExpr(el)),
      ]);
    case "Constant":
      return new Constant(expr.value, expr.kind);
    case "NameExpr":
      return new NameExpr(expr.name);
  }
  throw new Error("Desugar - Error desugaring expr: " + JSON.stringify(expr));
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
    "Desugar - Error desugaring operator: " + JSON.stringify(operator)
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
    "Desugar - Error desugaring unary op: " + JSON.stringify(unaryOp)
  );
}
