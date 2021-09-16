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
exports.SExprParse = SExprParse

class SExprBracket {
  constructor(sexpr) {
    if (!arguments.length) {
      this.listSExpr = [];
    } else {
      this.listSExpr = sexpr;
    }
  }
}
exports.SExprBracket = SExprBracket

class SExprParen {
  constructor(sexpr) {
    if (!arguments.length) {
      this.listSExpr = [];
    } else {
      this.listSExpr = sexpr;
    }
  }
}
exports.SExprParen = SExprParen

class Atom {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}
exports.Atom = Atom

class Module {
  constructor(exprStmt) {
    this.exprStmt = exprStmt
  }
}
exports.Module = Module

class ExprStamt {
  constructor(expr) {
    this.expr = expr
  }
}
exports.ExprStamt = ExprStamt

class BinOp {
  constructor(left, op, right) {
    this.left = left
    this.op = op
    this.right = right
  }
}
exports.BinOp = BinOp

class Operator {
  constructor(type) {
    this.type = type;
  }
}
exports.Operator = Operator

class UnaryOp {
  constructor(type) {
    this.type = type;
  }
}
exports.UnaryOp = UnaryOp
