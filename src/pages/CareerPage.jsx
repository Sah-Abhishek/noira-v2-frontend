import React from "react";
import career from "/career.png";
import euro from "/euro.png";
import time from "/time.png";
import location from "/location.png";
import CareerHighlights from "../components/Careerhiglights";
import ApplyForm from "../components/ApplyForm";
import { useTheme } from "../context/ThemeContext"; // Make sure path is correct
import Footer from "../components/FooterSection";

const CareerPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <section
        className={`relative w-full transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
      >
        {/* Hero Section */}
        <div
          className="relative w-full h-[70vh] sm:h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${career})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 w-full h-full bg-black/40 sm:bg-black/30"></div>

          {/* Content */}
          <div className="relative z-20 px-4 sm:px-6 w-full max-w-5xl">
            <div className="flex flex-col items-start gap-4 sm:gap-6">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight text-white">
                Where Prestige <br className="sm:hidden" /> Meets Wellness
              </h1>

              {/* Subtitle */}
              <p className="text-[#C49E5B] text-sm sm:text-base md:text-lg lg:text-xl">
                Luxury Mobile Massage Therapy
              </p>

              {/* Tags */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 w-full sm:w-auto">
                {/* Tag 1 */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded text-xs sm:text-sm md:text-base text-white w-full sm:w-auto justify-center sm:justify-start">
                  <img src={euro} alt="Euro" className="w-3 h-5" />
                  <span>£120–£200/day</span>
                </div>

                {/* Tag 2 */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded text-xs sm:text-sm md:text-base text-white w-full sm:w-auto justify-center sm:justify-start">
                  <img src={time} alt="Time" className="w-4 h-4" />
                  <span>Flexible Hours</span>
                </div>

                {/* Tag 3 */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded text-xs sm:text-sm md:text-base text-white w-full sm:w-auto justify-center sm:justify-start">
                  <img src={location} alt="Location" className="w-3 h-4" />
                  <span>London</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Sections */}
        <CareerHighlights />
        <ApplyForm />
      </section>
      <Footer />
    </>
  );
};

export default CareerPage;
