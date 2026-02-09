const express = require('express');
const router = express.Router();
const {
  validateReportBody,
  validateHistoryBody,
  validatePhotoURL,
} = require('../middlewares/animal.validators');
const controller = require('../controllers/animal.controller');
const { rateLimiter } = require('../utils/rateLimiter');
const authJWT = require('../middlewares/authJWT');

router.get('/me', authJWT, rateLimiter, controller.getUserReports);

// POST new report without the picture
router.post('/new', authJWT, rateLimiter, validateReportBody, controller.postNewReport);

// Add the pictureURL to the report by ID
router.patch('/:id/addPhoto', authJWT, rateLimiter, validatePhotoURL, controller.addPhotoToReport);

// Update the history of a report by ID
router.patch('/:id/update', authJWT, rateLimiter, validateHistoryBody, controller.updateHistory);

module.exports = router;
