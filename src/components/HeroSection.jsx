import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import noira from "/noira.png";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const overlayColor = isDarkMode ? 'bg-black/50' : 'bg-white/10';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  const fadeInUp = {
    hidden: { opacity: 0, y: 70 },
    visible: { opacity: 1, y: 0, transition: { duration: 2, ease: "easeOut" } },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden" aria-label="Luxury Massage London Hero Section">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/herovideo3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayColor} z-10`} />

      {/* Content */}
      <motion.div
        className={`relative z-20 flex flex-col items-center justify-center h-full text-center px-4 ${textMain}`}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* ✅ Main SEO Headline */}
        <h1 className="text-3xl font-braven sm:text-5xl md:text-4xl font-bold text-[#C49E5B] max-w-3xl leading-tight">
          Luxury Massage in London — Discreet Mobile Spa Experience
        </h1>

        {/* ✅ Supporting tagline (now h2 for hierarchy) */}
        <h2 className="mt-6 text-xl sm:text-2xl md:text-3xl text-[#C49E5B] font-whisper font-semibold">
          The #1 Elite Massage Brand Across Mayfair, Chelsea & Knightsbridge
        </h2>

        {/* ✅ Subheading/descriptor (paragraph, not heading) */}
        <p className="mt-6 text-lg md:text-xl text-[#C49E5B] font-whisper font-medium max-w-[85%]">
          Luxury without noise — the discreet indulgence London’s elite whisper about.
        </p>

        {/* ✅ Logo */}
        <div className="my-8">
          <img
            src={noira}
            alt="Noira Massage Logo"
            className="h-20 sm:h-24 mx-auto"
            loading="lazy"
          />
        </div>

        {/* ✅ CTA */}
        <button
          onClick={() => navigate("/allservicespage")}
          className="mt-4 bg-[#C49E5B] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
        >
          Book Now
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
