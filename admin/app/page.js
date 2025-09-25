"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header / Navbar */}
      <header className="w-full flex justify-between items-center max-w-6xl mx-auto py-4">
        <h1 className="text-2xl font-bold text-green-700">CivicConnect</h1>
        <nav className="flex gap-6 text-gray-700">
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#about" className="hover:text-green-600">About</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
          <a href="/auth" className="hover:text-green-600">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center gap-6 max-w-3xl py-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
          Report Civic Issues, Drive Real Change
        </h2>
        <p className="text-lg text-gray-600">
          Empower your community by reporting problems like potholes, broken streetlights, or trash bins — directly to your local government.
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="#download"
            className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Get the App
          </a>
          <a
            href="#learn"
            className="px-6 py-3 rounded-full border border-green-600 text-green-700 font-semibold hover:bg-green-50"
          >
            Learn More
          </a>
        </div>
        <Image
          src="/civic-report.png" // replace with your own hero image
          alt="Civic Issue Reporting Illustration"
          width={500}
          height={400}
          className="mt-10 rounded-lg shadow-lg"
        />
      </main>

      {/* Features Section */}
      <section id="features" className="w-full max-w-6xl mx-auto py-20 grid md:grid-cols-3 gap-10 text-center">
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-2">📍 Location Tagging</h3>
          <p className="text-gray-600">Reports include GPS coordinates for quick identification and response.</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-2">📸 Multimedia Reports</h3>
          <p className="text-gray-600">Attach photos or voice notes for better context and faster action.</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-2">📊 Live Dashboard</h3>
          <p className="text-gray-600">Municipal staff track, assign, and resolve issues efficiently in real time.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t text-gray-500">
        © {new Date().getFullYear()} Government of Jharkhand · Department of Higher and Technical Education
      </footer>
    </div>
  );
}
