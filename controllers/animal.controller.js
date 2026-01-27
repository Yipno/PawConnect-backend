const animalService = require('../services/animal.service');

async function postNewReport(req, res, next) {
  const { title, desc, location, state, animalType } = req.body;
  const userId = req.userId;

  try {
    const result = await animalService.newReport(userId, title, desc, location, state, animalType);
    // return reportId to proceed to photo upload
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function addPhotoToReport(req, res, next) {
  const { photoUrl } = req.body;
  const userId = req.userId;
  const reportId = req.params.id;
  try {
    const result = await animalService.addPhotoUrlToReport(userId, reportId, photoUrl);
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateHistory(req, res, next) {
  const reportId = req.params.id;
  const { status, description } = req.body;
  const handler = {
    userId: req.userId,
    role: req.role,
    establishmentId: req.establishmentId,
  };
  try {
    const result = await animalService.updateHistory(reportId, status, description, handler);
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { postNewReport, addPhotoToReport, updateHistory };
