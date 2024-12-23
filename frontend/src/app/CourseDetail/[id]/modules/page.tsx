"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InstructorLayout from "../../components/InstructorLayout";
import { getCourseDetails, getModuleDetails, getUserDetails } from "../../utils/api";
import {
    BookOpenIcon,
    UserGroupIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

interface Course {
    courseId: string;
    title: string;
    description?: string;
    version: number;
    status: string;
    modules: string[];
    completedStudents: string[];
    assignedStudents: string[];
}

interface Module {
    moduleId: string;
    title: string;
}

interface Student {
    id: string;
    name: string;
}

const CourseDetail: React.FC = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [modules, setModules] = useState<Record<string, string>>({}); // Map of module IDs to names
    const [students, setStudents] = useState<Record<string, string>>({}); // Map of student IDs to names
    const [showModules, setShowModules] = useState<boolean>(false);
    const [showAssignedStudents, setShowAssignedStudents] = useState<boolean>(false);
    const [showCompletedStudents, setShowCompletedStudents] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const { id } = params as { id: string };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                if (id) {
                    const fetchedCourse = await getCourseDetails(id);
                    setCourse(fetchedCourse);

                    // Fetch module details
                    const moduleMap: Record<string, string> = {};
                    for (const moduleId of fetchedCourse.modules) {
                        try {
                            const moduleDetails = await getModuleDetails(id, moduleId);
                            moduleMap[moduleId] = moduleDetails.title;
                        } catch {
                            moduleMap[moduleId] = "Unknown Module";
                        }
                    }
                    setModules(moduleMap);

                    // Fetch student details
                    const studentIds = [
                        ...new Set([...fetchedCourse.assignedStudents, ...fetchedCourse.completedStudents]),
                    ];
                    const studentMap: Record<string, string> = {};
                    for (const studentId of studentIds) {
                        try {
                            const studentDetails = await getUserDetails(studentId);
                            studentMap[studentId] = studentDetails.name;
                        } catch {
                            studentMap[studentId] = "Unknown Student";
                        }
                    }
                    setStudents(studentMap);
                }
            } catch (err) {
                setError("Failed to fetch course details");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <InstructorLayout>
                <div className="container mx-auto text-center mt-16 animate-pulse">
                    <p className="text-gray-500 text-lg">Loading course details...</p>
                </div>
            </InstructorLayout>
        );
    }

    if (error) {
        return (
            <InstructorLayout>
                <div className="container mx-auto text-center mt-16">
                    <p className="text-red-500 font-semibold">{error}</p>
                </div>
            </InstructorLayout>
        );
    }

    const handleAddModuleClick = () => {
        router.push(`/CourseDetail/${id}/FileUploadPage`);
    };

    return (
        <InstructorLayout>
            <div className="max-w-5xl mx-auto mt-8 bg-gray-800 text-white shadow-lg rounded-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-400">{course?.title}</h1>
                    <p className="text-gray-400 mt-2">{course?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-center mb-8">
                    <div>
                        <span className="text-gray-400 font-medium">Course ID</span>
                        <span className="block text-blue-400 font-semibold">{course?.courseId}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 font-medium">Version</span>
                        <span className="block text-blue-400 font-semibold">{course?.version}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-400 font-medium">Status</span>
                        <span
                            className={`block font-semibold ${course?.status === "valid" ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {course?.status
                                ? course.status.charAt(0).toUpperCase() + course.status.slice(1)
                                : ""}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center flex-wrap gap-4">
                    <button
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md"
                        onClick={() => setShowModules(!showModules)}
                    >
                        <BookOpenIcon className="h-5 w-5" />
                        {showModules ? "Hide Modules" : "Show Modules"}
                    </button>
                    <button
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md"
                        onClick={() => setShowAssignedStudents(!showAssignedStudents)}
                    >
                        <UserGroupIcon className="h-5 w-5" />
                        {showAssignedStudents ? "Hide Enrolled Students" : "Show Enrolled Students"}
                    </button>
                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md"
                        onClick={() => setShowCompletedStudents(!showCompletedStudents)}
                    >
                        <UserGroupIcon className="h-5 w-5" />
                        {showCompletedStudents ? "Hide Completed Students" : "Show Completed Students"}
                    </button>
                    <button
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md"
                        onClick={handleAddModuleClick}
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Module
                    </button>
                </div>

                {showModules && (
                    <div className="mt-8 bg-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-200 mb-4">Modules</h2>
                        <ul className="space-y-3">
                            {course?.modules.map((moduleId) => (
                                <li
                                    key={moduleId}
                                    className="p-4 bg-gray-600 text-gray-100 rounded-lg border hover:shadow-lg cursor-pointer transition"
                                    onClick={() => router.push(`/CourseDetail/${id}/modules/${moduleId}`)}
                                >
                                    {modules[moduleId] || "Unknown Module"} ({moduleId})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showAssignedStudents && (
                    <div className="mt-8 bg-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-200 mb-4">Enrolled Students</h2>
                        <ul className="space-y-2">
                            {course?.assignedStudents.map((studentId) => (
                                <li key={studentId} className="text-gray-300">
                                    {students[studentId] || "Unknown Student"} ({studentId})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showCompletedStudents && (
                    <div className="mt-8 bg-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-200 mb-4">Completed Students</h2>
                        <ul className="space-y-2">
                            {course?.completedStudents.map((studentId) => (
                                <li key={studentId} className="text-gray-300">
                                    {students[studentId] || "Unknown Student"} ({studentId})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
};

export default CourseDetail;