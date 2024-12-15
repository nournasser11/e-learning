"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../utils/api";
import Layout from '../../components/Layout';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await login({ email, password });
      console.log("Login API result:", result);

      if (result && result.accessToken && result.role) {
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("role", result.role || "unknown");

        if (result.role === "instructor") {
          router.push("/instructor/dashboard");
        } else if (result.role === "admin") {
          router.push("/admin/dashboard");
        } else if (result.role === "student") {
          router.push("/student/dashboard");
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
    <Layout>
      <div className="container mx-auto p-4 bg-background">
        <h1 className="text-3xl font-bold text-primary">Login</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mt-4">
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="bg-highlight">Login</Button>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;