export const mockAnalytics = {
  kpis: {
    totalPolicies: 2847,
    activePolicies: 2341,
    totalClaims: 634,
    pendingClaims: 127,
    approvedClaims: 398,
    rejectedClaims: 109,
    totalCustomers: 12,
    totalRevenue: 4821500,
    fraudAlerts: 23,
  },
  policyByType: [
    { _id: 'Health', count: 980 },
    { _id: 'Auto', count: 720 },
    { _id: 'Life', count: 540 },
    { _id: 'Property', count: 380 },
    { _id: 'Travel', count: 147 },
    { _id: 'Business', count: 80 },
  ],
  claimsByStatus: [
    { _id: 'Approved', count: 398 },
    { _id: 'Pending', count: 127 },
    { _id: 'Under Review', count: 78 },
    { _id: 'Rejected', count: 109 },
    { _id: 'Paid', count: 211 },
  ],
  monthlyPolicies: [
    { _id: { month: 10, year: 2024 }, count: 312 },
    { _id: { month: 11, year: 2024 }, count: 389 },
    { _id: { month: 12, year: 2024 }, count: 428 },
    { _id: { month: 1, year: 2025 }, count: 467 },
    { _id: { month: 2, year: 2025 }, count: 521 },
    { _id: { month: 3, year: 2025 }, count: 598 },
  ],
  customerRisk: [
    { _id: 'Low', count: 1102 },
    { _id: 'Medium', count: 589 },
    { _id: 'High', count: 201 },
  ],
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const mockPolicies = [
  { _id: '1', policyNumber: 'POL-20241001', type: 'Health', holder: { name: 'Arjun Sharma' }, premium: 15000, coverageAmount: 500000, status: 'Active', riskScore: 22 },
  { _id: '2', policyNumber: 'POL-20241002', type: 'Auto', holder: { name: 'Priya Mehta' }, premium: 8500, coverageAmount: 200000, status: 'Active', riskScore: 45 },
  { _id: '3', policyNumber: 'POL-20241003', type: 'Life', holder: { name: 'Rahul Patel' }, premium: 24000, coverageAmount: 2000000, status: 'Active', riskScore: 18 },
  { _id: '4', policyNumber: 'POL-20241004', type: 'Property', holder: { name: 'Sneha Reddy' }, premium: 12000, coverageAmount: 800000, status: 'Expired', riskScore: 61 },
  { _id: '5', policyNumber: 'POL-20241005', type: 'Travel', holder: { name: 'Vikram Singh' }, premium: 3500, coverageAmount: 100000, status: 'Active', riskScore: 30 },
  { _id: '6', policyNumber: 'POL-20241006', type: 'Business', holder: { name: 'Kavitha Nair' }, premium: 45000, coverageAmount: 5000000, status: 'Pending', riskScore: 77 },
];

export const mockClaims = [
  { _id: '1', claimNumber: 'CLM-20241001', type: 'Medical', customer: { name: 'Arjun Sharma' }, amount: 45000, status: 'Approved', fraudScore: 12, isFlagged: false, submittedAt: '2024-11-01' },
  { _id: '2', claimNumber: 'CLM-20241002', type: 'Accident', customer: { name: 'Priya Mehta' }, amount: 120000, status: 'Pending', fraudScore: 68, isFlagged: true, submittedAt: '2024-11-05' },
  { _id: '3', claimNumber: 'CLM-20241003', type: 'Theft', customer: { name: 'Rahul Patel' }, amount: 89000, status: 'Under Review', fraudScore: 75, isFlagged: true, submittedAt: '2024-11-08' },
  { _id: '4', claimNumber: 'CLM-20241004', type: 'Property Damage', customer: { name: 'Sneha Reddy' }, amount: 230000, status: 'Rejected', fraudScore: 88, isFlagged: true, submittedAt: '2024-10-25' },
  { _id: '5', claimNumber: 'CLM-20241005', type: 'Medical', customer: { name: 'Vikram Singh' }, amount: 18500, status: 'Paid', fraudScore: 8, isFlagged: false, submittedAt: '2024-10-20' },
];

export const mockCustomers = [
  { _id: '1', name: 'Arjun Sharma', email: 'arjun@example.com', phone: '+91-9876543210', riskCategory: 'Low', kycStatus: 'Verified', totalPolicies: 3, totalClaims: 1, lifetimeValue: 48000 },
  { _id: '2', name: 'Priya Mehta', email: 'priya@example.com', phone: '+91-9876543211', riskCategory: 'Medium', kycStatus: 'Verified', totalPolicies: 2, totalClaims: 2, lifetimeValue: 32000 },
  { _id: '3', name: 'Rahul Patel', email: 'rahul@example.com', phone: '+91-9876543212', riskCategory: 'High', kycStatus: 'Pending', totalPolicies: 1, totalClaims: 3, lifetimeValue: 24000 },
  { _id: '4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91-9876543213', riskCategory: 'High', kycStatus: 'Failed', totalPolicies: 1, totalClaims: 2, lifetimeValue: 12000 },
  { _id: '5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91-9876543214', riskCategory: 'Low', kycStatus: 'Verified', totalPolicies: 4, totalClaims: 1, lifetimeValue: 91500 },
  { _id: '6', name: 'Kavitha Nair', email: 'kavitha@example.com', phone: '+91-9876543215', riskCategory: 'Medium', kycStatus: 'Verified', totalPolicies: 2, totalClaims: 0, lifetimeValue: 69000 },
];

export const mockFraudAlerts = [
  { _id: '1', alertType: 'Duplicate Claim', severity: 'Critical', fraudScore: 92, description: 'Multiple claims filed for same incident within 48 hours', status: 'Open', customer: { name: 'Rahul Patel' }, detectedAt: '2024-11-10' },
  { _id: '2', alertType: 'Inflated Amount', severity: 'High', fraudScore: 78, description: 'Claim amount significantly exceeds market value for damage type', status: 'Investigating', customer: { name: 'Sneha Reddy' }, detectedAt: '2024-11-09' },
  { _id: '3', alertType: 'Suspicious Pattern', severity: 'High', fraudScore: 75, description: 'Customer has filed 3 theft claims in the past 6 months', status: 'Open', customer: { name: 'Priya Mehta' }, detectedAt: '2024-11-08' },
  { _id: '4', alertType: 'Document Forgery', severity: 'Critical', fraudScore: 95, description: 'AI detected inconsistencies in submitted medical documents', status: 'Investigating', customer: { name: 'Rahul Patel' }, detectedAt: '2024-11-07' },
  { _id: '5', alertType: 'High Risk Customer', severity: 'Medium', fraudScore: 62, description: 'Customer risk profile elevated based on behavioral analysis', status: 'Open', customer: { name: 'Unknown Customer' }, detectedAt: '2024-11-06' },
];

export const mockRiskAnalysis = {
  riskDistribution: { high: 201, medium: 589, low: 1102 },
  avgRiskScore: 38.4,
  flaggedClaimsRate: 18.5,
  riskByType: [
    { _id: 'Health', avgRisk: 32, count: 980 },
    { _id: 'Auto', avgRisk: 48, count: 720 },
    { _id: 'Life', avgRisk: 22, count: 540 },
    { _id: 'Property', avgRisk: 55, count: 380 },
    { _id: 'Travel', avgRisk: 28, count: 147 },
    { _id: 'Business', avgRisk: 61, count: 80 },
  ],
  aiInsights: [
    { type: 'warning', message: '201 customers flagged as High Risk — immediate review recommended' },
    { type: 'info', message: 'Fraud detection rate improved by 12% this quarter' },
    { type: 'success', message: 'Auto-underwriting approved 87% of standard policies' },
    { type: 'warning', message: '117 claims require manual fraud investigation' },
  ],
};
