// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transaction_id: { type: String, required: true, unique: true }, // Add unique index
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: [String] },
  date: { type: Date, required: true },
  payment_channel: { type: String },
  account_id: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);