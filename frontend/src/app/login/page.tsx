"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../utils/api"; // Replace with the correct path to your API utility

const LoginPage: React.FC = () => {
  const router = useRouter(); // For navigation
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  

  // The login handler function
  const handleLogin = async () => {
    try {
      const result = await login({ email, password }); // Exclude role
      console.log("Login API result:", result); // Debug API response
  
      if (result && result.accessToken&& result.role) {
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("role", result.role || "unknown");
  
        if (result.role === "instructor") {
          router.push("/instructor/dashboard");
        } else if (result.role === "admin") {
          router.push("/admin/dashboard");
        } else if (result.role === "student") {
          router.push("/student");
        } else {
          alert(`Invalid role provided: ${result.role || "None"}`);
        }
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };
  
  return (
    <div>
    <h1>Login</h1>
    <input
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
    />
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
    />
    <button onClick={handleLogin}>Login</button>
 </div>
 
  );
};

export default LoginPage;
