import React from 'react';
import Layout from '../../../components/Layout';
import DashboardCard from '../../../components/DashboardCard';

const InstructorDashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-primary">Instructor Dashboard</h1>
        <DashboardCard title="Create Courses" description="Develop and publish new courses." />
        <DashboardCard title="Manage Students" description="Track student progress and engagement." />
        <DashboardCard title="Course Analytics" description="Analyze course performance and feedback." />
      </div>
    </Layout>
  );
};

export default InstructorDashboard;