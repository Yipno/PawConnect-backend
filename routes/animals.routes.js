const express = require('express');
const router = express.Router();
const {
  validateReportBody,
  validateHistoryBody,
  validatePhotoURL,
} = require('../middleware/animal.validators');
const {
  postNewReport,
  addPhotoToReport,
  updateHistory,
} = require('../controllers/animal.controller');
const authJWT = require('../middleware/authJWT');

// POST new report without the picture
router.post('/new', authJWT, validateReportBody, postNewReport);

// Add the pictureURL to the report by ID
router.patch('/:id/addPhoto', authJWT, validatePhotoURL, addPhotoToReport);

// Update the history of a report by ID
router.patch('/:id/update', authJWT, validateHistoryBody, updateHistory);

module.exports = router;
