"use client";

import { useState } from "react";
// import authService from "@/services/authService";

export default function SignupForm({ role }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.signup({ ...form, role });
      // maybe auto-login after signup
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        className="w-full border rounded p-2"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded p-2"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border rounded p-2"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        {loading ? "Signing up..." : `Sign up as ${role}`}
      </button>
    </form>
  );
}
