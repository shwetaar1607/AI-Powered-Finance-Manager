const { GoogleGenerativeAI } = require("@google/generative-ai");
const Goal = require("../models/Goal");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAISuggestions = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);

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

      Recent Expenses: ${JSON.stringify(
        expenses.map((e) => ({
          amount: e.amount,
          category: e.category,
          date: e.date,
          description: e.description,
        }))
      )}

      Format the response as a JSON array of objects with fields: id, category, text, priority, impact_amount, action, goal_id, color.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();

    let suggestions = [];
    const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (match) {
      suggestions = JSON.parse(match[0]);
    }

    res.json(suggestions);
  } catch (err) {
    console.error("AI Suggestions error:", err);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};

exports.predictAndAdviseExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    const budgets = await Budget.find({ user: req.user._id });

    if (expenses.length <= 2 || budgets.length <= 1) {
      return res.status(200).json({
        message: "Not enough expense or budget data to provide predictions.",
      });
    }

    const prompt = `
      You are a financial analyst AI. Analyze the user's budget and expense data to:
      - Predict which categories the user is likely to continue spending in.
      - Identify any budget categories where spending consistently exceeds the limit.
      - Provide 3-5 suggestions on how the user can reduce or optimize their spending.
      
      Format for each suggestion:
      {
        id: number,
        category: string,
        prediction: string,
        advice: string,
        priority: string,
        expected_savings: number,
        color: string
      }

      Budgets: ${JSON.stringify(
        budgets.map((b) => ({
          category: b.category,
          limit: b.limit,
          spent: b.spent,
          month: b.month,
        }))
      )}

      Expenses: ${JSON.stringify(
        expenses.map((e) => ({
          category: e.category,
          amount: e.amount,
          date: e.date,
        }))
      )}
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1000,
      },
    });

    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();

    console.log("📈 Predict & Advise Response:\n", rawText);

    let predictions = [];
    const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (match) {
      predictions = JSON.parse(match[0]);
    }

    res.json(predictions);
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Failed to predict and advise" });
  }
};