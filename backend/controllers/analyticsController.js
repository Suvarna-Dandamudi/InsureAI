const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Customer = require('../models/Customer');
const FraudAlert = require('../models/FraudAlert');

exports.getAnalytics = async (req, res) => {
  try {
    const [totalPolicies, totalClaims, totalCustomers, fraudAlerts] = await Promise.all([
      Policy.countDocuments(),
      Claim.countDocuments(),
      Customer.countDocuments(),
      FraudAlert.countDocuments({ status: 'Open' }),
    ]);

    const activePolicies = await Policy.countDocuments({ status: 'Active' });
    const pendingClaims = await Claim.countDocuments({ status: 'Pending' });
    const approvedClaims = await Claim.countDocuments({ status: 'Approved' });
    const rejectedClaims = await Claim.countDocuments({ status: 'Rejected' });

    // Revenue from active policies
    const revenueData = await Policy.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$premium' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Policy by type
    const policyByType = await Policy.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Claims by status
    const claimsByStatus = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Monthly policy growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyPolicies = await Policy.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Customer risk distribution
    const customerRisk = await Customer.aggregate([
      { $group: { _id: '$riskCategory', count: { $sum: 1 } } }
    ]);

    res.json({
      kpis: { totalPolicies, activePolicies, totalClaims, pendingClaims, approvedClaims, rejectedClaims, totalCustomers, totalRevenue, fraudAlerts },
      policyByType,
      claimsByStatus,
      monthlyPolicies,
      customerRisk,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
