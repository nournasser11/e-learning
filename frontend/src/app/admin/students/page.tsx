"use client";
import React, { useEffect, useState } from 'react';
import { getStudents } from '../../../utils/api';
import Layout from '../../../components/Layout';

interface Student {
    id: string;
    name: string;
    courses: string[];
}

const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data);
            } catch (error) {
                setError('An error occurred while fetching students.');
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-primary">Manage Students</h1>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ul>
                        {students.map(student => (
                            <li key={student.id} className="border p-2 my-2">
                                <h2 className="text-xl">{student.name}</h2>
                                <p>Enrolled Courses: {student.courses.join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

export default ManageStudents;