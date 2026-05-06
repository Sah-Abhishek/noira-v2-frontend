import React from "react";

const StatusCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#111] border border-white/10 w-full min-h-[120px] p-6 rounded-2xl flex justify-between items-center shadow-md hover:shadow-lg transition">
      {/* Left: Title + Value */}
      <div>
        <p className="text-gray-400 text-lg">{title}</p>
        <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
      </div>

      {/* Right: Icon */}
      <div className="p-4 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
        <img src={icon} alt="icon" className="w-8 h-8" />
      </div>
    </div>
  );
};

export default StatusCard;
