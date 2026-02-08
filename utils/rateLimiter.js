const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: { error: 'TOO_MANY_REQUESTS' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'TOO_MANY_ATTEMPT' },
});

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: {
    error: 'TOO_MANY_ATTEMPT',
  },
});

module.exports = { globalLimiter, authLimiter, rateLimiter };
