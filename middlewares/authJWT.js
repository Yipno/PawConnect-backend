const jwt = require('jsonwebtoken');

const authJwt = (req, res, next) => {
  //Get the token from the authorization header in the HTTP request
  const authHeader = req.headers.authorization;

  //Check if the token is present in the request headers
  if (!authHeader) {
    return res.status(401).json({ result: false, error: 'Token manquant' });
  }

  //we take the token part only becuase the header is in the format "Bearer, token"
  const token = authHeader.split(' ')[1];

  try {
    //take userId and role from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();//pass to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ result: false, error: 'Token invalide ou expiré' });
  }
};

module.exports = authJwt;