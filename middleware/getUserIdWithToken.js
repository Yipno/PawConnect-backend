const User = require('../models/users');

const getUserIdWithToken = async (req, res, next) => {
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

module.exports = { getUserIdWithToken };
