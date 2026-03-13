const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Customer = require('../models/Customer');
const Fraudcase = require('../models/Fraudcase');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    // Get counts
    const totalPolicies = await Policy.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const fraudAlerts = await Fraudcase.countDocuments({ status: { $ne: 'resolved' } });

    // Get monthly growth data
    const monthlyGrowth = await getMonthlyGrowth();

    // Get claims per month
    const claimsPerMonth = await getClaimsPerMonth();

    // Get policies growth
    const policiesGrowth = await getPoliciesGrowth();

    // Get fraud cases
    const fraudCases = await getFraudCases();

    // Get risk distribution
    const riskDistribution = await getRiskDistribution();

    // Get recent activity
    const recentActivity = await getRecentActivity();

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalPolicies,
          totalClaims,
          totalCustomers,
          fraudAlerts,
        },
        charts: {
          monthlyGrowth,
          claimsPerMonth,
          policiesGrowth,
          fraudCases,
          riskDistribution,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get detailed analytics
// @route   GET /api/analytics/detailed
// @access  Private
const getDetailedAnalytics = async (req, res) => {
  try {
    const { period = '12months' } = req.query;

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch (period) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '12months':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Revenue analytics
    const revenueAnalytics = await getRevenueAnalytics(startDate, endDate);

    // Claims analytics
    const claimsAnalytics = await getClaimsAnalytics(startDate, endDate);

    // Customer analytics
    const customerAnalytics = await getCustomerAnalytics(startDate, endDate);

    // Fraud analytics
    const fraudAnalytics = await getFraudAnalytics(startDate, endDate);

    res.status(200).json({
      success: true,
      data: {
        period,
        revenueAnalytics,
        claimsAnalytics,
        customerAnalytics,
        fraudAnalytics,
      },
    });
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Helper functions
const getMonthlyGrowth = async () => {
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const policies = await Policy.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });

    const customers = await Customer.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });

    last6Months.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      policies,
      customers,
    });
  }

  return last6Months;
};

const getClaimsPerMonth = async () => {
  const last12Months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const claims = await Claim.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd }
    });

    const approved = await Claim.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd },
      status: 'approved'
    });

    const rejected = await Claim.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd },
      status: 'rejected'
    });

    last12Months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      total: claims,
      approved,
      rejected,
    });
  }

  return last12Months;
};

const getPoliciesGrowth = async () => {
  const policiesByType = await Policy.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  return policiesByType.map(item => ({
    type: item._id,
    count: item.count,
  }));
};

const getFraudCases = async () => {
  const fraudBySeverity = await Fraudcase.aggregate([
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 },
      },
    },
  ]);

  return fraudBySeverity.map(item => ({
    severity: item._id,
    count: item.count,
  }));
};

const getRiskDistribution = async () => {
  const riskRanges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 },
  ];

  const distribution = await Promise.all(
    riskRanges.map(async (range) => {
      const count = await Policy.countDocuments({
        riskScore: { $gte: range.min, $lte: range.max }
      });
      return {
        range: range.range,
        count,
      };
    })
  );

  return distribution;
};

const getRecentActivity = async () => {
  const recentPolicies = await Policy.find()
    .populate('customer', 'name')
    .sort({ createdAt: -1 })
    .limit(3)
    .select('policyNumber customer type premium createdAt');

  const recentClaims = await Claim.find()
    .populate('customer', 'name')
    .populate('policy', 'policyNumber')
    .sort({ createdAt: -1 })
    .limit(3)
    .select('claimNumber customer policy claimAmount status createdAt');

  return {
    recentPolicies,
    recentClaims,
  };
};

const getRevenueAnalytics = async (startDate, endDate) => {
  const revenue = await Policy.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$premium' },
        averagePremium: { $avg: '$premium' },
        policyCount: { $sum: 1 },
      },
    },
  ]);

  return revenue[0] || { totalRevenue: 0, averagePremium: 0, policyCount: 0 };
};

const getClaimsAnalytics = async (startDate, endDate) => {
  const claims = await Claim.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$claimAmount' },
        averageAmount: { $avg: '$claimAmount' },
      },
    },
  ]);

  return claims;
};

const getCustomerAnalytics = async (startDate, endDate) => {
  const customers = await Customer.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        newCustomers: { $sum: 1 },
      },
    },
  ]);

  return customers[0] || { newCustomers: 0 };
};

const getFraudAnalytics = async (startDate, endDate) => {
  const fraud = await Fraudcase.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return fraud;
};

module.exports = {
  getDashboardAnalytics,
  getDetailedAnalytics,
};
