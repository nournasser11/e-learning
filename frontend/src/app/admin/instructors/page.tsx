"use client";
import React, { useEffect, useState } from 'react';
import { getInstructors } from '../../../utils/api';
import Layout from '../../../components/Layout';
import Button from '../../../components/Button';

interface Instructor {
    id: string;
    name: string;
    courses: string[];
}

const ManageInstructors: React.FC = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const data = await getInstructors();
                setInstructors(data);
            } catch (error) {
                setError('An error occurred while fetching instructors.');
                console.error('Error fetching instructors:', error);
            }
        };

        fetchInstructors();
    }, []);

    const addInstructor = async () => {
        // Logic to add instructor
    };

    const deleteInstructor = async (id: string) => {
        // Logic to delete instructor
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-primary">Manage Instructors</h1>
                <Button onClick={addInstructor} className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white mb-4">
                    Add Instructor
                </Button>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ul>
                        {instructors.map(instructor => (
                            <li key={instructor.id} className="border p-2 my-2">
                                <h2 className="text-xl">{instructor.name}</h2>
                                <p>Assigned Courses: {instructor.courses.join(', ')}</p>
                                <Button onClick={() => deleteInstructor(instructor.id)} className="bg-danger text-white">
                                    Delete Instructor
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

export default ManageInstructors;