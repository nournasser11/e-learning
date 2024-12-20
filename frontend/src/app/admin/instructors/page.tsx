"use client";

import React, { useState, useEffect } from "react";
import { getInstructors, deleteUser, User } from "../../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ManageInstructors: React.FC = () => {
    const [instructors, setInstructors] = useState<User[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const instructorsData = await getInstructors();
                setInstructors(instructorsData);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };
        fetchInstructors();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setInstructors((prev) => prev.filter((instructor) => instructor.id !== id));
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-4xl p-8 bg-gray-900 rounded shadow-lg">
                <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
                    Manage Instructors
                </h1>
                <div className="grid gap-4">
                    {instructors.map((instructor) => (
                        <div key={instructor.id} className="bg-gray-800 p-4 rounded shadow-lg">
                            <h3 className="text-lg font-bold text-blue-400">{instructor.name}</h3>
                            <p>Email: {instructor.email}</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleDelete(instructor.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete Instructor
                            </motion.button>
                        </div>
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => router.push("/admin/dashboard")}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                    Back to Dashboard
                </motion.button>
            </div>
        </div>
    );
};

export default ManageInstructors;