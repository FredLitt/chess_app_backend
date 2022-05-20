/* eslint-disable no-undef */
const Game = require('../game_logic/chess.js')
const pieces = require('../game_logic/pieces.js')
const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = pieces

const game = new Game()

const testMove = (board, move) => {
    if (game.playMove(board, move) !== false){
        return true
    }
    return false
}

// VALID PAWN MOVES
test('it can validate a pawn moving one square', () => {
    expect(testMove(game.createStartPosition(), {
        piece: whitePawn,
        fromSquare: [1, 3],
        toSquare: [2, 3]
    })).toBe(true)
})

test('it can validate a pawn moving two squares', () => {
    expect(testMove(game.createStartPosition(), {
        piece: whitePawn,
        fromSquare: [1, 3],
        toSquare: [3, 3]
    })).toBe(true)   
})

test('it can validate a pawn capturing', () => {
    const testBoard = game.createEmptyBoard()
    testBoard[1][1].piece = pieces.whitePawn
    testBoard[2][2].piece = pieces.blackPawn
    expect(testMove(testBoard, {
        piece: whitePawn,
        fromSquare: [1, 1],
        toSquare: [2, 2]
    })).toBe(true)
})

// test('it can validate a pawn capturing en passant', () => {
    
// })


// //INVALID PAWN MOVES
// test('it can invalidate a pawn moving three squares', () => {
    
// })

// test('it can invalidate a pawn moving backwards', () => {
    
// })

// test('it can invalidate a pawn moving diagonally (not capturing)', () => {
    
// })

// test('it can invalidate a pawn moving horizontally', () => {
    
// })
