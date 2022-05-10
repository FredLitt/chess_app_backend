const pieces = require('./pieces.js')

class Game {
    constructor(){
        this.turn = 0
    }
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
            this.squares.push(boardRow)
        }
        return board
    }
    
    setToStartPosition(){

    }

    createBoardFromMoves(){
        
    }
}

module.exports = Game
