var express = require('express');
var router = express.Router();
const Establishment = require('../models/establishments');

router.get('/', async (req, res) => {
  const result = await Establishment.find();
  res.json({ result: true, result });
});

router.post('/new', async (req, res) => {
  const { id, name, address, location, phone, email, logo, url } = req.body;
  const newEstablishment = new Establishment({
    admin: id,
    name,
    address,
    location,
    phone,
    email,
    logo,
    url,
    agents: [id],
  });
  const result = await newEstablishment.save();
  res.json({ result: true, result });
});

module.exports = router;
