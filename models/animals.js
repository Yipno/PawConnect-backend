const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
  location: { lat: Number, long: Number, required: true },
  date: Date,
  animalType: { type: String, enum: [chat, chien], required: true },
  desc: { type: String, required: true },
  state: [{ type: String, required: true }],
  photoUrl: String,
  status: { type: String, enum: ['nouveau', 'en cours', 'terminé'], required: true },
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
