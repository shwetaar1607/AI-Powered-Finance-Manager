import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Update to your actual backend URL
});

// Add interceptor to attach token
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("authToken");
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo}`;
  }
  return config;
});

export default api;
