"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";

interface Note {
  noteId: string;
  title: string;
  content: string;
  courseId: string;
  moduleId?: string;
}

const NotesManagement: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(storedUserId);

    if (storedUserId) {
      fetchNotes(storedUserId);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchNotes = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/notes`, {
        params: { userId },
      });
      setNotes(response.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickNote = (noteId: string) => {
    router.push(`/student/notes/${noteId}`); // Navigate to the detailed page of the note
  };

  const handleAddNote = () => {
    router.push("/student/notes/new"); // Navigate to the page to create a new note
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

        {/* Add Note Button */}
        <div className="mb-6 flex justify-center">
          <Button
            onClick={handleAddNote}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Add New Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.noteId}
                className="p-4 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg cursor-pointer"
                onClick={() => handleClickNote(note.noteId)} // Clickable note
              >
                <h3 className="text-xl font-bold text-blue-400">{note.title}</h3>
                <p className="text-gray-300 mb-4">{note.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">You don't have any notes yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotesManagement;