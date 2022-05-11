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
      validator: function(x){
        return /^pawn$|^knight$|^bishop$|^rook$|^queen$|^king$/g.test(x)
      },
      message: '{VALUE] is not a valid piece type'
  },
  color: {
    type: String,
    validator: function(x){
      return /^white$|^black$/g.test(x)
    },
  },
  from: [Number],
  to: [Number] 
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

module.exports = mongoose.model("Game", gameSchema)