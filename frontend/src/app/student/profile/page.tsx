"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import {
  fetchUserProfile,
  updateName,
  updatePassword,
  updateProfilePicture,
  deleteUser,
} from "../../../utils/api";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [newName, setNewName] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile(userId);

        // Ensure the profilePicture URL is absolute
        if (profile.profilePicture) {
          profile.profilePicture = profile.profilePicture.startsWith("http")
            ? profile.profilePicture
            : `http://localhost:3000${profile.profilePicture}`;
        }

        console.log("Fetched Profile:", profile); // Debug log
        setUser(profile);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile.");
      }
    };

    loadProfile();
  }, [userId]);

  const handleUpdateProfilePicture = async () => {
    if (!profilePicture) {
      alert("Please select a profile picture.");
      return;
    }

    try {
      const response = await updateProfilePicture(userId!, profilePicture);

      const profilePictureUrl = response.profilePictureUrl.startsWith("http")
        ? response.profilePictureUrl
        : `http://localhost:3000${response.profilePictureUrl}`;

      alert("Profile picture updated successfully!");
      setUser((prev: any) => ({
        ...prev,
        profilePicture: profilePictureUrl,
      }));
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError("Failed to update profile picture.");
    }
  };

  const handleUpdateName = async () => {
    if (!newName) {
      alert("Name cannot be empty");
      return;
    }

    try {
      await updateName(userId!, newName);
      alert("Name updated successfully!");
      setUser((prev: any) => ({ ...prev, name: newName }));
    } catch (err) {
      console.error("Failed to update name:", err);
      setError("Failed to update name.");
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
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Failed to update password:", err);
      alert("Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
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
        <div className="text-center mb-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto bg-gray-600 flex items-center justify-center">
              <span className="text-sm text-gray-300">No Picture</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-white"
          />
          <button onClick={handleUpdateProfilePicture} className="w-full bg-blue-500 py-2 rounded">
            Update Profile Picture
          </button>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="block w-full bg-gray-700 p-2 rounded"
            placeholder={user.name}
          />
          <button onClick={handleUpdateName} className="w-full bg-blue-500 py-2 rounded">
            Update Name
          </button>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="block w-full bg-gray-700 p-2 rounded"
            placeholder="Current Password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full bg-gray-700 p-2 rounded"
            placeholder="New Password"
          />
          <button onClick={handleUpdatePassword} className="w-full bg-blue-500 py-2 rounded">
            Update Password
          </button>
          <button onClick={handleDeleteAccount} className="w-full bg-red-500 py-2 rounded">
            Delete Account
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
