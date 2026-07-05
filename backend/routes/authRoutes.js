const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.js');
const { loginUser, registerUser, loginAdmin, getMe } = require('../controllers/authController')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/admin-login', loginAdmin)
router.get('/me', protect, getMe)


module.exports = router;