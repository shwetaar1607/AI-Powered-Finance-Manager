// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transaction_id: { type: String, unique: true, sparse: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: false },
});

module.exports = mongoose.model("Expense", expenseSchema);
