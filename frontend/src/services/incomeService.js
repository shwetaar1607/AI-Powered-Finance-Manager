import api from './api';

export const getIncome = async (month) => {
  const res = await api.get(`/income?month=${month}`);
  return res.data;
};

export const getAllIncomes = async () => {
  const res = await api.get('/income'); // Assuming you might extend the backend to support this
  return res.data;
};

export const createIncome = async (incomeData) => {
  const res = await api.post('/income', incomeData);
  return res.data;
};

export const updateIncome = async (incomeData) => {
  const res = await api.put('/income', incomeData);
  return res.data;
};

export const deleteIncome = async (month) => {
    const res = await api.delete(`/income?month=${month}`);
    return res.data;
  };