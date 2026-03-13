const mongoose = require('mongoose');

const fraudCaseSchema = new mongoose.Schema({
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: [true, 'Claim is required'],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required'],
  },
  reason: {
    type: String,
    required: [true, 'Reason for fraud flag is required'],
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  riskFactors: [{
    factor: String,
    score: Number,
  }],
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'false_positive'],
    default: 'open',
  },
  investigationNotes: [{
    text: String,
    investigator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

fraudCaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Fraudcase', fraudCaseSchema);
