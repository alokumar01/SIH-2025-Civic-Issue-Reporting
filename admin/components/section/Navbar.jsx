"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, User, Menu, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useUserStore } from "@/store/userStore";

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { logout, user } = useUserStore();

  const handleProfile = () => router.push("/profile");
  const handleSettings = () => router.push("/settings");
  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Image
          src="/jharkhand-logo.webp"
          alt="Govt of Jharkhand"
          width={40}
          height={40}
        />
        {/* <span className="font-semibold text-lg text-gray-800">District Name</span> */}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* Popover for user menu */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 transition">
              <User className="w-6 h-6 text-gray-700" />
              <span className="hidden md:inline text-gray-800 font-medium">
                {user?.firstName || "Admin"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-white shadow-md rounded-md p-2">
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={handleProfile}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={handleSettings}
            >
              Settings
            </button>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-3 md:hidden z-50">
          <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800">Notifications</span>
          </button>

          {/* Mobile Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">{user?.firstName || "Admin"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-white shadow-md rounded-md p-2">
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                onClick={handleProfile}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                onClick={handleSettings}
              >
                Settings
              </button>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  );
}
