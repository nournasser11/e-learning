"use client";

import React, { useState, useEffect } from "react";
import { getStudents, deleteUser, User } from "../../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsData = await getStudents();
                console.log("Fetched Students:", studentsData); // Debug fetched data
                setStudents(studentsData.map((student: any) => ({ ...student, id: student._id })));
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchStudents();
    }, []);

    const handleDelete = async (id: string | undefined) => {
        if (!id) {
            console.error("No user ID provided for deletion."); // Debug
            return;
        }
        try {
            await deleteUser(id);
            setStudents((prev) => prev.filter((student) => student.id !== id));
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-4xl p-8 bg-gray-900 rounded shadow-lg">
                <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
                    Manage Students
                </h1>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div className="grid gap-4">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id} // Ensure `id` is used
                            className="bg-gray-800 p-4 rounded shadow-lg flex items-center gap-4"
                        >
                            <img
                                src={student.profilePicture || "/images/default-profile.png"}
                                alt={student.name}
                                className="w-16 h-16 rounded-full object-cover border border-gray-600"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-blue-400">{student.name}</h3>
                                <p className="text-gray-400">Email: {student.email}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleDelete(student.id)} // Ensure `id` is passed
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete Student
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

export default ManageStudents;
