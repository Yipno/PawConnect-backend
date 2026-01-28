const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'TOO_MANY_ATTEMPT' },
});

module.exports = { rateLimiter };
