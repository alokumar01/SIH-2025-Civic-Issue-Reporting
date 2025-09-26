import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { toast } from "sonner";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      fetchedUser: false,
      error: null,

      // --- LOGIN ---
      login: async ({ email, password }) => {
        if (!email || !password) {
          toast.error("Email and password are required");
          return false;
        }
        try {
          set({ loading: true, error: null });
          const res = await api.post("/v1/auth/login", { email, password });
          const { token, data } = res.data;

          localStorage.setItem("token", token);
          set({
            token,
            user: data,
            isAuthenticated: true,
            fetchedUser: true,
          });

          toast.success("Login successful!");
          return true;
        } catch (err) {
          const msg = err?.response?.data?.message || "Login failed";
          toast.error(msg);
          set({ isAuthenticated: false, error: msg });
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
          fetchedUser: false,
        });
        toast.success("Logged out successfully");
      },

      // --- FETCH USER ---
      fetchUser: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, fetchedUser: true, user: null });
          return null;
        }
        try {
          set({ loading: true });
          const res = await api.get("/v1/auth/me"); // token via interceptor
          const user = res.data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            fetchedUser: true,
          });

          return user;
        } catch (err) {
          console.error("Fetch user failed:", err);
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            fetchedUser: true,
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // --- ROLE CHECK ---
      hasRole: (roles) => {
        const u = get().user;
        return u ? roles.includes(u.role) : false;
      },
    }),
    {
      name: "civic-user", // key in localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
