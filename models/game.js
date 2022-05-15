const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const moveSchema = new mongoose.Schema({

  piece: {
    pieceType: {
      type: String,
      required: true,
      validate: {
        validator: function(x){
          return /^pawn$|^knight$|^bishop$|^rook$|^queen$|^king$/g.test(x)
        },
        message: '{VALUE] is not a valid piece type'
      },
    },

    color: {
      type: String,
      required: true,
      validate: {
        validator: function(x){
          return /^white$|^black$/g.test(x)
        },
      },
    }
  },

  fromSquare: {
    type: Array,
    required: true,
      validate: {
      validator: function(x){
        return /[0-7],[0-7]/.test(x)
      },
    },
  },

  toSquare: {
    type: Array,
    required: true,
      validate: {
      validator: function(x){
        return /[0-7],[0-7]/.test(x)
      },
    },
  },

})

const gameSchema = new mongoose.Schema({
    moveHistory: [ moveSchema ]
})

gameSchema.set('toJSON', {
    transform: (Document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Game = mongoose.model("Game", gameSchema)
const Move = mongoose.model("Move", moveSchema)

module.exports = { Game, Move }
