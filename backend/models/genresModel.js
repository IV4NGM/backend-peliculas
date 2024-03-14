const mongoose = require('mongoose')

const genreSchema = mongoose.Schema({
  genre_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Genre', genreSchema)
