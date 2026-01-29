const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification.model');
const authJwt = require('../middlewares/authJWT');

// Recupere les notifications d'un utilisateur
router.get('/', authJwt, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ result: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des notifications', error: error.message });
  }
});

// Marque une notification comme lue
router.patch('/:id/read', authJwt, async (req, res) => {
  // id de la notification
  const { id } = req.params;

  try {
    // cherche la notification et la met a jour
    const notification = await Notification.findByIdAndUpdate(
      { _id: id },
      { read: true }, // passe read en true
      { new: true }, // retourne le document mis a jour
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }
    res.status(200).json({ result: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour de la notification', error: error.message });
  }
});

// Marque toutes les notifications non lues d'un utilisateur comme lues
router.patch('/read-all', authJwt, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.userId, read: false }, { read: true });
    res.status(200).json({ result: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour des notifications', error: error.message });
  }
});

module.exports = router;
