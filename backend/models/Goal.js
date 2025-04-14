const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goal_name: {
    type: String,
    required: [true, "Goal name is required"],
    trim: true,
  },
  goal_amount: {
    type: Number,
    required: [true, "Goal amount is required"],
    min: [0, "Goal amount cannot be negative"],
  },
  achieved_amount: {
    type: Number,
    default: 0,
    min: [0, "Achieved amount cannot be negative"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Goal", goalSchema);