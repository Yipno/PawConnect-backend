const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { signup } = require('../controllers/auth.controller');
const { validateLoginBody, validateSignupBody } = require('../middlewares/auth.validators');
const { authLimiter } = require('../utils/rateLimiter');

// ROUTE LOGIN
router.post('/login', authLimiter, validateLoginBody, login);

//ROUTE SIGNUP
router.post('/signup', authLimiter, validateSignupBody, signup);

module.exports = router;
