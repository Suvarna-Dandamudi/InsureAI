const mongoose = require('mongoose');

const fraudAlertSchema = new mongoose.Schema({
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  alertType: {
    type: String,
    enum: ['Duplicate Claim', 'Suspicious Pattern', 'High Risk Customer', 'Document Forgery', 'Inflated Amount', 'Staged Accident'],
    required: true
  },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  fraudScore: { type: Number, min: 0, max: 100, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Investigating', 'Resolved', 'False Positive'], default: 'Open' },
  detectedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FraudAlert', fraudAlertSchema);
