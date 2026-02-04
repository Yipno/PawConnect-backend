const animalsService = require('../services/animals.service');
const cloudinary = require('cloudinary').v2;
const uniqid = require('uniqid');
const fs = require('fs');

const getAllAnimals = async (req, res) => {
  try {
    const animals = await animalsService.getAllAnimals();
    res.status(200).json({ result: true, reports: animals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
};

const addAnimal = async (req, res) => {

  console.log('USER ID:', req.userId);
  console.log('HEADERS:', req.headers.authorization);

  try {
    const parsedData = JSON.parse(req.body.data);

    if (!req.files?.photoReport || !req.userId) {
      return res.status(400).json({ result: false, error: 'Données manquantes' });
    }

    const photoPath = `./tmp/${uniqid()}.jpg`;
    await req.files.photoReport.mv(photoPath);

    const upload = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);

    const animal = await animalsService.createReport({
      data: parsedData,
      photoUrl: upload.secure_url,
      userId: req.userId,
    });

    res.status(201).json({ result: true, animal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
};

const updateAnimal = async (req, res) => {
  try {
    if (req.role !== 'agent') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    const { id } = req.params;
    const { status, description, establishment } = req.body;
    const agentId = req.userId;

    if (!status || !agentId) {
      return res.status(400).json({
        result: false,
        error: 'Champs manquants',
      });
    }

    const updatedAnimal = await animalsService.updateAnimalReport({
      animalId: id,
      status,
      description,
      establishment,
      agentId,
    });

    res.json({
      result: true,
      animal: updatedAnimal,
    });
  } catch (err) {
    console.error(err);

    if (err.code) {
      return res.status(err.code).json({
        result: false,
        error: err.message,
      });
    }

    res.status(500).json({
      result: false,
      error: 'Erreur serveur',
    });
  }
};

module.exports = {
  getAllAnimals,
  addAnimal,
  updateAnimal,
};
