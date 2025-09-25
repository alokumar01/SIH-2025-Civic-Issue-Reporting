"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function ProtectedRoute({ children, roles }) {
  const {
    fetchUser,
    logout,
    hasRole,
    isAuthenticated,
    loading,
    fetchedUser,
  } = useUserStore();

  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!fetchedUser) {
        await fetchUser(); // fetch on first load
      }

      if (!isAuthenticated) {
        logout();
        router.replace("/auth");
        return;
      }

      if (roles && !hasRole(roles)) {
        setUnauthorized(true);
      }

      setChecking(false);
    };

    verify();
  }, [fetchedUser, isAuthenticated, roles, fetchUser, logout, hasRole, router]);

  // Show loader while checking
  if (checking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">🚫 Access Denied</p>
      </div>
    );
  }

  return <>{children}</>;
}
