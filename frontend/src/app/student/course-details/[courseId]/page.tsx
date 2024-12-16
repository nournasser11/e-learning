"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Layout from "../../../../components/Layout";
import Button from "../../../../components/Button";
import { motion } from "framer-motion";

export default function CourseDetails() {
  const { courseId } = useParams(); // Dynamic courseId
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // Show confirmation modal
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Retrieve userId from localStorage
  useEffect(() => {
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(storedUserId);

    // Fetch course details
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!userId) {
      alert("You must be logged in to enroll!");
      return;
    }
  
    try {
      setEnrolling(true);
      const response = await axios.post("http://localhost:3000/enrollment/enroll", {
        userId,
        courseId,
      });
  
      // Check if the user was already enrolled
      if (response.data.alreadyEnrolled) {
        alert("You are already enrolled in this course.");
      } else {
        alert("You have successfully enrolled in the course!");
        router.push("/student/my-courses");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        alert("You are already enrolled in this course."); // Handle 409 Conflict
      } else {
        console.error("Enrollment failed:", err);
        alert("Failed to enroll. Please try again.");
      }
    } finally {
      setEnrolling(false);
      setShowModal(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-400">Loading course details...</p>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );

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

        {/* Course Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-2xl w-full"
        >
          <h1 className="text-4xl font-bold text-center mb-4 text-blue-400">{course.title}</h1>
          <p className="text-lg text-gray-300 text-center mb-4">
            {course.description || "No description available."}
          </p>
          <p className="text-sm text-gray-400 text-center mb-6">
            Course ID: <strong>{course._id}</strong>
          </p>

          {/* Enroll Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
            >
              Enroll in Course
            </Button>
          </div>
        </motion.div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">Confirm Enrollment</h2>
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to enroll in <strong>{course.title}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnroll}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
