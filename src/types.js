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
  constructor(exprStmt) {
    this.exprStmt = exprStmt;
  }
}
exports.Module = Module;

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
