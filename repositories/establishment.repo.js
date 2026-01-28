const Establishment = require('../models/Establishment.model');

async function existsById(establishmentId) {
  const result = await Establishment.exists({ _id: establishmentId });
  return result !== null;
}

module.exports = { existsById };
