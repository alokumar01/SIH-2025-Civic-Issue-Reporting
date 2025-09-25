"use client";

import AuthTabs from "@/components/Auth/AuthTab";

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <AuthTabs />
      </div>
    </div>
  );
}
