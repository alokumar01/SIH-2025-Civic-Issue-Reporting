"use client"

import Hero from "@/components/section/Hero";
import Navbar from "@/components/section/Navbar";
import Footer from "@/components/section/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="relative">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
