import React, { useState } from "react";
import { createReminder } from "../../services/reminderService"; // Import from your reminder service
import "../../assets/styles/modals.css";

const AddReminderModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    dueDate: "",
    amount: "",
    reminderInterval: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await createReminder({
        ...form,
        amount: Number(form.amount), // Ensure amount is a number
        reminderInterval: Number(form.reminderInterval), // Ensure reminderInterval is a number
      });
      onSuccess(); // Call success callback (e.g., to refresh reminders list)
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to create reminder:", error);
      // Optionally add error handling UI here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add Reminder</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Reminder Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Due Date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
        />
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
          placeholder="Reminder Interval (days)"
          name="reminderInterval"
          type="number"
          value={form.reminderInterval}
          onChange={handleChange}
        />
        <div className="mt-額 flex justify-end gap-2">
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

export default AddReminderModal;