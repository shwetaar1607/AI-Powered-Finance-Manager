// models/Income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Salary", "Freelance"
  description: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);