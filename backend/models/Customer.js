const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  occupation: { type: String },
  riskCategory: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  kycStatus: { type: String, enum: ['Verified', 'Pending', 'Failed'], default: 'Pending' },
  totalPolicies: { type: Number, default: 0 },
  totalClaims: { type: Number, default: 0 },
  lifetimeValue: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
