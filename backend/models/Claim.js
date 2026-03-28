const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimNumber: { type: String, required: true, unique: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['Medical', 'Accident', 'Property Damage', 'Theft', 'Natural Disaster', 'Other'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Paid'], default: 'Pending' },
  fraudScore: { type: Number, min: 0, max: 100, default: 0 },
  isFlagged: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  remarks: { type: String },
  documents: [{ name: String, url: String }],
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
