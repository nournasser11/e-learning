"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../utils/api";
import Layout from "../../components/Layout";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const result: { accessToken: string; role: string; _id: string; name: string } = await login({
        email,
        password,
      });

      if (result && result.accessToken) {
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("role", result.role);
        localStorage.setItem("userId", result._id);
        localStorage.setItem("name", result.name);

        switch (result.role) {
          case "student":
            router.push("/student/dashboard");
            break;
          case "instructor":
            router.push("/instructor/dashboard");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          default:
            setError("Invalid role detected.");
        }
      } else {
        setError("Login failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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

        {/* Animated Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-md w-full"
        >
          <motion.h1
            className="text-3xl font-extrabold text-center mb-6 text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Login to Your Account
          </motion.h1>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Login Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <FormInput
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 rounded px-4 py-2"
            />

            <FormInput
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 rounded px-4 py-2"
            />

            <div className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 font-bold rounded-md transition duration-300 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
