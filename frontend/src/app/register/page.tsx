"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../utils/api";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student", // Default role is "student"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await register({ ...formData, profilePictureUrl: "" });
            router.push("/login");
        } catch (error) {
            setErrorMessage("Registration failed. Please try again.");
            console.error("Registration error:", error);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
                <div className="w-full max-w-sm">
                    {/* Back Button */}
                    <button onClick={() => router.push("/")} className="mb-4 text-blue-400 hover:underline">
                        &larr; Back
                    </button>

                    {/* Header */}
                    <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">Create an Account</h1>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name (Required)"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded border border-gray-600 bg-black text-white placeholder-gray-400"
                            required
                        />

                        {/* Email Input */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email (Required)"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded border border-gray-600 bg-black text-white placeholder-gray-400"
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
                                className="w-full p-3 rounded border border-gray-600 bg-black text-white placeholder-gray-400"
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

                        {/* Role Dropdown */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">
                                Select Your Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-3 rounded border border-gray-600 bg-black text-white"
                                required
                            >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </div>

                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
                        >
                            Create an Account
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default RegisterPage;
