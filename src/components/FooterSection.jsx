import React from 'react';
import noira from '/noira.svg';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? 'bg-[#0f111d]' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const divider = isDarkMode ? 'border-white/10' : 'border-gray-300';

  return (
    <footer className={`${bgColor} ${textColor} px-6 md:px-20 py-12`}>
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Socials */}
        <div>
          <img src={noira} alt="Noira Logo" className="w-44 mb-4" />

          <div className="flex gap-4 text-[#C49E5B] text-xl">
            <a
              href="https://www.instagram.com/noira._london/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61579799001823"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/in/noira-a62aa8378/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-[#C49E5B] font-semibold mb-4 text-lg">Services</h4>
          <ul className={`space-y-2 text-sm ${mutedText}`}>
            {['Classic Reset', 'Deep Release', 'The NOIRA Ritual'].map((service) => (
              <li key={service}>
                <Link
                  to="/allservicespage"
                  className="block hover:underline hover:text-[#C49E5B] transition"
                >
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#C49E5B] font-semibold mb-4 text-lg">Contact</h4>
          <ul className={`space-y-3 text-sm ${mutedText}`}>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#C49E5B]" /> +44 7350 700055
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#C49E5B]" /> info@noira.co.uk
            </li>
            <li className="flex items-center gap-2">
              <FaClock className="text-[#C49E5B]" /> 24/7 Available
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#C49E5B]" /> London & surrounding boroughs
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${divider} mt-10 mb-10`} />

      {/* Policies Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        {[
          { name: 'Privacy Policy', path: '/privacypolicy' },
          { name: 'Terms & Conditions', path: '/termsandcondition' },
          { name: 'Code of Ethics', path: '/codeofethics' },
          { name: 'GDPR Statement', path: '/gpdrstatement' },
          { name: 'Cancellation Policy', path: '/cancellationpolicy' },
          { name: 'Refund Policy', path: '/refundpolicy' },
          { name: 'Health & Safety', path: '/healthandsafetypolicy' },
          { name: 'Accessibility', path: '/accessibility' },
        ].map(({ name, path }) => (
          <Link
            key={path}
            to={path}
            className="hover:underline hover:text-[#C49E5B] transition"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Client Info */}
      <div className={`text-center mt-10 pt-10 border-t ${divider}`}>
        <h4 className="text-[#C49E5B] font-semibold mb-4 text-lg">Client Info</h4>
        <a
          href="/pdfs/noira_massage_setup_updated.pdf"
          download="Massage-Setup-Guide.pdf"
          className={`block text-sm ${mutedText} hover:underline hover:text-[#C49E5B] transition`}
        >
          Massage Setup & Preparation Guide (PDF)
        </a>
      </div>

      {/* Secure Payments */}
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-6 mt-10">
        <div className="flex items-center gap-2 text-sm">
          <FaCheckCircle className="text-[#C49E5B] text-lg" />
          <span className="font-medium">Secure Payments</span>
        </div>
        <img src="./stripe_logo.png" alt="Stripe" className="h-8" />
      </div>

      {/* Bottom Divider */}
      <div
        className={`border-t ${divider} pt-6 mt-10 text-center text-sm ${mutedText}`}
      >
        © 2025 <span className="text-[#C49E5B] font-semibold">NOIRA</span>. A luxury without noise. Available to the discerning few.
      </div>
    </footer>
  );
};

export default Footer;
