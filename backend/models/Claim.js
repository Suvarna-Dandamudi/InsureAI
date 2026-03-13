const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimNumber: {
    type: String,
    required: [true, 'Claim number is required'],
    unique: true,
    uppercase: true,
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: [true, 'Policy is required'],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required'],
  },
  claimAmount: {
    type: Number,
    required: [true, 'Claim amount is required'],
    min: [0, 'Claim amount must be positive'],
  },
  approvedAmount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Claim description is required'],
  },
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending',
  },
  fraudFlag: {
    type: Boolean,
    default: false,
  },
  documents: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  notes: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

claimSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Claim', claimSchema);
