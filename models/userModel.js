const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false }, // Yönetici rolü için
  isCustomer: { type: Boolean, default: true }, // Müşteri rolü için
  createdAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);

module.exports = User;