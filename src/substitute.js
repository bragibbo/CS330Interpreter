const {
  Operator,
  Module,
  CoreAST,
  ExprStamt,
  BinOp,
  Constant,
  Body,
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
module.exports.Substitute = (ast) => {
  if (ast.constructor.name === "CoreAST") {
    return new CoreAST(substituteModule(ast.module));
  }

  throw new Error(
    "Substitute - Error interpreting ast: " + JSON.stringify(ast)
  );
};

function substituteModule(mod) {
  if (mod.constructor.name === "Module") {
    return new Module(substituteBody(mod.body));
  }
  throw new Error(
    "Substitute - Error interpreting module: " + JSON.stringify(mod)
  );
}

function substituteBody(mod) {
  if (mod.constructor.name === "Body") {
    return new Body(substituteExprStmt(mod.exprStmt, mod.fundef));
  }
  throw new Error(
    "Substitute - Error interpreting module: " + JSON.stringify(mod)
  );
}

function substituteExprStmt(exprStmt, fundef) {
  if (exprStmt.constructor.name === "ExprStamt") {
    return new ExprStamt(substituteExpr(exprStmt.expr, fundef));
  }
  throw new Error(
    "Substitute - Error interpreting expr stmt: " + JSON.stringify(exprStmt)
  );
}

function substituteExpr(expr, fundef, id, replaceExpr) {
  switch (expr.constructor.name) {
    case "BinOp":
      const binOp = substituteOperator(expr.op);
      const lhside = substituteExpr(expr.left, fundef, id, replaceExpr);
      const rhside = substituteExpr(expr.right, fundef, id, replaceExpr);

      switch (binOp) {
        case "+":
          return new BinOp(lhside, new Operator("Add"), rhside);
        case "*":
          return new BinOp(lhside, new Operator("Mult"), rhside);
        default:
          throw new Error(
            "Substitute - Error invalid bin operator: " + JSON.stringify(op)
          );
      }
    case "Call":
      const funName = expr.nameExpr.name;
      const funIndex = fundef.findIndex((el) => el.name === funName);

      if (funIndex === -1) {
        throw new Error(
          "Substitute - Can't find parsed function def: " + JSON.stringify(expr)
        );
      }

      return substituteExpr(
        fundef[funIndex].returnStmt.expr,
        fundef,
        fundef[funIndex].arguments.args.identifier,
        substituteExpr(expr.expr, fundef, id, replaceExpr)
      );
    case "Constant":
      return new Constant(expr.value, expr.kind);
    case "NameExpr":
      if (id === expr.name) {
        return replaceExpr;
      }
  }
  throw new Error(
    "Substitute - Error interpreting expr: " + JSON.stringify(expr)
  );
}

function substituteOperator(operator) {
  if (operator.constructor.name === "Operator") {
    switch (operator.type) {
      case "Add":
        return "+";
      case "Mult":
        return "*";
    }
  }

  throw new Error(
    "Substitute - Error interpreting operator: " + JSON.stringify(operator)
  );
}
