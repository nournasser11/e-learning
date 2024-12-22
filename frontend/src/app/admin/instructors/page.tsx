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
                setInstructors(instructorsData.map((instructor: any) => ({ ...instructor, id: instructor._id })));
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
        <div className="relative min-h-screen bg-gray-900 text-white px-4 pt-20 pb-8">
            <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Manage Instructors</h1>

            {/* Instructors List */}
            <div className="grid gap-4">
                {instructors.map((instructor) => (
                    <div key={instructor.id} className="bg-gray-800 p-4 rounded shadow-md hover:shadow-lg">
                        <h3 className="text-lg font-bold text-blue-400">{instructor.name}</h3>
                        <p className="text-gray-400">Email: {instructor.email}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleDelete(instructor.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Delete Instructor
                        </motion.button>
                    </div>
                ))}
            </div>

            {/* Back to Dashboard */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push("/admin/dashboard")}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
                Back to Dashboard
            </motion.button>
        </div>
    );
};

export default ManageInstructors;
