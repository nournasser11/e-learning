import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Replace with the actual API base URL

// Interface for login credentials
interface Credentials {
  email: string;
  password: string;
  role: string;
  
}

// Login function
export const login = async (data: { email: string; password: string }): Promise<{ accessToken: string; role: string }> => {
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
    const response = await axios.get(`${API_URL}/courses`);
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

// Axios interceptor to add JWT token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

