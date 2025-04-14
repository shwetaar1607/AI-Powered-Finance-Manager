import React, { useState, useEffect } from "react";
import { createGoal, updateGoalProgress } from "../../services/goalService";

const AddGoalModal = ({ isOpen, onClose, onSuccess, goalToEdit = null }) => {
  const [formData, setFormData] = useState({
    goal_name: "",
    goal_amount: "",
    achieved_amount: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form with goal data if editing
  useEffect(() => {
    if (goalToEdit) {
      setFormData({
        goal_name: goalToEdit.goal_name || "",
        goal_amount: goalToEdit.goal_amount || "",
        achieved_amount: goalToEdit.achieved_amount || 0,
      });
    } else {
      setFormData({
        goal_name: "",
        goal_amount: "",
        achieved_amount: "",
      });
    }
  }, [goalToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (goalToEdit) {
        // Update existing goal
        await updateGoalProgress(goalToEdit._id, {
          goal_name: formData.goal_name,
          goal_amount: parseFloat(formData.goal_amount),
          achieved_amount: parseFloat(formData.achieved_amount) || 0,
        });
      } else {
        // Create new goal
        await createGoal({
          goal_name: formData.goal_name,
          goal_amount: parseFloat(formData.goal_amount),
          achieved_amount: parseFloat(formData.achieved_amount) || 0,
        });
      }
      onSuccess(); // Trigger parent refresh
      onClose(); // Close modal
    } catch (err) {
      setError("Failed to save goal. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {goalToEdit ? "Update Goal" : "Add New Goal"}
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="goal_name"
              className="block text-gray-700 font-medium mb-2"
            >
              Goal Name
            </label>
            <input
              type="text"
              id="goal_name"
              name="goal_name"
              value={formData.goal_name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="goal_amount"
              className="block text-gray-700 font-medium mb-2"
            >
              Goal Amount ($)
            </label>
            <input
              type="number"
              id="goal_amount"
              name="goal_amount"
              value={formData.goal_amount}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="achieved_amount"
              className="block text-gray-700 font-medium mb-2"
            >
              Achieved Amount ($)
            </label>
            <input
              type="number"
              id="achieved_amount"
              name="achieved_amount"
              value={formData.achieved_amount}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              min="0"
              step="0.01"
              placeholder="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? goalToEdit
                  ? "Updating..."
                  : "Adding..."
                : goalToEdit
                ? "Update Goal"
                : "Add Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;