const { GoogleGenerativeAI } = require("@google/generative-ai");
const Goal = require("../models/Goal");
const Transaction = require("../models/Transaction");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAISuggestions = async (req, res) => {
  try {
    // Fetch user goals and recent transactions
    const goals = await Goal.find({ user: req.user._id });
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);

    // Prepare prompt for Gemini
    const prompt = `
      You are a financial advisor. Based on the following user data, provide 3-5 actionable financial suggestions to improve their financial health. Each suggestion should include:
      - Category (e.g., Savings, Spending)
      - Brief description (1 sentence)
      - Priority (High, Medium, Low)
      - Estimated impact (in dollars or percentage)
      - If applicable, link to a specific savings goal (include goal_id)

      User Data:
      Goals: ${JSON.stringify(
        goals.map((g) => ({
          goal_id: g._id,
          goal_name: g.goal_name,
          goal_amount: g.goal_amount,
          achieved_amount: g.achieved_amount,
        }))
      )}

      Recent Transactions: ${JSON.stringify(
        transactions.map((t) => ({
          name: t.name,
          amount: t.amount,
          category: t.category,
          date: t.date,
        }))
      )}

      Format the response as a JSON array of objects with fields: id, category, text, priority, impact_amount, action, goal_id, color.
      Example:
      [
        {
          "id": 1,
          "category": "Savings",
          "text": "Increase savings by $50/month for emergency fund.",
          "priority": "Medium",
          "impact_amount": 50,
          "action": "increase_savings",
          "goal_id": "12345",
          "color": "text-green-600"
        }
      ]
    `;

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();

    console.log("🧠 Gemini Response:\n", rawText); // Debug log

    let suggestions = [];
    try {
      // Extract JSON array from the raw response using regex
      const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (match) {
        suggestions = JSON.parse(match[0]);
      } else {
        console.warn("⚠️ Could not find a valid JSON array in AI response.");
      }
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err.message);
    }

    res.json(suggestions);
  } catch (err) {
    console.error("AI Suggestions error:", err);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};
