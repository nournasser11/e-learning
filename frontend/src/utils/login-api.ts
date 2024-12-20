import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Interface for login credentials
interface Credentials {
  email: string;
  password: string;
}

// Login function
export const login = async (credentials: Credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    // Return the fields the frontend expects
    return {
      accessToken: response.data.accessToken,
      role: response.data.role,
      _id: response.data._id,
      name: response.data.name,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Example function to retrieve courses
export const getCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

// Axios interceptor to attach token from local storage to each request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
