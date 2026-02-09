// // const express = require('express');
// // const router = express.Router();

// // const User = require('../models/User.model');
// // const { checkBody } = require('../modules/checkBody');
// // const bcrypt = require('bcrypt');
// // const checkEmailUnique = require('../middleware/checkEmailUnique');

// // const jwt = require('jsonwebtoken');
// // const authJwt = require('../middleware/authJWT');

// //SIGNUP ROUTE

// // router.post('/signup', (req, res) => {
// //   if (!checkBody(req.body, ['lastName', 'firstName', 'email', 'password'])) {
// //     res.status(400).json({ result: false, error: 'Des informations sont manquantes.' });
// //     return;
// //   }

// //   const { lastName, firstName, email, password, role, establishment } = req.body;

// //   // Check the email format
// //   const EMAIL_REGEX =
// //     /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
// //   if (!EMAIL_REGEX.test(email)) {
// //     return res.status(400).json({ result: false, error: 'Email invalide.' });
// //   }

// //   // Check the length of password
// //   if (password.length < 6) {
// //     return res.status(400).json({
// //       result: false,
// //       error: 'Le mot de passe doit contenir au moins 6 caractères.',
// //     });
// //   }

// //   // Check if the user has not already been registered by this email
// //   User.findOne({ email: req.body.email }).then(data => {
// //     if (data === null) {
// //       const hash = bcrypt.hashSync(req.body.password, 10);

// //       const newUser = new User({
// //         lastName,
// //         firstName,
// //         email,
// //         password: hash,
// //         createdAt: Date.now(),
// //         role: role || 'civil',
// //         establishment: establishment || null,
// //       });

// //       newUser.save().then(() => {
// //         return res.json({
// //           result: true,
// //           message: 'Utilisateur créé avec succès',
// //         });
// //       });
// //     } else {
// //       res.status(400).json({ result: false, error: 'Cet email est déjà utilisé' });
// //     }
// //   });
// // });
// // const { login } = require('../controllers/auth.controller');
// // // ROUTE LOGIN
// // router.post('/login', login);
// // router.post('/auth', async (req, res) => {
// //   if (!checkBody(req.body, ['email', 'password'])) {
// //     res.status(400).json({ result: false, error: 'Des informations sont manquantes.' });
// //     return;
// //   }

// //   const { email, password } = req.body;

// //   try {
// //     // look for user
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(404).json({ result: false, error: 'Utilisateur introuvable' });
// //     }

// //     const passwordMatch = bcrypt.compareSync(password, user.password);
// //     if (!passwordMatch) {
// //       return res.status(403).json({ result: false, error: 'Mot de passe incorrect' });
// //     }

// //     //Create JWT token
// //     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
// //       expiresIn: '12h',
// //     });

// //     // if user's found & password's ok send back user's infos to frontend
// //     res.json({
// //       result: true,
// //       token, //JWT token
// //       user: {
// //         id: user._id,
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         email: user.email,
// //         role: user.role,
// //         establishment: user.establishment,
// //       },
// //     });
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ result: false, error: 'Probleme avec la base de données' });
// //   }
// // });

// // ROUTE TEST
// // router.get('/', async (req, res) => {
// //   const users = await User.find();
// //   res.json({ result: true, users });
// // });

// //ROUTE UPDATE PROFILE
// // router.put('/updateProfile', authJwt, async (req, res) => {
// //   const { firstName, lastName, password, establishment, email } = req.body;

// //   // Check the email format
// //   const EMAIL_REGEX =
// //     /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

// //   try {
// //     // récupérer l'utilisateur courant via JWT
// //     const user = await User.findById(req.userId);
// //     if (!user) {
// //       return res.status(404).json({ result: false, error: 'Utilisateur introuvable' });
// //     }

// //     // Construire l'objet des champs à mettre à jour
// //     const updatedFields = {};

// //     // prenom
// //     if (firstName !== undefined) {
// //       if (firstName.trim() === '') {
// //         return res.status(400).json({ result: false, error: 'Prénom vide' });
// //       }
// //       if (firstName !== user.firstName) {
// //         updatedFields.firstName = firstName;
// //       }
// //     }

// //     // nom
// //     if (lastName !== undefined) {
// //       if (lastName.trim() === '') {
// //         return res.status(400).json({ result: false, error: 'Nom vide' });
// //       }
// //       if (lastName !== user.lastName) {
// //         updatedFields.lastName = lastName;
// //       }
// //     }

// //     // email
// //     if (email !== undefined) {
// //       if (!EMAIL_REGEX.test(email)) {
// //         return res.status(400).json({ result: false, error: 'Email invalide' });
// //       }
// //       if (email !== user.email) {
// //         updatedFields.email = email;
// //       }
// //     }

// //     // password
// //     if (password !== undefined && password !== '') {
// //       if (password.length < 6) {
// //         return res.status(400).json({
// //           result: false,
// //           error: 'Mot de passe minimum 6 caractères',
// //         });
// //       }
// //       updatedFields.password = bcrypt.hashSync(password, 10);
// //     }

// //     // option
// //     if (establishment !== undefined && establishment !== user.establishment) {
// //       updatedFields.establishment = establishment || null;
// //     }

// //     // verification si aucune modification pour éviter requetes inutiles
// //     if (Object.keys(updatedFields).length === 0) {
// //       return res.json({
// //         result: false,
// //         error: 'Aucune modification détectée',
// //       });
// //     }

// //     const updatedProfile = await User.findByIdAndUpdate(
// //       req.userId, // JWT token
// //       updatedFields,
// //       { new: true },
// //     );
// //     res.json({
// //       result: true,
// //       user: {
// //         id: updatedProfile._id,
// //         firstName: updatedProfile.firstName,
// //         lastName: updatedProfile.lastName,
// //         email: updatedProfile.email,
// //         role: updatedProfile.role,
// //         establishment: updatedProfile.establishment,
// //       },
// //       message: 'Profil mis à jour',
// //     });
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).json({ result: false, error: 'Erreur serveur' });
// //   }
// // });

// // router.delete('/delete', authJwt, async (req, res) => {
// //   try {
// //     await User.findByIdAndDelete(req.userId);
// //     res.json({ result: true, message: 'Compte supprimé' });
// //   } catch (err) {
// //     res.status(500).json({ result: false, error: 'Erreur serveur' });
// //   }
// // });

// module.exports = router;
