"use client";

import LoginForm from "@/components/Auth/Login";

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-20">
        <LoginForm />
      </div>
    </div>
  );
}
