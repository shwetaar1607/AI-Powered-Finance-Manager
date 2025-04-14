// controllers/investmentController.js
const Investment = require("../models/Investment");

// Get all investments
exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort({
      lastUpdated: -1,
    }); // Sort by most recently updated
    res.json(investments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch investments" });
  }
};

// Create a new investment
exports.createInvestment = async (req, res) => {
  const { category, description, value, initialInvestment, purchaseDate } =
    req.body;

  try {
    const investment = await Investment.create({
      user: req.user._id,
      category,
      description,
      value,
      initialInvestment,
      purchaseDate: new Date(purchaseDate),
      roi: (((value - initialInvestment) / initialInvestment) * 100).toFixed(2), // Calculate ROI
    });
    res.status(201).json(investment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create investment" });
  }
};

// Update an investment
exports.updateInvestment = async (req, res) => {
  const { value, description } = req.body;

  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (value) {
      investment.value = value;
      investment.roi = (
        ((value - investment.initialInvestment) /
          investment.initialInvestment) *
        100
      ).toFixed(2);
      investment.lastUpdated = new Date();
      investment.growthTrend =
        value > investment.value
          ? "up"
          : value < investment.value
          ? "down"
          : "stable";
    }
    if (description) investment.description = description;

    await investment.save();
    res.json(investment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update investment" });
  }
};

// Delete an investment
exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json({ message: "Investment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete investment" });
  }
};
