const express = require('express')
const router = express.Router()
const {registerUser,loginUser,meUser} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect,meUser)

module.exports = router