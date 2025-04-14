// src/components/Income.js
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { FaMoneyBillWave, FaPlusCircle, FaTrash } from "react-icons/fa";
import { getIncome, deleteIncome } from "../services/incomeService";
import AddIncomeModal from "../components/income/AddIncomeModal";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchIncomes(selectedMonth);
  }, [selectedMonth]);

  const fetchIncomes = async (month) => {
    try {
      setLoading(true);
      let incomeResults = [];

      if (month) {
        const income = await getIncome(month);
        incomeResults = income && income._id ? [income] : [];
      } else {
        const months = ["2025-04", "2025-05", "2025-06"]; // Fallback: default months
        const promises = months.map((m) => getIncome(m).catch(() => null));
        const results = await Promise.all(promises);
        incomeResults = results.filter((income) => income && income._id);
      }

      setIncomes(incomeResults);
    } catch (error) {
      console.error("Failed to fetch incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an income
  const handleDeleteIncome = async (month) => {
    try {
      await deleteIncome(month);
      setIncomes((prev) =>
        prev.filter((income) => income.date.slice(0, 7) !== month)
      );
    } catch (error) {
      console.error("Failed to delete income:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl text-finance-dark font-bold mb-6">
        Income Management
      </h1>

      {/* Add Income Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-finance-secondary text-white px-4 py-2 rounded-lg shadow hover:bg-finance-secondary/90"
        >
          <FaPlusCircle className="mr-2" /> Add Income
        </button>
      </div>

      <div className="flex mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm"
        />
        {selectedMonth && (
          <button
            onClick={() => setSelectedMonth("")}
            className="ml-2 text-sm text-blue-600 hover:underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Income List */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl text-finance-dark font-semibold mb-4 flex items-center">
          <FaMoneyBillWave className="text-finance-primary mr-2" /> Monthly
          Income
        </h2>

        {loading ? (
          <p>Loading incomes...</p>
        ) : incomes.length === 0 ? (
          <p className="text-gray-500">No incomes found. Add one below!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {incomes.map((income) => {
              const dateFormatted = new Date(income.date).toLocaleDateString();
              const month = income.date.slice(0, 7); // Extract YYYY-MM

              return (
                <li
                  key={income._id}
                  className="py-4 flex justify-between items-start sm:items-center sm:flex-row flex-col"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="text-lg font-semibold text-finance-dark">
                      {income.category}
                    </p>
                    <p className="text-sm text-finance-success">
                      Amount: ${income.amount.toLocaleString()} – {month}
                    </p>
                    {income.description && (
                      <p className="text-sm text-gray-600">
                        {income.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaMoneyBillWave className="mr-1 text-finance-primary" />
                      {dateFormatted}
                    </div>

                    {/* Delete Income */}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete income for ${month}?`
                          )
                        ) {
                          handleDeleteIncome(month);
                        }
                      }}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
                      title="Delete Income"
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add Income Modal */}
      <AddIncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchIncomes}
      />
    </Layout>
  );
};

export default Income;
