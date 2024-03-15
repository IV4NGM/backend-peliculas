require('dotenv').config({ path: '../../.env' })
require('colors')
const axios = require('axios')

const connectDB = require('../config/db')
const Movie = require('../models/moviesModel')

connectDB()

const URL = `${process.env.API_URL}/movie/popular?language=es&api_key=${process.env.API_KEY}`
const URLPageTwo = URL + '&page=2'

const getMovies = async () => {
  try {
    const response = await axios.get(URL)
    if (response.status === 200) {
      const moviesArray = response.data.results
      await Promise.allSettled(moviesArray.map((movie) => {
        return Movie.create({ ...movie, movie_id: movie.id })
      }))
      console.log('Películas creadas')
    }
  } catch (error) {
    console.log(error)
  }
}

const getMoviesPageTwo = async () => {
  try {
    const response = await axios.get(URLPageTwo)
    if (response.status === 200) {
      const moviesArray = response.data.results.slice(0, 12)
      await Promise.allSettled(moviesArray.map((movie) => {
        return Movie.create({ ...movie, movie_id: movie.id })
      }))
      console.log('Películas creadas')
    }
  } catch (error) {
    console.log(error)
  }
}

getMovies()
getMoviesPageTwo()
