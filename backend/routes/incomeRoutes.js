// routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const { createIncome, updateIncome, getIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createIncome); // POST /api/income
router.put('/', protect, updateIncome); // PUT /api/income
router.get('/', protect, getIncome);    // GET /api/income?month=YYYY-MM
router.delete('/', protect, deleteIncome);

module.exports = router;