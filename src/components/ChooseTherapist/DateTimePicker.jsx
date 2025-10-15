import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import useBookingStore from "../../store/bookingStore";
import { FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "../../store/UserStore";
import toast from "react-hot-toast";

const formatDate = (date) => {
  if (!(date instanceof Date)) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const isPastTime = (timeString, selectedDate) => {
  if (!selectedDate) return false;
  const [hours, minutes] = timeString.split(":").map(Number);
  const slotDate = new Date(selectedDate);
  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate <= new Date();
};

const generateMonthDays = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];

  // ✅ add padding for empty days before the 1st
  const firstDayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }

  while (date.getMonth() === month) {
    days.push({
      date: date.getDate(),
      fullDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    });
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const DateTimePicker = ({ availableTimes = [] }) => {
  const today = new Date();
  const {
    cart,
    date,
    time,
    setDate,
    setTime,
    setHasSearched,
    setTherapists,
    setFindingTherapist,
  } = useBookingStore();

  const [days, setDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("day");
  const therapistSelectionRef = useRef(null);
  const navigate = useNavigate();
  const userjwt = localStorage.getItem("userjwt");
  const { user } = useUserStore();
  const postalCode = sessionStorage.getItem("postalCode") || user?.address?.PostalCode;
  // console.log("This is the postal code: ", postalCode);
  const onUserConfirm = () => {
    setManualTrigger(true);
    handleConfirm(true);
  };


  useEffect(() => {
    setDate(null);
    setTime(null);
  }, []);

  useEffect(() => {
    setDays(generateMonthDays(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  const handleConfirm = async () => {
    if (!cart || !date || !time) return;
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      setFindingTherapist(true);
      setLoading(true);
      const res = await axios.post(`${apiUrl}/therapist/filter`, {
        service: cart,
        date,
        time,
        postalCode: postalCode,
      }, {
        headers: {
          Authorization: `Bearer ${userjwt}`,
        }
      });
      setTherapists(res.data.therapists);
      setHasSearched(true);

      // console.log("This is the length: ", res.data.therapists);
      const therapistsList = res.data?.therapists;

      // if (therapistsList.length === 0) {
      //   toast.error("No therapist found for given date and time and postcode, Try again later");
      // }
      if (res.data.therapists.length > 0) {
        setTimeout(() => {
          therapistSelectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFindingTherapist(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date && time && !loading) {
      handleConfirm();
    }
  }, [date, time]);

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
      "12:00",
    ],
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

  const renderSections = (sections, isPremium = false) => (
    <>
      {Object.entries(sections).map(([label, times]) => (
        <div key={label} className="mb-4">
          <h3 className="text-xs sm:text-sm uppercase text-primary mb-2">
            {label === "morning" && "☀️ Morning"}
            {label === "afternoon" && "🌞 Afternoon"}
            {label === "evening" && "🌙 Evening"}
            {label === "lateNight" && "🌌 Late Night (Premium)"}
            {label === "earlyMorning" && "🌅 Early Morning (Premium)"}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                disabled={isPastTime(t, date)}
                className={`py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition flex items-center justify-center
                  ${isPastTime(t, date)
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : time === t
                      ? "bg-primary text-black font-semibold shadow-[0_0_8px_var(--tw-color-primary)]"
                      : "text-primary border border-primary hover:bg-primary hover:text-black"
                  }`}
              >
                {t} {isPremium && <FaCrown className="ml-1 text-[10px]" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className=" bg-black  text-white font-sans p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="flex items-center flex-col">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all
              inline-flex items-center gap-x-2 mb-4 sm:mb-6 text-white border border-white hover:bg-white hover:text-black hover:scale-105"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
              Select Your Date & Time
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Choose your preferred appointment slot
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* CALENDAR */}
          <div className="bg-[#111] p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-primary/30">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl text-primary font-semibold">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-primary border border-primary hover:bg-primary hover:text-black transition"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-primary border border-primary hover:bg-primary hover:text-black transition"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <div className="border border-primary/20 p-3 sm:p-5 rounded-xl sm:rounded-2xl">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-sm text-primary mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                {days.map((d, idx) => {
                  if (!d) {
                    return <div key={idx} className="w-8 h-8 sm:w-10 sm:h-10" />; // empty placeholder
                  }

                  const fullDate = formatDate(d.fullDate);
                  const isSelected = date === fullDate;
                  const isPast = d.fullDate < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={idx}
                      disabled={isPast}
                      onClick={() => !isPast && setDate(fullDate)}
                      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg text-[11px] sm:text-sm transition
          ${isPast
                          ? "text-gray-600 cursor-not-allowed"
                          : isSelected
                            ? "bg-primary text-black font-semibold shadow-[0_0_8px_var(--tw-color-primary)]"
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

          {/* TIME SLOTS */}
          <div className="bg-[#111] p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-primary/30">
            <h2 className="text-lg sm:text-2xl text-primary mb-3 sm:mb-4 font-semibold">
              Available Time Slots
            </h2>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-lg">
              {date ? `Selected Date: ${date}` : "Please select a date"}
            </p>
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-black/40 p-1 rounded-full border border-primary/30 flex">
                <button
                  onClick={() => setActiveTab("day")}
                  className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === "day"
                    ? "bg-primary text-black font-semibold"
                    : "text-primary"
                    }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setActiveTab("night")}
                  className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === "night"
                    ? "bg-primary text-black font-semibold"
                    : "text-primary"
                    }`}
                >
                  Night (Premium)
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {activeTab === "day" && renderSections(daySections)}
                {activeTab === "night" && renderSections(nightSections, true)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="text-center mt-8 sm:mt-10">
          <p className="text-gray-500 text-xs sm:text-sm">
            Continue to select your preferred wellness professional
          </p>
        </div>

        <div ref={therapistSelectionRef}></div>
      </div>
    </div>
  );
};

export default DateTimePicker;
