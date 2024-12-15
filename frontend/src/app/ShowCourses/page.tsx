"use client";

import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout'; // Adjust the path as needed to match your project structure
import { getCoursesByInstructor } from '../../utils/api'; // Ensure this path is correct based on your API utility file

interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  // Add other necessary properties for your course model
}

const ShowCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const instructorId = localStorage.getItem('_id') || ''; // Assuming you manage the instructor ID somehow, potentially passed as a prop or retrieved from context/store

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCoursesByInstructor(instructorId);
        setCourses(fetchedCourses);
        setError(''); // Clear previous errors on successful fetch
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses. Please try again later.');
      }
    };

    fetchCourses();
  }, [instructorId]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : courses.length > 0 ? (
          <ul>
            {courses.map((course) => (
              <li key={course.id} className="mb-4 bg-white shadow p-3 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800">{course.title}</h2>
                <p className="text-gray-600">{course.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </Layout>
  );
};

export default ShowCourses;
