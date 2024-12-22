"use client";

import React, { useEffect, useState } from "react";
import InstructorLayout from "../../../components/InstructorLayout";
import { useRouter } from "next/navigation";
import { UserCircleIcon, BookOpenIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

const InstructorDashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const retrievedName = localStorage.getItem("name");
    if (retrievedName) {
      setUserName(retrievedName);
    }
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <InstructorLayout>
      {/* Welcome Section */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, {userName || "Instructor"}!</h1>
        <p className="text-gray-400">Here's what's happening in your classroom today.</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div
          onClick={() => navigateTo("/CreateCourse")}
          className="cursor-pointer bg-gray-700 text-white p-6 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          <BookOpenIcon className="h-12 w-12 text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Create Course</h2>
          <p>Develop and publish new courses to share your knowledge.</p>
        </div>

        <div
          onClick={() => navigateTo("/ShowCourses")}
          className="cursor-pointer bg-gray-700 text-white p-6 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          <BookOpenIcon className="h-12 w-12 text-green-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Show Courses</h2>
          <p>Manage and view all your published courses.</p>
        </div>

        <div
          onClick={() => navigateTo("/ManageStudents")}
          className="cursor-pointer bg-gray-700 text-white p-6 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          <UserCircleIcon className="h-12 w-12 text-yellow-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Students</h2>
          <p>Track progress and engagement of your enrolled students.</p>
        </div>

        <div
          onClick={() => navigateTo("/Chat")}
          className="cursor-pointer bg-gray-700 text-white p-6 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-12 w-12 text-purple-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chat with Students</h2>
          <p>Engage in meaningful conversations with your students.</p>
        </div>

        <div
          onClick={() => navigateTo("/Reports")}
          className="cursor-pointer bg-gray-700 text-white p-6 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          <BookOpenIcon className="h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">View Reports</h2>
          <p>Access performance and engagement reports of your courses.</p>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="mt-8 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
        <ul className="space-y-3">
          <li className="p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition">
            <p className="font-bold text-blue-400">New Feature Added:</p>
            <p>Course insights are now available on the Reports page.</p>
          </li>
          <li className="p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition">
            <p className="font-bold text-green-400">Upcoming Webinar:</p>
            <p>Learn how to better engage with your students using our tools.</p>
          </li>
        </ul>
      </div>
    </InstructorLayout>
  );
};

export default InstructorDashboard;
