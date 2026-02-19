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

router.use(authJWT);
router.use(apiLimiter);

router.get('/me', controller.getUserReports);

router.post('/', validateReportBody, controller.postNewReport);

router.patch('/:id/photo', validatePhotoURL, controller.addPhotoToReport);

router.patch('/:id', validateHistoryBody, controller.updateHistory);

module.exports = router;
