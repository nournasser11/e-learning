"use client";

import React from "react";
import { useRouter } from "next/navigation";

const InstructorHeader: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Clear any user data (e.g., localStorage)
        localStorage.removeItem("name"); // Clear the stored username or other session data
        localStorage.removeItem("token"); // If you're storing a token, clear it too

        // Redirect to the login page
        router.push("/");
    };

    return (
        <header className="bg-gray-900 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
                <nav className="flex space-x-4">
                    <a
                        href="/instructor/dashboard"
                        className="hover:text-blue-400 transition"
                    >
                        Dashboard
                    </a>
                    <a href="/ShowCourses" className="hover:text-blue-400 transition">
                        Courses
                    </a>
                    <a href="/CreateCourse" className="hover:text-blue-400 transition">
                        Create Course
                    </a>
                    <button
                        onClick={handleLogout}
                        className="hover:text-red-400 transition"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default InstructorHeader;