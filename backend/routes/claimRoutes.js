const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createClaim,
  getClaims,
  getClaim,
  updateClaim,
  approveClaim,
  rejectClaim,
  getClaimStats,
} = require('../controllers/claimController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const createClaimValidation = [
  body('policy').isMongoId().withMessage('Valid policy ID is required'),
  body('claimAmount').isNumeric().withMessage('Claim amount must be a number'),
  body('description').notEmpty().withMessage('Claim description is required'),
  body('incidentDate').isISO8601().withMessage('Valid incident date is required'),
];

const updateClaimValidation = [
  body('claimAmount').optional().isNumeric().withMessage('Claim amount must be a number'),
  body('description').optional().notEmpty().withMessage('Claim description cannot be empty'),
  body('incidentDate').optional().isISO8601().withMessage('Valid incident date is required'),
  body('status').optional().isIn(['pending', 'approved', 'rejected', 'under_review']).withMessage('Invalid status'),
];

const approveClaimValidation = [
  body('approvedAmount').optional().isNumeric().withMessage('Approved amount must be a number'),
];

const rejectClaimValidation = [
  body('reason').optional().notEmpty().withMessage('Rejection reason cannot be empty'),
];

// Routes
router.post('/', createClaimValidation, createClaim);
router.get('/', getClaims);
router.get('/stats', getClaimStats);
router.get('/:id', getClaim);
router.put('/:id', updateClaimValidation, updateClaim);
router.put('/:id/approve', approveClaimValidation, approveClaim);
router.put('/:id/reject', rejectClaimValidation, rejectClaim);

module.exports = router;
