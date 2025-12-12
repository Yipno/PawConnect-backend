const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
  location: { lat: Number, long: Number },
  date: Date,
  animalType: { type: String, enum: ['chat', 'chien'], required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  state: [{ type: String, required: true }],
  priority: String, // enum: ['URGENT', 'IMPORTANT', 'MODERE', 'FAIBLE'] },
  photoUrl: String,
  status: { type: String, enum: ['nouveau', 'en cours', 'terminé'] },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  handlers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
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
