const Animal = require('../models/Animal.model');

async function newReport(report) {
  const savedReport = await new Animal(report).save();
  return savedReport ? savedReport._id : null;
}

async function isReporterValid(userId, reportId) {
  const result = await Animal.findById(reportId).select('reporter').lean();
  if (!result) {
    throw new Error('REPORT_NOT_FOUND');
  }
  if (String(result.reporter) === String(userId)) return true;
  return false;
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
  const updated = await Animal.findByIdAndUpdate(
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
}

module.exports = { newReport, isReporterValid, patchReportWithPhoto, updateHistory };
