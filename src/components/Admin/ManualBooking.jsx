import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCrown } from "react-icons/fa";
import {
  Search,
  User as UserIcon,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Link as LinkIcon,
  Copy,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
} from "lucide-react";

// ─── Constants & helpers (mirrors customer DateTimePicker) ───────────────
const initialAddress = {
  Building_No: "",
  Street: "",
  Locality: "",
  PostTown: "",
  PostalCode: "",
};

const formatDateForApi = (d) => {
  if (!(d instanceof Date)) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const isPastTime = (timeString, selectedDate) => {
  if (!selectedDate) return false;
  const [h, m] = timeString.split(":").map(Number);
  const slot = new Date(selectedDate);
  slot.setHours(h, m, 0, 0);
  return slot <= new Date();
};

const generateMonthDays = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  for (let i = 0; i < date.getDay(); i++) days.push(null);
  while (date.getMonth() === month) {
    days.push({
      date: date.getDate(),
      fullDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const daySections = {
  morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"],
  afternoon: [
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ],
  evening: [
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
  ],
};
const nightSections = {
  lateNight: [
    "23:30",
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
  ],
  earlyMorning: [
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
  ],
};
const sectionLabel = {
  morning: "☀️ Morning",
  afternoon: "🌞 Afternoon",
  evening: "🌙 Evening",
  lateNight: "🌌 Late Night (Premium)",
  earlyMorning: "🌅 Early Morning (Premium)",
};

const ChannelChip = ({ label, active, onClick, disabled, disabledReason }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    title={disabled ? disabledReason : ""}
    className={[
      "px-3 py-1.5 rounded-full text-xs font-medium border transition",
      disabled
        ? "border-gray-800 text-gray-600 cursor-not-allowed"
        : active
        ? "bg-primary text-black border-primary"
        : "border-primary/30 text-primary hover:bg-primary/10",
    ].join(" ")}
  >
    {label}
  </button>
);

// ─── Component ────────────────────────────────────────────────────────────
const ManualBooking = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");
  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${adminjwt}` } }),
    [adminjwt]
  );

  // ── Customer state ──────────────────────────────────────────────────────
  const [phoneSearch, setPhoneSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: { ...initialAddress },
  });

  // ── Booking flow state ──────────────────────────────────────────────────
  const [servicesList, setServicesList] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [optionIndex, setOptionIndex] = useState("");

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [days, setDays] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [activeTab, setActiveTab] = useState("day");

  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [filteringTherapists, setFilteringTherapists] = useState(false);
  const [hasFilteredOnce, setHasFilteredOnce] = useState(false);
  const [therapistId, setTherapistId] = useState("");

  const [notes, setNotes] = useState("");

  // ── Payment state ───────────────────────────────────────────────────────
  const [paymentMode, setPaymentMode] = useState("card-link");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [linkChannels, setLinkChannels] = useState({
    sms: true,
    whatsapp: false,
    email: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [lastPaymentLink, setLastPaymentLink] = useState(null);
  const isCardLink = paymentMode === "card-link";

  const filterReqIdRef = useRef(0);

  // ── Postcode autocomplete (matches customer PostalCodeModal) ──────────
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [postcodeSuggestions, setPostcodeSuggestions] = useState([]);
  const [postcodeFocused, setPostcodeFocused] = useState(false);
  const [postcodeLoading, setPostcodeLoading] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────────────
  const postcode = (
    selectedCustomer?.address?.PostalCode ||
    customer.address.PostalCode ||
    ""
  )
    .toUpperCase()
    .trim();
  const postcodeReady = postcode.length >= 2;
  const selectedService = servicesList.find((s) => s._id === serviceId);
  const selectedOption =
    selectedService && optionIndex !== ""
      ? selectedService.options?.[Number(optionIndex)]
      : null;
  const allSlotInputsReady =
    postcodeReady && !!serviceId && optionIndex !== "" && !!date && !!time;

  const toggleChannel = (key) =>
    setLinkChannels((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Fetch services on mount ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${apiUrl}/services/list`, authHeader);
        setServicesList(res.data?.services || res.data || []);
      } catch (err) {
        console.error("Failed to load services:", err);
        toast.error("Could not load services");
      }
    })();
  }, [apiUrl, authHeader]);

  // ── Customer phone search ───────────────────────────────────────────────
  useEffect(() => {
    const trimmed = phoneSearch.replace(/\s+/g, "");
    if (trimmed.length < 4) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await axios.get(
          `${apiUrl}/admin/customers/search?phone=${encodeURIComponent(trimmed)}`,
          authHeader
        );
        setSearchResults(res.data?.customers || []);
      } catch (err) {
        console.error("customer search failed", err);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [phoneSearch, apiUrl, authHeader]);

  // ── Calendar days regenerate when month changes ─────────────────────────
  useEffect(() => {
    setDays(generateMonthDays(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  // ── Postcode autocomplete (debounced; outcodes + full postcodes) ────────
  useEffect(() => {
    const q = postcodeQuery.trim();
    if (!q) {
      setPostcodeSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setPostcodeLoading(true);
        const res = await axios.get(
          `https://api.postcodes.io/postcodes?q=${encodeURIComponent(q)}&limit=3`
        );
        const result = res.data?.result || [];
        const postcodes = result.map((r) => r.postcode);
        const extractedOutcodes = [
          ...new Set(postcodes.map((p) => p.split(" ")[0])),
        ];
        const typed = q.toUpperCase();
        const looksLikeOutcode = /^[A-Z]{1,2}\d{1,2}[A-Z]?$/.test(typed);
        const outcodes = [
          ...new Set(
            looksLikeOutcode
              ? [typed, ...extractedOutcodes]
              : extractedOutcodes
          ),
        ];
        setPostcodeSuggestions([
          ...outcodes.map((o) => ({ type: "outcode", value: o })),
          ...postcodes.map((p) => ({ type: "postcode", value: p })),
        ]);
      } catch (err) {
        console.error("postcode autocomplete failed", err);
        setPostcodeSuggestions([]);
      } finally {
        setPostcodeLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [postcodeQuery]);

  // Apply a postcode value to both the customer address and reset query
  const applyPostcode = (code) => {
    setCustomer((prev) => ({
      ...prev,
      address: { ...prev.address, PostalCode: code.toUpperCase() },
    }));
    setPostcodeQuery("");
    setPostcodeSuggestions([]);
    setPostcodeFocused(false);
  };

  // ── AUTO FILTER: same endpoint customer page uses ───────────────────────
  // Fires whenever postcode, service, option, date, or time changes.
  useEffect(() => {
    // Reset selection on any input change
    setTherapistId("");

    if (!allSlotInputsReady) {
      setFilteredTherapists([]);
      setHasFilteredOnce(false);
      return;
    }

    const reqId = ++filterReqIdRef.current;
    setFilteringTherapists(true);
    axios
      .post(
        `${apiUrl}/therapist/filter`,
        {
          service: { serviceId, optionIndex: Number(optionIndex) },
          date,
          time,
          postalCode: postcode,
        },
        authHeader
      )
      .then((res) => {
        // Only honour the most recent request
        if (reqId !== filterReqIdRef.current) return;
        setFilteredTherapists(res.data?.therapists || []);
        setHasFilteredOnce(true);
      })
      .catch((err) => {
        if (reqId !== filterReqIdRef.current) return;
        console.error("therapist filter failed", err);
        setFilteredTherapists([]);
        setHasFilteredOnce(true);
      })
      .finally(() => {
        if (reqId === filterReqIdRef.current) setFilteringTherapists(false);
      });
  }, [
    allSlotInputsReady,
    serviceId,
    optionIndex,
    date,
    time,
    postcode,
    apiUrl,
    authHeader,
  ]);

  // ── Customer pick / clear ───────────────────────────────────────────────
  const pickCustomer = (c) => {
    setSelectedCustomer(c);
    setSearchResults([]);
    setPhoneSearch("");
    setCustomer({
      name: `${c.name?.first || ""} ${c.name?.last || ""}`.trim(),
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || { ...initialAddress },
    });
  };
  const clearSelectedCustomer = () => {
    setSelectedCustomer(null);
    setCustomer({
      name: "",
      phone: "",
      email: "",
      address: { ...initialAddress },
    });
  };

  // ── Calendar nav ────────────────────────────────────────────────────────
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((p) => p - 1);
    } else setCurrentMonth((p) => p - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((p) => p + 1);
    } else setCurrentMonth((p) => p + 1);
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!selectedCustomer) {
      if (!customer.name.trim()) return toast.error("Customer name required");
      if (!customer.phone.trim()) return toast.error("Customer phone required");
    }
    if (!postcodeReady) return toast.error("Customer postcode required");
    if (!serviceId) return toast.error("Pick a service");
    if (optionIndex === "") return toast.error("Pick a service option");
    if (!date) return toast.error("Pick a date");
    if (!time) return toast.error("Pick a time");
    if (!therapistId)
      return toast.error("Pick one of the available therapists");

    const channelsArr = Object.entries(linkChannels)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (isCardLink && channelsArr.length === 0)
      return toast.error("Pick at least one delivery channel for the link");

    const payload = {
      existingClientId: selectedCustomer?._id || null,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || undefined,
      address: customer.address,
      therapistId,
      serviceId,
      optionIndex: Number(optionIndex),
      date,
      time,
      notes,
      paymentMode,
      paymentStatus: isCardLink ? "pending" : paymentStatus,
      ...(isCardLink ? { linkChannels: channelsArr } : {}),
    };

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${apiUrl}/admin/booking/manual`,
        payload,
        authHeader
      );
      if (isCardLink) {
        setLastPaymentLink({
          url: res.data?.paymentLink,
          delivery: res.data?.delivery,
          bookingId: res.data?.bookingId,
        });
        toast.success("Payment link sent — booking is pending until paid");
      } else {
        toast.success("Booking confirmed");
        setLastPaymentLink(null);
      }
      // Reset
      setSelectedCustomer(null);
      setCustomer({
        name: "",
        phone: "",
        email: "",
        address: { ...initialAddress },
      });
      setServiceId("");
      setOptionIndex("");
      setDate("");
      setTime("");
      setTherapistId("");
      setNotes("");
      setFilteredTherapists([]);
      setHasFilteredOnce(false);
      setPaymentMode("card-link");
      setPaymentStatus("pending");
      setLinkChannels({ sms: true, whatsapp: false, email: false });
    } catch (err) {
      console.error("manual booking failed", err);
      const msg =
        err.response?.data?.message || err.message || "Booking failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reused styling tokens (match customer page) ─────────────────────────
  const inputCls =
    "w-full bg-[#0d0d0d] text-white text-sm rounded-md border border-gray-700 px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-primary";
  const labelCls = "text-sm text-gray-300 mb-1 flex items-center gap-2";
  const sectionCls =
    "bg-[#111] border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4";
  const stepLabelCls = "text-xs uppercase tracking-wide text-primary";

  // ── Time slot section render (matches customer DateTimePicker) ──────────
  const renderSections = (sections, isPremium = false) => (
    <>
      {Object.entries(sections).map(([label, times]) => (
        <div key={label} className="mb-3">
          <h3 className="text-[11px] sm:text-xs uppercase text-primary mb-2">
            {sectionLabel[label]}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                disabled={isPastTime(t, date)}
                className={`py-1.5 text-xs rounded-full transition flex items-center justify-center
                  ${
                    isPastTime(t, date)
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : time === t
                      ? "bg-primary text-black font-semibold"
                      : "text-primary border border-primary hover:bg-primary hover:text-black"
                  }`}
              >
                {t}
                {isPremium && <FaCrown className="ml-1 text-[10px]" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary">
            Manual Booking
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Same booking flow as customers see — pick area, service, date, time
            and a therapist will be auto-filtered for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ─── Customer ──────────────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon size={18} className="text-primary" />
              Customer
            </h2>

            {!selectedCustomer && (
              <div className="relative">
                <label className={labelCls}>
                  <Search size={14} className="text-primary" />
                  Find existing customer by phone
                </label>
                <input
                  type="text"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  placeholder="Type at least 4 digits…"
                  className={inputCls}
                />
                {searching && (
                  <p className="text-xs text-gray-500 mt-1">Searching…</p>
                )}
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 left-0 right-0 mt-1 bg-[#0d0d0d] border border-gray-700 rounded-md max-h-56 overflow-y-auto shadow-lg">
                    {searchResults.map((c) => (
                      <li
                        key={c._id}
                        onClick={() => pickCustomer(c)}
                        className="px-3 py-2 cursor-pointer hover:bg-primary/20 text-sm border-b border-gray-800 last:border-0"
                      >
                        <div className="text-white">
                          {c.name?.first} {c.name?.last}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {c.phone} {c.email ? `· ${c.email}` : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {selectedCustomer && (
              <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-md px-3 py-2">
                <div>
                  <div className="text-sm text-primary font-medium">
                    Existing customer attached
                  </div>
                  <div className="text-xs text-gray-300">
                    {selectedCustomer.name?.first}{" "}
                    {selectedCustomer.name?.last} · {selectedCustomer.phone}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearSelectedCustomer}
                  className="text-xs text-primary underline hover:text-primary/80"
                >
                  Use different customer
                </button>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  <UserIcon size={14} className="text-primary" /> Name
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  <Phone size={14} className="text-primary" /> Phone
                </label>
                <input
                  type="text"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  <Mail size={14} className="text-primary" /> Email{" "}
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Building / No.</label>
                <input
                  type="text"
                  value={customer.address.Building_No}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: {
                        ...customer.address,
                        Building_No: e.target.value,
                      },
                    })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Street</label>
                <input
                  type="text"
                  value={customer.address.Street}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: { ...customer.address, Street: e.target.value },
                    })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Locality</label>
                <input
                  type="text"
                  value={customer.address.Locality}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: {
                        ...customer.address,
                        Locality: e.target.value,
                      },
                    })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  <MapPin size={14} className="text-primary" /> Postcode
                </label>
                <input
                  type="text"
                  value={customer.address.PostalCode}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: {
                        ...customer.address,
                        PostalCode: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  disabled={!!selectedCustomer}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* ─── Booking flow (matches customer page steps) ───────── */}
          <div className={sectionCls}>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Booking
            </h2>

            {/* Step 1: Postcode (live input with autocomplete) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>
                  <MapPin size={14} className="text-primary" />
                  Customer's postcode / area
                </label>
                <span className={stepLabelCls}>Step 1</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={postcodeQuery || postcode}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    setPostcodeQuery(v);
                    setPostcodeFocused(true);
                    // Live-write into customer address so the booking payload
                    // and re-filter stay in sync as admin types.
                    setCustomer((prev) => ({
                      ...prev,
                      address: { ...prev.address, PostalCode: v },
                    }));
                  }}
                  onFocus={() => setPostcodeFocused(true)}
                  onBlur={() =>
                    // Delay so click on suggestion fires before blur clears it
                    setTimeout(() => setPostcodeFocused(false), 150)
                  }
                  placeholder="Type postcode or area (e.g. NW1 1AA, SW3, HA8)"
                  autoComplete="off"
                  className={inputCls}
                />
                {postcodeFocused && postcodeSuggestions.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 mt-1 bg-[#0d0d0d] border border-gray-700 rounded-md max-h-56 overflow-y-auto shadow-lg">
                    {postcodeSuggestions.map((s, idx) => (
                      <li
                        key={`${s.type}-${s.value}-${idx}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyPostcode(s.value)}
                        className="px-3 py-2 cursor-pointer hover:bg-primary/20 flex items-center justify-between text-sm"
                      >
                        <span>{s.value}</span>
                        {s.type === "outcode" && (
                          <span className="text-[10px] text-primary/70 ml-3 uppercase tracking-wide">
                            Area
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {postcodeFocused && postcodeLoading && (
                  <p className="text-[11px] text-gray-500 mt-1">Searching…</p>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Used to match therapists to the customer's coverage area. Same
                as customer flow.
              </p>
            </div>

            {/* Step 2 + 3: Service + Option */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>Service</label>
                  <span className={stepLabelCls}>Step 2</span>
                </div>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    setOptionIndex("");
                    setDate("");
                    setTime("");
                  }}
                  disabled={!postcodeReady}
                  className={inputCls}
                >
                  <option value="">— pick a service —</option>
                  {servicesList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>Option (duration · price)</label>
                  <span className={stepLabelCls}>Step 3</span>
                </div>
                <select
                  value={optionIndex}
                  onChange={(e) => {
                    setOptionIndex(e.target.value);
                    setDate("");
                    setTime("");
                  }}
                  className={inputCls}
                  disabled={!selectedService}
                >
                  <option value="">— pick an option —</option>
                  {selectedService?.options?.map((o, idx) => (
                    <option key={idx} value={idx}>
                      {o.durationMinutes} min · £{o.price?.amount}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 4 + 5: Date (calendar) + Time (slot grid) */}
            <div
              className={`grid lg:grid-cols-2 gap-4 ${
                !optionIndex && optionIndex !== 0 ? "opacity-60" : ""
              }`}
            >
              {/* Calendar */}
              <div className="bg-[#0d0d0d] p-3 sm:p-4 rounded-xl border border-primary/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className={stepLabelCls}>Step 4 · Date</span>
                    <h3 className="text-base sm:text-lg text-primary font-semibold">
                      {new Date(currentYear, currentMonth).toLocaleString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-primary border border-primary hover:bg-primary hover:text-black transition"
                    >
                      <ArrowLeft size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-primary border border-primary hover:bg-primary hover:text-black transition"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
                <div className="border border-primary/20 p-2 sm:p-3 rounded-xl">
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-primary mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (d) => (
                        <div key={d}>{d}</div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {days.map((d, idx) => {
                      if (!d)
                        return (
                          <div
                            key={idx}
                            className="w-7 h-7 sm:w-8 sm:h-8"
                          />
                        );
                      const fullDate = formatDateForApi(d.fullDate);
                      const isSelected = date === fullDate;
                      const isPast =
                        d.fullDate <
                        new Date(new Date().setHours(0, 0, 0, 0));
                      const optionPicked =
                        !!serviceId && optionIndex !== "";
                      const disabled = isPast || !optionPicked;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            setDate(fullDate);
                            setTime("");
                          }}
                          className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] sm:text-xs transition
                            ${
                              disabled
                                ? "text-gray-600 cursor-not-allowed"
                                : isSelected
                                ? "bg-primary text-black font-semibold"
                                : "text-primary hover:bg-primary hover:text-black"
                            }`}
                        >
                          {d.date}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time slots */}
              <div className="bg-[#0d0d0d] p-3 sm:p-4 rounded-xl border border-primary/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={stepLabelCls}>Step 5 · Time</span>
                    <h3 className="text-base sm:text-lg text-primary font-semibold">
                      {date ? `Selected ${date}` : "Pick a date first"}
                    </h3>
                  </div>
                  <div className="bg-black/40 p-1 rounded-full border border-primary/30 flex">
                    <button
                      type="button"
                      onClick={() => setActiveTab("day")}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                        activeTab === "day"
                          ? "bg-primary text-black font-semibold"
                          : "text-primary"
                      }`}
                    >
                      Day
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("night")}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                        activeTab === "night"
                          ? "bg-primary text-black font-semibold"
                          : "text-primary"
                      }`}
                    >
                      Night (Premium)
                    </button>
                  </div>
                </div>
                <div className={!date ? "opacity-50 pointer-events-none" : ""}>
                  {activeTab === "day" && renderSections(daySections)}
                  {activeTab === "night" && renderSections(nightSections, true)}
                </div>
              </div>
            </div>

            {/* Step 6: Available therapists (auto-loaded) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={stepLabelCls}>
                  Step 6 · Available therapists
                </span>
                {filteringTherapists && (
                  <span className="text-xs text-gray-400">
                    Searching…
                  </span>
                )}
                {!filteringTherapists &&
                  hasFilteredOnce &&
                  filteredTherapists.length > 0 && (
                    <span className="text-xs text-gray-400">
                      ({filteredTherapists.length} match
                      {filteredTherapists.length === 1 ? "" : "es"})
                    </span>
                  )}
              </div>

              {!allSlotInputsReady && (
                <div className="text-xs text-gray-500 bg-[#0d0d0d] border border-gray-800 rounded-md px-3 py-3">
                  Pick a postcode, service, option, date and time to see
                  available therapists.
                </div>
              )}

              {allSlotInputsReady && filteringTherapists && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1, 2, 3].map((k) => (
                    <div
                      key={k}
                      className="h-24 rounded-md border border-gray-800 bg-[#0d0d0d] animate-pulse"
                    />
                  ))}
                </div>
              )}

              {allSlotInputsReady &&
                !filteringTherapists &&
                hasFilteredOnce &&
                filteredTherapists.length === 0 && (
                  <div className="text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md px-3 py-3">
                    No therapists available for this slot. Try a different
                    time, date, or area.
                  </div>
                )}

              {allSlotInputsReady &&
                !filteringTherapists &&
                filteredTherapists.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTherapists.map((t) => {
                      const selected = therapistId === t._id;
                      const rawRating = t?.rating ?? 0;
                      const rating =
                        rawRating === 0 ? "—" : rawRating.toFixed(1);
                      const stars = Math.round(rawRating || 0);
                      return (
                        <button
                          key={t._id}
                          type="button"
                          onClick={() => setTherapistId(t._id)}
                          className={`bg-[#111] text-white rounded-xl border transition-all duration-300 p-4 sm:p-5 flex flex-col items-center gap-3 text-center
                            ${
                              selected
                                ? "border-primary shadow-[0_0_20px_rgba(251,191,36,0.45)] scale-[1.02]"
                                : "border-white/10 hover:border-primary/50"
                            }`}
                        >
                          <div className="relative">
                            <img
                              src={
                                t?.userId?.avatar_url ||
                                "https://via.placeholder.com/80"
                              }
                              alt={t?.title || "Therapist"}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-primary object-cover"
                            />
                            {selected && (
                              <CheckCircle2
                                size={18}
                                className="absolute -top-1 -right-1 text-primary bg-black rounded-full"
                              />
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold leading-tight">
                            {t?.title || "Therapist"}
                          </h3>
                          <p className="text-primary text-[11px] sm:text-xs font-medium -mt-1">
                            Massage Therapist
                          </p>
                          <div className="flex items-center gap-1 text-[11px]">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= stars
                                      ? "text-primary fill-primary"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-300 ml-1">
                              {rating}
                            </span>
                            {t?.experience > 0 && (
                              <span className="text-gray-500 ml-1">
                                · {t.experience}y
                              </span>
                            )}
                          </div>
                          {t?.languages?.length > 0 && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-400">
                              <Globe size={11} />
                              <span className="truncate">
                                {t.languages.join(", ")}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* Selected summary */}
            {selectedOption && therapistId && (
              <div className="bg-[#0d0d0d] border border-gray-800 rounded-md p-3 text-sm text-gray-300">
                Booking:{" "}
                <span className="text-primary">{selectedService?.name}</span> ·{" "}
                {selectedOption.durationMinutes} min · £
                {selectedOption.price?.amount} · {date} {time} · therapist{" "}
                {filteredTherapists.find((t) => t._id === therapistId)?.title ||
                  ""}
              </div>
            )}
          </div>

          {/* ─── Notes ─────────────────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Customer message / notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Paste the customer's SMS message or any internal notes…"
              className={`${inputCls} resize-y`}
            />
          </div>

          {/* ─── Payment ───────────────────────────────────────────── */}
          <div className={sectionCls}>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              Payment
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Payment mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className={inputCls}
                >
                  <option value="card-link">Send payment link (card)</option>
                  <option value="cash">Cash on arrival</option>
                  <option value="external">Already paid (external)</option>
                  <option value="online">Online (mark settled)</option>
                </select>
              </div>
              {!isCardLink && (
                <div>
                  <label className={labelCls}>Payment status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className={inputCls}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              )}
            </div>

            {isCardLink && (
              <div className="mt-2 space-y-3">
                <p className="text-xs text-gray-400">
                  Booking will be saved as{" "}
                  <span className="text-primary">Pending Payment</span> and
                  confirmed automatically once the customer completes payment
                  via the secure Stripe link.
                </p>
                <div>
                  <label className={labelCls}>
                    <LinkIcon size={14} className="text-primary" /> Send link via
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <ChannelChip
                      label="SMS"
                      active={linkChannels.sms}
                      onClick={() => toggleChannel("sms")}
                    />
                    <ChannelChip
                      label="WhatsApp"
                      active={linkChannels.whatsapp}
                      onClick={() => toggleChannel("whatsapp")}
                    />
                    <ChannelChip
                      label="Email"
                      active={linkChannels.email}
                      onClick={() => toggleChannel("email")}
                      disabled={!customer.email && !selectedCustomer?.email}
                      disabledReason="No customer email on file"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Last payment link banner ──────────────────────────── */}
          {lastPaymentLink?.url && (
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2">
                <LinkIcon size={18} className="text-primary" />
                <h2 className="text-lg font-semibold text-primary">
                  Payment link generated
                </h2>
              </div>
              <p className="text-xs text-gray-400">
                Booking ID:{" "}
                <span className="text-gray-200">
                  {lastPaymentLink.bookingId}
                </span>
              </p>
              <div className="flex items-center gap-2 bg-[#0d0d0d] border border-gray-800 rounded-md px-3 py-2 text-xs text-gray-300 overflow-hidden">
                <span className="truncate flex-1">{lastPaymentLink.url}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(lastPaymentLink.url);
                    toast.success("Link copied");
                  }}
                  className="px-2 py-1 rounded bg-primary text-black text-xs font-semibold flex items-center gap-1 hover:bg-primary/90"
                >
                  <Copy size={12} /> Copy
                </button>
                <a
                  href={lastPaymentLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded border border-primary/40 text-primary text-xs hover:bg-primary/10"
                >
                  Open
                </a>
              </div>
              {lastPaymentLink.delivery && (
                <div className="text-xs text-gray-400">
                  {lastPaymentLink.delivery.sent?.length > 0 && (
                    <span className="text-green-400">
                      Sent via: {lastPaymentLink.delivery.sent.join(", ")}.{" "}
                    </span>
                  )}
                  {lastPaymentLink.delivery.skipped?.length > 0 && (
                    <span className="text-yellow-400">
                      Skipped:{" "}
                      {lastPaymentLink.delivery.skipped
                        .map((s) => `${s.channel} (${s.reason})`)
                        .join(", ")}
                      .{" "}
                    </span>
                  )}
                  {lastPaymentLink.delivery.failed?.length > 0 && (
                    <span className="text-red-400">
                      Failed:{" "}
                      {lastPaymentLink.delivery.failed
                        .map((f) => `${f.channel} (${f.error})`)
                        .join(", ")}
                      .
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── Submit ────────────────────────────────────────────── */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 rounded-md font-semibold transition ${
                submitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-black hover:bg-primary/90"
              }`}
            >
              {submitting
                ? isCardLink
                  ? "Sending link…"
                  : "Confirming…"
                : isCardLink
                ? "Send payment link"
                : "Confirm booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualBooking;
