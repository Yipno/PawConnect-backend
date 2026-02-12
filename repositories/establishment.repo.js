const Establishment = require('../models/Establishment.model');

async function existsById(establishmentId) {
  const result = await Establishment.exists({ _id: establishmentId });
  return result !== null;
}

async function findAll() {
  return await Establishment.find().lean();
}

async function createEstablishment(establishment) {
  const saved = await new Establishment(establishment).save();
  return saved;
}

module.exports = { existsById, findAll, createEstablishment };
