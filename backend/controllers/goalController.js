const Goal = require("../models/Goal");

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      created_at: -1,
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  const { goal_name, goal_amount } = req.body;

  try {
    const goal = await Goal.create({
      user: req.user._id,
      goal_name,
      goal_amount,
      achieved_amount: 0,
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: "Failed to create goal" });
  }
};

// Update goal progress
exports.updateGoalProgress = async (req, res) => {
  const { goalId } = req.params;
  const { achieved_amount } = req.body;

  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: req.user._id },
      { achieved_amount },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: "Failed to update goal" });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;

  try {
    const goal = await Goal.findOneAndDelete({
      _id: goalId,
      user: req.user._id,
    });
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
};