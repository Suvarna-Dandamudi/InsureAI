const { validationResult } = require('express-validator');
const Policy = require('../models/Policy');
const Customer = require('../models/Customer');
const RiskScore = require('../utils/riskScore');

// @desc    Create new policy
// @route   POST /api/policies
// @access  Private
const createPolicy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const { customer: customerId, type, premium, coverage } = req.body;

    // Verify customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Calculate risk score
    const riskAnalysis = RiskScore.calculatePolicyRisk(customer, type, coverage);

    // Generate policy number
    const policyNumber = `POL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const policyData = {
      ...req.body,
      policyNumber,
      riskScore: riskAnalysis.riskScore,
    };

    const policy = await Policy.create(policyData);

    // Add policy to customer's policies array
    customer.policies.push(policy._id);
    await customer.save();

    res.status(201).json({
      success: true,
      data: {
        ...policy.toObject(),
        riskAnalysis,
      },
    });
  } catch (error) {
    console.error('Create policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all policies
// @route   GET /api/policies
// @access  Private
const getPolicies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const type = req.query.type || '';
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { policyNumber: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const policies = await Policy.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Policy.countDocuments(query);

    res.status(200).json({
      success: true,
      data: policies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get policies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single policy
// @route   GET /api/policies/:id
// @access  Private
const getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate('customer');
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error('Get policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update policy
// @route   PUT /api/policies/:id
// @access  Private
const updatePolicy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer');

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error('Update policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete policy
// @route   DELETE /api/policies/:id
// @access  Private
const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
      });
    }

    // Check if policy has active claims
    const Claim = require('../models/Claim');
    const activeClaims = await Claim.find({ 
      policy: req.params.id, 
      status: { $in: ['pending', 'under_review'] } 
    });

    if (activeClaims.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete policy with active claims',
      });
    }

    await policy.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get policy statistics
// @route   GET /api/policies/stats
// @access  Private
const getPolicyStats = async (req, res) => {
  try {
    const totalPolicies = await Policy.countDocuments();
    const activePolicies = await Policy.countDocuments({ status: 'active' });
    const expiredPolicies = await Policy.countDocuments({ status: 'expired' });
    const cancelledPolicies = await Policy.countDocuments({ status: 'cancelled' });

    // Policies by type
    const policiesByType = await Policy.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    // Average premium
    const avgPremium = await Policy.aggregate([
      {
        $group: {
          _id: null,
          averagePremium: { $avg: '$premium' },
        },
      },
    ]);

    // New policies this month
    const newPoliciesThisMonth = await Policy.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalPolicies,
        activePolicies,
        expiredPolicies,
        cancelledPolicies,
        policiesByType,
        averagePremium: avgPremium[0]?.averagePremium || 0,
        newPoliciesThisMonth,
      },
    });
  } catch (error) {
    console.error('Get policy stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createPolicy,
  getPolicies,
  getPolicy,
  updatePolicy,
  deletePolicy,
  getPolicyStats,
};
