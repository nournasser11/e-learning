'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourses, SearchCourses } from "../../../utils/api";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";

interface Course {
  id: string;
  name: string;
  description: string;
  progress?: number;
}

const StudentDashboard: React.FC = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  // Fetch student data and courses when component mounts
  useEffect(() => {
    const studentId = localStorage.getItem("_id") || ""; // Get student ID from localStorage
    const studentName = localStorage.getItem("name") || ""; // Get student name from localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]"); // Get enrolled courses from localStorage

    if (!studentId) {
      console.error("Student not logged in");
      router.push("/login"); // Redirect to login if the student is not logged in
      return;
    }

    // Set the student name
    setStudentName(studentName);

    // Set the enrolled courses
    setEnrolledCourses(
      enrolledCourses.map((course: any) => ({
        id: course._id,
        name: course.name,
        progress: course.progress,
      }))
    );

    // Fetch all available courses
    const fetchCourses = async () => {
      try {
        const courses = await getCourses(); // Fetch all courses
        setAllCourses(courses.map((course: any) => ({
          id: course._id,
          name: course.name,
          description: course.description,
        }))); // Set all courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses(); // Call fetchCourses when component mounts
  }, []);

  // Search courses based on query
  useEffect(() => {
    const fetchSearchedCourses = async () => {
      if (searchQuery.trim() !== "") {
        try {
          const courses = await SearchCourses(searchQuery); // Call the SearchCourses API method
          setAllCourses(courses.map((course: any) => ({
            id: course._id,
            name: course.name,
            description: course.description,
          }))); // Set the filtered courses
        } catch (error) {
          console.error("Error fetching searched courses:", error);
        }
      } else {
        // If search query is empty, show all courses
        const courses = await getCourses();
        setAllCourses(courses); // Reset to all courses
      }
    };

    fetchSearchedCourses();
  }, [searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto p-4 bg-background">
        <h1 className="text-3xl font-bold text-primary">Welcome, {studentName}</h1>

        {/* Search Bar */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Search for Courses</h2>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2 w-full p-2 border rounded bg-white text-black"
          />
          <div className="mt-4 grid gap-4">
            {allCourses.map((course) => (
              <div key={course.id} className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-bold">{course.name}</h3>
                <p>{course.description}</p>
                <Button
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="bg-highlight mt-2"
                >
                  View Content
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Enrolled Courses Section */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Your Enrolled Courses</h2>
          <div className="mt-4 grid gap-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-bold">{course.name}</h3>
                <Button
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="bg-highlight mt-2"
                >
                  View Content
                </Button>
                <Button
                  onClick={() => router.push(`/progress/${course.id}`)}
                  className="bg-primary mt-2 ml-2"
                >
                  Track Your Progress
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
