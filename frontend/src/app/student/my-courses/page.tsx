"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { getEnrollmentsByUser } from "../../../utils/api";
import { useRouter } from "next/navigation";

const MyCourses = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch the userId from localStorage
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                if (userId) {
                    const enrollments = await getEnrollmentsByUser(userId);

                    // Debugging response structure
                    console.log("API Response:", enrollments);

                    if (Array.isArray(enrollments)) {
                        const mappedCourses = enrollments.map((enrollment, index) => {
                            const courseId = enrollment.courseId?._id;
                            const modules = enrollment.courseId?.modules || [];

                            return {
                                _id: courseId,
                                title: enrollment.courseId?.title || "No Title",
                                description: enrollment.courseId?.description || "No description available.",
                                modules: modules.map((module: any, moduleIndex: number) => ({
                                    _id: module,
                                    title: `Module ${moduleIndex + 1}`,
                                })),
                            };
                        });
                        setCourses(mappedCourses);
                    } else {
                        setError("Unexpected data format received from the server.");
                    }
                } else {
                    setError("User ID not found. Please log in again.");
                }
            } catch (err) {
                console.error("Error fetching enrolled courses:", err);
                setError("Failed to load your courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [userId]);

    const handleViewContent = (courseId: string, moduleId: string) => {
        router.push(`/student/course-details/${courseId}/module/${moduleId}`);
    };

    const handleViewCourseNotes = (courseId: string) => {
        router.push(`/student/notes/${courseId}`);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-500">Loading your courses...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-500">{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {courses.length > 0 ? (
                    <div>
                        <h1 className="text-3xl font-bold text-center mb-6 text-blue-500">My Courses</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="p-6 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg"
                                >
                                    <h2 className="text-xl font-bold mb-2 text-blue-400">{course.title}</h2>
                                    <p className="text-gray-300 mb-4">{course.description}</p>

                                    <ul className="list-disc pl-4">
                                        {course.modules.length > 0 ? (
                                            course.modules.map((module: any) => (
                                                <li key={module._id}>
                                                    <button
                                                        className="text-blue-500 hover:underline"
                                                        onClick={() => handleViewContent(course._id, module._id)}
                                                    >
                                                        {module.title}
                                                    </button>
                                                    <p className="text-gray-400">Module ID: {module._id}</p>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No modules available for this course.</p>
                                        )}
                                    </ul>

                                    <button
                                        onClick={() => handleViewCourseNotes(course._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                    >
                                        View My Notes
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">You are not enrolled in any courses.</p>
                )}
            </div>
        </Layout>
    );
};

export default MyCourses;
