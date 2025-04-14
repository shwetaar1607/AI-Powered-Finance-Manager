// routes/investmentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getInvestments, 
  createInvestment, 
  updateInvestment, 
  deleteInvestment 
} = require('../controllers/investmentController');
const { protect } = require('../middleware/authMiddleware');

// Investment routes
router.get('/', protect, getInvestments);        // GET all investments
router.post('/', protect, createInvestment);     // POST create new investment
router.patch('/:id', protect, updateInvestment); // PATCH update investment
router.delete('/:id', protect, deleteInvestment); // DELETE an investment

module.exports = router;