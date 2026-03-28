const express = require('express');
const router = express.Router();
const { getRiskAnalysis } = require('../controllers/riskController');
const { protect } = require('../middleware/auth');
router.get('/', protect, getRiskAnalysis);
module.exports = router;
