import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CalendarDay from "./CalendarDay";
import CalendarLegend from "./CalendarLegend";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarComponent({
  currentDate,
  setCurrentDate,
  availabilityData,
  openModal,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const dayDate = new Date(year, month, i);
    const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    daysArray.push({
      day: i,
      dateKey,
      slots: availabilityData[dateKey] || [],
      isToday: dateKey === todayKey,
      isPast,
    });
  }

  return (
    <div className="glass-morphism border border-white/10 bg-[#0d0d0d] rounded-xl sm:rounded-2xl p-4 sm:p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="p-1 sm:p-2 rounded-full hover:bg-white/10"
        >
          <FaChevronLeft className="text-sm sm:text-base" />
        </button>
        <h2 className="text-base sm:text-xl font-semibold">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="p-1 sm:p-2 rounded-full hover:bg-white/10"
        >
          <FaChevronRight className="text-sm sm:text-base" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-sm text-gray-400 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {daysArray.map((dayData, idx) =>
          dayData ? (
            <CalendarDay
              key={dayData.dateKey}
              day={dayData.day}
              slots={dayData.slots}
              dateKey={dayData.dateKey}
              openModal={openModal}
              isToday={dayData.isToday}
              isPast={dayData.isPast}
            />
          ) : (
            <div key={`empty-${idx}`} />
          )
        )}
      </div>
      <CalendarLegend />
    </div>
  );
}
