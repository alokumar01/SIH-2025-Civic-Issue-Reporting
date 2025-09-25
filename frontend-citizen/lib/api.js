import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.SERVER_URL || 'http://localhost:5050',
    timeout: 10000, // Optional: timeout for requests
});

// Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Global response interceptor for errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Example: handle 401 globally
        if (error.response?.status === 401) {
            localStorage.removeItem('token'); // Clear token
            // Optionally redirect user to login here if you want central handling
            console.warn('Unauthorized request - token cleared');
        }
        return Promise.reject(error);
    }
);

export default api;