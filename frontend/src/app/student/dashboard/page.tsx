"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import DashboardCard from "../../../components/DashboardCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const StudentDashboard: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Retrieve student name from localStorage
    const retrievedName = localStorage.getItem("name");
    if (retrievedName) {
      setUserName(retrievedName);
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

  return (
    <Layout>
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen text-white">
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
