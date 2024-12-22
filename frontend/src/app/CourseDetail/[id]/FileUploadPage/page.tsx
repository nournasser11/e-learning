"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import InstructorLayout from "@/components/InstructorLayout";
import { uploadFile } from "@/utils/api";

const FileUploadPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string | string[] };
  const courseId = Array.isArray(id) ? id[0] : id;

  const [file, setFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    if (!fileDescription) {
      alert("File description is required.");
      return;
    }

    try {
      const uploadedFile = await uploadFile(courseId, file, fileDescription);
      console.log("Uploaded File URL:", uploadedFile.filePath);

      // Redirect to AddModuleDetailsPage with the filePath and courseId
      router.push(
        `/CourseDetail/${courseId}/AddModule?filePath=${encodeURIComponent(
          uploadedFile.filePath
        )}&courseId=${encodeURIComponent(courseId)}`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <InstructorLayout>
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-800 text-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
          Upload File for Module
        </h1>
        <div className="mb-6">
          <label
            htmlFor="file"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            Upload File
          </label>
          <input
            type="file"
            id="file"
            accept="video/*,.pdf"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="fileDescription"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            File Description
          </label>
          <input
            type="text"
            id="fileDescription"
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            placeholder="Enter a description for the file"
            required
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleNext}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </InstructorLayout>
  );
};

export default FileUploadPage;
