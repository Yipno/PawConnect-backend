const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { signup } = require('../controllers/auth.controller');
const validateLoginBody = require('../middlewares/validateLogin');
const validateSignupBody = require('../middlewares/validateSignup');
const { rateLimiter } = require('../utils/rateLimiter');

// ROUTE LOGIN
router.post('/login', rateLimiter, validateLoginBody, login);

//ROUTE SIGNUP
router.post('/signup', rateLimiter, validateSignupBody, signup);

module.exports = router;
