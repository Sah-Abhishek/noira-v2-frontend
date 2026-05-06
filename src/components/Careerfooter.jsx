import React from "react";
import { FaCrown, FaGem, FaStar } from "react-icons/fa";

const Careerfooter = () => {
  return (
    <footer className="text-center py-10 bg-[#1a1a1a] text-white">
      <div className="max-w-xl mx-auto">
        <h3 className="text-2xl mb-2 text-[#C49E5B]">NOIRA</h3>
        <p className="text-md mb-4 text-gray-400">Luxury Without Noise.</p>
        <div className="flex items-center justify-center text-[2rem] gap-8 text-[#C49E5B]">
          <FaCrown />
          <span className="justify-center">.</span>
          <FaGem />
          <span>.</span>
          <FaStar />
        </div>
      </div>
    </footer>
  );
};

export default Careerfooter;
