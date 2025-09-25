"use client";
import ProtectedRoute from "@/components/auth/ProtectRoutes";
import { useUserStore } from "@/store/userStore";

export default function AdminPage() {
  const { user } = useUserStore();

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p>
          ✅ Welcome <span className="font-semibold">{user?.firstName}</span>, you have access to district heads.
        </p>
      </div>
    </ProtectedRoute>
  );
}
