"use client";
import React, { useEffect, useState } from 'react';
import { getCourses } from '../../../utils/api';
import Layout from '../../../components/Layout';

interface Course {
    id: string;
    title: string;
    status: string;
}

const ManageCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                setError('An error occurred while fetching courses.');
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-primary">Manage Courses</h1>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ul>
                        {courses.map(course => (
                            <li key={course.id} className="border p-2 my-2">
                                <h2 className="text-xl">{course.title}</h2>
                                <p>Status: {course.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

export default ManageCourses;