import React from "react";

export default function StatusCard({ title, value, icon, footer }) {
  return (
    <div className="bg-[#111] border border-white/10 p-5 rounded-xl shadow-md flex justify-between items-center w-full h-full">
      {/* Left Section */}
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-primary">{value}</h2>
        {footer && <div className="text-sm mt-1">{footer}</div>}
      </div>

      {/* Right Icon */}
      <div className="bg-primary p-3 rounded-lg text-black text-xl">
        {icon}
      </div>
    </div>
  );
}
