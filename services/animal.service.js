const animalRepo = require('../repositories/animal.repo');
const userRepo = require('../repositories/user.repo');
const notificationService = require('../services/notification.service');
const { setPriority } = require('../utils/setPriority');
const { getRecipientsForNewReport } = require('./report.service');
const { assertValidObjectId, assertUserExists } = require('../utils/validators');

async function newReport(userId, userRole, title, desc, location, state, animalType) {
  await assertUserExists(userId);

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
  if (!result) {
    throw new Error('REPORT_FAILED');
  }
  try {
    const agentsToNotify = await getRecipientsForNewReport(result);
    await notificationService.notifyUsers({
      recipients: agentsToNotify,
      type: 'NEW_REPORT',
      message: 'Un nouveau signalement a été effectué à proximité de votre établissement.',
      reportId: result._id,
    });
  } catch (err) {
    console.error('Failed to send notifications for new report:', err);
  }

  return result._id;
}

async function addPhotoUrlToReport(userId, reportId, photoUrl) {
  assertValidObjectId(userId, 'INVALID_USER_ID');
  assertValidObjectId(reportId, 'INVALID_REPORT_ID');

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
  assertValidObjectId(reportId, 'INVALID_REPORT_ID');
  assertValidObjectId(handler.userId, 'INVALID_USER_ID');

  if (handler.role !== 'agent') {
    throw new Error('FORBIDDEN');
  }

  assertValidObjectId(handler.establishmentId, 'INVALID_ESTABLISHMENT_ID');

  const handlerDetails = await userRepo.findUserById(handler.userId);
  if (!handlerDetails) {
    throw new Error('USER_NOT_FOUND');
  }

  if (String(handlerDetails.establishment) !== String(handler.establishmentId)) {
    throw new Error('INVALID_ESTABLISHMENT');
  }

  const payload = {
    date: new Date(),
    status,
    action,
    handler: handler.userId,
  };

  const result = await animalRepo.updateHistory(reportId, status, handler, payload);
  if (!result) {
    throw new Error('UPDATE_FAILED');
  }

  try {
    await notificationService.notifyUsers({
      recipients: [result.reporter],
      type: 'REPORT_UPDATE',
      message: `Le statut de votre signalement "${result.title}" a été mis à jour : ${status}.`,
      reportId: result._id,
    });
  } catch (err) {
    console.error('Failed to send notification for report update:', err);
  }

  return result;
}

async function getUserReports(userId, role, establishmentId) {
  if (role === 'civil') {
    const result = await animalRepo.getCivilianReports(userId);
    return result;
  } else if (role === 'agent') {
    const result = await animalRepo.getAgentReports(establishmentId);
    return result;
  }
}

module.exports = { getUserReports, newReport, addPhotoUrlToReport, updateHistory };
