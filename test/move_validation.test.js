/* eslint-disable no-undef */
const Game = require('../game_logic/chess.js')
const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('../game_logic/pieces.js')

const game = new Game()

const testMove = (board, move) => {
    if (game.playMove(board, move) !== false){
        return true
    }
    return false
}

// VALID PAWN MOVES
// test('it can validate a pawn moving one square', () => {
//     const testBoard = game.createStartPosition()
//     expect(testMove(testBoard, {
//         from: "e2",
//         to: "e3"
//     })).toBe(true)
// })

// test('it can validate a pawn moving two squares', () => {
//     const testBoard = game.createStartPosition()
//     expect(testMove(testBoard, {
//         from: "d2",
//         to: "d4"
//     })).toBe(true)   
// })

// test('it can validate a pawn capturing', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whitePawn)
//     game.placePiece(testBoard, "d5", blackPawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d5"
//     })).toBe(true)
// })

// // // test('it can validate a pawn capturing en passant', () => {
    
// // // })


// // //INVALID PAWN MOVES
// test('it can invalidate a pawn moving three squares', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e2", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e2",
//         to: "e5"
//     })).toBe(false)
// })

// test('it can invalidate a pawn capturing a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whitePawn)
//     game.placePiece(testBoard, "d5", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d5"
//     })).toBe(false)
// })

// test('it can invalidate a pawn moving backwards', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e2"
//     })).toBe(false)
// })

// test('it can invalidate a pawn moving diagonally (not capturing)', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d5"
//     })).toBe(false)
// })

// test('it can invalidate a pawn moving horizontally', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d4"
//     })).toBe(false)
// })

// // VALID KNIGHT MOVES
// test('it can validate a knight moving NorthOneEastTwo', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "c3"
//     })).toBe(true)
// })

// test('it can validate a knight moving NorthTwoEastOne', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d2"
//     })).toBe(true)
// })

// test('it can validate a knight moving SouthOneEastTwo', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "c5"
//     })).toBe(true)
// })

// test('it can validate a knight moving SouthTwoEastOne', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d6"
//     })).toBe(true)
// })

// test('it can validate a knight moving NorthOneWestTwo', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "g3"
//     })).toBe(true)
// })

// test('it can validate a knight moving NorthTwoWestOne', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "f2"
//     })).toBe(true)
// })

// test('it can validate a knight moving SouthOneWestTwo', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "g5"
//     })).toBe(true)
// })

// test('it can validate a knight moving SouthTwoWestOne', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "f6"
//     })).toBe(true)
// })

// test('it can validate a knight capturing enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     game.placePiece(testBoard, "f6", whiteKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "f6"
//     })).toBe(true)
// })

// // INVALID KNIGHT MOVES
// test('it can invalidate a knight capturing friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     game.placePiece(testBoard, "f6", blackRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "f6"
//     })).toBe(false)
// })

// test('it can invalidate a knight moving diagonally', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d5"
//     })).toBe(false)
// })

// test('it can invalidate a knight moving horizontally', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "d4"
//     })).toBe(false)
// })

// VALID BISHOP MOVES
// test('it can validate a bishop moving NorthEast', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b1"
//     })).toBe(true)
// })

// test('it can validate a bishop moving NorthWest', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "g2"
//     })).toBe(true)
// })

// test('it can validate a bishop moving SouthEast', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b7"
//     })).toBe(true)
// })

// test('it can validate a bishop moving SouthWest', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "g6"
//     })).toBe(true)
// })

// test('it can validate a bishop capturing an enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     game.placePiece(testBoard, "a8", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "a8"
//     })).toBe(true)
// })

// INVALID BISHOP MOVES
// test('it can invalidate a rook capturing a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     game.placePiece(testBoard, "a8", whiteRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "a8"
//     })).toBe(false)
// })

// test('it can invalidate a bishop jumping over a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     game.placePiece(testBoard, "b7", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "a8"
//     })).toBe(false)
// })

// test('it can invalidate a bishop jumping over an enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     game.placePiece(testBoard, "b7", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "a8"
//     })).toBe(false)
// })

// test('it can invalidate a bishop moving horizontally', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b4"
//     })).toBe(false)
// })

// VALID ROOK MOVES
// test('it can validate a rook moving North', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e1"
//     })).toBe(true)
// })

// test('it can validate a rook moving South', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e7"
//     })).toBe(true)
// })

// test('it can validate a rook moving East', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b4"
//     })).toBe(true)
// })

// test('it can validate a rook moving West', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "h4"
//     })).toBe(true)
// })

// test('it can validate a rook capturing an enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     game.placePiece(testBoard, "e8", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e8"
//     })).toBe(true)
// })

// // INVALID ROOK MOVES
// test('it can invalidate a rook capturing a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     game.placePiece(testBoard, "b4", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b4"
//     })).toBe(false)
// })

// test('it can invalidate a rook jumping over a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     game.placePiece(testBoard, "e5", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e6"
//     })).toBe(false)
// })

// test('it can invalidate a rook jumping over an enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     game.placePiece(testBoard, "e5", blackKnight)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e6"
//     })).toBe(false)
// })

// test('it can invalidate a rook moving diagonally', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "c6"
//     })).toBe(false)
// })

// // VALID QUEEN MOVES
// test('it can validate a queen moving NorthEast', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b1"
//     })).toBe(true)
// })

// test('it can validate a queen moving NorthWest', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "g2"
//     })).toBe(true)
// })

// test('it can validate a queen moving SouthEast', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b7"
//     })).toBe(true)
// })

// test('it can validate a queen moving SouthWest', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "g6"
//     })).toBe(true)
// })

// test('it can validate a queen moving North', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e1"
//     })).toBe(true)
// })

// test('it can validate a queen moving South', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e7"
//     })).toBe(true)
// })

// test('it can validate a queen moving East', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b4"
//     })).toBe(true)
// })

// test('it can validate a queen moving West', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "h4"
//     })).toBe(true)
// })

// test('it can validate a queen capturing an enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     game.placePiece(testBoard, "e8", whiteBishop)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e8"
//     })).toBe(true)
// })

// // INVALID QUEEN MOVES
// test('it can invalidate a queen capturing a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     game.placePiece(testBoard, "b4", blackRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b4"
//     })).toBe(false)
// })

// test('it can invalidate a queen jumping over an enemy piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     game.placePiece(testBoard, "e5", whitePawn)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e6"
//     })).toBe(false)
// })

// test('it can invalidate a queen jumping over a friendly piece', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", blackQueen)
//     game.placePiece(testBoard, "e5", blackRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "e6"
//     })).toBe(false)
// })

// VALID KING MOVES
test('it can validate a king moving NorthEast', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "d3"
    })).toBe(true)
})

test('it can validate a king moving NorthWest', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "f3"
    })).toBe(true)
})

test('it can validate a king moving SouthEast', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "d5"
    })).toBe(true)
})

test('it can validate a king moving SouthWest', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "f5"
    })).toBe(true)
})

test('it can validate a king moving North', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "e3"
    })).toBe(true)
})

test('it can validate a king moving South', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "e5"
    })).toBe(true)
})

test('it can validate a king moving East', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "d4"
    })).toBe(true)
})

test('it can validate a king moving West', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    expect(testMove(testBoard, {
        from: "e4",
        to: "f4"
    })).toBe(true)
})

test('it can validate a king capturing an enemy piece', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    game.placePiece(testBoard, "e5", blackRook)
    expect(testMove(testBoard, {
        from: "e4",
        to: "e5"
    })).toBe(true)
})

// INVALID KING MOVES
test('it can invalidate a king capturing a friendly piece', () => {
    const testBoard = game.createEmptyBoard()
    game.placePiece(testBoard, "e4", whiteKing)
    game.placePiece(testBoard, "e5", whiteRook)
    expect(testMove(testBoard, {
        from: "e4",
        to: "e5"
    })).toBe(false)
})

// test('it can invalidate a king moving into check', () => {
//     const testBoard = game.createEmptyBoard()
//     game.placePiece(testBoard, "e4", whiteKing)
//     game.placePiece(testBoard, "b4", blackRook)
//     expect(testMove(testBoard, {
//         from: "e4",
//         to: "b4"
//     })).toBe(false)
// })