const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, addExpense, deleteBudget, getExpenses, getMonthlySummary, getSpendingByCategory, getBudgetVsActual, getTopExpenses} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getBudgets);
router.post('/', protect, createBudget);
router.post('/add-expense', protect, addExpense);
router.post('/get-expense', protect, getExpenses);
router.delete('/:id', protect, deleteBudget);
router.get('/monthly-summary', protect, getMonthlySummary);
router.get('/spending-category', protect, getSpendingByCategory);
router.get('/budget-vs-actual', protect, getBudgetVsActual);
router.get('/top-expenses', protect, getTopExpenses);

module.exports = router;
