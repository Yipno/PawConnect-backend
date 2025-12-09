var express = require('express');
var router = express.Router();

require('../models/connection');
const Animal = require('../models/animals');
const User = require('../models/users');

const checkRoleCivil = require('../middleware/checkRoleCivil');

router.get('/civil/:token', checkRoleCivil, (req, res) => {
  // req.user vient du middleware checkRoleCivil (req.user = user).
  // Pour chercher les animaux de cet utilisateur,
  // on doit utiliser req.user._id car Mongo attend un ObjectId.
  Animal.find({ reporter: req.user._id })
    .then((data) => {
      if (!data || data.length === 0) {
        return res.json({
          result: true,
          data: [],
          message: 'Aucun signalement trouvé pour cet utilisateur.',
        });
      }

      res.json({ result: true, data });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});

module.exports = router;
