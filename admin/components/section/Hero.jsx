"use client";

export default function Hero() {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
        Report Civic Issues, Drive Real Change
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Empower your community by reporting problems like potholes, broken
        streetlights, or trash bins — directly to your local government.
      </p>
      <div className="flex gap-4 justify-center mt-6">
        <a
          href="#download"
          className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Get the Apppppp
        </a>
        <a
          href="/auth"
          className="px-6 py-3 rounded-full border border-green-600 text-green-700 font-semibold hover:bg-green-50"
        >
          Login testing
        </a>
      </div>
    </section>
  );
}
