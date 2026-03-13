const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    required: [true, 'Policy number is required'],
    unique: true,
    uppercase: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required'],
  },
  type: {
    type: String,
    required: [true, 'Policy type is required'],
    enum: ['auto', 'home', 'life', 'health', 'business'],
  },
  premium: {
    type: Number,
    required: [true, 'Premium amount is required'],
    min: [0, 'Premium must be positive'],
  },
  coverage: {
    type: Number,
    required: [true, 'Coverage amount is required'],
    min: [0, 'Coverage must be positive'],
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'active',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

policySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Policy', policySchema);
