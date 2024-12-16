"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { motion } from "framer-motion";

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/register", { email, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500); // Redirect to login page after success
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center px-4">
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

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
            Create an Account
          </h1>

          {/* Success Message */}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <FormInput
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className={`w-full py-2 font-bold rounded-md ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition duration-300"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>

          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Log in
            </span>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
