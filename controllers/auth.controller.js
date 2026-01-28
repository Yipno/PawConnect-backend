const authService = require('../services/auth.service');

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function signup(req, res, next) {
  const { lastName, firstName, email, password, role, establishmentId } = req.body;

  try {
    const result = await authService.signup(
      lastName,
      firstName,
      email,
      password,
      role,
      establishmentId,
    );
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, signup };
