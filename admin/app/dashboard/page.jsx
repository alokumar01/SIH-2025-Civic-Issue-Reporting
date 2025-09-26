"use client";

import ProtectedRoute from "@/components/Auth/ProtectRoutes";
import { useUserStore } from "@/store/userStore";
import AdminDashboard from "@/components/Dashboard/Admin";

export default function AdminPage() {
  const { user } = useUserStore();

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="p-6">
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
}
