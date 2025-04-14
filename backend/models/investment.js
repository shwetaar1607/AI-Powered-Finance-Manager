// models/Investment.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // e.g., "Stocks", "Bonds", "Real Estate"
  description: { type: String }, // e.g., "Tech, Healthcare, Energy"
  value: { type: Number, required: true }, // Current value in dollars
  initialInvestment: { type: Number, required: true }, // Amount initially invested
  purchaseDate: { type: Date, required: true }, // When the investment was made
  roi: { type: Number, default: 0 }, // Return on Investment (percentage)
  growthTrend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' }, // Trend direction
  lastUpdated: { type: Date, default: Date.now }, // Last time value/ROI was updated
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);