
import React from "react";
import { X } from "lucide-react";

export default function ConfirmDeleteAddressModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#0d0d0d] rounded-2xl shadow-lg p-6 max-w-sm w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-primary mb-3">{title}</h2>
        <p className="text-gray-300 text-sm mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
