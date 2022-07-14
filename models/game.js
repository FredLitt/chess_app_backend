const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const moveSchema = new mongoose.Schema({

  piece: {
    type: {
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
    },
  },

  from: {
    type: String,
    required: true,
      validate: {
      validator: function(x){
        return /[a-h][1-8]/.test(x)
      },
    },
  },

  to: {
    type: String,
    required: true,
      validate: {
      validator: function(x){
        return /[a-h][1-8]/.test(x)
      },
    },
  },

  data: {
    type: [String]
  },

  promotion: {
    type: {
      type: String,
      validate: {
        validator: function(x){
          return /|^knight$|^bishop$|^rook$|^queen$|/g.test(x)
        },
        message: '{VALUE] is not a valid piece type'
      },
    },
    color: {
      type: String,
      validate: {
        validator: function(x){
          return /^white$|^black$/g.test(x)
        },
      },
    }
  }

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
