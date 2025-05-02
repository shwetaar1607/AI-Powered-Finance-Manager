import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import {
  deleteBudget,
  getBudgets,
  getExpenses,
} from "../services/budgetService";
import AddBudgetModal from "../components/budget/AddBudgetModal";
import AddExpenseModal from "../components/budget/AddExpenseModal";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchBudgets = async () => {
    const data = await getBudgets();
    setBudgets(data);
  };

  const fetchExpenses = async () => {
    const expData = await getExpenses();
    setExpenses(expData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      await deleteBudget(id);
      fetchBudgets();
    }
  };

  function formatMonth(dateString) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    // Split the string into year and month
    const [year, month] = dateString.split("-");
    // Convert month to number (0-based index)
    const monthIndex = parseInt(month, 10) - 1;
    return monthNames[monthIndex];
  }


  // Get unique months from expenses and transactions
  const getUniqueMonths = () => {
    const expenseMonths = expenses.map((exp) => formatMonth(exp.date));
    return ["all", ...new Set([...expenseMonths])];
  };

  // Get unique categories from budgets
  const getUniqueCategories = () => {
    const categories = budgets.map((b) => b.category);
    return ["all", ...new Set(categories)];
  };

  // Filter expenses based on selected month
  const filteredExpenses =
    selectedMonth === "all"
      ? expenses
      : expenses.filter((exp) => formatMonth(exp.date) === selectedMonth);



  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-finance-dark">
          Budget Overview
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setBudgetModalOpen(true)}
            className="btn-primary"
          >
            <FaPlusCircle className="mr-2" /> Add Budget
          </button>
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="btn-accent"
          >
            <FaPlusCircle className="mr-2" /> Add Expense
          </button>
        </div>
      </div>

      {/* Budgets Section */}
      <h2 className="text-2xl font-semibold mb-4">Budgets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {budgets.map((b) => (
          <div key={b._id} className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">{b.category}</h3>
            <p>
              Spent: ${b.spent} / ${b.limit}
            </p>
            <p >Month: {formatMonth(b.month)}</p>
            {b.spent > b.limit && (
              <p className="text-red-400">⚠ Over Budget</p>
            )}
            <button
              onClick={() => handleDelete(b._id)}
              className="hover:underline flex justify-content-end mt-3"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Expenses Section */}
      <div className="mb-6">
        <label htmlFor="monthFilter" className="mr-2 font-semibold">
          Filter by Month:
        </label>
        <select
          id="monthFilter"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded mr-4"
        >
          {getUniqueMonths().map((month) => (
            <option key={month} value={month}>
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredExpenses.map((exp) => (
          <div key={exp._id} className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">{exp.category}</h3>
            <p>Amount: ${exp.amount}</p>
            <p>Month: {formatMonth(exp.date)}</p>
            <p>Date: {new Date(exp.date).toLocaleDateString()}</p>
          </div>
        ))}
        {filteredExpenses.length === 0 && (
          <p className="text-gray-500">
            No expenses found for{" "}
            {selectedMonth === "all" ? "any month" : selectedMonth}
          </p>
        )}
      </div>

      {/* Modals */}
      <AddBudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSuccess={fetchBudgets}
      />
      <AddExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSuccess={() => {
          fetchBudgets();
          fetchExpenses();
        }}
      />
    </Layout>
  );
};

export default Budget;
