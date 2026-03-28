const FraudAlert = require('../models/FraudAlert');

exports.getFraudAlerts = async (req, res) => {
  try {
    const { severity, status } = req.query;
    const filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    const alerts = await FraudAlert.find(filter)
      .populate('customer', 'name email')
      .populate('claim', 'claimNumber amount type')
      .sort({ detectedAt: -1 }).limit(50);
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateAlert = async (req, res) => {
  try {
    const alert = await FraudAlert.findByIdAndUpdate(req.params.id, {
      ...req.body,
      ...(req.body.status === 'Resolved' && { resolvedAt: new Date(), resolvedBy: req.user._id })
    }, { new: true });
    res.json(alert);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
