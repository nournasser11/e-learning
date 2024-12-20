import axios from 'axios';

// Environment-based API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Interfaces for payloads and responses
interface Credentials {
    email: string;
    password: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    status: "valid" | "invalid" | "deleted";
}

export interface User {
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
export const getStudents = async (): Promise<User[]> =>
    withErrorHandling(async () => {
        const response = await axios.get(`${API_URL}/users/students`);
        return response.data;
    }, "Get students error");

// Get all instructors
export const getInstructors = async (): Promise<User[]> =>
    withErrorHandling(async () => {
        const response = await axios.get(`${API_URL}/users/instructors`);
        return response.data;
    }, "Get instructors error");

// Delete a user
export const deleteUser = async (userId: string): Promise<void> =>
    withErrorHandling(async () => {
        await axios.delete(`${API_URL}/users/${userId}`);
    }, "Delete user error");

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
