const Animal = require('../models/Animal.model');

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

async function newReport(report) {
  const savedReport = await new Animal(report).save();
  return savedReport ? savedReport : null;
}

async function isReporterValid(userId, reportId) {
  const result = await Animal.findById(reportId).select('reporter').lean();
  if (!result) {
    return false;
  }
  return String(result.reporter) === String(userId);
}

async function patchReportWithPhoto(reportId, photoUrl) {
  const result = await Animal.findByIdAndUpdate(
    reportId,
    {
      photoUrl,
    },
    {
      new: true,
      runValidators: true,
      context: 'query',
    },
  ).lean();
  return result;
}

async function updateHistory(reportId, status, handler, payload) {
  const result = await Animal.findByIdAndUpdate(
    reportId,
    {
      // Mise à jour du statut
      $set: {
        status,
        establishment: handler.establishmentId,
        currentHandler: handler.userId,
      },

      // Ajout de l’entrée d’historique AU DÉBUT du tableau
      $push: {
        history: {
          $each: [payload],
          $position: 0,
        },
      },
    },
    {
      // new: true → renvoie le document après mise à jour
      new: true,
    },
  );
  return result;
}

module.exports = {
  newReport,
  isReporterValid,
  patchReportWithPhoto,
  updateHistory,
  getCivilianReports,
  getAgentReports,
};
