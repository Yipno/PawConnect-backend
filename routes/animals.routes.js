const express = require('express');
const router = express.Router();
const {
  validateReportBody,
  validateHistoryBody,
  validatePhotoURL,
} = require('../middlewares/animal.validators');
const {
  postNewReport,
  addPhotoToReport,
  updateHistory,
} = require('../controllers/animal.controller');
const { rateLimiter } = require('../utils/rateLimiter');
const authJWT = require('../middlewares/authJWT');

// POST new report without the picture
router.post('/new', authJWT, rateLimiter, validateReportBody, postNewReport);

// Add the pictureURL to the report by ID
router.patch('/:id/addPhoto', authJWT, rateLimiter, validatePhotoURL, addPhotoToReport);

// Update the history of a report by ID
router.patch('/:id/update', authJWT, rateLimiter, validateHistoryBody, updateHistory);

module.exports = router;
