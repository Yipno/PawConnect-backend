const Animal = require('../models/Animal.model');

async function findAllAnimals() {
  return await Animal.find().sort({ date: -1 });
}

async function createAnimal(animalData) {
  const animal = new Animal(animalData);
  return await animal.save();
}

async function updateAnimalReport({ animalId, status, establishment, handlerId, historyEntry }) {
  return await Animal.findByIdAndUpdate(
    animalId,
    {
      $set: {
        status,
        establishment,
        currentHandler: handlerId,
      },
      $push: {
        history: {
          $each: [historyEntry],
          $position: 0,
        },
      },
    },
    { new: true }
  );
}

async function getCivilianReports(userId) {
  const reports = await Animal.find({ reporter: userId })
    .populate({
      path: 'establishment',
      select: 'name address location phone email logo url',
    })
    .sort({ date: -1 });
  return reports;
}

async function getAgentReports(userEstablishment) {
  const reports = await Animal.find({
    $or: [{ status: 'nouveau' }, { establishment: userEstablishment }],
  })
    .populate({
      path: 'currentHandler',
      select: 'firstName lastName',
    })
    .sort({ date: -1 });
  return reports;
}

module.exports = {
  findAllAnimals,
  createAnimal,
  getCivilianReports,
  getAgentReports,
  updateAnimalReport,
};
