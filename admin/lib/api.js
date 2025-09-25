import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050",
  timeout: 10000,
});

// Automatically attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      console.warn("Unauthorized request - token cleared");
    }
    return Promise.reject(error);
  }
);

export default api;
