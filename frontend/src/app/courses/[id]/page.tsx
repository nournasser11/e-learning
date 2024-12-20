"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const CourseDetailPage = () => {
    const { id } = useParams(); // Get the dynamic course ID
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    // Course data
    const courses: Record<
        string,
        {
            title: string;
            description: string;
            offeredBy: string;
            language: string;
            level: string;
            skills: string[];
            startDate: string;
        }
    > = {
        "1": {
            title: "Introduction to Programming",
            description: "Learn the basics of programming, including syntax, logic, and hands-on coding.",
            offeredBy: "E-Learn Academy",
            language: "English",
            level: "Beginner",
            skills: ["Programming Basics", "Problem Solving", "Algorithms"],
            startDate: "20 Dec",
        },
        "2": {
            title: "Mathematics 1",
            description: "Understand fundamental mathematical concepts.",
            offeredBy: "Math Experts",
            language: "English",
            level: "Intermediate",
            skills: ["Algebra", "Calculus", "Linear Equations"],
            startDate: "25 Dec",
        },
        "3": {
            title: "Advanced Data Structures",
            description: "Master complex data structures for efficient problem-solving.",
            offeredBy: "CS Department",
            language: "English",
            level: "Advanced",
            skills: ["Binary Trees", "Graphs", "Hashing"],
            startDate: "15 Jan",
        },
        "4": {
            title: "Machine Learning",
            description: "Build intelligent models with hands-on machine learning projects.",
            offeredBy: "AI Lab",
            language: "English",
            level: "Advanced",
            skills: ["Regression", "Classification", "Neural Networks"],
            startDate: "10 Jan",
        },
        "5": {
            title: "Data Engineering and Visualization",
            description: "Learn to process, store, and visualize data effectively.",
            offeredBy: "Data Experts",
            language: "English",
            level: "Intermediate",
            skills: ["Data Pipelines", "ETL", "Visualization"],
            startDate: "5 Jan",
        },
        "6": {
            title: "Software Design and Architecture",
            description: "Design scalable and maintainable software systems.",
            offeredBy: "Software Academy",
            language: "English",
            level: "Intermediate",
            skills: ["Design Patterns", "System Architecture", "Scalability"],
            startDate: "30 Dec",
        },
        "7": {
            title: "Database Programming",
            description: "Master SQL and NoSQL databases with hands-on projects.",
            offeredBy: "DB Masters",
            language: "English",
            level: "Beginner",
            skills: ["SQL Queries", "Database Design", "NoSQL"],
            startDate: "1 Jan",
        },
        "8": {
            title: "Requirement Engineering",
            description: "Understand how to gather and analyze software requirements.",
            offeredBy: "Project Management Experts",
            language: "English",
            level: "Intermediate",
            skills: ["Requirements Gathering", "Analysis", "Stakeholder Communication"],
            startDate: "18 Jan",
        },
        "9": {
            title: "Software Mobile Security",
            description: "Learn how to secure mobile applications.",
            offeredBy: "Cyber Security Institute",
            language: "English",
            level: "Advanced",
            skills: ["App Security", "Penetration Testing", "Encryption"],
            startDate: "12 Jan",
        },
        "10": {
            title: "Cryptography",
            description: "Learn the art of securing data through encryption.",
            offeredBy: "Security Lab",
            language: "English",
            level: "Advanced",
            skills: ["Symmetric Encryption", "Public Key Cryptography", "Hashing"],
            startDate: "22 Jan",
        },
    };

    // Find the course based on the ID
    const course = courses[id as keyof typeof courses];

    // If the course doesn't exist, show a "Course not found" message
    if (!course) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <h1 className="text-xl font-bold text-red-400">Course not found</h1>
            </div>
        );
    }

    // Handle enrollment logic
    const handleEnroll = () => {
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            alert("You are successfully enrolled!");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-400 mb-4">{course.title}</h1>
                <p className="text-gray-400 mb-6">{course.description}</p>
                <p className="text-md text-gray-500 mb-6">Offered by: {course.offeredBy}</p>
                <p className="text-md text-gray-500 mb-6">Language: {course.language}</p>
                <p className="text-md text-gray-500 mb-6">Level: {course.level}</p>
                <p className="text-md text-gray-500 mb-6">
                    Skills You Will Gain: {course.skills.join(", ")}
                </p>
                <p className="text-md text-gray-500 mb-6">Start Date: {course.startDate}</p>
                <button
                    onClick={handleEnroll}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Enroll Now
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;
