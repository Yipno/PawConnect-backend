const { AppError } = require('../errors/AppError');
const { getHttpStatusCode } = require('../errors/errorCodes');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res
      .status(getHttpStatusCode(err.code))
      .json({ error: err.code, message: err.message, details: err.details || [] });
  }
  console.error(err);
  // Unexpected failures always return a client-safe payload.
  return res
    .status(500)
    .json({ error: 'SERVER_ERROR', message: 'Internal server error', details: [] });
}

module.exports = errorHandler;
