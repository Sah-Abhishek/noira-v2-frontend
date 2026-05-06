import React from "react";
import { FaHome, FaCertificate, FaClock } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const WhyChooseNoira = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <FaHome size={28} />,
      title: "At Your Location",
      description:
        "Your sanctuary, anywhere. From Mayfair penthouses to discreet countryside retreats, Noira transforms any setting into a haven of warmth, scent, and stillness.",
    },
    {
      icon: <FaCertificate size={28} />,
      title: "Elite-Trained Therapists",
      description:
        "Chosen for their artistry, grace, and discretion. Each therapist is handpicked and trained to deliver an experience that lingers long after the last touch.",
    },
    {
      icon: <FaClock size={28} />,
      title: "Tailored to Your Energy",
      description:
        "We adapt to you. Whether at dawn before a board meeting or past midnight after a transatlantic flight, Noira moves to your schedule.",
    },
  ];

  return (
    <section
      className={`py-16 px-6 text-center transition-colors duration-300 ${
        isDarkMode ? "bg-[#111] text-[#D59940]" : "bg-white text-black"
      }`}
      aria-labelledby="why-choose-noira"
    >
      {/* ✅ Section Heading (h2) */}
      <h2
        id="why-choose-noira"
        className="text-3xl mb-10 md:text-4xl font-braven font-semibold"
      >
        Why Choose Noira Wellness
      </h2>

      {/* ✅ Supporting sentence (optional for SEO context) */}
      <p
        className={`mb-12 text-lg max-w-2xl mx-auto ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Discover why London’s elite trust Noira for bespoke, discreet, and
        rejuvenating massage experiences.
      </p>

      {/* ✅ Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-md transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-[#D59940]"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {feature.icon}
            </div>

            {/* ✅ Proper subheading level */}
            <h3 className="font-semibold font-braven text-lg mb-2">
              {feature.title}
            </h3>

            <p
              className={`text-sm leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseNoira;
