"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import DashboardCard from "../../../components/DashboardCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getNotifications, fetchUserProfile, getCourseDetails } from "../../../utils/api";
import { AcademicCapIcon } from "@heroicons/react/24/outline"; // Heroicons for header icon

const StudentDashboard: React.FC = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string>("Student");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const name1 = localStorage.getItem("name");

        if (name1) {
            setUserName(name1); // Use the name directly from localStorage if available
        }

        if (userId) {
            const loadUserProfile = async () => {
                try {
                    const profile = await fetchUserProfile(userId);
                    if (profile?.name && !name1) {
                        setUserName(profile.name); // Use the fetched name only if `name1` is not available
                    }

                    if (profile?.profilePicture) {
                        setProfilePicture(`http://localhost:3000${profile.profilePicture}`);
                    } else {
                        setProfilePicture(null);
                    }
                } catch (err) {
                    console.error("Failed to load user profile:", err);
                }
            };

            const fetchNotificationsWithCourseNames = async () => {
                try {
                    const data = await getNotifications(userId);

                    // Fetch course names for each notification
                    const notificationsWithCourseNames = await Promise.all(
                        data.map(async (notification: any) => {
                            if (notification.courseId) {
                                try {
                                    const courseDetails = await getCourseDetails(notification.courseId);
                                    return {
                                        ...notification,
                                        courseName: courseDetails.title || "Unknown Course",
                                    };
                                } catch {
                                    return {
                                        ...notification,
                                        courseName: "Unknown Course",
                                    };
                                }
                            }
                            return notification;
                        })
                    );

                    // Sort notifications by createdAt in descending order (newest first)
                    notificationsWithCourseNames.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );

                    setNotifications(notificationsWithCourseNames);
                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                } finally {
                    setLoading(false);
                }
            };

            loadUserProfile();
            fetchNotificationsWithCourseNames();
        }
    }, []);

    // Navigation handlers for buttons
    const handleNavigateToMyCourses = () => {
        router.push("/student/my-courses");
    };

    const handleNavigateToSearchCourse = () => {
        router.push("/student/search-courses");
    };

    const handleNavigateToSearchInstructor = () => {
        router.push("/student/search-instructors");
    };

    const handleNavigateToProfile = () => {
        router.push("/student/profile");
    };

    const handleNavigateToShowStudentsAndInstructors = () => {
        router.push("/student/students-instructors");
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen text-white">
                {/* Profile Section */}
                <div className="absolute top-4 right-4">
                    {profilePicture ? (
                        <img
                            src={profilePicture}
                            alt="User Profile"
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            onClick={handleNavigateToProfile}
                            title="See My Profile"
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer"
                            onClick={handleNavigateToProfile}
                            title="See My Profile"
                        >
                            <span className="text-white text-sm">N/A</span>
                        </div>
                    )}
                </div>

                {/* Welcome Heading with Icon */}
                <motion.div
                    className="flex items-center space-x-4 text-center mb-10"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <AcademicCapIcon className="h-12 w-12 text-blue-400" />
                    <h1 className="text-5xl font-extrabold text-blue-400">
                        Welcome {userName}!
                    </h1>
                </motion.div>

                {/* Dashboard Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleNavigateToMyCourses}
                        className="cursor-pointer bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition"
                    >
                        <DashboardCard
                            title="See My Courses"
                            description="View all the courses you are enrolled in."
                        />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleNavigateToSearchCourse}
                        className="cursor-pointer bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition"
                    >
                        <DashboardCard
                            title="Search for Course"
                            description="Find and explore available courses."
                        />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleNavigateToSearchInstructor}
                        className="cursor-pointer bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition"
                    >
                        <DashboardCard
                            title="Search for Instructor"
                            description="Find and connect with instructors."
                        />
                    </motion.div>

                    {/* New Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleNavigateToShowStudentsAndInstructors}
                        className="cursor-pointer bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition"
                    >
                        <DashboardCard
                            title="View Students & Instructors"
                            description="See the students and instructors in your courses."
                        />
                    </motion.div>
                </div>

                {/* Notifications Section */}
                <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-lg max-w-4xl w-full mt-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-100"> Notifications:</h2>
                    {loading ? (
                        <p className="text-gray-400">Loading notifications...</p>
                    ) : notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className="flex items-start space-x-4 p-4 border-l-4 border-blue-500 bg-gray-800 rounded-md"
                                >
                                    {/* Timeline Indicator */}
                                    <div className="mt-2">
                                        <div
                                            className={`w-4 h-4 rounded-full ${notification.type === "NEW CONTENT ADDED"
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
                                                }`}
                                        ></div>
                                    </div>
                                    {/* Notification Details */}
                                    <div className="flex-1">
                                        <p className="font-bold text-blue-400 uppercase">
                                            {notification.type}, {notification.courseName}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            {notification.content}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No notifications yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
