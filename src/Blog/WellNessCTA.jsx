
import React from "react";
import { useNavigate } from "react-router-dom";

export default function WellnessCTA() {
  const navigate = useNavigate();

  return (
    <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#2a2119] to-[#1a1a1a] border border-white/10 p-8 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
        Ready to Experience Luxury Wellness?
      </h2>
      <p className="text-gray-300 max-w-2xl mx-auto mb-6">
        Transform your well-being with our expert therapists and premium treatments.
        Book your personalized therapy session today.
      </p>
      <button
        onClick={() => navigate("/bookings")}
        className="px-6 py-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black font-semibold rounded-full shadow-md hover:opacity-90 transition"
      >
        Book a Therapy Session with Noira
      </button>
    </div>
  );
}
