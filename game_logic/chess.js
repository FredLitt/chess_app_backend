const pieces = require('./pieces.js')
const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = pieces

// Idea for chess logic refactor:
// No need to store captured pieces, turnNumber, or other mutable data...
// Instead just ascertain all of these things when needed from a move history, 
// this obviates unnecessary data storage

class Game {
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
            board[1][i].piece = whitePawn
            board[6][i].piece = blackPawn
          }
          board[0][0].piece = whiteRook
          board[0][1].piece = whiteKnight
          board[0][2].piece = whiteBishop
          board[0][3].piece = whiteKing
          board[0][4].piece = whiteQueen
          board[0][5].piece = whiteBishop
          board[0][6].piece = whiteKnight
          board[0][7].piece = whiteRook

          board[7][0].piece = blackRook
          board[7][1].piece = blackKnight
          board[7][2].piece = blackBishop
          board[7][3].piece = blackKing
          board[7][4].piece = blackQueen
          board[7][5].piece = blackBishop
          board[7][6].piece = blackKnight
          board[7][7].piece = blackRook
          return board
        }

    createBoardFromMoveHistory(moveHistory){
        const board = this.createStartPosition()
        for (let i = 0; i < moveHistory.length; i++){
            this.playMove(board, moveHistory[i])
        }
        return board
    }

    playMove(boardPosition, move){
        const movingPiece = move.piece
        const [ fromRow, fromCol ] = move.fromSquare
        const [ toRow, toCol ] = move.toSquare
        boardPosition[fromRow][fromCol].piece = null
        boardPosition[toRow][toCol].piece = movingPiece
        return boardPosition
    }
}

const game = new Game()

module.exports = Game
