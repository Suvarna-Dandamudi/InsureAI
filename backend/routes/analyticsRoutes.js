const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getDashboardAnalytics,
  getDetailedAnalytics,
} = require('../controllers/analyticsController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Routes
router.get('/dashboard', getDashboardAnalytics);
router.get('/detailed', getDetailedAnalytics);

module.exports = router;
