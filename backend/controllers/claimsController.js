const Claim = require('../models/Claim');
const FraudAlert = require('../models/FraudAlert');
const Customer = require('../models/Customer');

const genClaimNumber = () => 'CLM-' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-3).toUpperCase();

// Simulated AI fraud scoring
const computeFraudScore = (claim) => {
  let score = Math.floor(Math.random() * 40);
  if (claim.amount > 50000) score += 25;
  if (claim.type === 'Theft' || claim.type === 'Natural Disaster') score += 15;
  return Math.min(score, 100);
};

exports.getClaims = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const claims = await Claim.find(filter).populate('customer', 'name email').populate('policy', 'policyNumber type')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Claim.countDocuments(filter);
    res.json({ claims, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createClaim = async (req, res) => {
  try {
    const fraudScore = computeFraudScore(req.body);
    const isFlagged = fraudScore >= 60;
    const claim = await Claim.create({ ...req.body, claimNumber: genClaimNumber(), fraudScore, isFlagged });
    if (isFlagged) {
      await FraudAlert.create({
        claim: claim._id, customer: req.body.customer,
        alertType: 'Suspicious Pattern', severity: fraudScore > 80 ? 'Critical' : 'High',
        fraudScore, description: `AI detected suspicious claim patterns. Fraud score: ${fraudScore}/100`
      });
    }
    await Customer.findByIdAndUpdate(req.body.customer, { $inc: { totalClaims: 1 } });
    res.status(201).json(claim);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, {
      ...req.body, ...(req.body.status === 'Resolved' && { resolvedAt: new Date() })
    }, { new: true });
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.json(claim);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
