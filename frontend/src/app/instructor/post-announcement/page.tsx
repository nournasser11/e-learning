"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import { getCoursesByInstructor, createNotification } from "../../../utils/api";
import { MegaphoneIcon, AcademicCapIcon } from "@heroicons/react/24/outline"; // Use `MegaphoneIcon` instead

const PostAnnouncement = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [announcementContent, setAnnouncementContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            const instructorId = localStorage.getItem("userId");
            if (!instructorId) {
                setError("No instructor ID found. Please log in again.");
                setLoading(false);
                return;
            }
            try {
                const data = await getCoursesByInstructor(instructorId);
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handlePostAnnouncement = async () => {
        if (!selectedCourse || !announcementContent.trim()) {
            alert("Please select a course and write an announcement.");
            return;
        }

        try {
            const instructorId = localStorage.getItem("userId");
            await createNotification({
                senderId: instructorId!,
                type: "announcement",
                content: announcementContent,
                courseId: selectedCourse,
            });
            alert("Announcement posted successfully!");
            router.push("/instructor/dashboard");
        } catch (err) {
            console.error("Error posting announcement:", err);
            alert("Failed to post announcement. Please try again.");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto mt-10 p-6 bg-gray-900 text-white shadow-lg rounded-lg">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <MegaphoneIcon className="h-10 w-10 text-blue-400" />
                    <h1 className="text-3xl font-extrabold text-blue-400">Post an Announcement</h1>
                </div>

                {error && (
                    <p className="text-center text-red-500 mb-4">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-gray-400 animate-pulse">
                        Loading courses...
                    </p>
                ) : (
                    <div className="space-y-6">
                        {/* Course Selection */}
                        <div>
                            <label
                                htmlFor="course"
                                className="block text-lg font-medium text-gray-300 mb-2"
                            >
                                Select Course
                            </label>
                            <select
                                id="course"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full p-3 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select a Course --</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Announcement Content */}
                        <div>
                            <label
                                htmlFor="announcement"
                                className="block text-lg font-medium text-gray-300 mb-2"
                            >
                                Announcement Content
                            </label>
                            <textarea
                                id="announcement"
                                value={announcementContent}
                                onChange={(e) => setAnnouncementContent(e.target.value)}
                                rows={5}
                                className="w-full p-3 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Write your announcement here..."
                            ></textarea>
                        </div>

                        {/* Post Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handlePostAnnouncement}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
                            >
                                <AcademicCapIcon className="h-6 w-6" />
                                <span>Post Announcement</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PostAnnouncement;
