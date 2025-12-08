const mongoose = require('mongoose');

const establishmentSchema = mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  adress: {
    street: String,
    city: String,
    zipCode: Number,
    required: true,
  },
  location: { lat: Number, long: Number },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  logo: String,
  url: String,
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

const Establishment = mongoose.model('establishments', establishmentSchema);
module.export = Establishment;
