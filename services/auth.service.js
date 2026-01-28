const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const establishmentRepo = require('../repositories/establishment.repo');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

class AuthError extends Error {
  constructor(code, message, httpStatus = 400) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

async function login(email, password) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthError('MISCONFIGURED_AUTH', 'JWT secret is missing', 500);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await userRepo.findUserByMailWithPassword(normalizedEmail);
  if (!user) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials', 401);
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials', 401);
  }

  const payload = {
    userId: String(user._id),
    role: user.role,
  };
  if (user.establishment) {
    payload.establishmentId = String(user.establishment);
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: '12h',
  });

  return {
    token, //JWT token
    user: {
      id: String(user._id),
      firstName: user.firstName,
      role: user.role,
    },
  };
}

async function signup(lastName, firstName, email, password, role, establishmentId) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const emailAlreadyUsed = await userRepo.existsByMail(normalizedEmail);
  if (emailAlreadyUsed) {
    throw new AuthError('USER_ALREADY_EXISTS', 'User already in database', 409);
  }

  if (role !== 'civil' && role !== 'agent') {
    throw new AuthError('ROLE_INVALID', 'Invalid role', 400);
  }

  if (role === 'agent') {
    if (!establishmentId || !mongoose.Types.ObjectId.isValid(establishmentId)) {
      throw new AuthError('ESTABLISHMENT_REQUIRED', 'Establishment ID required', 400);
    }

    const establishmentExists = await establishmentRepo.existsById(establishmentId);
    if (!establishmentExists) {
      throw new AuthError('ESTABLISHMENT_NOT_FOUND', 'Establishment does not exist', 404);
    }
  }

  if (role === 'civil') {
    if (establishmentId != null) {
      throw new AuthError('ESTABLISHMENT_FORBIDDEN', 'Civilians cannot have establishment', 400);
    }
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    lastName,
    firstName,
    email: normalizedEmail,
    password: hash,
    role,
    establishment: role === 'agent' ? establishmentId : null,
  };

  try {
    await userRepo.createNewUser(newUser);
  } catch (err) {
    if (err && (err.code === 11000 || err.code === 11001)) {
      throw new AuthError('USER_ALREADY_EXISTS', 'User already in database', 409);
    }
    throw err;
  }

  return { created: true };
}

module.exports = { login, signup, AuthError };
