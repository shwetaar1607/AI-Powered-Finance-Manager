import React, { useState } from "react";
import { createBudget } from "../../services/budgetService";
import "../../assets/styles/modals.css";

const AddBudgetModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ category: "", limit: "", month: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await createBudget(form);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add Budget</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Category"
          name="category"
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Limit"
          name="limit"
          type="number"
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Month"
          name="month"
          type="month"
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

export default AddBudgetModal;
