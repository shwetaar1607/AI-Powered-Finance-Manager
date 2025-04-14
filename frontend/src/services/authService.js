// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth'; // Adjust if your backend port is different

export const signUp = async (name,email, password) => {
  const response = await axios.post(`${API_URL}/register`, {name, email, password });
  return response.data;
};

export const signIn = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });

  // Save token to localStorage
  if (response.data?.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);

  // Update localStorage with new user data and token
  if (response.data?.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

