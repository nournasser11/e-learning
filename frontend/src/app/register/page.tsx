"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../utils/api";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleToggle = (role: "student" | "instructor") => {
    setFormData({ ...formData, role });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await register({ ...formData, profilePictureUrl: "" });
      router.push("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Layout>
      {/* Full Page Container */}
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden">
        {/* Floating Particles */}
        <motion.div
          className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-3xl"
          initial={{ x: -200, y: -200 }}
          animate={{ x: [0, 200, -100, 0], y: [0, 200, -100, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-16 h-16 bg-gray-600 rounded-full opacity-10 blur-2xl"
          initial={{ x: 200, y: 200 }}
          animate={{ x: [-100, 100, 0, -200], y: [100, -100, 200, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-md w-full"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/")}
            className="mb-4 text-blue-400 hover:underline"
          >
            &larr; Back
          </motion.button>

          {/* Header */}
          <motion.h1
            className="text-3xl font-extrabold text-center mb-6 text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Create an Account
          </motion.h1>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Input */}
            <input
              type="text"
              name="name"
              placeholder="Full name (Required)"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500"
              required
            />

            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Email (Required)"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500"
              required
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (Required)"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Role Toggle Menu */}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => handleRoleToggle("student")}
                className={`w-1/2 py-2 rounded ${
                  formData.role === "student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle("instructor")}
                className={`w-1/2 py-2 rounded ${
                  formData.role === "instructor"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Instructor
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                type="submit"
                className="w-full py-2 font-bold rounded-md transition duration-300 bg-blue-600 hover:bg-blue-700"
              >
                Create an Account
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
