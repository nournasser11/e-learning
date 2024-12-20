"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

      if (result?.accessToken) {
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("role", result.role);
        localStorage.setItem("userId", result._id);
        localStorage.setItem("name", result.name);

        // Role-based navigation
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
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-black p-8 rounded-md border border-gray-700">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="text-blue-400 hover:underline mb-6 block"
        >
          &larr; Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-400 text-center mb-8">Log into your account</h1>

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
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email (Required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-black text-white border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (Required)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-black text-white border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold text-white rounded-md ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition duration-300"
              }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
