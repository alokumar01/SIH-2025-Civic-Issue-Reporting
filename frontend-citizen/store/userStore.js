import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create((set, get) => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    // --- LOGIN ---
    login: async (credentials) => {
        const { email, password } = credentials;
        if (!email || !password) {
            toast.error("Email and password are required");
            set({ error: "Email and password are required" });
            return false;
        }

        try {
            set({ loading: true, error: null });
            const response = await api.post("/v1/auth/login", credentials);

            const { token, data } = response.data;
            const user = {
                id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                phone: data.phone,
                department: data.department,
                employeeId: data.employeeId,
                avatar: data.avatar,
                isVerified: data.isVerified,
                isActive: data.isActive,
            };

            // Save token
            localStorage.setItem("token", token);

            set({
                user,
                token,
                isAuthenticated: true,
            });

            toast.success("Login successful!");
            return true;
        } catch (error) {
            const msg = error?.response?.data?.message || "Login failed";
            set({ error: msg, isAuthenticated: false });
            toast.error(msg);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    // --- REGISTER ---
    register: async (userData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post("/v1/auth/register", userData);

            toast.success(response.data.message || "Registration successful!");
            return true;
        } catch (error) {
            const msg = error?.response?.data?.message || "Registration failed";
            set({ error: msg });
            toast.error(msg);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    // --- LOGOUT ---
    logout: () => {
        localStorage.removeItem("token");
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
        toast.success("Logout successful!");
    },

    // --- FETCH USER ---
    fetchUser: async () => {
        try {
            set({ loading: true, error: null });
            const token = localStorage.getItem("token");
            if (!token) {
                set({ user: null, isAuthenticated: false });
                return false;
            }

            const response = await api.get("/v1/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const user = response.data.data;
            set({ user, token, isAuthenticated: true });
            return true;
        } catch (error) {
            console.error("Fetch user failed:", error);
            localStorage.removeItem("token");
            set({ user: null, token: null, isAuthenticated: false });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    // --- ROLE CHECK ---
    hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
    },
}));