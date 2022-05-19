const pieces = require('./pieces.js')
const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = pieces

// Idea for chess logic refactor:
// No need to store captured pieces, turnNumber, or other mutable data...
// Instead just ascertain these things when needed from a move history, 
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

    isSquareOccupied(board, square){
        const [ row, col ] = square
        if (board[row][col].piece === null){
            return false
        }
        return true
    }

    // With a given board and move, returns true if legal move, else false
    isMoveLegal(board, move){
        
        if (move.piece.type === "pawn"){
            return this.validatePawnMove(board, move)
        }
        if (move.piece.type === "knight"){
            return this.validateKnightMove(board, move)
        }
        if (move.piece.type === "bishop"){
            return this.validateBishopMove(board, move)
        }
        if (move.piece.type === "rook"){
            return this.validateRookMove(board, move)
        }
        if (move.piece.type === "queen"){
            return this.validateQueenMove(board, move)
        }
        if (move.piece.type === "king"){
            return this.validateKingMove(board, move)
        }
    }

    validatePawnMove(board, move){
        console.log("checking pawn move")
        let pawnMoves
        const [ fromRow, fromCol ] = move.fromSquare 
        const [ toRow, toCol ] = move.toSquare
        
        if (move.piece.color === "white"){
            pawnMoves = {
                "ForwardOne": [ fromRow + 1, fromCol ],
                "ForwardTwo": [ fromRow + 2, fromCol ],
                "CaptureWest": [ fromRow + 1, fromCol - 1 ],
                "CaptureEast": [ fromRow + 1, fromCol + 1 ]
              }
        } else {
            pawnMoves = {
                "ForwardOne": [ fromRow - 1, fromCol ],
                "ForwardTwo": [ fromRow - 2, fromCol ],
                "CaptureWest": [ fromRow - 1, fromCol + 1 ],
                "CaptureEast": [ fromRow - 1, fromCol - 1 ]
            }
        }
    
        const legalMoves = []

        // Rather than deleting pawnMoves, maybe try adding the moves that are legal?
        // Also need to make sure that kings are not getting exposed or left in check
        for (const move in pawnMoves){
            if (move === "ForwardOne"){
                const pawnIsBlocked = this.isSquareOccupied(board, pawnMoves["ForwardOne"])
                if (!pawnIsBlocked){
                    legalMoves.push(pawnMoves["ForwardOne"])
                }
            }

            if (move === "ForwardTwo"){
                const pawnIsBlocked = 
                    this.isSquareOccupied(board, pawnMoves["ForwardOne"]) || this.isSquareOccupied(board, pawnMoves["ForwardTwo"])
                if (!pawnIsBlocked){
                    legalMoves.push(pawnMoves["ForwardTwo"])
                }
            }
        }

        console.log("legal moves", legalMoves)

        //const moveIsLegal = legalMoves.some(move => (move[0] === toRow && move[1] === toCol))
        const moveIsLegal = legalMoves.some(legalMove => (this.squaresAreTheSame(legalMove, move.toSquare)))
        
        console.log("is move legal?", moveIsLegal)
    
        if (moveIsLegal){
            return true
        } 
        return false
    }

    squaresAreTheSame(square1, square2){
        if (square1[0] === square2[0] && square1[1] === square2[1]){
            return true
        }
        return false
    }

    // validateKnightMove(board, move){

    // }

    // validateBishopMove(board, move){

    // }

    // validateRookMove(board, move){

    // }

    // validateQueenMove(board, move){

    // }

    // validateKingMove(board, move){

    // }

    // Returns updated board if move is legal and original board if not legal
    playMove(board, move){

        if (!this.isMoveLegal(board, move)){
            return false
        }
        console.log("playing the move", move)
        const movingPiece = move.piece
        const [ fromRow, fromCol ] = move.fromSquare
        const [ toRow, toCol ] = move.toSquare
        board[fromRow][fromCol].piece = null
        board[toRow][toCol].piece = movingPiece
        return board
    }
}

const move = {
    piece: whitePawn,
    fromSquare: [1, 3],
    toSquare: [2, 3]
}
const game = new Game()
const board = game.createStartPosition()
game.playMove(board, move)

module.exports = Game
