const express = require("express");
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoalProgress,
  deleteGoal,
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have auth middleware

router.route("/").get(protect, getGoals).post(protect, createGoal);
router
  .route("/:goalId")
  .put(protect, updateGoalProgress)
  .delete(protect, deleteGoal);

module.exports = router;