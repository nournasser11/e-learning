"use client";

import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { searchCoursesByTitle } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SearchCourses = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError("");

        try {
            const results = await searchCoursesByTitle(searchQuery);
            setCourses(results);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to fetch courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (courseId: string) => {
        router.push(`/student/course-details/${courseId}`);
    };

    return (
        <Layout>
            <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
                {/* Floating Particles */}
                <motion.div
                    className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-3xl"
                    initial={{ x: -200, y: -200 }}
                    animate={{ x: [0, 200, -100, 0], y: [0, 200, -100, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-16 h-16 bg-gray-600 rounded-full opacity-10 blur-2xl"
                    initial={{ x: 200, y: 200 }}
                    animate={{ x: [-100, 100, 0, -200], y: [100, -100, 200, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Search Header */}
                <motion.h1
                    className="text-4xl font-bold mb-6 text-blue-400 text-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Search for a Course
                </motion.h1>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 w-full max-w-2xl">
                    <motion.input
                        type="text"
                        placeholder="Search by course title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-3/4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button
                        onClick={handleSearch}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        {loading ? "Searching..." : "Search"}
                    </motion.button>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.p
                        className="text-center text-red-500 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.p>
                )}

                {/* Search Results */}
                {loading ? (
                    <motion.p
                        className="text-center text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Loading courses...
                    </motion.p>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                        {courses.map((course) => (
                            <motion.div
                                key={course._id}
                                onClick={() => handleCourseClick(course._id)}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition duration-300"
                            >
                                <h2 className="text-xl font-bold mb-2 text-blue-400">{course.title}</h2>
                                <p className="text-gray-300">Course ID: {course._id}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.p
                        className="text-center text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        No courses found. Try a different search.
                    </motion.p>
                )}
            </div>
        </Layout>
    );
};

export default SearchCourses;