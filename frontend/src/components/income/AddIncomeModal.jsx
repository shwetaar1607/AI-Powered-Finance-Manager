// src/components/income/AddIncomeModal.js
import React, { useState } from "react";
import { createIncome } from "../../services/incomeService";
import "../../assets/styles/modals.css";

const AddIncomeModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    month: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await createIncome({
        ...form,
        amount: Number(form.amount), // Ensure amount is a number
      });
      onSuccess(); // Call success callback to refresh incomes
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to create income:", error);
      // Optionally add error handling UI here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add Income</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Category (e.g., Salary)"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Description (optional)"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Month"
          name="month"
          type="month" // HTML5 month input for YYYY-MM
          value={form.month}
          onChange={handleChange}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIncomeModal;
