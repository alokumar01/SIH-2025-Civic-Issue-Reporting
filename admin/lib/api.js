import axios from "axios";
import { useUserStore } from "@/store/userStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050",
  timeout: 10000,
});

// Attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        const { logout } = useUserStore.getState();
        logout();
      }
      console.warn("Unauthorized request - logged out.");
    }

    if (error.code === "ECONNABORTED") {
      console.error("Request timed out.");
    } else if (!error.response) {
      console.error("Network error - please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
