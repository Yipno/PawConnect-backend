// // const express = require('express');
// // const router = express.Router();
// // const cloudinary = require('cloudinary').v2;
// // const fs = require('fs');
// // const uniqid = require('uniqid');
// // const Animal = require('../models/Animal.model');
// // const User = require('../models/users');
// // const { checkBody } = require('../utils/checkBody');
// // const { setPriority } = require('../utils/setPriority');
// // const authJwt = require('../middlewares/authJWT');
// // const mongoose = require('mongoose');
// // const { getProsToNotifyNewReport } = require('../services/report.service');
// // const { notifyUsers } = require('../services/notifications.service');
// // const { authJWT } = require('../middleware/authJWT');

// // router.get('/civil', authJwt, (req, res) => {
// //   // req.user vient du middleware checkRoleCivil (req.user = user).

// //   Animal.find({ reporter: req.userId })
// //     .sort({ date: -1 })
// //     .then(data => {
// //       if (!data || data.length === 0) {
// //         return res.json({
// //           result: true,
// //           data: [],
// //           message: 'Aucun signalement trouvé pour cet utilisateur.',
// //         });
// //       }

// //       res.json({ result: true, data });
// //     })
// //     .catch(err => {
// //       console.error(err);
// //       res.status(500).json({ result: false, error: 'Erreur serveur' });
// //     });
// // });

// // // Route GET /animals
// // // Permet de récupérer tous les signalements
// // router.get('/', async (req, res) => {
// //   try {
// //     const animals = await Animal.find().sort({ date: -1 });
// //     res.json({ result: true, reports: animals });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ result: false, error: 'Erreur serveur' });
// //   }
// // });

// // Route POST /animals/add
// // Permet à un utilisateur de créer un nouveau signalement
// // router.post('/add', authJwt, async (req, res) => {
// //   console.log('req.files:', req.files); //debug
// //   console.log('req.body:', req.body); //debug

// //   let parsedData;
// //   try {
// //     parsedData = JSON.parse(req.body.data);
// //   } catch (err) {
// //     return res.status(400).json({
// //       result: false,
// //       error: 'Format des données invalide.',
// //     });
// //   }

// //   let { location, animalType, state, title, desc } = parsedData;

// //   try {
// //     //transforme string to json if needed
// //     if (typeof location === 'string') {
// //       location = JSON.parse(location);
// //     }
// //     if (typeof state === 'string') {
// //       state = JSON.parse(state);
// //     }
// //   } catch (err) {
// //     return res.status(400).json({
// //       result: false,
// //       error: 'Format des données invalide.',
// //     });
// //   }

// //   if (
// //     !checkBody({ location, animalType, state, title, desc }, [
// //       'location',
// //       'animalType',
// //       'state',
// //       'title',
// //       'desc',
// //     ]) ||
// //     !req.files.photoReport ||
// //     !req.userId
// //   ) {
// //     return res.status(400).json({
// //       result: false,
// //       error: 'Des informations sont manquantes.',
// //     });
// //   }

// //   /*
// //   if (!Array.isArray(state)) {
// //     return res.status(400).json({
// //       result: false,
// //       error: 'state doit être un tableau',
// //     });
// //   }
// //   */

// //   let photoUrl = '';

// //   try {
// //     // Deplacement du fichier uploadé vers un dossier temporaire
// //     const photoPath = `./tmp/${uniqid()}.jpg`;
// //     const resultMove = await req.files.photoReport.mv(photoPath);

// //     if (!resultMove) {
// //       // upload de la photo sur Cloudinary
// //       const resultUpload = await cloudinary.uploader.upload(photoPath);
// //       // Récupération de l'URL de la photo
// //       photoUrl = resultUpload.secure_url;
// //       // Suppression du fichier temporaire
// //       fs.unlinkSync(photoPath);
// //     } else {
// //       return res.status(500).json({ result: false, error: "Erreur lors de l'upload de la photo" });
// //     }
// //     console.log('id', req.userId);

// //     const priority = setPriority(state);
// //     const newAnimal = new Animal({
// //       location,
// //       date: new Date().toISOString(),
// //       animalType,
// //       title,
// //       desc,
// //       state,
// //       priority,
// //       photoUrl,
// //       status: 'nouveau',
// //       reporter: req.userId,
// //       // establishment: null,
// //       // currentHandler: null,
// //       history: [],
// //     });

// //     const result = await newAnimal.save();
// //     console.log('newAnimal', result);

// //     // Appelle le service pour selectionner les pros à notifier
// //     const prosToNotify = await getProsToNotifyNewReport(result);
// //     // Appelle le service pour envoyer les notifications aux pros
// //     await notifyUsers({
// //       recipients: prosToNotify,
// //       type: 'NEW_REPORT',
// //       message: 'Un nouveau signalement a été effectué à proximité de votre établissement.',
// //       reportId: result._id,
// //     });

// //     res.status(200).json({ result: true, animal: result });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ result: false, error: 'Erreur serveur' });
// //   }
// // });

// // Route PUT /animals/:id
// // Permet à un agent de mettre à jour le statut d’un signalement par som id
// // et d’ajouter une entrée dans l’historique (history)
// // router.put('/:id', authJwt, async (req, res) => {
// //   //Check user role
// //   if (req.role !== 'agent') {
// //     return res.status(403).json({ error: 'Accès interdit' });
// //   }

// //   try {
// //     // ─────────────────────────────────────────────
// //     // 1) Récupération des données de la requête
// //     // ─────────────────────────────────────────────

// //     // id du signalement à modifier (ex: /animals/123456...)
// //     const { id } = req.params;

// //     // Données envoyées par le frontend dans le body
// //     // status      → nouveau / en cours / terminé
// //     // description → commentaire de l’agent
// //     // userId      → identifiant de l’agent
// //     const { status, description, establishment } = req.body || {};
// //     const userId = req.userId; // taken from authJwt middleware

// //     // ─────────────────────────────────────────────
// //     // 2) Vérification des champs obligatoires
// //     // ─────────────────────────────────────────────

// //     // Si le statut ou l’ID de l’agent est manquant,
// //     // on refuse la requête (mauvaise requête client)
// //     if (!status || !userId) {
// //       return res.status(400).json({
// //         result: false,
// //         error: 'Champs manquants',
// //       });
// //     }

// //     // ─────────────────────────────────────────────
// //     // 3) Validation basique de l’ID MongoDB
// //     // ─────────────────────────────────────────────

// //     // Un ObjectId MongoDB fait toujours 24 caractères
// //     // Cette vérification évite un CastError Mongoose
// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         result: false,
// //         error: 'ID invalide',
// //       });
// //     }

// //     // ─────────────────────────────────────────────
// //     // 4) Création de l’entrée d’historique
// //     // ─────────────────────────────────────────────

// //     // history est un tableau de sous-documents
// //     // On DOIT donc ajouter un objet, jamais une string
// //     const historyEntry = {
// //       // Action affichée dans l’historique
// //       action: description || `Statut => ${status}`,

// //       // Date de l’action (Date JS → cast automatique par Mongoose)
// //       date: new Date(),

// //       // Identifiant de l’agent qui a fait l’action
// //       // Si le schema attend un ObjectId, Mongoose cast automatiquement
// //       handler: userId,
// //     };

// //     // ─────────────────────────────────────────────
// //     // 5) Mise à jour du document en base
// //     // ─────────────────────────────────────────────

// //     // findByIdAndUpdate permet :
// //     // - d’éviter un .save() qui revaliderait TOUT le document
// //     // - d’éviter les erreurs sur d’anciens champs invalides (ex: priority enum)
// //     const updated = await Animal.findByIdAndUpdate(
// //       id,
// //       {
// //         // Mise à jour du statut
// //         $set: { status, establishment, currentHandler: userId },

// //         // Ajout de l’entrée d’historique AU DÉBUT du tableau
// //         $push: {
// //           history: {
// //             $each: [historyEntry],
// //             $position: 0,
// //           },
// //         },
// //       },
// //       {
// //         // new: true → renvoie le document après mise à jour
// //         new: true,
// //       },
// //     );

// //     // ─────────────────────────────────────────────
// //     // 6) Si aucun document trouvé
// //     // ─────────────────────────────────────────────

// //     // Si l’ID est valide mais qu’aucun animal n’existe avec cet ID
// //     if (!updated) {
// //       return res.status(404).json({
// //         result: false,
// //         error: 'Signalement introuvable',
// //       });
// //     }

// //     // Envoi de la notification à l'utilisateur qui a fait le signalement
// //     await notifyUsers({
// //       recipients: [updated.reporter],
// //       type: 'REPORT_UPDATE',
// //       message: `Le statut de votre signalement "${updated.title}" a été mis à jour : ${status}.`,
// //       reportId: updated._id,
// //     });

// //     // ─────────────────────────────────────────────
// //     // 7) Réponse OK
// //     // ─────────────────────────────────────────────

// //     // On renvoie le signalement mis à jour
// //     return res.json({
// //       result: true,
// //       animal: updated,
// //     });
// //   } catch (err) {
// //     // ─────────────────────────────────────────────
// //     // 8) Gestion des erreurs serveur
// //     // ─────────────────────────────────────────────

// //     // Toute erreur non prévue arrive ici
// //     console.error('PUT /animals/:id ERROR =>', err);

// //     return res.status(500).json({
// //       result: false,
// //       error: 'Erreur serveur',
// //     });
// //   }
// // });

//! Route DELETE /animals/:id
// Permet de supprimer un signalement par son ID
// router.delete('/:id', authJwt, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedAnimal = await Animal.findByIdAndDelete(id);
//     if (!deletedAnimal) {
//       return res.status(404).json({ result: false, error: 'Signalement introuvable' });
//     }
//     res.json({ result: true, message: 'Signalement supprimé avec succès' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ result: false, error: 'Erreur serveur' });
//   }
// });

//! Route GET /animals/populate/
// Permet de récupérer tous les signalements d’un utilisateur avec les infos de l'établissement associé
// router.get('/populate/', authJwt, async (req, res) => {
//   try {
//     const reports = await Animal.find({ reporter: req.userId })
//       .populate({
//         path: 'establishment',
//         select: 'name address location phone email logo url',
//       })
//       .sort({ date: -1 });
//     res.json({ result: true, reports });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ result: false, error: 'Erreur serveur' });
//   }
// });

//! Route Get /animals/agent
// Recupere les signalements pris en charge par son etablissement et les nouveaux signalements
// router.get('/agent', authJwt, async (req, res) => {
//   if (req.role !== 'agent') {
//     return res.status(403).json({ error: 'Accès interdit' });
//   }
//   try {
//     console.log('req.userId:', req.userId);
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ result: false, error: 'Utilisateur introuvable' });
//     }
//     const reports = await Animal.find({
//       $or: [{ status: 'nouveau' }, { establishment: user.establishment }],
//     })
//       .populate({
//         path: 'currentHandler',
//         select: 'firstName lastName',
//       })
//       .sort({ date: -1 });
//     res.json({ result: true, reports });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ result: false, error: 'Erreur serveur' });
//   }
// });

// module.exports = router;
