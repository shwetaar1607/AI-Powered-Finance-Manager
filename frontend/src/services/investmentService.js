import api from './api';

export const getInvestments = async () => {
  const res = await api.get('/investments');
  return res.data;
};

export const createInvestment = async (investmentData) => {
  const res = await api.post('/investments', investmentData);
  return res.data;
};

export const updateInvestment = async (id, investmentData) => {
  const res = await api.patch(`/investments/${id}`, investmentData);
  return res.data;
};

export const deleteInvestment = async (id) => {
  const res = await api.delete(`/investments/${id}`);
  return res.data;
};