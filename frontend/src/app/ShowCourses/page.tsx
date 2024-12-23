"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { fetchCourseDetailsById, enrollUserInCourse, getEnrollmentsByUser } from "../../utils/api";
import { useRouter } from "next/navigation";

interface CourseDetailsType {
  title: string;
  description: string;
  instructor: { _id: string; name: string; email: string };
  duration: string;
}

const CourseDetails = ({ params }: { params: { courseId: string } }) => {
  const [courseDetails, setCourseDetails] = useState<CourseDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.courseId) {
      fetchCourseDetails();
      fetchEnrolledCourses();
    }
  }, [params.courseId]);

  const fetchCourseDetails = async () => {
    try {
      const details = await fetchCourseDetailsById(params.courseId);
      setCourseDetails(details);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setMessage("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const enrollments = await getEnrollmentsByUser(userId);
        setEnrolledCourses(enrollments.map((enrollment: any) => enrollment.courseId));
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setMessage("Failed to fetch enrolled courses.");
    }
  };

  const handleEnroll = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || !params.courseId) {
        setMessage("User ID or Course ID is missing. Please log in again.");
        return;
      }
      if (enrolledCourses.includes(params.courseId)) {
        setMessage("You are already enrolled in this course.");
        return;
      }
      await enrollUserInCourse(userId, params.courseId);
      setMessage("Enrollment successful!");
      fetchEnrolledCourses(); // Refresh enrolled courses list
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Error during enrollment. Please try again.";
      setMessage(errorMessage);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-400">Loading course details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {message && (
          <div
            className={`p-4 mb-4 rounded ${
              message.includes("successful") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
        {courseDetails && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{courseDetails.title}</h1>
            <p className="text-lg mb-4">{courseDetails.description}</p>
            <p className="text-md mb-2">
              <strong>Instructor:</strong> {courseDetails.instructor.name} ({courseDetails.instructor.email})
            </p>
            <p className="text-md mb-6">
              <strong>Duration:</strong> {courseDetails.duration}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              onClick={handleEnroll}
            >
              Enroll in Course
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseDetails;
