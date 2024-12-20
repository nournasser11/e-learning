"use client";

import React, { useState, useEffect } from "react";
import { getStudents, deleteUser, User } from "../../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await getStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchQuery("");
      return;
    }
    setStudents((prev) =>
      prev.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-8 bg-gray-900 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Manage Students
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for a student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-gray-200 placeholder-gray-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSearch}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Search
          </motion.button>
        </div>

        {/* List of Students */}
        <div className="grid gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-gray-800 p-4 rounded shadow-lg"
            >
              <h3 className="text-lg font-bold text-blue-400">{student.name}</h3>
              <p>Email: {student.email}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleDelete(student.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Student
              </motion.button>
            </div>
          ))}
        </div>

        {/* Back to Dashboard Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push("/admin/dashboard")}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Back to Dashboard
        </motion.button>
      </div>
    </div>
  );
};

export default ManageStudents;
