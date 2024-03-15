const { Router } = require('express')
const router = Router()

const { getAllMovies, getContextMovies, likeMovie, resetLikesMovie, dislikeMovie, createMovie } = require('@/controllers/moviesControllers')
const { protect, adminProtect } = require('@/middleware/authMiddleware')

router.get('/', getAllMovies)
router.get('/all', protect, getContextMovies)

// Dar like a una película
router.get('/like/:id', protect, likeMovie)

// Dar dislike a una película
router.get('/dislike/:id', protect, dislikeMovie)

// Quitar el like y dislike de una película
router.get('/reset-likes/:id', protect, resetLikesMovie)

router.post('/', protect, adminProtect, createMovie)

module.exports = router
