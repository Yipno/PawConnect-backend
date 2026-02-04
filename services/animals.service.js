const mongoose = require('mongoose');
const animalsRepo = require('../repositories/animals.repo');
const { setPriority } = require('../modules/setPriority');
const { getProsToNotifyNewReport } = require('./report.service');
const { notifyUsers } = require('./notifications.service');

async function getAllAnimals() {
  return await animalsRepo.findAllAnimals();
}

async function createReport({ data, photoUrl, userId }) {
  const priority = setPriority(data.state);

const animalToCreate = {
  ...data,
  date: new Date().toISOString(),
  priority,
  photoUrl,
  status: 'nouveau',
  reporter: userId,
  history: [],
};

const createdAnimal = await animalsRepo.createAnimal(animalToCreate);

const prosToNotify = await getProsToNotifyNewReport(createdAnimal);

await notifyUsers({
  recipients: prosToNotify,
  type: 'NEW_REPORT',
  message: 'Un nouveau signalement a été effectué à proximité de votre établissement.',
  reportId: createdAnimal._id,
});

return createdAnimal;
}

async function updateAnimalReport({ animalId, status, description, establishment, agentId }) {
  if (!mongoose.Types.ObjectId.isValid(animalId)) {
    throw { code: 400, message: 'ID invalide' };
  }

  const historyEntry = {
    action: description || `Statut => ${status}`,
    date: new Date(),
    handler: agentId,
  };

  const updatedAnimal = await animalsRepo.updateAnimalReport({
    animalId,
    status,
    establishment,
    handlerId: agentId,
    historyEntry,
  });

  if (!updatedAnimal) {
    throw { code: 404, message: 'Signalement introuvable' };
  }

  // Notification utilisateur
  await notifyUsers({
    recipients: [updatedAnimal.reporter],
    type: 'REPORT_UPDATE',
    message: `Le statut de votre signalement "${updatedAnimal.title}" a été mis à jour : ${status}.`,
    reportId: updatedAnimal._id,
  });

  return updatedAnimal;
}



module.exports = {
  getAllAnimals, createReport, updateAnimalReport,
};
