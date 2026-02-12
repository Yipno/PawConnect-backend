const jwt = require('jsonwebtoken');
const { AuthError } = require('../services/auth.service');

const authJwt = (req, res, next) => {
  //Get the token from the authorization header in the HTTP request
  const authHeader = req.headers.authorization;

  // Check if secret key is configured
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthError('MISCONFIGURED_AUTH', 'JWT secret is missing', 500);
  }

  //Check if the token is present in the request headers
  if (!authHeader) {
    return next(new AuthError('TOKEN_MISSING', 'Token missing', 401));
  }

  // Expect "Bearer <token>"
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AuthError('INVALID_AUTH_HEADER', 'Invalid auth header', 401));
  }

  try {
    //take userId and role from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    if (decoded.establishmentId) {
      req.establishmentId = decoded.establishmentId;
    }
    next(); //pass to the next middleware or route handler
  } catch (err) {
    return next(new AuthError('INVALID_OR_EXPIRED_TOKEN', 'Invalid or expired token', 401));
  }
};

module.exports = authJwt;
