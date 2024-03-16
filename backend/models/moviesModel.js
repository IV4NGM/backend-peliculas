const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
  adult: {
    type: Boolean,
    default: false
  },
  backdrop_path: {
    type: String,
    required: [true, 'Por favor, ingresa una imagen de fondo de la película']
  },
  genre_ids: [
    {
      type: Number,
      required: true,
      ref: 'Genre'
    }
  ],
  movie_id: {
    type: Number
  },
  original_language: {
    type: String,
    required: [true, 'Por favor, ingresa el idioma de la película']
  },
  original_title: {
    type: String,
    required: [true, 'Por favor, ingresa el título original de la película']
  },
  overview: {
    type: String,
    required: [true, 'Por favor, ingresa la descripción de la película']
  },
  popularity: {
    type: Number
  },
  poster_path: {
    type: String,
    required: [true, 'Por favor, ingresa la imagen de póster de la película']
  },
  release_date: {
    type: Date,
    required: [true, 'Por favor, ingresa la fecha de lanzamiento de la película']
  },
  title: {
    type: String,
    required: [true, 'Por favor, ingresa el título de la película']
  },
  video: {
    type: Boolean,
    default: false
  },
  vote_average: {
    type: Number
  },
  vote_count: {
    type: Number
  },
  users_likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    }
  ],
  users_dislikes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    }
  ],
  addURLPrefix: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema)
