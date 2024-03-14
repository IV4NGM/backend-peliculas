require('dotenv').config({ path: '../../.env' })
require('colors')
const axios = require('axios')

const connectDB = require('../config/db')
const Genre = require('../models/genresModel')

connectDB()

const URL = `${process.env.API_URL}/genre/movie/list?language=en&api_key=${process.env.API_KEY}`

const getGenres = async () => {
  try {
    const response = await axios.get(URL)
    if (response.status === 200) {
      const genresArray = response.data.genres
      await Promise.all(genresArray.map((genre) => {
        return Genre.create({
          genre_id: genre.id,
          name: genre.name
        })
      }))
      console.log('Géneros creados')
    }
  } catch (error) {
    console.log(error)
  }
}

getGenres()
