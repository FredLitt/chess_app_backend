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
  
app.post('/api/games', async (request, response, next) => {
  const game = new Game({
      moveHistory: []
  })
  try {
    const savedGame = await game.save()
    response.json(savedGame)
  } catch (error) {
    console.log("Unable to create game")
    next(error)
  }
})

app.get('/api/games/:id/moves', async (request, response, next) => {
  try {
    const game = await Game.findById(request.params.id)
    response.json(game)
  } catch (error) {
    console.log("Unable to get game")
    next(error)
  }
})

app.post('/api/games/:id/moves', async (request, response, next) => {
  const move = {
    piece: request.body.piece,
    from: request.body.from,
    to: request.body.to
  }

  if (request.body.promotion){
    move.promotion = request.body.promotion
  }
  
  const chess = new Chess()
  try {
    const game = await Game.findById(request.params.id)
    const currentBoard = chess.createBoardFromMoveHistory(game.moveHistory)
    const isLegalMove = chess.playMove(currentBoard, move) !== false
    if (isLegalMove){
      try {
      const updatedGame = await Game.findByIdAndUpdate(request.params.id, 
        { $push: { moveHistory: move }},
        { new: true, runValidators: true })
        response.json(updatedGame)
      } catch (error){
        next(error)
      }
    }
  } catch (error) {
    console.log("Unable to validate move")
    next(error)
  }
})

app.delete('/api/games/:id/moves', async (request, response, next) => {
  try {
    const updatedGame = await Game.updateOne(
        { _id: request.params.id },
        { $pop: { moveHistory: 1 }},
        { new: true })
        response.json(updatedGame)
  } catch (error){
    next (error)
  }
})

app.delete('/api/games/:id/new', async (request, response, next) => {
  try {
    const newGame = await Game.updateOne(
        { _id: request.params.id },
        { $set: { moveHistory: [] }},
        { new: true })
    response.json(newGame)
  } catch (error){
    console.log("Could not start new game")
    next(error)
  }
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
