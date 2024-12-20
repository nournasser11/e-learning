import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with the actual API base URL

// Interface for login credentials
interface Credentials {
  email: string;
  password: string;
  role: string;
  _id: string;  
  name: string;

  
}

// Login function
export const login = async (data: { email: string; password: string }): Promise<{ accessToken: string; role: string; _id: string; name: string; }> => {
    console.log("Data sent to API:", data); // Debug the request payload
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // No role here
    });
    return response.json();
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

// Interface for course
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;

  // Add other course properties as needed
}

export const getCoursesByInstructor = async (instructorId: string): Promise<
  {
    _id: string;
    title: string;
    description: string;
    instructorId: string;
  }[]
> => {
  try {
    const response = await axios.get(`${API_URL}/courses/by-instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by instructor:", error);
    throw error;
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
    }


);