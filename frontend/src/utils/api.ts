import axios from 'axios';

/** ===========================================
 *  Base API Configuration
 * =========================================== */
const API_URL = 'http://localhost:3000'; // Replace with the actual API URL

/** ===========================================
 *  Interfaces
 * =========================================== */

// File Upload
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

// Course
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

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  role: string;
  _id: string;
  name: string;
}

export interface RegistrationData {
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
  role: 'student' | 'instructor' | 'admin';
  courses?: string[];
}

/** ===========================================
 *  API Functions
 * =========================================== */

// User APIs
export const login = async (data: Credentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, data);
  return response.data;
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


// *Register Function* (added from the first api.ts)
export const register = async (data: RegistrationData): Promise<{ message: string; user: User }> => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed.');
    } else {
      throw new Error('Registration failed.');
    }
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

// Course APIs
export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

export const getCourseDetails = async (id: string): Promise<Course> => {
  const response = await axios.get(`${API_URL}/courses/Cbyid/${id}`);
  return response.data; // Ensure completedStudents and assignedStudents are part of the response
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

export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
  const response = await axios.get(`${API_URL}/courses/by-instructor/${instructorId}`);
  return response.data;
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

// Student & Instructor APIs
export const getStudents = async (): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/students`);
  return response.data;
};

export const getInstructors = async (): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/instructors`);
  return response.data;
};

/** ===========================================
 *  Axios Interceptor for Authorization
 * =========================================== */
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
