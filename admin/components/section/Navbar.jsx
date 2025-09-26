"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Image
          src="/jharkhand-logo.webp"
          alt="Govt of Jharkhand"
          width={40}
          height={40}
        />
        <span className="font-semibold text-lg text-gray-800">Sahyog</span>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">
          Features
        </a>
        <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
          About
        </a>
        <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
          Contact
        </a>
        <button
          onClick={() => router.push("/auth")}
          className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors"
        >
          Admin Login
        </button>
      </nav>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start p-4 space-y-4 md:hidden z-50 border-t">
          <a 
            href="#features" 
            className="text-gray-700 hover:text-green-600 transition-colors py-2 w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#about" 
            className="text-gray-700 hover:text-green-600 transition-colors py-2 w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="text-gray-700 hover:text-green-600 transition-colors py-2 w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
          <button
            onClick={() => {
              router.push("/auth");
              setMobileMenuOpen(false);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors w-full text-center"
          >
            Admin Login
          </button>
        </div>
      )}
    </header>
  );
}
