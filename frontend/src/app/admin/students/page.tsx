"use client";

import React, { useState, useEffect } from "react";
import { getStudents, deleteUser, User } from "../../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
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

  const handleViewCourses = (courses: string[]) => {
    setSelectedCourses(courses);
    setIsPopupOpen(true);
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
            <div key={student.id} className="bg-gray-800 p-4 rounded shadow-lg">
              <h3 className="text-lg font-bold text-blue-400">{student.name}</h3>
              <p>Email: {student.email}</p>
              <div className="flex space-x-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete Student
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleViewCourses(student.courses || [])}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Enrolled Courses
                </motion.button>
              </div>
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

        {/* Enrolled Courses Popup */}
        {isPopupOpen && selectedCourses && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold text-blue-400 mb-4">
                Enrolled Courses
              </h2>
              {selectedCourses.length > 0 ? (
                <ul className="list-disc list-inside">
                  {selectedCourses.map((course, index) => (
                    <li key={index} className="text-gray-200">
                      {course}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No courses enrolled.</p>
              )}
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
