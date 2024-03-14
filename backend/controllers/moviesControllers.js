const asyncHandler = require('express-async-handler')

const Movie = require('@/models/moviesModel')

const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL

const structureMovies = async (match) => {
  return Movie.aggregate([
    { $match: match },
    { $lookup: { from: 'genres', localField: 'genre_ids', foreignField: 'genre_id', as: 'genres' } },
    {
      $addFields:
      {
        likes_count: { $size: '$users_likes' },
        genres: {
          $map: {
            input: '$genres',
            as: 'genre',
            in: {
              _id: '$$genre._id',
              genre_id: '$$genre.genre_id',
              name: '$$genre.name'
            }
          }
        }
      }
    }
  ])
}

const cleanMovie = async (movie) => {
  movie.backdrop_path = IMAGE_BASE_URL + movie.backdrop_path
  movie.poster_path = IMAGE_BASE_URL + movie.poster_path
  delete movie.genre_ids
  delete movie.users_likes
  return movie
}

const cleanMovieContext = async (user, movie) => {
  movie.backdrop_path = IMAGE_BASE_URL + movie.backdrop_path
  movie.poster_path = IMAGE_BASE_URL + movie.poster_path
  movie.isLiked = false
  const usersLikesIds = movie.users_likes.map((user) => user._id.toString())
  if (usersLikesIds.includes(user._id.toString())) {
    movie.isLiked = true
  }
  delete movie.genre_ids
  delete movie.users_likes
  return movie
}

const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await structureMovies({ isActive: true })
  if (movies) {
    const cleanedMovies = await Promise.all(movies.map(movie => cleanMovie(movie)))
    res.status(200).json(cleanedMovies)
  } else {
    res.status(400)
    throw new Error('No se pudieron obtener las películas')
  }
})

const getContextMovies = asyncHandler(async (req, res) => {
  const user = req.user
  const movies = await structureMovies({ isActive: true })
  if (movies) {
    const cleanedMovies = await Promise.all(movies.map(movie => cleanMovieContext(user, movie)))
    res.status(200).json(cleanedMovies)
  } else {
    res.status(400)
    throw new Error('No se pudieron obtener las películas')
  }
})

const likeMovie = asyncHandler(async (req, res) => {
  const user = req.user
  const movieId = req.params.id
  try {
    const movie = await Movie.findOne({ _id: movieId })
    if (!movie || !movie.isActive) {
      res.status(400)
      throw new Error('La película no se encuentra en la base de datos')
    }

    const usersLikesIds = movie.users_likes.map((user) => user._id.toString())
    if (usersLikesIds.includes(user._id.toString())) {
      res.status(400)
      throw new Error('Ya te gusta la película')
    }

    const movieLiked = await Movie.findOneAndUpdate(
      { _id: movieId },
      {
        $push: {
          users_likes: user
        }
      },
      { new: true }
    )

    if (!movieLiked) {
      res.status(400)
      throw new Error('No se pudo dar like a la película')
    }

    const updatedMovies = await structureMovies({ _id: movieLiked._id })

    if (!updatedMovies) {
      res.status(400)
      throw new Error('No se pudo dar like a la película')
    }

    const cleanedMovie = await cleanMovieContext(user, updatedMovies[0])

    res.status(200).json(cleanedMovie)
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(404)
      throw new Error('La película no se encuentra en la base de datos')
    } else {
      res.status(res.statusCode || 400)
      throw new Error(error.message || 'No se pudo dar like a la película')
    }
  }
})

const dislikeMovie = asyncHandler(async (req, res) => {
  const user = req.user
  const movieId = req.params.id
  try {
    const movie = await Movie.findOne({ _id: movieId })
    if (!movie || !movie.isActive) {
      res.status(400)
      throw new Error('La película no se encuentra en la base de datos')
    }

    const usersLikesIds = movie.users_likes.map((user) => user._id.toString())

    if (!usersLikesIds.includes(user._id.toString())) {
      res.status(400)
      throw new Error('No te gustaba la película')
    }

    const movieDisliked = await Movie.findOneAndUpdate(
      { _id: movieId },
      {
        $pull: {
          users_likes: { _id: user._id }
        }
      },
      { new: true }
    )

    if (!movieDisliked) {
      res.status(400)
      throw new Error('No se pudo dar dislike a la película')
    }

    const updatedMovies = await structureMovies({ _id: movieDisliked._id })

    if (!updatedMovies) {
      res.status(400)
      throw new Error('No se pudo dar dislike a la película')
    }

    const cleanedMovie = await cleanMovieContext(user, updatedMovies[0])

    res.status(200).json(cleanedMovie)
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(404)
      throw new Error('La película no se encuentra en la base de datos')
    } else {
      res.status(res.statusCode || 400)
      throw new Error(error.message || 'No se pudo dar dislike a la película')
    }
  }
})

module.exports = {
  getAllMovies,
  getContextMovies,
  likeMovie,
  dislikeMovie
}