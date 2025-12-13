var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* ---ADD Security - max 10 request by ID each 15 min --- 

const rateLimit = require('express-rate-limit');
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { result: false, error: 'Too many signup attempts, please try again later.' }
});
*/

//SIGNUP ROUTE

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['lastName', 'firstName', 'email', 'password'])) {
    res.status(400).json({ result: false, error: 'Des informations sont manquantes.' });
    return;
  }

  const { lastName, firstName, email, password, role, establishmentRef } = req.body;

  // Check the email format
  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ result: false, error: 'Email invalide.' });
  }

  // Check the length of password
  if (password.length < 6) {
    return res.status(400).json({
      result: false,
      error: 'Le mot de passe doit contenir au moins 6 caractères.',
    });
  }

  // Check if the user has not already been registered by this email
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        lastName,
        firstName,
        email,
        password: hash,
        token: uid2(32),
        createdAt: Date.now(),
        role: role || 'civil',
        establishmentRef: establishmentRef || null,
      });

      newUser.save().then(savedUser => {
        res.json({
          result: true,
          user: {
            id: savedUser._id,
            firstName: savedUser.firstName,
            role: savedUser.role,
            token: savedUser.token,
          },
        });
      });
    } else {
      res.status(400).json({ result: false, error: 'Cet email est déjà utilisé.' });
    }
  });
});

// ROUTE LOGIN
router.post('/auth', async (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.status(400).json({ result: false, error: 'Des informations sont manquantes.' });
    return;
  }

  const { email, password } = req.body;

  try {
    // look for user
    const data = await User.findOne({ email });
    if (!data) {
      return res.status(404).json({ result: false, error: 'Utilisateur introuvable' });
    }

    const passwordMatch = bcrypt.compareSync(password, data.password);
    if (!passwordMatch) {
      return res.status(403).json({ result: false, error: 'Mot de passe incorrect' });
    }
    // if user's found & password's ok send back user's infos to frontend
    res.json({
      result: true,
      user: { firstName: data.firstName, token: data.token, role: data.role, id: data._id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, error: 'Probleme avec la base de données' });
  }
});

// ROUTE TEST
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json({ result: true, users });
});

module.exports = router;
