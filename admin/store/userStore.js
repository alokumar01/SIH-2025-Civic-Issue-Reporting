import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "sonner";

export const useUserStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  fetchedUser: false, // ✅ track if fetchUser already ran

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

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update Zustand store
      set({
        user: data,
        token,
        isAuthenticated: true,
        fetchedUser: true,
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
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      fetchedUser: false,
    });
    toast.success("Logout successful!");
  },

  // --- FETCH USER ---
  fetchUser: async () => {
    // Prevent multiple calls
    if (get().fetchedUser) return get().user;

    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, isAuthenticated: false, fetchedUser: true });
        return null;
      }

      const response = await api.get("/v1/auth/me"); // token via interceptor
      const user = response.data.data;

      set({ user, token, isAuthenticated: true, fetchedUser: true });
      return user;
    } catch (error) {
      console.error("Fetch user failed:", error);
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false, fetchedUser: true });
      return null;
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
