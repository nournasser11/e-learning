"use client";

import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import DashboardCard from '../../../components/DashboardCard';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router

const InstructorDashboard = () => {
  const router = useRouter(); // Use the correct hook for navigation
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const retrievedName = localStorage.getItem("name");
    if (retrievedName) {
      setUserName(retrievedName);
    }
  }, []);

  const handleNavigateToCourses = () => {
    router.push('/ShowCourses');
  };

  const handleNavigateToCreateCourse = () => {
    router.push('/CreateCourses'); // Ensure the path matches your file structure
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-primary">
          Welcome {userName || "Instructor"}!
        </h1>
        <div onClick={handleNavigateToCreateCourse} style={{ cursor: 'pointer' }}>
          <DashboardCard title="Create Courses" description="Develop and publish new courses." />
        </div>
        <DashboardCard title="Manage Students" description="Track student progress and engagement." />
        <DashboardCard title="Course Analytics" description="Analyze course performance and feedback." />
        <div onClick={handleNavigateToCourses} style={{ cursor: 'pointer' }}>
          <DashboardCard title="Show Courses" description="Show instructor courses." />
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDashboard;