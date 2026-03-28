const express = require('express');
const router = express.Router();
const { getClaims, createClaim, updateClaim } = require('../controllers/claimsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getClaims);
router.post('/', protect, createClaim);
router.put('/:id', protect, updateClaim);

module.exports = router;
