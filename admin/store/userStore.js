import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "sonner";

export const useUserStore = create((set) => ({
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
      return false;
    }

    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/login", { email, password });

      const { token, user } = response.data; 

      // Save token
      localStorage.setItem("token", token);

      set({
        token,
        user,
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

  // --- LOGOUT ---
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
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

      const response = await api.get("/user/me"); 
      const { user } = response.data;

      set({
        user,
        token,
        isAuthenticated: true,
      });

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
}));
