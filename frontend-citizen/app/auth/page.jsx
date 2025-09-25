"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import HeroSection from "./HeroSection";
import AuthCard from "./AuthCard";

export default function AuthPage() {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center relative",
        "bg-background"
      )}
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dsax7zaig/image/upload/v1758808545/red_i4hat8.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row h-auto md:h-screen">
        <HeroSection />
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <AuthCard />
        </div>
      </div>
    </div>
  );
}
