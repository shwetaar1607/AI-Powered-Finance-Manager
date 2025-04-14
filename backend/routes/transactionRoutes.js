const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTransactions);
router.post('/', protect, addTransaction);

module.exports = router;
