const express = require('express');
const router = express.Router();
const {
  validateReportBody,
  validateHistoryBody,
  validatePhotoURL,
} = require('../middlewares/animal.validators');
const controller = require('../controllers/animal.controller');
const { apiLimiter } = require('../utils/rateLimiter');
const authJWT = require('../middlewares/auth.middleware');

router.get('/me', authJWT, apiLimiter, controller.getUserReports);

router.post('/', authJWT, apiLimiter, validateReportBody, controller.postNewReport);

router.patch('/:id/photo', authJWT, apiLimiter, validatePhotoURL, controller.addPhotoToReport);

router.patch('/:id', authJWT, apiLimiter, validateHistoryBody, controller.updateHistory);

module.exports = router;
