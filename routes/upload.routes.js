const express = require('express');
const router = express.Router();
const { signatureHandler } = require('../controllers/upload.controller');
// const { authJWT } = require('../middleware/authJWT')

router.get('/signature', /*authJWT,*/ signatureHandler);

module.exports = router;
