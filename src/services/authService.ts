import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // URL do seu backend

interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
        username,
        password,
    });
    return response.data;
};

export const authService = {
    login,
};
