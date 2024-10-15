// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.nutriswap.com.br/' // URL do seu backend
});

// Adiciona o token JWT aos cabeçalhos das requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
