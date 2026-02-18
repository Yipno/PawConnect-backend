const repository = require('../repositories/establishment.repo');

async function getEstablishments(payload) {
  if (payload.role === 'agent' && payload.establishmentId) {
    const establishment = await repository.findById(payload.establishmentId);
    return establishment ? [establishment] : [];
  }
  return await repository.findAll();
}

async function createEstablishment(establishment) {
  return await repository.createEstablishment(establishment);
}

module.exports = { getEstablishments, createEstablishment };
