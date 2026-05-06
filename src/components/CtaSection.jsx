import React from "react";
import { Helmet } from "react-helmet";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const CtaSection = () => {
  const { isDarkMode } = useTheme();

  return (
    <section
      id="cta-section"
      role="region"
      aria-labelledby="cta-heading"
      className={`py-20 px-6 md:px-20 flex justify-center items-center ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* ✅ SEO Meta */}
      <Helmet>
        <title>Book Your Luxury Wellness Therapy | Noira Massage London</title>
        <meta
          name="description"
          content="Transform your wellness journey with Noira. Book luxury massage therapy in London — delivered to your home, hotel, or office."
        />
        <meta
          name="keywords"
          content="massage london, luxury wellness, mobile spa, home massage, mayfair massage, holistic therapy, relaxation, noira wellness"
        />
        <meta property="og:title" content="Luxury Wellness Therapy in London | Book Now" />
        <meta
          property="og:description"
          content="Experience elite at-home massage therapy across London. Book your luxury session today and redefine relaxation."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* CTA Card */}
      <div
        className={`rounded-2xl px-10 py-12 w-full max-w-5xl text-center shadow-lg border ${
          isDarkMode
            ? "bg-[#1a1a1a] border-white/10"
            : "bg-gray-100 border-black/10"
        }`}
      >
        {/* Heading */}
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl font-bold leading-snug"
        >
          Ready to Transform Your{" "}
          <span className="text-[#C49E5B]">Wellness Journey?</span>
        </h2>

        {/* Description */}
        <p
          className={`mt-6 text-sm md:text-base ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Book your premium therapy session today and experience luxury wellness
          at your doorstep.
        </p>

        {/* CTA Buttons */}
        <div
          className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center"
          role="group"
          aria-label="Call to action buttons"
        >
          <Link
            to="/browsetherapists"
            aria-label="Book therapy near you"
            className="bg-gradient-to-r from-[#f5e18c] via-[#e0a528] to-[#a66c00] text-black font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 transition"
          >
            Book Therapy Near You
          </Link>
          <Link
            to="/allservicespage"
            aria-label="View all massage and wellness services"
            className={`font-semibold px-6 py-3 rounded-full border transition ${
              isDarkMode
                ? "border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                : "border-yellow-700 text-yellow-700 hover:bg-yellow-600 hover:text-white"
            }`}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
