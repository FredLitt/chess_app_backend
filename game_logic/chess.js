const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('./pieces.js')

// Idea for chess logic refactor:
// No need to store captured pieces, turnNumber, or other mutable data...
// Instead just ascertain these things when needed from a move history, 
// this obviates unnecessary data storage

class Game {
    constructor(){
        this.xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
    }
    createEmptyBoard(){
        const board = []
        for (let y = 1; y <= 8; y ++){
            const boardRow = []
            board.push(boardRow)
            for (let x = 0; x < 8; x++){
                const square = {
                    piece: null,
                    coordinate: `${this.xAxis[x]}${y}`
                }
                boardRow.push(square)
            }
        }
        return board
    }
    
    createStartPosition(){
        const board = this.createEmptyBoard()
        for (let i = 0; i < 8; i++){
            this.placePiece(board, `${this.xAxis[i]}${2}`, whitePawn)
            this.placePiece(board, `${this.xAxis[i]}${7}`, blackPawn)
          }
        this.placePiece(board, "a1", whiteRook)
        this.placePiece(board, "b1", whiteKnight)
        this.placePiece(board, "c1", whiteBishop)
        this.placePiece(board, "d1", whiteQueen)
        this.placePiece(board, "e1", whiteKing)
        this.placePiece(board, "f1", whiteBishop)
        this.placePiece(board, "g1", whiteKnight)
        this.placePiece(board, "h1", whiteRook)

        this.placePiece(board, "a8", blackRook)
        this.placePiece(board, "b8", blackKnight)
        this.placePiece(board, "c8", blackBishop)
        this.placePiece(board, "d8", blackQueen)
        this.placePiece(board, "e8", blackKing)
        this.placePiece(board, "f8", blackBishop)
        this.placePiece(board, "g8", blackKnight)
        this.placePiece(board, "h8", blackRook)
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
        const [ row, col ] = this.coordinatesToIndices(square)
        if (board[row][col].piece === null){
            return false
        }
        return true
    }

    // With a given board and move, returns true if legal move, else false
    isMoveLegal(board, move){
        const movingPiece = this.getPieceAtSquare(board, move.from).type
        console.log("moving piece:", movingPiece)
        if (movingPiece === null){
            console.log("no piece on this square")
            return false
        } 
        let legalMoves
        if (movingPiece === "pawn"){ legalMoves = this.getPawnMoves(board, move.from) }
        if (movingPiece === "knight"){ legalMoves = this.getKnightMoves(board, move.from) }
        // if (movingPiece === "bishop"){ legalMoves = this.getBishopMoves(board, move.from) }
        // if (movingPiece === "rook"){ legalMoves = this.getRookMoves(board, move.from) }
        // if (movingPiece === "queen"){ legalMoves = this.getQueenMoves(board, move.from) }
        // if (movingPiece === "king"){ legalMoves = this.getKingMoves(board, move.from) }
        return legalMoves.some(legalMove => this.movesAreTheSame(legalMove, move))
    }

    movesAreTheSame(move1, move2){
        if (move1.from === move2.from && move1.to === move2.to){
            return true
        }
        return false
    }

    getKnightMoves(board, knightsSquare){
        const knightMoves = {
            "NorthOneEastTwo": [fromRow - 1, fromCol + 2],
            "NorthTwoEastOne": [fromRow - 2, fromCol + 1],
            "SouthOneEastTwo": [fromRow + 1, fromCol + 2],
            "SouthTwoEastOne": [fromRow + 2, fromCol + 1],
            "NorthOneWestTwo": [fromRow - 1, fromCol - 2],
            "NorthTwoWestOne": [fromRow - 2, fromCol - 1],
            "SouthOneWestTwo": [fromRow + 1, fromCol - 2],
            "SouthTwoWestOne": [fromRow + 2, fromCol - 1]
          }

        let legalMoves = []

        return legalMoves
    }

    getPawnMoves(board, pawnsSquare){
        console.log("finding pawn moves")
        let pawnsStartingRow
        let pawnMoves
        const [ fromRow, fromCol ] = this.coordinatesToIndices(pawnsSquare)
        const movingPawnColor = this.getPiecesColor(board, pawnsSquare)
        if (movingPawnColor === "white"){
            pawnsStartingRow = 1
            pawnMoves = {
                "ForwardOne": [ fromRow + 1, fromCol ],
                "ForwardTwo": [ fromRow + 2, fromCol ],
                "CaptureWest": [ fromRow + 1, fromCol - 1 ],
                "CaptureEast": [ fromRow + 1, fromCol + 1 ]
              }
        } else {
            pawnsStartingRow = 6
            pawnMoves = {
                "ForwardOne": [ fromRow - 1, fromCol ],
                "ForwardTwo": [ fromRow - 2, fromCol ],
                "CaptureWest": [ fromRow - 1, fromCol + 1 ],
                "CaptureEast": [ fromRow - 1, fromCol - 1 ]
            }
        }
    
        const legalMoves = []

        for (const move in pawnMoves){
            const moveCoordinates = this.indicesToCoordinates(pawnMoves[move])
            
            const targetSquareExists = this.isSquareOnBoard(moveCoordinates)
            if (!targetSquareExists){ continue }

            if (move === "ForwardOne"){
                const pawnIsBlocked = this.isSquareOccupied(board, moveCoordinates)
                if (!pawnIsBlocked){
                    legalMoves.push(this.buildMove(pawnsSquare, moveCoordinates))
                }
            }

            if (move === "ForwardTwo"){
                const pawnIsBlocked = 
                    this.isSquareOccupied(board, this.indicesToCoordinates(pawnMoves["ForwardOne"])) || this.isSquareOccupied(board, moveCoordinates)
                const pawnHasMoved = pawnsStartingRow !== fromRow
                if (!pawnIsBlocked && !pawnHasMoved){
                    legalMoves.push(this.buildMove(pawnsSquare, moveCoordinates))
                }
            }

            if (move === "CaptureEast" || move === "CaptureWest"){ 
                // let squareHasEnemyPiece
                // const captureSquareHasPiece = this.isSquareOccupied(board, moveCoordinates)
                const captureSquareHasEnemyPiece = (this.getPiecesColor(board, moveCoordinates) !== undefined && this.getPiecesColor(board, moveCoordinates) !== movingPawnColor)
                //const enPassantIsLegal = this.isEnPassantLegal()
                // if (captureSquareHasPiece){
                //     if (movingPawnColor !== this.getPiecesColor(board, moveCoordinates)){
                //         squareHasEnemyPiece = true
                //     }
                // }
                
                if (captureSquareHasEnemyPiece){
                    legalMoves.push(this.buildMove(pawnsSquare, moveCoordinates))
                }
            }
        }
        return legalMoves
    }

    buildMove(fromSquare, toSquare){
        return { from: fromSquare, to: toSquare }
    }

    getPiecesColor(board, square){
        const [ row, col ] = this.coordinatesToIndices(square)
        if (board[row][col].piece === null){
            return undefined
        }   
        return board[row][col].piece.color
    }

    // Returns updated board if move is legal and original board if not legal
    playMove(board, move){
        if (!this.isMoveLegal(board, move)){
            console.log("not a legal move")
            return false
        }
        console.log("playing the move", move)
        const [ fromRow, fromCol ] = this.coordinatesToIndices(move.from)
        const [ toRow, toCol ] = this.coordinatesToIndices(move.to)
        const movingPiece = board[fromRow][fromCol].piece
        board[fromRow][fromCol].piece = null
        board[toRow][toCol].piece = movingPiece
        return board
    }

    isSquareOnBoard(square){
        const [ row, col ] = this.coordinatesToIndices(square)  
        if (col > 7 || col < 0 || row > 7 || row < 0){
            return false
        }
        return true
    }

    isKingAttacked(board){
        //return white, black or false
    }

    squaresAreTheSame(square1, square2){
        console.log("square 1:", square1, "square 2:", square2)
        if (square1 === square2){
            return true
        }
        return false
    }

    getPieceAtSquare(board, square){
        const [ row, col ] = this.coordinatesToIndices(square)
        if (board[row][col].piece === null){
            console.log("no piece")
            return null
        }
        console.log([row, col])
        console.log("piece is:", board[row][col].piece)
        return board[row][col].piece
    }

    getSquare(board, square){
        const row = parseInt(square[1]-1)
        const col = this.xAxis.indexOf(square[0])
        return board[row][col]
    }

    placePiece(board, square, piece){
        const [ row, col ] = this.coordinatesToIndices(square)
        board[row][col].piece = piece
        return board
    }

    coordinatesToIndices(coordinates){
        // Takes in algebraic notation string and returns [ row, col ] 
        const row = parseInt(coordinates[1]-1)
        const col = this.xAxis.indexOf(coordinates[0])
        return [ row, col ]
    }

    indicesToCoordinates(indices){
        const [ row, col ] = indices
        return `${this.xAxis[col]}${row+1}`
    }

    getCapturedPieces(board){
        let capturedPieces = []
        // Loop through all squares and add pieces to array as found
        // Compare with full set and return the difference
        return capturedPieces
    }

    getSan(move){
        let san
        return san
    }

    printBoard(board){
        let consoleBoard = ""
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                const pieceLetter = this.getPieceLetter(board[y][x].piece)
                if (x === 7){
                    consoleBoard += `[${pieceLetter}]\n`
                } else {
                    consoleBoard += `[${pieceLetter}]`
                }
            }
        }
        console.log(consoleBoard)
    }

    getPieceLetter(piece){
        if (piece === null){ return " " }
        const { type, color } = piece
        let pieceLetter
        if (type === "pawn"){ pieceLetter = "p"}
        if (type === "knight"){ pieceLetter = "n"}
        if (type === "bishop"){ pieceLetter = "b"}
        if (type === "rook"){ pieceLetter = "r"}
        if (type === "queen"){ pieceLetter = "q"}
        if (type === "king"){ pieceLetter = "k"}
        if (color === "white"){ pieceLetter = pieceLetter.toUpperCase() }
        return pieceLetter
    }
}

const game = new Game()
const board = game.createStartPosition()
game.printBoard(board)

// const updatedBoard = game.playMove(board, { from: "g1", to: "f3" })
//console.log(updatedBoard) 
// expect: 
// [ { from: "e2", to: "e3"}, 
// { from: "e2", to: "e4"} ]

module.exports = Game
