const express = require("express");
const router = express.Router();
const { getAISuggestions } = require("../controllers/adviceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/suggestions", protect, getAISuggestions);

module.exports = router;