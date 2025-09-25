"use client";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, roles }) {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const logout = useUserStore((state) => state.logout);
  const hasRole = useUserStore((state) => state.hasRole);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const loading = useUserStore((state) => state.loading);

  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verifyAuth = async () => {
      try {
        const user = await fetchUser();
        if (!mounted) return;

        if (!user) {
          logout();
          router.replace("/auth");
          return;
        }

        if (roles && !hasRole(roles)) {
          setUnauthorized(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        logout();
        router.replace("/auth");
      } finally {
        if (mounted) setChecking(false);
      }
    };

    verifyAuth();
    return () => {
      mounted = false;
    };
  }, [router, roles, fetchUser, logout, hasRole]);

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

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
