const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('./pieces.js')

// Idea for chess logic refactor:
// No need to store captured pieces, turnNumber, or other mutable data...
// Instead just ascertain these things when needed from a move history, 
// this obviates unnecessary data storage

class Game {
    constructor(){
        this.xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"],
        this.moveHistory = []
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

    findKingsSquare(board, kingColor){
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                const currentSquare = board[y][x]
                if (currentSquare.piece === null) { continue }
                const squareHasKing = currentSquare.piece.type === "king" && currentSquare.piece.color === kingColor
                if (squareHasKing){ 
                    console.log(this.indicesToCoordinates([y, x]))
                    return this.indicesToCoordinates([y, x])
                }
            }
        }
        return null
    }

    moveWouldExposeKing(board, move){
        // if (this.playMove(board, move) === false){ return }
        const testBoard = this.playMove(board, move)
        if (this.isKingInCheck(testBoard)){
            return true
        }
        return false
    }

    findAttackedSquares(board, attackingColor){
        let attackedSquares = []
        const attackingPiecesSquares = []
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                const squareToCheck = this.indicesToCoordinates([y, x])
                if (this.getPiecesColor(board, squareToCheck) === attackingColor){
                    attackingPiecesSquares.push(squareToCheck)
                }
            }
        }
        console.log("attacking pieces squares", attackingPiecesSquares)

        attackingPiecesSquares.forEach(square => attackedSquares.push(this.findSquaresForPiece(board, square, "controlled squares")))
        attackedSquares = attackedSquares.flat()
        console.log(attackedSquares)
        return attackedSquares
    }

    findSquaresForPiece(board, piecesSquare, squaresToGet){
        const noPieceToMove = this.getSquare(board, piecesSquare).piece === null
        if (noPieceToMove){ return null }

        const movingPiece = this.getSquare(board, piecesSquare).piece.type
        const longRangePiece = movingPiece === "bishop" || movingPiece === "rook" || movingPiece === "queen"
        console.log(movingPiece)
        let squares
        
        if (movingPiece === "pawn"){ 
            squares = this.findSquaresForPawn(board, piecesSquare, squaresToGet) 
        }
        if (movingPiece === "knight"){ 
            squares = this.findSquaresForKnight(board, piecesSquare, squaresToGet) 
        }
        if (movingPiece === "king"){ 
            squares = this.findSquaresForKing(board, piecesSquare, squaresToGet) 
        }
        if (longRangePiece){ 
            let directions
            if (movingPiece === "bishop"){ directions = ["NorthEast", "NorthWest", "SouthEast", "SouthWest"] }
            if (movingPiece === "rook"){ directions = ["North", "South", "East", "West"] }
            if (movingPiece === "queen"){ directions = ["North", "South", "East", "West", "NorthEast", "NorthWest", "SouthEast", "SouthWest"] }
            squares = this.findSquaresForLongRange(board, piecesSquare, squaresToGet, directions) 
        }
        console.log(squares)
        return squares
    }

    findSquaresForLongRange(board, fromSquare, squaresToFind, pieceDirections){
        const squares = []
        const [fromRow, fromCol] = this.coordinatesToIndices(fromSquare)
        const completedDirections = []
            
            for (let i = 1; i < 8; i++) {
            const allDirections = {
                "North": [fromRow - i, fromCol],
                "South": [fromRow + i, fromCol],
                "East": [fromRow, fromCol + i],
                "West": [fromRow, fromCol - i],
                "NorthWest": [fromRow - i, fromCol - i],
                "NorthEast": [fromRow - i, fromCol + i],
                "SouthWest": [fromRow + i, fromCol - i],
                "SouthEast": [fromRow + i, fromCol + i]
            }

            for (const direction in allDirections) {
        
                if (!pieceDirections.includes(direction) || completedDirections.includes(direction)){ continue }

                const possibleSquare = this.indicesToCoordinates(allDirections[direction])
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
                const squareHasFriendlyPiece = this.getPiecesColor(board, fromSquare) === this.getPiecesColor(board, possibleSquare)
                const squareHasEnemyPiece = squareHasPiece && !squareHasFriendlyPiece
                // const moveWouldExposeKing = this.moveWouldExposeKing(board, move)

                if (!squareIsOnBoard) { continue }

                if (squaresToFind === "controlled squares") {
                    
                    if (squareHasPiece) {
                        squares.push(possibleSquare)
                        completedDirections.push(direction)
                        continue
                    }
                    squares.push(possibleSquare)
                }

                if (squaresToFind === "possible moves") {
                    const invalidMove = !squareIsOnBoard || squareHasFriendlyPiece // || moveWouldExposeKing
                    if (invalidMove) {
                        completedDirections.push(direction) 
                        continue
                    }

                    if (squareHasEnemyPiece) {
                        completedDirections.push(direction)
                        // if (!board.moveExposesKing(piece, fromSquare, possibleSquare)) {
                        //     squares.push(possibleSquare)
                        // continue
                        // }
                    }
                    // if (board.moveExposesKing(piece, fromSquare, possibleSquare)) {
                    //     continue
                    // }
                squares.push(possibleSquare)
                }
            }
        }
        return squares
    }

    findSquaresForKing(board, kingsSquare, squaresToFind){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(kingsSquare)
        const squares = []

        const kingMoves = {
            "North": [ fromRow - 1, fromCol ],
            "South": [ fromRow + 1, fromCol ],
            "West": [ fromRow, fromCol - 1 ],
            "East": [ fromRow, fromCol + 1 ],
            "NorthWest": [ fromRow - 1, fromCol - 1 ],
            "NorthEast": [ fromRow - 1, fromCol + 1 ],
            "SouthWest": [ fromRow + 1, fromCol - 1 ],
            "SouthEast": [ fromRow + 1, fromCol + 1 ],
            "Castle Kingside": [fromRow, fromCol - 2],
            "Castle Queenside": [fromRow, fromCol + 2]
        }

        for (const move in kingMoves){

            const possibleSquare = this.indicesToCoordinates(kingMoves[move])
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
            const squareHasFriendlyPiece = this.getPiecesColor(board, kingsSquare) === this.getPiecesColor(board, possibleSquare)
            const squareHasEnemyPiece = squareHasPiece && !squareHasFriendlyPiece
            const isCastlingLegal = false // this.isCastlingLegal
            // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })
            if (squaresToFind === "possible moves"){
                if (!squareIsOnBoard || squareHasFriendlyPiece){ continue }
                
                if (squareHasEnemyPiece){
                    squares.push(possibleSquare)
                    continue
                }
                squares.push(possibleSquare)
            }
            if (squaresToFind === "controlled squares"){
                if (!squareIsOnBoard || move.includes("Castle")){ continue }

                squares.push(possibleSquare)
            }
        }
        return squares
    }

    findSquaresForKnight(board, knightsSquare, squaresToFind){
        const [ fromRow, fromCol ] = this.coordinatesToIndices(knightsSquare)
        const squares = []
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

            if (!squareIsOnBoard) { continue }

            if (squaresToFind === "possible moves"){
                if (squareHasFriendlyPiece){ continue }
                squares.push(possibleSquare)
            }

            if (squaresToFind === "controlled squares"){
                squares.push(possibleSquare)
            }
        }
        return squares
    }

    findSquaresForPawn(board, pawnsSquare, squaresToFind){
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
    
        const squares = []

        for (const move in pawnMoves){
            const possibleSquare = this.indicesToCoordinates(pawnMoves[move])
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare })

            if (!squareIsOnBoard){ continue }

            if (squaresToFind === "possible moves"){
                // if (moveWouldExposeKing){ continue }
                if (move === "ForwardOne"){
                    const pawnIsBlocked = this.isSquareOccupied(board, possibleSquare)
                    if (!pawnIsBlocked){
                        squares.push(possibleSquare)
                    }
                }
                if (move === "ForwardTwo"){
                    const pawnIsBlocked = 
                        this.isSquareOccupied(board, this.indicesToCoordinates(pawnMoves["ForwardOne"])) || this.isSquareOccupied(board, possibleSquare)
                    const pawnHasMoved = pawnsStartingRow !== fromRow
                    if (!pawnIsBlocked && !pawnHasMoved){
                        squares.push(possibleSquare)
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
                        squares.push(possibleSquare)
                    }
                }
            }
            if (squaresToFind === "controlled squares"){
                if (move === "CaptureEast" || move === "CaptureWest"){
                    squares.push(possibleSquare)
                }
            }
        }
        return squares
    }

    isMoveLegal(board, move){
        const noPieceToMove = !this.isSquareOccupied(board, move.from)
        if (noPieceToMove){ return false }

        const legalMoves = this.findSquaresForPiece(board, move.from, "possible moves")
        return legalMoves.some(legalMove => legalMove === move.to)
    }

    movesAreTheSame(move1, move2){
        if (move1.from === move2.from && move1.to === move2.to){ return true }
        return false
    }

    buildMove(fromSquare, toSquare, options){
        // Options includes: promotion, enPassant, check, checkmate
        if (options) { 
            return { from: fromSquare, to: toSquare, otherData: options } 
        }
        return { from: fromSquare, to: toSquare }
    }

    getPiecesColor(board, square){
        if (!this.isSquareOnBoard(square)){ return null }
        if (this.getSquare(board, square).piece === null){ return null }   
        return this.getSquare(board, square).piece.color
    }

    // Returns updated board if move is legal and false if not legal
    playMove(board, move){
        if (!this.isMoveLegal(board, move)){ return false }
        const movingPiece = this.getSquare(board, move.from).piece
        this.getSquare(board, move.from).piece = null
        this.getSquare(board, move.to).piece = movingPiece
        this.moveHistory.push(move)
        console.log("move history:", this.moveHistory)
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

game.placePiece(board, "e4", blackKing)

game.placePiece(board, "f6", whiteKing)

//game.placePiece(board, "a2", blackRook)
game.printBoard(board)
game.findKingsSquare(board, "white")
game.findKingsSquare(board, "black")

module.exports = Game
