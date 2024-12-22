"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InstructorLayout from "../../../components/InstructorLayout";
import { createModule } from "../../../utils/api";
import "./AddModule.css";

const AddModuleDetailsPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const filePath = searchParams.get("filePath")
        ? `http://localhost:3000${searchParams.get("filePath")}`
        : "";

    const courseId = searchParams.get("courseId") || "";

    const [moduleData, setModuleData] = useState({
        title: "",
        contentUrl: filePath,
        contentType: "video" as "video" | "pdf",
        quizConfiguration: {
            questionTypes: ["MCQ"],
            numberOfQuestions: 15,
        },
        questionBank: Array.from({ length: 15 }, () => ({
            questionText: "",
            type: "MCQ",
            options: ["", "", "", ""],
            correctAnswer: "",
            difficultyLevel: "easy" as "easy" | "medium" | "hard",
        })),
        difficultyLevel: "easy",
        resources: [] as string[],
    });

    const [newResource, setNewResource] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: string
    ) => {
        setModuleData({ ...moduleData, [field]: e.target.value });
    };

    const handleQuizConfigChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: string
    ) => {
        setModuleData({
            ...moduleData,
            quizConfiguration: {
                ...moduleData.quizConfiguration,
                [field]:
                    field === "numberOfQuestions"
                        ? parseInt(e.target.value)
                        : [e.target.value],
            },
        });
    };

    const handleQuestionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number,
        field: string,
        optionIndex?: number
    ) => {
        const updatedQuestions = moduleData.questionBank.map((question, idx) => {
            if (idx === index) {
                if (field === "options" && optionIndex !== undefined) {
                    const updatedOptions = [...question.options];
                    updatedOptions[optionIndex] = e.target.value;
                    return { ...question, options: updatedOptions };
                }
                return { ...question, [field]: e.target.value };
            }
            return question;
        });

        setModuleData({ ...moduleData, questionBank: updatedQuestions });
    };

    const handleAddResource = () => {
        if (newResource.trim()) {
            setModuleData({
                ...moduleData,
                resources: [...moduleData.resources, newResource.trim()],
            });
            setNewResource("");
        }
    };

    const handleRemoveResource = (index: number) => {
        const updatedResources = moduleData.resources.filter((_, i) => i !== index);
        setModuleData({ ...moduleData, resources: updatedResources });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!moduleData.title) {
            alert("Module title is required.");
            return;
        }

        const incompleteQuestions = moduleData.questionBank.filter(
            (question) =>
                !question.questionText ||
                !question.correctAnswer ||
                !["MCQ", "True/False"].includes(question.type)
        );

        if (incompleteQuestions.length > 0) {
            alert(
                "Please ensure all questions have a valid text, type, and correct answer."
            );
            return;
        }

        try {
            const newModule = await createModule({
                ...moduleData,
                courseId,
            });
            console.log("Module created:", newModule);

            router.push(`/CourseDetail/${courseId}`);
        } catch (error) {
            console.error("Error creating module:", error);
            alert("Failed to create module. Please check the input details.");
        }
    };

    return (
        <InstructorLayout>
            <div className="container mx-auto p-6 bg-gray-900 text-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-blue-400 mb-6">Add Module Details</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label htmlFor="title" className="block text-gray-300 mb-2">
                            Module Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                            value={moduleData.title}
                            onChange={(e) => handleChange(e, "title")}
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="contentType" className="block text-gray-300 mb-2">
                            Content Type
                        </label>
                        <select
                            id="contentType"
                            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                            value={moduleData.contentType}
                            onChange={(e) => handleChange(e, "contentType")}
                            required
                        >
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="difficultyLevel" className="block text-gray-300 mb-2">
                            Difficulty Level
                        </label>
                        <select
                            id="difficultyLevel"
                            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                            value={moduleData.difficultyLevel}
                            onChange={(e) => handleChange(e, "difficultyLevel")}
                            required
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="form-group mb-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Resources</h2>
                        <div className="flex items-center mb-4">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                                placeholder="Enter resource URL"
                                value={newResource}
                                onChange={(e) => setNewResource(e.target.value)}
                            />
                            <button
                                type="button"
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleAddResource}
                            >
                                Add
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {moduleData.resources.map((resource, index) => (
                                <li
                                    key={index}
                                    className="p-2 bg-gray-800 text-gray-300 rounded flex justify-between items-center"
                                >
                                    <span>{resource}</span>
                                    <button
                                        type="button"
                                        className="text-red-500"
                                        onClick={() => handleRemoveResource(index)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="form-group mb-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Questions</h2>
                        {moduleData.questionBank.map((question, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
                                <label className="block text-gray-300 mb-2">Question {index + 1}</label>
                                <input
                                    type="text"
                                    placeholder="Question Text"
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white mb-2"
                                    value={question.questionText}
                                    onChange={(e) => handleQuestionChange(e, index, "questionText")}
                                    required
                                />
                                <label className="block text-gray-300 mb-2">Type</label>
                                <select
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white mb-2"
                                    value={question.type}
                                    onChange={(e) => handleQuestionChange(e, index, "type")}
                                >
                                    <option value="MCQ">MCQ</option>
                                    <option value="True/False">True/False</option>
                                </select>
                                {question.type === "MCQ" &&
                                    question.options.map((option, optIndex) => (
                                        <input
                                            key={optIndex}
                                            type="text"
                                            placeholder={`Option ${optIndex + 1}`}
                                            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white mb-2"
                                            value={option}
                                            onChange={(e) =>
                                                handleQuestionChange(e, index, "options", optIndex)
                                            }
                                            required
                                        />
                                    ))}
                                <label className="block text-gray-300 mb-2">Correct Answer</label>
                                {question.type === "MCQ" ? (
                                    <input
                                        type="text"
                                        placeholder="Correct Answer"
                                        className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                                        value={question.correctAnswer}
                                        onChange={(e) => handleQuestionChange(e, index, "correctAnswer")}
                                        required
                                    />
                                ) : (
                                    <select
                                        className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                                        value={question.correctAnswer}
                                        onChange={(e) => handleQuestionChange(e, index, "correctAnswer")}
                                        required
                                    >
                                        <option value="">Select Answer</option>
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </select>
                                )}
                                <label className="block text-gray-300 mb-2">Difficulty Level</label>
                                <select
                                    className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                                    value={question.difficultyLevel}
                                    onChange={(e) => handleQuestionChange(e, index, "difficultyLevel")}
                                    required
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold"
                    >
                        Submit Module
                    </button>
                </form>
            </div>
        </InstructorLayout>
    );
};

export default AddModuleDetailsPage;