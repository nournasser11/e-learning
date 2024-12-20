import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface RegistrationData {
    name: string;
    email: string;
    password: string;
    role:string;
    profilePictureUrl:string;
}

export const register = async (data: RegistrationData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};
