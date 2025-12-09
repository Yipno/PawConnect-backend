var express = require('express');
var router = express.Router();

require('../models/connection');
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

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['lastName', 'firstName', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { lastName, firstName, email, password, role, establishment_ref } = req.body;
  // Check the length of password
  if (password.length < 6) {
    return res.json({ result: false, error: 'Password must be at least 6 characters' });
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
        establishmentRef: establishment_ref || null,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, newDoc });
      });
    } else {
      res.json({ result: false, error: 'This Email is already used by an User' });
    }
  });
});

// ROUTE LOGIN
router.post('/auth', async (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
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
  const data = await User.find();
  res.json({ result: true, data });
});

module.exports = router;
