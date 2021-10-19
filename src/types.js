class SExprParse {
  constructor(paren, listSExpr) {
    if (!arguments.length) {
      this.paren = null;
      this.listSExpr = [];
    } else {
      this.paren = paren;
      this.listSExpr = listSExpr;
    }
  }
}
exports.SExprParse = SExprParse;

class SExprBracket {
  constructor(sexpr) {
    if (!arguments.length) {
      this.listSExpr = [];
    } else {
      this.listSExpr = sexpr;
    }
  }
}
exports.SExprBracket = SExprBracket;

class SExprParen {
  constructor(sexpr) {
    if (!arguments.length) {
      this.listSExpr = [];
    } else {
      this.listSExpr = sexpr;
    }
  }
}
exports.SExprParen = SExprParen;

class Atom {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
exports.Atom = Atom;

class SurfaceAST {
  constructor(module) {
    this.module = module;
  }
}
exports.SurfaceAST = SurfaceAST;

class CoreAST {
  constructor(module) {
    this.module = module;
  }
}
exports.CoreAST = CoreAST;

class Module {
  constructor(body) {
    this.body = body;
  }
}
exports.Module = Module;

class Body {
  constructor(exprStmt, fundef) {
    this.exprStmt = exprStmt;
    this.fundef = fundef;
  }
}
exports.Body = Body;

class ExprStamt {
  constructor(expr) {
    this.expr = expr;
  }
}
exports.ExprStamt = ExprStamt;

class BinOp {
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}
exports.BinOp = BinOp;

class UnaryOp {
  constructor(op, operand) {
    this.op = op;
    this.operand = operand;
  }
}
exports.UnaryOp = UnaryOp;

class Constant {
  constructor(value, kind) {
    this.value = value;
    this.kind = kind;
  }
}
exports.Constant = Constant;

class Operator {
  constructor(type) {
    this.type = type;
  }
}
exports.Operator = Operator;

class UnaryOperator {
  constructor(type) {
    this.type = type;
  }
}
exports.UnaryOperator = UnaryOperator;

class Fundef {
  constructor(id, args, fundefs, returnStmt) {
    this.name = id;
    this.arguments = args;
    this.funDefs = fundefs;
    this.returnStmt = returnStmt;
  }
}
exports.Fundef = Fundef;

class Arguments {
  constructor(args) {
    this.args = args;
  }
}
exports.Arguments = Arguments;

class Arg {
  constructor(id) {
    this.identifier = id;
  }
}
exports.Arg = Arg;

class ReturnStmt {
  constructor(expr) {
    this.expr = expr;
  }
}
exports.ReturnStmt = ReturnStmt;

class Call {
  constructor(expr, args) {
    this.func = expr;
    this.args = args;
  }
}
exports.Call = Call;

class Lambda {
  constructor(args, body) {
    this.args = args;
    this.body = body;
  }
}
exports.Lambda = Lambda;

class Name {
  constructor(identifier) {
    this.identifier = identifier;
  }
}
exports.Name = Name;

class Store {
  constructor(store) {
    this.store = store;
  }
}
exports.Store = Store;
