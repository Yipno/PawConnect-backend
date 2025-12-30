const User = require('../models/users');


module.exports = async (req, res, next) => {
  const { email } = req.body;

  // Pas d’email → rien à vérifier
  if (!email) {
    return next();
  }

  try {
    // Utilisateur courant (grâce au JWT)
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({
        result: false,
        error: 'Utilisateur non trouvé',
      });
    }

    // Email inchangé → OK
    if (email === currentUser.email) {
      return next();
    }

    // Vérifier si l’email est déjà utilisé par quelqu’un d’autre
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        result: false,
        error: 'Cet email est déjà utilisé',
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      result: false,
      error: 'Erreur serveur',
    });
  }
};


{/*module.exports = (req, res, next) => {
  const { email, token } = req.body;

  // Pas d’email, pas de vérification
  if (!email) {
    return next();
  }

  User.findOne({ token }).then(user => {
    if (!user) {
      return res.status(404).json({
        result: false,
        error: 'Utilisateur non trouvé',
      });
    }

    // Email inchangé
    if (email === user.email) {
      return next();
    }

    // Vérifier unicité de l'email
    User.findOne({ email }).then(existingUser => {
      if (existingUser) {
        return res.status(409).json({
          result: false,
          error: 'Cet email est déjà utilisé',
        });
      }

      next();
    });
  });
};*/}
