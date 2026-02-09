const mongoose = require('mongoose');
const userRepo = require('../repositories/user.repo');

function assertValidObjectId(id, errorCode = 'INVALID_ID') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(errorCode);
  }
}

async function assertUserExists(userId) {
  assertValidObjectId(userId, 'INVALID_USER_ID');
  const exists = await userRepo.existsById(userId);
  if (!exists) {
    throw new Error('USER_NOT_FOUND');
  }
}

module.exports = { assertValidObjectId, assertUserExists };
