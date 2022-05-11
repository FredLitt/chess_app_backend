const pieces = require('./pieces.js')

class Game {
    constructor(){
        this.turn = 0
    }

    createEmptyBoard(){
        const board = []
        for (let row = 0; row < 8; row ++){
            const boardRow = []
            for (let col = 0; col < 8; col++){
                const square = {
                    piece: null,
                    coordinate: [row, col]
                }
                boardRow.push(square)
            }
            board.push(boardRow)
        }
        return board
    }
    
    createStartPosition(){
        const board = this.createEmptyBoard()
        for (let i = 0; i < 8; i++){
            board[1][i].piece = pieces.whitePawn
            board[6][i].piece = pieces.blackPawn
          }
          board[0][0].piece = pieces.whiteRook
          board[0][1].piece = pieces.whiteKnight
          board[0][2].piece = pieces.whiteBishop
          board[0][3].piece = pieces.whiteKing
          board[0][4].piece = pieces.whiteQueen
          board[0][5].piece = pieces.whiteBishop
          board[0][6].piece = pieces.whiteKnight
          board[0][7].piece = pieces.whiteRook

          board[7][0].piece = pieces.blackRook
          board[7][1].piece = pieces.blackKnight
          board[7][2].piece = pieces.blackBishop
          board[7][3].piece = pieces.blackKing
          board[7][4].piece = pieces.blackQueen
          board[7][5].piece = pieces.blackBishop
          board[7][6].piece = pieces.blackKnight
          board[7][7].piece = pieces.blackRook
          return board
        }

    createBoardFromMoveHistory(moveHistory){
        const startingBoard = this.createStartPosition()
    }

    playMove(boardPosition, move){
        // boardPosition = 2d array of squares
        // move includes: piece, fromSquare, toSquare
        const movingPiece = move.piece
        const [ fromRow, fromCol ] = move.fromSquare
        const [ toRow, toCol ] = move.toSquare
        boardPosition[fromRow][fromCol].piece = null
        boardPosition[toRow][toCol].piece = movingPiece
        return boardPosition
    }
}

const game = new Game()

const move = {
    piece: pieces.whitePawn,
    fromSquare: [3, 3],
    toSquare: [3, 5]
}

const board = game.createStartPosition()

game.playMove(board, move)

module.exports = Game
