import React, { useState } from "react";
import {
  FaCheck,
  FaCalendar,
  FaStar,
  FaGift,
  FaCrown,
  FaShieldHalved,
  FaClock,
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
            Subscriptions <br />
          </h1>

          <span className="text-gray-400 font text-2xl">(Valid 3 Months)</span>
          <p className="text-gray-300 text-xl mt-5 mb-8">
            Choose your duration: 60 / 90 / 120 minutes
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
            title="3-Pack"
            desc="Perfect for trying our services"
            benefits={[
              { icon: <FaCheck />, text: "3 massage sessions" },
              { icon: <FaCalendar />, text: "Valid for 3 months" },
              { icon: <FaStar />, text: "Premium therapists" },
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
            title="6-Pack"
            desc="Great value with gift option"
            gift="Can gift one session"
            benefits={[
              { icon: <FaCheck />, text: "6 massage sessions" },
              { icon: <FaGift />, text: "1 giftable session" },
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
            title="9-Pack"
            desc="Ultimate value package"
            gift="2 giftable sessions"
            best
            extra={[{ icon: <FaStar />, text: "1 complimentary (10 total)" }]}
            benefits={[
              { icon: <FaCheck />, text: "9 + 1 massage sessions" },
              { icon: <FaGift />, text: "2 giftable sessions" },
              { icon: <FaCrown />, text: "Priority booking" },
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

        {/* ===== Footer ===== */}
        <footer className="text-center mt-16">
          <p className="text-gray-400 text-sm mb-6 flex justify-center items-center">
            <FaShieldHalved className="mr-2 text-primary" aria-hidden="true" />
            All subscriptions include premium therapist selection and flexible
            scheduling
          </p>
        </footer>
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
      className={`subscription-card glass-card rounded-3xl p-8 cursor-pointer shadow-xl relative transition-all 
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
        <h2 className="text-3xl font-bold mb-2 text-yellow-200">{title}</h2>
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
      <ul className="space-y-3 mb-8" aria-label="Benefits list">
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
