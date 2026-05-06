
// src/components/common/DeleteConfirmModal.jsx
import React from "react";

const DeleteSlotmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-80">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Are you sure?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Do you really want to delete this slot? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSlotmModal;
