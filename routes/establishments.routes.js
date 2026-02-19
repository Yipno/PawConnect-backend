const express = require('express');
const router = express.Router();
const controller = require('../controllers/establishment.controller');
const authJWT = require('../middlewares/auth.middleware');

router.use(authJWT);

router.get('/', controller.list);

router.post('/', controller.create);

module.exports = router;
