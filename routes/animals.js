var express = require('express');
var router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

const Animal = require('../models/animals');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const { setPriority } = require('../modules/setPriority');
const { checkRoleCivil } = require('../middleware/checkRoleCivil');
const { getUserIdWithToken } = require('../middleware/getUserIdWithToken');

router.get('/civil/:token', checkRoleCivil, (req, res) => {
  // req.user vient du middleware checkRoleCivil (req.user = user).
  // Pour chercher les animaux de cet utilisateur,
  // on doit utiliser req.user._id car Mongo attend un ObjectId.
  Animal.find({ reporter: req.user._id })
    .sort({ date: -1 })
    .then(data => {
      if (!data || data.length === 0) {
        return res.json({
          result: true,
          data: [],
          message: 'Aucun signalement trouvé pour cet utilisateur.',
        });
      }

      res.json({ result: true, data });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});

// GET ALL ANIMAL REPORTS
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find().sort({ date: -1 });
    res.json({ result: true, reports: animals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

//GET ANIMAL REPORTS BY USER
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userReports = await Animal.find({ reporter: id }).sort({ date: -1 });
    res.json({ result: true, userReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

router.post('/add', getUserIdWithToken, async (req, res) => {
  if (
    !checkBody(req.data, ['location', 'animalType', 'state', 'title', 'desc']) ||
    !req.files.photoReport ||
    !req.userId
  ) {
    return res.status(400).json({ result: false, error: 'Des informations sont manquantes.' });
  }

  let photoUrl = '';
  const { location, animalType, state, title, desc } = req.data;

  try {
    // Deplacement du fichier uploadé vers un dossier temporaire
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoReport.mv(photoPath);

    if (!resultMove) {
      // upload de la photo sur Cloudinary
      const resultUpload = await cloudinary.uploader.upload(photoPath);
      // Récupération de l'URL de la photo
      photoUrl = resultUpload.secure_url;
      // Suppression du fichier temporaire
      fs.unlinkSync(photoPath);
    } else {
      return res.status(500).json({ result: false, error: "Erreur lors de l'upload de la photo" });
    }
    console.log('id', req.userId);
    const priority = setPriority(state);
    const newAnimal = new Animal({
      location,
      date: new Date().toISOString(),
      animalType,
      title,
      desc,
      state,
      priority,
      photoUrl,
      status: 'nouveau',
      reporter: req.userId,
      handlers: [],
      history: [],
    });

    const result = await newAnimal.save();
    console.log('newAnimal', result);
    res.status(200).json({ result: true, animal: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

// Route PUT /animals/:id
// Permet à un agent de mettre à jour le statut d’un signalement
// et d’ajouter une entrée dans l’historique (history)
router.put('/:id', async (req, res) => {
  try {
    // ─────────────────────────────────────────────
    // 1) Récupération des données de la requête
    // ─────────────────────────────────────────────

    // id du signalement à modifier (ex: /animals/123456...)
    const { id } = req.params;

    // Données envoyées par le frontend dans le body
    // status      → nouveau / en cours / terminé
    // description → commentaire de l’agent
    // userId      → identifiant de l’agent
    const { status, description, userId } = req.body || {};

    // ─────────────────────────────────────────────
    // 2) Vérification des champs obligatoires
    // ─────────────────────────────────────────────

    // Si le statut ou l’ID de l’agent est manquant,
    // on refuse la requête (mauvaise requête client)
    if (!status || !userId) {
      return res.status(400).json({
        result: false,
        error: 'Champs manquants',
      });
    }

    // ─────────────────────────────────────────────
    // 3) Validation basique de l’ID MongoDB
    // ─────────────────────────────────────────────

    // Un ObjectId MongoDB fait toujours 24 caractères
    // Cette vérification évite un CastError Mongoose
    if (!id || id.length !== 24) {
      return res.status(400).json({
        result: false,
        error: 'ID invalide',
      });
    }

    // ─────────────────────────────────────────────
    // 4) Création de l’entrée d’historique
    // ─────────────────────────────────────────────

    // history est un tableau de sous-documents
    // On DOIT donc ajouter un objet, jamais une string
    const historyEntry = {
      // Action affichée dans l’historique
      action: description || `Statut => ${status}`,

      // Date de l’action (Date JS → cast automatique par Mongoose)
      date: new Date(),

      // Identifiant de l’agent qui a fait l’action
      // Si le schema attend un ObjectId, Mongoose cast automatiquement
      handler: userId,
    };

    // ─────────────────────────────────────────────
    // 5) Mise à jour du document en base
    // ─────────────────────────────────────────────

    // findByIdAndUpdate permet :
    // - d’éviter un .save() qui revaliderait TOUT le document
    // - d’éviter les erreurs sur d’anciens champs invalides (ex: priority enum)
    const updated = await Animal.findByIdAndUpdate(
      id,
      {
        // Mise à jour du statut
        $set: { status },

        // Ajout de l’entrée d’historique AU DÉBUT du tableau
        $push: {
          history: {
            $each: [historyEntry],
            $position: 0,
          },
        },
      },
      {
        // new: true → renvoie le document après mise à jour
        new: true,
      }
    );

    // ─────────────────────────────────────────────
    // 6) Si aucun document trouvé
    // ─────────────────────────────────────────────

    // Si l’ID est valide mais qu’aucun animal n’existe avec cet ID
    if (!updated) {
      return res.status(404).json({
        result: false,
        error: 'Signalement introuvable',
      });
    }

    // ─────────────────────────────────────────────
    // 7) Réponse OK
    // ─────────────────────────────────────────────

    // On renvoie le signalement mis à jour
    return res.json({
      result: true,
      animal: updated,
    });
  } catch (err) {
    // ─────────────────────────────────────────────
    // 8) Gestion des erreurs serveur
    // ─────────────────────────────────────────────

    // Toute erreur non prévue arrive ici
    console.error('PUT /animals/:id ERROR =>', err);

    return res.status(500).json({
      result: false,
      error: 'Erreur serveur',
    });
  }
});

router.get('/test/:id', async (req, res) => {
  const { id } = req.params;
  const reports = await Animal.find({ reporter: id })
    .populate({
      path: 'handlers',
      select: 'firstName lastName establishmentRef',
      populate: {
        path: 'establishmentRef',
        select: 'name address location phone email logo url',
      },
    })
    .sort({ date: -1 });
  res.json({ result: true, reports });
});

module.exports = router;
