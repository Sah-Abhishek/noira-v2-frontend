import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const benefits = [
  {
    title: "Premium Guest Experience",
    desc: "Provide top-rated, in-property massage services to make your Airbnb stand out.",
  },
  {
    title: "Seamless Booking",
    desc: "Enjoy a seamless online booking system, allowing guests to book treatments with just a few clicks.",
  },
  {
    title: "Five-Star Reviews",
    desc: "Enhance guest satisfaction with luxurious wellness experiences, leading to higher ratings and more return visits.",
  },
  {
    title: "Dedicated Support",
    desc: "Partner with NOIRA's dedicated host success team for prompt, dependable, and premium service.",
  },
];

const cityOptions = [
  "London",
  "Manchester",
  "Birmingham",
  "Edinburgh",
  "Glasgow",
  "Liverpool",
  "Leeds",
  "Bristol",
  "Cambridge",
  "Oxford",
  "Brighton",
  "Other",
];

const propertyTypeOptions = [
  "Apartment",
  "House",
  "Townhouse",
  "Studio",
  "Penthouse",
  "Villa",
  "Cottage",
  "Loft",
  "Other",
];

const monthlyBookingsRanges = [
  "1 - 5 bookings",
  "6 - 15 bookings",
  "16 - 30 bookings",
  "31 - 50 bookings",
  "50+ bookings",
];

const massageServiceOptions = [
  "Single Massage Sessions",
  "Couple's Massage",
  "Group Massages",
];

const adequateSpaceOptions = [
  "Yes, I have a dedicated space",
  "Yes, the bedroom or living area is suitable",
  "Not sure — please advise",
  "No",
];

const paymentArrangementOptions = [
  "Guest pays directly to NOIRA",
  "Host pre-pays for guest packages",
  "Commission-based partnership",
  "Open to discussion",
];

const heardAboutUsOptions = [
  "Google Search",
  "Social Media",
  "Referral from another host",
  "Airbnb host community",
  "Press / Media",
  "Other",
];

export default function AirbnbHosts() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyName: "",
    airbnbListingUrl: "",
    propertyAddress: "",
    city: "",
    postcode: "",
    propertyType: "",
    bedrooms: "",
    accessInstructions: "",
    estimatedMonthlyBookings: "",
    massageServicesInterested: [],
    adequateSpaceForTable: "",
    preferredPaymentArrangement: "",
    heardAboutUs: "",
    additionalNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      massageServicesInterested: prev.massageServicesInterested.includes(service)
        ? prev.massageServicesInterested.filter((s) => s !== service)
        : [...prev.massageServicesInterested, service],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/airbnb-hosts/submit`, form);
      toast.success("Application submitted! We'll be in touch soon.");
      setSubmitted(true);
    } catch (err) {
      console.error("Airbnb host application failed:", err);
      toast.error(
        err?.response?.data?.message ||
          "Could not submit. Please try again or email partnerships@noira.co.uk."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#0d0d0d] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";

  const labelClass = "block text-sm font-semibold text-gray-200 mb-2";

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen pt-32">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold font-braven text-primary mb-4">
          Airbnb Host Partnership Application
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Elevate your Airbnb guests' experience with premium in-property
          massage services. Join NOIRA's exclusive host partnership programme.
        </p>
      </section>

      {/* Partner with NOIRA banner */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#161616] to-[#1a1a1a] border border-primary/30 rounded-2xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold font-braven text-primary mb-3">
            Partner with NOIRA
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Elevate your Airbnb guests' experience with premium in-property
            massage services. Join our exclusive host partnership programme.
          </p>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-semibold font-braven text-primary text-center mb-10">
          Why Partner With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-[#111] rounded-2xl shadow-lg p-7 border border-[#1f1f1f] hover:border-primary/40 transition"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                {b.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Booking Information */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-[#1f1a0d] border-l-4 border-primary rounded-xl p-6 md:p-7">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-3">
            <span>⚠️</span> Important Booking Information
          </h3>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            We advise your guests to book their massage appointments{" "}
            <strong className="text-primary">early</strong> to secure their
            preferred slots. As a highly sought-after, our system requires at
            least{" "}
            <strong className="text-primary">24 hours' notice</strong> for
            bookings, and availability may be limited, particularly during busy
            periods. Booking in advance ensures your guests can enjoy this
            exclusive wellness experience.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-4xl mx-auto px-6 py-12 pb-24">
        <div className="bg-[#111] rounded-2xl shadow-lg p-8 md:p-12 border border-[#1f1f1f]">
          <h2 className="text-3xl md:text-4xl font-semibold font-braven text-primary text-center mb-10">
            Application Form
          </h2>

          {submitted ? (
            <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">
                Thank you!
              </h3>
              <p className="text-gray-300">
                We've received your application and will be in touch shortly.
                For anything urgent, reach us at{" "}
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
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Host Information */}
              <div>
                <h3 className="text-xl font-semibold text-primary border-b border-primary/30 pb-2 mb-6">
                  Host Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.firstName}
                      onChange={update("firstName")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.lastName}
                      onChange={update("lastName")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-xl font-semibold text-primary border-b border-primary/30 pb-2 mb-6">
                  Property Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>
                      Property Name/Title{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.propertyName}
                      onChange={update("propertyName")}
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      As listed on Airbnb
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Airbnb Listing URL</label>
                    <input
                      type="url"
                      placeholder="www.airbnb.co.uk/rooms/..."
                      value={form.airbnbListingUrl}
                      onChange={update("airbnbListingUrl")}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Full Property Address{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.propertyAddress}
                      onChange={update("propertyAddress")}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.city}
                        onChange={update("city")}
                        className={inputClass}
                      >
                        <option value="" className="bg-[#0d0d0d]">
                          Select city
                        </option>
                        {cityOptions.map((c) => (
                          <option key={c} value={c} className="bg-[#0d0d0d]">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={form.postcode}
                        onChange={update("postcode")}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Property Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.propertyType}
                        onChange={update("propertyType")}
                        className={inputClass}
                      >
                        <option value="" className="bg-[#0d0d0d]">
                          Select property type
                        </option>
                        {propertyTypeOptions.map((p) => (
                          <option key={p} value={p} className="bg-[#0d0d0d]">
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Number of Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={form.bedrooms}
                        onChange={update("bedrooms")}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Access Instructions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.accessInstructions}
                      onChange={update("accessInstructions")}
                      className={`${inputClass} resize-y`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Entry codes, parking information, building access, etc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Requirements */}
              <div>
                <h3 className="text-xl font-semibold text-primary border-b border-primary/30 pb-2 mb-6">
                  Service Requirements
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>
                      Estimated Monthly Guest Bookings
                    </label>
                    <select
                      value={form.estimatedMonthlyBookings}
                      onChange={update("estimatedMonthlyBookings")}
                      className={inputClass}
                    >
                      <option value="" className="bg-[#0d0d0d]">
                        Select range
                      </option>
                      {monthlyBookingsRanges.map((r) => (
                        <option key={r} value={r} className="bg-[#0d0d0d]">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Massage Services Interested In
                    </label>
                    <div className="space-y-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-4">
                      {massageServiceOptions.map((service) => {
                        const checked =
                          form.massageServicesInterested.includes(service);
                        return (
                          <label
                            key={service}
                            className="flex items-center gap-3 cursor-pointer text-gray-200 hover:text-primary transition"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleService(service)}
                              className="w-4 h-4 accent-primary"
                            />
                            <span>{service}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Is there adequate space for massage table setup?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.adequateSpaceForTable}
                      onChange={update("adequateSpaceForTable")}
                      className={inputClass}
                    >
                      <option value="" className="bg-[#0d0d0d]">
                        Please select
                      </option>
                      {adequateSpaceOptions.map((o) => (
                        <option key={o} value={o} className="bg-[#0d0d0d]">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Preferred Payment Arrangement{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.preferredPaymentArrangement}
                      onChange={update("preferredPaymentArrangement")}
                      className={inputClass}
                    >
                      <option value="" className="bg-[#0d0d0d]">
                        Please select
                      </option>
                      {paymentArrangementOptions.map((o) => (
                        <option key={o} value={o} className="bg-[#0d0d0d]">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-primary border-b border-primary/30 pb-2 mb-6">
                  Additional Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>
                      How did you hear about us?
                    </label>
                    <select
                      value={form.heardAboutUs}
                      onChange={update("heardAboutUs")}
                      className={inputClass}
                    >
                      <option value="" className="bg-[#0d0d0d]">
                        Please select
                      </option>
                      {heardAboutUsOptions.map((o) => (
                        <option key={o} value={o} className="bg-[#0d0d0d]">
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Additional Comments or Questions
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us more about your property, your guests, or any specific requirements..."
                      value={form.additionalNotes}
                      onChange={update("additionalNotes")}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto md:px-16 bg-primary text-black font-semibold tracking-wider rounded-full py-4 hover:bg-[#b8924f] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                </button>
                <p className="text-sm text-gray-500">
                  We'll review your application and get back to you within 5
                  business days.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Experience It Yourself First */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#161616] to-[#1a1a1a] border border-primary/30 rounded-2xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold font-braven text-primary mb-5">
            Experience It Yourself First
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
            We encourage hosts to book a massage for themselves to personally
            experience our service. The best way to confidently recommend our
            treatments to your guests is by witnessing our quality and
            professionalism firsthand. Try our massage service yourself—there's
            no better way to understand its value and confidently promote it to
            your guests.
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Book a trial massage session and see for yourself why your guests
            will appreciate this premium offering.
          </p>
          <button
            onClick={() => navigate("/allservicespage")}
            className="bg-primary text-black font-semibold tracking-wider rounded-full px-10 py-4 hover:bg-[#b8924f] transition"
          >
            BOOK YOUR TRIAL SESSION
          </button>
        </div>
      </section>
    </div>
  );
}
