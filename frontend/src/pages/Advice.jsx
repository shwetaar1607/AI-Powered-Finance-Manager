import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import {
  getGoals,
  updateGoalProgress,
  createGoal,
} from "../services/goalService";
import { getAISuggestions } from "../services/adviceService";
import AddGoalModal from "../components/premium/AddGoalModal";

const Advice = () => {
  const [goals, setGoals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null); // Track goal being edited

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      setError("Failed to load goals");
      console.error(err);
    }
  };

  // Fetch AI suggestions
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getAISuggestions();
      setSuggestions(data);
      setError(null);
    } catch (err) {
      setError("Failed to load AI suggestions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle taking action on a suggestion
  const handleTakeAction = async (suggestion, goalId) => {
    if (suggestion.action === "increase_savings") {
      try {
        const goal = goals.find((g) => g._id === goalId);
        const newAchieved = goal.achieved_amount + suggestion.impact_amount;
        await updateGoalProgress(goalId, {
          goal_name: goal.goal_name,
          goal_amount: goal.goal_amount,
          achieved_amount: newAchieved,
        });
        alert(`Added $${suggestion.impact_amount} to ${goal.goal_name}`);
        fetchGoals();
      } catch (err) {
        setError("Failed to update goal");
        console.error(err);
      }
    }
  };

  // Open modal for adding a new goal
  const handleAddGoal = () => {
    setGoalToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing goal
  const handleEditGoal = (goal) => {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchGoals();
    fetchSuggestions();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl text-gray-800 font-bold mb-6">
        Financial Advice
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Grid Layout for Advice Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Suggestions */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            AI Suggestions
          </h2>
          {loading ? (
            <p>Loading suggestions...</p>
          ) : (
            <ul className="space-y-4">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="border-b border-gray-200 pb-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 font-medium">
                        {suggestion.category}: {suggestion.text}
                      </p>
                      <p className="text-sm text-gray-600">
                        Priority: {suggestion.priority} | Impact:
                        { suggestion.impact_amount}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {suggestions.length === 0 && (
                <p className="text-gray-500">No suggestions available</p>
              )}
            </ul>
          )}
          <button
            onClick={fetchSuggestions}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Refresh Suggestions
          </button>
        </div>

        {/* Savings Goals */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Savings Goals
          </h2>
          {goals.map((goal) => (
            <div key={goal._id} className="mb-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-800 mb-2">
                  Goal: {goal.goal_name} - ${goal.goal_amount}
                </p>
                <button
                  onClick={() => handleEditGoal(goal)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{
                    width: `${
                      (goal.achieved_amount / goal.goal_amount) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Progress: ${goal.achieved_amount} / ${goal.goal_amount} (
                {((goal.achieved_amount / goal.goal_amount) * 100).toFixed(0)}%)
              </p>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-gray-500">No savings goals set</p>
          )}
          <button
            onClick={handleAddGoal}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Add New Goal
          </button>
        </div>
      </div>

      {/* Goal Modal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchGoals}
        goalToEdit={goalToEdit}
      />
    </Layout>
  );
};

export default Advice;
