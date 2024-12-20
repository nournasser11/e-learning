"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve the admin's name from localStorage
    const retrievedName = localStorage.getItem("name");
    if (retrievedName) {
      setUserName(retrievedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-8 bg-gray-900 rounded shadow-lg">
        {/* Welcome Message */}
        <h1 className="text-xl font-medium text-gray-300 mb-4 text-center">
          Welcome {userName || "Admin"}!
        </h1>

        {/* Dashboard Title */}
        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Admin Dashboard
        </h2>

        {/* Dashboard Buttons */}
        <div className="flex flex-col space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/admin/courses")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/admin/students")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Students
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/admin/instructors")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Instructors
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
