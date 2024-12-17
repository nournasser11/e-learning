import axios from "axios";

const API_URL = "http://localhost:3000"; // Replace with the actual API base URL

// Interface for login credentials
interface Credentials {
  email: string;
  password: string;
  role: string;
  _id: string;
  name: string;
}

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: string;
  profilePictureUrl?: string;
}

// Interface for Course
export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  status: "valid" | "invalid" | "deleted";
}

// Utility function for centralized error handling
const handleAxiosError = (error: any, context: string): never => {
  if (axios.isAxiosError(error)) {
    console.error(`${context}:`, error.response?.data || error.message);
  } else {
    console.error(`${context}:`, (error as Error).message);
  }
  throw error;
};

// Utility wrapper to ensure clean control flow
const withErrorHandling = async <T>(callback: () => Promise<T>, context: string): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    handleAxiosError(error, context);
    throw new Error("Unreachable"); // Ensures TypeScript knows this never returns
  }
};

// Register function
export const register = async (data: RegistrationData): Promise<{ message: string }> =>
  withErrorHandling(async () => {
    console.log("Registration data sent to API:", data);
    const response = await axios.post(`${API_URL}/users/register`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }, "Registration error");

// Login function
export const login = async (data: { email: string; password: string }): Promise<{
  accessToken: string;
  role: string;
  _id: string;
  name: string;
}> =>
  withErrorHandling(async () => {
    console.log("Data sent to API:", data);
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }, "Login error");

// Get all courses
export const getCourses = async (): Promise<Course[]> =>
  withErrorHandling(async () => {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data.map((course: any) => ({
      ...course,
      id: course._id, // Map backend `_id` to `id`
    }));
  }, "Get courses error");

// Update course status (valid, invalid, deleted)
export const updateCourseStatus = async (
  courseId: string,
  status: "valid" | "invalid" | "deleted"
): Promise<Course> =>
  withErrorHandling(async () => {
    const response = await axios.put(`${API_URL}/courses/status/${courseId}`, { status });
    return response.data;
  }, "Update course status error");

// Search courses
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
  }, "Error searching courses");

// Get all students
export const getStudents = async (): Promise<any[]> =>
  withErrorHandling(async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  }, "Get students error");

// Get all instructors
export const getInstructors = async (): Promise<any[]> =>
  withErrorHandling(async () => {
    const response = await axios.get(`${API_URL}/instructors`);
    return response.data;
  }, "Get instructors error");

// Get courses for instructor
export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> =>
  withErrorHandling(async () => {
    const response = await axios.get(`${API_URL}/courses/by-instructor/${instructorId}`);
    return response.data;
  }, "Error fetching courses by instructor");

// Axios request interceptor for JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Unauthorized access - redirecting to login.");
      // Add logic for redirection if required
    }
    return Promise.reject(error);
  }
);
