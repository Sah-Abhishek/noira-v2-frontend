import React from 'react';
import noira from '/noira-in-home-massage-london,.svg';
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const bgColor = 'bg-[#0f111d]';
  const textColor = 'text-white';
  const mutedText = 'text-gray-400';
  const divider = 'border-white/10';

  return (
    <footer className={`${bgColor} ${textColor} px-6 md:px-20 py-12`}>
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Logo & Socials */}
        <div className="flex flex-col gap-4">
          <img
            src={noira}
            alt="Noira Logo"
            className="w-44 aspect-[2/1] object-cover object-center"
          />

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
              href="https://www.linkedin.com/company/noira_london/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <FaLinkedinIn />
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
              <FaPhoneAlt className="text-[#C49E5B]" /> +44 7884 660894
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
          {
            name: 'Partner With Us',
            children: [
              { name: 'Hotel & Hospitality Partnerships', path: '/partnerwithus' },
              { name: 'Airbnb Hosts', path: '/airbnbhosts' },
            ],
          },
        ].map((item) =>
          item.children ? (
            <div key={item.name} className="relative group inline-block mx-auto">
              <button
                type="button"
                className="hover:underline hover:text-[#C49E5B] transition focus:outline-none whitespace-nowrap"
              >
                {item.name}
              </button>
              <div
                className={`absolute left-full top-1/2 -translate-y-1/2 ml-1 w-64 ${bgColor} ${textColor} border ${divider} rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition z-20`}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`block px-4 py-3 text-sm ${mutedText} hover:bg-[#C49E5B]/10 hover:text-[#C49E5B] transition`}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className="hover:underline hover:text-[#C49E5B] transition"
            >
              {item.name}
            </Link>
          )
        )}
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
        <img src="./noira-in-home-massage-london.png" alt="Stripe" className="h-8" />
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
