import axios from 'axios';
import {useState} from 'react';
// Define the APIResponse interface
interface APIResponse<T> {
  data: T;
  message: string;
}

const API_URL = 'http://localhost:3000'; // Replace with the actual API base URL

// Interface for login credentials
interface Credentials {
  email: string;
  password: string;
  role: string;
  _id: string;  
  name: string;
}
interface Resource {
  _id: string;
  title: string;
  contentUrl: string;
}

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: string;
  profilePictureUrl?: string;
}
export interface User {
  profilePicture: string;
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  courses?: string[];
}


// Function to log errors
const logError = (error: any, context: string): string => {
  if (axios.isAxiosError(error)) {
    console.error(`${context} error:`, error.response?.data || error.message);
    return error.response?.data?.message || error.message;
  } else {
    console.error(`${context} error:`, (error as Error).message);
    return (error as Error).message;
  }
};
// Function to check if email is already registered
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
      const response = await axios.post<APIResponse<{ exists: boolean }>>(`${API_URL}/users/check-email, { email }`);
      return response.data.data.exists;
  } catch (error) {
      logError(error, 'Check email');
      return false;
  }
};

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


// Login function

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Log the exact response status and message
      const errorResponse = await response.json();
      console.error("Login error response:", errorResponse);
      throw new Error(errorResponse.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
// Get all courses
export const getCourses = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    console.log("Get courses response:", response.data);
    return response.data;
  } catch (error) {
    logError(error, "Get Courses");
    throw error;
  }
};

// Get all students
export const getStudents = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    console.log("Get students response:", response.data);
    return response.data;
  } catch (error) {
    logError(error, "Get Students");
    throw error;
  }
};

// Get all instructors
export const getInstructors = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/instructors`);
    console.log("Get instructors response:", response.data);
    return response.data;
  } catch (error) {
    logError(error, "Get Instructors");
    throw error;
  }
};

// Search instructors by name
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

// Search courses by title
export const searchCoursesByTitle = async (title: string) => {
  try {
    const response = await axios.get(`${API_URL}/courses/search`, {
      params: { title },
    });
    return response.data;
  } catch (error) {
    logError(error, "Search Courses by Title");
    throw error;
  }
};

// Enroll a user in a course
export const enrollUserInCourse = async (userId: string, courseId: string): Promise<{ message: string }> => {
  try {
    console.log("Attempting to enroll user in course:", { userId, courseId }); // Debug log
    const response = await axios.post(`${API_URL}/enrollment`, { userId, courseId });
    return response.data;
  } catch (error) {
    logError(error, "Enroll User in Course");
    throw error;
  }
};


// Get enrollments by user
export const getEnrollmentsByUser = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/enrollment/user/${userId}`);
    return response.data;
  } catch (error) {
    logError(error, "Get Enrollments by User");
    throw error;
  }
};

// Get enrollments by course
export const getEnrollmentsByCourse = async (courseId: string) => {
  try {
    const response = await axios.get(`${API_URL}/enrollment/course/${courseId}`);
    return response.data;
  } catch (error) {
    logError(error, 'Get Enrollments by Course');
    throw error;
  }
};

// Fetch course details by course ID
export const fetchCourseDetailsById = async (courseId: string) => {
  try {
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    logError(error, 'Fetch Course Details');
    throw error;
  }
};

// Interface for course
//  export interface Course {
//    _id: string;
//    id: string;
//    title: string;
//    description: string;
//   instructor: string;

//  }
export interface Course {
  courseId: string;
  title: string;
  description: string;
  instructorId: string;
  role: string;
  version: number;
  status: string;
  modules: string[];
  completedStudents: string[]; // Add this
  assignedStudents: string[]; // Add this

}


// Get courses for instructor
export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
  try {
    const response = await axios.get(`${API_URL}/courses/by-instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by instructor:', error);
    throw error; // Propagate the error to the caller
  }
 
};

// Fetch user profile
export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log("Fetched profile:", response.data);
    return response.data;
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
    logError(error, 'Update Name');
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update name');
    } else {
      throw new Error('Failed to update name');
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
    logError(error, 'Update Profile Picture');
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update profile picture');
    } else {
      throw new Error('Failed to update profile picture');
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
    logError(error, 'Update Password');
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    } else {
      throw new Error('Failed to update password');
    }
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    logError(error, 'Delete User');
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    } else {
      throw new Error('Failed to delete user');
    }
  }
};

// Get module details
export const getModuleResources = async (
  courseId: string,
  moduleId: string
): Promise<{ title: string; contentUrl: string }> => {
  const context = "Get Module Resources";
  try {
    if (!courseId || !moduleId) {
      throw new Error("Course ID and Module ID are required.");
    }

    console.log(`Fetching module content for Course ID: ${courseId}, Module ID: ${moduleId}`); // Debug log

    // Adjusted to match the new API endpoint and response structure
    const response = await axios.get(
      `${API_URL}/courses/${courseId}/modules/${moduleId}/content`
    );
    console.log("Module content response:", response.data); // Log successful response

    // Ensure the response contains the expected data
    if (!response.data || !response.data.title || !response.data.contentUrl) {
      throw new Error("Invalid module content data received from the server.");
    }

    return response.data; // Return title and contentUrl
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`${context} error:`, error.response?.data || error.message); // Log error
    } else {
      console.error(`${context} error:`, (error as Error).message); // Log error
    }
    throw error;
  }
};





