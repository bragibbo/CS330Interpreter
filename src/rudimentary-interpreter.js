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
      (answer.result && answer.result.constructor.name === "Fundef") ||
      (answer.result &&
        answer.result.lambda &&
        answer.newStore[answer.result.lambda].constructor.name === "Fundef")
    ) {
      return `(value function)`;
    } else if (answer.result) {
      return `(value ${answer.result})`;
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
    const { newEnv, newStore } = createEnvironmentHelper(
      { funDefs: fundefs },
      {},
      {},
      0
    );

    return evalExpr(exprStmt.expr, newEnv, newStore);
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

      if (isNaN(left.result) || isNaN(right.result)) {
        throw new Error('(error dynamic "not a number")');
      }

      switch (expr.op.type) {
        case "Add":
          return { result: left.result + right.result, newStore: { ...store } };
        case "Mult":
          return { result: left.result * right.result, newStore: { ...store } };
        default:
          throw new Error(
            "RudInterp - Error invalid bin operator: " + JSON.stringify(op)
          );
      }
    case "Lambda":
      if (isArg) {
        return {
          result: new Fundef(null, expr.args, [], { expr: expr.body }),
        };
      }

      return {
        result: {
          lambda: "lambda",
          ...env,
        },
        newStore: {
          ...store,
          lambda: new Fundef(null, expr.args, [], { expr: expr.body }),
        },
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

      const { updatedEnv, updatedStore } = evaluateLambda(expr, env, store);
      const funcToExecute = getFunToExecute(
        updatedEnv,
        updatedStore,
        expr.func.identifier
      );

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

      const { nextArgsEnv, nextArgsStore } = evalArgsHelper(
        funcToExecute.arguments.args,
        expr,
        updatedEnv,
        updatedStore
      );

      const funcEnv = updatedEnv[expr.func.identifier] || updatedEnv;
      const envMinusFuncDef = {
        ...removeLambdaFromEnv(funcEnv, expr.func.identifier || "lambda"),
      };

      const { newEnv, newStore } = createEnvironmentHelper(
        funcToExecute,
        {},
        {},
        0
      );

      const nextStore = { ...nextArgsStore, ...newStore };
      const nextEnv = {
        ...mergeEnvsHelper(newEnv, nextArgsEnv),
        ...nextArgsEnv,
      };

      return evalExpr(
        funcToExecute.returnStmt.expr, // Return statement
        { ...envMinusFuncDef, ...nextEnv },
        { ...nextStore }
      );

    case "Constant":
      return {
        result: !isNaN(expr.value) ? Number(expr.value) : expr.value,
        newStore: { ...store },
      };
    case "Name":
      // The first one allows us to get functions
      // The second allows for values
      if (env[expr.identifier] && env[expr.identifier][expr.identifier]) {
        return {
          result: store[env[expr.identifier][expr.identifier]],
          newStore: { ...store },
        };
      } else if (env[expr.identifier]) {
        return { result: store[env[expr.identifier]], newStore: { ...store } };
      } else {
        throw new Error('(error dynamic "unbound variable")');
      }
  }
  throw new Error(
    "RudInterp - Error interpreting expr: " + JSON.stringify(expr)
  );
}

function evaluateLambda(expr, env, store) {
  if (
    expr.func.constructor.name === "Call" ||
    expr.func.constructor.name === "Lambda"
  ) {
    const { result, newStore } = evalExpr(expr.func, env, store);
    if (typeof result !== "object") {
      throw new Error('(error dynamic "not a function")');
    }

    const nextStore = { ...newStore, ...store };
    return {
      updatedEnv: { ...result, ...env },
      updatedStore: { ...nextStore },
    };
  }

  return { updatedEnv: { ...env }, updatedStore: { ...store } };
}

// Evaluate Arguments and return the map of args with the updated store
function evalArgsHelper(args, expr, env, store) {
  if (!args.length) {
    return { nextArgsEnv: {}, nextArgsStore: { ...store } };
  }

  return evalArgs(args, expr, env, store, {}, {}, 0);
}

function evalArgs(args, expr, env, store, curEnv, curStore, index) {
  if (index >= args.length) {
    return {
      nextArgsEnv: { ...curEnv },
      nextArgsStore: { ...store, ...curStore },
    };
  }

  const { result } = evalExpr(expr.args[index], { ...env }, { ...store }, true);

  // const address = parseInt(Math.random() * 1000000000);
  const nextStore = { ...curStore, [args[index].identifier]: result };
  const newEnv = {
    ...curEnv,
    [args[index].identifier]: args[index].identifier,
  };

  return evalArgs(args, expr, env, store, newEnv, nextStore, index + 1);
}

// Create nested functions from function defs
// Returns nested function defs and store mappings
function createEnvironmentHelper(parentFun, env, store, index) {
  if (index >= parentFun.funDefs.length) {
    return { newEnv: { ...env }, newStore: { ...store } };
  }

  const { newEnv, newStore } = createEnvironment(
    parentFun.funDefs[index],
    env,
    store
  );

  return createEnvironmentHelper(
    parentFun,
    { ...newEnv },
    { ...newStore },
    index + 1
  );
}

function createEnvironment(fundef, env, store) {
  const { newEnv, newStore } = createEnvironmentHelper(fundef, env, store, 0);

  // const address = parseInt(Math.random() * 1000000000);
  const nextEnv = {
    ...env,
    ...{
      [fundef.name]: { ...newEnv, ...{ [fundef.name]: fundef.name } },
    },
  };

  const nextStore = { ...newStore, [fundef.name]: fundef };

  return {
    newEnv: { ...nextEnv },
    newStore: { ...nextStore },
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

const getFunToExecute = (env, store, name) => {
  if (env[name] && env[name][name]) return store[env[name][name]];
  if (env[name]) return store[env[name]];

  if (env.lambda && env.lambda.lambda) return store["lambda"];
  if (env.lambda) return store["lambda"];

  return undefined;
};

const removeLambdaFromEnv = (obj, prop) => {
  let { [prop]: omit, ...res } = obj;
  return res;
};
