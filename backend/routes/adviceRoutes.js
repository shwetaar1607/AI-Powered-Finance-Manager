const express = require("express");
const router = express.Router();
const { getAISuggestions, predictAndAdviseExpenses } = require("../controllers/adviceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/suggestions", protect, getAISuggestions);
router.get("/predict", protect, predictAndAdviseExpenses);

module.exports = router;