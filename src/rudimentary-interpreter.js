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
    if (
      (typeof answer === "object" && answer.constructor.name === "Fundef") ||
      (answer.lambda && answer.lambda.constructor.name === "Fundef")
    ) {
      return `(value function)`;
    } else {
      return `(value ${answer})`;
    }
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
    const startEnv = createEnvironmentHelper({ funDefs: fundefs }, {}, 0);

    return evalExpr(exprStmt.expr, startEnv, {});
  }
  throw new Error(
    "RudInterp - Error interpreting expr stmt: " + JSON.stringify(exprStmt)
  );
}

function evalExpr(expr, env, store, isArg = false) {
  switch (expr.constructor.name) {
    case "BinOp":
      const left = evalExpr(expr.left, env, store);
      const right = evalExpr(expr.right, env, store);

      if (isNaN(left) || isNaN(right)) {
        throw new Error('(error dynamic "not a number")');
      }

      switch (expr.op.type) {
        case "Add":
          return left + right;
        case "Mult":
          return left * right;
        default:
          throw new Error(
            "RudInterp - Error invalid bin operator: " + JSON.stringify(op)
          );
      }
    case "Lambda":
      if (isArg) {
        return new Fundef(null, expr.args, [], { expr: expr.body });
      }

      return {
        lambda: new Fundef(null, expr.args, [], { expr: expr.body }),
        ...env,
      };

    case "Call":
      if (
        expr.func.constructor.name !== "Fundef" &&
        expr.func.constructor.name !== "Name" &&
        expr.func.constructor.name !== "Call" &&
        expr.func.constructor.name !== "Lambda"
      ) {
        throw new Error('(error dynamic "not a function")');
      }

      const updatedEnv =
        expr.func.constructor.name === "Call" ||
        expr.func.constructor.name === "Lambda"
          ? { ...env, lambda: evalExpr(expr.func, env, store) }
          : { ...env };
      const funcToExecute = getFunToExecute(updatedEnv, expr.func.identifier);

      if (funcToExecute === undefined) {
        throw new Error('(error dynamic "unbound identifier")');
      }

      if (
        typeof funcToExecute !== "object" ||
        (typeof funcToExecute === "object" &&
          funcToExecute.constructor.name !== "Fundef")
      ) {
        throw new Error('(error dynamic "not a function")');
      }

      if (funcToExecute.arguments.args.length !== expr.args.length) {
        throw new Error('(error dynamic "arity mismatch")');
      }

      const currentArgsMap = funcToExecute.arguments.args.reduce(
        (o, arg, ind) => ({
          ...o,
          ...{
            [arg.identifier]: evalExpr(
              expr.args[ind],
              {
                ...updatedEnv,
              },
              store,
              true
            ),
          },
        }),
        {}
      );

      const funcEnv = updatedEnv[expr.func.identifier] || updatedEnv.lambda;
      const envMinusFuncDef = {
        ...removeLambdaFromEnv(funcEnv, expr.func.identifier || "lambda"),
      };

      const nextEnvDefs = createEnvironmentHelper(funcToExecute, {}, 0);
      const nextEnv = {
        ...mergeEnvsHelper(nextEnvDefs, currentArgsMap),
        ...currentArgsMap,
      };

      const { nextStore, nextArgs } = addArgsToStore(store, currentArgsMap);

      return evalExpr(
        funcToExecute.returnStmt.expr, // Return statement
        { ...envMinusFuncDef, ...nextEnv },
        nextStore
      );

    case "Constant":
      return !isNaN(expr.value) ? Number(expr.value) : expr.value;
    case "Name":
      // The first one allows us to get functions
      // The second allows for values
      if (env[expr.identifier] && env[expr.identifier][expr.identifier]) {
        return env[expr.identifier][expr.identifier];
      } else if (env[expr.identifier]) {
        return env[expr.identifier];
      } else {
        throw new Error('(error dynamic "unbound variable")');
      }
  }
  throw new Error(
    "RudInterp - Error interpreting expr: " + JSON.stringify(expr)
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

function mergeEnvsHelper(curEnv, args) {
  const keys = Object.keys(curEnv);
  return mergeEnvs(keys, curEnv, { ...args }, 0);
}

function mergeEnvs(keys, env, args, index) {
  if (index >= keys.length) {
    return { ...env };
  }

  const newEnv = { ...env, ...determineMergeEnvs(keys, env, args, index) };
  return mergeEnvs(keys, newEnv, args, index + 1);
}

function determineMergeEnvs(keys, env, args, index) {
  if (
    typeof env[keys[index]] === "object" &&
    env[keys[index]].constructor.name !== "Fundef"
  ) {
    return {
      [keys[index]]: { ...mergeEnvsHelper(env[keys[index]], { ...args }) },
    };
  }

  return { ...env, ...args };
}

const getFunToExecute = (env, name) => {
  if (env[name] && env[name][name]) return env[name][name];
  if (env[name]) return env[name];

  if (env.lambda && env.lambda.lambda) return env.lambda.lambda;
  if (env.lambda) return env.lambda;

  return undefined;
};

const removeLambdaFromEnv = (obj, prop) => {
  let { [prop]: omit, ...res } = obj;
  return res;
};

function addArgsToStore(oldStore, newArgs) {
  return { nextStore: {}, nextArgs: {} };
}
