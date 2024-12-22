"use client";

import React, { useEffect, useState } from "react";
import InstructorLayout from "../../components/InstructorLayout";
import {
    getCoursesByInstructor,
    updateCourse,
    deleteCourse,
    searchCoursesByTitleAndInstructor,
} from "../../utils/api";
import { useRouter } from "next/navigation";

import {
    BookOpenIcon,
    PencilSquareIcon,
    TrashIcon,
    MegaphoneIcon,
} from "@heroicons/react/24/outline";

interface Course {
    courseId: string;
    title: string;
    description: string;
    version: number;
    status: string;
}

const ShowCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        version: 1,
    });

    const router = useRouter();

    // Fetch all courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const instructorId = localStorage.getItem("userId");
                if (!instructorId)
                    throw new Error("Instructor ID not found in localStorage.");
                const fetchedCourses = await getCoursesByInstructor(instructorId);
                setCourses(fetchedCourses);
                setFilteredCourses(fetchedCourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        const instructorId = localStorage.getItem("userId");
        if (!instructorId) return;

        if (value.trim() === "") {
            setFilteredCourses(courses);
        } else {
            try {
                const searchResults = await searchCoursesByTitleAndInstructor(
                    value,
                    instructorId
                );
                setFilteredCourses(searchResults);
            } catch (err) {
                console.error("Failed to search courses:", err);
            }
        }
    };

    const handleOpenUpdateModal = (course: Course) => {
        setCurrentCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            version: course.version,
        });
        setShowUpdateModal(true);
    };

    const handleUpdateCourse = async () => {
        if (!currentCourse) return;

        try {
            await updateCourse(currentCourse.courseId, formData);
            setShowUpdateModal(false);
            setFilteredCourses((prev) =>
                prev.map((course) =>
                    course.courseId === currentCourse.courseId
                        ? { ...course, ...formData }
                        : course
                )
            );
        } catch (err) {
            console.error("Failed to update course:", err);
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            await deleteCourse(courseId);
            setFilteredCourses((prev) =>
                prev.filter((course) => course.courseId !== courseId)
            );
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    };

    return (
        <InstructorLayout>
            <div className="max-w-7xl mx-auto mt-8 bg-gray-900 text-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center text-blue-300 mb-6">
                    All Courses
                </h1>

                {/* Create Announcement Button */}
                <div className="flex justify-end mb-4">
                    <button
                        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                        onClick={() => router.push("/instructor/post-announcement")}
                    >
                        <MegaphoneIcon className="h-5 w-5 text-yellow-400" />
                        <span>Create Announcement</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* List of Courses */}
                {loading ? (
                    <p className="text-center text-gray-400 animate-pulse">
                        Loading courses...
                    </p>
                ) : filteredCourses.length > 0 ? (
                    <ul className="space-y-6">
                        {filteredCourses.map((course) => (
                            <li
                                key={course.courseId}
                                className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-100">
                                            {course.title}
                                        </h2>
                                        <p className="text-gray-300 mt-2">
                                            {course.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() =>
                                                router.push(`/instructor/courses/${course.courseId}`)
                                            }
                                        >
                                            <BookOpenIcon className="h-6 w-6 text-blue-400 hover:text-blue-600" />
                                        </button>
                                        <button onClick={() => handleOpenUpdateModal(course)}>
                                            <PencilSquareIcon className="h-6 w-6 text-yellow-400 hover:text-yellow-600" />
                                        </button>
                                        <button onClick={() => handleDeleteCourse(course.courseId)}>
                                            <TrashIcon className="h-6 w-6 text-red-400 hover:text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">No courses available.</p>
                )}
            </div>

            {/* Update Modal */}
            {showUpdateModal && currentCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Update Course</h2>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="version" className="block text-sm font-medium">
                                Version
                            </label>
                            <input
                                type="number"
                                id="version"
                                value={formData.version}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, version: parseInt(e.target.value) }))
                                }
                                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCourse}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </InstructorLayout>
    );
};

export default ShowCourses;
