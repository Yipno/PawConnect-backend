const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { signup } = require('../controllers/auth.controller');
const { validateLoginBody, validateSignupBody } = require('../middlewares/auth.validators');
const { authLimiter } = require('../utils/rateLimiter');

router.use(authLimiter); // Apply rate limiter to all routes in this router

router.post('/login', validateLoginBody, login);

router.post('/signup', validateSignupBody, signup);

module.exports = router;
