"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api"; // <-- make sure both projects have api.ts/js configured
import { Loader2 } from "lucide-react"; // optional spinner icon

export default function VerifyEmailPage() {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(`/v1/auth/verify/${token}`);
        if (res.data.success) {
          setStatus("success");
          setTimeout(() => router.push("/auth"), 1000); // redirect after 2s
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    if (token) verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <p className="text-green-600 font-semibold">
          ✅ Email verified! Redirecting to login...
        </p>
      )}

      {status === "error" && (
        <p className="text-red-600 font-semibold">
          ❌ Invalid or expired verification link.
        </p>
      )}
    </div>
  );
}
