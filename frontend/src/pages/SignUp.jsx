import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { signUp } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signUp(name, email, password); // Added name to signUp call
      navigate("/signin");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
            Sign Up
          </h1>
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform translate-y-1/4 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="Confirm Password"
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform translate-y-1/4 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
