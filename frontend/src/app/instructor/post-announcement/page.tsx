"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { createAnnouncement, getCoursesByInstructor } from "../../../utils/api";

const PostAnnouncement = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [announcementContent, setAnnouncementContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const instructorId = localStorage.getItem("userId");
                if (!instructorId) {
                    setError("No instructor ID found.");
                    return;
                }
                const data = await getCoursesByInstructor(instructorId);
                setCourses(data);
            } catch (err) {
                setError("Failed to fetch courses.");
            }
        };
        fetchCourses();
    }, []);

    const handlePost = async () => {
        if (!selectedCourse || !announcementContent.trim()) {
            alert("Please select a course and write content.");
            return;
        }
        try {
            const instructorId = localStorage.getItem("userId");
            await createAnnouncement({
                senderId: instructorId!,
                type: "announcement",
                content: announcementContent,
                courseId: selectedCourse,
            });
            alert("Announcement posted successfully!");
            setAnnouncementContent("");
            setSelectedCourse("");
        } catch (err) {
            alert("Failed to post announcement.");
        }
    };

    return (
        <Layout>
            <div className="bg-gray-900 text-white p-6 rounded shadow-lg max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-blue-400 mb-6">Post Announcement</h1>
                <div className="mb-4">
                    <label htmlFor="course" className="block mb-2 font-medium">Select Course</label>
                    <select
                        id="course"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full p-3 bg-gray-800 text-white rounded"
                    >
                        <option value="">-- Select a Course --</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block mb-2 font-medium">Announcement Content</label>
                    <textarea
                        id="content"
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        rows={4}
                        className="w-full p-3 bg-gray-800 text-white rounded"
                    />
                </div>
                <button
                    onClick={handlePost}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Post
                </button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </Layout>
    );
};

export default PostAnnouncement;
