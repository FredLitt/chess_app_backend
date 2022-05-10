const pieces = {}

class King {
    constructor(color) {
      this.type = "king"
      this.color = color
    }
}

class Queen {
    constructor(color) {
      this.type = "queen"
      this.color = color
    }
}

class Rook {
    constructor(color) {
      this.type = "rook"
      this.color = color
    }
}

class Bishop {
    constructor(color) {
      this.type = "bishop"
      this.color = color
    }
}

class Knight {
    constructor(color) {
      this.type = "knight"
      this.color = color
    }
}

class Pawn {
    constructor(color) {
      this.type = "pawn"
      this.color = color
    }
}

const whitePawn = new Pawn("white")
const whiteKnight = new Knight("white")
const whiteBishop = new Bishop("white")
const whiteRook = new Rook("white")
const whiteQueen = new Queen("white")
const whiteKing = new King("white")

const blackPawn = new Pawn("black")
const blackKnight = new Knight("black")
const blackBishop = new Bishop("black")
const blackRook = new Rook("black")
const blackQueen = new Queen("black")
const blackKing = new King("black")

pieces.whitePawn = whitePawn
pieces.whiteKnight = whiteKnight
pieces.whiteBishop = whiteBishop
pieces.whiteRook = whiteRook
pieces.whiteQueen = whiteQueen
pieces.whiteKing = whiteKing

pieces.blackPawn = blackPawn
pieces.blackKnight = blackKnight
pieces.blackBishop = blackBishop
pieces.blackRook = blackRook
pieces.blackQueen = blackQueen
pieces.blackKing = blackKing

module.exports = pieces
