import React from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: 1,
    title: "Your Request",
    description:
      "Select your ritual, setting, and time. Noira’s concierge confirms availability discreetly.",
    image: "/1.png",
  },
  {
    number: 2,
    title: "The Arrival",
    description:
      "Your therapist arrives — immaculate, poised, and carrying the Noira kit to transform your space.",
    image: "/2.png",
  },
  {
    number: 3,
    title: "The Ritual",
    description:
      "From first touch to final breath, you’re immersed in a sensory journey — layered scents, warm oils, and quiet mastery.",
    image: "/3.png",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HowItWorks = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <section
      className={`py-16 px-4 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0c0c0c] text-white" : "bg-white text-gray-900"
      }`}
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <header className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-braven font-bold text-[#D59940]">
            How It Works
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Simple steps to your perfect luxury massage experience
          </p>
        </header>

        {/* ===== Steps Grid ===== */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              className={`w-full lg:w-[47%] relative group overflow-hidden rounded-3xl shadow-lg transition-all duration-500 
              hover:shadow-2xl hover:-translate-y-2 flex flex-col md:flex-row items-stretch min-h-[300px]
              ${
                isDarkMode
                  ? "bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-gray-800"
                  : "bg-white border border-gray-300"
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.15 }}
            >
              {/* === Image Section === */}
              <div className="relative w-full md:w-1/2 h-[250px] md:h-auto">
                <img
                  src={step.image}
                  alt={`${step.title} visual`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>

              {/* === Content === */}
              <div className="p-8 space-y-4 md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-[#f5e18c] via-[#e0a528] to-[#a66c00] p-3 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-[#C49E5B]">
                    <span className="text-xl font-bold text-black">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl font-braven font-semibold text-[#D59940]">
                    {step.title}
                  </h3>
                </div>
                <p
                  className={`leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ===== CTA Button ===== */}
        <div className="text-center mt-16">
          <button
            onClick={() => navigate("/allservicespage")}
            className="group relative px-8 py-4 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300
            bg-[#D59940] text-black shadow-[#C49E5B]/25 hover:shadow-[#C49E5B]/40"
          >
            <span className="relative z-10">Book Your Experience</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
