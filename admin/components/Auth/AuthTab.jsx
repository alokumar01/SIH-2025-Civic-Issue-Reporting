"use client";

import { useState } from "react";
import LoginForm from "./Login"
import SignupForm from "./Signup";

const tabs = ["Department", "Municipal"];
const modes = ["Login", "Signup"];

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState("Department");
  const [mode, setMode] = useState("Login");

  return (
    <div>
      {/* Tabs for Department / Municipal */}
      <div className="flex mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center ${
              activeTab === tab ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toggle between Login / Signup */}
      <div className="flex mb-4 border-b">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-center ${
              mode === m ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Render correct form */}
      {mode === "Login" ? (
        <LoginForm role={activeTab.toLowerCase()} />
      ) : (
        <SignupForm role={activeTab.toLowerCase()} />
      )}
    </div>
  );
}

