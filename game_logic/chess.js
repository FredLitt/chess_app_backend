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
        if (!this.isSquareOnBoard(square)){ return false }
        if (this.getSquare(board, square).piece === null){ return false }
        return true
    }

    isKingInCheck(board){
        // let opposingColor
        // const kingsSquare = this.findKingsSquare(board, kingColor)
        // if (kingColor === "white") { opposingColor = "black" }
        // if (kingColor === "black") { opposingColor = "white" }
        // const attackedSquares = this.findSquaresAttackedBy(board, opposingColor)
        // const kingIsAttacked = attackedSquares.some(attackedSquare => this.squaresAreTheSame(attackedSquare, kingsSquare))
        // if (kingIsAttacked){
        //    return true
        // }
        return false
    }

    moveWouldExposeKing(board, move){
        // if (this.playMove(board, move) === false){ return }
        const testBoard = this.playMove(board, move)
        if (this.isKingInCheck(testBoard)){
            return true
        }
        return false
    }

    // With a given board and move, returns true if legal move, else false
    isMoveLegal(board, move){
        const noPieceToMove = this.getSquare(board, move.from).piece === null
        if (noPieceToMove){
            console.log("no piece")
            return false
        }
        const movingPiece = this.getSquare(board, move.from).piece.type
        let legalMoves
        
        if (movingPiece === "pawn"){ legalMoves = this.getPawnMoves(board, move.from) }
        if (movingPiece === "knight"){ legalMoves = this.getKnightMoves(board, move.from) }
        if (movingPiece === "bishop"){ legalMoves = this.getBishopMoves(board, move.from) }
        if (movingPiece === "rook"){ legalMoves = this.getRookMoves(board, move.from) }
        if (movingPiece === "queen"){ legalMoves = this.getQueenMoves(board, move.from) }
        if (movingPiece === "king"){ legalMoves = this.getKingMoves(board, move.from) }
        return legalMoves.some(legalMove => this.movesAreTheSame(legalMove, move))
    }

    movesAreTheSame(move1, move2){
        if (move1.from === move2.from && move1.to === move2.to){ return true}
        return false
    }

    getRookMoves(board, rooksSquare){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(rooksSquare)
        const legalMoves = []
        const completedDirections = []

        for (let i = 1; i < 8; i++){
            const rookMoves = {
                "North": [ fromRow - i, fromCol ],
                "South": [ fromRow + i, fromCol ],
                "West": [ fromRow, fromCol - i ],
                "East": [ fromRow, fromCol + i ]
            }
            for (const move in rookMoves){

                if (completedDirections.includes(move)){ 
                    continue }
                
                const possibleSquare = this.indicesToCoordinates(rookMoves[move])
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
                const squareHasFriendlyPiece = (this.getPiecesColor(board, rooksSquare) === this.getPiecesColor(board, possibleSquare))
                // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
                if (!squareIsOnBoard || squareHasFriendlyPiece){ 
                    completedDirections.push(move)
                    continue 
                }
                const squareHasEnemyPiece = 
                    (squareHasPiece && this.getPiecesColor(board, rooksSquare) !== this.getPiecesColor(board, possibleSquare))
                if (squareHasEnemyPiece){
                    legalMoves.push(this.buildMove(rooksSquare, possibleSquare))
                    completedDirections.push(move)
                    continue
                }
                legalMoves.push(this.buildMove(rooksSquare, possibleSquare))
            }
        }
        return legalMoves
    }

    getKingMoves(board, kingsSquare){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(kingsSquare)
        const legalMoves = []

        const kingMoves = {
            "North": [ fromRow - 1, fromCol ],
            "South": [ fromRow + 1, fromCol ],
            "West": [ fromRow, fromCol - 1 ],
            "East": [ fromRow, fromCol + 1 ],
            "NorthWest": [ fromRow - 1, fromCol -1 ],
            "NorthEast": [ fromRow - 1, fromCol + 1 ],
            "SouthWest": [ fromRow + 1, fromCol - 1 ],
            "SouthEast": [ fromRow + 1, fromCol + 1 ]
        }

        for (const move in kingMoves){

            const possibleSquare = this.indicesToCoordinates(kingMoves[move])
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
            const squareHasFriendlyPiece = (this.getPiecesColor(board, kingsSquare) === this.getPiecesColor(board, possibleSquare))
            // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
            if (!squareIsOnBoard || squareHasFriendlyPiece){ 
                continue 
            }
            const squareHasEnemyPiece = 
                (squareHasPiece && this.getPiecesColor(board, kingsSquare) !== this.getPiecesColor(board, possibleSquare))
            if (squareHasEnemyPiece){
                legalMoves.push(this.buildMove(kingsSquare, possibleSquare))
                continue
            }
            legalMoves.push(this.buildMove(kingsSquare, possibleSquare))
        }
        return legalMoves
    }


    getQueenMoves(board, queensSquare){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(queensSquare)
        const legalMoves = []
        const completedDirections = []

        for (let i = 1; i < 8; i++){
            const queenMoves = {
                "North": [ fromRow - i, fromCol ],
                "South": [ fromRow + i, fromCol ],
                "West": [ fromRow, fromCol - i ],
                "East": [ fromRow, fromCol + i ],
                "NorthWest": [ fromRow - i, fromCol -i ],
                "NorthEast": [ fromRow - i, fromCol + i ],
                "SouthWest": [ fromRow + i, fromCol - i ],
                "SouthEast": [ fromRow + i, fromCol + i ]
            }
            for (const move in queenMoves){

                if (completedDirections.includes(move)){ 
                    continue }
                
                const possibleSquare = this.indicesToCoordinates(queenMoves[move])
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
                const squareHasFriendlyPiece = (this.getPiecesColor(board, queensSquare) === this.getPiecesColor(board, possibleSquare))
                // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
                if (!squareIsOnBoard || squareHasFriendlyPiece){ 
                    completedDirections.push(move)
                    continue 
                }
                const squareHasEnemyPiece = 
                    (squareHasPiece && this.getPiecesColor(board, queensSquare) !== this.getPiecesColor(board, possibleSquare))
                if (squareHasEnemyPiece){
                    legalMoves.push(this.buildMove(queensSquare, possibleSquare))
                    completedDirections.push(move)
                    continue
                }
                legalMoves.push(this.buildMove(queensSquare, possibleSquare))
            }
        }

        return legalMoves
    }

    getBishopMoves(board, bishopsSquare){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(bishopsSquare)
        const legalMoves = []
        const completedDirections = []

        for (let i = 1; i < 8; i++){
            const bishopMoves = {
                "NorthWest": [ fromRow - i, fromCol -i ],
                "NorthEast": [ fromRow - i, fromCol + i ],
                "SouthWest": [ fromRow + i, fromCol - i ],
                "SouthEast": [ fromRow + i, fromCol + i ]
            }
            for (const move in bishopMoves){

                if (completedDirections.includes(move)){ 
                    continue }
                
                const possibleSquare = this.indicesToCoordinates(bishopMoves[move])
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
                const squareHasFriendlyPiece = (this.getPiecesColor(board, bishopsSquare) === this.getPiecesColor(board, possibleSquare))
                // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
                if (!squareIsOnBoard || squareHasFriendlyPiece){ 
                    completedDirections.push(move)
                    continue 
                }
                const squareHasEnemyPiece = 
                    (squareHasPiece && this.getPiecesColor(board, bishopsSquare) !== this.getPiecesColor(board, possibleSquare))
                if (squareHasEnemyPiece){
                    legalMoves.push(this.buildMove(bishopsSquare, possibleSquare))
                    completedDirections.push(move)
                    continue
                }
                legalMoves.push(this.buildMove(bishopsSquare, possibleSquare))
            }
        }
        return legalMoves
    }

    getKnightMoves(board, knightsSquare){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(knightsSquare)
        const legalMoves = []
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
        
        for (const move in knightMoves){
            const possibleSquare = this.indicesToCoordinates(knightMoves[move])
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const squareHasFriendlyPiece = (this.getPiecesColor(board, knightsSquare) === this.getPiecesColor(board, possibleSquare))
            // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
            if (!squareIsOnBoard || squareHasFriendlyPiece){ 
                continue 
            }
            legalMoves.push(this.buildMove(knightsSquare, possibleSquare))
        }
        return legalMoves
    }

    getPawnMoves(board, pawnsSquare){
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
        if (!this.isSquareOnBoard(square)){ 
            return null }
        if (this.getSquare(board, square).piece === null){ return null }   
        return this.getSquare(board, square).piece.color
    }

    // Returns updated board if move is legal and false if not legal
    playMove(board, move){
        if (!this.isMoveLegal(board, move)){
            return false
        }
        const movingPiece = this.getSquare(board, move.from).piece
        this.getSquare(board, move.from).piece = null
        this.getSquare(board, move.to).piece = movingPiece
        return board
    }

    isSquareOnBoard(square){
        const invalidFormat = (square.length !== 2 || typeof square !== "string")
        if (invalidFormat){ 
            return false 
        }
        const x = square[0]
        const y = parseInt(square[1])
        const notOnBoard = (!this.xAxis.includes(x) || y > 8 || y < 1)
        if (notOnBoard){
            return false
        }
        return true
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
        if (!this.isSquareOnBoard(square)){
            return null
        }
        const row = parseInt(square[1])-1
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
        let capturedPieces = {
            white: [],
            black: []
        }
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
                const pieceLetter = this.getPieceLetter(board[y][x].piece, "console")
                if (x === 7){
                    consoleBoard += `[${pieceLetter}]\n`
                } else {
                    consoleBoard += `[${pieceLetter}]`
                }
            }
        }
        console.log(consoleBoard)
    }

    getPieceLetter(piece, use){
        // Function is used for getting letters for notation and for printing a console board
        // If use === "console", then black pieces are turned to lower case
        if (piece === null){ return " " }
        const { type, color } = piece
        let pieceLetter
        if (type === "pawn"){ pieceLetter = "P"}
        if (type === "knight"){ pieceLetter = "N"}
        if (type === "bishop"){ pieceLetter = "B"}
        if (type === "rook"){ pieceLetter = "R"}
        if (type === "queen"){ pieceLetter = "Q"}
        if (type === "king"){ pieceLetter = "K"}
        if (color === "black" && use === "console"){ pieceLetter = pieceLetter.toLowerCase() }
        return pieceLetter
    }
}

const game = new Game()
const board = game.createEmptyBoard()
game.placePiece(board, "d3", whiteRook)
game.printBoard(board)
game.getRookMoves(board, "d3")

module.exports = Game
