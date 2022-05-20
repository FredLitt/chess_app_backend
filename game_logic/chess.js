const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('./pieces.js')

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
        const movingPiece = this.getPieceAtSquare(board, move.fromSquare)

        if (movingPiece === null){
            return false
        }
        
        if (movingPiece === "pawn"){
            return this.validatePawnMove(board, move)
        }
        if (movingPiece === "knight"){
            return this.validateKnightMove(board, move)
        }
        if (movingPiece === "bishop"){
            return this.validateBishopMove(board, move)
        }
        if (movingPiece === "rook"){
            return this.validateRookMove(board, move)
        }
        if (movingPiece === "queen"){
            return this.validateQueenMove(board, move)
        }
        if (movingPiece === "king"){
            return this.validateKingMove(board, move)
        }
    }

    validatePawnMove(board, move){
        console.log("checking pawn move")
        let pawnMoves
        const [ fromCol, fromRow ] = move.fromSquare
        const movingPawnColor = board[fromCol][fromRow].piece.color
        
        if (movingPawnColor === "white"){
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

        for (const move in pawnMoves){

            const moveisLegal = this.isSquareOnBoard(board, pawnMoves[move])

            if (!moveisLegal){ continue }

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

            if (move === "CaptureEast" || move === "CaptureWest"){ 
                let squareHasEnemyPiece
                const captureSquareHasPiece = this.isSquareOccupied(board, pawnMoves[move])
                if (captureSquareHasPiece){
                    if (movingPawnColor !== this.getPiecesColor(board, pawnMoves[move])){
                        squareHasEnemyPiece = true
                    }
                }
                
                if (squareHasEnemyPiece){
                    legalMoves.push(pawnMoves[move])
                }
            }
        }

        console.log("legal moves", legalMoves)

        const moveIsLegal = legalMoves.some(legalMove => (this.squaresAreTheSame(legalMove, move.toSquare)))
        
        console.log("is move legal?", moveIsLegal)
    
        if (moveIsLegal){
            return true
        } 
        return false
    }

    getPiecesColor(board, square){
        const [ col, row ] = square
        if (board[row][col].piece === null){
            return undefined
        }   
        return board[row][col].piece.color
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
        const [ fromCol, fromRow ] = move.fromSquare
        const [ toCol, toRow ] = move.toSquare
        const movingPiece = board[fromCol][fromRow].piece
        board[fromCol][fromRow].piece = null
        board[toCol][toRow].piece = movingPiece
        return board
    }

    isSquareOnBoard(square){
        const [ col, row ] = square
        if (col > 7 || col < 0 || row > 7 || row > 0){
            return false
        }
        return true
    }

    squaresAreTheSame(square1, square2){
        if (square1[0] === square2[0] && square1[1] === square2[1]){
            return true
        }
        return false
    }

    getPieceAtSquare(board, square){
        const [ row, col ] = square
        if (board[row][col].piece === null){
            return null
        }
        return board[row][col].piece
    }
}

const move = {
    fromSquare: [1, 3],
    toSquare: [2, 3]
}

const game = new Game()
const board = game.createStartPosition()
game.playMove(board, move)

module.exports = Game
