var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

const Animal = require('../models/animals');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const { setPriority } = require('../modules/setPriority');
const { checkRoleCivil } = require('../middleware/checkRoleCivil');
const { getUserIdWithToken } = require('../middleware/getUserIdWithToken');

router.get('/civil/:token', checkRoleCivil, (req, res) => {
  // req.user vient du middleware checkRoleCivil (req.user = user).
  // Pour chercher les animaux de cet utilisateur,
  // on doit utiliser req.user._id car Mongo attend un ObjectId.
  Animal.find({ reporter: req.user._id })
    .sort({ date: -1 })
    .then(data => {
      if (!data || data.length === 0) {
        return res.json({
          result: true,
          data: [],
          message: 'Aucun signalement trouvé pour cet utilisateur.',
        });
      }

      res.json({ result: true, data });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});

// GET ALL ANIMAL REPORTS
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find().sort({ date: -1 });
    res.json({ result: true, reports: animals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

//GET ANIMAL REPORTS BY USER
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userReports = await Animal.find({ reporter: id }).sort({ date: -1 });
    res.json({ result: true, userReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

router.post('/add', getUserIdWithToken, async (req, res) => {
  if (
    !checkBody(req.data, ['location', 'animalType', 'state', 'title', 'desc']) ||
    !req.files.photoReport ||
    !req.userId
  ) {
    return res.status(400).json({ result: false, error: 'Des informations sont manquantes.' });
  }

  let photoUrl = '';
  const { location, animalType, state, title, desc } = req.data;

  try {
    // Deplacement du fichier uploadé vers un dossier temporaire
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoReport.mv(photoPath);

    if (!resultMove) {
      // upload de la photo sur Cloudinary
      const resultUpload = await cloudinary.uploader.upload(photoPath);
      // Récupération de l'URL de la photo
      photoUrl = resultUpload.secure_url;
      // Suppression du fichier temporaire
      fs.unlinkSync(photoPath);
    } else {
      return res.status(500).json({ result: false, error: "Erreur lors de l'upload de la photo" });
    }
    console.log('id', req.userId);
    const priority = setPriority(state);
    const newAnimal = new Animal({
      location,
      date: new Date().toISOString(),
      animalType,
      title,
      desc,
      state,
      priority,
      photoUrl,
      status: 'nouveau',
      reporter: req.userId,
      handlers: [],
      history: [],
    });

    const result = await newAnimal.save();
    console.log('newAnimal', result);
    res.status(200).json({ result: true, animal: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

module.exports = router;
