const AtomParser = require("../../s-expr-parser").AtomParser

function TestParser() {
  let res = AtomParser(45, 0)
  if (res !== 45) {
    console.log("Failed Number test: " + res )
  }

  res = AtomParser("\"Hello World\"", 1)
  if (res !== "Hello World") {
    console.log("Failed String test: " + res )
  }

  res = AtomParser("#f", 0)
  if (res !== "#f") {
    console.log("Failed #f test: " + res )
  }

  res = AtomParser("Hello_This_Stuff", 0)
  if (res !== "Hello World") {
    console.log("Failed String test: " + res )
  }
}

TestParser()