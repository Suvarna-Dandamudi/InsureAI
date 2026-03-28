const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, getCustomer, updateCustomer } = require('../controllers/customersController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.get('/:id', protect, getCustomer);
router.put('/:id', protect, updateCustomer);

module.exports = router;
