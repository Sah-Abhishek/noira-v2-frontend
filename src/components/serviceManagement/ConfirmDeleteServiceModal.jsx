
import React from "react";
import { X } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {



  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#0d0d0d] text-white border border-white/10 rounded-xl shadow-xl w-full max-w-md p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 transition"
          aria-label="Close"
        >
          <X />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Delete Service?
        </h2>

        {/* Modal Description */}
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to delete this service? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-primary text-black font-semibold hover:bg-yellow-400 transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
