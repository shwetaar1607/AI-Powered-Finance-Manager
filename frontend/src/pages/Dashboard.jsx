import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/layout/Layout";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { getBudgets, getExpenses } from "../services/budgetService";
import { getReminders } from "../services/reminderService";
import { getInvestments } from "../services/investmentService";
import { getAIPrediction } from "../services/adviceService";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [prediction, setPrediction] = useState([]); // Initialize as empty array

  const navigate = useNavigate();
  const fetchedOnceRef = useRef(false);

  useEffect(() => {
    if (fetchedOnceRef.current) return; // Skip if already fetched
    fetchedOnceRef.current = true;

    const fetchData = async () => {
      try {
        const [
          budgetData,
          expenseData,
          investmentData,
          reminderData,
          aiPrediction,
        ] = await Promise.all([
          getBudgets(),
          getExpenses(),
          getInvestments(),
          getReminders(),
          getAIPrediction(),
        ]);

        setBudgets(budgetData);
        setExpenses(expenseData);
        setInvestments(investmentData);
        setReminders(reminderData);
        // Ensure aiPrediction is an array; fallback to empty array if not
        setPrediction(Array.isArray(aiPrediction) ? aiPrediction : []);
      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
        // Set prediction to empty array on error
        setPrediction([]);
      }
    };

    fetchData();
  }, []);

  // Budget Summary
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalLimit - totalSpent;

  // Doughnut Chart - Expenses by Category
  const expenseCategories = {};
  expenses.forEach((item) => {
    const category = item.category || "Other";
    expenseCategories[category] =
      (expenseCategories[category] || 0) + Math.abs(item.amount);
  });

  const expenseData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const expenseOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#212121" } },
      tooltip: { callbacks: { label: (ctx) => `$${ctx.raw}` } },
    },
  };

  // Investment Line Chart
  const investmentData = {
    labels: investments.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: investments.map((i) => i.value),
        borderColor: "#22c55e",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const investmentOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#212121" } },
      tooltip: { callbacks: { label: (ctx) => `$${ctx.raw}` } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#212121" } },
      x: { ticks: { color: "#212121" } },
    },
  };

  // Bill Reminders - Filter upcoming unpaid ones
  const upcomingReminders = reminders.filter(
    (r) => !r.paid && new Date(r.dueDate) >= new Date()
  );

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Budget Summary */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Budget Summary
          </h2>
          <p className="text-3xl font-bold text-green-600">
            ${remaining.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {totalSpent > totalLimit ? "Over budget" : "Remaining this month"}
          </p>
        </div>

        {/* Bill Reminders */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Bills
          </h2>
          {upcomingReminders.length === 0 ? (
            <p className="text-gray-500">No upcoming bills.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingReminders.map((r) => (
                <li
                  key={r._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-700">{r.name}</p>
                    <p className="text-sm text-gray-500">
                      Due on {new Date(r.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-semibold text-red-500">${r.amount}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI Prediction redirection */}
        <div className="p-6 h-fit bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl text-finance-dark font-semibold mb-4">
            AI Insights
          </h2>

          {prediction.length === 0 ? (
            <p className="text-sm text-gray-500">
              No predictions available. Please add more expense or budget data.
            </p>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {prediction.map((item) => (
                <div
                  key={item.id}
                  className={`border-l-4 pl-3 rounded bg-gray-50`}
                  style={{ borderColor: item.color }}
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {item.category}{" "}
                    <span className="ml-2 text-xs text-gray-400">
                      ({item.priority} Priority)
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {item.prediction}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 italic">
                    {item.advice}
                  </p>
                  {item.expected_savings !== 0 && (
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      💰 Expected Savings:{" "}
                      {typeof item.expected_savings === "number"
                        ? `$${item.expected_savings}`
                        : item.expected_savings}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/advice")}
            className="mt-4 text-finance-primary hover:underline text-sm"
          >
            Get detailed AI insights
          </button>
        </div>

        {/* Investment Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Investments
          </h2>
          <Line data={investmentData} options={investmentOptions} />
        </div>
        {/* Expense Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Expenses by Category
          </h2>
          <Doughnut data={expenseData} options={expenseOptions} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;