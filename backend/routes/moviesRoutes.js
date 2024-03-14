const { Router } = require('express')
const router = Router()

const { getAllMovies, getContextMovies, likeMovie, dislikeMovie } = require('@/controllers/moviesControllers')
const { protect, adminProtect } = require('@/middleware/authMiddleware')

router.get('/', getAllMovies)
router.get('/all', protect, getContextMovies)
router.get('/like/:id', protect, likeMovie)
router.get('/dislike/:id', protect, dislikeMovie)

module.exports = router
