const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true, min: -90, max: 90 },
    long: { type: Number, required: true, min: -180, max: 180 },
  },
  date: { type: Date, default: Date.now },
  animalType: { type: String, enum: ['chat', 'chien'], required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  state: [
    {
      type: String,
      required: true,
      enum: [
        'blesse',
        'affaibli',
        'danger',
        'coince',
        'petits',
        'agressif',
        'peureux',
        'jeune',
        'sociable',
        'sain',
      ],
    },
  ],
  priority: { type: String, enum: ['urgent', 'important', 'modere', 'faible'] },
  photoUrl: String,
  status: {
    type: String,
    enum: ['nouveau', 'en cours', 'terminé'],
    default: 'nouveau',
    index: true,
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'establishments',
    default: null,
    index: true,
  },
  currentHandler: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
  history: [
    {
      date: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['en cours', 'terminé'],
      },
      action: { type: String, required: true },
      handler: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    },
  ],
});

const Animal = mongoose.model('animals', animalSchema);
module.exports = Animal;
