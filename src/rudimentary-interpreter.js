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

const { Fundef } = require("./types");

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

function evalExpr(expr, topFunDefs, env) {
  switch (expr.constructor.name) {
    case "BinOp":
      const left = evalExpr(expr.left, topFunDefs, env);
      const binOp = evalOperator(expr.op);
      const right = evalExpr(expr.right, topFunDefs, env);

      if (isNaN(left) || isNaN(right)) {
        throw new Error('(error dynamic "not a number")');
      }

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
    case "Lambda":
      return new Fundef(null, expr.args, [], { expr: expr.body });

    case "Call":
      const funcToExecute = getFunToExecute(
        topFunDefs,
        env,
        expr.func.identifier
      );

      if (funcToExecute === undefined) {
        throw new Error('(error dynamic "unknown function")');
      }

      if (
        typeof funcToExecute !== "object" &&
        funcToExecute.constructor.name !== "FunDef"
      ) {
        throw new Error('(error dynamic "not a function")');
      }

      if (funcToExecute.arguments.args.length !== expr.args.length) {
        throw new Error('(error dynamic "arity mismatch")');
      }

      const funMap = getTopLevelFunDefsMap(topFunDefs, "@@@@");
      const envMinusLambda = removeLambdaFromEnv(
        { ...env, ...getTopLevelFunDefsMap(topFunDefs, expr.func.identifier) },
        expr.func.identifier
      );

      const currentArgsMap = funcToExecute.arguments.args.reduce(
        (o, arg, ind) => ({
          ...o,
          ...{
            [arg.identifier]:
              evalExpr(expr.args[ind], topFunDefs, {
                ...envMinusLambda,
                ...funMap,
              }) || topFunDefs[expr.func.identifier],
          },
        }),
        {}
      );

      return evalExpr(
        funcToExecute.returnStmt.expr, // Return statement
        getTopLevelArray(topFunDefs, funcToExecute.name), // All topLevel fun defs
        createEnvironmentHelper(
          funcToExecute,
          { ...envMinusLambda, ...currentArgsMap },
          0
        )
      );

    case "Constant":
      return !isNaN(expr.value) ? Number(expr.value) : expr.value;
    case "Name":
      if (env[expr.identifier]) {
        return env[expr.identifier];
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

function createEnvironmentHelper(parentFun, env, index) {
  if (index >= parentFun.funDefs.length) {
    return env;
  }

  const newEnv = { ...createEnvironment(parentFun.funDefs[index], env) };

  return createEnvironmentHelper(parentFun, { ...newEnv }, index + 1);
}

function createEnvironment(fundef, env) {
  return {
    ...env,
    ...{
      [fundef.name]: {
        ...createEnvironmentHelper(fundef, env, 0),
        ...{ [fundef.name]: fundef },
      },
    },
  };
}

const getFunToExecute = (funDefs, env, name) => {
  if (typeof env[name] === "object" && env[name].constructor.name === "Fundef")
    return env[name];

  if (env[name] && env[name][name]) return env[name][name];
  if (env[name]) return env[name]

  return funDefs.find((o) => o.name === name);
};

const removeLambdaFromEnv = (obj, prop) => {
  let { [prop]: omit, ...res } = obj;
  return res;
};

const getTopLevelArray = (fundefs, name) => {
  const ind = fundefs.findIndex((o) => o.name === name);
  if (ind !== -1) {
    return fundefs.slice(0, ind + 1);
  }
  return fundefs;
};

const getTopLevelFunDefsMap = (fundefs, name) => {
  let funs = getTopLevelArray(fundefs, name);
  return funs.reduce(
    (o, fun) => ({
      ...o,
      ...{
        [fun.name]: fun,
      },
    }),
    {}
  );
};
