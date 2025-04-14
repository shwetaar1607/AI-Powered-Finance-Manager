import api from "./api";

export const getAISuggestions = async () => {
  const res = await api.get("/advice/suggestions");
  return res.data;
};