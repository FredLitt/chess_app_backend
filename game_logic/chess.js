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
        this.printBoard(board)
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
        if (!kingsSquare){ return false }
        if (kingColor === "white") { opposingColor = "black" }
        if (kingColor === "black") { opposingColor = "white" }
        const attackedSquares = []//this.findAttackedSquares(board, opposingColor)
        const kingIsInCheck = false // attackedSquares.some(attackedSquare => attackedSquare === kingsSquare)
        if (kingIsInCheck){
            return true
        }
        return false
    }

    isKingInCheckMate(board, kingColor){
        if (!this.isKingInCheck(board, kingColor)){ return false }
        const kingsSquare = this.findKingsSquare(board, kingColor)
        const kingsMoves = this.findSquaresForKing(board, kingsSquare)
        if (kingsMoves.length === 0){ 
            console.log("checkmate!!")
            return true 
        }
        return false
    }

    findKingsSquare(board, kingColor){
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                const coordinates = this.indicesToCoordinates([y, x])
                const currentSquare = this.getSquare(board, coordinates)
                if (currentSquare.piece === null) { continue }
                const squareHasKing = currentSquare.piece.type === "king" && currentSquare.piece.color === kingColor
                if (squareHasKing){ 
                    return coordinates
                }
            }
        }
        return null
    }

    doesMoveExposeKing(board, move, kingColor){
        if (!this.isMoveValid(board, move)){
            return false
        }
        const movingPieceStartSquare = this.getSquare(board, move.from)
        const movingPiece = movingPieceStartSquare.piece
        const targetSquare = this.getSquare(board, move.to)
        movingPieceStartSquare.piece = null
        targetSquare.piece = movingPiece
        const kingWouldBeInCheck = this.isKingInCheck(board, kingColor)
        // Change board back
        movingPieceStartSquare.piece = movingPiece
        targetSquare.piece = null
        if (kingWouldBeInCheck){
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
        attackingPiecesSquares.forEach(square => attackedSquares.push(this.findSquaresForPiece(board, square, "controlled squares")))
        attackedSquares = attackedSquares.flat()
        return attackedSquares
    }

    findSquaresForPiece(board, piecesSquare, squaresToFind){
        const movingPiece = this.getSquare(board, piecesSquare).piece.type
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
        console.log("squares to find:", squaresToFind, squares)
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
                const movingPieceColor = this.getPiecesColor(board, fromSquare)
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
                const squareHasFriendlyPiece = movingPieceColor === this.getPiecesColor(board, possibleSquare)
                const squareHasEnemyPiece = squareHasPiece && !squareHasFriendlyPiece

                if (!squareIsOnBoard) { 
                    completedDirections.push(direction)
                    continue 
                }

                if (squaresToFind === "controlled squares") {  
                    if (squareHasPiece) {
                        squares.push(possibleSquare)
                        completedDirections.push(direction)
                        continue
                    }
                    squares.push(possibleSquare)
                }

                if (squaresToFind === "possible moves") {
                    const invalidMove = !squareIsOnBoard || squareHasFriendlyPiece
                    if (invalidMove) {
                        completedDirections.push(direction) 
                        continue
                    }
                    
                    const moveExposesKing = this.doesMoveExposeKing(board, { from: fromSquare, to: possibleSquare }, movingPieceColor)
                    
                    if (moveExposesKing){
                        completedDirections.push(direction) 
                        continue
                    }

                    if (squareHasEnemyPiece) {
                        completedDirections.push(direction)
                        if (!moveExposesKing) {
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

    areCastlingSquaresControlled(board, kingColor, castlingDirection){
        let opponent
        let castlingSquares
        let kingsideSquares
        let queensideSquares
        if (kingColor === "white"){ 
            kingsideSquares = ["f1", "g1"]
            queensideSquares = ["d1", "c1", "b1"]
            opponent = "black"
        }
        if (kingColor === "black"){ 
            kingsideSquares = ["f8", "g8"]
            queensideSquares = ["d8", "c8", "b8"]
            opponent = "white"
        }
        if (castlingDirection.includes("Kingside")){
            castlingSquares = kingsideSquares
        }
        if (castlingDirection.includes("Queenside")){
            castlingSquares = queensideSquares
        }
        const unsafeSquares = this.findAttackedSquares(board, opponent)
        return unsafeSquares.some(unsafeSquare => castlingSquares.includes(unsafeSquare))
    }

    hasKingMoved(board, kingColor){
        let kingStartSquare
        if (kingColor === "white"){ kingStartSquare = "e1" }
        if (kingColor === "black"){ kingStartSquare = "e8" }
        const kingNotOnStartSquare = this.findKingsSquare(board, kingColor) !== kingStartSquare
        if (kingNotOnStartSquare){
            console.log("king not on start square:", kingStartSquare)
            return true
        }
        const moveHistoryFromSquares = this.moveHistory.map(move => move.from)
        const kingHasMoved = moveHistoryFromSquares.includes(kingStartSquare)
        if (kingHasMoved){
            return true
        }
        return false
    }

    hasCastlingRookMoved(board, color, castlingDirection){
        let rookStartSquare
        if (color === "white"){ 
            if (castlingDirection.includes("Kingside")){ rookStartSquare = "h1" }
            if (castlingDirection.includes("Queenside")){ rookStartSquare = "a1" }
        }
        if (color === "black"){ 
            if (castlingDirection.includes("Kingside")){ rookStartSquare = "h8" }
            if (castlingDirection.includes("Queenside")){ rookStartSquare = "a8" }
        }
        const moveHistoryFromSquares = this.moveHistory.map(move => move.from)
        const noRookOnSquare = this.getSquare(board, rookStartSquare).piece === null || this.getSquare(board, rookStartSquare).piece.type !== "rook"
        if (moveHistoryFromSquares.includes(rookStartSquare) || noRookOnSquare){
            return true
        }
        return false
    }

    isCastlingLegal(board, kingColor, castlingDirection){
        const castlingSquaresAreControlled = this.areCastlingSquaresControlled(board, kingColor, castlingDirection)
        const kingIsInCheck = this.isKingInCheck(board, kingColor)
        const kingHasMoved = this.hasKingMoved(board, kingColor)
        const rookHasMoved = this.hasCastlingRookMoved(board, kingColor, castlingDirection)
        if (castlingSquaresAreControlled || kingIsInCheck || kingHasMoved || rookHasMoved){
            return false
        }
        return true
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
            "Castle Kingside": [fromRow, fromCol + 2],
            "Castle Queenside": [fromRow, fromCol - 2]
        }

        for (const move in kingMoves){

            const possibleSquare = this.indicesToCoordinates(kingMoves[move])
            const kingColor = this.getPiecesColor(board, kingsSquare)
            const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
            const squareHasPiece = this.isSquareOccupied(board, possibleSquare)
            const squareHasFriendlyPiece = this.getPiecesColor(board, kingsSquare) === this.getPiecesColor(board, possibleSquare)
            const squareHasEnemyPiece = squareHasPiece && !squareHasFriendlyPiece
            
            if (squaresToFind === "possible moves"){
                if (!squareIsOnBoard || squareHasFriendlyPiece){ continue }
                
                if (squareHasEnemyPiece){
                    const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: kingsSquare, to: possibleSquare }, kingColor)
                    if (!moveWouldExposeKing){
                        squares.push(possibleSquare)
                        continue
                    }
                    continue
                }

                if (move.includes("Castle")){
                    console.log("CASTLING MOVE", move, possibleSquare)
                    if (!this.isCastlingLegal(board, kingColor, move)){
                        console.log(move, "not legal")
                        continue
                    }
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
        console.log("finding squares for pawn on:", pawnsSquare)
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
            
            if (!squareIsOnBoard){ 
                continue 
            }

            if (squaresToFind === "possible moves"){
                console.log("finding possible moves...")
                if (move === "ForwardOne"){
                    const pawnIsBlocked = this.isSquareOccupied(board, possibleSquare)
                    if (pawnIsBlocked){
                        continue
                    }
                }

                if (move === "ForwardTwo"){
                    const pawnIsBlocked = 
                        this.isSquareOccupied(board, this.indicesToCoordinates(pawnMoves["ForwardOne"])) || this.isSquareOccupied(board, possibleSquare)
                    const pawnHasMoved = pawnsStartingRow !== fromRow
                    if (pawnIsBlocked && pawnHasMoved){
                        continue
                    }
                }

                if (move === "CaptureEast" || move === "CaptureWest"){ 
                    const captureSquareHasEnemyPiece = (this.getPiecesColor(board, possibleSquare) !== null && this.getPiecesColor(board, possibleSquare) !== movingPawnColor)
                    const enPassantIsLegal = this.isEnPassantLegal(board, pawnsSquare, movingPawnColor)
                    console.log("can en passant?", enPassantIsLegal)
                    if (!captureSquareHasEnemyPiece && !enPassantIsLegal){
                        continue
                    }
                    
                }
                // const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare }, pawnsColor)
                // if (moveWouldExposeKing) { 
                //     console.log("move exposes king")
                //     continue 
                // }
                console.log("adding move:", possibleSquare)
                squares.push(possibleSquare)
            }

            if (squaresToFind === "controlled squares"){
                if (!move === "CaptureEast" || !move === "CaptureWest"){
                    continue
                }
            }
        }
        return squares
    } 

    movesAreTheSame(move1, move2){
        if (move1.from === move2.from && move1.to === move2.to){ 
            return true 
        }
        return false
    }

    buildMove(piece, move){
        return { 
            piece: { type: piece.type, color: piece.color }, 
            from: move.from, 
            to: move.to, 
            data: move.data 
        } 
    }

    getPiecesColor(board, square){
        if (!this.isSquareOnBoard(square)){ 
            return null 
        }
        if (this.getSquare(board, square).piece === null){ 
            return null 
        }   
        return this.getSquare(board, square).piece.color
    }

    isEnPassantLegal(board, pawnsSquare, movingPawnColor){
        console.log("checking en passant legality for pawn on:", pawnsSquare, "with color:", movingPawnColor)
        const lastMove = this.moveHistory[this.moveHistory.length - 1]
        const lastMoveWasPawn = lastMove?.piece.type === "pawn"
        if (!lastMoveWasPawn){ return false }
        let enPassantRow
        if (movingPawnColor === "white"){ enPassantRow = 5 }
        if (movingPawnColor === "black"){ enPassantRow = 4 }
        const pawnMovedTwo = Math.abs(lastMove?.from[1] - lastMove.to[1]) === 2
        const capturingPawnOnEnPassantRow = parseInt(pawnsSquare[1]) === enPassantRow
        const pawnLandedOnAdjacentSquare = Math.abs(this.xAxis.indexOf(lastMove?.to[0]) - this.xAxis.indexOf(pawnsSquare[0])) === 1
        if (pawnMovedTwo && capturingPawnOnEnPassantRow && pawnLandedOnAdjacentSquare){
            return true
        }
        return false
    }

    moveWasEnPassant(board, move){
        const pawnMove = this.getSquare(board, move.from).piece.type === "pawn"
        const wasCapture = move.from[0] !== move.to[0]
        const noPieceOnCaptureSquare = this.getSquare(board, move.to).piece === null
        if (pawnMove && wasCapture && noPieceOnCaptureSquare){
            console.log("en passant!")
            return true
        }
        return false
    }

    getEnPassantTarget(){
        const lastMove = this.moveHistory[this.moveHistory.length - 1]
        const pawnToCapturesSquare = lastMove?.to
        return pawnToCapturesSquare
    }

    moveWasCastling(board, move){
        const kingMove = this.getSquare(board, move.from).piece.type === "king"
        if (!kingMove) {
            return false
        }
        const kingColor = this.getPiecesColor(board, move.from)
        let startSquare
        let kingsideEndSquare
        let queensideEndSquare
        if (kingColor === "white"){
            startSquare = "e1"
            kingsideEndSquare = "g1"
            queensideEndSquare = "c1"
        }

        if (kingColor === "black"){
            startSquare = "e8"
            kingsideEndSquare = "g8"
            queensideEndSquare = "c8"
        }
        const kingOnStartSquare = move.from === startSquare
        const kingWentKingside = move.to === kingsideEndSquare
        const kingWentQueenside = move.to === queensideEndSquare
        if (kingOnStartSquare && kingWentKingside){ return "Kingside" }
        if (kingOnStartSquare && kingWentQueenside){ return "Queenside" }
        return false
    }

    castle(board, direction, color){
        let rookSquares = {}
        let kingSquares = {}
        if (color === "white"){
            kingSquares.start = "e1"
            if (direction === "Kingside"){
                kingSquares.end = "g1"
                rookSquares.start = "h1"
                rookSquares.end = "f1"
            }
            if (direction === "Queenside"){
                kingSquares.end = "c1"
                rookSquares.start = "a1"
                rookSquares.end = "d1"
            }
        }
        if (color === "black"){
            kingSquares.start = "e8"
            if (direction === "Kingside"){
                kingSquares.end = "g8"
                rookSquares.start = "h8"
                rookSquares.end = "f8"
            }
            if (direction === "Queenside"){
                kingSquares.end = "c8"
                rookSquares.start = "a8"
                rookSquares.end = "d8"
            }
        }
        const king = this.getSquare(board, kingSquares.start).piece
        const rook = this.getSquare(board, rookSquares.start).piece
        console.log(rook)
        this.getSquare(board, kingSquares.start).piece = null
        this.getSquare(board, kingSquares.end).piece = king
        this.getSquare(board, rookSquares.start).piece = null
        this.getSquare(board, rookSquares.end).piece = rook
    }

    isMoveValid(board, move){
        const noPieceToMove = !this.isSquareOccupied(board, move.from)
        const moveSquaresAreOnBoard = this.isSquareOnBoard(move.to) && this.isSquareOnBoard(move.from)
        if (noPieceToMove || !moveSquaresAreOnBoard ){
            return false
        }
        return true
    }

    playMove(board, move, moveType){
        const isValidMove = this.isMoveValid(board, move)
        if (!isValidMove){
            console.log("invalid move entry")
            return board
        }
        console.log(move)
        const legalMoves = this.findSquaresForPiece(board, move.from, "possible moves")
        console.log(legalMoves)
        const moveIsLegal = legalMoves.some(legalMove => legalMove === move.to)
        if (!moveIsLegal){
            return board
        }
        
        move.data = {}
        let movingPiece = this.getSquare(board, move.from).piece
        if (this.moveWasCastling(board, move)){
            const direction = this.moveWasCastling(board, move)
            const color = this.getPiecesColor(board, move.from)
            console.log("move was castling!", direction, "by color:", color)
            this.castle(board, direction, color)
        }
        if (this.moveWasEnPassant(board, move)){
            move.data.enPassant = true
            const pawnToCapturesSquare = this.getEnPassantTarget()
            this.getSquare(board, pawnToCapturesSquare).piece = null
        }
        // if (move.moveData.hasOwnProperty("promotion")){
        //     const promotingPawnColor = this.getPiecesColor(board, move.from)
        //     movingPiece = { type: move.moveData.promotion, color: promotingPawnColor, formerPawn: true }
        // }
        this.getSquare(board, move.from).piece = null
        this.getSquare(board, move.to).piece = movingPiece

        if (moveType === "test"){ return board }
        
        const fullMove = this.buildMove(movingPiece, move)
        console.log(fullMove)
        this.moveHistory.push(fullMove)
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
        console.log(move)
        const pieceAbbreviation = this.getPieceLetter(move.piece)
        console.log(pieceAbbreviation)
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

    createBoardFromMoveHistory(moveHistory){
        let board = this.createStartPosition()
        for (let i = 0; i < moveHistory.length; i++){
            board = this.playMove(board, moveHistory[i])
        }
        return board
    }
}

const game = new Game()

const enPassantTest = [
    { 
        from: "e2",
        to: "e4"
    },
    { 
        from: "e7",
        to: "e6"
    },
    { 
        from: "e4",
        to: "e5"
    },
    { 
        from: "d7",
        to: "d5"
    }
]

const board = game.createBoardFromMoveHistory(enPassantTest)
game.printBoard(board)
const enPassant = game.playMove(board, { from: "e5", to: "d6"})
game.printBoard(enPassant)

module.exports = Game
