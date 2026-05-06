import React from "react";

export default function CalendarDay({ day, dateKey, slots, isToday, isPast, openModal }) {
  // Calculate total hours from slots
  const totalHours = slots.reduce((sum, s) => {
    const [sh, sm] = s.start.split(":").map(Number);
    const [eh, em] = s.end.split(":").map(Number);
    const diff = (eh + em / 60) - (sh + sm / 60); // handles minutes too
    return sum + diff;
  }, 0);

  return (
    <div
      onClick={() => !isPast && openModal(dateKey, slots)}
      className={`calendar-cell relative p-1 sm:p-2 rounded-lg sm:rounded-xl border 
        min-h-[60px] sm:min-h-[100px] transition-all
        ${isPast
          ? "cursor-not-allowed opacity-60 bg-gray-50/10 border-gray-700" // ✅ Past day style (no hover, gray bg)
          : `cursor-pointer hover:border-primary hover:bg-primary/20
                ${isToday
            ? "border-white/30 bg-white/80 hover:text-primary text-black ring-1 ring-gold/30"
            : slots.length === 0
              ? "border-gray-700 bg-red-500/20"
              : totalHours < 9
                ? "border-white/60 border-opacity-50 bg-[#4F709C]"
                : "border-white/60 border-opacity-50 bg-[#144D36]"}
              hover:border-gold hover:bg-gold hover:bg-opacity-10`
        }`}
    >
      <div className="flex flex-col justify-between h-full text-center">
        {/* Day Number */}
        <div
          className={`text-sm sm:text-lg font-semibold mb-1 leading-none
            ${isToday ? "text-gold" : isPast ? "text-gray-500" : "text-white"}`}
        >
          {day}
        </div>

        {/* Slots Info */}
        {!isPast && slots.length > 0 && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Desktop */}
            <div className="text-[8px] sm:text-xs text-gold opacity-80 hidden sm:flex flex-col items-center text-center leading-tight">
              {slots.slice(0, 2).map((s, i) => (
                <span key={i}>{s.start}-{s.end}</span>
              ))}
              {slots.length > 2 && <span>+{slots.length - 2} more</span>}
            </div>

            {/* Mobile */}
            <div className="text-[9px] sm:hidden text-gold opacity-80 font-medium">
              {slots.length} slot{slots.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* Availability Dots */}
        <div className="flex flex-wrap justify-center gap-[2px] mt-1">
          {!isPast && slots.length > 0 && (
            <>
              {/* Mobile */}
              <div className="flex sm:hidden gap-[2px]">
                {Array.from({ length: Math.min(slots.length, 3) }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gold rounded-full opacity-70" />
                ))}
                {slots.length > 3 && (
                  <div className="w-1 h-1 bg-gold rounded-full opacity-40" />
                )}
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex gap-1 flex-wrap justify-center">
                {slots.map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gold rounded-full opacity-70" />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Today indicator */}
        {isToday && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full animate-pulse sm:hidden" />
        )}
      </div>
    </div>
  );
}
