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
    role: "student", // Default role
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset
    formData.append("cloud_name", "your_cloud_name"); // Replace with your Cloudinary cloud name

    const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url; // Cloudinary's uploaded image URL
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      let profilePictureUrl = "";
      if (profilePicture) {
        profilePictureUrl = await uploadToCloudinary(profilePicture);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profilePictureUrl, // Send the URL instead of the file
      };

      await register(payload);
      router.push("/login");
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">
            Create an Account
          </h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Upload Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center text-sm">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
