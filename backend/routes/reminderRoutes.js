const express = require("express");
const router = express.Router();
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

// Reminder routes
router.get("/", protect, getReminders); // GET all reminders
router.post("/", protect, createReminder); // POST create new reminder
router.patch("/:id", protect, updateReminder); // PATCH update reminder (e.g., mark as paid)
router.delete("/:id", protect, deleteReminder); // DELETE a reminder

module.exports = router;
