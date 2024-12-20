"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getCoursesByInstructor } from "../../utils/api";

// Inline Course type
interface Course {
  _id: string;
  title: string;
  description: string;
  instructorId: string;
}

const ShowCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");

  const instructorId = localStorage.getItem("_id") || "";

  useEffect(() => {
    const fetchCourses = async () => {
      if (!instructorId) {
        setError("No instructor ID found.");
        return;
      }

      try {
        const fetchedCourses = await getCoursesByInstructor(instructorId);
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses.");
      }
    };

    fetchCourses();
  }, [instructorId]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">My Courses</h1>
        {error && <p className="text-red-500">{error}</p>}
        {courses.length > 0 ? (
          <ul>
            {courses.map((course) => (
              <li key={course._id} className="border-b p-2">
                <h2 className="text-xl">{course.title}</h2>
                <p>{course.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </Layout>
  );
};

export default ShowCourses;
