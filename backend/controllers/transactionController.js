const Transaction = require('../models/Transaction');


exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
  res.json(transactions);
};

exports.addTransaction = async (req, res) => {
  const { name, amount, category, date, payment_channel, account_id } = req.body;

  const transaction = await Transaction.create({
    user: req.user._id,
    name,
    amount,
    category,
    date,
    payment_channel,
    account_id,
  });

  res.status(201).json(transaction);
};
