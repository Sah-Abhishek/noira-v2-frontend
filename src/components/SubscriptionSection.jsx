import React, { useState } from "react";
import {
  FaCheck,
  FaCalendar,
  FaStar,
  FaGift,
  FaCrown,
  FaShieldHalved,
  FaClock,
  FaUserCheck,
  FaHeadset,
  FaHotel,
  FaCircleInfo,
} from "react-icons/fa6";

export default function SubscriptionsSection() {
  const [duration, setDuration] = useState("60");

  const durationButtons = [
    { value: "60", label: "60 min" },
    { value: "90", label: "90 min" },
    { value: "120", label: "120 min" },
  ];

  // SEO structured data (Schema.org)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Massage Subscription Packages",
    description:
      "Choose from flexible massage subscription packages: 3-pack, 6-pack, or 9-pack, valid for 3 months.",
    itemListElement: [
      {
        "@type": "Product",
        position: 1,
        name: "3-Pack Subscription",
        description: "Perfect for trying our services.",
        offers: {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: "180",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        position: 2,
        name: "6-Pack Subscription",
        description: "Great value with gift option.",
        offers: {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: "330",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        position: 3,
        name: "9-Pack Subscription",
        description: "Ultimate value package.",
        offers: {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: "450",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <section
      className="bg-black text-white min-h-screen p-6"
      id="subscriptions"
      aria-label="Massage subscription packages section"
    >
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <header className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl text-[#D59940] font-braven font-bold mt-15">
            NOIRA PRIVÉ Membership &amp; Corporate Recovery <br />
          </h1>

          <p className="text-gray-300 text-xl mt-5 mb-8">
            Private wellness memberships designed for modern luxury living.
          </p>

          {/* ===== Duration Selector ===== */}
          <div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12"
            role="group"
            aria-label="Select massage duration"
          >
            {durationButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setDuration(btn.value)}
                aria-pressed={duration === btn.value}
                className={`duration-selector px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base inline-flex items-center rounded-full border font-medium
                  ${
                    duration === btn.value
                      ? "bg-gradient-to-r from-primary to-yellow-100 text-black scale-105"
                      : "border-primary text-primary hover:border-yellow-300 hover:text-black hover:bg-primary"
                  } transition-all`}
              >
                <FaClock className="mr-2" aria-hidden="true" /> {btn.label}
              </button>
            ))}
          </div>
        </header>

        {/* ===== Subscriptions Grid ===== */}
        <div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          role="list"
        >
          <SubscriptionCard
            pack="3"
            title="Essential"
            desc="For consistent recovery, calm, and weekly wellness rituals."
            benefits={[
              { icon: <FaCheck />, text: "3 private wellness sessions" },
              { icon: <FaCalendar />, text: "Preferred booking access" },
              { icon: <FaStar />, text: "Premium therapist matching" },
              { icon: <FaCalendar />, text: "Valid for 3 months" },
            ]}
            pricing={{
              "60": { total: "£180", per: "£60", duration: "60 minutes each" },
              "90": { total: "£240", per: "£80", duration: "90 minutes each" },
              "120": {
                total: "£360",
                per: "£120",
                duration: "120 minutes each",
              },
            }}
            duration={duration}
            buttonText="Contact on WhatsApp"
          />

          <SubscriptionCard
            pack="6"
            title="Signature"
            desc="Elevated wellness access designed for modern lifestyles."
            gift="1 complimentary guest session"
            benefits={[
              { icon: <FaCheck />, text: "6 private wellness sessions" },
              { icon: <FaCrown />, text: "Priority booking" },
              { icon: <FaStar />, text: "Preferred therapist selection" },
              { icon: <FaCalendar />, text: "Valid for 3 months" },
            ]}
            pricing={{
              "60": { total: "£330", per: "£55", duration: "60 minutes each" },
              "90": { total: "£450", per: "£75", duration: "90 minutes each" },
              "120": {
                total: "£660",
                per: "£110",
                duration: "120 minutes each",
              },
            }}
            duration={duration}
            buttonText="Contact on WhatsApp"
          />

          <SubscriptionCard
            pack="9"
            title="NOIRA Black"
            desc="Our most exclusive wellness membership experience."
            gift="Complimentary guest experiences"
            best
            extra={[{ icon: <FaStar />, text: "Priority same-day access" }]}
            benefits={[
              { icon: <FaCheck />, text: "9 + 1 private wellness sessions" },
              { icon: <FaCrown />, text: "Dedicated booking concierge" },
              { icon: <FaStar />, text: "VIP scheduling & exclusive rituals" },
            ]}
            pricing={{
              "60": { total: "£450", per: "£50", duration: "60 minutes each" },
              "90": { total: "£630", per: "£70", duration: "90 minutes each" },
              "120": {
                total: "£900",
                per: "£100",
                duration: "120 minutes each",
              },
            }}
            duration={duration}
            buttonText="Contact on WhatsApp"
          />
        </div>

        {/* ===== Executive Recovery + Private Ritual Membership ===== */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-20">
          {/* Executive Recovery — highlighted offering */}
          <div className="rounded-2xl p-8 bg-[#D59940]/10 border border-[#D59940]/40">
            <h3 className="text-2xl font-braven font-bold text-[#D59940] mb-4">
              Executive Recovery Experiences
            </h3>
            <p className="text-gray-300 mb-5">
              Luxury in-office wellness experiences designed to restore focus,
              reduce stress, and elevate team wellbeing across leadership teams
              and executive environments.
            </p>
            <ul className="space-y-3 text-gray-300 list-disc pl-5 marker:text-[#D59940]">
              <li>
                <span className="font-semibold text-white">
                  Executive Reset:
                </span>{" "}
                Private full-day wellness service for leadership teams
              </li>
              <li>
                <span className="font-semibold text-white">
                  Founders Recovery Experience:
                </span>{" "}
                Curated recovery for high-performance teams, events, and private
                corporate environments
              </li>
            </ul>
          </div>

          {/* Private Ritual Membership */}
          <div className="rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-braven font-bold text-[#D59940] mb-4">
              Private Ritual Membership
            </h3>
            <p className="text-gray-300 mb-5">
              A recurring wellness ritual tailored to your schedule and
              lifestyle. Available in 60 / 90 / 120-minute formats.
            </p>
            <ul className="space-y-3 text-gray-300 list-disc pl-5 marker:text-[#D59940]">
              <li>Recurring private sessions</li>
              <li>Priority scheduling</li>
              <li>Luxury recovery experience</li>
              <li>Complimentary guest session</li>
              <li>Preferred member access</li>
            </ul>
          </div>
        </div>

        {/* ===== Tagline strip ===== */}
        <div className="max-w-6xl mx-auto mt-12 text-center">
          <p className="text-gray-300 text-base sm:text-lg">
            Designed for modern luxury living.{" "}
            <span className="font-semibold text-[#D59940]">
              Recovery is no longer optional.
            </span>
          </p>
        </div>

        {/* ===== 4 Feature cards ===== */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mt-16">
          <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] shadow-lg transition-all duration-300 hover:border-[#D59940]/40 hover:shadow-2xl hover:shadow-[#C49E5B]/20 hover:-translate-y-1">
            <FaShieldHalved
              className="text-3xl text-[#D59940] mb-3"
              aria-hidden="true"
            />
            <h4 className="text-xl font-braven text-[#D59940] mb-2">
              Discreet Service
            </h4>
            <p className="text-gray-300">
              Complete privacy and discretion at every stage of the client
              experience.
            </p>
          </div>
          <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] shadow-lg transition-all duration-300 hover:border-[#D59940]/40 hover:shadow-2xl hover:shadow-[#C49E5B]/20 hover:-translate-y-1">
            <FaUserCheck
              className="text-3xl text-[#D59940] mb-3"
              aria-hidden="true"
            />
            <h4 className="text-xl font-braven text-[#D59940] mb-2">
              Vetted Therapists
            </h4>
            <p className="text-gray-300">
              Every NOIRA therapist is rigorously selected for expertise and
              professionalism.
            </p>
          </div>
          <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] shadow-lg transition-all duration-300 hover:border-[#D59940]/40 hover:shadow-2xl hover:shadow-[#C49E5B]/20 hover:-translate-y-1">
            <FaHeadset
              className="text-3xl text-[#D59940] mb-3"
              aria-hidden="true"
            />
            <h4 className="text-xl font-braven text-[#D59940] mb-2">
              Private Concierge
            </h4>
            <p className="text-gray-300">
              Dedicated concierge support available via WhatsApp and direct line
              at all times.
            </p>
          </div>
          <div className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] shadow-lg transition-all duration-300 hover:border-[#D59940]/40 hover:shadow-2xl hover:shadow-[#C49E5B]/20 hover:-translate-y-1">
            <FaHotel
              className="text-3xl text-[#D59940] mb-3"
              aria-hidden="true"
            />
            <h4 className="text-xl font-braven text-[#D59940] mb-2">
              Hotels &amp; Partners
            </h4>
            <p className="text-gray-300">
              A dedicated &quot;For Hotels &amp; Partners&quot; page supports
              corporate partnership enquiries.
            </p>
          </div>
        </div>

        {/* ===== Concierge enquiry ===== */}
        <div className="max-w-6xl mx-auto mt-12 text-center">
          <p className="text-gray-300 text-base sm:text-lg">
            Corporate partnership enquiries and concierge bookings:{" "}
            <span className="font-semibold text-[#D59940]">
              Speak To Concierge
            </span>{" "}
            or{" "}
            <span className="font-semibold text-[#D59940]">
              Corporate Partnership Inquiry
            </span>
            .
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-10 text-center">
          <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-[#D59940] mb-3">
            NOIRA Private Concierge
          </p>
          <a
            href="tel:+447884660894"
            className="block text-2xl sm:text-3xl font-braven text-white hover:text-[#D59940] transition"
          >
            +44 7884 660894
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------- Reusable Subscription Card ------------------- */
function SubscriptionCard({
  pack,
  title,
  desc,
  gift,
  best,
  extra,
  benefits,
  pricing,
  duration,
  buttonText,
}) {
  const phoneNumber = "+447350700055";
  const message = "Hello, I would like to book a session.";
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <article
      className={`subscription-card glass-card rounded-3xl p-8 cursor-pointer shadow-xl relative transition-all flex flex-col h-full
      ${
        best
          ? "border-2 border-primary relative before:content-['BEST_VALUE'] before:absolute before:top-[-12px] before:right-[-10px] before:bg-gradient-to-r before:from-primary before:to-yellow-200 before:text-black before:px-3 before:py-1 before:text-xs before:font-bold before:rounded-full before:rotate-12"
          : "border border-transparent"
      }`}
      role="listitem"
      aria-label={`${title} subscription package`}
    >
      {/* Header */}
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold font-braven mb-2 text-yellow-200">{title}</h2>
        <p className="text-gray-400 text-sm">{desc}</p>
      </header>

      {/* Gift / Extra */}
      {(gift || extra) && (
        <div className="bg-gradient-to-r from-primary/20 to-yellow-200/10 border border-primary/40 rounded-xl p-3 mb-6 space-y-2 text-center">
          {gift && (
            <div className="flex items-center justify-center text-primary text-sm font-medium">
              <FaGift className="mr-2" aria-hidden="true" />
              {gift}
            </div>
          )}
          {extra?.map((e, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-primary text-sm font-medium"
            >
              {e.icon}
              <span className="ml-2">{e.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pricing */}
      <div className="space-y-6 mb-8 text-center">
        <div className="text-4xl font-bold text-white mb-2">
          {pricing[duration].total}
        </div>
        <div className="text-primary text-lg font-semibold">
          {pricing[duration].per} per session
        </div>
        <div className="text-gray-400 text-sm">
          {pricing[duration].duration}
        </div>
      </div>

      {/* Benefits */}
      <ul className="space-y-3 mb-8 flex-grow" aria-label="Benefits list">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-center text-gray-300">
            <span className="text-primary mr-3" aria-hidden="true">
              {b.icon}
            </span>
            <span>{b.text}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={handleWhatsAppClick}
        className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300
        ${
          best
            ? "bg-gradient-to-r from-primary to-yellow-200 text-black hover:shadow-xl"
            : "bg-gradient-to-r from-yellow-700 to-primary text-black hover:shadow-lg"
        }`}
        aria-label={`Contact us on WhatsApp about ${title}`}
      >
        {buttonText}
      </button>
    </article>
  );
}
