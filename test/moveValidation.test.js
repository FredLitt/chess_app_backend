/* eslint-disable no-undef */
const Game = require('../game_logic/chess.js')
const { whitePawn } = require('../game_logic/pieces.js')

// VALID PAWN MOVES
test('it can validate a pawn moving one square', () => {
    const move = {
        piece: whitePawn,
        fromSquare: [1, 3],
        toSquare: [2, 3]
    }
    const game = new Game()
    const board = game.createStartPosition()
    expect(game.playMove(board, move)).toBe(true)
})

// test('it can validate a pawn moving two squares', () => {
    
// })

// test('it can validate a pawn capturing', () => {
    
// })

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
