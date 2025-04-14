import api from './api';

export const getBudgets = async () => {
  const res = await api.get('/budgets');
  return res.data;
};

export const createBudget = async (budgetData) => {
  const res = await api.post('/budgets', budgetData);
  return res.data;
};

export const createExpense = async (expenseData) => {
    const res = await api.post('/budgets/add-expense', expenseData);
    return res.data;
};

export const getExpenses = async () => {
  const res = await api.post('/budgets/get-expense');
  return res.data;
};

export const deleteBudget = async (id) => {
  const res = await api.delete(`/budgets/${id}`);
  return res.data;
};

export const getSpendingByCategory = async (month) => {
  const res = await api.get(`/budgets/spending-category?month=${month}`);
  return res.data;
};

export const getMonthlySummary = async (month) => {
  const res = await api.get(`/budgets/monthly-summary?month=${month}`);
  return res.data;
};

export const getBudgetVsActual = async (month) => {
  const res = await api.get(`/budgets/budget-vs-actual?month=${month}`);
  return res.data;
};

export const getTopExpenses = async (month) => {
  const res = await api.get(`/budgets/top-expenses?month=${month}`);
  return res.data;
};