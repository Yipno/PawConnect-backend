const { AuthError } = require('../services/auth.service');

function errorHandler(err, req, res, next) {
  if (err instanceof AuthError) {
    return res.status(err.httpStatus).json({ error: err.code });
  }
  console.error(err);
  return res.status(500).json({ error: err.error || 'SERVER_ERROR' });
}

module.exports = errorHandler;
