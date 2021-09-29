const {
  UnaryOp,
  Operator,
  BinOp,
  ExprStamt,
  Module,
  Constant,
  UnaryOperator,
  SurfaceAST,
  Body,
  Fundef,
  ReturnStmt,
  Arguments,
  Arg,
  Call,
  NameExpr,
} = require("./types");

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
module.exports.PythonModuleParser = (sExpressions) => {
  if (!sExpressions) {
    throw Error("Unable to parse S Expression list - value: " + sExpressions);
  }

  return new SurfaceAST(parseMod(sExpressions));
};

// Grammer:
// mod  ::=	 	(Module [body (fundef ... expr_stmt)] [type_ignores ()])
function parseMod(sExpr) {
  if (
    sExpr.constructor.name === "SExprParen" &&
    sExpr.listSExpr.length === 3 &&
    sExpr.listSExpr[0].value === "Module"
  ) {
    return new Module(parseBody(sExpr.listSExpr[1]));
  }
  throw new Error("Unable to Parse Module: " + sExpr);
}

function parseBody(mod) {
  if (
    mod.constructor.name === "SExprBracket" &&
    mod.listSExpr[0].value === "body" &&
    mod.listSExpr[1].constructor.name === "SExprParen" &&
    mod.listSExpr[1].listSExpr.length >= 1
  ) {
    // Verify that there are no duplicate function names
    const funDefs = parseFunDefHelper([], mod.listSExpr[1].listSExpr, 0);
    const duplicates = funDefs.filter(
      (item, index) =>
        funDefs.findIndex((el) => el.name === item.name) !== index
    );
    if (duplicates.length) {
      throw new Error('(error static "duplicate function name")');
    }

    return new Body(
      parseExprStmt(
        mod.listSExpr[1].listSExpr[mod.listSExpr[1].listSExpr.length - 1]
      ),
      [...funDefs]
    );
  }
  throw new Error("Unable to parse body: " + mod);
}

function parseFunDefHelper(funDefs, defs, index) {
  if (index > defs.length) {
    return [...funDefs];
  }

  tmpFunDef = parseFunDef(defs[index]);
  if (tmpFunDef) {
    return [tmpFunDef, ...parseFunDefHelper(funDefs, defs, index + 1)];
  }

  return [...funDefs];
}

// Grammer:
// fundef	 ::=	(FunctionDef [name identifier] [args _arguments] [body (return_stmt)] [decorator_list ()] [returns #f] [type_comment #f])
function parseFunDef(funDef) {
  if (
    funDef.constructor.name === "SExprParen" &&
    funDef.listSExpr.length === 7 &&
    funDef.listSExpr[0].value === "FunctionDef" &&
    funDef.listSExpr[1].constructor.name === "SExprBracket" &&
    funDef.listSExpr[1].listSExpr[0].value === "name" &&
    funDef.listSExpr[2].constructor.name === "SExprBracket" &&
    funDef.listSExpr[2].listSExpr[0].value === "args" &&
    funDef.listSExpr[3].constructor.name === "SExprBracket" &&
    funDef.listSExpr[3].listSExpr[0].value === "body" &&
    funDef.listSExpr[3].listSExpr[0].constructor.name === "Atom" &&
    funDef.listSExpr[3].listSExpr.length === 2
  ) {
    return new Fundef(
      funDef.listSExpr[1].listSExpr[1].value,
      parseArguments(funDef.listSExpr[2].listSExpr[1]),
      parseReturnStmt(funDef.listSExpr[3].listSExpr[1].listSExpr[0])
    );
  } else if (funDef.listSExpr[0].value !== "FunctionDef") {
    return null;
  }
  throw new Error("Unable to parse Function Definition: " + funDef);
}

// Grammer:
// _arguments	 	::=	 	(arguments [posonlyargs ()] [args (_arg)] [vararg #f] [kwonlyargs ()] [kw_defaults ()] [kwarg #f] [defaults ()])
function parseArguments(args) {
  if (
    args.listSExpr.length === 8 &&
    args.listSExpr[0].value === "arguments" &&
    args.listSExpr[2].constructor.name === "SExprBracket" &&
    args.listSExpr[2].listSExpr.length === 2 &&
    args.listSExpr[2].listSExpr[0].value === "args" &&
    args.listSExpr[2].listSExpr[1].constructor.name === "SExprParen" &&
    args.listSExpr[2].listSExpr[1].listSExpr.length === 1
  ) {
    return new Arguments(parseArg(args.listSExpr[2].listSExpr[1].listSExpr[0]));
  }
  throw new Error("Unable to parse Arguments: " + args);
}

// Grammer:
// _arg	 	::=	 	(arg [arg identifier] [annotation #f] [type_comment #f])
function parseArg(arg) {
  if (
    arg.listSExpr.length === 4 &&
    arg.listSExpr[0].value === "arg" &&
    arg.listSExpr[1].constructor.name === "SExprBracket" &&
    arg.listSExpr[1].listSExpr.length === 2 &&
    arg.listSExpr[1].listSExpr[0].value === "arg" &&
    arg.listSExpr[1].listSExpr[1].constructor.name === "Atom"
  ) {
    return new Arg(arg.listSExpr[1].listSExpr[1].value);
  }
  throw new Error("Unable to parse Arg: " + arg);
}

// Grammer:
// return_stmt	::=	(Return [value expr])
function parseReturnStmt(returnStmt) {
  if (
    returnStmt.listSExpr[0].value === "Return" &&
    returnStmt.listSExpr[1].constructor.name === "SExprBracket" &&
    returnStmt.listSExpr[1].listSExpr[0].value === "value"
  ) {
    return new ReturnStmt(parseExpr(returnStmt.listSExpr[1].listSExpr[1]));
  }
  throw new Error("Unable to parse return statement: " + returnStmt);
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

      case "Call":
        if (
          sExpr.listSExpr.length === 4 &&
          sExpr.listSExpr[1].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[1].listSExpr.length === 2 &&
          sExpr.listSExpr[2].constructor.name === "SExprBracket" &&
          sExpr.listSExpr[2].listSExpr.length === 2 &&
          sExpr.listSExpr[2].listSExpr[0].value === "args" &&
          sExpr.listSExpr[2].listSExpr[1].constructor.name === "SExprParen"
        ) {
          return new Call(
            parseNameExpr(sExpr.listSExpr[1].listSExpr[1]),
            parseExpr(sExpr.listSExpr[2].listSExpr[1].listSExpr[0])
          );
        }
        break;

      case "Name":
        return parseNameExpr(sExpr);
        break;
    }
  }

  throw new Error("Unable to parse Expr: " + sExpr);
}

// Grammer:
// name_expr	 	::=	 	(Name [id identifier] [ctx (Load)])
function parseNameExpr(nameExpr) {
  if (
    nameExpr.listSExpr[0].value === "Name" &&
    nameExpr.listSExpr.length === 3 &&
    nameExpr.listSExpr[1].listSExpr.length === 2 &&
    nameExpr.listSExpr[1].listSExpr[0].value === "id"
  ) {
    return new NameExpr(nameExpr.listSExpr[1].listSExpr[1].value);
  }
  throw new Error("Unable to parse name expr: " + nameExpr);
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
