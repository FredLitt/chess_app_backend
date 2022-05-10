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

const gameSchema = new mongoose.Schema({
    moveHistory: [
        {
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
          }
        },
        from: [Number],
        to: [Number] 
    }]
})

const personSchema = new mongoose.Schema({
    name: { 
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      validate: {
        validator: function(x) {
          return /^\d{3}-\d{3}-\d{4}$/.test(x)
        },
        message: '{VALUE} is not a valid phone number'
      },
      minLength: 8,
      required: true
    }
})


gameSchema.set('toJSON', {
    transform: (Document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Game", gameSchema)