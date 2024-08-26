import axios from 'axios';

// Configure a URL base para o seu backend Flask
const api = axios.create({
    baseURL: 'http://localhost:5000', // Ajuste conforme necessário
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
