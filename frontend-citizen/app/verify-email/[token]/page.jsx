"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function VerifyEmailPage({ params }) {
  const router = useRouter();
  const paramsHook = useParams();

  // Prefer route params passed in, then the client-side useParams hook,
  // then fall back to extracting the token from the pathname for safety.
  const token =
    params?.token ||
    paramsHook?.token ||
    (typeof window !== "undefined"
      ? // URL like /verify-email/<token>
        window.location.pathname.split("/").filter(Boolean).pop()
      : undefined);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        setStatus(null);

        // Call backend endpoint to verify token
        const res = await api.get(`/v1/auth/verify/${token}`);

        const data = res?.data;
        const msg = data?.message || "Email verified successfully.";
        setStatus("success");
        setMessage(msg);
        toast.success(msg);
      } catch (err) {
        const errMsg =
          err?.response?.data?.message || "Verification failed. Token may be invalid or expired.";
        setStatus("error");
        setMessage(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-[#111827] border rounded-lg p-8 shadow">
        <h1 className="text-2xl font-semibold mb-4">Verify Email</h1>

        {loading && <p className="text-gray-600">Verifying your email, please wait...</p>}

        {!loading && status === "success" && (
          <div>
            <p className="text-green-600 mb-4">{message}</p>
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => router.push("/auth")}
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {!loading && status === "error" && (
          <div>
            <p className="text-red-600 mb-4">{message}</p>
            <div className="flex gap-2">
              <button
                className="btn"
                onClick={() => router.push("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
