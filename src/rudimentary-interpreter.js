// Grammer:
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
module.exports.RudimentaryInterpreter = (ast) => {
  if (ast.constructor.name === "CoreAST") {
    const answer = evalModule(ast.module);
    return `(value ${answer})`;
  }
  throw new Error("RudInterp - Error interpreting ast: " + JSON.stringify(ast));
};

function evalModule(mod) {
  if (mod.constructor.name === "Module") {
    return evalExprStmt(mod.exprStmt);
  }
  throw new Error(
    "RudInterp - Error interpreting module: " + JSON.stringify(mod)
  );
}

function evalExprStmt(exprStmt) {
  if (exprStmt.constructor.name === "ExprStamt") {
    return evalExpr(exprStmt.expr);
  }
  throw new Error(
    "RudInterp - Error interpreting expr stmt: " + JSON.stringify(exprStmt)
  );
}

function evalExpr(expr) {
  switch (expr.constructor.name) {
    case "BinOp":
      const left = evalExpr(expr.left);
      const binOp = evalOperator(expr.op);
      const right = evalExpr(expr.right);

      switch (binOp) {
        case "+":
          return left + right;
        case "*":
          return left * right;
        default:
          throw new Error(
            "RudInterp - Error invalid bin operator: " + JSON.stringify(op)
          );
      }
    case "Constant":
      return !isNaN(expr.value) ? Number(expr.value) : expr.value;
  }
  throw new Error(
    "RudInterp - Error interpreting expr: " + JSON.stringify(expr)
  );
}

function evalOperator(operator) {
  if (operator.constructor.name === "Operator") {
    switch (operator.type) {
      case "Add":
        return "+";
      case "Mult":
        return "*";
    }
  }
  throw new Error(
    "RudInterp - Error interpreting operator: " + JSON.stringify(operator)
  );
}
