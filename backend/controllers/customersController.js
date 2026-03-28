const Customer = require('../models/Customer');

exports.getCustomers = async (req, res) => {
  try {
    const { riskCategory, kycStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (riskCategory) filter.riskCategory = riskCategory;
    if (kycStatus) filter.kycStatus = kycStatus;
    const customers = await Customer.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Customer.countDocuments(filter);
    res.json({ customers, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCustomer = async (req, res) => {
  try {
    const exists = await Customer.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: 'Customer with this email already exists' });
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
