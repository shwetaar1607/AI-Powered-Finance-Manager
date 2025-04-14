const express = require('express');
const router = express.Router();
const { createLinkToken, exchangePublicToken, getTransactions } = require('../controllers/plaidController');
const { protect } = require('../middleware/authMiddleware');

router.get('/link-token', protect, createLinkToken);
router.post('/exchange-token', protect, exchangePublicToken);
router.get('/transactions', protect, getTransactions);

module.exports = router;
