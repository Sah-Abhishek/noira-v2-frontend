
// src/components/ConfirmLogoutModal.jsx
import React from "react";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-70 backdrop-blur-sm">
      <div className="bg-[#111111] text-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-white/30">
        {/* Title */}
        <h2 className="text-lg font-semibold text-primary mb-3">
          Confirm Logout
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to log out? You’ll need to log in again to
          access the admin dashboard.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-primary text-black font-medium hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
