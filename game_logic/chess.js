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
        if (this.getSquare(board, square).piece === null){
            return false
        }
        return true
    }

    // With a given board and move, returns true if legal move, else false
    isMoveLegal(board, move){
        const movingPiece = this.getSquare(board, move.from).piece.type
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
        console.log("legal moves:", legalMoves)
        return legalMoves.some(legalMove => this.movesAreTheSame(legalMove, move))
    }

    movesAreTheSame(move1, move2){
        if (move1.from === move2.from && move1.to === move2.to){ return true}
        return false
    }

    getKnightMoves(board, knightsSquare){
        const knightsColor = this.getPiecesColor(board, knightsSquare)
        console.log("knight color:", knightsColor)
        const [ fromRow, fromCol ] = this.coordinatesToIndices(knightsSquare)
        const knightMoves = {
            "NorthOneEastTwo": [ fromRow - 1, fromCol + 2 ],
            "NorthTwoEastOne": [ fromRow - 2, fromCol + 1 ],
            "SouthOneEastTwo": [ fromRow + 1, fromCol + 2 ],
            "SouthTwoEastOne": [ fromRow + 2, fromCol + 1 ],
            "NorthOneWestTwo": [ fromRow - 1, fromCol - 2 ],
            "NorthTwoWestOne": [ fromRow - 2, fromCol - 1 ],
            "SouthOneWestTwo": [ fromRow + 1, fromCol - 2 ],
            "SouthTwoWestOne": [ fromRow + 2, fromCol - 1 ]
          }
        let legalMoves = []
        for (const move in knightMoves){
            console.log("testing direction:", move)
            const possibleSquare = this.indicesToCoordinates(knightMoves[move])
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            console.log("is square on board?", squareIsOnBoard)
            const squareHasFriendlyPiece = (this.getPiecesColor(board, knightsSquare) === this.getPiecesColor(board, possibleSquare))
            console.log("moving piece:", this.getPiecesColor(board, knightsSquare), "target square:", this.getPiecesColor(board, possibleSquare))
            // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
            if (!squareIsOnBoard || squareHasFriendlyPiece){ 
                console.log("skipping:", possibleSquare)
                continue }
            legalMoves.push(this.buildMove(knightsSquare, possibleSquare))
        }
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
            const possibleSquare = this.indicesToCoordinates(pawnMoves[move])
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
            if (!squareIsOnBoard){ continue }

            if (move === "ForwardOne"){
                const pawnIsBlocked = this.isSquareOccupied(board, possibleSquare)
                if (!pawnIsBlocked){
                    legalMoves.push(this.buildMove(pawnsSquare, possibleSquare))
                }
            }

            if (move === "ForwardTwo"){
                const pawnIsBlocked = 
                    this.isSquareOccupied(board, this.indicesToCoordinates(pawnMoves["ForwardOne"])) || this.isSquareOccupied(board, possibleSquare)
                const pawnHasMoved = pawnsStartingRow !== fromRow
                if (!pawnIsBlocked && !pawnHasMoved){
                    legalMoves.push(this.buildMove(pawnsSquare, possibleSquare))
                }
            }

            if (move === "CaptureEast" || move === "CaptureWest"){ 
                const captureSquareHasEnemyPiece = (this.getPiecesColor(board, possibleSquare) !== null && this.getPiecesColor(board, possibleSquare) !== movingPawnColor)
                // const enPassantIsLegal = this.isEnPassantLegal()
                // if (captureSquareHasPiece){
                //     if (movingPawnColor !== this.getPiecesColor(board, moveCoordinates)){
                //         squareHasEnemyPiece = true
                //     }
                // }
                if (captureSquareHasEnemyPiece){
                    legalMoves.push(this.buildMove(pawnsSquare, possibleSquare))
                }
            }
        }
        return legalMoves
    }

    buildMove(fromSquare, toSquare, options){
        // Options includes: promotion, enPassant, check, checkmate
        if (options) { 
            return { from: fromSquare, to: toSquare, otherData: options } 
        }
        return { from: fromSquare, to: toSquare }
    }

    getPiecesColor(board, square){
        console.log(square)
        if (!this.isSquareOnBoard(square)){ 
            console.log("not on board")
            return null }
        if (this.getSquare(board, square).piece === null){ return null }   
        return this.getSquare(board, square).piece.color
    }

    // Returns updated board if move is legal and original board if not legal
    playMove(board, move){
        if (!this.isMoveLegal(board, move)){
            console.log("not a legal move")
            return false
        }
        console.log("playing the move", move)
        // const [ fromRow, fromCol ] = this.coordinatesToIndices(move.from)
        // const [ toRow, toCol ] = this.coordinatesToIndices(move.to)
        // const movingPiece = board[fromRow][fromCol].piece
        // board[fromRow][fromCol].piece = null
        // board[toRow][toCol].piece = movingPiece
        const movingPiece = this.getSquare(board, move.from).piece
        console.log("moving piece:", movingPiece)
        this.getSquare(board, move.from).piece = null
        this.getSquare(board, move.to).piece = movingPiece
        return board
    }

    isSquareOnBoard(square){
        const invalidFormat = (square.length !== 2 || typeof square !== "string")
        if (invalidFormat){ 
            console.log("invalid format") 
            return false }
        const x = square[0]
        const y = parseInt(square[1])
        const notOnBoard = (!this.xAxis.includes(x) || y > 8 || y < 1)
        if (notOnBoard){
            console.log("x:", x, "y:", y, "not on board!")
            return false
        }
        console.log(square, "is valid!")
        return true
        // const [ row, col ] = this.coordinatesToIndices(square) 
        // console.log(row, col) 
        // if (col > 7 || col < 0 || col === undefined || row > 7 || row < 0 || row === undefined){
        //     return false
        // }
        // return true
    }

    isKingAttacked(board){
        //return white, black or false
    }

    squaresAreTheSame(square1, square2){
        if (square1 === square2){
            return true
        }
        return false
    }

    getSquare(board, square){
        const row = parseInt(square[1]-1)
        const col = this.xAxis.indexOf(square[0])
        return board[row][col]
    }

    placePiece(board, square, piece){
        this.getSquare(board, square).piece = piece
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
// const updatedBoard = game.playMove(board, { from: "g1", to: "e2" })
// game.printBoard(updatedBoard) 
// expect: 
// [ { from: "e2", to: "e3"}, 
// { from: "e2", to: "e4"} ]

module.exports = Game
