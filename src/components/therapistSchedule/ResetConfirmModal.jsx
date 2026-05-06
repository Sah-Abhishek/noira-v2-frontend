
import React from "react";
import { FaTimes } from "react-icons/fa";

export default function ResetConfirmModal({ isOpen, onClose, onConfirm, monthName, year }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] text-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gold">
          Clear Availability
        </h2>
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to <span className="text-red-400">clear all slots</span> for{" "}
          <span className="font-medium">{monthName} {year}</span>? <br />
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
