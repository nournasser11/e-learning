"use client";

import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { searchInstructorsByName, getCoursesByInstructor } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Instructor {
  _id: string;
  name: string;
  email: string;
}
interface Course {
  _id: string; // Add the optional id property
  title: string;
  description: string;
  instructor: string;

  // Add other course properties as needed
}

// Removed duplicate Course interface

const SearchInstructor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noCoursesMessage, setNoCoursesMessage] = useState("");  // For displaying no courses message conditionally

  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setCourses([]);  // Clear previous courses
    setNoCoursesMessage("");  // Clear no courses message

    try {
      const results = await searchInstructorsByName(searchQuery);
      setInstructors(results);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError("Failed to fetch instructors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstructorClick = async (instructorId: string) => {
    setLoading(true);
    setCourses([]);
    setNoCoursesMessage(""); // Clear previous no courses message
  
    try {
      const fetchedCourses = await getCoursesByInstructor(instructorId);
  
      // Transform data to ensure '_id' is present
      const normalizedCourses = fetchedCourses.map(course => ({
        ...course,
        _id: course.id || course._id, // Use id if _id is not available
      }));
  
      if (normalizedCourses.length === 0) {
        setNoCoursesMessage("Instructor does not teach any courses yet.");
      } else {
        setCourses(normalizedCourses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCourseClick = (courseId: string) => {
    router.push('/student/course-details/${courseId}');
  };

  return (
    <Layout>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.h1
          className="text-4xl font-bold mb-6 text-blue-400 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Search for an Instructor
        </motion.h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search by instructor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-3/4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Search Results for Instructors */}
        {error && <p className="text-red-500">{error}</p>}
        {instructors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <div
                key={instructor._id}
                onClick={() => handleInstructorClick(instructor._id)}
                className="p-4 bg-gray-800 text-white border rounded-lg cursor-pointer"
              >
                <h2 className="text-xl font-bold">{instructor.name}</h2>
                <p>{instructor.email}</p>
              </div>
            ))}
          </div>
        )}

        <hr className="my-4 w-full border-t border-gray-300" />

        {/* No Courses Message, if applicable */}
        {noCoursesMessage && (
          <p className="text-center text-gray-400">{noCoursesMessage}</p>
        )}

        {/* Search Results for Courses */}
        {loading ? (
          <motion.p className="text-center text-gray-400" initial={{ opacity: 0 }} animate={{ opacity :1 }}>
            Loading courses...
          </motion.p>
        ) : (
          courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition duration-300"
                >
                  <h2 className="text-lg font-bold mb-1 text-blue-400">{course.title}</h2>
                  <p className="text-sm text-gray-300">{course.description}</p>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default SearchInstructor;