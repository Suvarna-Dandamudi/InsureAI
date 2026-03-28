const express = require('express');
const router = express.Router();
const { getPolicies, createPolicy, updatePolicy, deletePolicy } = require('../controllers/policiesController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPolicies);
router.post('/', protect, createPolicy);
router.put('/:id', protect, updatePolicy);
router.delete('/:id', protect, deletePolicy);

module.exports = router;
