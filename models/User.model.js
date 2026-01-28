const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  lastName: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['civil', 'agent'], required: true },
  establishment: { type: mongoose.Schema.Types.ObjectId, ref: 'establishments' },
});

const User = mongoose.model('users', userSchema);
module.exports = User;
