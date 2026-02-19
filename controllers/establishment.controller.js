const service = require('../services/establishment.service');

async function list(req, res, next) {
  const role = req.role;
  const establishmentId = req.establishmentId;

  const payload = { role, establishmentId };

  try {
    const establishments = await service.getEstablishments(payload);
    return res.status(200).json({ establishments });
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  const { id, name, address, location, phone, email, logo, url } = req.body;
  try {
    const establishment = await service.createEstablishment({
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
