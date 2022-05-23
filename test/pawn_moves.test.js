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
    expect(testMove(startingPosition, {
        from: "e2",
        to: "e3"
    })).toBe(true)
})

test('it can validate a pawn moving two squares', () => {
    expect(testMove(startingPosition, {
        from: "e2",
        to: "e4"
    })).toBe(true)   
})

test('it can validate a pawn capturing', () => {
    game.placePiece(emptyBoard, "e4", whitePawn)
    game.placePiece(emptyBoard, "d5", blackPawn)
    expect(testMove(emptyBoard, {
        from: "e4",
        to: "d5"
    })).toBe(true)
})

// // test('it can validate a pawn capturing en passant', () => {
    
// // })


// //INVALID PAWN MOVES
test('it can invalidate a pawn moving three squares', () => {
    game.placePiece(emptyBoard, "e2", whitePawn)
    expect(testMove(emptyBoard, {
        from: "e2",
        to: "e5"
    })).toBe(false)
})

test('it can invalidate a pawn capturing a friendly piece', () => {
    game.placePiece(emptyBoard, "e4", whitePawn)
    game.placePiece(emptyBoard, "d5", whitePawn)
    expect(testMove(emptyBoard, {
        from: "e4",
        to: "d5"
    })).toBe(false)
})

test('it can invalidate a pawn moving backwards', () => {
    game.placePiece(emptyBoard, "e4", whitePawn)
    expect(testMove(emptyBoard, {
        from: "e4",
        to: "e2"
    })).toBe(false)
})

// test('it can invalidate a pawn moving diagonally (not capturing)', () => {
    
// })

// test('it can invalidate a pawn moving horizontally', () => {
    
// })
