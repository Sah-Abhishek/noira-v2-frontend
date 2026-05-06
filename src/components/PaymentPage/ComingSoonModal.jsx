import React from "react";

const ComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // hide modal if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Stay tuned! This feature is on its way.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
