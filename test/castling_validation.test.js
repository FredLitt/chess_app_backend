/* eslint-disable no-undef */
const Game = require('../game_logic/chess.js')
const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('../game_logic/pieces.js')

const game = new Game()

test('it can validate a white king castling kingside', () => {
    const board = game.placePieces([{ piece: whiteKing, squares: "e1"}, {piece: whiteRook, squares: "h1"}])
    game.printBoard(board)
    game.isCastlingLegal(board, "white", "kingside")
    expect(game.playMove(board, {
        from: "e1",
        to: "g1"
    })).toBe(!false)
})

test('it can validate a white king castling queenside', () => {
    const board = game.placePieces([{ piece: whiteKing, squares: "e1"}, {piece: whiteRook, squares: "h1"}])
    game.printBoard(board)
    console.log(game.isCastlingLegal(board, "white", "kingside"))
    expect(game.playMove(board, {
        from: "e1",
        to: "g1"
    })).toBe(!false)
})

test('it can invalidate a white king castling kingside through check', () => {
    const board = game.placePieces([{ piece: whiteKing, squares: "e1"}, {piece: whiteRook, squares: "h1"}, {piece: blackRook, squares: "g8"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e1",
        to: "g1"
    })).toBe(false)
})

test('it can invalidate a white king castling kingside out of check', () => {
    const board = game.placePieces([{ piece: whiteKing, squares: "e1"}, {piece: whiteRook, squares: "h1"}, {piece: blackRook, squares: "e8"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e1",
        to: "g1"
    })).toBe(false)
})

test('it can invalidate a white king castling queenside through check', () => {
    const board = game.placePieces([{ piece: whiteKing, squares: "e1"}, {piece: whiteRook, squares: "c1"}, {piece: blackRook, squares: "d8"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e1",
        to: "g1"
    })).toBe(false)
})

test('it can invalidate a white king castling queenside out of check', () => {
    const board = game.placePieces([{ piece: whiteKing, squares: "e1"}, {piece: whiteRook, squares: "a1"}, {piece: blackRook, squares: "e8"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e1",
        to: "c1"
    })).toBe(false)
})

test('it can invalidate a black king castling kingside through check', () => {
    const board = game.placePieces([{ piece: blackKing, squares: "e8"}, {piece: blackRook, squares: "h8"}, {piece: whiteRook, squares: "f1"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e8",
        to: "c8"
    })).toBe(false)
})

test('it can invalidate a black king castling kingside out of check', () => {
    const board = game.placePieces([{ piece: blackKing, squares: "e8"}, {piece: blackRook, squares: "h8"}, {piece: whiteRook, squares: "e1"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e8",
        to: "c8"
    })).toBe(false)
})

test('it can invalidate a black king castling queenside out of check', () => {
    const board = game.placePieces([{ piece: blackKing, squares: "e8"}, {piece: blackRook, squares: "a8"}, {piece: whiteRook, squares: "e1"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e8",
        to: "g8"
    })).toBe(false)
})

test('it can invalidate a black king castling queenside through check', () => {
    const board = game.placePieces([{ piece: blackKing, squares: "e8"}, {piece: blackRook, squares: "a8"}, {piece: whiteRook, squares: "d1"}])
    game.printBoard(board)
    expect(game.playMove(board, {
        from: "e8",
        to: "c8"
    })).toBe(false)
})
