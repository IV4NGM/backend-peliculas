require('dotenv').config({ path: '../../.env' })
require('colors')
const axios = require('axios')

const connectDB = require('../config/db')
const Movie = require('../models/moviesModel')

connectDB()

const movieData = {
  "adult": false,
  "backdrop_path": "/pwGmXVKUgKN13psUjlhC9zBcq1o.jpg",
  "genre_ids": [
  28,
  14
  ],
  "id": 634492,
  "original_language": "en",
  "original_title": "Madame Web",
  "overview": "Cassandra Webb es una paramédica en Manhattan que podría tener habilidades clarividentes. Obligada a enfrentarse a sucesos que se han revelado de su pasado, crea una relación con tres jóvenes destinadas a tener un futuro poderoso... si consiguen sobrevivir a un presente mortal.",
  "popularity": 833.965,
  "poster_path": "/8enikn5rdpsVyQd1qnpOqpACZqO.jpg",
  "release_date": "2024-02-14",
  "title": "Madame Web",
  "video": false,
  "vote_average": 5.445,
  "vote_count": 544
}

const insertMovie = async () => {
  try {
      await Movie.create({ ...movieData, movie_id: movieData.id })
      console.log('Película creada')
  } catch (error) {
    console.log(error)
  }
}

insertMovie()