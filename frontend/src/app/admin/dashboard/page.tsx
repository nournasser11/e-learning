"use client";
import React from 'react';
import Layout from '../../../components/Layout';
import Button from '../../../components/Button';
import { useRouter } from 'next/navigation';

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Admin Dashboard</h1>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => navigateTo('/courses')}
            className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Manage Courses
          </Button>
          <Button
            onClick={() => navigateTo('/admin/manage-students')}
            className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Manage Students
          </Button>
          <Button
            onClick={() => navigateTo('/admin/manage-instructors')}
            className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Manage Instructors
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;