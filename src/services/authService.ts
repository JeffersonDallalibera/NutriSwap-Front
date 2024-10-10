import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const API_URL_AUTH = '/api/auth'; // URL do seu backend

interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${apiUrl},${API_URL_AUTH}/login`, {
        username,
        password,
    });
    return response.data;
};

export const authService = {
    login,
};
