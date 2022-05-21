const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('./pieces.js')

// Idea for chess logic refactor:
// No need to store captured pieces, turnNumber, or other mutable data...
// Instead just ascertain these things when needed from a move history, 
// this obviates unnecessary data storage

class Game {
    createEmptyBoard(){
        const board = []
        const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
        for (let y = 1; y <= 8; y ++){
            const boardRow = []
            board.push(boardRow)
            for (let x = 0; x < 8; x++){
                const square = {
                    piece: null,
                    coordinate: `${xAxis[x]}${y}`
                }
                boardRow.push(square)
            }
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
        const movingPiece = this.getPieceAtSquare(board, move.fromSquare).type
        if (movingPiece === null){
            return false
        } 
        if (movingPiece === "pawn"){
            console.log("moving piece is pawn")
            const pawnMoves = this.getPawnMoves(board, move.fromSquare)
            console.log("pawn moves:", pawnMoves)
            return pawnMoves.some(pawnMove => this.squaresAreTheSame(pawnMove, move.toSquare))
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

    getPawnMoves(board, pawnsSquare){
        console.log("finding pawn moves")
        let pawnMoves
        let pawnStartSquare
        const [ fromRow, fromCol ] = pawnsSquare
        const movingPawnColor = board[fromRow][fromCol].piece.color
        
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
            console.log("is move legal?", moveisLegal)
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
        console.log(legalMoves)
        return legalMoves
    }

    getPiecesColor(board, square){
        const [ row, col ] = square
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
            console.log("not a legal move")
            return false
        }
        console.log("playing the move", move)
        const [ fromRow, fromCol ] = move.fromSquare
        const [ toRow, toCol ] = move.toSquare
        const movingPiece = board[fromRow][fromCol].piece
        board[fromRow][fromCol].piece = null
        board[toRow][toCol].piece = movingPiece
        return board
    }

    isSquareOnBoard(square){
        const [ row, col ] = square
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
            console.log("no piece")
            return null
        }
        console.log("piece is:", board[row][col].piece)
        return board[row][col].piece
    }

    getSquare(board, coordinates){
        const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
        const row = parseInt(coordinates[1]-1)
        const col = xAxis.indexOf(coordinates[0])
        return board[row][col]
    }

    placePiece(board, coordinates, piece){
        const indices = this.coordinatesToIndices(coordinates)
        const [ row, col ] = indices
        board[row][col].piece = piece
        return board
    }

    coordinatesToIndices(coordinates){
        // Takes in algebraic notation string and returns [ y, x ] 
        const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
        const row = parseInt(coordinates[1]-1)
        const col = xAxis.indexOf(coordinates[0])
        console.log(row, col)
        return [ row, col ]
    }
}

// Would be nice to have a move be
// const move = {
//      from: "e4",
//      to: "e5"   
// }

const game = new Game()
const board = game.createStartPosition()
const newBoard = game.placePiece(board, "e4", whiteKnight)

module.exports = Game
