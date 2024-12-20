"use client";

import React, { useState, useEffect } from "react";
import { getCourses, SearchCourses, updateCourseStatus, Course } from "../../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getCourses();
        setCourses(allCourses);
        setFilteredCourses(allCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }
    try {
      const searchResults = await SearchCourses(searchQuery);
      setFilteredCourses(searchResults);
    } catch (error) {
      console.error("Error searching courses:", error);
    }
  };

  const updateCourseStatusHandler = async (
    courseId: string,
    newStatus: "valid" | "invalid" | "deleted"
  ) => {
    try {
      await updateCourseStatus(courseId, newStatus);
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, status: newStatus } : course
        )
      );
      setFilteredCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, status: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl p-8 bg-gray-900 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Manage Courses
        </h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-gray-200"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSearch}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
          >
            Search
          </motion.button>
        </div>
        <div className="grid gap-4">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-gray-800 p-4 rounded shadow-lg">
              <h3 className="text-lg font-bold text-blue-400">{course.title}</h3>
              <p>Description: {course.description}</p>
              <p>Status: {course.status}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  disabled={course.status === "valid"}
                  onClick={() => updateCourseStatusHandler(course.id, "valid")}
                  className={`px-4 py-2 rounded ${
                    course.status === "valid"
                      ? "bg-green-500 text-white opacity-50 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Mark as Valid
                </button>
                <button
                  disabled={course.status === "invalid"}
                  onClick={() => updateCourseStatusHandler(course.id, "invalid")}
                  className={`px-4 py-2 rounded ${
                    course.status === "invalid"
                      ? "bg-yellow-500 text-white opacity-50 cursor-not-allowed"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  Mark as Invalid
                </button>
                <button
                  disabled={course.status === "deleted"}
                  onClick={() => updateCourseStatusHandler(course.id, "deleted")}
                  className={`px-4 py-2 rounded ${
                    course.status === "deleted"
                      ? "bg-red-500 text-white opacity-50 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  Mark as Deleted
                </button>
              </div>
            </div>
          ))}
        </div>
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

export default ManageCourses;
