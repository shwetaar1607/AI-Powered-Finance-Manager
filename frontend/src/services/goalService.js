import api from "./api";

export const getGoals = async () => {
  const res = await api.get("/goals");
  return res.data;
};

export const createGoal = async (goalData) => {
  const res = await api.post("/goals", goalData);
  return res.data;
};

export const updateGoalProgress = async (goalId, data) => {
  const res = await api.put(`/goals/${goalId}`, data);
  return res.data;
};

export const deleteGoal = async (goalId) => {
  const res = await api.delete(`/goals/${goalId}`);
  return res.data;
};