const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const { processMessage } = require('../controllers/chatbotController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation rules
const messageValidation = [
  body('message').notEmpty().withMessage('Message is required'),
  body('customerId').optional().isMongoId().withMessage('Valid customer ID is required'),
];

// Routes
router.post('/message', messageValidation, processMessage);

module.exports = router;
