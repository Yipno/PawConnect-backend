var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const checkEmailUnique = require('../middleware/checkEmailUnique');

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

  const { lastName, firstName, email, password, role, establishment } = req.body;

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
        establishment: establishment || null,
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
            establishment: savedUser.establishment,
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
        establishment: data.establishment,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ result: false, error: 'Probleme avec la base de données' });
  }
});

// ROUTE TEST
// router.get('/', async (req, res) => {
//   const users = await User.find();
//   res.json({ result: true, users });
// });

//ROUTE UPDATE PROFILE
router.put('/updateProfile', checkEmailUnique, (req, res) => {
  const { token, firstName, lastName, password, establishmentRef, email, phone } = req.body;

  if (!token) {
    return res.status(400).json({ result: false, error: 'Token requis pour identification' });
  }
  // Check the email format
  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

  // Check the password
  if (password && password.length < 6) {
    return res.json({ result: false, error: 'Password avec 6 éléments minimun' });
  }

  // Chercher l’utilisateur par token
  User.findOne({ token }).then(user => {
    if (!user) {
      return res.status(404).json({ result: false, error: 'Utilisateur non trouvé' });
    }

    // Construire l'objet des champs à mettre à jour
    const updatedFields = {};

    // prenom
    if (firstName !== undefined) {
      if (firstName.trim() === '') {
        return res.status(400).json({ result: false, error: 'Prénom vide' });
      }
      if (firstName !== user.firstName) {
        updatedFields.firstName = firstName;
      }
    }

    // nom
    if (lastName !== undefined) {
      if (lastName.trim() === '') {
        return res.status(400).json({ result: false, error: 'Nom vide' });
      }
      if (lastName !== user.lastName) {
        updatedFields.lastName = lastName;
      }
    }

    // email
    if (email !== undefined) {
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ result: false, error: 'Email invalide' });
      }
      if (email !== user.email) {
        updatedFields.email = email;
      }
    }

    // password
    if (password !== undefined && password !== '') {
      if (password.length < 6) {
        return res.status(400).json({
          result: false,
          error: 'Mot de passe minimum 6 caractères',
        });
      }
      updatedFields.password = bcrypt.hashSync(password, 10);
    }

    // option
    if (establishmentRef !== undefined && establishmentRef !== user.establishmentRef) {
      updatedFields.establishmentRef = establishmentRef || null;
    }

    // verification si aucune modification pour éviter requetes inutiles
    if (Object.keys(updatedFields).length === 0) {
      return res.json({
        result: false,
        error: 'Aucune modification détectée',
      });
    }

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
          message: 'Profil mis à jour',
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ result: false, error: 'Erreur serveur' });
      });
  });
});

router.delete('/delete', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      result: false,
      error: 'Token requis',
    });
  }

  User.findOneAndDelete({ token })
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({
          result: false,
          error: 'Utilisateur introuvable',
        });
      }

      console.log('User deleted');

      res.status(200).json({
        result: true,
        message: 'Votre compte est supprimé.',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        result: false,
        error: 'Erreur serveur',
      });
    });
});

module.exports = router;
