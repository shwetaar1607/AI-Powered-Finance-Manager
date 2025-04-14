// components/premium/EditInvestmentModal.js
import React, { useState, useEffect } from "react";
import { updateInvestment } from "../../services/investmentService";
import "../../assets/styles/modals.css";

const EditInvestmentModal = ({ isOpen, onClose, investment, onSuccess }) => {
  const [form, setForm] = useState({
    category: "",
    description: "",
    value: "",
    initialInvestment: "",
    purchaseDate: "",
  });

  // Pre-populate form with existing investment data
  useEffect(() => {
    if (investment) {
      setForm({
        category: investment.category || "",
        description: investment.description || "",
        value: investment.value || "",
        initialInvestment: investment.initialInvestment || "",
        purchaseDate: investment.purchaseDate
          ? new Date(investment.purchaseDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [investment]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await updateInvestment(investment._id, {
        ...form,
        value: Number(form.value),
        initialInvestment: Number(form.initialInvestment),
      });
      onSuccess(); // Refresh investments list
      onClose();
    } catch (error) {
      console.error("Failed to update investment:", error);
    }
  };

  if (!isOpen || !investment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">Edit Investment</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Category (e.g., Stocks)"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Current Value"
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Initial Investment"
          name="initialInvestment"
          type="number"
          value={form.initialInvestment}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Purchase Date"
          name="purchaseDate"
          type="date"
          value={form.purchaseDate}
          onChange={handleChange}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInvestmentModal;
