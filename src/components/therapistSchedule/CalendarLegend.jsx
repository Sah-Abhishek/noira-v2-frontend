
import React from "react";

export default function CalendarLegend() {
  const items = [
    { color: "bg-red-500/20 border border-red-500/40", label: "No slots available" },
    { color: "bg-[#4F709C] border border-primary/40", label: "Less than 9 hours available" },
    { color: "bg-[#144D36] border border-green-500/40", label: "9+ hours available" },
    { color: "bg-white/80 border border-white/30", label: "Today" },
    { color: "bg-gray-50/10 border border-gray-600/40", label: "Past day (disabled)" },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-sm mt-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-md ${item.color}`} />
          <span className="text-gray-200">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
