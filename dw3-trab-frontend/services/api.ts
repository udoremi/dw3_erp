import axios from 'axios';

// A URL servidor backend.
const API_URL = 'http://localhost:40000';

const api = axios.create({
    baseURL: API_URL,
});

// "Interceptor" do Axios: Uma função que é executada ANTES de cada requisição.
// Aqui, nós a usamos para adicionar o token JWT no cabeçalho de autorização.
api.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        const token = localStorage.getItem('authToken');

        if (token) {
            // Se o token existir, adiciona ao cabeçalho
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;