import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUsers,
  faCalendarPlus,
  faClock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export default function MonthlySubscription() {
  const phoneNumber = "+447350700055";
  const message = "Hello, I would like to book a session.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <section
      id="wellness-services-section"
      className="min-h-screen px-3 py-6 sm:px-4 lg:px-8 flex items-center justify-center bg-black text-white"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Page H1 for SEO */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#D59940] font-braven tracking-tight">
            Monthly & Corporate Wellness Subscriptions
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Experience consistent luxury wellness — perfect for individuals or
            office teams. Discover our Weekly Ritual and Office Wellness Bundles.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Card 1: Office Wellness Bundles */}
          <article
            className="luxury-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col"
            aria-labelledby="office-wellness-heading"
          >
            <div className="text-center mb-5 sm:mb-6">
              <h2
                id="office-wellness-heading"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary uppercase tracking-wide mb-2"
              >
                OFFICE WELLNESS
                <br className="hidden sm:block" />
                BUNDLES
              </h2>

              <div className="ornamental-divider">
                <span>
                  <FontAwesomeIcon icon={faStar} className="sparkle-icon" />
                </span>
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-light">
                Bring wellness directly to your workplace
              </p>
            </div>

            <div className="flex-grow space-y-3 sm:space-y-4 mb-5">
              {/* 1 Therapist */}
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-black text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        1 Therapist
                      </h3>
                      <p className="text-gray-400 text-xs">Full Day Service</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      £500
                    </div>
                    <div className="text-gray-400 text-xs">per day</div>
                  </div>
                </div>
              </div>

              {/* 2 Therapists */}
              <div className="glass-card rounded-lg p-3 sm:p-4 border border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="text-black text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        2 Therapists
                      </h3>
                      <p className="text-gray-400 text-xs">Full Day Service</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      £700
                    </div>
                    <div className="text-gray-400 text-xs">per day</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleWhatsAppClick}
                aria-label="Contact Noira Wellness on WhatsApp for Office Wellness Bundles"
                className="gold-border-hover px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-primary uppercase tracking-wide"
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                Contact on WhatsApp
              </button>
            </div>
          </article>

          {/* Card 2: Weekly Ritual */}
          <article
            className="luxury-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col"
            aria-labelledby="weekly-ritual-heading"
          >
            <div className="text-center mb-5 sm:mb-6">
              <h2
                id="weekly-ritual-heading"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary uppercase tracking-wide mb-1"
              >
                WEEKLY RITUAL
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-light uppercase tracking-wider">
                (Monthly Subscription)
              </p>

              <div className="ornamental-divider">
                <span>
                  <FontAwesomeIcon icon={faStar} className="sparkle-icon" />
                </span>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-center mb-3">
                <FontAwesomeIcon
                  icon={faStar}
                  className="sparkle-icon text-sm mr-2"
                />
                <p className="text-sm sm:text-base text-gray-200 font-light">
                  1 massage every week
                </p>
              </div>
              <p className="text-center text-gray-400 font-light text-xs sm:text-sm">
                Choice of 60 / 90 / 120 minutes
              </p>
            </div>

            <ul className="flex-grow space-y-2 mb-5">
              {[
                { time: "60 min", price: "£240 / month" },
                { time: "90 min", price: "£320 / month" },
                { time: "120 min", price: "£480 / month" },
              ].map((plan, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-primary/20"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-primary mr-2 text-xs sm:text-sm"
                    />
                    <span className="text-white font-medium text-sm">
                      {plan.time}
                    </span>
                  </div>
                  <span className="text-primary font-bold text-sm sm:text-base">
                    {plan.price}
                  </span>
                </li>
              ))}
            </ul>

            <div className="glass-card rounded-lg p-3 sm:p-4 border border-primary/20 mb-5">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="sparkle-icon text-xs mr-2"
                  />
                  <span className="text-primary font-semibold text-xs">
                    Special Inclusion
                  </span>
                </div>
                <p className="text-gray-200 text-xs leading-relaxed">
                  Includes 1 complimentary massage
                  <br />
                  <span className="text-gray-400">(for yourself or to gift)</span>
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleWhatsAppClick}
                aria-label="Contact Noira Wellness on WhatsApp for Weekly Ritual subscription"
                className="gold-border-hover px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-primary uppercase tracking-wide"
              >
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Contact on WhatsApp
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* SEO + accessibility styles */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(213, 153, 64, 0.1);
        }
        .gold-border-hover {
          transition: all 0.3s ease;
          border: 1.5px solid var(--tw-color-primary, #D59940);
        }
        .gold-border-hover:hover {
          background: var(--tw-color-primary, #D59940);
          color: black;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(213, 153, 64, 0.25);
        }
        .ornamental-divider {
          position: relative;
          text-align: center;
          margin: 0.75rem 0;
        }
        .ornamental-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, #D59940, transparent);
        }
        .ornamental-divider span {
          background: black;
          padding: 0 0.5rem;
          color: var(--tw-color-primary, #D59940);
          font-size: 0.7rem;
        }
        .luxury-card {
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.98));
          border: 1px solid rgba(213, 153, 64, 0.15);
        }
        .luxury-card:hover {
          transform: translateY(-4px);
          border-color: rgba(213, 153, 64, 0.25);
          box-shadow: 0 8px 18px rgba(213, 153, 64, 0.12);
        }
        .sparkle-icon {
          color: var(--tw-color-primary, #D59940);
          opacity: 0.8;
        }
      `}</style>
    </section>
  );
}
