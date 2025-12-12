const User = require('../models/users');

function checkRoleCivil(req, res, next) {
  const token = req.params.token;

  User.findOne({ token })
    .then(user => {
      if (!user) {
        return res.json({ result: false, error: 'Utilisateur non trouvé' });
      }

      if (user.role !== 'civil') {
        return res.json({ result: false, error: 'Accès réservé aux civils' });
      }

      // si tout est vérifié et correct, on continue la route
      req.user = user;
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
}

const getUserIdByToken = async (req, res, next) => {
  const body = JSON.parse(req.body.data);
  const token = body.token;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ result: false, error: 'Utilisateur non trouvé' });
    }
    req.userId = user._id;
    req.data = body;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
};

module.exports = { checkRoleCivil, getUserIdByToken };
