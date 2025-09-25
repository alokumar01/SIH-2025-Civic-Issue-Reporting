"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + District Name */}
      <div className="flex items-center space-x-3">
        <Image
          src="/jharkhand-logo.webp" // replace with your logo path
          alt="Govt of Jharkhand"
          width={40}
          height={40}
        />
        <span className="font-semibold text-lg text-gray-800">District Name</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 transition">
              <User className="w-6 h-6 text-gray-700" />
              <span className="hidden md:inline text-gray-800 font-medium">Admin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-3 md:hidden z-50">
          <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800">Notifications</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Admin</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
