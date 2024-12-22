"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { BellIcon } from "@heroicons/react/outline";
import { getNotifications } from "../../../utils/api"; // API to fetch notifications

const StudentDashboard: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            const loadNotifications = async () => {
                try {
                    const fetchedNotifications = await getNotifications(userId);
                    setNotifications(fetchedNotifications);
                } catch (err) {
                    console.error("Failed to load notifications:", err);
                }
            };

            loadNotifications();
        }
    }, []);

    return (
        <Layout>
            <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen text-white">
                <div className="flex justify-between items-center w-full mb-6">
                    <h1 className="text-3xl font-bold">Welcome {userName || "Student"}!</h1>
                    <BellIcon className="h-8 w-8 text-blue-400 cursor-pointer" />
                </div>

                {/* Notifications */}
                <div className="w-full max-w-3xl mb-8">
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">Notifications</h2>
                    {notifications.length > 0 ? (
                        <ul className="space-y-4">
                            {notifications.map((notification) => (
                                <li
                                    key={notification._id}
                                    className="p-4 bg-gray-800 text-white rounded shadow-md"
                                >
                                    <p className="font-bold">{notification.type.toUpperCase()}</p>
                                    <p>{notification.content}</p>
                                    <p className="text-gray-400 text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No notifications yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
