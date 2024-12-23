"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InstructorLayout from "../../../../../components/InstructorLayout";
import {
    getModuleDetails,
    addQuestionToModule,
    deleteQuestionFromModule,
    editQuizConfiguration,
    editQuestionInModule, QuestionDto
} from "../../../../../utils/api";

import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface Module {
    moduleId: string;
    title: string;
    contentUrl: string;
    contentType: string;
    resources: string[];
    questionBank: {
        questionText: string;
        type: "MCQ" | "True/False";
        options?: string[];
        correctAnswer: string;
        difficultyLevel: "easy" | "medium" | "hard"; // Added difficultyLevel
    }[];
    quizConfiguration: {
        questionTypes: string[];
        numberOfQuestions: number;
    };
    difficultyLevel: string;
    isFlagged: boolean;
    createdAt: string;
    updatedAt: string;
}

const ModuleDetail: React.FC = () => {
    const [module, setModule] = useState<Module | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [showQuizConfig, setShowQuizConfig] = useState(false);
    const [createdAt, setCreatedAt] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        questionText: string;
        type: "MCQ" | "True/False";
        options: string[];
        correctAnswer: string;
        difficultyLevel: "easy" | "medium" | "hard"; // Added difficultyLevel
    }>({
        questionText: "",
        type: "MCQ",
        options: [""],
        correctAnswer: "",
        difficultyLevel: "easy",
    });
    const [quizConfigData, setQuizConfigData] = useState({
        numberOfQuestions: 0,
        questionTypes: "",
    });


    const [editIndex, setEditIndex] = useState<number | null>(null);

    const params = useParams();
    const { id: courseId, moduleId } = params as { id: string; moduleId: string };

    useEffect(() => {
        const fetchModuleDetails = async () => {
            try {
                const moduleData = await getModuleDetails(courseId, moduleId);

                // Set the module details
                setModule({
                    ...moduleData,
                    questionBank: moduleData.questionBank.map((question) => ({
                        ...question,
                        type: question.type as "MCQ" | "True/False",
                    })),
                });

                // Update createdAt after fetching module details
                if (moduleData?.createdAt) {
                    setCreatedAt(new Date(moduleData.createdAt).toLocaleDateString());
                }

                // Update quiz configuration
                setQuizConfigData({
                    numberOfQuestions: moduleData.quizConfiguration.numberOfQuestions,
                    questionTypes: moduleData.quizConfiguration.questionTypes.join(", "),
                });
            } catch (err) {
                setError("Failed to fetch module details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModuleDetails();
    }, [courseId, moduleId]);

    const handleDeleteQuestion = async (index: number) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        try {
            await deleteQuestionFromModule(courseId, moduleId, index);
            alert("Question deleted successfully!");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to delete question. Ensure there are at least 15 questions.");
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index?: number
    ) => {
        const { name, value } = e.target;
        if (name === "options" && index !== undefined) {
            const updatedOptions = [...formData.options];
            updatedOptions[index] = value;
            setFormData({ ...formData, options: updatedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddOption = () => {
        setFormData({ ...formData, options: [...formData.options, ""] });
    };

    const handleSubmit = async () => {
        console.log("Submitting Question:", formData); // Debug log

        // Enhanced validation
        if (!formData.questionText.trim()) {
            alert("Question text cannot be empty.");
            return;
        }

        if (!formData.correctAnswer.trim()) {
            alert("Correct answer cannot be empty.");
            return;
        }

        if (!["easy", "medium", "hard"].includes(formData.difficultyLevel)) {
            alert("Please select a valid difficulty level.");
            return;
        }

        if (formData.type === "MCQ" && (!formData.options || formData.options.some(opt => !opt.trim()))) {
            alert("All options must be filled for MCQ.");
            return;
        }

        try {
            const result = await addQuestionToModule(courseId, moduleId, formData);
            alert("Question added successfully!");
            console.log("API Response:", result); // Debug log
            window.location.reload();
        } catch (error) {
            if (error instanceof Error && (error as any).response?.data?.message) {
                alert(`Error: ${(error as any).response.data.message}`);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
            console.error("Failed to add question:", error);
        }
    };





    const handleEditQuestion = (index: number) => {
        const question = module?.questionBank[index];
        if (question) {
            setFormData({
                questionText: question.questionText,
                type: question.type,
                options: question.options || [""],
                correctAnswer: question.correctAnswer,
                difficultyLevel: question.difficultyLevel, // Populate difficultyLevel
            });
            setEditIndex(index);
            setShowPopup(true);
        }
    };

    const handleSaveQuizConfig = async () => {
        try {
            await editQuizConfiguration(courseId, moduleId, {
                numberOfQuestions: quizConfigData.numberOfQuestions,
                questionTypes: quizConfigData.questionTypes.split(", "),
            });
            alert("Quiz Configuration updated successfully!");
            setShowQuizConfig(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to update quiz configuration.");
        }
    };

    if (loading)
        return <div className="text-center mt-16 text-white">Loading module details...</div>;
    if (error)
        return <div className="text-center mt-16 text-red-500">{error}</div>;

    return (
        <InstructorLayout>
            <div className="max-w-7xl mx-auto mt-8 p-6 bg-gray-900 shadow-lg rounded-lg text-white">
                {/* Module Title */}
                <h1 className="text-4xl font-bold text-blue-500 mb-6 text-center">
                    {module?.title}
                </h1>

                {/* Content Information */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <p>
                            <strong>Module ID:</strong> {module?.moduleId}
                        </p>
                        <p>
                            <strong>Difficulty Level:</strong> {module?.difficultyLevel}
                        </p>
                        <p>
                            <strong>Content Type:</strong> {module?.contentType.toUpperCase()}
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(module?.createdAt ?? "").toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Updated At:</strong>{" "}
                            {new Date(module?.updatedAt ?? "").toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Content URL:</strong>{" "}
                            <a
                                href={module?.contentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                            >
                                View Content
                            </a>
                        </p>

                    </div>
                </div>

                {/* Question Bank */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 flex justify-between">
                        Question Bank
                        <button
                            onClick={() => {
                                setFormData({
                                    questionText: "",
                                    type: "MCQ",
                                    options: [""],
                                    correctAnswer: "",
                                    difficultyLevel: "easy",
                                });
                                setEditIndex(null);
                                setShowPopup(true);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            + Add Question
                        </button>
                    </h2>
                    {module?.questionBank.map((question, index) => (
                        <div
                            key={index}
                            className="p-4 mb-4 border rounded-lg shadow-md bg-gray-800 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">
                                    <span className="text-blue-400">Q{index + 1}:</span> {question.questionText}
                                </p>
                                <p>
                                    <strong>Type:</strong> {question.type}
                                </p>
                                <p>
                                    <strong>Difficulty Level:</strong> {question.difficultyLevel}
                                </p>
                                {question.type === "MCQ" && question.options && (
                                    <ul className="list-disc pl-6">
                                        {question.options.map((option, i) => (
                                            <li key={i}>{option}</li>
                                        ))}
                                    </ul>
                                )}
                                <p>
                                    <strong>Correct Answer:</strong>{" "}
                                    <span className="text-green-400">{question.correctAnswer}</span>
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditQuestion(index)}
                                    className="text-yellow-400 hover:text-yellow-600"
                                    title="Edit Question"
                                >
                                    <PencilSquareIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => handleDeleteQuestion(index)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete Question"
                                >
                                    <TrashIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Popup Form for Questions */}
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="bg-gray-800 p-6 rounded-lg w-96">
                            <h3 className="text-xl font-semibold mb-4 text-white">
                                {editIndex !== null ? "Edit Question" : "Add New Question"}
                            </h3>
                            <input
                                placeholder="Question Text"
                                name="questionText"
                                value={formData.questionText}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-4 bg-gray-700 text-white"
                            />
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-4 bg-gray-700 text-white"
                            >
                                <option value="MCQ">MCQ</option>
                                <option value="True/False">True/False</option>
                            </select>
                            <select
                                name="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-4 bg-gray-700 text-white"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            {formData.type === "MCQ" &&
                                formData.options.map((option, index) => (
                                    <input
                                        key={index}
                                        placeholder={`Option ${index + 1}`}
                                        name="options"
                                        value={option}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="border p-2 w-full mb-2 bg-gray-700 text-white"
                                    />
                                ))}
                            {formData.type === "MCQ" && (
                                <button onClick={handleAddOption} className="text-blue-400 mb-2">
                                    + Add Option
                                </button>
                            )}
                            <input
                                placeholder="Correct Answer"
                                name="correctAnswer"
                                value={formData.correctAnswer}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-4 bg-gray-700 text-white"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {editIndex !== null ? "Update" : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
};

export default ModuleDetail;