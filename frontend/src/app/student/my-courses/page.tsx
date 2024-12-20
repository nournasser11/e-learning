"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { getEnrolledCourses } from "../../../utils/api";
import { useRouter } from "next/navigation";

const MyCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const courses = await getEnrolledCourses(userId);
        setCourses(courses);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId, router]);

  const handleViewContent = (courseId: string) => {
    router.push(`/student/course-content/${courseId}`);
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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">My Courses</h1>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-4 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-bold mb-2 text-blue-400">{course.title}</h2>
                <p className="text-gray-300 mb-4">
                  {course.description || "No description available."}
                </p>
                <button
                  onClick={() => handleViewContent(course._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  View Content
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">You are not enrolled in any courses yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default MyCourses;
