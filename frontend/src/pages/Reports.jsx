// src/components/Reports.js
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getSpendingByCategory,
  getMonthlySummary,
  getBudgetVsActual,
  getTopExpenses,
} from "../services/budgetService";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
  // State for filter (e.g., month in YYYY-MM format)
  const [selectedMonth, setSelectedMonth] = useState("2025-04"); // Default to April 2025
  const [spendingCategory, setSpendingCategory] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [budgetVsActual, setBudgetVsActual] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [categoryData, summaryData, budgetData, topExpensesData] =
          await Promise.all([
            getSpendingByCategory(selectedMonth),
            getMonthlySummary(selectedMonth),
            getBudgetVsActual(selectedMonth),
            getTopExpenses(selectedMonth),
          ]);
        setSpendingCategory(categoryData);
        setMonthlySummary(summaryData);
        setBudgetVsActual(budgetData);
        setTopExpenses(topExpensesData);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      }
    };

    if (selectedMonth) {
      fetchReports();
    }
  }, [selectedMonth]);

  // Spending Trends (Bar Chart)
  const spendingData = {
    labels: spendingCategory.map((item) => item._id),
    datasets: [
      {
        label: `${selectedMonth} Spending`,
        data: spendingCategory.map((item) => item.total),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#1F2937" }, // gray-800
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount ($)", color: "#1F2937" },
        ticks: { color: "#1F2937" },
      },
      x: {
        title: { display: true, text: "Categories", color: "#1F2937" },
        ticks: { color: "#1F2937" },
      },
    },
  };

  return (
    <Layout>
      <h1 className="text-3xl text-gray-800 font-bold mb-6">
        Financial Reports
      </h1>

      {/* Filter Section */}
      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="month-filter" className="text-gray-800 font-medium">
          Filter by Month:
        </label>
        <input
          id="month-filter"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Grid Layout for Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Spending by Category
          </h2>
          <ul className="space-y-2">
            {spendingCategory.length === 0 ? (
              <li className="text-gray-500">No data available</li>
            ) : (
              spendingCategory.map((item, i) => (
                <li key={i} className="text-gray-800">
                  {item._id}: ${item?.total?.toLocaleString()}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Monthly Summary */}
        <div className="p-6 h-fit bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Monthly Summary ({selectedMonth})
          </h2>
          <p className="text-gray-800">
            Total Income: ${monthlySummary.totalIncome?.toLocaleString() || 0}
          </p>
          <p className="text-red-600">
            Total Expenses: $
            {monthlySummary.totalExpenses?.toLocaleString() || 0}
          </p>
          <p className="text-green-600 font-medium mt-2">
            Net Savings: ${monthlySummary.netSavings?.toLocaleString() || 0}
          </p>
        </div>

        {/* Spending Trends Chart */}
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Spending Trends
          </h2>
          <div className="h-80">
            <Bar data={spendingData} options={chartOptions} />
          </div>
        </div>

        {/* Budget vs. Actual */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Budget vs. Actual
          </h2>
          <ul className="space-y-2">
            {budgetVsActual.length === 0 ? (
              <li className="text-gray-500">No data available</li>
            ) : (
              budgetVsActual.map((item, i) => {
                const diff = item.actual - item.budget;
                const isOver = diff > 0;
                return (
                  <li key={i} className="text-gray-800">
                    {item.category}: Budget ${item.budget?.toLocaleString()} /
                    Actual ${item.actual?.toLocaleString()}{" "}
                    <span
                      className={isOver ? "text-red-600" : "text-green-600"}
                    >
                      ({isOver ? "Over" : "Under"} by $
                      {Math.abs(diff)?.toLocaleString()})
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Top Expenses */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Top Expenses
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            {topExpenses.length === 0 ? (
              <li className="text-gray-500">No data available</li>
            ) : (
              topExpenses.map((item, i) => (
                <li key={i}>
                  {item.category}: ${item?.amount.toLocaleString()}
                </li>
              ))
            )}
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
