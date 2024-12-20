"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { fetchUserProfile, deleteUser, updatePassword, updateName } from "../../../utils/api";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [newName, setNewName] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>(""); // For password change
  const [newPassword, setNewPassword] = useState<string>(""); // New password
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push('/login'); // Redirect to login if userId is not present
      return;
    }
  
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile(userId);
        setUser(profile);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile.');
      }
    };
  
    loadProfile();
  }, [userId]);

  const handleUpdateName = async () => {
    if (!newName) {
      alert("Name cannot be empty");
      return;
    }
  
    try {
      setLoading(true);
      console.log("Updating name for user ID:", userId, "New name:", newName); // Debug log
      await updateName(userId!, newName);
      alert("Name updated successfully!");
    } catch (err) {
      console.error("Failed to update name:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to update name.");
      } else {
        setError("Failed to update name.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill in both current and new passwords.");
      return;
    }
  
    try {
      await updatePassword(userId!, currentPassword, newPassword);
      alert("Password updated successfully!");
      setCurrentPassword(""); // Clear inputs
      setNewPassword("");
    } catch (err) {
      console.error("Failed to update password:", err);
      alert("Failed to update password. Please check your credentials.");
    }
  }

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (confirm) {
      try {
        await deleteUser(userId!);
        alert("Account deleted successfully.");
        localStorage.clear();
        router.push("/");
      } catch (err) {
        console.error("Failed to delete account:", err);
        setError("Failed to delete account.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">My Profile</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="block w-full p-2 bg-gray-700 text-white rounded"
            />
            <button
              onClick={handleUpdateName}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Name"}
            </button>
          </div>
          <div>
            <label className="font-semibold">Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full p-2 bg-gray-700 text-white rounded"
            />
            <label className="font-semibold mt-2">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full p-2 bg-gray-700 text-white rounded"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Delete Account
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
};

export default ProfilePage;
