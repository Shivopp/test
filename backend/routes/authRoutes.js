const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginUser, registerUser } = require('../controllers/authController')

router.post('/register', registerUser)
router.post('/login', loginUser)


module.exports = router;