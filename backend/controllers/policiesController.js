const Policy = require('../models/Policy');
const Customer = require('../models/Customer');

const genPolicyNumber = () => 'POL-' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-3).toUpperCase();

exports.getPolicies = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const policies = await Policy.find(filter).populate('holder', 'name email').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Policy.countDocuments(filter);
    res.json({ policies, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPolicy = async (req, res) => {
  try {
    const policy = await Policy.create({ ...req.body, policyNumber: genPolicyNumber(), createdBy: req.user._id });
    await Customer.findByIdAndUpdate(req.body.holder, { $inc: { totalPolicies: 1, lifetimeValue: req.body.premium } });
    res.status(201).json(policy);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json({ message: 'Policy deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
