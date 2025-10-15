import React from "react";

export default function FancyCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer rounded-lg px-3 py-2 transition-all">
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation(); // 🔥 fix: stops select-one from triggering select-all
          onChange(e);
        }}
        className="hidden"
      />

      {/* Custom checkbox UI */}
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all
          ${checked ? "bg-primary text-black" : "bg-black border border-white/20"}
        `}
      >
        {checked && (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Only render label if provided */}
      {label && <span className="text-sm ml-2">{label}</span>}
    </label>
  );
}
