const mongoose = require('mongoose');

const plaidAccessTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accessToken: String,
  itemId: String,
  institutionName: String,
}, { timestamps: true });

module.exports = mongoose.model('PlaidAccessToken', plaidAccessTokenSchema);
