const establishmentRepo = require('../repositories/establishment.repo');

async function list(req, res, next) {
  try {
    const establishments = await establishmentRepo.findAll();
    return res.status(200).json({ establishments });
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  const { id, name, address, location, phone, email, logo, url } = req.body;
  try {
    const establishment = await establishmentRepo.createEstablishment({
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
    return res.status(201).json({ establishment });
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, create };
