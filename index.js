require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { Game } = require('./models/game')
const Chess = require('./game_logic/chess')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(
  ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
  
app.post('/api/games', (request, response, next) => {
  const game = new Game({
      moveHistory: []
  })

  game.save().then(savedGame => {
    response.json(savedGame)
  })
  .catch(error => next(error))
})

app.post('/api/games/:id/moves', (request, response, next) => {
  const move = {
    piece: request.body.piece,
    from: request.body.from,
    to: request.body.to
  }
  const chess = new Chess()
  
  Game.findById(request.params.id)
    .then(game => {
      console.log("move history:", game)
      const currentBoard = chess.createBoardFromMoveHistory(game.moveHistory)
      chess.printBoard(currentBoard)
      const isLegalMove = chess.playMove(currentBoard, move) !== false
      console.log("is legal move?", isLegalMove)
      if (isLegalMove){
        console.log("playing move:", move)
        Game.findByIdAndUpdate(
          request.params.id, 
          { $push: { moveHistory: move }},
          { new: true, runValidators: true })
            .then(updatedGame => {
              console.log("move history", updatedGame.moveHistory)
              response.json(updatedGame)
            })
            .catch(error => next(error))
        } else {
          console.log("invalid move inputted")
        }
      })
  
  //const board = chess.createBoardFromMoveHistory(game.moveHistory)
  // if move is valid then run...

  
})

app.delete('/api/games/:id', (request, response, next) => {
  Game.updateOne(
    { _id: request.params.id },
    { $pop: { moveHistory: 1 }},
    { new: true })
      .then(document => {
        console.log(document)
        response.json(document)
      })
      .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
