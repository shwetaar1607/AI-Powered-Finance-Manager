// components/AddInvestmentModal.js
import React, { useState } from "react";
import { createInvestment } from "../../services/investmentService";
import "../../assets/styles/modals.css";

const AddInvestmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    category: "",
    description: "",
    value: "",
    initialInvestment: "",
    purchaseDate: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await createInvestment({
        ...form,
        value: Number(form.value),
        initialInvestment: Number(form.initialInvestment),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create investment:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add Investment</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
          placeholder="Category (e.g., Stocks)"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
          placeholder="Current Value"
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
          placeholder="Initial Investment"
          name="initialInvestment"
          type="number"
          value={form.initialInvestment}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3"
          placeholder="Purchase Date"
          name="purchaseDate"
          type="date"
          value={form.purchaseDate}
          onChange={handleChange}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddInvestmentModal;