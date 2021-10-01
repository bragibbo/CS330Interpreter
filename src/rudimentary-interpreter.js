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
    return evalBody(mod.body);
  }
  throw new Error(
    "RudInterp - Error interpreting module: " + JSON.stringify(mod)
  );
}

function evalBody(body) {
  if (body.constructor.name === "Body") {
    return evalExprStmt(body.exprStmt, body.fundef);
  }
  throw new Error(
    "RudInterp - Error interpreting body: " + JSON.stringify(body)
  );
}

function evalExprStmt(exprStmt, fundefs) {
  if (exprStmt.constructor.name === "ExprStamt") {
    return evalExpr(exprStmt.expr, fundefs, {});
  }
  throw new Error(
    "RudInterp - Error interpreting expr stmt: " + JSON.stringify(exprStmt)
  );
}

function evalExpr(expr, fundefs, env) {
  switch (expr.constructor.name) {
    case "BinOp":
      const left = evalExpr(expr.left, fundefs, env);
      const binOp = evalOperator(expr.op);
      const right = evalExpr(expr.right, fundefs, env);

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
    case "Call":
      const funName = expr.nameExpr.name;
      const funIndex = fundefs.findIndex((el) => el.name === funName);

      if (funIndex === -1) {
        throw new Error('(error dynamic "unknown function")');
      }

      return evalExpr(fundefs[funIndex].returnStmt.expr, fundefs, {
        ...env,
        ...fundefs[funIndex].arguments.args.reduce(
          (o, arg, ind) => ({
            ...o,
            ...{
              [arg.identifier]: evalExpr(expr.args[ind], fundefs, { ...env }),
            },
          }),
          {}
        ),
      });

    case "Constant":
      return !isNaN(expr.value) ? Number(expr.value) : expr.value;
    case "NameExpr":
      if (env[expr.name]) {
        return env[expr.name];
      } else {
        throw new Error('(error dynamic "unbound variable")');
      }
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
