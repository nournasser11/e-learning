"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getInstructors, deleteInstructorByUserId, registerInstructor, User } from "../../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ManageInstructors: React.FC = () => {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    password: "defaultPassword123",
    profilePictureUrl: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const instructorsData = await getInstructors();
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchQuery("");
      return;
    }
    setInstructors((prev) =>
      prev.filter((instructor) =>
        instructor.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteInstructorByUserId(userId);
      setInstructors((prev) => prev.filter((instructor) => instructor.id !== userId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting instructor:", error.response?.data || error.message);
      } else {
        console.error("Error deleting instructor:", error);
      }
    }
  };

  const handleAddInstructor = async () => {
    try {
      const response = await registerInstructor(newInstructor);
      setInstructors((prev) => [...prev, response.user]);
      setIsPopupOpen(false);
      setNewInstructor({
        name: "",
        email: "",
        password: "defaultPassword123",
        profilePictureUrl: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (axios.isAxiosError(error)) {
          console.error("Error adding instructor:", error.response?.data || error.message);
        } else {
          console.error("Error adding instructor:", error.message);
        }
      } else {
        console.error("Error adding instructor:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-8 bg-gray-900 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Manage Instructors
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for an instructor..."
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

        {/* Add Instructor Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsPopupOpen(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add Instructor
        </motion.button>

        {/* List of Instructors */}
        <div className="grid gap-4">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="bg-gray-800 p-4 rounded shadow-lg">
              <h3 className="text-lg font-bold text-blue-400">{instructor.name}</h3>
              <p>Email: {instructor.email}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleDelete(instructor.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Instructor
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

        {/* Add Instructor Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold text-blue-400 mb-4">
                Add Instructor
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={newInstructor.name}
                  onChange={(e) =>
                    setNewInstructor((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 rounded bg-gray-800 text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={newInstructor.email}
                  onChange={(e) =>
                    setNewInstructor((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-2 rounded bg-gray-800 text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={newInstructor.password}
                  onChange={(e) =>
                    setNewInstructor((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full p-2 rounded bg-gray-800 text-gray-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Profile Picture URL (Optional)
                </label>
                <input
                  type="text"
                  value={newInstructor.profilePictureUrl}
                  onChange={(e) =>
                    setNewInstructor((prev) => ({
                      ...prev,
                      profilePictureUrl: e.target.value,
                    }))
                  }
                  className="w-full p-2 rounded bg-gray-800 text-gray-200"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAddInstructor}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInstructors;
