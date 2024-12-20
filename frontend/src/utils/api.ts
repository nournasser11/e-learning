import axios from 'axios';

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

// Interface for registration data
interface RegistrationData {
  email: string;
  password: string;
  role: string;
  name: string;
  profilePictureUrl: string;
}
// Login function
// Register function

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePictureUrl: string;
}): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Registration successful:", response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || "Unknown error occurred";
      console.error("Registration error:", errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Unexpected error:", err);
      throw new Error("An unexpected error occurred");
    }
  }
};

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
        const response = await axios.get('${API_URL}/courses');
        console.log("Get courses response:", response.data); // Log the response
        return response.data; // Return the courses data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Get courses error:", error.response?.data || error.message); // Log errors
        } else {
            console.error("Get courses error:", (error as Error).message); // Log errors
        }
        throw error; // Propagate the error to the caller
    }
};

// Get all students
export const getStudents = async (): Promise<any[]> => {
    try {
        const response = await axios.get('${API_URL}/students');
        console.log("Get students response:", response.data); // Log the response
        return response.data; // Return the students data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Get students error:", error.response?.data || error.message); // Log errors
        } else {
            console.error("Get students error:", (error as Error).message); // Log errors
        }
        throw error; // Propagate the error to the caller
    }
};

// Get all instructors
export const getInstructors = async (): Promise<any[]> => {
    try {
        const response = await axios.get('${API_URL}/instructors');
        console.log("Get instructors response:", response.data); // Log the response
        return response.data; // Return the instructors data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Get instructors error:", error.response?.data || error.message); // Log errors
        } else {
            console.error("Get instructors error:", (error as Error).message); // Log errors
        }
        throw error; // Propagate the error to the caller
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
  export const getEnrolledCourses = async (userId: string): Promise<any[]> => {
    try {
      const response = await axios.get(`http://localhost:3000/enrollment/${userId}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw error;
    }
  };

// Interface for course
interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  instructor: string;

  // Add other course properties as needed
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
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
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
  
  // Delete user
  export const deleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error deleting user:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete user');
      } else {
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred');
      }
    }
  };
  
  
// Axios interceptor to add JWT token to all requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (token) {
            config.headers.Authorization = 'Bearer ${token}'; // Add Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Handle request errors
    })
  