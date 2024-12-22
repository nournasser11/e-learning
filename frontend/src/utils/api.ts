import axios from 'axios';

// Environment-based API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Interfaces for payloads and responses


export interface CreateFileDto {
    description?: string;
}

export interface UploadFileResponse {
    filePath: string;
}

export interface QuestionDto {
    questionText: string;
    type: "MCQ" | "True/False";
    options?: string[];
    correctAnswer: string;
    difficultyLevel: "easy" | "medium" | "hard"; // New property
}

export interface QuizConfiguration {
    questionTypes: string[];
    numberOfQuestions: number;
}

// Module
export interface CreateModuleDto {
    courseId: string;
    title: string;
    contentUrl: string;
    contentType: 'pdf' | 'video';
    quizConfiguration: {
        questionTypes: string[];
        numberOfQuestions: number;
    };
    questionBank: {
        questionText: string;
        type: string;
        options?: string[];
        correctAnswer: string;
        difficultyLevel: "easy" | "medium" | "hard"; // Include here
    }[];
    difficultyLevel: string;
    resources?: string[];
}

export interface CreateModuleResponse {
    message: string;
    module: any;
}

export interface Module {
    moduleId: string;
    title: string;
    description?: string;
    contentUrl: string;
    contentType: string;
    resources: string[];
    questionBank: {
        questionText: string;
        type: string;
        options?: string[];
        correctAnswer: string;
        error: string;
        difficultyLevel: "easy" | "medium" | "hard"; // Include here

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
export interface Credentials {
    email: string;
    password: string;
}




export interface Course {
    courseId: string;
    title: string;
    description: string;
    instructorId: string;
    role: string;
    version: number;
    status: "valid" | "invalid" | "deleted";
    modules: string[];
    completedStudents: string[]; // Add this
    assignedStudents: string[]; // Add this
}

export interface CourseData {
    title: string;
    description: string;
    instructor: string;
}

export interface UpdateCourse {
    title?: string;
    description?: string;
    version?: number;
}

export interface DeleteCourseResponse {
    message: string;
    course: any;
}


export interface User {
    profilePicture: string;
    id: string;
    name: string;
    email: string;
    role: "student" | "instructor" | "admin";
    courses?: string[];
}

interface RegistrationData {
    email: string;
    password: string;
    name: string;
    role: string;
    profilePictureUrl?: string;
}

export interface LoginResponse {
    accessToken: string;
    role: string;
    _id: string;
    name: string;
}

interface APIResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Utility function for logging errors
const logError = (error: unknown, context: string): string => {
    let errorMessage = 'An unknown error occurred';
    if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        errorMessage = serverMessage || error.message || 'No error details available';
        console.error(`${context} error:`, errorMessage);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
    } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error(`${context} error:`, errorMessage);
    }
    return errorMessage;
};

// Function to check if email is already registered
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await axios.post<APIResponse<{ exists: boolean }>>(`${API_URL}/users/check-email`, { email });
        return response.data.data.exists;
    } catch (error) {
        logError(error, 'Check email');
        return false;
    }
};


// Utility function for centralized error handling
const handleAxiosError = (error: any, context: string): never => {
    if (axios.isAxiosError(error)) {
        console.error(`${context}:`, error.response?.data || error.message);
    } else {
        console.error(`${context}:`, (error as Error).message);
    }
    throw error;
};



const withErrorHandling = async <T>(callback: () => Promise<T>, context: string): Promise<T> => {
    try {
        return await callback();
    } catch (error) {
        handleAxiosError(error, context);
        throw new Error("Unreachable");
    }
};


// Login function
export const login = async (data: { email: string; password: string }): Promise<{
    accessToken: string;
    role: string;
    _id: string;
    name: string;
}> =>
    withErrorHandling(async () => {
        const response = await axios.post(`${API_URL}/users/login`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    }, "Login error");


// Register function
export const register = async (data: RegistrationData): Promise<{ message: string; user: User }> => {
    try {
        const response = await axios.post<APIResponse<{ message: string; user: User }>>(`${API_URL}/users/register`, data);
        return response.data.data;
    } catch (error) {
        const errorMessage = logError(error, 'Registration');
        throw new Error(errorMessage);
    }
};

// Get all courses
export const getCourses = async (): Promise<Course[]> =>
    withErrorHandling(async () => {
        const response = await axios.get(`${API_URL}/courses`);
        return response.data.map((course: any) => ({
            ...course,
            id: course._id, // Map backend _id to id
        }));
    }, "Get courses error");


// Get all students
// Fetch all students
export const getStudents = async (): Promise<any[]> => {
    try {
        const response = await axios.get(`${API_URL}/users/students`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching students:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Error fetching students.");
        } else {
            console.error("Unknown error fetching students:", error);
            throw new Error("Unknown error fetching students.");
        }
    }
};
// Get all instructors
export const getInstructors = async (): Promise<User[]> =>
    withErrorHandling(async () => {
        const response = await axios.get(`${API_URL}/users/instructors`);
        return response.data;
    }, "Get instructors error");

// Delete a user
export const deleteUser = async (userId: string): Promise<void> => {
    if (!userId) {
        throw new Error("User ID is required for deletion.");
    }
    await axios.delete(`${API_URL}/users/${userId}`);
};



// Update course status (valid, invalid, deleted)
export const updateCourseStatus = async (
    courseId: string,
    status: "valid" | "invalid" | "deleted"
): Promise<Course> =>
    withErrorHandling(async () => {
        const response = await axios.put(`${API_URL}/courses/status/${courseId}, { status }`);
        return response.data;
    }, "Update course status error");

// Search courses by title
export const SearchCourses = async (query: string): Promise<Course[]> =>
    withErrorHandling(async () => {
        const response = await axios.get(`${API_URL}/courses/search?title=${query}`);
        return response.data.map((course: any) => ({
            id: course._id,
            title: course.title,
            description: course.description,
            instructorId: course.instructorId,
            status: course.status,
        }));
    }, "Search courses error");

// Get courses for a specific instructor
export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> =>
    withErrorHandling(async () => {
        const response = await axios.get(`${API_URL}/courses/by-instructor/${instructorId}`);
        return response.data;
    }, "Get courses by instructor error");


// Delete a student by ID
export const deleteStudent = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await axios.delete(`${API_URL}/students/${id}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting student:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Error deleting student.");
        } else {
            console.error("Unknown error deleting student:", error);
            throw new Error("Unknown error deleting student.");
        }
    }
};

// Fetch user profile
export const fetchUserProfile = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        console.log("Fetched profile:", response.data); // Debug log
        return response.data; // Ensure profilePicture is part of the response
    } catch (err) {
        console.error("Error fetching user profile:", err);
        throw new Error("Failed to fetch user profile");
    }

};

// Update user name
export const updateName = async (userId: string, newName: string) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}`, { name: newName });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating name:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update name');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};


// Update profile picture
export const updateProfilePicture = async (userId: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/users/${userId}/upload-profile-picture`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating profile picture:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update profile picture');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

// Update password
export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/update-password`, {
            currentPassword,
            newPassword,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating password:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update password');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

export const searchInstructorsByName = async (instructorName: string) => {
    try {
        // Calls GET /users/search-instructors?name=<instructorName>
        const response = await axios.get(`${API_URL}/users/search-instructors`, {
            params: { name: instructorName },
        });
        return response.data; // Returns an array of matching instructors
    } catch (error) {
        console.error("Error searching instructors by name:", error);
        throw error;
    }
};
export const searchCoursesByTitle = async (title: string) => {
    try {
        const response = await axios.get(`${API_URL}/courses/search`, {
            params: { title }, // Pass the title as a query parameter
        });
        return response.data; // Return the list of courses
    } catch (error) {
        console.error("Error searching for courses:", error);
        throw error;
    }
};
// Create an announcement
export const createAnnouncement = async (data: {
    senderId: string;
    type: "announcement";
    content: string;
    courseId: string;
}) => {
    const response = await fetch("http://localhost:3000/notifications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to create announcement.");
    }
    return response.json();
};

// Get notifications for a user
export const getNotifications = async (userId: string) => {
    const response = await fetch(`http://localhost:3000/notifications/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch notifications.");
    }
    return response.json();
};

export const getEnrolledCourses = async (userId: string): Promise<any[]> => {
    try {
        const response = await axios.get(`${API_URL}/enrollment/${userId}/courses`);
        return response.data;
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        throw error;
    }
};

export const editQuestionInModule = async (
    courseId: string,
    moduleId: string,
    questionIndex: number,
    questionDto: QuestionDto
): Promise<any> => {
    try {
        const response = await axios.put(
            `${API_URL}/courses/${courseId}/modules/${moduleId}/questions/${questionIndex}`,
            questionDto
        );
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Request Payload:', questionDto);
            console.error('Error Response:', error.response?.data || 'No error data returned by backend');
            throw new Error(
                error.response?.data?.message || 'Failed to update the question. Please try again.'
            );
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};


// Edit quiz configuration in a module

export const editQuizConfiguration = async (
    courseId: string,
    moduleId: string,
    quizConfiguration: {
        numberOfQuestions: number;
        questionTypes: string[];
    }
): Promise<any> => {
    try {
        const response = await axios.put(
            `${API_URL}/courses/${courseId}/modules/${moduleId}/quiz-configuration`,
            quizConfiguration
        );
        return response.data;
    } catch (error) {
        console.error("Failed to edit quiz configuration:", error);
        throw error;
    }
};

export const getUserDetails = async (userId: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/users/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        throw new Error("Error fetching user details.");
    }
};
export const getCourseDetails = async (id: string): Promise<Course> => {
    const response = await axios.get(`${API_URL}/courses/Cbyid/${id}`);
    return response.data; // Ensure completedStudents and assignedStudents are part of the response
};

export const createNotification = async (notificationData: any): Promise<void> => {
    const response = await fetch("http://localhost:3000/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
    });
    if (!response.ok) {
        throw new Error("Failed to create notification.");
    }
};


export const createCourse = async (courseData: CourseData): Promise<Course> => {
    const response = await axios.post(`${API_URL}/courses`, courseData);
    return response.data;
};

export const updateCourse = async (courseId: string, updateData: UpdateCourse): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/courses/update/${courseId}`, updateData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to update course.');
        } else {
            throw new Error('Failed to update course.');
        }
    }
};

export const deleteCourse = async (courseId: string): Promise<DeleteCourseResponse> => {
    try {
        const response = await axios.put(`${API_URL}/courses/delete/${courseId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to delete the course.');
        } else {
            throw new Error('Failed to delete the course.');
        }
    }
};

export const searchCoursesByTitleAndInstructor = async (
    title: string,
    instructorId: string
): Promise<Course[]> => {
    const response = await axios.get(`${API_URL}/courses/searchi`, {
        params: { title, instructorId },
    });
    return response.data;
};

// Module APIs
export const getModulesByCourse = async (courseId: string): Promise<Module[]> => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/modules`);
    return response.data;
};

export const getModuleDetails = async (courseId: string, moduleId: string): Promise<Module> => {
    const response = await axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}`);
    return response.data;
};

export const createModule = async (moduleData: CreateModuleDto): Promise<any> => {
    const response = await fetch(
        `${API_URL}/courses/${moduleData.courseId}/modules/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moduleData),
        }
    );

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to create module');
    }

    return response.json();
};


export const uploadFile = async (
    courseId: string,
    file: File,
    description?: string
): Promise<{ filePath: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
        formData.append('description', description);
    }

    const response = await axios.post(
        `${API_URL}/courses/${courseId}/modules/pdf`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
};


export const addQuestionToModule = async (
    courseId: string,
    moduleId: string,
    questionData: QuestionDto
): Promise<any> => {
    try {
        console.log('Sending Question Data:', questionData); // Debug log
        const response = await axios.post(
            `${API_URL}/courses/${courseId}/modules/${moduleId}/questions`,
            questionData
        );
        return response.data;
    } catch (error: any) {
        console.error('Request Payload:', questionData);
        console.error('Error Response:', error.response?.data || 'No error data returned by backend');
        throw error;
    }
};



export const deleteQuestionFromModule = async (
    courseId: string,
    moduleId: string,
    questionIndex: number
): Promise<any> => {
    const response = await axios.delete(
        `${API_URL}/courses/${courseId}/modules/${moduleId}/questions/${questionIndex}`
    );
    return response.data;
};

// Axios request interceptor for JWT token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Axios response interceptor for global error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error('Unauthorized access - redirecting to login.');
            // Example: Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
