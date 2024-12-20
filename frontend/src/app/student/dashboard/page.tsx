"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import DashboardCard from "../../../components/DashboardCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchUserProfile } from "../../../utils/api"; // Fetch user profile from API

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      const loadUserProfile = async () => {
        try {
          const profile = await fetchUserProfile(userId);
          if (profile.name) setUserName(profile.name);

          // Update profile picture URL or set null if unavailable
          if (profile.profilePicture) {
            setProfilePicture(`http://localhost:3000${profile.profilePicture}`);
          } else {
            setProfilePicture(null);
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      };

      loadUserProfile();
    }
  }, []);

  // Handlers for navigation
  const handleNavigateToMyCourses = () => {
    router.push("/student/my-courses");
  };

  const handleNavigateToSearchCourse = () => {
    router.push("/student/search-courses");
  };

  const handleNavigateToSearchInstructor = () => {
    router.push("/student/search-instructors");
  };

  const handleNavigateToProfile = () => {
    router.push("/student/profile");
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen text-white">
        {/* Profile Icon */}
        <div className="absolute top-4 right-4">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={handleNavigateToProfile}
              title="See My Profile"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer"
              onClick={handleNavigateToProfile}
              title="See My Profile"
            >
              <span className="text-white text-sm">No Pic</span>
            </div>
          )}
        </div>

        {/* Animated Heading */}
        <motion.h1
          className="text-5xl font-extrabold text-blue-400 mb-10 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome {userName || "Student"}!
        </motion.h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={handleNavigateToMyCourses}
            className="cursor-pointer"
          >
            <DashboardCard
              title="See My Courses"
              description="View all the courses you are enrolled in."
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={handleNavigateToSearchCourse}
            className="cursor-pointer"
          >
            <DashboardCard
              title="Search for Course"
              description="Find and explore available courses."
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={handleNavigateToSearchInstructor}
            className="cursor-pointer"
          >
            <DashboardCard
              title="Search for Instructor"
              description="Find and connect with instructors."
            />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
