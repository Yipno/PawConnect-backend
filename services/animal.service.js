const animalRepo = require('../repositories/animal.repo');
const userRepo = require('../repositories/user.repo');
const { setPriority } = require('../utils/setPriority');
const mongoose = require('mongoose');

async function newReport(userId, userRole, title, desc, location, state, animalType) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('INVALID_USER_ID');
  }

  const userExists = await userRepo.existsById(userId);
  if (!userExists) {
    throw new Error('INVALID_USER_ID');
  }

  if (userRole === 'agent') {
    throw new Error('FORBIDDEN');
  }

  const priority = setPriority(state);
  const newAnimal = {
    location,
    date: new Date(),
    animalType,
    title,
    desc,
    state,
    priority,
    photoUrl: null,
    status: 'nouveau',
    reporter: userId,
    history: [],
  };
  const result = await animalRepo.newReport(newAnimal);
  return result;
}

async function addPhotoUrlToReport(userId, reportId, photoUrl) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('INVALID_USER_ID');
  }

  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    throw new Error('INVALID_REPORT_ID');
  }

  const isUserValid = await animalRepo.isReporterValid(userId, reportId);
  if (!isUserValid) {
    throw new Error('FORBIDDEN');
  }

  const result = await animalRepo.patchReportWithPhoto(reportId, photoUrl);
  if (!result) {
    throw new Error('UPDATE_FAILED');
  }

  return result;
}

async function updateHistory(reportId, status, action, handler) {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    throw new Error('INVALID_REPORT_ID');
  }

  if (!mongoose.Types.ObjectId.isValid(handler.userId)) {
    throw new Error('INVALID_USER_ID');
  }

  if (handler.role !== 'agent') {
    throw new Error('FORBIDDEN');
  }

  if (!mongoose.Types.ObjectId.isValid(handler.establishmentId)) {
    throw new Error('INVALID_ESTABLISHMENT_ID');
  }

  const handlerInfos = await userRepo.findUserById(handler.userId);
  if (!handlerInfos) {
    throw new Error('USER_NOT_FOUND');
  }

  if (String(handlerInfos.establishment) !== String(handler.establishmentId)) {
    throw new Error('INVALID_ESTABLISHMENT');
  }

  const payload = {
    date: new Date(),
    status,
    action,
    handler: handler.userId,
  };

  const result = await animalRepo.updateHistory(reportId, status, handler, payload);
  return result;
}

module.exports = { newReport, addPhotoUrlToReport, updateHistory };
