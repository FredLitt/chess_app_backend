const { whitePawn, whiteKnight, whiteBishop, whiteRook, whiteQueen, whiteKing, 
    blackPawn, blackKnight, blackBishop, blackRook, blackQueen, blackKing } = require('./pieces.js')

    class Chess {
        constructor(){
            this.xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
            this.moveHistory = []
            this.capturedPieces = []
        }
        createEmptyBoard(){
            const board = []
            for (let y = 8; y >= 1; y--){
                const boardRow = []
                board.push(boardRow)
                for (let x = 0; x < 8; x++){
                    const square = {
                        piece: null,
                        coordinates: `${this.xAxis[x]}${y}`,
                        color: this.getSquareColor(y, x)
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
            return this.placePieces(board, startingPieces)
        }
        
        placePieces(board, piecesToPlace){
            // Input: Array of objects in { piece: pieceType, squares: square/squares } format
            // If just a single square, just the string coordinates i.e: "e4" can be used
            // If placing multiple of a given piece, put coordinates in array i.e: ["d3", "c7"]
            for (let i = 0; i < piecesToPlace.length; i++){
                const piece = piecesToPlace[i].piece
                const squaresToPlace = piecesToPlace[i].squares
                const moreThanOneOfPiece = typeof squaresToPlace !== "string"
                if (moreThanOneOfPiece){
                    squaresToPlace.forEach(square => this.getSquare(board, square).piece = piece)
                } else {
                    this.getSquare(board, squaresToPlace).piece = piece
                }
            }
            return board
        }
    
        getSquareColor(col, row){
            return ((col + row + 1) % 2 === 0) ? "dark" : "light"
        }
    
        isSquareOccupied(board, square){
            const squareIsOccupied = this.isSquareOnBoard(square) && this.getSquare(board, square).piece
            return squareIsOccupied
        }
    
        isKingInCheck(board, kingColor){
            const kingsSquare = this.findKingsSquare(board, kingColor)
            if (!kingsSquare){ return false }
    
            const unsafeSquares = this.findAttackedSquares(board, this.getOpposingColor(kingColor))
            const kingIsInCheck = unsafeSquares.some(unsafeSquare => unsafeSquare === kingsSquare)
            return kingIsInCheck
        }
    
        isKingInCheckMate(board, kingColor){
            if (!this.isKingInCheck(board, kingColor)){ return false }
            const possibleMoves = this.findAllPossibleMoves(board, kingColor)
            const isCheckMate = possibleMoves.length === 0
            return isCheckMate
        }
    
        findKingsSquare(board, kingColor){
            for (let y = 7; y >= 0; y--){
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
            if (!this.isSquareOnBoard(move.from)){
                return false
            }
            let testBoard = this.clone(board)
            const startSquare = this.getSquare(testBoard, move.from).coordinate
            const movingPiece = this.getSquare(testBoard, move.from).piece
            const targetSquare = this.getSquare(testBoard, move.to).coordinate   
            if (this.isMoveEnPassant(testBoard, move)){
                const pawnToCapturesSquare = this.getEnPassantTarget()
                this.getSquare(testBoard, pawnToCapturesSquare).piece = null
            }
            testBoard = this.placePieces(testBoard, [ { piece: movingPiece, squares: targetSquare}, { piece: null, squares: startSquare }])
            return this.isKingInCheck(testBoard, kingColor)
        }
    
        clone(board){
            const clone = []
            for (let y = 8; y > 0; y--){
                const boardRow = []
                clone.push(boardRow)
                for (let x = 0; x < 8; x++){
                    const square = {
                        piece: this.getSquare(board, `${this.xAxis[x]}${y}`).piece,
                        coordinate: `${this.xAxis[x]}${y}`
                    }
                    boardRow.push(square)
                }
            }
            return clone
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
            return attackedSquares.flat()
        }
    
        findAllPossibleMoves(board, color){
            let allPossibleMoves = []
            for (let y = 0; y < 8; y++){
                for (let x = 0; x < 8; x++){
                    const squareToCheck = this.indicesToCoordinates([y, x])
                    if (this.getPiecesColor(board, squareToCheck) === color){
                        const piece = this.getSquare(board, squareToCheck).piece
                        const piecesSquare = squareToCheck
                        const possibleSquares = this.findSquaresForPiece(board, piecesSquare, "possible moves")
                        const possibleMoves = possibleSquares.map(possibleSquare => 
                            this.buildMove(piece, { from: piecesSquare, to: possibleSquare}))
                        if (possibleMoves.length !== 0){
                            allPossibleMoves.push(possibleMoves)
                        }
                    }
                }
            }
            allPossibleMoves = allPossibleMoves.flat()
            return allPossibleMoves
        }
    
        findSquaresForPiece(board, piecesSquare, squaresToFind){

            const movingPiece = this.getSquare(board, piecesSquare).piece.type
            const longRangePiece = movingPiece === "bishop" || movingPiece === "rook" || movingPiece === "queen"

            if (movingPiece === "pawn"){ return this.findSquaresForPawn(board, piecesSquare, squaresToFind) }
            if (movingPiece === "knight"){ return this.findSquaresForKnight(board, piecesSquare, squaresToFind) }
            if (movingPiece === "king"){ return this.findSquaresForKing(board, piecesSquare, squaresToFind) }
            if (longRangePiece){ 
                const directions = {
                    "bishop": ["NorthEast", "NorthWest", "SouthEast", "SouthWest"],
                    "rook": ["North", "South", "East", "West"],
                    "queen": ["North", "South", "East", "West", "NorthEast", "NorthWest", "SouthEast", "SouthWest"]
                }
                return this.findSquaresForLongRange(board, piecesSquare, squaresToFind, directions[movingPiece]) 
            }
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
                            continue
                        }
                        
                        if (squareHasEnemyPiece) {
                            completedDirections.push(direction)
                            squares.push(possibleSquare)
                            continue
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
                    
                    const moveExposesKing = this.doesMoveExposeKing(board, { from: kingsSquare, to: possibleSquare }, kingColor)

                    if (moveExposesKing){
                        continue
                    }
    
                    if (squareHasEnemyPiece){
                        squares.push(possibleSquare)            
                    }
    
                    if (move.includes("Castle") && !this.isCastlingLegal(board, kingColor, move)){
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
                "NorthOneEastTwo": [ fromRow + 1, fromCol + 2 ],
                "NorthTwoEastOne": [ fromRow + 2, fromCol + 1 ],
                "SouthOneEastTwo": [ fromRow - 1, fromCol + 2 ],
                "SouthTwoEastOne": [ fromRow - 2, fromCol + 1 ],
                "NorthOneWestTwo": [ fromRow + 1, fromCol - 2 ],
                "NorthTwoWestOne": [ fromRow + 2, fromCol - 1 ],
                "SouthOneWestTwo": [ fromRow - 1, fromCol - 2 ],
                "SouthTwoWestOne": [ fromRow - 2, fromCol - 1 ]
              }
            
            for (const move in knightMoves){
                const possibleSquare = this.indicesToCoordinates(knightMoves[move])
                const knightsColor = this.getPiecesColor(board, knightsSquare)
                const squareIsOnBoard = this.isSquareOnBoard(possibleSquare)
                const squareHasFriendlyPiece = this.getPiecesColor(board, knightsSquare) === this.getPiecesColor(board, possibleSquare)
    
                if (!squareIsOnBoard) { continue }
    
                if (squaresToFind === "possible moves"){
                    if (squareHasFriendlyPiece){ continue }
                    const moveExposesKing = this.doesMoveExposeKing(board, { from: knightsSquare, to: possibleSquare }, knightsColor)
                    if (moveExposesKing){ continue }
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
            if (movingPawnColor === "black"){
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
                
                if (!squareIsOnBoard){ continue }
    
                if (squaresToFind === "possible moves"){
                    
                    if (move === "ForwardOne"){
                        const pawnIsBlocked = this.isSquareOccupied(board, possibleSquare)
                        if (pawnIsBlocked){ continue }
                    }
    
                    if (move === "ForwardTwo"){
                        const pawnIsBlocked = 
                            this.isSquareOccupied(board, this.indicesToCoordinates(pawnMoves["ForwardOne"])) || this.isSquareOccupied(board, possibleSquare)
                        const pawnHasMoved = pawnsStartingRow !== fromRow
                        if (pawnIsBlocked || pawnHasMoved){
                            continue
                        }
                    }
    
                    if (move === "CaptureEast" || move === "CaptureWest"){ 
                        const captureSquareHasEnemyPiece = (this.getPiecesColor(board, possibleSquare) !== null && this.getPiecesColor(board, possibleSquare) !== movingPawnColor)
                        const enPassantIsLegal = this.isEnPassantLegal(board, pawnsSquare, movingPawnColor)
                        if (!captureSquareHasEnemyPiece && !enPassantIsLegal){ continue }
                    }
                   
                    const moveWouldExposeKing = this.doesMoveExposeKing(board, { from: pawnsSquare, to: possibleSquare }, movingPawnColor)
                    if (moveWouldExposeKing) { continue }
                    squares.push(possibleSquare)
                }
    
                if (squaresToFind === "controlled squares"){
                    if (move === "CaptureEast" || move === "CaptureWest"){ 
                        squares.push(possibleSquare)
                    }       
                }  
            }
            return squares
        } 
    
        areCastlingSquaresControlled(board, kingColor, castlingDirection){
            let squaresToCheck
            const castlingSquares = {
                "white": {
                    "Castle Kingside": ["f1", "g1"],
                    "Castle Queenside": ["d1", "c1", "b1"],
                },
                "black": {
                    "Castle Kingside": ["f8", "g8"],
                    "Castle Queenside":  ["d8", "c8", "b8"],
                }
            }
            squaresToCheck = castlingSquares[kingColor][castlingDirection]
            const unsafeSquares = this.findAttackedSquares(board, this.getOpposingColor(kingColor))
            return unsafeSquares.some(unsafeSquare => squaresToCheck.includes(unsafeSquare))
        }

        isCastlingLegal(board, kingColor, castlingDirection){
            const castlingSquaresAreControlled = this.areCastlingSquaresControlled(board, kingColor, castlingDirection)
            const kingIsInCheck = this.isKingInCheck(board, kingColor)
            const kingHasMoved = this.hasKingMoved(board, kingColor)
            const rookHasMoved = this.hasCastlingRookMoved(board, kingColor, castlingDirection)
            const castlingIsLegal = (!castlingSquaresAreControlled && !kingIsInCheck && !kingHasMoved && !rookHasMoved)
            return castlingIsLegal
        }
    
        hasKingMoved(board, kingColor){
            const kingStartSquare = {
                "white": "e1",
                "black": "e8"
            }
            const kingNotOnStartSquare = this.findKingsSquare(board, kingColor) !== kingStartSquare[kingColor]
            const moveHistoryFromSquares = this.moveHistory.map(move => move.from)
            const kingHasMoved = moveHistoryFromSquares.includes(kingStartSquare[kingColor])
            return (kingHasMoved || kingNotOnStartSquare)
        }
    
        hasCastlingRookMoved(board, color, castlingDirection){
            const rookStartSquares = {
                "white": {
                    "Castle Kingside": "h1",
                    "Castle Queenside": "a1"
                },
                "black": {
                    "Castle Kingside": "h8",
                    "Castle Queenside": "a8"
                }
            }
            const castlingRookSquare = rookStartSquares[color][castlingDirection]
            const moveHistoryFromSquares = this.moveHistory.map(move => move.from)
            const noRookOnSquare = this.getSquare(board, castlingRookSquare).piece === null || this.getSquare(board, castlingRookSquare).piece.type !== "rook"
            return (moveHistoryFromSquares.includes(castlingRookSquare) || noRookOnSquare)
        }
    
        buildMove(piece, move){
            return { 
                piece: piece, 
                from: move.from, 
                to: move.to, 
                data: move.data 
            } 
        }
    
        getPiecesColor(board, square){
            const noPieceOnSquare = (!this.isSquareOnBoard(square)) || (this.getSquare(board, square).piece === null)
            if (noPieceOnSquare){ 
                return null 
            }
            return this.getSquare(board, square).piece.color
        }
    
        isEnPassantLegal(board, pawnsSquare, movingPawnColor){
            const lastMove = this.moveHistory[this.moveHistory.length - 1]
            const lastMoveWasPawn = lastMove?.piece.type === "pawn"
            if (!lastMoveWasPawn){ return false }
            const enPassantRow = {
                "white": 5,
                "black": 4
            }
            const pawnMovedTwo = Math.abs(lastMove?.from[1] - lastMove.to[1]) === 2
            const capturingPawnOnEnPassantRow = parseInt(pawnsSquare[1]) === enPassantRow[movingPawnColor]
            const pawnLandedOnAdjacentSquare = Math.abs(this.xAxis.indexOf(lastMove?.to[0]) - this.xAxis.indexOf(pawnsSquare[0])) === 1
            const enPassantIsLegal = pawnMovedTwo && capturingPawnOnEnPassantRow && pawnLandedOnAdjacentSquare
            return enPassantIsLegal
        }
    
        isMoveEnPassant(board, move){
            const pawnMove = this.getSquare(board, move.from).piece.type === "pawn"
            const wasCapture = move.from[0] !== move.to[0]
            const noPieceOnCaptureSquare = this.getSquare(board, move.to).piece === null
            const moveIsEnPassant = pawnMove && wasCapture && noPieceOnCaptureSquare
            return moveIsEnPassant
        }
    
        getEnPassantTarget(){
            const lastMove = this.moveHistory[this.moveHistory.length - 1]
            const pawnToCapturesSquare = lastMove?.to
            return pawnToCapturesSquare
        }

        isMoveCastling(board, move){
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
            } else {
                startSquare = "e8"
                kingsideEndSquare = "g8"
                queensideEndSquare = "c8"
            }
            const kingOnStartSquare = move.from === startSquare
            const kingWentKingside = move.to === kingsideEndSquare
            const kingWentQueenside = move.to === queensideEndSquare
            if (kingOnStartSquare && kingWentKingside){ return "Castle Kingside" }
            if (kingOnStartSquare && kingWentQueenside){ return "Castle Queenside" }
            return false
        }
    
        castle(board, direction, color){
            let castleSquares
            if (color === "white"){
                direction.includes("Kingside") ? 
                    castleSquares = { 
                        kingStart: "e1",
                        kingEnd: "g1",
                        rookStart: "h1",
                        rookEnd: "f1"
                    } :
                    castleSquares = {
                        kingStart: "e1",
                        kingEnd: "c1",
                        rookStart: "a1",
                        rookEnd: "d1"
                    }
            } else {
                direction.includes("Kingside") ? 
                    castleSquares = { 
                        kingStart: "e8",
                        kingEnd: "g8",
                        rookStart: "h8",
                        rookEnd: "f8"
                    } :
                    castleSquares = {
                        kingStart: "e8",
                        kingEnd: "c8",
                        rookStart: "a8",
                        rookEnd: "d8"
                    }
                }
                this.getSquare(board, castleSquares.kingStart).piece = null
                this.getSquare(board, castleSquares.kingEnd).piece = { type: "king", color: color }
                this.getSquare(board, castleSquares.rookStart).piece = null
                this.getSquare(board, castleSquares.rookEnd).piece = { type: "rook", color: color }
        }

        isMovePromotion(move){
            if (move.piece.type !== "pawn"){ return false }
            const targetRow = parseInt(move.to[1])
            const pawnColor = move.piece.color
            const moveIsPromotion = (pawnColor === "white" && targetRow === 8) || (pawnColor === "black" && targetRow === 1)
            return moveIsPromotion
        }

        capturePiece(piece){
            if ("formerPawn" in piece){
                this.capturedPieces.push({ type: "pawn", color: piece.color })
            } else {
                this.capturedPieces.push(piece)
            }
        }
   
        createBoardFromMoveHistory(moveHistory){
            let board = this.createStartPosition()
            for (let i = 0; i < moveHistory.length; i++){
                board = this.playMove(board, moveHistory[i])
            }
            return board
        }

        isPlayableMove(board, move){
            return this.isMoveLegal(board, move) && this.isMoveValid(board, move)
        }
            
        isMoveValid(board, move){
            const squareHasPiece = this.isSquareOccupied(board, move.from)
            const moveSquaresAreOnBoard = this.isSquareOnBoard(move.to) && this.isSquareOnBoard(move.from)
            const movingPlayerColor = move.piece.color
            const whoseTurn = this.getWhoseTurn(this.moveHistory)
            const correctPlayer = whoseTurn === movingPlayerColor
            const gameOver = this.isGameOver(board)
            const moveIsValid = (squareHasPiece || moveSquaresAreOnBoard || correctPlayer || !gameOver)
            return moveIsValid
        }

        isMoveLegal(board, move){
            const legalMoves = this.findSquaresForPiece(board, move.from, "possible moves")
            return legalMoves.some(legalMove => legalMove === move.to)
        }

        getFullMove(board, move){
            if (!this.isPlayableMove(board, move)) return false
            move.data = []
            const startSquare = this.getSquare(board, move.from)
            const endSquare = this.getSquare(board, move.to)
            const isCapture = endSquare.piece !== null 
            
            if (isCapture) move.data.push("capture")
            if (this.isMoveEnPassant(board, move)) move.data.push("enPassant", "capture")
            if (this.isMoveCastling(board, move)){
                const direction = this.isMoveCastling(board, move)
                move.data.push(direction)
            }
            endSquare.piece = move.piece
            startSquare.piece = null
            if (this.isKingInCheckMate(board, this.getOpposingColor(move.piece.color))) move.data.push("checkmate")
            if (this.isKingInCheck(board, this.getOpposingColor(move.piece.color))) move.data.push("check")
            return move
        }

        playMove(board, move){
            const startSquare = this.getSquare(board, move.from)
            const endSquare = this.getSquare(board, move.to)
            let movingPiece = startSquare.piece
            
            if (move.data.includes("capture") && !move.data.includes("enPassant")){ 
                this.capturePiece(endSquare.piece)
            }
            
            if (move.data.includes("enPassant")){
                const coordinatesOfCapturedPawn = this.getEnPassantTarget()
                const pawnToCapturesSquare = this.getSquare(board, coordinatesOfCapturedPawn)
                this.capturePiece(pawnToCapturesSquare.piece)
                pawnToCapturesSquare.piece = null
            }

            if (this.isMoveCastling(board, move)){
                const direction = this.isMoveCastling(board, move)
                this.castle(board, direction, move.piece.color)
            }

            if (this.isMovePromotion(move)){
                move.data.promotion = move.promotion
                movingPiece = move.promotion
                movingPiece.formerPawn = true
            }

            endSquare.piece = movingPiece
            startSquare.piece = null
            this.moveHistory.push(move)
            return board
        }
    
        getOpposingColor(color){
            return (color === "white") ? "black" : "white"
        }
    
        isSquareOnBoard(square){
            const invalidFormat = (square.length !== 2 || typeof square !== "string")
            if (invalidFormat){ 
                return false 
            }
            const x = square[0]
            const y = parseInt(square[1])
            const squareIsOnBoard = (this.xAxis.includes(x) && y <= 8 && y >= 1)
            return squareIsOnBoard
        }
    
        squaresAreTheSame(square1, square2){
            return square1 === square2
        }
    
        getSquare(board, square){
            if (!this.isSquareOnBoard(square)){
                return null
            }
            const row = 8 - parseInt(square[1])
            const col = this.xAxis.indexOf(square[0])
            return board[row][col]
        }
    
        coordinatesToIndices(coordinates){
            // Takes in algebraic notation string and returns [ row, col ] 
            const row = 8 - parseInt(coordinates[1])
            const col = this.xAxis.indexOf(coordinates[0])
            return [ row, col ]
        }
    
        indicesToCoordinates(indices){
            const [ row, col ] = indices
            return `${this.xAxis[col]}${8 - row}`
        }
    
        isSamePiece(piece1, piece2){
            return (piece1.type === piece2.type) && (piece1.color === piece2.color)
        }
    
        getSan(move){
            console.log("getting san for move:", move)
            let san = ""
            const pieceLetter = this.getPieceLetter(move.piece)
            const isPawnMove = move.piece.type === "pawn"
            const isCastle = move.data.some(string => string.includes("Castle"))
            const isCapture = move.data.includes("capture")
            const isCheckmate = move.data.includes("checkmate")
            const isCheck = move.data.includes("check")
            const isPromotion = typeof move.data.promotion === "string"
                        
            if (isPawnMove){
                isCapture ? san += `${move.from[0]}x${move.to}` : san += `${move.from[0]}${move.to[1]}`
            }

            if (!isPawnMove){
                isCapture ? san += `${pieceLetter}x${move.to}` : san += `${pieceLetter}${move.to}`
            }

            if (isPromotion){
                const promotionPiece = move.data.promotion
                const promotionLetter = this.getPieceLetter(promotionPiece)
                san += `=${promotionLetter}`
            }

            if (isCastle){
                move.data.includes("Castle Kingside") ? san = "O-O" : san = "O-O-O"
            }

            if (isCheckmate){
                san += "#"
            } else if (isCheck){
                san += "+"
            }
            return san
        }
    
        getMoveNotation(){
            return this.moveHistory.map(move => this.getSan(move))
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
            const pieceLetters = {
                "pawn": "P",
                "knight": "N",
                "bishop": "B",
                "rook": "R",
                "queen": "Q",
                "king": "K"
            }
            return (color === "black" && use === "console") ? pieceLetters[type].toLowerCase() : pieceLetters[type]
        }
    
        isGameOver(board){
            const checkmate = this.isKingInCheckMate(board, "white") || this.isKingInCheckMate(board, "black")
            if (checkmate){
                return {
                    gameOver: true,
                    result: this.isKingInCheckMate(board, "white") ? "black wins" : "white wins"
                }
            }
            const currentPlayersTurn = this.getWhoseTurn(this.moveHistory)
            if (this.findAllPossibleMoves(board, currentPlayersTurn).length === 0){
                return {
                    gameOver: true,
                    result: "stalemate"
                }
            }
            return false
        }
    
        getWhoseTurn(moveHistory){
            return (moveHistory.length % 2 === 0) ? "white" : "black"
        }
    }

module.exports = Chess
