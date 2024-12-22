"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import InstructorLayout from "../../components/InstructorLayout";
import { createCourse } from "../../utils/api";
import FormInput from "../../components/FormInput";
import { useRouter } from "next/navigation";


const CreateCourse = () => {
  const router = useRouter();
  const instructorId = localStorage.getItem("_id") || "";

  const [course, setCourse] = useState({
    title: "",
    description: "",
    instructor: instructorId,
    version: 1,
    status: "invalid",
  });

  const [message, setMessage] = useState("");
  const [isCourseCreated, setIsCourseCreated] = useState(false); // Track course creation status

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createCourse(course);
      console.log("Course created successfully:", response);
      setMessage("Course created and is pending approval by admin.");
      setIsCourseCreated(true); // Set course creation status to true
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create course. Check console for details.");
    }
  };

  const handleBackToDashboard = () => {
    router.push("/instructor/dashboard"); // Redirect to instructor dashboard
  };

  return (
    <InstructorLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Create New Course</h1>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto shadow-lg p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <FormInput
              type="text"
              name="title"
              placeholder="Title"
              value={course.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <FormInput
              type="text"
              name="description"
              placeholder="Description"
              value={course.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="version" className="block text-sm font-medium text-gray-700">
              Version
            </label>
            <FormInput
              type="number"
              name="version"
              placeholder="Version"
              value={String(course.version)}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Course
          </button>
          {message && (
            <p className="mt-4 text-sm font-medium text-green-600 text-center">{message}</p>
          )}
        </form>
        {isCourseCreated && (
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToDashboard}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
};

export default CreateCourse;
