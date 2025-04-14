// src/components/Profile.js
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { FaUser, FaEdit, FaSave } from "react-icons/fa";
import { updateProfile, getCurrentUser } from "../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user data from localStorage on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setForm({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
      });
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const updatedData = await updateProfile(form);
      setUser(updatedData.user); // Update local state with new user data
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      setForm({ ...form, password: "" }); // Clear password field
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (!user) {
    return (
      <Layout>
        <p className="text-finance-dark">Please log in to view your profile.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl text-finance-dark font-bold mb-6">
        User Profile
      </h1>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-finance-dark font-semibold flex items-center">
            <FaUser className="text-finance-primary mr-2" /> Profile Details
          </h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-finance-primary hover:text-finance-primary/80 flex items-center"
            >
              <FaEdit className="mr-1" /> Edit
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-finance-dark mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-finance-primary"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-finance-dark mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-finance-primary"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-finance-dark mb-1">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-finance-primary"
                placeholder="Enter new password"
              />
            </div>
            {error && <p className="text-finance-danger mb-4">{error}</p>}
            {success && <p className="text-finance-success mb-4">{success}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center">
                <FaSave className="mr-1" /> Save
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-finance-dark mb-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-finance-dark mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
