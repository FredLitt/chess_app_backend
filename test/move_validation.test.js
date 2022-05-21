/* eslint-disable no-undef */
const Game = require('../game_logic/chess.js')
const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('../game_logic/pieces.js')

const game = new Game()
const startingPosition = game.createStartPosition()
const emptyBoard = game.createEmptyBoard()

const testMove = (board, move) => {
    if (game.playMove(board, move) !== false){
        return true
    }
    return false
}

// VALID PAWN MOVES
test('it can validate a pawn moving one square', () => {
    expect(testMove(game.createStartPosition(), {
        fromSquare: [1, 3],
        toSquare: [2, 3]
    })).toBe(true)
})

test('it can validate a pawn moving two squares', () => {
    expect(testMove(startingPosition, {
        fromSquare: [1, 3],
        toSquare: [3, 3]
    })).toBe(true)   
})

test('it can validate a pawn capturing', () => {
    emptyBoard[1][1].piece = whitePawn
    emptyBoard[2][2].piece = blackPawn
    expect(testMove(emptyBoard, {
        fromSquare: [1, 1],
        toSquare: [2, 2]
    })).toBe(true)
})

// test('it can validate a pawn capturing en passant', () => {
    
// })


// //INVALID PAWN MOVES
test('it can invalidate a pawn moving three squares', () => {
    emptyBoard[1][1].piece = whitePawn
    expect(testMove(emptyBoard, {
        fromSquare: [1, 1],
        toSquare: [4, 1]
    })).toBe(false)
})

test('it can invalidate a pawn capturing a friendly piece', () => {
    emptyBoard[1][1].piece = whitePawn
    emptyBoard[2][2].piece = whiteKnight
    expect(testMove(emptyBoard, {
        fromSquare: [1, 1],
        toSquare: [4, 1]
    })).toBe(false)
})

test('it can invalidate a pawn moving backwards', () => {
    emptyBoard[3][3].piece = whitePawn
    expect(testMove(emptyBoard, {
        fromSquare: [3, 3],
        toSquare: [2, 3]
    })).toBe(false)
})

// test('it can invalidate a pawn moving diagonally (not capturing)', () => {
    
// })

// test('it can invalidate a pawn moving horizontally', () => {
    
// })
