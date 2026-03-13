const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  createPolicy,
  getPolicies,
  getPolicy,
  updatePolicy,
  deletePolicy,
  getPolicyStats,
} = require('../controllers/policyController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const createPolicyValidation = [
  body('customer').isMongoId().withMessage('Valid customer ID is required'),
  body('type').isIn(['auto', 'home', 'life', 'health', 'business']).withMessage('Invalid policy type'),
  body('premium').isNumeric().withMessage('Premium must be a number'),
  body('coverage').isNumeric().withMessage('Coverage must be a number'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
];

const updatePolicyValidation = [
  body('customer').optional().isMongoId().withMessage('Valid customer ID is required'),
  body('type').optional().isIn(['auto', 'home', 'life', 'health', 'business']).withMessage('Invalid policy type'),
  body('premium').optional().isNumeric().withMessage('Premium must be a number'),
  body('coverage').optional().isNumeric().withMessage('Coverage must be a number'),
  body('status').optional().isIn(['active', 'expired', 'cancelled', 'pending']).withMessage('Invalid status'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
];

// Routes
router.post('/', createPolicyValidation, createPolicy);
router.get('/', getPolicies);
router.get('/stats', getPolicyStats);
router.get('/:id', getPolicy);
router.put('/:id', updatePolicyValidation, updatePolicy);
router.delete('/:id', deletePolicy);

module.exports = router;
