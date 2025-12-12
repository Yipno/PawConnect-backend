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
            lastName: savedUser.lastName,
            email: savedUser.email,
            role: savedUser.role,
            token: savedUser.token,
            establishmentRef: savedUser.establishmentRef,
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
      user: {
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        token: data.token,
        establishmentRef: data.establishmentRef,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, error: 'Probleme avec la base de données' });
  }
});

// ROUTE TEST
router.get('/', async (req, res) => {
  const data = await User.find();
  res.json({ result: true, data });
});
//ROUTE UPDATE PROFILE
router.put('/updateProfile', (req, res) => {
  const { token, firstName, lastName, password, establishmentRef, email, phone } = req.body;

  if (!token) {
    return res.status(400).json({ result: false, error: 'Token requis pour identification' });
  }

  if (password && password.length < 6) {
    return res.json({ result: false, error: 'Password avec 6 éléments minimun' });
  }
  // Refuser champs vides si ils sont envoyés
  const fields = { firstName, lastName, email, phone, establishmentRef, password };
  for (const key in fields) {
    if (fields[key] !== undefined && fields[key] === '') {
      return res.json({ result: false, error: `${key} ne peut pas être vide` });
    }
  }

  // Chercher l’utilisateur par token
  User.findOne({ token })
    .then(user => {
      if (!user) {
        return res.status(404).json({ result: false, error: 'Utilisateur non trouvé' });
      }

      const updatedFields = {};
      if (firstName) updatedFields.firstName = firstName;
      if (lastName) updatedFields.lastName = lastName;
      if (email) updatedFields.email = email;
      if (phone) updatedFields.phone = phone;
      if (establishmentRef) updatedFields.establishmentRef = establishmentRef;

      if (password) updatedFields.password = bcrypt.hashSync(password, 10);

      User.findByIdAndUpdate(user._id, updatedFields, { new: true })
        .then(updatedProfile => {
          res.json({
            result: true,
            user: {
              id: updatedProfile._id,
              firstName: updatedProfile.firstName,
              lastName: updatedProfile.lastName,
              email: updatedProfile.email,
              role: updatedProfile.role,
              token: updatedProfile.token,
              establishmentRef: updatedProfile.establishmentRef,
            },
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ result: false, error: 'Erreur serveur' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});

module.exports = router;
