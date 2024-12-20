import axios from "axios";

const API_URL = "http://localhost:3000"; // Replace with your actual API base URL

// Interfaces
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
  profilePictureUrl?: string; // Optional profile picture
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

const withErrorHandling = async <T>(callback: () => Promise<T>, context: string): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    handleAxiosError(error, context);
    throw new Error("Unreachable");
  }
};

// Register a new user
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePictureUrl?: string;
}): Promise<{ message: string; user: User }> =>
  withErrorHandling(async () => {
    const response = await axios.post(`${API_URL}/users/register`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }, "Registration error");

// Register a new instructor
export const registerInstructor = async (data: {
  name: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
}): Promise<{ message: string; user: User }> =>
  register({ ...data, role: "instructor" });

// Login a user
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
      return response.data.map((instructor: any) => ({
        ...instructor,
        id: instructor.userId, // Map userId to id for consistency in frontend
      }));
    }, "Get instructors error");
  


// Delete an instructor by userId
export const deleteInstructorByUserId = async (userId: string): Promise<void> =>
    withErrorHandling(async () => {
      await axios.delete(`${API_URL}/users/instructors/${userId}`);
    }, "Delete instructor error");

// Delete a user
export const deleteUser = async (userId: string): Promise<void> =>
  withErrorHandling(async () => {
    await axios.delete(`${API_URL}/users/${userId}`);
  }, "Delete user error");

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

// Axios interceptor for adding JWT to requests
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
      // Handle redirection or token cleanup here if necessary
    }
    return Promise.reject(error);
  }
);
