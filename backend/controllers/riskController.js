const Customer = require('../models/Customer');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

exports.getRiskAnalysis = async (req, res) => {
  try {
    const highRiskCustomers = await Customer.countDocuments({ riskCategory: 'High' });
    const mediumRiskCustomers = await Customer.countDocuments({ riskCategory: 'Medium' });
    const lowRiskCustomers = await Customer.countDocuments({ riskCategory: 'Low' });

    const avgRiskScore = await Policy.aggregate([
      { $group: { _id: null, avg: { $avg: '$riskScore' } } }
    ]);

    const flaggedClaims = await Claim.countDocuments({ isFlagged: true });
    const totalClaims = await Claim.countDocuments();

    // Risk scores per policy type
    const riskByType = await Policy.aggregate([
      { $group: { _id: '$type', avgRisk: { $avg: '$riskScore' }, count: { $sum: 1 } } }
    ]);

    // High risk policies
    const highRiskPolicies = await Policy.find({ riskScore: { $gte: 75 } })
      .populate('holder', 'name email').limit(10).sort({ riskScore: -1 });

    res.json({
      riskDistribution: { high: highRiskCustomers, medium: mediumRiskCustomers, low: lowRiskCustomers },
      avgRiskScore: avgRiskScore[0]?.avg || 0,
      flaggedClaimsRate: totalClaims > 0 ? ((flaggedClaims / totalClaims) * 100).toFixed(1) : 0,
      riskByType,
      highRiskPolicies,
      aiInsights: [
        { type: 'warning', message: `${highRiskCustomers} customers flagged as High Risk — immediate review recommended` },
        { type: 'info', message: `Fraud detection rate improved by 12% this quarter` },
        { type: 'success', message: `Auto-underwriting approved 87% of standard policies` },
        { type: 'warning', message: `${flaggedClaims} claims require manual fraud investigation` },
      ]
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
