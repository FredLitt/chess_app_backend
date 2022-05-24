const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('./pieces.js')

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
        const startingPieces = [
            { piece: whiteRook, squares: ["a1", "h1"] },
            { piece: whiteKnight, squares: ["b1", "g1"] },
            { piece: whiteBishop, squares: ["c1", "f1"] },
            { piece: whiteQueen, squares: "d1" },
            { piece: whiteKing, squares: "e1" },
            { piece: whitePawn, squares: [ "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"] },
            { piece: blackRook, squares: ["a8", "h8"] },
            { piece: blackKnight, squares: ["b8", "g8"] },
            { piece: blackBishop, squares: ["c8", "f8"] },
            { piece: blackQueen, squares: "d8" },
            { piece: blackKing, squares: "e8" },
            { piece: blackPawn, squares: [ "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"] }
        ]
        return this.placePieces(startingPieces)
    }
    
    placePieces(piecesToPlace){
        // Input: Array of objects in { piece: pieceType, squares: square/squares } format
        // If just a single square, just the string coordinates i.e: "e4" can be used
        // If placing multiple of a given piece, put coordinates in array i.e: ["d3", "c7"]
        const board = this.createEmptyBoard()
        for (let i = 0; i < piecesToPlace.length; i++){
            const piece = piecesToPlace[i].piece
            const squaresToPlace = piecesToPlace[i].squares
            const moreThanOnePiece = typeof squaresToPlace !== "string"
            if (moreThanOnePiece){
                squaresToPlace.forEach(square => this.getSquare(board, square).piece = piece)
            } else {
                this.getSquare(board, squaresToPlace).piece = piece
            }
        }
        console.log(board)
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

    isKingInCheck(board, kingColor){
        let opposingColor
        const kingsSquare = this.findKingsSquare(board, kingColor)
        if (kingColor === "white") { opposingColor = "black" }
        if (kingColor === "black") { opposingColor = "white" }
        const attackedSquares = this.findAttackedSquares(board, opposingColor)
        const kingIsAttacked = attackedSquares.some(attackedSquare => this.squaresAreTheSame(attackedSquare, kingsSquare))
        if (kingIsAttacked){
            console.log("king is attacked")
            return true
        }
        console.log("king is not attacked")
        return false
    }

    isKingInCheckMate(board, kingColor){
        if (!this.isKingInCheck(board, kingColor)){ return false }
        const kingsSquare = this.findKingsSquare(board, kingColor)
        const kingsMoves = this.findSquaresForKing(board, kingsSquare)
        if (kingsMoves.length === 0){ return true }
        return false
    }

    findKingsSquare(board, kingColor){
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                const currentSquare = board[y][x]
                if (currentSquare.piece === null) { continue }
                const squareHasKing = currentSquare.piece.type === "king" && currentSquare.piece.color === kingColor
                if (squareHasKing){ 
                    return this.indicesToCoordinates([y, x])
                }
            }
        }
        return null
    }

    doesMoveExposeKing(board, move, kingColor){
        const testBoard = this.testMove(board, move)
        this.printBoard(testBoard)
        if (this.isKingInCheck(testBoard, kingColor)){
            console.log("after move:", move, "king is in check:", this.isKingInCheck(testBoard, kingColor))
            return true
        }
        return false
    }

    testMove(board, move){
        const movingPiece = this.getSquare(board, move.from).piece
        this.getSquare(board, move.from).piece = null
        this.getSquare(board, move.to).piece = movingPiece
        return board
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

    findSquaresForPiece(board, piecesSquare, squaresToFind){
        const noPieceToMove = this.getSquare(board, piecesSquare).piece === null
        if (noPieceToMove){ return null }

        const movingPiece = this.getSquare(board, piecesSquare).piece.type
        console.log("moving piece:", movingPiece, "finding:", squaresToFind)
        const longRangePiece = movingPiece === "bishop" || movingPiece === "rook" || movingPiece === "queen"

        let squares
        
        if (movingPiece === "pawn"){ 
            squares = this.findSquaresForPawn(board, piecesSquare, squaresToFind) 
        }
        if (movingPiece === "knight"){ 
            squares = this.findSquaresForKnight(board, piecesSquare, squaresToFind) 
        }
        if (movingPiece === "king"){ 
            squares = this.findSquaresForKing(board, piecesSquare, squaresToFind) 
        }
        if (longRangePiece){ 
            let directions
            if (movingPiece === "bishop"){ directions = ["NorthEast", "NorthWest", "SouthEast", "SouthWest"] }
            if (movingPiece === "rook"){ directions = ["North", "South", "East", "West"] }
            if (movingPiece === "queen"){ directions = ["North", "South", "East", "West", "NorthEast", "NorthWest", "SouthEast", "SouthWest"] }
            squares = this.findSquaresForLongRange(board, piecesSquare, squaresToFind, directions) 
        }
        return squares
    }

    findSquaresForLongRange(board, fromSquare, squaresToFind, pieceDirections){
        console.log("from square:", fromSquare, "squares to find:", squaresToFind, "piece directions:", pieceDirections)
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
                const movingPieceColor = this.getPiecesColor(board, fromSquare)
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
                const squareHasFriendlyPiece = movingPieceColor === this.getPiecesColor(board, possibleSquare)
                const squareHasEnemyPiece = squareHasPiece && !squareHasFriendlyPiece
                const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: fromSquare, to: possibleSquare }, movingPieceColor)

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
                    const invalidMove = !squareIsOnBoard || squareHasFriendlyPiece || moveWouldExposeKing
                    if (invalidMove) {
                        completedDirections.push(direction) 
                        continue
                    }

                    if (squareHasEnemyPiece) {
                        completedDirections.push(direction)
                        if (!moveWouldExposeKing) {
                            squares.push(possibleSquare)
                            continue
                        }
                    }
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
            const kingsColor = this.getPiecesColor(board, kingsSquare)
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
            const squareHasFriendlyPiece = this.getPiecesColor(board, kingsSquare) === this.getPiecesColor(board, possibleSquare)
            const squareHasEnemyPiece = squareHasPiece && !squareHasFriendlyPiece
            const isCastlingLegal = false // this.isCastlingLegal
            const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: kingsSquare, to: possibleSquare }, kingsColor)
            
            if (squaresToFind === "possible moves"){
                if (!squareIsOnBoard || squareHasFriendlyPiece || moveWouldExposeKing){ continue }
                
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
            const knightsColor = this.getPiecesColor(board, knightsSquare)
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const squareHasFriendlyPiece = (this.getPiecesColor(board, knightsSquare) === this.getPiecesColor(board, possibleSquare))
            const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: knightsSquare, to: possibleSquare }, knightsColor)

            if (!squareIsOnBoard) { continue }

            if (squaresToFind === "possible moves"){
                if (squareHasFriendlyPiece || moveWouldExposeKing){ continue }
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
            const pawnsColor = this.getPiecesColor(board, pawnsSquare)
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare }, pawnsColor)

            if (!squareIsOnBoard){ continue }

            if (squaresToFind === "possible moves"){
                if (moveWouldExposeKing){ continue }
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
        console.log("checking legality of:", move)
        const noPieceToMove = !this.isSquareOccupied(board, move.from)
        if (noPieceToMove){ 
            console.log("no piece to move")
            return false }
        const legalMoves = this.findSquaresForPiece(board, move.from, "possible moves")
        console.log("legal moves:", legalMoves)
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

    // Returns updated board if move is legal and false if not legal does not add to history if test move
    playMove(board, move){
        if (!this.isMoveLegal(board, move)){ return console.log("inputted move is not legal") }

        const movingPiece = this.getSquare(board, move.from).piece
        this.getSquare(board, move.from).piece = null
        this.getSquare(board, move.to).piece = movingPiece
        this.moveHistory.push(move)
        console.log("after playing move:", move, "here's the board:")
        this.printBoard(board)
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

const start = game.createStartPosition()
game.printBoard(start)
// game.placePiece(board, "e5", whiteBishop)
// game.placePiece(board, "e7", blackRook)
// game.printBoard(board)
// const newBoard = game.playMove(board, { from: "e5", to: "d5" })
// game.printBoard(newBoard)
//game.placePiece(board, "a2", blackRook)

// const moveHistory = [
//     { 
//         from: "e2",
//         to: "e4"
//     },
//     { 
//         from: "e7",
//         to: "e5"
//     },
//     { 
//         from: "g1",
//         to: "f3"
//     },
//     { 
//         from: "g8",
//         to: "c6"
//     },
//     { 
//         from: "f1",
//         to: "c4"
//     },
//     { 
//         from: "g8",
//         to: "f6"
//     }
// ]

//console.log(game.getSan(move))
//console.log(game.createSanMoveList(moveHistory))
//const updatedBoard = game.createBoardFromMoveHistory(moveHistory)
//game.printBoard(updatedBoard)

module.exports = Game
