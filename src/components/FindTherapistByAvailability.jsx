import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import useBookingStore from "../store/bookingStore.jsx";
import { FaCrown } from "react-icons/fa";
import StickyCartSummary from "./ChooseTherapist/StickyCartSummary.jsx";

const formatDate = (date) => {
  if (!(date instanceof Date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const generateMonthDays = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];

  // Add empty slots before the first day
  const firstDayIndex = date.getDay(); // 0 = Sun, 1 = Mon, ...
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }

  // Push actual days
  while (date.getMonth() === month) {
    days.push({
      date: date.getDate(),
      fullDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    });
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const FindTherapistByAvailability = () => {
  const today = new Date();
  const { date, time, setDate, setTime, selectedTherapist } = useBookingStore();
  const { cart } = useBookingStore();

  const [days, setDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("day");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState({});
  const [isAbled, setIsAbled] = useState(false);
  const userjwt = localStorage.getItem("userjwt");

  const therapistId = selectedTherapist?._id;

  useEffect(() => {
    setDate(null);
    setTime(null);
  }, []);

  useEffect(() => {
    if (selectedTherapist && date && time) {
      setIsAbled(true);
    } else {
      setIsAbled(false);
    }
  }, [selectedTherapist, date, time]);

  useEffect(() => {
    setDays(generateMonthDays(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.post(
          `${apiUrl}/therapist/availability/${therapistId}`, { cart },
          {
            headers: {
              Authorization: `Bearer ${userjwt}`,
            },
          }
        );
        console.log("This is the response of the availibility: ", res.data);
        const availabilityArray = res.data.availability || [];

        const generateSlots = (startTime, endTime) => {
          const slots = [];
          const [startH, startM] = startTime.split(":").map(Number);
          const [endH, endM] = endTime.split(":").map(Number);

          let current = new Date(0, 0, 0, startH, startM);
          const end = new Date(0, 0, 0, endH, endM);

          while (current <= end) {
            const hh = String(current.getHours()).padStart(2, "0");
            const mm = String(current.getMinutes()).padStart(2, "0");
            slots.push(`${hh}:${mm}`);
            current.setMinutes(current.getMinutes() + 30);
          }
          return slots;
        };

        const availabilityMap = {};
        availabilityArray.forEach((entry) => {
          const date = entry.date.split("T")[0];
          let slots = [];
          entry.blocks.forEach((block) => {
            if (block.isAvailable) {
              slots = slots.concat(
                generateSlots(block.startTime, block.endTime)
              );
            }
          });
          availabilityMap[date] = slots;
        });

        setAvailableDates(Object.keys(availabilityMap));
        setAvailableTimes(availabilityMap);
      } catch (err) {
        console.error("Failed to fetch availability", err);
      }
    };
    if (therapistId) fetchAvailability();
  }, [therapistId]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const daySections = {
    morning: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
    ],
    afternoon: [
      "12:00",
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
    ],
    evening: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"],
  };

  // ✅ One continuous premium section for 23:00–09:00
  const nightSections = {
    eliteHours: [
      "23:00",
      "23:30",
      "00:00",
      "00:30",
      "01:00",
      "01:30",
      "02:00",
      "02:30",
      "03:00",
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
      "09:00",
    ],
  };

  const renderSections = (sections, isPremium = false) => {
    if (!date || !availableTimes[date])
      return (
        <p className="text-gray-500 text-sm md:text-base">
          No times available
        </p>
      );
    return (
      <>
        {Object.entries(sections).map(([label, times]) => {
          const filtered = times.filter((t) =>
            availableTimes[date].includes(t)
          );
          if (filtered.length === 0) return null;
          return (
            <div key={label} className="mb-4 md:mb-6">
              <h3 className="text-xs md:text-sm uppercase text-primary mb-2">
                {label === "morning" && "☀️ Morning"}
                {label === "afternoon" && "🌞 Afternoon"}
                {label === "evening" && "🌙 Evening"}
                {label === "eliteHours" && "👑 Elite Hours (23:00 – 09:00)"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filtered.map((t) => {
                  const [hh, mm] = t.split(":").map(Number);
                  const slotDateTime = new Date(date);
                  slotDateTime.setHours(hh, mm, 0, 0);

                  const now = new Date();
                  const isToday = date === formatDate(now);
                  const isPastTime = isToday && slotDateTime <= now;

                  return (
                    <button
                      key={t}
                      onClick={() => !isPastTime && setTime(t)}
                      disabled={isPastTime}
                      className={`py-2 text-xs md:text-sm rounded-full transition flex items-center justify-center
                        ${isPastTime
                          ? "text-gray-600 border border-gray-600 cursor-not-allowed"
                          : time === t
                            ? "bg-primary text-black font-semibold shadow-[0_0_10px_var(--tw-color-primary)]"
                            : isPremium
                              ? "border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                              : "text-primary border border-primary hover:bg-primary hover:text-black"
                        }`}
                    >
                      {t} {isPremium && <FaCrown className="ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center pt-16 md:pt-20 mb-6 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">
              Select Your Date & Time
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Choose your preferred appointment slot
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Calendar */}
            <div className="bg-[#111] p-4 md:p-6 rounded-2xl border border-primary/30">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl text-primary font-semibold">
                  {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-primary border border-primary hover:bg-primary hover:text-black transition"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-primary border border-primary hover:bg-primary hover:text-black transition"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              <div className="border border-primary/20 p-3 md:p-5 rounded-2xl">
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs md:text-sm text-primary mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d}>{d}</div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                  {days.map((d, idx) => {
                    if (!d) {
                      // Empty slot before the 1st
                      return <div key={idx} className="w-8 h-8 md:w-10 md:h-10" />;
                    }

                    const fullDate = formatDate(d.fullDate);
                    const isSelected = date === fullDate;
                    const isPast = d.fullDate < new Date(new Date().setHours(0, 0, 0, 0));
                    const isAvailable = availableDates.includes(fullDate);

                    return (
                      <button
                        key={idx}
                        disabled={isPast || !isAvailable}
                        onClick={() => !isPast && isAvailable && setDate(fullDate)}
                        className={`
          flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition
          ${isPast || !isAvailable
                            ? "text-gray-600 cursor-not-allowed"
                            : isSelected
                              ? "bg-primary text-black font-semibold shadow-[0_0_15px_var(--tw-color-primary)]"
                              : "text-primary hover:bg-primary hover:text-black"
                          }
        `}
                      >
                        {d.date}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-[#111] p-4 md:p-6 rounded-2xl border border-primary/30">
              <h2 className="text-lg md:text-2xl text-primary mb-3 md:mb-4 font-semibold">
                Available Time Slots
              </h2>
              <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-lg">
                {date ? `Selected Date: ${date}` : "Please select a date"}
              </p>

              {/* Tabs */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="bg-black/40 p-1 rounded-full border border-primary/30 flex">
                  <button
                    onClick={() => setActiveTab("day")}
                    className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === "day"
                      ? "bg-primary text-black font-semibold"
                      : "text-primary"
                      }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setActiveTab("night")}
                    className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === "night"
                      ? "bg-primary text-black font-semibold"
                      : "text-primary"
                      }`}
                  >
                    Night (Premium)
                  </button>
                </div>
              </div>

              {activeTab === "day" && renderSections(daySections)}
              {activeTab === "night" && renderSections(nightSections, true)}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Cart */}
      <div className="sticky bottom-0 left-0 right-0 bg-black">
        <StickyCartSummary isAbled={isAbled} />
      </div>
    </div>
  );
};

export default FindTherapistByAvailability;
