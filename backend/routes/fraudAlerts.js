const express = require('express');
const router = express.Router();
const { getFraudAlerts, updateAlert } = require('../controllers/fraudController');
const { protect } = require('../middleware/auth');
router.get('/', protect, getFraudAlerts);
router.put('/:id', protect, updateAlert);
module.exports = router;
