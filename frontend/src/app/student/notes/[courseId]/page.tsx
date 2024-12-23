"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import axios from "axios";

const NotesPage = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState<string>("");
    const [noteTitle, setNoteTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState<any | null>(null); // The note currently being edited
    const [isModalOpen, setIsModalOpen] = useState(false); // For controlling the modal visibility
    const { courseId } = useParams(); // Get courseId from dynamic route params
    const router = useRouter();

    useEffect(() => {
        const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        setUserId(storedUserId);

        if (storedUserId) {
            fetchNotes(storedUserId);
        } else {
            router.push("/login");
        }
    }, [router, courseId]);

    const fetchNotes = async (userId: string) => {
        try {
            const response = await axios.get("http://localhost:3000/notes", {
                params: { userId, courseId },
            });
            setNotes(response.data);
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError("Failed to load notes.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        if (!newNote || !noteTitle) {
            setError("Please provide a title and content for the note.");
            return;
        }

        try {
            setError(null); // Reset error message
            const response = await axios.post("http://localhost:3000/notes", {
                userId,
                courseId,
                title: noteTitle,
                content: newNote,
            });
            setNotes([...notes, response.data]); // Add the new note to the list
            setNewNote("");
            setNoteTitle("");
        } catch (err) {
            console.error("Error creating note:", err);
            setError("Failed to create the note.");
        }
    };

    const handleEditNote = (note: any) => {
        setEditingNote(note);
        setNoteTitle(note.title);
        setNewNote(note.content);
        setIsModalOpen(true); // Open the modal
    };
    const handleUpdateNote = async () => {
        if (!editingNote || !noteTitle || !newNote) {
            setError("Please provide a title and content for the note.");
            return;
        }

        try {
            setError(null); // Reset error message

            // Log to check the data and URL being used
            console.log("Updating note with ID:", editingNote.noteId);
            console.log("Course ID:", courseId);
            console.log("Payload:", { title: noteTitle, content: newNote });

            const response = await axios.put(
                ` http://localhost:3000/notes/${editingNote.noteId}`, // Note ID in the URL
                {
                    title: noteTitle,
                    content: newNote,
                },
                {
                    params: { courseId }, // courseId in query params
                }
            );

            // Log the response to check what is returned
            console.log("Updated note response:", response.data);

            // Update the notes list after successful update
            const updatedNotes = notes.map((note) =>
                note.noteId === response.data.noteId ? response.data : note
            );

            setNotes(updatedNotes); // Update the note in the list
            setNewNote(""); // Clear new note content
            setNoteTitle(""); // Clear new note title
            setEditingNote(null); // Reset editing state
            setIsModalOpen(false); // Close the modal
        } catch (err) {
            console.error("Error updating note:", err);
            setError("Failed to update the note.");
        }
    };


    const handleDeleteNote = async (noteId: string) => {
        try {
            // Ensure both noteId and courseId are passed as query params
            const response = await axios.delete(`http://localhost:3000/notes/${noteId}`, {
                params: { courseId }, // Pass courseId here if needed
            });

            // Remove the deleted note from the state
            setNotes(notes.filter((note) => note.noteId !== noteId));
            console.log("Note deleted successfully:", response.data);
        } catch (err) {
            console.error("Error deleting note:", err);
            setError("Failed to delete the note.");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-gray-500">Loading your notes...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">My Notes</h2>

                <div className="mb-6">
                    <input
                        type="text"
                        className="border p-2 rounded w-full mb-4 text-black"
                        placeholder="Enter note title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                    />
                    <textarea
                        className="border p-2 rounded w-full mb-4 text-black"
                        placeholder="Enter note content"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button
                        onClick={handleCreateNote}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Create Note
                    </Button>
                </div>

                {error && <p className="text-red-500 text-center mb-6">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <div
                                key={note.noteId}
                                className="p-4 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-blue-400">{note.title}</h3>
                                <p className="text-gray-300 mb-4">{note.content}</p>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => handleEditNote(note)} // Open edit modal
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteNote(note.noteId)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">You don't have any notes yet.</p>
                    )}
                </div>

                {/* Modal for editing the note */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Edit Note</h2>

                            <input
                                type="text"
                                className="border p-2 rounded w-full mb-4 text-black"
                                placeholder="Edit note title"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                            />
                            <textarea
                                className="border p-2 rounded w-full mb-4 text-black"
                                placeholder="Edit note content"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />

                            <div className="flex justify-between gap-4">
                                <Button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateNote} // Update note when submitting
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default NotesPage;