import api from "./api";

export const getReminders = async () => {
  const res = await api.get("/reminders");
  return res.data;
};

export const createReminder = async (reminderData) => {
  const res = await api.post("/reminders", reminderData);
  return res.data;
};

export const updateReminder = async (id, reminderData) => {
  const res = await api.patch(`/reminders/${id}`, reminderData);
  return res.data;
};

export const deleteReminder = async (id) => {
  const res = await api.delete(`/reminders/${id}`);
  return res.data;
};
