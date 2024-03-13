const { Router } = require('express')
const router = Router()
const { createUser, sendVerificationEmail, verifyUser, loginUser, getUser, getAllUsers, updateUser, deleteUser } = require('@/controllers/usersControllers')
const { protect, adminProtect } = require('@/middleware/authMiddleware')

router.post('/', createUser)
router.post('/login', loginUser)
router.post('/send-verification-email', sendVerificationEmail)
router.get('/verify/:id/:token', verifyUser)
router.get('/', protect, getUser)
router.get('/all', protect, adminProtect, getAllUsers)
router.put('/', protect, updateUser)
router.delete('/', protect, deleteUser)

module.exports = router
