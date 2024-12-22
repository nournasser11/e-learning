"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaBook, FaGraduationCap, FaUserTie } from "react-icons/fa";
import Layout from "../../../components/Layout";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setAdminName(storedName);
    } else {
      setAdminName("Admin");
    }
  }, []);

  return (
    <Layout>
      <div className="relative min-h-screen bg-gray-900 text-white px-4 pt-20 pb-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-xl font-medium text-gray-300 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome, <span className="text-blue-400 font-bold">{adminName}</span>!
          </motion.h2>
          <motion.h1
            className="text-3xl font-bold text-blue-400 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Admin Dashboard
          </motion.h1>
        </div>

        {/* Dashboard Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Courses Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push("/admin/courses")}
          >
            <FaBook className="text-blue-400 text-4xl mb-4 mx-auto" />
            <h2 className="text-lg font-bold text-center text-white">Manage Courses</h2>
            <p className="text-center text-gray-400 mt-2">
              View and manage all courses on the platform.
            </p>
          </motion.div>

          {/* Manage Students Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push("/admin/students")}
          >
            <FaGraduationCap className="text-green-400 text-4xl mb-4 mx-auto" />
            <h2 className="text-lg font-bold text-center text-white">Manage Students</h2>
            <p className="text-center text-gray-400 mt-2">
              Track progress and engagement of all students.
            </p>
          </motion.div>

          {/* Manage Instructors Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push("/admin/instructors")}
          >
            <FaUserTie className="text-yellow-400 text-4xl mb-4 mx-auto" />
            <h2 className="text-lg font-bold text-center text-white">Manage Instructors</h2>
            <p className="text-center text-gray-400 mt-2">
              Manage instructor accounts and course assignments.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
