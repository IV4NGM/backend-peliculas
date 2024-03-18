const { Router } = require('express')
const router = Router()

const { getAllGenres, getAllMovies, getContextMovies, getOneMovie, getOneMovieContext, likeMovie, resetLikesMovie, dislikeMovie, createMovie, updateMovie, deleteMovie } = require('@/controllers/moviesControllers')
const { protect, adminProtect } = require('@/middleware/authMiddleware')

router.get('/genres', getAllGenres)
router.get('/', getAllMovies)
router.get('/all', protect, getContextMovies)

router.get('/:id', getOneMovie)
router.get('/context/:id', protect, getOneMovieContext)

// Dar like a una película
router.get('/like/:id', protect, likeMovie)

// Dar dislike a una película
router.get('/dislike/:id', protect, dislikeMovie)

// Quitar el like y dislike de una película
router.get('/reset-likes/:id', protect, resetLikesMovie)

router.post('/', protect, adminProtect, createMovie)
router.put('/:id', protect, adminProtect, updateMovie)
router.delete('/:id', protect, adminProtect, deleteMovie)

module.exports = router
