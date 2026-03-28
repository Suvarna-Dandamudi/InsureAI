const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Health', 'Auto', 'Life', 'Property', 'Travel', 'Business'], required: true },
  holder: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  premium: { type: Number, required: true },
  coverageAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Cancelled', 'Pending'], default: 'Active' },
  description: { type: String },
  riskScore: { type: Number, min: 0, max: 100, default: 50 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
