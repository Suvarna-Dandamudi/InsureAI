const { validationResult } = require('express-validator');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const Customer = require('../models/Customer');
const FraudDetection = require('../utils/fraudDetection');
const Fraudcase = require('../models/Fraudcase');

// @desc    Create new claim
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const { policy: policyId, claimAmount, description, incidentDate } = req.body;

    // Verify policy exists and is active
    const policy = await Policy.findById(policyId).populate('customer');
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
      });
    }

    if (policy.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Policy is not active',
      });
    }

    // Generate claim number
    const claimNumber = `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const claimData = {
      ...req.body,
      claimNumber,
      customer: policy.customer._id,
    };

    const claim = await Claim.create(claimData);

    // Perform fraud detection
    const fraudAnalysis = FraudDetection.analyzeClaim(claim, policy.customer, policy);

    // Update claim with fraud flag
    claim.fraudFlag = fraudAnalysis.isFraud;
    await claim.save();

    // Create fraud case if fraud detected
    if (fraudAnalysis.isFraud) {
      await Fraudcase.create({
        claim: claim._id,
        customer: policy.customer._id,
        reason: fraudAnalysis.riskFactors.map(f => f.description).join('; '),
        severity: fraudAnalysis.severity,
        riskFactors: fraudAnalysis.riskFactors,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        ...claim.toObject(),
        fraudAnalysis,
      },
    });
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all claims
// @route   GET /api/claims
// @access  Private
const getClaims = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const fraudFlag = req.query.fraudFlag;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { claimNumber: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (status) {
      query.status = status;
    }

    if (fraudFlag !== undefined) {
      query.fraudFlag = fraudFlag === 'true';
    }

    const claims = await Claim.find(query)
      .populate('policy', 'policyNumber type premium')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Claim.countDocuments(query);

    res.status(200).json({
      success: true,
      data: claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single claim
// @route   GET /api/claims/:id
// @access  Private
const getClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('policy')
      .populate('customer')
      .populate('notes.author', 'name email');
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update claim
// @route   PUT /api/claims/:id
// @access  Private
const updateClaim = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('policy customer');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Approve claim
// @route   PUT /api/claims/:id/approve
// @access  Private
const approveClaim = async (req, res) => {
  try {
    const { approvedAmount } = req.body;

    const claim = await Claim.findById(req.params.id).populate('policy');
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Claim is not in pending status',
      });
    }

    claim.status = 'approved';
    claim.approvedAmount = approvedAmount || claim.claimAmount;
    await claim.save();

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error('Approve claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reject claim
// @route   PUT /api/claims/:id/reject
// @access  Private
const rejectClaim = async (req, res) => {
  try {
    const { reason } = req.body;

    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    if (claim.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Claim is not in pending status',
      });
    }

    claim.status = 'rejected';
    
    // Add rejection note
    if (reason) {
      claim.notes.push({
        text: `Claim rejected: ${reason}`,
        author: req.user._id,
      });
    }
    
    await claim.save();

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error('Reject claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get claim statistics
// @route   GET /api/claims/stats
// @access  Private
const getClaimStats = async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const approvedClaims = await Claim.countDocuments({ status: 'approved' });
    const rejectedClaims = await Claim.countDocuments({ status: 'rejected' });
    const fraudClaims = await Claim.countDocuments({ fraudFlag: true });

    // Total claim amounts
    const claimAmounts = await Claim.aggregate([
      {
        $group: {
          _id: null,
          totalClaimAmount: { $sum: '$claimAmount' },
          totalApprovedAmount: { $sum: '$approvedAmount' },
        },
      },
    ]);

    // Claims per month (last 12 months)
    const claimsPerMonth = await Claim.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          amount: { $sum: '$claimAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalClaims,
        pendingClaims,
        approvedClaims,
        rejectedClaims,
        fraudClaims,
        totalClaimAmount: claimAmounts[0]?.totalClaimAmount || 0,
        totalApprovedAmount: claimAmounts[0]?.totalApprovedAmount || 0,
        claimsPerMonth,
      },
    });
  } catch (error) {
    console.error('Get claim stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createClaim,
  getClaims,
  getClaim,
  updateClaim,
  approveClaim,
  rejectClaim,
  getClaimStats,
};
