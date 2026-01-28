const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: { type: String, required: true },
  address: {
    street: String,
    city: String,
    zipCode: String,
  },
  location: { lat: Number, long: Number },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  logo: String,
  url: String,
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

const Establishment = mongoose.model('establishments', establishmentSchema);
module.exports = Establishment;
