import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/FooterSection.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

const fallbackServices = [
  {
    title: "Classic Reset",
    duration: "60 / 90 MIN",
    image: "/noira-luxury-relaxation..jpg",
    description:
      "A refined blend of long, flowing strokes and gentle pressure. This massage is designed to release surface tension, restore balance, and leave the body feeling light, relaxed, and refreshed.",
  },
  {
    title: "Deep Release",
    duration: "60 / 90 MIN",
    image: "/noira-elite-massage-services,.jpg",
    description:
      "A deeper, more intense massage that works into the muscles with focused pressure. Ideal for those with chronic tension, stiffness, or fatigue — offering real relief and renewed strength.",
  },
  {
    title: "The NOIRA Ritual",
    duration: "90 / 120 MIN",
    image: "/noira-vip-spa-experience,.jpg",
    description:
      "Our signature experience. Slow, hypnotic strokes that are sensual yet entirely professional. Designed to calm the nervous system, heighten awareness, and reconnect body and mind — a ritual exclusive to NOIRA.",
  },
];

const durationFromOptions = (options) => {
  if (!Array.isArray(options) || options.length === 0) return null;
  const minutes = options
    .map((o) => o?.duration ?? o?.minutes ?? o?.duration_minutes)
    .filter((m) => m != null && m !== "");
  if (minutes.length === 0) return null;
  return `${minutes.join(" / ")} MIN`;
};

const subscriptions = [
  {
    pack: "3-PACK",
    sessions: "3 SESSIONS",
    number: "3",
    description:
      "Commit to your well-being. Flexible. Recharge. Repeat.",
  },
  {
    pack: "6-PACK",
    sessions: "6 SESSIONS",
    number: "6",
    description:
      "Step deeper into your routine. More balance, more benefits.",
  },
  {
    pack: "9-PACK",
    sessions: "9 SESSIONS",
    number: "9",
    description:
      "The ultimate commitment to you. Lasting results.",
  },
];

const NoiraEmblem = ({ className = "" }) => (
  <div
    className={`w-10 h-10 rounded-full border border-[#C49E5B] flex items-center justify-center bg-black/50 backdrop-blur-sm shadow-[0_0_12px_rgba(196,158,91,0.3)] ${className}`}
  >
    <span className="font-braven text-[#C49E5B] text-base">N</span>
  </div>
);

const StackIcon = ({ number }) => (
  <div className="relative w-14 h-14 rounded-full border border-[#C49E5B]/70 flex items-center justify-center shrink-0">
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="#C49E5B"
      strokeWidth="1.2"
      className="w-7 h-7"
    >
      <rect x="6" y="10" width="18" height="13" rx="2" />
      <rect x="9" y="7" width="18" height="13" rx="2" />
    </svg>
    <span
      className="absolute font-braven text-[#C49E5B] text-[11px] tracking-wider"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-30%, -10%)",
      }}
    >
      {number}
    </span>
  </div>
);

const ProductPage = () => {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    let cancelled = false;
    const fetchServices = async () => {
      try {
        const res = await fetch(`${apiUrl}/services/list`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data) || data.length === 0) return;

        const order = ["Classic Reset", "Deep Release", "The NOIRA Ritual"];
        const byName = new Map(data.map((s) => [s.name, s]));
        const ordered = order
          .map((name) => byName.get(name))
          .filter(Boolean);
        const list = (ordered.length === order.length ? ordered : data).slice(0, 3);

        const mapped = list.map((s, i) => ({
          title: s.name,
          duration:
            durationFromOptions(s.options) ??
            fallbackServices[i]?.duration ??
            "",
          image: s.image_url || fallbackServices[i]?.image,
          description: fallbackServices[i]?.description || "",
        }));

        setServices(mapped);
      } catch (err) {
        console.error("Failed to load product catalog services:", err);
      }
    };
    fetchServices();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Noira Product Catalog | Services & Subscriptions</title>
        <meta
          name="description"
          content="Explore Noira's product catalog — Classic Reset, Deep Release and The Noira Ritual, with 3, 6 and 9 session subscription packs."
        />
        <link rel="canonical" href="https://noira.co.uk/product" />
      </Helmet>

      <Navbar />

      <main
        className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden"
        style={{ backgroundColor: "#000" }}
      >
        {/* Subtle gold radial glow background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(196,158,91,0.12), transparent 60%)",
          }}
        />

        {/* Header */}
        <header className="relative text-center max-w-5xl mx-auto mb-12 sm:mb-16">
          <h1 className="font-braven text-[#C49E5B] tracking-[0.18em] text-4xl sm:text-5xl md:text-6xl">
            Noira
          </h1>
          <h2 className="font-braven text-[#C49E5B] tracking-[0.12em] text-3xl sm:text-4xl md:text-5xl mt-3">
            Product Catalog
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C49E5B] to-transparent mx-auto mt-6" />
          <p className="text-[#C49E5B]/80 tracking-[0.4em] text-[11px] sm:text-xs mt-4">
            OUR SERVICES &amp; SUBSCRIPTIONS
          </p>
        </header>

        {/* Service cards */}
        <section className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s) => (
            <article
              key={s.title}
              className="bg-[#111] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#C49E5B]/30 flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:border-[#C49E5B]/60"
            >
              <div className="relative h-72 sm:h-80 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <NoiraEmblem />
                </div>
              </div>
              <div className="px-6 pt-6 pb-7 text-center bg-[#111] border-t border-[#C49E5B]/15">
                <h3 className="font-braven text-white tracking-[0.12em] text-2xl sm:text-3xl">
                  {s.title}
                </h3>
                <p className="text-[#C49E5B] tracking-[0.3em] text-[10px] sm:text-xs mt-2">
                  {s.duration}
                </p>
                <div className="w-12 h-[1px] bg-[#C49E5B]/40 mx-auto my-4" />
                <p className="text-[#dddddd] text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Subscriptions divider */}
        <div className="relative max-w-7xl mx-auto flex items-center gap-4 my-14 sm:my-20">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C49E5B]/60" />
          <span className="font-braven text-[#C49E5B] tracking-[0.3em] text-base sm:text-lg">
            SUBSCRIPTIONS
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C49E5B]/60" />
        </div>

        {/* Subscription cards */}
        <section className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {subscriptions.map((p) => (
            <article
              key={p.pack}
              className="rounded-2xl overflow-hidden border border-[#C49E5B]/40 bg-[#1a1a1a] flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 hover:border-[#C49E5B]/70"
            >
              <div className="bg-gradient-to-b from-[#181818] to-[#0d0d0d] px-6 py-7 flex items-center gap-5 rounded-t-2xl border-b border-[#C49E5B]/20">
                <StackIcon number={p.number} />
                <div className="flex-1 text-center">
                  <h3 className="font-braven text-white tracking-[0.12em] text-2xl sm:text-3xl">
                    {p.pack}
                  </h3>
                  <p className="text-[#C49E5B] tracking-[0.3em] text-[10px] sm:text-xs mt-2">
                    {p.sessions}
                  </p>
                </div>
              </div>
              <div className="px-6 py-6 text-center bg-[#1a1a1a]">
                <p className="text-[#dddddd] text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Footer note */}
        <div className="relative max-w-3xl mx-auto mt-14 sm:mt-20">
          <div className="rounded-full bg-[#1a1a1a] border border-[#C49E5B]/40 px-6 py-3 text-center shadow-[0_4px_20px_rgba(196,158,91,0.08)]">
            <p className="text-[#dddddd] tracking-[0.25em] text-[10px] sm:text-xs">
              <span className="text-[#C49E5B] mr-2">✦</span>
              PACKS ARE VALID FOR 6 MONTHS FROM THE DATE OF PURCHASE.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductPage;
