const User = require('../models/User.model');

async function findUserById(userId) {
  return await User.findById(userId).lean();
}

async function findUserByMail(email) {
  return await User.findOne({ email }).lean();
}

async function existsByMail(email) {
  const result = await User.exists({ email });
  return result !== null;
}

async function existsById(id) {
  const result = await User.exists({ _id: id });
  return result !== null;
}

async function findUserByMailWithPassword(email) {
  return await User.findOne({ email }).select('+password').lean();
}

async function createNewUser(user) {
  const newUser = await new User(user).save();
  return newUser;
}

module.exports = {
  findUserById,
  findUserByMail,
  existsByMail,
  existsById,
  findUserByMailWithPassword,
  createNewUser,
};
