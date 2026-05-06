import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const benefits = [
  {
    title: "Premium Brand Association",
    desc: "Align your business with NOIRA's award-winning reputation for quality wellness services across London.",
  },
  {
    title: "Expand Your Reach",
    desc: "Access our established client base and corporate wellness network to grow your revenue streams.",
  },
  {
    title: "Collaborative Growth",
    desc: "Benefit from our marketing expertise, operational support, and proven business development strategies.",
  },
  {
    title: "Trusted Expertise",
    desc: "Partner with fully insured, professionally trained therapists who deliver consistent five-star experiences.",
  },
];

const hotelFeatures = [
  {
    title: "In-Room Massage Services",
    desc: "Professional therapists deliver premium treatments directly to guest rooms with complete discretion and professionalism.",
  },
  {
    title: "Priority Access",
    desc: "Dedicated booking link for your hotel with guaranteed therapist availability for guest requests.",
  },
  {
    title: "Seamless Integration",
    desc: "Easy booking through your concierge team with dedicated account management and streamlined billing.",
  },
  {
    title: "Premium Standards",
    desc: "Elite-Trained fully insured therapists, and consistent five-star guest experiences.",
  },
];

const opportunities = [
  {
    title: "Hotel & Hospitality",
    items: [
      "In-room massage services",
      "Dedicated booking portal",
      "Guest wellness packages",
      "Concierge integration",
    ],
  },
  {
    title: "Corporate Wellness Partners",
    items: [
      "On-site massage programs",
      "Employee wellness packages",
      "Flexible scheduling options",
      "Dedicated account management",
    ],
  },
  {
    title: "Supplier Partnerships",
    items: [
      "Premium product placement",
      "Wholesale opportunities",
      "Co-branded initiatives",
      "Quality-focused curation",
    ],
  },
  {
    title: "Influencer Collaborations",
    items: [
      "Commission-based programs",
      "Exclusive wellness experiences",
      "Content collaboration",
      "Minimum 10k followers",
    ],
  },
];

const partnershipTypes = [
  "Hotel & Hospitality",
  "Corporate Wellness",
  "Supplier Partnership",
  "Influencer Collaboration",
];

export default function PartnerWithUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    instagram: "",
    tiktok: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/partnership/submit`, form);
      toast.success("Enquiry submitted! We'll be in touch soon.");
      setSubmitted(true);
    } catch (err) {
      console.error("Partnership submit failed:", err);
      toast.error(
        err?.response?.data?.message ||
          "Could not submit. Please try again or email partnerships@noira.co.uk."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#0d0d0d] text-white border border-[#2a2a2a] rounded-lg px-5 py-4 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen pt-32">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-braven text-primary mb-4">
          Hotel & Hospitality Partnerships
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Collaborate with NOIRA to bring elevated wellness experiences to your
          guests, clients, and teams across London.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-[#111] rounded-2xl shadow-lg p-8 border border-[#1f1f1f]"
            >
              <h3 className="text-xl font-semibold font-braven text-primary mb-3">
                {b.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hotel & Hospitality */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-[#111] rounded-2xl shadow-lg p-8 md:p-12 border border-[#1f1f1f]">
          <h2 className="text-3xl md:text-4xl font-semibold font-braven text-primary mb-6">
            Hotel & Hospitality Partnerships
          </h2>
          <p className="text-gray-300 max-w-3xl mb-10 leading-relaxed">
            Elevate your guest experience with NOIRA's professional massage
            services. We collaborate with London hotels to provide premium
            in-room and spa wellness experiences, boosting guest satisfaction
            and generating good reviews.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotelFeatures.map((f) => (
              <div
                key={f.title}
                className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-primary mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-semibold font-braven text-primary text-center mb-12">
          Partnership Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((o) => (
            <div
              key={o.title}
              className="bg-[#111] rounded-2xl shadow-lg p-8 border border-[#1f1f1f] border-l-4 border-l-primary"
            >
              <h3 className="text-xl font-semibold font-braven text-primary mb-5">
                {o.title}
              </h3>
              <ul className="space-y-3">
                {o.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Start form */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-[#111] rounded-2xl shadow-lg p-8 md:p-12 border border-[#1f1f1f]">
          <h2 className="text-3xl md:text-4xl font-semibold font-braven text-primary text-center mb-3">
            Ready to Start Your Partnership?
          </h2>
          <p className="text-center mb-10 text-gray-400">
            Become Part of the NOIRA Community and Elevate Your Wellness Business.
          </p>
          {submitted ? (
            <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">
                Thank you!
              </h3>
              <p className="text-gray-300">
                We've received your enquiry and will be in touch shortly. For
                anything urgent, reach us at{" "}
                <a
                  href="mailto:partnerships@noira.co.uk"
                  className="text-primary underline"
                >
                  partnerships@noira.co.uk
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Your name *"
                value={form.name}
                onChange={update("name")}
                className={inputClass}
              />
              <input
                required
                type="email"
                placeholder="Business email *"
                value={form.email}
                onChange={update("email")}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Hotel/Business name (if applicable)"
                value={form.business}
                onChange={update("business")}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Instagram handle"
                value={form.instagram}
                onChange={update("instagram")}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="TikTok handle"
                value={form.tiktok}
                onChange={update("tiktok")}
                className={inputClass}
              />
              <select
                required
                value={form.type}
                onChange={update("type")}
                className={inputClass}
              >
                <option value="" className="bg-[#0d0d0d]">
                  Select partnership type *
                </option>
                {partnershipTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#0d0d0d]">
                    {t}
                  </option>
                ))}
              </select>
              <textarea
                rows={5}
                placeholder="Tell us about your partnership interests and any questions you have..."
                value={form.message}
                onChange={update("message")}
                className={`${inputClass} resize-y`}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-black font-semibold tracking-wider rounded-lg py-4 hover:bg-[#b8924f] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "SUBMITTING..." : "GET STARTED"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
