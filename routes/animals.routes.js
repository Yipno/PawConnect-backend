// route GET animals/me > JWT Role > controler (http) > service agent ou civil > repo agent ou civil

// route POST animals/new > JWT/middleware > controler > service > save repo
// route PUT animals/update > jwt/middleware > controler > service > update repo
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/JWT');
const animalsController = require('../controllers/animals.controller');

router.get('/', animalsController.getAllAnimals);

router.post('/add', authJwt, animalsController.addAnimal);

router.put('/:id', authJwt, animalsController.updateAnimal);

module.exports = router;
