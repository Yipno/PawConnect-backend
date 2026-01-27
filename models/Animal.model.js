const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  location: { lat: Number, long: Number },
  date: Date,
  animalType: { type: String, enum: ['chat', 'chien'], required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  state: [{ type: String, required: true }],
  priority: { type: String, enum: ['urgent', 'important', 'modere', 'faible'] },
  photoUrl: String,
  status: { type: String, enum: ['nouveau', 'en cours', 'terminé'], index: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'establishments',
    default: null,
    index: true,
  },
  currentHandler: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
  history: [
    {
      date: Date,
      status: String,
      action: String,
      handler: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    },
  ],
});

const Animal = mongoose.model('animals', animalSchema);
module.exports = Animal;
