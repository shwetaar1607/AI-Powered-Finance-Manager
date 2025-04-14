const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },  // Added name field for reminder title
  description: String,
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  remind: { type: Boolean, default: false },  // Reminder flag
  reminderInterval: { type: Number, required: true },  // Days before due date to start reminding
  nextReminderDate: { type: Date },  // Tracks next occurrence after cycle
  recurrence: { type: Boolean, default: true },  // Controls if reminder should recur
}, { timestamps: true });

// Index for efficient querying of due dates
reminderSchema.index({ dueDate: 1, remind: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);